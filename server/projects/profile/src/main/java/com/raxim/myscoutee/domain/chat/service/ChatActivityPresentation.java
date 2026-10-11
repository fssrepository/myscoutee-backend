package com.raxim.myscoutee.domain.chat.service;

import static com.raxim.myscoutee.domain.chat.service.ChatRecordContext.*;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummaries;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummary;
import com.raxim.myscoutee.domain.assets.api.AssetOwnershipReads;
import com.raxim.myscoutee.domain.assets.api.AssetOwnership.Asset;
import com.raxim.myscoutee.domain.assets.dto.AssetDetails.AssetRequestRecord;
import com.raxim.myscoutee.domain.events.api.EventOwnershipReads;
import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import com.raxim.myscoutee.domain.events.api.EventOwnership.SubEvent;
import com.raxim.myscoutee.domain.events.api.MemberDirectory;
import com.raxim.myscoutee.domain.events.api.MemberDirectory.Member;
import com.raxim.myscoutee.domain.events.api.EventResourceDirectory;
import com.raxim.myscoutee.domain.events.api.EventResourceDirectory.Resource;
import com.raxim.myscoutee.domain.events.api.EventResourceDirectory.StageRuntime;
import com.raxim.myscoutee.domain.events.api.EventResourceDirectory.AssetSettings;
import com.raxim.myscoutee.domain.events.api.EventResourceDirectory.SupplyContribution;
import com.raxim.myscoutee.domain.chat.document.Chat;
import com.raxim.myscoutee.domain.chat.dto.ChatDtos.*;
import com.raxim.myscoutee.domain.chat.mapper.ChatMapper;
import com.raxim.myscoutee.common.dto.SharedDtos.SubEventGroupItemDto;

/** Existing batched event/member/resource presentation; never selects or authorizes chats. */
@Service
public class ChatActivityPresentation implements ChatPagePresentation {
    private final ProfileSummaries profileDirectory;
    private final MemberDirectory memberDirectory;
    private final EventResourceDirectory eventResources;
    private final EventOwnershipReads eventOwnership;
    private final AssetOwnershipReads assetOwnership;
    private final ChatMapper chatMapper;

    public ChatActivityPresentation(ProfileSummaries profileDirectory, MemberDirectory memberDirectory,
            EventResourceDirectory eventResources, EventOwnershipReads eventOwnership,
            AssetOwnershipReads assetOwnership, ChatMapper chatMapper) {
        this.profileDirectory = profileDirectory;
        this.memberDirectory = memberDirectory;
        this.eventResources = eventResources;
        this.eventOwnership = eventOwnership;
        this.assetOwnership = assetOwnership;
        this.chatMapper = chatMapper;
    }

    @Override
    public List<ChatDto> present(List<Chat> records, Map<String, ProfileSummary> usersById) {
        List<Chat> safeRecords = records == null ? List.of() : records;
        List<Chat> metricRecords = safeRecords.stream()
                .filter(ChatRecordContext::metricChatRecord)
                .toList();
        Map<String, ChatDto> dtoByOwnerId = chatMapper.toMap(metricRecords, usersById);
        patchChatDtosWithMetrics(metricRecords, dtoByOwnerId);
        List<ChatDto> result = new ArrayList<>();
        for (Chat record : safeRecords) {
            ChatDto dto = chatMapper.toDto(record, usersById);
            String ownerId = normalizeId(dto == null ? null : dto.ownerId());
            if (StringUtils.hasText(ownerId) && supportsChatMetrics(chatChannelType(record))) {
                result.add(dtoByOwnerId.getOrDefault(ownerId, dto));
            } else if (dto != null) {
                result.add(dto);
            }
        }
        return patchChatDtosWithNavigationContext(safeRecords, result);
    }

