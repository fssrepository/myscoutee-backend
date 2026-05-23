package com.raxim.myscoutee.profile.service;

import java.time.Duration;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.ShareToken;
import com.raxim.myscoutee.profile.data.dto.share.ShareTokenDtos.ShareTokenCreateRequestDto;
import com.raxim.myscoutee.profile.data.dto.share.ShareTokenDtos.ShareTokenResolvedItemDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.ShareTokensRepository;

@Service
public class ShareTokensService {
    private static final String TOKEN_PREFIX = "myscoutee:token:";
    private static final Duration TOKEN_TTL = Duration.ofHours(24);
    private static final String KIND_EVENT = "event";
    private static final String KIND_ASSET = "asset";
    private static final String KIND_ADMIN_HELP = "adminHelp";

    private final ShareTokensRepository shareTokensRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final AssetsRepository assetsRepository;

    public ShareTokensService(
            ShareTokensRepository shareTokensRepository,
            ActivityEventsRepository activityEventsRepository,
            AssetsRepository assetsRepository) {
        this.shareTokensRepository = shareTokensRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.assetsRepository = assetsRepository;
    }

    public String createToken(ShareTokenCreateRequestDto request) {
        if (request == null) {
            return "";
        }
        String kind = normalizeText(request.kind());
        String entityId = normalizeText(request.entityId());
        if ((!KIND_EVENT.equals(kind) && !KIND_ASSET.equals(kind) && !KIND_ADMIN_HELP.equals(kind))
                || !StringUtils.hasText(entityId)) {
            return "";
        }
        Instant now = Instant.now();
        ShareToken record = new ShareToken();
        record.setToken(TOKEN_PREFIX + UUID.randomUUID());
        record.setKind(kind);
        record.setEntityId(entityId);
        record.setAssetType(normalizeText(request.assetType()));
        record.setOwnerUserId(normalizeText(request.ownerUserId()));
        record.setCreatedAtIso(now.toString());
        record.setExpiresAtIso(now.plus(TOKEN_TTL).toString());
        return shareTokensRepository.save(record).getToken();
    }

    public ShareTokenResolvedItemDto resolveToken(String token, String userId) {
        String normalizedToken = normalizeText(token);
        if (!StringUtils.hasText(normalizedToken)) {
            return null;
        }
        Optional<ShareToken> record = shareTokensRepository.findByToken(normalizedToken);
        if (record.isEmpty() || isExpired(record.get())) {
            return null;
        }
        ShareToken shareToken = record.get();
        if (KIND_EVENT.equals(shareToken.getKind())) {
            return resolveEvent(shareToken);
        }
        if (KIND_ASSET.equals(shareToken.getKind())) {
            return resolveAsset(shareToken);
        }
        if (KIND_ADMIN_HELP.equals(shareToken.getKind())) {
            return resolveAdminHelp(shareToken);
        }
        return null;
    }

    private ShareTokenResolvedItemDto resolveEvent(ShareToken shareToken) {
        ActivityEvent event = findEvent(shareToken.getEntityId());
        if (event == null) {
            return null;
        }
        String eventId = StringUtils.hasText(event.getSourceId()) ? event.getSourceId() : event.getId();
        return new ShareTokenResolvedItemDto(
                KIND_EVENT,
                safeText(eventId),
                null,
                null,
                safeText(event.getTitle()),
                safeText(event.getTimeframe()),
                safeText(event.getSubtitle()),
                safeText(event.getImageUrl()),
                safeText(event.getSourceLink()));
    }

    private ShareTokenResolvedItemDto resolveAsset(ShareToken shareToken) {
        Asset asset = findAsset(shareToken.getEntityId());
        if (asset == null) {
            return null;
        }
        String assetId = StringUtils.hasText(asset.getAssetId()) ? asset.getAssetId() : asset.getId();
        String assetType = StringUtils.hasText(asset.getType()) ? asset.getType() : safeText(shareToken.getAssetType());
        return new ShareTokenResolvedItemDto(
                KIND_ASSET,
                assetId,
                assetType,
                safeText(asset.getOwnerUserId()),
                safeText(asset.getTitle()),
                joinNonBlank(List.of(assetType, safeText(asset.getCity())), " - "),
                StringUtils.hasText(asset.getDetails()) ? asset.getDetails() : safeText(asset.getSubtitle()),
                safeText(asset.getImageUrl()),
                safeText(asset.getSourceLink()));
    }

    private ShareTokenResolvedItemDto resolveAdminHelp(ShareToken shareToken) {
        return new ShareTokenResolvedItemDto(
                KIND_ADMIN_HELP,
                safeText(shareToken.getEntityId()),
                null,
                safeText(shareToken.getOwnerUserId()),
                "Shared help view",
                "MyScoutee support session",
                "The user allowed MyScoutee admin to open their current app view.",
                null,
                safeText(shareToken.getEntityId()));
    }

    private ActivityEvent findEvent(String entityId) {
        String normalizedId = normalizeText(entityId);
        if (!StringUtils.hasText(normalizedId)) {
            return null;
        }
        ActivityEvent byId = activityEventsRepository.findById(normalizedId).orElse(null);
        if (byId != null) {
            return byId;
        }
        return activityEventsRepository.findBySourceId(normalizedId).stream()
                .min(Comparator
                        .comparing((ActivityEvent event) -> !Boolean.TRUE.equals(event.getPublished()))
                        .thenComparing(event -> !"active".equals(event.getStatus())))
                .orElse(null);
    }

    private Asset findAsset(String entityId) {
        String normalizedId = normalizeText(entityId);
        if (!StringUtils.hasText(normalizedId)) {
            return null;
        }
        Asset byId = assetsRepository.findById(normalizedId).orElse(null);
        if (byId != null) {
            return byId;
        }
        return assetsRepository.findByAssetId(normalizedId).orElse(null);
    }

    private boolean isExpired(ShareToken record) {
        try {
            return !StringUtils.hasText(record.getExpiresAtIso())
                    || !Instant.parse(record.getExpiresAtIso()).isAfter(Instant.now());
        } catch (DateTimeParseException ex) {
            return true;
        }
    }

    private String joinNonBlank(List<String> values, String delimiter) {
        return values.stream()
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .reduce((first, second) -> first + delimiter + second)
                .orElse("");
    }

    private String normalizeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
