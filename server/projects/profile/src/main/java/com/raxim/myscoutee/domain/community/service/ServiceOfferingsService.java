package com.raxim.myscoutee.domain.community.service;

import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.affinity.document.UserRate;
import com.raxim.myscoutee.domain.affinity.repository.UserRatesRepository;
import com.raxim.myscoutee.domain.community.document.ServiceOffering;
import com.raxim.myscoutee.domain.community.repository.ServiceOfferingsRepository;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.groups.document.CommunityGroup;
import com.raxim.myscoutee.domain.groups.service.CommunityAccessService;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;

import com.raxim.myscoutee.domain.community.dto.ServiceOfferingDtos.*;
import com.raxim.myscoutee.domain.community.dto.CommunityAnnouncementDtos.Page;

import com.raxim.myscoutee.domain.accounts.api.ProfileDistances;
import static com.raxim.myscoutee.domain.groups.service.CommunityAccessService.error;

@Service
public class ServiceOfferingsService {
    public static final List<String> CATEGORIES = List.of("maintenance", "plumbing", "electrical", "cleaning", "renovation", "fitness", "education", "other");
    public static final List<String> FREQUENCIES = List.of("One-time", "Daily", "Weekly", "Bi-weekly", "Monthly", "Yearly");
    private final ServiceOfferingsRepository services;
    private final CommunityAccessService access;
    private final UsersRepository users;
    private final UserRatesRepository rates;
    private final ActivityMembersRepository members;
    public ServiceOfferingsService(ServiceOfferingsRepository services, CommunityAccessService access, UsersRepository users, UserRatesRepository rates, ActivityMembersRepository members) {
        this.services=services;this.access=access;this.users=users;this.rates=rates;this.members=members;
    }
    public String actor(String userId) {return access.actor(userId);}
    public String profileId(String account) {return "group:"+CommunityGroup.COMMUNITY_BASE_ID+":"+account;}
    public ServiceOffering visible(String actor,String id) {
        var s=services.findById(id).orElseThrow(()->error(HttpStatus.NOT_FOUND));
        if (!CommunityGroup.COMMUNITY_BASE_ID.equals(s.baseGroupId()) || !s.ownerAccountId().equals(actor) && !"published".equals(s.status())) throw error(HttpStatus.NOT_FOUND);
        return s;
    }
    private Users profile(String account) {return users.findByUserId(profileId(account)).orElseThrow(()->error(HttpStatus.NOT_FOUND));}
    public Item detail(String actor,String id) {var s=visible(actor,id);return dto(actor,s,profile(s.ownerAccountId()),profile(actor),ratingByOwner(actor));}
    public Page<Item> page(String actor,String scope,String status,String category,String search,Double distance,int pageSize,String cursor) {
        return page(actor,scope,status,category,search,distance,pageSize,cursor,null);
    }
    public Page<Item> page(String actor,String scope,String status,String category,String search,Double distance,int pageSize,String cursor,List<String> serviceIds) {
        if(serviceIds!=null&&serviceIds.size()>100)throw error(HttpStatus.BAD_REQUEST);
        var ids=serviceIds==null?null:new HashSet<>(serviceIds);
        boolean own="own".equals(scope);
        if (!Set.of("own","discover","all").contains(scope) || !Set.of("draft","published","trash").contains(status)
            || distance!=null && (!Double.isFinite(distance)||distance<1||distance>20000)) throw error(HttpStatus.BAD_REQUEST);
        var records=own?services.findByBaseGroupIdAndOwnerAccountIdAndStatus(CommunityGroup.COMMUNITY_BASE_ID,actor,status)
            :services.findByBaseGroupIdAndStatus(CommunityGroup.COMMUNITY_BASE_ID,"published");
        String needle=search==null?"":search.trim().toLowerCase(Locale.ROOT);
        records=records.stream().filter(s->ids==null||ids.contains(s.id())).filter(s->!"discover".equals(scope)||!actor.equals(s.ownerAccountId()))
            .filter(s->category==null||category.isBlank()||category.equals(s.category()))
            .filter(s->needle.isEmpty()||(s.title()+"\n"+s.description()).toLowerCase(Locale.ROOT).contains(needle)).toList();
        var ownerIds=records.stream().map(ServiceOffering::ownerAccountId).distinct().toList();
        var owners=users.findByWorkspaceGroupIdAndAccountUserIdIn(CommunityGroup.COMMUNITY_BASE_ID,ownerIds).stream()
            .filter(u->!Set.of("inactive","blocked","deleted").contains(Objects.toString(u.getProfileStatus(),"")))
            .collect(Collectors.toMap(Users::getAccountUserId,u->u));
        var viewer=profile(actor);var ratings=ratingByOwner(actor);
        var rows=records.stream().filter(s->owners.containsKey(s.ownerAccountId())).map(s->dto(actor,s,owners.get(s.ownerAccountId()),viewer,ratings))
            .filter(s->distance==null||s.distanceKm()!=null&&s.distanceKm()<=distance)
            .filter(s->!"discover".equals(scope)||(s.service().maxDistanceKm()==null||s.distanceKm()!=null&&s.distanceKm()<=s.service().maxDistanceKm())
                &&(s.service().languages().isEmpty()||viewer.getLanguages()!=null&&s.service().languages().stream().anyMatch(viewer.getLanguages()::contains)))
            .sorted(own?Comparator.comparing((Item i)->i.service().updatedAtIso()).reversed().thenComparing(i->i.service().id())
                :Comparator.comparing(Item::distanceKm,Comparator.nullsLast(Comparator.naturalOrder())).thenComparing(i->i.service().id())).toList();
        int page=CommunityCasesService.page(cursor),size=Math.max(1,Math.min(50,pageSize)),start=(int)Math.min((long)page*size,rows.size()),end=Math.min(start+size,rows.size());
        return new Page<>(rows.subList(start,end),rows.size(),end<rows.size()?""+(page+1):null);
    }
    private Map<String,Double> ratingByOwner(String actor) {
        return rates.findByOwnerUserId(profileId(actor)).stream().filter(r->r.getCampaignId()==null&&r.getScoreGiven()!=null)
            .collect(Collectors.toMap(UserRate::getRelatedUserId,UserRate::getScoreGiven,(a,b)->b));
    }
    private Item dto(String actor,ServiceOffering s,Users owner,Users viewer,Map<String,Double> ratings) {
        if(!s.ownerAccountId().equals(actor)&&Set.of("inactive","blocked","deleted").contains(Objects.toString(owner.getProfileStatus(),"")))throw error(HttpStatus.NOT_FOUND);
        return new Item(s,owner.getUserId(),owner.getName(),owner.getImages()==null||owner.getImages().isEmpty()?null:owner.getImages().getFirst(),
            ProfileDistances.distance(owner,viewer),ratings.getOrDefault(owner.getUserId(),0d),s.ownerAccountId().equals(actor));
    }
    public Item save(String actor,Save r) {
        validate(actor,r);var old=r.id()==null?null:visible(actor,r.id());
        if(old!=null&&(!actor.equals(old.ownerAccountId())||"trash".equals(old.status())))throw error(HttpStatus.FORBIDDEN);
        if(old!=null&&!Objects.equals(old.version(),r.version()))throw error(HttpStatus.CONFLICT);
        if (r.imageUrls().stream().anyMatch(url -> !com.raxim.myscoutee.domain.media.api.MediaAccessPaths.ownedImageReference(url, profileId(actor)))) throw error(HttpStatus.BAD_REQUEST);
        String now=Instant.now().toString();
        var s=persist(new ServiceOffering(old==null?UUID.randomUUID().toString():old.id(),CommunityGroup.COMMUNITY_BASE_ID,actor,
            r.title().trim(),r.description().trim(),r.category(),List.copyOf(r.imageUrls()),r.maxDistanceKm(),r.languages().stream().distinct().toList(),r.staffAccountIds().stream().distinct().toList(),
            r.slotsEnabled(),r.slotsEnabled()?Instant.parse(r.startAtIso()).toString():null,r.slotsEnabled()?Instant.parse(r.endAtIso()).toString():null,r.frequency(),r.durationMinutes(),List.copyOf(r.slotTemplates()),r.pricing(),
            old==null?"draft":old.status(),old==null?now:old.createdAtIso(),now,old==null?null:old.version(),Objects.toString(r.sourceLink(), "").trim()));
        return dto(actor,s,profile(actor),profile(actor),Map.of());
    }
    public Item action(String actor,String id,Command r) {
        var s=visible(actor,id);if(!s.ownerAccountId().equals(actor))throw error(HttpStatus.FORBIDDEN);
        if(!Objects.equals(s.version(),r.version()))throw error(HttpStatus.CONFLICT);
        String status=switch(Objects.toString(r.action(),"")) {
            case "publish" -> "draft".equals(s.status())?"published":null;
            case "unpublish" -> "published".equals(s.status())?"draft":null;
            case "trash" -> !"trash".equals(s.status())?"trash":null;
            case "restore" -> "trash".equals(s.status())?"draft":null;
            default -> null;};
        if(status==null)throw error(HttpStatus.BAD_REQUEST);
        var saved=persist(new ServiceOffering(s.id(),s.baseGroupId(),s.ownerAccountId(),s.title(),s.description(),s.category(),s.imageUrls(),s.maxDistanceKm(),s.languages(),s.staffAccountIds(),
            s.slotsEnabled(),s.startAtIso(),s.endAtIso(),s.frequency(),s.durationMinutes(),s.slotTemplates(),s.pricing(),status,s.createdAtIso(),Instant.now().toString(),s.version(),s.sourceLink()));
        return dto(actor,saved,profile(actor),profile(actor),Map.of());
    }
    private ServiceOffering persist(ServiceOffering s) {try{return services.save(s);}catch(org.springframework.dao.OptimisticLockingFailureException ex){throw error(HttpStatus.CONFLICT);}}
    private void validate(String actor,Save r) {
        if(r.title()==null||r.title().isBlank()||r.title().trim().length()>120||r.description()==null||r.description().length()>120
            ||r.category()==null||!CATEGORIES.contains(r.category())||r.imageUrls()==null||r.imageUrls().size()>4||r.imageUrls().stream().anyMatch(Objects::isNull)
            ||r.languages()==null||r.languages().size()>20||r.languages().stream().anyMatch(Objects::isNull)||r.staffAccountIds()==null||r.staffAccountIds().isEmpty()||r.staffAccountIds().size()>100
            ||r.maxDistanceKm()!=null&&(!Double.isFinite(r.maxDistanceKm())||r.maxDistanceKm()<1||r.maxDistanceKm()>20000)
            ||r.frequency()==null||!FREQUENCIES.contains(r.frequency())||r.durationMinutes()<5||r.durationMinutes()>1440||r.slotTemplates()==null||r.slotTemplates().size()>366)throw error(HttpStatus.BAD_REQUEST);
        var roster=members.findByOwnerTypeAndOwnerIdAndStatusAndUserIdIn("community", CommunityGroup.COMMUNITY_BASE_ID, "accepted", r.staffAccountIds(), org.springframework.data.domain.PageRequest.of(0,100)).getContent().stream().map(ActivityMember::getUserId).collect(Collectors.toSet());
        if(!roster.containsAll(r.staffAccountIds()))throw error(HttpStatus.BAD_REQUEST);
        if(r.slotsEnabled())try {
            var start=Instant.parse(r.startAtIso());var end=Instant.parse(r.endAtIso());
            if(!end.isAfter(start)||r.slotTemplates().isEmpty())throw error(HttpStatus.BAD_REQUEST);
            var slotIds=new HashSet<String>();
            for(var slot:r.slotTemplates()) {
                if(slot==null||slot.id()==null||slot.id().isBlank()||!slotIds.add(slot.id())||slot.startAt()==null||slot.subEventDefinitions()!=null&&!slot.subEventDefinitions().isEmpty())throw error(HttpStatus.BAD_REQUEST);
                Instant.parse(slot.startAt());
                if(slot.overrideDate()!=null&&!slot.overrideDate().isBlank())java.time.LocalDate.parse(slot.overrideDate());
            }
        }catch(java.time.DateTimeException|NullPointerException ex){throw error(HttpStatus.BAD_REQUEST);}
    }
}
