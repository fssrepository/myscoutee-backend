package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.AssetCatalog;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.IntegrationExternalId;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDetailDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetUpsertRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventDetailDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventDto;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationAssetSyncItemDto;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationAssetSyncRequestDto;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationEventSyncItemDto;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationEventSyncRequestDto;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationSyncResponseDto;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationSyncResultDto;
import com.raxim.myscoutee.profile.repository.IntegrationExternalIdsRepository;
import com.raxim.myscoutee.profile.service.MediaStorageService.StoredImageSet;

@Service
public class IntegrationSyncService {
    private static final String RESOURCE_ASSET = "asset";
    private static final String RESOURCE_EVENT = "event";

    private final IntegrationExternalIdsRepository externalIdsRepository;
    private final MongoTemplate mongoTemplate;
    private final AssetsService assetsService;
    private final ActivitiesEventsService eventsService;
    private final MediaStorageService mediaStorageService;

    public IntegrationSyncService(
            IntegrationExternalIdsRepository externalIdsRepository,
            MongoTemplate mongoTemplate,
            AssetsService assetsService,
            ActivitiesEventsService eventsService,
            MediaStorageService mediaStorageService) {
        this.externalIdsRepository = externalIdsRepository;
        this.mongoTemplate = mongoTemplate;
        this.assetsService = assetsService;
        this.eventsService = eventsService;
        this.mediaStorageService = mediaStorageService;
    }

    public IntegrationSyncResponseDto createAssets(
            String ownerUserId,
            IntegrationAssetSyncRequestDto request) {
        return createAssets(ownerUserId, request, Map.of());
    }

    public IntegrationSyncResponseDto createAssets(
            String ownerUserId,
            IntegrationAssetSyncRequestDto request,
            Map<String, MultipartFile> requestedImages) {
        List<IntegrationAssetSyncItemDto> items = requireBatch(request == null ? null : request.items());
        Map<String, MultipartFile> images = requireImageFiles(
                items.stream().map(IntegrationAssetSyncItemDto::id).toList(),
                requestedImages);
        Map<String, IntegrationExternalId> existing = existingMappings(
                ownerUserId,
                RESOURCE_ASSET,
                items.stream().map(IntegrationAssetSyncItemDto::id).toList());
        Set<String> seen = new HashSet<>();
        List<IntegrationSyncResultDto> results = new ArrayList<>(items.size());

        for (IntegrationAssetSyncItemDto item : items) {
            String itemId = normalizeItemId(item == null ? null : item.id());
            String validationError = validateAsset(item, itemId, seen);
            if (validationError != null) {
                results.add(rejected(itemId, validationError));
                continue;
            }
            IntegrationExternalId previous = existing.get(itemId);
            if (previous != null && resourceExists(
                    ownerUserId,
                    RESOURCE_ASSET,
                    previous.getInternalId())) {
                results.add(success(itemId, previous.getInternalId(), "existing"));
                continue;
            }
            IntegrationExternalId mapping = previous != null
                    ? previous
                    : ensureMapping(ownerUserId, RESOURCE_ASSET, itemId);
            StoredImageSet uploadedImage = storeImage(
                    ownerUserId,
                    RESOURCE_ASSET,
                    mapping.getInternalId(),
                    images.get(itemId));
            if (images.containsKey(itemId) && uploadedImage == null) {
                results.add(rejected(itemId, "image_upload_failed"));
                continue;
            }
            try {
                AssetDto saved = assetsService.upsert(new AssetUpsertRequestDto(
                        ownerUserId,
                        toAssetDetail(
                                mapping.getInternalId(),
                                ownerUserId,
                                item,
                                uploadedImage == null ? null : uploadedImage.imageUrl())));
                if (saved == null || !StringUtils.hasText(saved.id())) {
                    discardImage(uploadedImage);
                    results.add(rejected(itemId, "not_allowed_or_invalid"));
                    continue;
                }
                results.add(success(itemId, saved.id(), "created"));
            } catch (RuntimeException exception) {
                discardImage(uploadedImage);
                results.add(rejected(itemId, "create_failed"));
            }
        }
        return new IntegrationSyncResponseDto(results);
    }

    public IntegrationSyncResponseDto createEvents(
            String ownerUserId,
            IntegrationEventSyncRequestDto request) {
        return createEvents(ownerUserId, request, Map.of());
    }

