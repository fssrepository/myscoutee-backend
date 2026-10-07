package com.raxim.myscoutee.domain.community.service;

import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.service.UserActivityCountersService;
import com.raxim.myscoutee.domain.community.document.ServiceCase;
import com.raxim.myscoutee.domain.community.document.ServiceFeedback;
import com.raxim.myscoutee.domain.community.document.ServiceOffering;
import com.raxim.myscoutee.domain.groups.document.CommunityGroup;
import com.raxim.myscoutee.domain.platform.service.JobGroupContext;

import java.time.Instant;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;

import com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.Page;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.notifications.service.NotificationOutboxService;
import static com.raxim.myscoutee.domain.groups.service.CommunityAccessService.error;

/** Completion workers create feedback eligibility; reads never synthesize missing eligibility. */
@Service
public class ServiceFeedbackService {
    public static final Set<String> CRITERIA = Set.of("quality", "reliability", "communication", "value");
    private final MongoTemplate mongo;
    private final UsersRepository users;
    private final NotificationOutboxService notifications;
    private final UserActivityCountersService counters;
    public ServiceFeedbackService(MongoTemplate mongo, UsersRepository users, NotificationOutboxService notifications, UserActivityCountersService counters) {
        this.mongo=mongo; this.users=users; this.notifications=notifications; this.counters=counters;
    }
    public record Item(ServiceFeedback feedback, String providerName, String reviewerName, String serviceTitle, String serviceImageUrl) {}
    public record Command(String userId, String action, Map<String,Double> criteria, String comment) {}
    public record Stats(long count, double average, Map<String,Double> criteria) {}

