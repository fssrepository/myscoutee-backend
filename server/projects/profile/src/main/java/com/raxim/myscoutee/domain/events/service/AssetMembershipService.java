package com.raxim.myscoutee.domain.events.service;
import java.util.UUID;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.mongodb.client.result.UpdateResult;
import com.raxim.myscoutee.domain.events.api.MemberDirectory;
import com.raxim.myscoutee.domain.events.api.AssetMemberships;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
@Service
public class AssetMembershipService implements AssetMemberships {
    private final ActivityMembersRepository activityMembersRepository;
    private final MongoTemplate mongoTemplate;
    private static final String OWNER_TYPE_ASSET = "asset", ROLE_MANAGER = "Manager", MEMBER_STATUS_ACCEPTED = "accepted";
    public AssetMembershipService(ActivityMembersRepository members, MongoTemplate mongo) { activityMembersRepository = members; mongoTemplate = mongo; }
    @Override public ActivityMember promote(MemberDirectory.Member currentMember, String normalizedAssetId,
            String normalizedTargetUserId, String normalizedUserId, String nowIso) {
        ActivityMember member = new ActivityMember();
        if (currentMember != null) {
            member.setId(currentMember.getId());
            member.setSyncKey(currentMember.getSyncKey());
            member.setCreatedDate(currentMember.getCreatedDate());
            member.setCreatedUser(currentMember.getCreatedUser());
        }
        if (!StringUtils.hasText(member.getId())) {
            member.setId(new ObjectId().toHexString());
            member.setSyncKey(UUID.randomUUID().toString());
            member.setOwnerType(OWNER_TYPE_ASSET);
            member.setOwnerId(normalizedAssetId);
            member.setUserId(normalizedTargetUserId);
            member.setCreatedDate(nowIso);
            member.setCreatedUser(normalizedUserId);
        }
        member.setOwnerType(OWNER_TYPE_ASSET);
        member.setOwnerId(normalizedAssetId);
        member.setUserId(normalizedTargetUserId);
        member.setRole(ROLE_MANAGER);
        member.setStatus(MEMBER_STATUS_ACCEPTED);
        member.setPendingSource(null);
        member.setRequestKind(null);
        member.setInvitedByUserId(null);
        member.setManagerGrantedByUserId(normalizedUserId);
        member.setActionAtIso(nowIso);
        member.setUpdatedDate(nowIso);
        member.setUpdatedUser(normalizedUserId);
        return promoteAssetMemberIfSnapshotCurrent(currentMember, member);

    }
    private ActivityMember promoteAssetMemberIfSnapshotCurrent(MemberDirectory.Member current, ActivityMember next) {
        if (next == null) {
            return null;
        }
        if (current == null) {
            try {
                return activityMembersRepository.save(next);
            } catch (DuplicateKeyException ignored) {
                return null;
            }
        }
        Criteria criteria = memberSnapshotCriteria(current);
        if (criteria == null) {
            return null;
        }
        Update update = new Update()
                .set("ownerType", safeText(next.getOwnerType()))
                .set("ownerId", normalizeId(next.getOwnerId()))
                .set("userId", normalizeId(next.getUserId()))
                .set("role", safeText(next.getRole()))
                .set("status", safeText(next.getStatus()))
                .unset("pendingSource")
                .unset("requestKind")
                .unset("invitedByUserId")
                .set("managerGrantedByUserId", normalizeId(next.getManagerGrantedByUserId()))
                .set("actionAtIso", safeText(next.getActionAtIso()))
                .set("updatedDate", safeText(next.getUpdatedDate()))
                .set("updatedUser", safeText(next.getUpdatedUser()));
        UpdateResult result = mongoTemplate.updateFirst(Query.query(criteria), update, ActivityMember.class);
        return result != null && result.getMatchedCount() > 0 ? next : null;
    }
    private Criteria memberSnapshotCriteria(MemberDirectory.Member current) {
        if (current == null) {
            return null;
        }
        String id = normalizeId(current.getId());
        Criteria criteria;
        if (StringUtils.hasText(id)) {
            criteria = Criteria.where("_id").is(id);
        } else {
            String ownerType = safeText(current.getOwnerType());
            String ownerId = normalizeId(current.getOwnerId());
            String userId = normalizeId(current.getUserId());
            if (!StringUtils.hasText(ownerType) || !StringUtils.hasText(ownerId) || !StringUtils.hasText(userId)) {
                return null;
            }
            criteria = Criteria.where("ownerType").is(ownerType)
                    .and("ownerId").is(ownerId)
                    .and("userId").is(userId);
        }
        return criteria
                .and("updatedDate").is(StringUtils.hasText(safeText(current.getUpdatedDate())) ? safeText(current.getUpdatedDate()) : null)
                .and("role").is(StringUtils.hasText(safeText(current.getRole())) ? safeText(current.getRole()) : null)
                .and("status").is(StringUtils.hasText(safeText(current.getStatus())) ? safeText(current.getStatus()) : null);
    }
    private String normalizeId(String value) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : null;
    }
    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
    @Override public void delete(MemberDirectory.Member member) { activityMembersRepository.delete((ActivityMember) member); }
}