    public IntegrationSyncResponseDto createEvents(
            String ownerUserId,
            IntegrationEventSyncRequestDto request,
            Map<String, MultipartFile> requestedImages) {
        List<IntegrationEventSyncItemDto> items = requireBatch(request == null ? null : request.items());
        Map<String, MultipartFile> images = requireImageFiles(
                items.stream().map(item -> item == null ? null : item.id()).toList(),
                requestedImages);
        Map<String, IntegrationExternalId> existing = existingMappings(
                ownerUserId,
                RESOURCE_EVENT,
                items.stream().map(item -> item == null ? null : item.id()).toList());
        Set<String> seen = new HashSet<>();
        List<IntegrationSyncResultDto> results = new ArrayList<>(items.size());

        for (IntegrationEventSyncItemDto item : items) {
            String itemId = normalizeItemId(item == null ? null : item.id());
            String validationError = validateEvent(item, itemId, seen);
            if (validationError != null) {
                results.add(rejected(itemId, validationError));
                continue;
            }
            IntegrationExternalId previous = existing.get(itemId);
            if (previous != null && resourceExists(
                    ownerUserId,
                    RESOURCE_EVENT,
                    previous.getInternalId())) {
                results.add(success(itemId, previous.getInternalId(), "existing"));
                continue;
            }
            IntegrationExternalId mapping = previous != null
                    ? previous
                    : ensureMapping(ownerUserId, RESOURCE_EVENT, itemId);
            StoredImageSet uploadedImage = storeImage(
                    ownerUserId,
                    RESOURCE_EVENT,
                    mapping.getInternalId(),
                    images.get(itemId));
            if (images.containsKey(itemId) && uploadedImage == null) {
                results.add(rejected(itemId, "image_upload_failed"));
                continue;
            }
            try {
                EventDto saved = eventsService.sync(toEventDetail(
                        mapping.getInternalId(),
                        ownerUserId,
                        item,
                        uploadedImage == null ? null : uploadedImage.imageUrl()));
                if (saved == null || !StringUtils.hasText(saved.id())) {
                    discardImage(uploadedImage);
                    results.add(rejected(itemId, "not_allowed_or_invalid"));
                    continue;
                }
                results.add(success(itemId, saved.id(), "created"));
            } catch (RuntimeException exception) {
                discardImage(uploadedImage);
                results.add(rejected(itemId, "create_failed"));
            }
        }
        return new IntegrationSyncResponseDto(results);
    }

    private Map<String, MultipartFile> requireImageFiles(
            List<String> requestedItemIds,
            Map<String, MultipartFile> requestedImages) {
        if (requestedImages == null || requestedImages.isEmpty()) {
            return Map.of();
        }
        if (requestedImages.size() > IntegrationTokenService.MAX_BATCH_SIZE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A batch can contain at most " + IntegrationTokenService.MAX_BATCH_SIZE + " images.");
        }
        Set<String> itemIds = new HashSet<>();
        for (String value : requestedItemIds) {
            itemIds.add(normalizeItemId(value));
        }
        Map<String, MultipartFile> images = new HashMap<>();
        requestedImages.forEach((value, image) -> {
            String itemId = normalizeItemId(value);
            if (!isUuid(itemId)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Each image part name must be an item id UUID.");
            }
            if (!itemIds.contains(itemId)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Every image item id must be present in the request batch.");
            }
            if (images.putIfAbsent(itemId, image) != null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Each item id can have at most one image.");
            }
        });
        return Map.copyOf(images);
    }

    private StoredImageSet storeImage(
            String ownerUserId,
            String resourceType,
            String internalId,
            MultipartFile image) {
        if (image == null) {
            return null;
        }
        return mediaStorageService.storeImageSet(
                ownerUserId,
                resourceType + "-" + internalId,
                image);
    }

    private boolean resourceExists(
            String ownerUserId,
            String resourceType,
            String internalId) {
        if (RESOURCE_ASSET.equals(resourceType)) {
            return mongoTemplate.exists(
                    Query.query(Criteria.where("ownerUserId").is(ownerUserId)
                            .and("assetId").is(internalId)),
                    Asset.class);
        }
        return mongoTemplate.exists(
                Query.query(Criteria.where("ownerUserId").is(ownerUserId)
                        .and("sourceId").is(internalId)),
                ActivityEvent.class);
    }

