package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.mongo.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.mongo.ActivityMember;
import com.raxim.myscoutee.profile.data.document.mongo.Asset;
import com.raxim.myscoutee.profile.data.document.mongo.Asset.AssetRequestRecord;
import com.raxim.myscoutee.profile.data.document.mongo.Users;
import com.raxim.myscoutee.profile.dto.assets.AssetsDtos.AssetDeleteRequestDto;
import com.raxim.myscoutee.profile.dto.assets.AssetsDtos.AssetReplaceRequestDto;
import com.raxim.myscoutee.profile.dto.assets.AssetsDtos.AssetTicketsPageDto;
import com.raxim.myscoutee.profile.dto.assets.AssetsDtos.AssetUpsertRequestDto;
import com.raxim.myscoutee.profile.dto.events.EventsDtos.EventRecordDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.AssetCardDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.AssetMemberRequestDto;
import com.raxim.myscoutee.profile.repository.mongo.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.mongo.AssetsRepository;
import com.raxim.myscoutee.profile.repository.mongo.UsersRepository;

@Service
public class AssetsService {
    private static final String LEGACY_ASSETS_WRAPPER_ID = "assets";
    private static final Set<String> ASSET_TYPES = Set.of("Car", "Accommodation", "Supplies");

    private final AssetsRepository assetsRepository;
    private final UsersRepository usersRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final MongoTemplate mongoTemplate;

    public AssetsService(
            AssetsRepository assetsRepository,
            UsersRepository usersRepository,
            ActivityEventsRepository activityEventsRepository,
            MongoTemplate mongoTemplate) {
        this.assetsRepository = assetsRepository;
        this.usersRepository = usersRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public List<AssetCardDto> queryAssets(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return List.of();
        }

        ensureOwnerAssetsBootstrapped(normalizedUserId);
        return assetsRepository.findByOwnerUserIdOrderByUpdatedDateDesc(normalizedUserId).stream()
                .map(this::toDto)
                .filter(Objects::nonNull)
                .toList();
    }