    private List<ChatDto> patchChatDtosWithNavigationContext(List<Chat> records, List<ChatDto> dtos) {
        if (records == null || records.isEmpty() || dtos == null || dtos.isEmpty()) {
            return dtos == null ? List.of() : dtos;
        }
        Set<String> eventIds = new LinkedHashSet<>();
        for (Chat record : records) {
            ChatOwnerParts parts = chatOwnerParts(record);
            String channelType = chatChannelType(record);
            if ((CHAT_CHANNEL_OPTIONAL_SUB_EVENT.equals(channelType)
                    || CHAT_CHANNEL_GROUP_SUB_EVENT.equals(channelType))
                    && StringUtils.hasText(parts.eventId())) {
                eventIds.add(parts.eventId());
            }
        }
        if (eventIds.isEmpty()) {
            return dtos;
        }

        var eventRecords = eventOwnership.chatNavigationEvents(eventIds);
        Map<String, Event> eventsByViewerAndId = new LinkedHashMap<>();
        Map<String, Event> fallbackEventsById = new LinkedHashMap<>();
        for (Event event : eventRecords == null ? List.<Event>of() : eventRecords) {
            String eventId = normalizeId(event == null ? null : event.getSourceId());
            if (!StringUtils.hasText(eventId)) {
                continue;
            }
            fallbackEventsById.putIfAbsent(eventId, event);
            String ownerUserId = normalizeId(event.getOwnerUserId());
            if (StringUtils.hasText(ownerUserId)) {
                eventsByViewerAndId.put(ownerUserId + ":" + eventId, event);
            }
        }

        List<ChatDto> result = new ArrayList<>(dtos.size());
        for (int index = 0; index < dtos.size(); index += 1) {
            ChatDto dto = dtos.get(index);
            Chat record = index < records.size() ? records.get(index) : null;
            ChatOwnerParts parts = chatOwnerParts(record);
            String eventId = parts.eventId();
            Event event = eventsByViewerAndId.get(normalizeId(record == null ? null : record.getOwnerUserId())
                    + ":" + eventId);
            if (event == null) {
                event = fallbackEventsById.get(eventId);
            }
            result.add(chatMapper.withNavigationContext(
                    dto,
                    chatNavigationContext(record, dto, event, parts)));
        }
        return result;
    }

    private ChatNavigationContextDto chatNavigationContext(
            Chat chat,
            ChatDto dto,
            Event event,
            ChatOwnerParts parts) {
        String channelType = chatChannelType(chat);
        if (event == null
                || (!CHAT_CHANNEL_OPTIONAL_SUB_EVENT.equals(channelType)
                        && !CHAT_CHANNEL_GROUP_SUB_EVENT.equals(channelType))) {
            return null;
        }
        SubEvent subEvent = findChatContextSubEvent(event, parts.subEventId());
        if (subEvent == null) {
            return null;
        }
        String viewerUserId = normalizeId(chat == null ? null : chat.getOwnerUserId());
        boolean canManage = viewerUserId.equals(normalizeId(event.getCreatorUserId()))
                || (event.getAdmins() != null && event.getAdmins().stream()
                        .map(ChatRecordContext::normalizeId)
                        .anyMatch(viewerUserId::equals));
        return new ChatNavigationContextDto(
                parts.eventId(),
                safeText(event.getTitle()),
                canManage ? "hosting" : "events",
                normalizeCount(event.getPendingMembers()),
                eventOwnership.presentSubEvent(subEvent),
                CHAT_CHANNEL_GROUP_SUB_EVENT.equals(channelType)
                        ? toChatGroupContext(subEvent, parts.groupId(), dto == null ? null : dto.metrics())
                        : null);
    }

    private ChatGroupContextDto toChatGroupContext(SubEvent subEvent, String groupId, ChatMetricsDto metrics) {
        ChatMetricBucketDto members = metrics == null ? null : metrics.members();
        SubEventGroupItemDto group = (subEvent == null || subEvent.groups() == null
                ? List.<SubEventGroupItemDto>of()
                : subEvent.groups()).stream()
                .filter(Objects::nonNull)
                .filter(item -> normalizeId(groupId).equals(normalizeId(item.id())))
                .findFirst()
                .orElse(null);
        if (group == null) {
            return null;
        }
        return new ChatGroupContextDto(
                normalizeId(group.id()),
                safeText(group.name()),
                safeText(group.source()),
                members == null ? 0 : members.accepted(),
                members == null ? 0 : members.pending(),
                normalizeCount(group.capacityMin()),
                normalizeCount(group.capacityMax()));
    }