    private void discardImage(StoredImageSet uploadedImage) {
        if (uploadedImage != null) {
            mediaStorageService.deletePublicObject(uploadedImage.imageUrl());
        }
    }

    private <T> List<T> requireBatch(List<T> items) {
        if (items == null || items.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A batch must contain at least one item.");
        }
        if (items.size() > IntegrationTokenService.MAX_BATCH_SIZE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A batch can contain at most " + IntegrationTokenService.MAX_BATCH_SIZE + " items.");
        }
        return items;
    }

    private Map<String, IntegrationExternalId> existingMappings(
            String ownerUserId,
            String resourceType,
            List<String> requestedItemIds) {
        Set<String> validIds = new LinkedHashSet<>();
        for (String requestedItemId : requestedItemIds) {
            String itemId = normalizeItemId(requestedItemId);
            if (isUuid(itemId)) {
                validIds.add(itemId);
            }
        }
        if (validIds.isEmpty()) {
            return Map.of();
        }
        Map<String, IntegrationExternalId> mappings = new HashMap<>();
        for (IntegrationExternalId mapping : externalIdsRepository
                .findByOwnerUserIdAndResourceTypeAndExternalIdIn(ownerUserId, resourceType, validIds)) {
            mappings.put(mapping.getExternalId(), mapping);
        }
        return mappings;
    }