    public AssetTicketsPageDto queryTicketPage(String userId, Integer page, Integer pageSize, String order) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return new AssetTicketsPageDto(List.of(), 0);
        }

        int normalizedPage = Math.max(0, page == null ? 0 : page.intValue());
        int normalizedPageSize = Math.max(1, pageSize == null ? 20 : pageSize.intValue());
        boolean upcoming = !"past".equalsIgnoreCase(safeText(order));

        List<EventRecordDto> ordered = activityEventsRepository.findByOwnerUserId(normalizedUserId).stream()
                .filter(Objects::nonNull)
                .filter(event -> Boolean.TRUE.equals(event.getTicketing()))
                .filter(event -> !Boolean.TRUE.equals(event.getIsInvitation()))
                .filter(event -> !Boolean.TRUE.equals(event.getIsTrashed()))
                .map(this::toTicketEventRecordDto)
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing((EventRecordDto item) -> toSortableDate(item.startAtIso())))
                .toList();

        List<EventRecordDto> visible = new ArrayList<>(ordered);
        if (upcoming) {
            java.util.Collections.reverse(visible);
        }

        int startIndex = Math.min(visible.size(), normalizedPage * normalizedPageSize);
        int endIndex = Math.min(visible.size(), startIndex + normalizedPageSize);
        return new AssetTicketsPageDto(visible.subList(startIndex, endIndex), visible.size());
    }

    public void upsert(AssetUpsertRequestDto request) {
        if (request == null || request.asset() == null) {
            return;
        }
        saveOwnedAsset(normalizeId(request.userId()), request.asset());
    }

    public void replace(AssetReplaceRequestDto request) {
        if (request == null) {
            return;
        }
        String normalizedUserId = normalizeId(request.userId());
        if (!StringUtils.hasText(normalizedUserId)) {
            return;
        }

        ensureOwnerAssetsBootstrapped(normalizedUserId);
        List<Asset> existing = assetsRepository.findByOwnerUserId(normalizedUserId);
        Map<String, Asset> existingByAssetId = new LinkedHashMap<>();
        for (Asset asset : existing) {
            String assetId = normalizeId(asset == null ? null : asset.getAssetId());
            if (StringUtils.hasText(assetId)) {
                existingByAssetId.put(assetId, asset);
            }
        }

        List<Asset> nextDocuments = new ArrayList<>();
        Set<String> retainedIds = new LinkedHashSet<>();
        for (AssetCardDto assetDto : safeAssets(request.assets())) {
            Asset next = toDocument(assetDto, normalizedUserId, existingByAssetId.get(normalizeId(assetDto.id())));
            if (next == null) {
                continue;
            }
            nextDocuments.add(next);
            retainedIds.add(next.getId());
        }

        List<Asset> toDelete = existing.stream()
                .filter(Objects::nonNull)
                .filter(asset -> !retainedIds.contains(asset.getId()))
                .toList();
        if (!toDelete.isEmpty()) {
            assetsRepository.deleteAll(toDelete);
        }
        if (!nextDocuments.isEmpty()) {
            assetsRepository.saveAll(nextDocuments);
        }
    }

    public void delete(AssetDeleteRequestDto request) {
        if (request == null) {
            return;
        }
        String normalizedUserId = normalizeId(request.userId());
        String normalizedAssetId = normalizeId(request.assetId());
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedAssetId)) {
            return;
        }
        ensureOwnerAssetsBootstrapped(normalizedUserId);
        assetsRepository.findByOwnerUserIdAndAssetId(normalizedUserId, normalizedAssetId)
                .ifPresent(assetsRepository::delete);
    }

    public Optional<Asset> findAssetByAssetId(String assetId) {
        String normalizedAssetId = normalizeId(assetId);
        if (!StringUtils.hasText(normalizedAssetId)) {
            return Optional.empty();
        }

        Optional<Asset> stored = assetsRepository.findByAssetId(normalizedAssetId);
        if (stored.isPresent()) {
            return stored;
        }

        Asset bootstrapped = bootstrapAssetFromLegacy(normalizedAssetId);
        return Optional.ofNullable(bootstrapped);
    }

    public void syncRequestsFromMembers(String assetId, List<ActivityMember> members) {
        Optional<Asset> assetOptional = findAssetByAssetId(assetId);
        if (assetOptional.isEmpty()) {
            return;
        }

        Asset current = assetOptional.get();
        String ownerUserId = normalizeId(current.getOwnerUserId());
        Map<String, AssetRequestRecord> existingByUserId = new LinkedHashMap<>();
        for (AssetRequestRecord request : safeRequests(current.getRequests())) {
            String requestUserId = normalizeId(request.userId());
            if (StringUtils.hasText(requestUserId)) {
                existingByUserId.put(requestUserId, request);
            }
        }

        List<AssetRequestRecord> nextRequests = members == null ? List.of() : members.stream()
                .filter(Objects::nonNull)
                .filter(member -> !ownerUserId.equals(normalizeId(member.getUserId())))
                .map(member -> toAssetRequest(member, existingByUserId.get(normalizeId(member.getUserId()))))
                .filter(Objects::nonNull)
                .toList();

        Asset next = cloneAsset(current);
        next.setRequests(nextRequests);
        next.setUpdatedDate(Instant.now().toString());
        next.setUpdatedUser(ownerUserId);
        assetsRepository.save(next);
    }

    private AssetCardDto saveOwnedAsset(String ownerUserId, AssetCardDto assetDto) {
        if (!StringUtils.hasText(ownerUserId)) {
            return null;
        }

        ensureOwnerAssetsBootstrapped(ownerUserId);
        Asset existing = assetsRepository.findByOwnerUserIdAndAssetId(ownerUserId, normalizeId(assetDto.id())).orElse(null);
        Asset saved = toDocument(assetDto, ownerUserId, existing);
        if (saved == null) {
            return null;
        }
        assetsRepository.save(saved);
        return toDto(saved);
    }

    private void ensureOwnerAssetsBootstrapped(String ownerUserId) {
        if (!assetsRepository.findByOwnerUserId(ownerUserId).isEmpty()) {
            return;
        }
        Document wrapper = mongoTemplate.findById(LEGACY_ASSETS_WRAPPER_ID, Document.class, "assets");
        if (wrapper == null) {
            return;
        }

        List<Asset> bootstrapped = readLegacyAssets(wrapper).stream()
                .filter(asset -> ownerUserId.equals(normalizeId(asset.getOwnerUserId())))
                .toList();
        if (!bootstrapped.isEmpty()) {
            assetsRepository.saveAll(bootstrapped);
        }
    }

    private Asset bootstrapAssetFromLegacy(String assetId) {
        Document wrapper = mongoTemplate.findById(LEGACY_ASSETS_WRAPPER_ID, Document.class, "assets");
        if (wrapper == null) {
            return null;
        }
        Asset legacy = readLegacyAssets(wrapper).stream()
                .filter(asset -> assetId.equals(normalizeId(asset.getAssetId())))
                .findFirst()
                .orElse(null);
        if (legacy == null) {
            return null;
        }
        return assetsRepository.findByOwnerUserIdAndAssetId(legacy.getOwnerUserId(), legacy.getAssetId())
                .orElseGet(() -> assetsRepository.save(legacy));
    }

    private List<Asset> readLegacyAssets(Document wrapper) {
        Object rawById = wrapper.get("byId");
        if (!(rawById instanceof Map<?, ?> byId)) {
            return List.of();
        }

        List<Asset> assets = new ArrayList<>();
        for (Object rawValue : byId.values()) {
            Document value = toDocument(rawValue);
            Asset asset = fromLegacyDocument(value);
            if (asset != null) {
                assets.add(asset);
            }
        }
        return assets;
    }

    private Asset fromLegacyDocument(Document legacy) {
        String assetId = normalizeId(legacy.getString("id"));
        String ownerUserId = normalizeId(legacy.getString("ownerUserId"));
        String type = normalizeAssetType(legacy.getString("type"));
        if (!StringUtils.hasText(assetId) || !StringUtils.hasText(ownerUserId) || !StringUtils.hasText(type)) {
            return null;
        }

        Asset asset = new Asset();
        asset.setId(new ObjectId().toHexString());
        asset.setSyncKey(UUID.randomUUID().toString());
        asset.setAssetId(assetId);
        asset.setOwnerUserId(ownerUserId);
        asset.setType(type);
        asset.setTitle(safeText(legacy.getString("title")));
        asset.setSubtitle(safeText(legacy.getString("subtitle")));
        asset.setCity(safeText(legacy.getString("city")));
        asset.setCapacityTotal(Math.max(1, normalizeCount(legacy.get("capacityTotal"))));
        asset.setDetails(safeText(legacy.getString("details")));
        asset.setImageUrl(safeText(legacy.getString("imageUrl")));
        asset.setSourceLink(safeText(legacy.getString("sourceLink")));
        asset.setRoutes(normalizeStrings(legacy.get("routes")));
        asset.setRequests(readLegacyRequests(legacy.get("requests")));
        asset.setVisibility(safeText(legacy.getString("visibility")));
        String createdDate = normalizeDateTime(legacy.getString("createdAtIso"), Instant.now().toString());
        String updatedDate = normalizeDateTime(legacy.getString("updatedAtIso"), createdDate);
        asset.setCreatedDate(createdDate);
        asset.setCreatedUser(ownerUserId);
        asset.setUpdatedDate(updatedDate);
        asset.setUpdatedUser(ownerUserId);
        return asset;
    }

    private List<AssetRequestRecord> readLegacyRequests(Object rawRequests) {
        if (!(rawRequests instanceof Collection<?> requests)) {
            return List.of();
        }

        List<AssetRequestRecord> next = new ArrayList<>();
        for (Object rawRequest : requests) {
            Document request = toDocument(rawRequest);
            String requestId = normalizeId(request.getString("id"));
            if (!StringUtils.hasText(requestId)) {
                continue;
            }
            next.add(new AssetRequestRecord(
                    requestId,
                    normalizeId(request.getString("userId")),
                    safeText(request.getString("name")),
                    safeText(request.getString("initials")),
                    normalizeGender(request.getString("gender")),
                    normalizeRequestStatus(request.getString("status")),
                    safeText(request.getString("note"))));
        }
        return next;
    }

    private Asset toDocument(AssetCardDto dto, String ownerUserId, Asset current) {
        String assetId = normalizeId(dto == null ? null : dto.id());
        String type = normalizeAssetType(dto == null ? null : dto.type());
        if (!StringUtils.hasText(assetId) || !StringUtils.hasText(ownerUserId) || !StringUtils.hasText(type)) {
            return null;
        }

        String nowIso = Instant.now().toString();
        Asset next = current == null ? new Asset() : cloneAsset(current);
        next.setId(current == null ? new ObjectId().toHexString() : current.getId());
        next.setSyncKey(current != null && StringUtils.hasText(current.getSyncKey()) ? current.getSyncKey().trim() : UUID.randomUUID().toString());
        next.setAssetId(assetId);
        next.setOwnerUserId(ownerUserId);
        next.setType(type);
        next.setTitle(safeText(dto.title()));
        next.setSubtitle(safeText(dto.subtitle()));
        next.setCity(safeText(dto.city()));
        next.setCapacityTotal(Math.max(1, normalizeCount(dto.capacityTotal())));
        next.setDetails(safeText(dto.details()));
        next.setImageUrl(safeText(dto.imageUrl()));
        next.setSourceLink(safeText(dto.sourceLink()));
        next.setRoutes(normalizeStrings(dto.routes()));
        next.setRequests(normalizeRequests(dto.requests()));
        next.setVisibility(StringUtils.hasText(safeText(current == null ? null : current.getVisibility())) ? current.getVisibility().trim() : "Invitation only");
        next.setCreatedDate(current == null ? nowIso : normalizeDateTime(current.getCreatedDate(), nowIso));
        next.setCreatedUser(current == null ? ownerUserId : safeText(current.getCreatedUser()));
        next.setUpdatedDate(nowIso);
        next.setUpdatedUser(ownerUserId);
        return next;
    }

    private Asset cloneAsset(Asset source) {
        Asset clone = new Asset();
        clone.setId(source.getId());
        clone.setSyncKey(source.getSyncKey());
        clone.setAssetId(source.getAssetId());
        clone.setOwnerUserId(source.getOwnerUserId());
        clone.setType(source.getType());
        clone.setTitle(source.getTitle());
        clone.setSubtitle(source.getSubtitle());
        clone.setCity(source.getCity());
        clone.setCapacityTotal(source.getCapacityTotal());
        clone.setDetails(source.getDetails());
        clone.setImageUrl(source.getImageUrl());
        clone.setSourceLink(source.getSourceLink());
        clone.setRoutes(new ArrayList<>(normalizeStrings(source.getRoutes())));
        clone.setRequests(new ArrayList<>(safeRequests(source.getRequests())));
        clone.setVisibility(source.getVisibility());
        clone.setCreatedDate(source.getCreatedDate());
        clone.setCreatedUser(source.getCreatedUser());
        clone.setUpdatedDate(source.getUpdatedDate());
        clone.setUpdatedUser(source.getUpdatedUser());
        return clone;
    }

    private EventRecordDto toTicketEventRecordDto(ActivityEvent event) {
        String sourceId = normalizeId(event.getSourceId());
        if (!StringUtils.hasText(sourceId)) {
            return null;
        }
        return new EventRecordDto(
                sourceId,
                normalizeId(event.getOwnerUserId()),
                safeText(event.getType()),
                safeText(event.getAvatar()),
                safeText(event.getTitle()),
                safeText(event.getSubtitle()),
                safeText(event.getTimeframe()),
                StringUtils.hasText(event.getInviter()) ? event.getInviter().trim() : null,
                normalizeCount(event.getUnread()),
                normalizeCount(event.getActivity()),
                Boolean.TRUE.equals(event.getIsAdmin()),
                Boolean.TRUE.equals(event.getIsInvitation()),
                Boolean.TRUE.equals(event.getIsHosting()),
                Boolean.TRUE.equals(event.getIsTrashed()),
                Boolean.FALSE.equals(event.getPublished()) ? Boolean.FALSE : Boolean.TRUE,
                safeNullableText(event.getTrashedAtIso()),
                normalizeId(event.getCreatorUserId()),
                safeText(event.getCreatorName()),
                safeText(event.getCreatorInitials()),
                safeText(event.getCreatorGender()),
                safeText(event.getCreatorCity()),
                safeText(event.getVisibility()),
                safeText(event.getBlindMode()),
                safeNullableText(event.getStartAtIso()),
                safeNullableText(event.getEndAtIso()),
                safeDouble(event.getDistanceKm()),
                safeText(event.getImageUrl()),
                safeText(event.getSourceLink()),
                safeText(event.getLocation()),
                event.getLocationCoordinates(),
                nullableCount(event.getCapacityMin()),
                nullableCount(event.getCapacityMax()),
                normalizeCount(event.getCapacityTotal()),
                Boolean.TRUE.equals(event.getAutoInviter()),
                safeText(event.getFrequency()),
                Boolean.TRUE.equals(event.getTicketing()),
                normalizeCount(event.getAcceptedMembers()),
                normalizeCount(event.getPendingMembers()),
                normalizeStrings(event.getAcceptedMemberUserIds()),
                normalizeStrings(event.getPendingMemberUserIds()),
                normalizeStrings(event.getTopics()),
                event.getSubEvents() == null ? List.of() : new ArrayList<>(event.getSubEvents()),
                safeText(event.getSubEventsDisplayMode()),
                safeDouble(event.getRating()),
                safeDouble(event.getRelevance()),
                safeDouble(event.getAffinity()));
    }

    private AssetCardDto toDto(Asset asset) {
        if (asset == null || !StringUtils.hasText(normalizeId(asset.getAssetId()))) {
            return null;
        }
        return new AssetCardDto(
                normalizeId(asset.getAssetId()),
                normalizeAssetType(asset.getType()),
                safeText(asset.getTitle()),
                safeText(asset.getSubtitle()),
                safeText(asset.getCity()),
                Math.max(1, normalizeCount(asset.getCapacityTotal())),
                safeText(asset.getDetails()),
                safeText(asset.getImageUrl()),
                safeText(asset.getSourceLink()),
                normalizeStrings(asset.getRoutes()),
                safeRequests(asset.getRequests()).stream()
                        .map(request -> new AssetMemberRequestDto(
                                normalizeId(request.id()),
                                normalizeId(request.userId()),
                                safeText(request.name()),
                                safeText(request.initials()),
                                normalizeGender(request.gender()),
                                normalizeRequestStatus(request.status()),
                                safeText(request.note())))
                        .toList());
    }

    private AssetRequestRecord toAssetRequest(ActivityMember member, AssetRequestRecord existing) {
        if (member == null || !StringUtils.hasText(normalizeId(member.getUserId()))) {
            return null;
        }
        Users user = usersRepository.findById(normalizeId(member.getUserId())).orElse(null);
        String status = "pending".equals(safeText(member.getStatus())) ? "pending" : "accepted";
        String note = "pending".equals(status)
                ? "Awaiting owner confirmation."
                : "Approved and synced with the plan.";
        return new AssetRequestRecord(
                existing != null && StringUtils.hasText(existing.id()) ? existing.id().trim() : UUID.randomUUID().toString(),
                normalizeId(member.getUserId()),
                user == null ? normalizeId(member.getUserId()) : safeText(user.getName()),
                user == null ? initialsFromText(normalizeId(member.getUserId())) : safeText(user.getInitials()),
                user == null ? "man" : normalizeGender(user.getGender()),
                status,
                note);
    }

    private List<AssetCardDto> safeAssets(List<AssetCardDto> assets) {
        return assets == null ? List.of() : assets;
    }

    private List<AssetRequestRecord> normalizeRequests(List<AssetMemberRequestDto> requests) {
        if (requests == null) {
            return List.of();
        }

        List<AssetRequestRecord> next = new ArrayList<>();
        for (AssetMemberRequestDto request : requests) {
            String requestId = normalizeId(request == null ? null : request.id());
            if (!StringUtils.hasText(requestId)) {
                continue;
            }
            next.add(new AssetRequestRecord(
                    requestId,
                    normalizeId(request.userId()),
                    safeText(request.name()),
                    safeText(request.initials()),
                    normalizeGender(request.gender()),
                    normalizeRequestStatus(request.status()),
                    safeText(request.note())));
        }
        return next;
    }

    private List<AssetRequestRecord> safeRequests(List<AssetRequestRecord> requests) {
        return requests == null ? List.of() : requests;
    }

    private Document toDocument(Object raw) {
        if (raw instanceof Document document) {
            return document;
        }
        if (raw instanceof Map<?, ?> map) {
            return new Document((Map<String, Object>) map);
        }
        return new Document();
    }

    private List<String> normalizeStrings(Object rawValues) {
        if (!(rawValues instanceof Collection<?> values)) {
            return List.of();
        }
        LinkedHashSet<String> next = new LinkedHashSet<>();
        for (Object rawValue : values) {
            String value = normalizeId(String.valueOf(rawValue));
            if (StringUtils.hasText(value)) {
                next.add(value);
            }
        }
        return new ArrayList<>(next);
    }

    private Double safeDouble(Double value) {
        return value == null || !Double.isFinite(value) ? 0d : value;
    }

    private String safeNullableText(String value) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : null;
    }

    private int normalizeCount(Object value) {
        if (value instanceof Number number) {
            return Math.max(0, (int) Math.floor(number.doubleValue()));
        }
        try {
            return Math.max(0, (int) Math.floor(Double.parseDouble(String.valueOf(value))));
        } catch (Exception ignored) {
            return 0;
        }
    }

    private Integer nullableCount(Number value) {
        return value == null ? null : Math.max(0, (int) Math.floor(value.doubleValue()));
    }

    private String normalizeId(String value) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : null;
    }

    private String normalizeAssetType(String type) {
        String normalizedType = safeText(type);
        return ASSET_TYPES.contains(normalizedType) ? normalizedType : null;
    }

    private String normalizeRequestStatus(String status) {
        return "accepted".equals(safeText(status)) ? "accepted" : "pending";
    }

    private String normalizeGender(String value) {
        return "woman".equals(safeText(value)) ? "woman" : "man";
    }

    private String normalizeDateTime(String value, String fallback) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : fallback;
    }

    private long toSortableDate(String value) {
        String normalizedValue = safeText(value);
        if (!StringUtils.hasText(normalizedValue)) {
            return Long.MIN_VALUE;
        }
        try {
            return Instant.parse(normalizedValue).toEpochMilli();
        } catch (Exception ignored) {
            return Long.MIN_VALUE;
        }
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String initialsFromText(String value) {
        String normalizedValue = safeText(value);
        if (!StringUtils.hasText(normalizedValue)) {
            return "";
        }
        StringBuilder initials = new StringBuilder();
        for (String part : normalizedValue.split("\\s+")) {
            if (!part.isEmpty()) {
                initials.append(Character.toUpperCase(part.charAt(0)));
            }
            if (initials.length() >= 2) {
                break;
            }
        }
        return initials.toString();
    }
}