    public int prepare(ServiceCase closed) {
        int count=0;
        var reviewers=closed.activeParticipantAccountIds().stream().filter(id -> !closed.support().stream().anyMatch(s -> s.accountId().equals(id))
                || closed.audienceAccountIds().contains(id) || id.equals(closed.ownerAccountId())).toList();
        var profiles=users.findByWorkspaceGroupIdAndAccountUserIdIn(CommunityGroup.COMMUNITY_BASE_ID,reviewers);
        var profileIds=profiles.stream().collect(Collectors.groupingBy(Users::getAccountUserId,Collectors.mapping(Users::getUserId,Collectors.toList())));
        var active=new HashSet<>(closed.activeParticipantAccountIds());
        var touched=new HashSet<String>();
        for (var provider : closed.support()) {
            if (!"accepted".equals(provider.status()) || !active.contains(provider.accountId())) continue;
            for (String viewer : reviewers) {
                if (viewer.equals(provider.accountId())) continue;
                String id=UUID.nameUUIDFromBytes((closed.id()+"\0"+provider.accountId()+"\0"+viewer).getBytes(StandardCharsets.UTF_8)).toString();
                var update=new Update().setOnInsert("baseGroupId",CommunityGroup.COMMUNITY_BASE_ID)
                    .setOnInsert("caseId",closed.id()).setOnInsert("caseTitle",closed.title()).setOnInsert("serviceId",provider.serviceId())
                    .setOnInsert("providerAccountId",provider.accountId()).setOnInsert("viewerAccountId",viewer)
                    .setOnInsert("status","pending").setOnInsert("criteria",Map.of()).setOnInsert("comment","")
                    .setOnInsert("createdAtIso",closed.updatedAtIso());
                if (mongo.upsert(Query.query(Criteria.where("_id").is(id)),update,ServiceFeedback.class).getUpsertedId()!=null) count++;
                touched.add(viewer);
                notifyOnce(id,"service-feedback-ready",profileIds.getOrDefault(viewer,List.of()),closed.title(),closed.id());
            }
        }
        var aggregation=org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation(
            org.springframework.data.mongodb.core.aggregation.Aggregation.match(Criteria.where("baseGroupId").is(CommunityGroup.COMMUNITY_BASE_ID).and("viewerAccountId").in(touched).and("status").is("pending")),
            org.springframework.data.mongodb.core.aggregation.Aggregation.group("viewerAccountId").count().as("count"));
        var pending=mongo.aggregate(aggregation,"serviceFeedback",org.bson.Document.class).getMappedResults().stream()
            .collect(Collectors.toMap(r->r.getString("_id"),r->((Number)r.get("count")).intValue()));
        for(var profile:profiles)counters.updateServiceFeedbackPending(profile.getUserId(),pending.getOrDefault(profile.getAccountUserId(),0));
        return count;
    }
    public Page<Item> page(String actor,String bucket,int pageSize,String cursor) {
        if (!Set.of("pending","feedbacked","removed","received").contains(bucket)) throw error(HttpStatus.BAD_REQUEST);
        int page=CommunityCasesService.page(cursor),size=Math.max(1,Math.min(50,pageSize));
        Criteria scope=Criteria.where("baseGroupId").is(CommunityGroup.COMMUNITY_BASE_ID)
            .and("received".equals(bucket)?"providerAccountId":"viewerAccountId").is(actor)
            .and("status").is("received".equals(bucket)?"feedbacked":bucket);
        long total=mongo.count(Query.query(scope),ServiceFeedback.class);
        var rows=mongo.find(Query.query(scope).with(Sort.by(Sort.Order.desc("createdAtIso"),Sort.Order.asc("id"))).skip((long)page*size).limit(size),ServiceFeedback.class);
        var ids=rows.stream().flatMap(r->java.util.stream.Stream.of(r.viewerAccountId(),r.providerAccountId())).collect(Collectors.toSet());
        var names=users.findByUserIdIn(ids).stream().collect(Collectors.toMap(Users::getUserId,u->Objects.toString(u.getName(),"")));
        var serviceIds=rows.stream().map(ServiceFeedback::serviceId).filter(Objects::nonNull).distinct().toList();
        var offerings=serviceIds.isEmpty() ? Map.<String,ServiceOffering>of() : mongo.find(Query.query(
            Criteria.where("_id").in(serviceIds).and("baseGroupId").is(CommunityGroup.COMMUNITY_BASE_ID)
                .orOperator(Criteria.where("status").is("published"), Criteria.where("ownerAccountId").is(actor), Criteria.where("staffAccountIds").is(actor))),
            ServiceOffering.class).stream().collect(Collectors.toMap(ServiceOffering::id,s->s));
        Map<String,Long> context=new LinkedHashMap<>();
        for(String key:List.of("pending","feedbacked","removed","received")) context.put(key,mongo.count(Query.query(Criteria.where("baseGroupId").is(CommunityGroup.COMMUNITY_BASE_ID)
            .and("received".equals(key)?"providerAccountId":"viewerAccountId").is(actor).and("status").is("received".equals(key)?"feedbacked":key)),ServiceFeedback.class));
        return new Page<>(rows.stream().map(r->{
            var offering=r.serviceId()==null?null:offerings.get(r.serviceId());
            return new Item(r,names.getOrDefault(r.providerAccountId(),""),names.getOrDefault(r.viewerAccountId(),""),
                offering==null?null:offering.title(), offering==null || offering.imageUrls()==null || offering.imageUrls().isEmpty()?null:offering.imageUrls().get(0));
        }).toList(),total,
            (long)(page+1)*size<total?Integer.toString(page+1):null,context);
    }
    public void action(String actor,String id,Command command) {
        ServiceFeedback row=mongo.findById(id,ServiceFeedback.class);
        if(row==null || !CommunityGroup.COMMUNITY_BASE_ID.equals(row.baseGroupId()) || !actor.equals(row.viewerAccountId())) throw error(HttpStatus.NOT_FOUND);
        var query=Query.query(Criteria.where("_id").is(id).and("status").is(row.status()));
        Update update;
        if("submit".equals(command.action())) {
            if(!"pending".equals(row.status())) throw error(HttpStatus.CONFLICT);
            validate(command.criteria(),command.comment());
            double average=command.criteria().values().stream().mapToDouble(Double::doubleValue).average().orElseThrow();
            update=new Update().set("status","feedbacked").set("criteria",command.criteria()).set("average",average)
                .set("comment",command.comment().trim()).set("submittedAtIso",Instant.now().toString());
        } else if("remove".equals(command.action()) && "pending".equals(row.status())) update=new Update().set("status","removed");
        else if("restore".equals(command.action()) && "removed".equals(row.status())) update=new Update().set("status","pending");
        else throw error(HttpStatus.CONFLICT);
        if(mongo.updateFirst(query,update,ServiceFeedback.class).getModifiedCount()!=1) throw error(HttpStatus.CONFLICT);
        refreshCounter(actor);
        if("submit".equals(command.action())) notifyOnce(id,"service-feedback-submitted",row.providerAccountId(),row.caseTitle(),row.caseId());
    }
    public static void validate(Map<String,Double> criteria,String comment) {
        if(criteria==null || !criteria.keySet().equals(CRITERIA) || criteria.values().stream().anyMatch(v->v==null || !Double.isFinite(v) || v<1 || v>10 || v!=Math.rint(v))
            || comment==null || comment.length()>160) throw error(HttpStatus.BAD_REQUEST);
    }
    public Stats stats(String provider) {
        var match=org.springframework.data.mongodb.core.aggregation.Aggregation.match(Criteria.where("baseGroupId").is(CommunityGroup.COMMUNITY_BASE_ID).and("providerAccountId").is(provider).and("status").is("feedbacked"));
        var group=org.springframework.data.mongodb.core.aggregation.Aggregation.group().count().as("count").avg("average").as("average");
        for(String key:CRITERIA) group=group.avg("criteria."+key).as(key);
        var row=mongo.aggregate(org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation(match,group),"serviceFeedback",org.bson.Document.class).getUniqueMappedResult();
        if(row==null) return new Stats(0,0,Map.of());
        Map<String,Double> values=new LinkedHashMap<>(); for(String key:CRITERIA)values.put(key,((Number)row.get(key)).doubleValue());
        return new Stats(((Number)row.get("count")).longValue(),((Number)row.get("average")).doubleValue(),values);
    }
    private void refreshCounter(String actor) {
        int count=(int)mongo.count(Query.query(Criteria.where("baseGroupId").is(CommunityGroup.COMMUNITY_BASE_ID).and("viewerAccountId").is(actor).and("status").is("pending")),ServiceFeedback.class);
        for(var profile:users.findByWorkspaceGroupIdAndAccountUserIdIn(CommunityGroup.COMMUNITY_BASE_ID,List.of(actor))) counters.updateServiceFeedbackPending(profile.getUserId(),count);
    }
    private void notifyOnce(String id,String kind,String actor,String title,String caseId) {
        var recipients=users.findByWorkspaceGroupIdAndAccountUserIdIn(CommunityGroup.COMMUNITY_BASE_ID,List.of(actor)).stream().map(Users::getUserId).toList();
        notifyOnce(id,kind,recipients,title,caseId);
    }
    private void notifyOnce(String id,String kind,List<String> recipients,String title,String caseId) {
        if(recipients.isEmpty())return;
        JobGroupContext.run(CommunityGroup.COMMUNITY_BASE_ID,()->notifications.enqueueOnce(kind+":"+id,new NotificationOutboxService.NotificationIntent(kind,"service-feedback",id,"participant",recipients,title,title,
            "/game?serviceFeedback=true&workspaceGroupId="+CommunityGroup.COMMUNITY_BASE_ID,null,null,"service-feedback:"+id,Map.of("workspaceGroupId",CommunityGroup.COMMUNITY_BASE_ID,"caseId",caseId,"notification_message_key","notification.kind."+kind+".message"),null)));
    }
}