    private IntegrationExternalId ensureMapping(
            String ownerUserId,
            String resourceType,
            String itemId) {
        String now = Instant.now().toString();
        Query query = Query.query(Criteria.where("ownerUserId").is(ownerUserId)
                .and("resourceType").is(resourceType)
                .and("externalId").is(itemId));
        Update update = new Update()
                .setOnInsert("id", UUID.randomUUID().toString())
                .setOnInsert("ownerUserId", ownerUserId)
                .setOnInsert("resourceType", resourceType)
                .setOnInsert("externalId", itemId)
                .setOnInsert("internalId", UUID.randomUUID().toString())
                .setOnInsert("createdAtIso", now)
                .set("updatedAtIso", now);
        IntegrationExternalId mapping = mongoTemplate.findAndModify(
                query,
                update,
                FindAndModifyOptions.options().upsert(true).returnNew(true),
                IntegrationExternalId.class);
        if (mapping == null || !StringUtils.hasText(mapping.getInternalId())) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to allocate a resource id.");
        }
        return mapping;
    }

    private AssetDetailDto toAssetDetail(
            String internalId,
            String ownerUserId,
            IntegrationAssetSyncItemDto item,
            String imageUrl) {
        return new AssetDetailDto(
                internalId,
                item.type(),
                item.title(),
                item.subtitle(),
                item.category(),
                item.city(),
                item.capacityTotal(),
                item.quantity(),
                item.details(),
                imageUrl,
                item.sourceLink(),
                item.routes() == null ? List.of() : item.routes(),
                false,
                List.of(),
                null,
                item.visibility(),
                null,
                ownerUserId,
                null,
                List.of(),
                null,
                List.of(),
                null,
                null,
                null);
    }

    private EventDetailDto toEventDetail(
            String internalId,
            String ownerUserId,
            IntegrationEventSyncItemDto item,
            String imageUrl) {
        int capacityMin = item.capacityMin();
        int capacityMax = item.capacityMax();
        String status = "draft".equalsIgnoreCase(normalize(item.status()))
                ? ActivityEvent.STATUS_DRAFT
                : ActivityEvent.STATUS_ACTIVE;
        return new EventDetailDto(
                null,
                internalId,
                ownerUserId,
                "hosting",
                status,
                null,
                List.of(ownerUserId),
                null,
                item.title(),
                item.subtitle(),
                null,
                null,
                0,
                0,
                null,
                ownerUserId,
                null,
                null,
                null,
                null,
                item.visibility(),
                "Open Event",
                item.startAt(),
                item.endAt(),
                null,
                imageUrl,
                item.sourceLink(),
                item.location(),
                null,
                capacityMin,
                capacityMax,
                capacityMax,
                capacityMax,
                false,
                false,
                "One-time",
                false,
                false,
                null,
                false,
                List.of(),
                false,
                List.of(),
                null,
                null,
                false,
                "main",
                null,
                List.of(),
                0,
                0,
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                null,
                item.topics() == null ? List.of() : item.topics(),
                "Mingle".equals(item.mode()),
                List.of(),
                List.of(),
                StringUtils.hasText(item.mode()) ? item.mode() : "Casual",
                item.mingleConfiguration(),
                null,
                0d,
                0d,
                0d,
                null,
                null,
                null,
                null,
                null);
    }

    private String validateAsset(
            IntegrationAssetSyncItemDto item,
            String itemId,
            Set<String> seen) {
        if (item == null) {
            return "item_required";
        }
        String common = validateCommon(itemId, item.title(), seen);
        if (common != null) {
            return common;
        }
        String type = normalize(item.type());
        if (!AssetCatalog.ASSET_TYPES.contains(type)) {
            return "valid_type_required";
        }
        if (item.capacityTotal() == null || item.capacityTotal() < 1) {
            return "capacity_total_must_be_positive";
        }
        if (item.quantity() == null || item.quantity() < 1) {
            return "quantity_must_be_positive";
        }
        if (AssetCatalog.TYPE_ACCOMMODATION.equals(type)
                && (item.routes() == null || item.routes().stream().noneMatch(StringUtils::hasText))) {
            return "accommodation_location_required";
        }
        return null;
    }

    private String validateEvent(
            IntegrationEventSyncItemDto item,
            String itemId,
            Set<String> seen) {
        if (item == null) {
            return "item_required";
        }
        String common = validateCommon(itemId, item.title(), seen);
        if (common != null) {
            return common;
        }
        if (!StringUtils.hasText(normalize(item.subtitle()))) {
            return "subtitle_required";
        }
        if (!isIsoInstant(item.startAt()) || !isIsoInstant(item.endAt())) {
            return "valid_start_and_end_required";
        }
        if (!Instant.parse(item.endAt()).isAfter(Instant.parse(item.startAt()))) {
            return "end_must_be_after_start";
        }
        if (item.capacityMin() == null || item.capacityMin() < 0) {
            return "capacity_min_must_be_non_negative";
        }
        if (item.capacityMax() == null || item.capacityMax() < item.capacityMin()) {
            return "capacity_max_must_not_be_less_than_min";
        }
        if (StringUtils.hasText(item.mode()) && !List.of("Casual", "Tournament", "Mingle").contains(item.mode())) {
            return "invalid_event_mode";
        }
        var config = item.mingleConfiguration();
        if (config != null && (!"Mingle".equals(item.mode())
                || config.groupSize() == null || config.groupSize() < 2 || config.groupSize() > 20
                || config.plannedRounds() == null || config.plannedRounds() < 1 || config.plannedRounds() > 100
                || config.roundDurationMinutes() == null || config.roundDurationMinutes() < 1 || config.roundDurationMinutes() > 240
                || config.breakDurationMinutes() == null || config.breakDurationMinutes() < 0 || config.breakDurationMinutes() > 60
                || config.requireGenderBalance() == null)) {
            return "invalid_mingle_configuration";
        }
        return null;
    }

    private String validateCommon(String itemId, String title, Set<String> seen) {
        if (!isUuid(itemId)) {
            return "id_must_be_uuid";
        }
        if (!seen.add(itemId)) {
            return "duplicate_id_in_batch";
        }
        if (!StringUtils.hasText(normalize(title))) {
            return "title_required";
        }
        return null;
    }

    private boolean isIsoInstant(String value) {
        try {
            Instant.parse(normalize(value));
            return true;
        } catch (RuntimeException ignored) {
            return false;
        }
    }

    private boolean isUuid(String value) {
        try {
            return UUID.fromString(value).toString().equalsIgnoreCase(value);
        } catch (RuntimeException ignored) {
            return false;
        }
    }

    private IntegrationSyncResultDto success(String id, String externalId, String result) {
        return new IntegrationSyncResultDto(id, externalId, result, null);
    }

    private IntegrationSyncResultDto rejected(String id, String error) {
        return new IntegrationSyncResultDto(id, null, "rejected", error);
    }

    private String normalizeItemId(String value) {
        String normalized = normalize(value);
        return normalized == null ? "" : normalized.toLowerCase();
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }
}
