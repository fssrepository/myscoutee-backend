package com.raxim.myscoutee.domain.community.service;

import com.raxim.myscoutee.domain.groups.api.BaseGroups;

import com.raxim.myscoutee.domain.accounts.api.ProfileSummary;
import com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates;
import com.raxim.myscoutee.domain.community.document.ServiceFeedback.CounterState;
import com.raxim.myscoutee.domain.community.document.ServiceCase;
import com.raxim.myscoutee.domain.community.document.ServiceFeedback;
import com.raxim.myscoutee.domain.community.document.ServiceOffering;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

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
import com.raxim.myscoutee.domain.accounts.api.ProfileSummaries;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery;
import static com.raxim.myscoutee.domain.groups.api.CommunityAuthority.error;

/** Completion workers create feedback eligibility; reads never synthesize missing eligibility. */
@Service
public class ServiceFeedbackService implements com.raxim.myscoutee.domain.community.api.CaseFeedbackPreparation {
    public static final Set<String> CRITERIA = com.raxim.myscoutee.domain.community.api.CaseFeedbackPreparation.CRITERIA;
    private final MongoTemplate mongo;
    private final ProfileSummaries users;
    private final NotificationDelivery notifications;
    private final MenuCounterUpdates counters;
    public ServiceFeedbackService(MongoTemplate mongo, ProfileSummaries users, NotificationDelivery notifications, MenuCounterUpdates counters) {
        this.mongo=mongo; this.users=users; this.notifications=notifications; this.counters=counters;
    }
    public record Item(ServiceFeedback feedback, String providerName, String reviewerName, String serviceTitle, String serviceImageUrl) {}
    public record Command(String userId, String action, Map<String,Double> criteria, String comment) {}
    public record Stats(long count, double average, Map<String,Double> criteria) {}

    @org.springframework.beans.factory.annotation.Autowired
    private tools.jackson.databind.ObjectMapper objectMapper;
    @Override public int prepareSnapshot(String snapshot) { return prepare(objectMapper.readValue(snapshot, ServiceCase.class)); }