    private void patchChatDtosWithMetrics(List<Chat> records, Map<String, ChatDto> dtoByOwnerId) {
        if (records == null || records.isEmpty() || dtoByOwnerId == null || dtoByOwnerId.isEmpty()) {
            return;
        }
        Map<String, ChatMetricLookup> lookupByOwnerId = new LinkedHashMap<>();
        Map<String, MemberOwnerLookup> memberOwnersByKey = new LinkedHashMap<>();
        Set<String> resourceOwnerIds = new LinkedHashSet<>();
        Set<String> resourceViewerUserIds = new LinkedHashSet<>();
        Set<String> stageRuntimeOwnerIds = new LinkedHashSet<>();

        for (Chat record : records) {
            String ownerId = normalizeId(record == null ? null : record.getOwnerId());
            String channelType = chatChannelType(record);
            if (!StringUtils.hasText(ownerId)
                    || !dtoByOwnerId.containsKey(ownerId)
                    || !supportsChatMetrics(channelType)) {
                continue;
            }
            ChatOwnerParts parts = chatOwnerParts(record);
            String viewerUserId = normalizeId(record.getOwnerUserId());
            lookupByOwnerId.put(ownerId, new ChatMetricLookup(channelType, ownerId, viewerUserId, parts));

            String memberOwnerType = memberOwnerType(channelType);
            if (StringUtils.hasText(memberOwnerType)) {
                memberOwnersByKey.put(memberOwnerType + ":" + ownerId, new MemberOwnerLookup(memberOwnerType, ownerId));
            }
            if ((CHAT_CHANNEL_OPTIONAL_SUB_EVENT.equals(channelType) || CHAT_CHANNEL_GROUP_SUB_EVENT.equals(channelType))
                    && StringUtils.hasText(parts.subEventId())) {
                if (StringUtils.hasText(parts.eventId())) {
                    resourceOwnerIds.add(parts.eventId());
                    stageRuntimeOwnerIds.add(parts.eventId());
                }
                resourceOwnerIds.add(ownerId);
                if (StringUtils.hasText(viewerUserId)) {
                    resourceViewerUserIds.add(viewerUserId);
                }
                stageRuntimeOwnerIds.add(ownerId);
            }
        }

        Map<String, List<Member>> membersByOwnerKey = activityMembersByOwnerKey(memberOwnersByKey.values());
        Set<String> acceptedMemberIds = membersByOwnerKey.values().stream()
                .flatMap(Collection::stream)
                .filter(record -> MEMBER_STATUS_ACCEPTED.equals(
                        safeText(record == null ? null : record.getStatus()).toLowerCase(Locale.ROOT)))
                .map(Member::getUserId)
                .map(ChatRecordContext::normalizeId)
                .filter(StringUtils::hasText)
                .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));
        Map<String, ProfileSummary> activityMemberUsersById = new LinkedHashMap<>();
        if (!acceptedMemberIds.isEmpty()) {
            for (ProfileSummary user : profileDirectory.findByUserIdIn(acceptedMemberIds)) {
                String memberUserId = normalizeId(user == null ? null : user.getUserId());
                if (StringUtils.hasText(memberUserId)) {
                    activityMemberUsersById.put(memberUserId, user);
                }
            }
        }
        Map<String, List<Resource>> resourcesByMetricKey = resourceRecordsByMetricKey(
                resourceOwnerIds,
                resourceViewerUserIds);
        Map<String, Asset> assetsByOwnerAndId = assetsByOwnerAndId(resourcesByMetricKey.values());
        Map<String, StageRuntime> stageRuntimeByMetricKey = stageRuntimeByMetricKey(stageRuntimeOwnerIds);

        for (Map.Entry<String, ChatMetricLookup> entry : lookupByOwnerId.entrySet()) {
            String ownerIdKey = entry.getKey();
            ChatMetricLookup lookup = entry.getValue();
            String memberOwnerType = memberOwnerType(lookup.channelType());
            ChatMetricBucketDto members = StringUtils.hasText(memberOwnerType)
                    ? memberBucket(membersByOwnerKey.getOrDefault(memberOwnerType + ":" + lookup.ownerId(), List.of()))
                    : null;
            ChatMetricsDto metrics = buildChatMetrics(
                    lookup,
                    members,
                    resourcesByMetricKey,
                    assetsByOwnerAndId,
                    stageRuntimeByMetricKey);
            ChatDto dto = dtoByOwnerId.get(ownerIdKey);
            if (dto != null) {
                List<String> authoritativeMemberIds = StringUtils.hasText(memberOwnerType)
                        ? membersByOwnerKey.getOrDefault(
                                        memberOwnerType + ":" + lookup.ownerId(),
                                        List.of()).stream()
                                .filter(record -> MEMBER_STATUS_ACCEPTED.equals(
                                        safeText(record == null ? null : record.getStatus()).toLowerCase(Locale.ROOT)))
                                .map(Member::getUserId)
                                .map(ChatRecordContext::normalizeId)
                                .filter(StringUtils::hasText)
                                .distinct()
                                .toList()
                        : dto.memberIds();
                ChatDto withMembers = chatMapper.withMembers(dto, authoritativeMemberIds, activityMemberUsersById);
                dtoByOwnerId.put(ownerIdKey, chatMapper.withMetrics(withMembers, metrics));
            }
        }
    }

    private ChatMetricsDto buildChatMetrics(
            ChatMetricLookup lookup,
            ChatMetricBucketDto members,
            Map<String, List<Resource>> resourcesByMetricKey,
            Map<String, Asset> assetsByOwnerAndId,
            Map<String, StageRuntime> stageRuntimeByMetricKey) {
        ChatMetricBucketDto transport = null;
        ChatMetricBucketDto accommodation = null;
        ChatMetricBucketDto supplies = null;
        Integer groupsCount = null;
        int pendingTotal = countValue(members == null ? null : members.pending());

        if (lookup != null
                && (CHAT_CHANNEL_OPTIONAL_SUB_EVENT.equals(lookup.channelType())
                        || CHAT_CHANNEL_GROUP_SUB_EVENT.equals(lookup.channelType()))
                && StringUtils.hasText(lookup.parts().subEventId())) {
            List<Resource> resources = metricResourceRecords(
                    resourcesByMetricKey,
                    lookup.viewerUserId(),
                    CHAT_CHANNEL_GROUP_SUB_EVENT.equals(lookup.channelType()) ? "" : lookup.parts().eventId(),
                    lookup.ownerId(),
                    lookup.parts().subEventId());
            transport = assetBucket(resources, ASSET_TYPE_TRANSPORT, assetsByOwnerAndId);
            accommodation = assetBucket(resources, ASSET_TYPE_ACCOMMODATION, assetsByOwnerAndId);
            supplies = assetBucket(resources, ASSET_TYPE_SUPPLIES, assetsByOwnerAndId);
            StageRuntime stageRuntime = firstStageRuntime(
                    stageRuntimeByMetricKey,
                    lookup.parts().eventId(),
                    lookup.ownerId(),
                    lookup.parts().subEventId());
            groupsCount = stageRuntime == null ? null : countValue(stageRuntime.getGroupsCount());
            pendingTotal += countValue(transport.pending())
                    + countValue(accommodation.pending())
                    + countValue(supplies.pending());
        }

        return new ChatMetricsDto(
                members,
                transport,
                accommodation,
                supplies,
                groupsCount,
                pendingTotal);
    }

    private Map<String, List<Member>> activityMembersByOwnerKey(Collection<MemberOwnerLookup> lookups) {
        Map<String, Set<String>> ownerIdsByType = new LinkedHashMap<>();
        for (MemberOwnerLookup lookup : lookups == null ? List.<MemberOwnerLookup>of() : lookups) {
            if (lookup == null || !StringUtils.hasText(lookup.ownerType()) || !StringUtils.hasText(lookup.ownerId())) {
                continue;
            }
            ownerIdsByType.computeIfAbsent(lookup.ownerType(), ignored -> new LinkedHashSet<>()).add(lookup.ownerId());
        }

        Map<String, List<Member>> result = new LinkedHashMap<>();
        for (Map.Entry<String, Set<String>> entry : ownerIdsByType.entrySet()) {
            if (entry.getValue().isEmpty()) {
                continue;
            }
            var records = memberDirectory.findByOwnerTypeAndOwnerIdIn(entry.getKey(), entry.getValue());
            for (Member record : records == null ? List.<Member>of() : records) {
                String ownerType = safeText(record == null ? null : record.getOwnerType());
                String ownerId = normalizeId(record == null ? null : record.getOwnerId());
                if (!StringUtils.hasText(ownerType) || !StringUtils.hasText(ownerId)) {
                    continue;
                }
                result.computeIfAbsent(ownerType + ":" + ownerId, ignored -> new ArrayList<>()).add(record);
            }
        }
        return result;
    }

    private Map<String, List<Resource>> resourceRecordsByMetricKey(
            Set<String> ownerIds,
            Set<String> viewerUserIds) {
        if (ownerIds == null || ownerIds.isEmpty() || viewerUserIds == null || viewerUserIds.isEmpty()) {
            return Map.of();
        }
        var records = eventResources
                .findByOwnerIdInAndAssetOwnerUserIdInAndStatusNot(
                        ownerIds,
                        viewerUserIds,
                        RUNTIME_STATUS_DELETED);
        Map<String, List<Resource>> result = new LinkedHashMap<>();
        for (Resource record : records == null ? List.<Resource>of() : records) {
            String ownerId = normalizeId(record == null ? null : record.getOwnerId());
            String subEventId = normalizeId(record == null ? null : record.getSubEventId());
            if (!StringUtils.hasText(ownerId) || !StringUtils.hasText(subEventId)) {
                continue;
            }
            String assetOwnerUserId = normalizeId(record.getAssetOwnerUserId());
            if (StringUtils.hasText(assetOwnerUserId)) {
                result.computeIfAbsent(
                        assetOwnerUserId + ":" + ownerId + ":" + subEventId,
                        ignored -> new ArrayList<>()).add(record);
            }
        }
        return result;
    }

    private Map<String, Asset> assetsByOwnerAndId(Collection<List<Resource>> resourceBuckets) {
        Set<String> ownerUserIds = new LinkedHashSet<>();
        Set<String> assetIds = new LinkedHashSet<>();
        for (List<Resource> bucket : resourceBuckets == null
                ? List.<List<Resource>>of()
                : resourceBuckets) {
            for (Resource record : bucket == null ? List.<Resource>of() : bucket) {
                String ownerUserId = normalizeId(record == null ? null : record.getAssetOwnerUserId());
                if (StringUtils.hasText(ownerUserId)) {
                    ownerUserIds.add(ownerUserId);
                }
                if (record != null && record.getAssetAssignmentIds() != null) {
                    record.getAssetAssignmentIds().values().stream()
                            .filter(Objects::nonNull)
                            .flatMap(Collection::stream)
                            .map(ChatRecordContext::normalizeId)
                            .filter(StringUtils::hasText)
                            .forEach(assetIds::add);
                }
            }
        }
        if (ownerUserIds.isEmpty() || assetIds.isEmpty()) {
            return Map.of();
        }
        Map<String, Asset> result = new LinkedHashMap<>();
        for (Asset asset : assetOwnership.findByOwnersAndIds(ownerUserIds, assetIds)) {
            String ownerUserId = normalizeId(asset == null ? null : asset.getOwnerUserId());
            String assetId = normalizeId(asset == null ? null : asset.getAssetId());
            if (StringUtils.hasText(ownerUserId) && StringUtils.hasText(assetId)) {
                result.put(ownerUserId + ":" + assetId, asset);
            }
        }
        return result;
    }

    private Map<String, StageRuntime> stageRuntimeByMetricKey(Set<String> ownerIds) {
        if (ownerIds == null || ownerIds.isEmpty()) {
            return Map.of();
        }
        var records = eventResources.findByOwnerIdInAndStatusNot(ownerIds, RUNTIME_STATUS_DELETED);
        Map<String, StageRuntime> result = new LinkedHashMap<>();
        for (StageRuntime record : records == null ? List.<StageRuntime>of() : records) {
            String ownerId = normalizeId(record == null ? null : record.getOwnerId());
            String subEventId = normalizeId(record == null ? null : record.getSubEventId());
            if (StringUtils.hasText(ownerId) && StringUtils.hasText(subEventId)) {
                result.put(ownerId + ":" + subEventId, record);
            }
        }
        return result;
    }

    private List<Resource> metricResourceRecords(
            Map<String, List<Resource>> recordsByKey,
            String viewerUserId,
            String eventId,
            String ownerId,
            String subEventId) {
        Map<String, Resource> result = new LinkedHashMap<>();
        List<String> keys = new ArrayList<>();
        if (StringUtils.hasText(eventId)) {
            keys.add(viewerUserId + ":" + eventId + ":" + subEventId);
        }
        if (StringUtils.hasText(ownerId)) {
            keys.add(viewerUserId + ":" + ownerId + ":" + subEventId);
        }
        for (String key : keys) {
            for (Resource record : recordsByKey.getOrDefault(key, List.of())) {
                String recordKey = firstNonBlank(
                        record == null ? null : record.getRecordId(),
                        record == null ? null : record.getId(),
                        key + ":" + normalizeId(record == null ? null : record.getAssetOwnerUserId()));
                if (StringUtils.hasText(recordKey)) {
                    result.put(recordKey, record);
                }
            }
        }
        return new ArrayList<>(result.values());
    }

    private StageRuntime firstStageRuntime(
            Map<String, StageRuntime> recordsByKey,
            String eventId,
            String ownerId,
            String subEventId) {
        if (StringUtils.hasText(eventId)) {
            StageRuntime record = recordsByKey.get(eventId + ":" + subEventId);
            if (record != null) {
                return record;
            }
        }
        return StringUtils.hasText(ownerId) ? recordsByKey.get(ownerId + ":" + subEventId) : null;
    }

    private ChatMetricBucketDto memberBucket(List<Member> records) {
        int accepted = 0;
        int pending = 0;
        for (Member record : records == null ? List.<Member>of() : records) {
            String status = safeText(record == null ? null : record.getStatus()).toLowerCase(Locale.ROOT);
            if (MEMBER_STATUS_ACCEPTED.equals(status)) {
                accepted += 1;
            } else if (MEMBER_STATUS_PENDING.equals(status)) {
                pending += 1;
            }
        }
        return new ChatMetricBucketDto(accepted, pending, 0, Math.max(accepted, accepted + pending));
    }

    private ChatMetricBucketDto assetBucket(
            List<Resource> records,
            String type,
            Map<String, Asset> assetsByOwnerAndId) {
        int accepted = 0;
        int pending = 0;
        int capacityMin = 0;
        int capacityMax = 0;
        for (Resource record : records == null ? List.<Resource>of() : records) {
            Map<String, ? extends Map<String, ? extends AssetSettings>> settingsByType =
                    record == null || record.getAssetSettingsByType() == null
                            ? Map.of()
                            : record.getAssetSettingsByType();
            Map<String, ? extends AssetSettings> settingsByAssetId = settingsByType.get(type);
            if (settingsByAssetId == null) settingsByAssetId = Map.of();
            List<String> assignedIds = record == null || record.getAssetAssignmentIds() == null
                    ? List.of()
                    : record.getAssetAssignmentIds().getOrDefault(type, List.of());
            List<String> assetIds = assignedIds == null || assignedIds.isEmpty()
                    ? new ArrayList<>(settingsByAssetId.keySet())
                    : assignedIds;
            for (String assetId : assetIds) {
                AssetSettings settings = settingsByAssetId.get(assetId);
                capacityMin += countValue(settings == null ? null : settings.capacityMin());
                Asset asset = assetsByOwnerAndId.get(
                        normalizeId(record.getAssetOwnerUserId()) + ":" + normalizeId(assetId));
                capacityMax += countValue(settings != null && settings.capacityMax() != null
                        ? settings.capacityMax()
                        : asset == null ? null : asset.getCapacityTotal());
                if (ASSET_TYPE_SUPPLIES.equals(type)) {
                    accepted += supplyContributionQuantity(record, assetId);
                } else if (asset != null) {
                    int[] requestCounts = assetRequestCountsForMetric(
                            asset,
                            record.getSubEventId(),
                            record.getOwnerId());
                    accepted += requestCounts[0];
                    pending += requestCounts[1];
                }
            }
        }
        return new ChatMetricBucketDto(
                accepted,
                pending,
                capacityMin,
                Math.max(Math.max(capacityMin, capacityMax), accepted + pending));
    }

    private int[] assetRequestCountsForMetric(Asset asset, String subEventId, String ownerId) {
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedOwnerId = normalizeId(ownerId);
        Map<String, String> statusByMemberIdentity = new LinkedHashMap<>();
        for (AssetRequestRecord request : asset == null || asset.getRequests() == null
                ? List.<AssetRequestRecord>of()
                : asset.getRequests()) {
            String bookingSubEventId = normalizeId(
                    request == null || request.booking() == null ? null : request.booking().subEventId());
            String bookingOwnerId = normalizeId(
                    request == null || request.booking() == null ? null : request.booking().eventId());
            if (!normalizedSubEventId.equals(bookingSubEventId)
                    || !normalizedOwnerId.equals(bookingOwnerId)) {
                continue;
            }
            String status = safeText(request.status()).toLowerCase(Locale.ROOT);
            if (!MEMBER_STATUS_ACCEPTED.equals(status) && !MEMBER_STATUS_PENDING.equals(status)) {
                continue;
            }
            String identity = firstNonBlank(
                    normalizeId(request.id()),
                    normalizeId(request.userId()));
            if (!StringUtils.hasText(identity)) {
                continue;
            }
            String existing = statusByMemberIdentity.get(identity);
            if (!MEMBER_STATUS_ACCEPTED.equals(existing) || MEMBER_STATUS_ACCEPTED.equals(status)) {
                statusByMemberIdentity.put(identity, status);
            }
        }
        int accepted = (int) statusByMemberIdentity.values().stream()
                .filter(MEMBER_STATUS_ACCEPTED::equals)
                .count();
        int pending = (int) statusByMemberIdentity.values().stream()
                .filter(MEMBER_STATUS_PENDING::equals)
                .count();
        return new int[] {accepted, pending};
    }

    private int supplyContributionQuantity(Resource record, String assetId) {
        if (record == null || record.getSupplyContributionEntriesByAssetId() == null) {
            return 0;
        }
        int total = 0;
        var entries = record.getSupplyContributionEntriesByAssetId().get(assetId);
        for (SupplyContribution entry : entries == null ? List.<SupplyContribution>of() : entries) {
            total += countValue(entry == null ? null : entry.quantity());
        }
        return total;
    }

    private record ChatMetricLookup(
            String channelType,
            String ownerId,
            String viewerUserId,
            ChatOwnerParts parts) {
    }

    private record MemberOwnerLookup(
            String ownerType,
            String ownerId) {
    }
}