    public int prepare(ServiceCase closed) {
        int count=0;
        var reviewers=closed.activeParticipantAccountIds().stream().filter(id -> !closed.support().stream().anyMatch(s -> s.accountId().equals(id))
                || closed.audienceAccountIds().contains(id) || id.equals(closed.ownerAccountId())).toList();
        var profiles=users.findByWorkspaceGroupIdAndAccountUserIdIn(BaseGroups.COMMUNITY_BASE_ID,reviewers);
        var profileIds=profiles.stream().collect(Collectors.groupingBy(ProfileSummary::getAccountUserId,Collectors.mapping(ProfileSummary::getUserId,Collectors.toList())));
        var active=new HashSet<>(closed.activeParticipantAccountIds());
        for (var provider : closed.support()) {
            if (!"accepted".equals(provider.status()) || !active.contains(provider.accountId())) continue;
            for (String viewer : reviewers) {
                if (viewer.equals(provider.accountId())) continue;
                String id=UUID.nameUUIDFromBytes((closed.id()+"\0"+provider.accountId()+"\0"+viewer).getBytes(StandardCharsets.UTF_8)).toString();
                var update=new Update().setOnInsert("baseGroupId",BaseGroups.COMMUNITY_BASE_ID)
                    .setOnInsert("caseId",closed.id()).setOnInsert("caseTitle",closed.title()).setOnInsert("serviceId",provider.serviceId())
                    .setOnInsert("providerAccountId",provider.accountId()).setOnInsert("viewerAccountId",viewer)
                    .setOnInsert("status","pending").setOnInsert("criteria",Map.of()).setOnInsert("comment","")
                    .setOnInsert("createdAtIso",closed.updatedAtIso())
                    .setOnInsert("counterState", counterState(id, viewer, provider.accountId(), "pending", null, profileIds.getOrDefault(viewer,List.of())));
                if (mongo.upsert(Query.query(Criteria.where("_id").is(id)),update,ServiceFeedback.class).getUpsertedId()!=null) count++;
                finishCounters(mongo.findById(id, ServiceFeedback.class));
                notifyOnce(id,"service-feedback-ready",profileIds.getOrDefault(viewer,List.of()),closed.title(),closed.id());
            }
        }
        return count;
    }
    public Page<Item> page(String actor,String bucket,int pageSize,String cursor) {
        if (!Set.of("pending","feedbacked","removed","received").contains(bucket)) throw error(HttpStatus.BAD_REQUEST);
        int page=CommunityCasesService.page(cursor),size=Math.max(1,Math.min(50,pageSize));
        Criteria scope=Criteria.where("baseGroupId").is(BaseGroups.COMMUNITY_BASE_ID)
            .and("received".equals(bucket)?"providerAccountId":"viewerAccountId").is(actor)
            .and("status").is("received".equals(bucket)?"feedbacked":bucket);
        var rows=mongo.find(Query.query(scope).with(Sort.by(Sort.Order.desc("createdAtIso"),Sort.Order.asc("id"))).skip((long)page*size).limit(size),ServiceFeedback.class);
        var ids=rows.stream().flatMap(r->java.util.stream.Stream.of(r.viewerAccountId(),r.providerAccountId())).collect(Collectors.toSet());
        ids.add(actor);
        var profiles=users.findByUserIdIn(ids);
        var names=profiles.stream().collect(Collectors.toMap(ProfileSummary::getUserId,u->Objects.toString(u.getName(),"")));
        var stored=profiles.stream().filter(u->actor.equals(u.getUserId())).findFirst().map(ProfileSummary::getMenuCounters).orElse(Map.of());
        var serviceIds=rows.stream().map(ServiceFeedback::serviceId).filter(Objects::nonNull).distinct().toList();
        var offerings=serviceIds.isEmpty() ? Map.<String,ServiceOffering>of() : mongo.find(Query.query(
            Criteria.where("_id").in(serviceIds).and("baseGroupId").is(BaseGroups.COMMUNITY_BASE_ID)
                .orOperator(Criteria.where("status").is("published"), Criteria.where("ownerAccountId").is(actor), Criteria.where("staffAccountIds").is(actor))),
            ServiceOffering.class).stream().collect(Collectors.toMap(ServiceOffering::id,s->s));
        Map<String,Long> context=new LinkedHashMap<>();
        for(String key:List.of("pending","feedbacked","removed","received")) context.put(key,stored.getOrDefault("serviceFeedback_"+key,0).longValue());
        long total=context.get(bucket);
        return new Page<>(rows.stream().map(r->{
            var offering=r.serviceId()==null?null:offerings.get(r.serviceId());
            return new Item(r,names.getOrDefault(r.providerAccountId(),""),names.getOrDefault(r.viewerAccountId(),""),
                offering==null?null:offering.title(), offering==null || offering.imageUrls()==null || offering.imageUrls().isEmpty()?null:offering.imageUrls().get(0));
        }).toList(),total,
            (long)(page+1)*size<total?Integer.toString(page+1):null,context);
    }
    public void action(String actor,String id,Command command) {
        ServiceFeedback row=mongo.findById(id,ServiceFeedback.class);
        if(row==null || !BaseGroups.COMMUNITY_BASE_ID.equals(row.baseGroupId()) || !actor.equals(row.viewerAccountId())) throw error(HttpStatus.NOT_FOUND);
        row=initializeCounters(row);
        finishCounters(row);
        var query=Query.query(Criteria.where("_id").is(id).and("status").is(row.status())
                .and("counterState.revision").is(row.counterState().revision()));
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
        String nextStatus="submit".equals(command.action())?"feedbacked":"remove".equals(command.action())?"removed":"pending";
        update.set("counterState",counterState(id,row.viewerAccountId(),row.providerAccountId(),nextStatus,row.counterState(),row.counterState().reviewerProfileIds()));
        var saved=mongo.findAndModify(query,update,org.springframework.data.mongodb.core.FindAndModifyOptions.options().returnNew(true),ServiceFeedback.class);
        if(saved==null) throw error(HttpStatus.CONFLICT);
        finishCounters(saved);
        if("submit".equals(command.action())) notifyOnce(id,"service-feedback-submitted",row.providerAccountId(),row.caseTitle(),row.caseId());
    }
    public static void validate(Map<String,Double> criteria,String comment) {
        if(criteria==null || !criteria.keySet().equals(CRITERIA) || criteria.values().stream().anyMatch(v->v==null || !Double.isFinite(v) || v<1 || v>10 || v!=Math.rint(v))
            || comment==null || comment.length()>160) throw error(HttpStatus.BAD_REQUEST);
    }
    public Stats stats(String provider) {
        var match=org.springframework.data.mongodb.core.aggregation.Aggregation.match(Criteria.where("baseGroupId").is(BaseGroups.COMMUNITY_BASE_ID).and("providerAccountId").is(provider).and("status").is("feedbacked"));
        var group=org.springframework.data.mongodb.core.aggregation.Aggregation.group().count().as("count").avg("average").as("average");
        for(String key:CRITERIA) group=group.avg("criteria."+key).as(key);
        var row=mongo.aggregate(org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation(match,group),"serviceFeedback",org.bson.Document.class).getUniqueMappedResult();
        if(row==null) return new Stats(0,0,Map.of());
        Map<String,Double> values=new LinkedHashMap<>(); for(String key:CRITERIA)values.put(key,((Number)row.get(key)).doubleValue());
        return new Stats(((Number)row.get("count")).longValue(),((Number)row.get("average")).doubleValue(),values);
    }
    private CounterState counterState(String id, String viewer, String provider, String status, CounterState before, List<String> profileIds) {
        long revision=before==null?1:before.revision()+1;
        String previous=before==null?null:before.status();
        String source="serviceFeedback-"+org.springframework.util.DigestUtils.md5DigestAsHex(id.getBytes(StandardCharsets.UTF_8));
        var pending=new ArrayList<MenuCounterUpdates.Change>();
        Map<String,Integer> buckets=new LinkedHashMap<>();
        if(previous!=null)buckets.put("serviceFeedback_"+previous,-1);
        buckets.merge("serviceFeedback_"+status,1,Integer::sum);
        pending.add(new MenuCounterUpdates.Change(viewer,null,source,revision,Map.copyOf(buckets)));
        pending.add(new MenuCounterUpdates.Change(provider,null,source,revision,Map.of("serviceFeedback_received",
                ("feedbacked".equals(status)?1:0)-("feedbacked".equals(previous)?1:0))));
        int delta=("pending".equals(status)?1:0)-("pending".equals(previous)?1:0);
        for(String profileId:profileIds)pending.add(new MenuCounterUpdates.Change(profileId,BaseGroups.COMMUNITY_BASE_ID,source,revision,Map.of("feedback",delta)));
        return new CounterState(revision,status,List.copyOf(profileIds),List.copyOf(pending));
    }
    private ServiceFeedback initializeCounters(ServiceFeedback row) {
        if(row.counterState()!=null)return row;
        var profiles=users.findByWorkspaceGroupIdAndAccountUserIdIn(BaseGroups.COMMUNITY_BASE_ID,List.of(row.viewerAccountId()))
                .stream().map(ProfileSummary::getUserId).toList();
        var state=counterState(row.id(),row.viewerAccountId(),row.providerAccountId(),row.status(),null,profiles);
        var saved=mongo.findAndModify(Query.query(Criteria.where("_id").is(row.id()).and("status").is(row.status()).and("counterState").is(null)),
                new Update().set("counterState",state),org.springframework.data.mongodb.core.FindAndModifyOptions.options().returnNew(true),ServiceFeedback.class);
        return saved==null?mongo.findById(row.id(),ServiceFeedback.class):saved;
    }
    private void finishCounters(ServiceFeedback row) {
        if(row==null || row.counterState()==null || row.counterState().pending().isEmpty())return;
        var pending=row.counterState().pending();
        for(int start=0;start<pending.size();start+=100)counters.applyAll(pending.subList(start,Math.min(start+100,pending.size())));
        mongo.updateFirst(Query.query(Criteria.where("_id").is(row.id()).and("counterState.revision").is(row.counterState().revision())
                .and("counterState.pending").is(pending)),new Update().set("counterState.pending",List.of()),ServiceFeedback.class);
    }
    @org.springframework.beans.factory.annotation.Autowired
    void watchCounters(com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService changes) {
        changes.watch("ServiceFeedbackCounters",Set.of("serviceFeedback"),Set.of("counterState"),()->{
            var query=Query.query(Criteria.where("baseGroupId").is(BaseGroups.COMMUNITY_BASE_ID).orOperator(
                    Criteria.where("counterState").is(null),Criteria.where("counterState.pending.0").exists(true)));
            for(var row:mongo.find(query.limit(20),ServiceFeedback.class))finishCounters(initializeCounters(row));
            return mongo.exists(query,ServiceFeedback.class)?Instant.now().plusSeconds(10):null;
        });
    }
    private void notifyOnce(String id,String kind,String actor,String title,String caseId) {
        var recipients=users.findByWorkspaceGroupIdAndAccountUserIdIn(BaseGroups.COMMUNITY_BASE_ID,List.of(actor)).stream().map(ProfileSummary::getUserId).toList();
        notifyOnce(id,kind,recipients,title,caseId);
    }
    private void notifyOnce(String id,String kind,List<String> recipients,String title,String caseId) {
        if(recipients.isEmpty())return;
        JobGroupContext.run(BaseGroups.COMMUNITY_BASE_ID,()->notifications.enqueueOnce(kind+":"+id,new NotificationDelivery.NotificationIntent(kind,"service-feedback",id,"participant",recipients,title,title,
            "/game?serviceFeedback=true&workspaceGroupId="+BaseGroups.COMMUNITY_BASE_ID,null,null,"service-feedback:"+id,Map.of("workspaceGroupId",BaseGroups.COMMUNITY_BASE_ID,"caseId",caseId,"notification_message_key","notification.kind."+kind+".message"),null)));
    }
}
