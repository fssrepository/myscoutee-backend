package com.raxim.myscoutee.profile.service;

import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.bson.types.ObjectId;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.http.HttpStatus;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.IndexInfo;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import tools.jackson.databind.ObjectMapper;
import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.HelpCenterAuditEntry;
import com.raxim.myscoutee.profile.data.document.HelpCenterRevision;
import com.raxim.myscoutee.profile.data.document.HelpCenterRevision.HelpCenterSection;
import com.raxim.myscoutee.profile.data.document.PrivacyConsent;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterAdminActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterAuditEntryDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.ContentLanguageDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterRevisionDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterRevisionSaveRequestDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterSectionDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterStateDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.PrivacyConsentDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.PrivacyConsentSaveRequestDto;
import com.raxim.myscoutee.profile.repository.HelpCenterAuditRepository;
import com.raxim.myscoutee.profile.repository.HelpCenterRevisionsRepository;
import com.raxim.myscoutee.profile.repository.PrivacyConsentsRepository;

@Service
public class HelpCenterService {
    private static final String DOCUMENT_HELP = "help";
    private static final String DOCUMENT_PRIVACY = "privacy";
    private static final String DOCUMENT_EXPLANATION = "explanation";
    private static final String DEFAULT_LANG = "en";
    private static final String LEGACY_VERSION_INDEX = "help_revision_version";
    private static final String DEFAULT_SEED_RESOURCE_PREFIX = "classpath:mongo-seed/profile/helpCenter";
    private static final String DEFAULT_HELP_DESCRIPTION = "MyScoutee helps you plan events end-to-end: invite people, split into stages/groups, assign resources, and coordinate in context chats.";
    private static final String DEFAULT_PRIVACY_DESCRIPTION = "Before continuing, please review and accept how your data is used in MyScoutee.";
    private static final String DEFAULT_EXPLANATION_DESCRIPTION = "Short in-app guidance for the selected screen.";
    private static final String DEFAULT_EXPLANATION_CONTEXT = "home.game";
    private static final String EXPLANATION_ACTIVITY_RATES_CONTEXT = "activities.rates";
    private static final String EXPLANATION_CHATS_CONTEXT = "chats";
    private static final String EXPLANATION_CONTACTS_CONTEXT = "contacts";
    private static final String EXPLANATION_ASSETS_CONTEXT = "assets";
    private static final String EXPLANATION_ASSETS_CAR_CONTEXT = "assets.car";
    private static final String EXPLANATION_ASSETS_ACCOMMODATION_CONTEXT = "assets.accommodation";
    private static final String EXPLANATION_ASSETS_SUPPLIES_CONTEXT = "assets.supplies";
    private static final String EXPLANATION_ASSETS_TICKETS_CONTEXT = "assets.tickets";
    private static final String EXPLANATION_EVENTS_CONTEXT = "events";
    private static final String EXPLANATION_EVENT_EDITOR_CONTEXT = "event.editor";
    private static final String HOME_AFFINITY_NETWORK_SECTION_ID = "affinity-network";
    private static final String LEGACY_EXPLANATION_FILTER_COUNT_COPY_EN = "The number shows how many filter groups are active.";
    private static final String UPDATED_EXPLANATION_FILTER_COUNT_COPY_EN = "The number shows how many results match the selected filter condition.";
    private static final String LEGACY_EXPLANATION_FILTER_COUNT_COPY_HU = "A szám azt mutatja, hány szűrőcsoport aktív.";
    private static final String UPDATED_EXPLANATION_FILTER_COUNT_COPY_HU = "A szám azt mutatja, hogy az adott szűrőfeltétel mellett hány találat van.";
    private static final Set<String> LEGACY_ACTIVITY_RATES_EXPLANATION_SECTION_IDS = Set.of(
            "activity-tabs",
            "activity-distance-sort",
            "activity-card-actions",
            "activity-panel-actions");
    private static final Set<String> EXPLANATION_CONTEXT_KEYS = Set.of(
            "home.game",
            "activities.rates",
            EXPLANATION_CHATS_CONTEXT,
            EXPLANATION_CONTACTS_CONTEXT,
            "profile.editor",
            "profile.view",
            EXPLANATION_ASSETS_CONTEXT,
            EXPLANATION_ASSETS_CAR_CONTEXT,
            EXPLANATION_ASSETS_ACCOMMODATION_CONTEXT,
            EXPLANATION_ASSETS_SUPPLIES_CONTEXT,
            EXPLANATION_ASSETS_TICKETS_CONTEXT,
            EXPLANATION_EVENTS_CONTEXT,
            EXPLANATION_EVENT_EDITOR_CONTEXT,
            "event.feedback");
    private static final Safelist HELP_HTML_SAFELIST = Safelist.relaxed()
            .addTags("section", "article", "figure", "figcaption", "h3", "h4")
            .addAttributes(":all", "class")
            .addAttributes("img", "src", "alt", "title")
            .addAttributes("a", "target", "rel")
            .addProtocols("a", "href", "http", "https", "mailto")
            .addProtocols("img", "src", "http", "https", "data", "blob")
            .preserveRelativeLinks(true);

    private final ConfigProperties configProperties;
    private final HelpCenterRevisionsRepository revisionsRepository;
    private final HelpCenterAuditRepository auditRepository;
    private final PrivacyConsentsRepository privacyConsentsRepository;
    private final MongoTemplate mongoTemplate;
    private final ObjectMapper objectMapper;
    private final ResourceLoader resourceLoader;
    private final AdminTelemetryService adminTelemetryService;

    public HelpCenterService(
            ConfigProperties configProperties,
            HelpCenterRevisionsRepository revisionsRepository,
            HelpCenterAuditRepository auditRepository,
            PrivacyConsentsRepository privacyConsentsRepository,
            MongoTemplate mongoTemplate,
            ObjectMapper objectMapper,
            ResourceLoader resourceLoader,
            AdminTelemetryService adminTelemetryService) {
        this.configProperties = configProperties;
        this.revisionsRepository = revisionsRepository;
        this.auditRepository = auditRepository;
        this.privacyConsentsRepository = privacyConsentsRepository;
        this.mongoTemplate = mongoTemplate;
        this.objectMapper = objectMapper;
        this.resourceLoader = resourceLoader;
        this.adminTelemetryService = adminTelemetryService;
    }

    public HelpCenterStateDto activeState() {
        return activeState(DOCUMENT_HELP);
    }

    public HelpCenterStateDto activeState(String documentType) {
        return activeState(documentType, DEFAULT_LANG);
    }

    public HelpCenterStateDto activeState(String documentType, String lang) {
        return activeState(documentType, lang, DEFAULT_LANG);
    }

    public HelpCenterStateDto activeState(String documentType, String lang, String acceptLanguage) {
        return activeState(documentType, lang, acceptLanguage, null);
    }

    public HelpCenterStateDto activeState(String documentType, String lang, String acceptLanguage, String contextKey) {
        String kind = documentKind(documentType);
        String language = requestContentLang(lang, acceptLanguage);
        String context = contextKey(kind, contextKey, false);
        if (DOCUMENT_EXPLANATION.equals(kind) && !StringUtils.hasText(context)) {
            return new HelpCenterStateDto(null, List.of(), List.of(), contentLanguages());
        }
        ensureDefaultRevision(kind, language, context);
        HelpCenterRevision active = revisionsForKind(
                    revisionsRepository.findAllByOrderByVersionDesc(),
                    kind,
                    language,
                    context)
                .stream()
                .filter(revision -> Boolean.TRUE.equals(revision.getActive()))
                .max(Comparator.comparing(HelpCenterRevision::getVersion, Comparator.nullsLast(Integer::compareTo)))
                .orElse(null);
        return new HelpCenterStateDto(
                active == null ? null : toRevisionDto(active),
                active == null ? List.of() : List.of(toRevisionDto(active)),
                List.of(),
                contentLanguages());
    }

    public HelpCenterStateDto adminState(String adminUserId) {
        return adminState(adminUserId, DOCUMENT_HELP);
    }

    public HelpCenterStateDto adminState(String adminUserId, String documentType) {
        return adminState(adminUserId, documentType, DEFAULT_LANG);
    }

    public HelpCenterStateDto adminState(String adminUserId, String documentType, String lang) {
        return adminState(adminUserId, documentType, lang, null);
    }

    public HelpCenterStateDto adminState(String adminUserId, String documentType, String lang, String contextKey) {
        String kind = documentKind(documentType);
        String language = contentLang(lang);
        String context = contextKey(kind, contextKey, false);
        ensureAdmin(adminUserId);
        ensureDefaultRevision(kind, language, context);
        return fullState(kind, language, context);
    }

    public HelpCenterStateDto saveRevision(HelpCenterRevisionSaveRequestDto request) {
        return saveRevision(request, DOCUMENT_HELP);
    }

    public HelpCenterStateDto saveRevision(HelpCenterRevisionSaveRequestDto request, String documentType) {
        String kind = documentKind(documentType);
        String language = contentLang(request == null ? null : request.lang());
        String context = contextKey(kind, request == null ? null : request.contextKey(), true);
        String actorUserId = ensureAdmin(request == null ? null : request.actorUserId());
        ensureDefaultRevision(kind, language, context);
        List<HelpCenterSection> sections = normalizeSections(request == null ? null : request.sections(), kind);
        List<HelpCenterRevision> currentRevisions = revisionsForKind(revisionsRepository.findAllByOrderByVersionDesc(), kind, language, context);
        Integer nextVersion = currentRevisions.stream()
                .map(HelpCenterRevision::getVersion)
                .filter(value -> value != null && value > 0)
                .max(Integer::compareTo)
                .orElse(0) + 1;
        String nowIso = Instant.now().toString();
        HelpCenterRevision revision = new HelpCenterRevision();
        revision.setDocumentType(kind);
        revision.setLang(language);
        revision.setContextKey(context);
        revision.setLanguageLabel(languageLabel(language));
        revision.setVersion(nextVersion);
        revision.setActive(false);
        revision.setTitle(text(request == null ? null : request.title(), defaultTitle(kind, nextVersion, language)));
        revision.setSummary(text(request == null ? null : request.summary(), defaultSummary(kind, language, context)));
        revision.setDescription(text(request == null ? null : request.description(), defaultDescription(kind, language)));
        revision.setHeaderColor(headerColor(request == null ? null : request.headerColor()));
        revision.setSections(sections);
        revision.setCreatedDate(nowIso);
        revision.setCreatedUser(actorUserId);
        revision.setUpdatedDate(nowIso);
        revision.setUpdatedUser(actorUserId);

        HelpCenterRevision saved = revisionsRepository.save(revision);
        String baseRevisionId = normalize(request == null ? null : request.baseRevisionId());
        audit("create", actorUserId, saved, StringUtils.hasText(baseRevisionId)
                ? "Created v" + saved.getVersion() + " from " + baseRevisionId + "."
                : "Created v" + saved.getVersion() + ".");
        adminTelemetryService.record("content.revision.saved", "content", saved.getId(), actorUserId);
        return fullState(kind, language);
    }

    public HelpCenterStateDto activateRevision(String revisionId, HelpCenterAdminActionRequestDto request) {
        return activateRevision(revisionId, request, DOCUMENT_HELP);
    }

    public HelpCenterStateDto activateRevision(String revisionId, HelpCenterAdminActionRequestDto request, String documentType) {
        String kind = documentKind(documentType);
        String actorUserId = ensureAdmin(request == null ? null : request.actorUserId());
        String normalizedRevisionId = normalize(revisionId);
        HelpCenterRevision target = revisionsRepository.findById(normalizedRevisionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, documentLabel(kind) + " revision not found."));
        if (!kind.equals(revisionKind(target))) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, documentLabel(kind) + " revision not found.");
        }
        String language = revisionLang(target);
        String targetContext = revisionContext(target);
        List<HelpCenterRevision> revisions = revisionsRepository.findAllByOrderByVersionDesc();
        for (HelpCenterRevision revision : revisions) {
            String revisionKind = revisionKind(revision);
            String revisionLang = revisionLang(revision);
            String revisionContext = revisionContext(revision);
            revision.setDocumentType(revisionKind);
            revision.setLang(revisionLang);
            revision.setContextKey(revisionContext);
            revision.setLanguageLabel(languageLabel(revisionLang));
            if (kind.equals(revisionKind) && language.equals(revisionLang) && targetContext.equals(revisionContext)) {
                revision.setActive(normalizedRevisionId.equals(revision.getId()));
            }
        }
        revisionsRepository.saveAll(revisions);
        audit("activate", actorUserId, target, "Activated v" + target.getVersion() + ".");
        adminTelemetryService.record("content.revision.activated", "content", target.getId(), actorUserId);
        return fullState(kind, language);
    }

    public HelpCenterStateDto deleteRevision(String revisionId, HelpCenterAdminActionRequestDto request) {
        return deleteRevision(revisionId, request, DOCUMENT_HELP);
    }

    public HelpCenterStateDto deleteRevision(String revisionId, HelpCenterAdminActionRequestDto request, String documentType) {
        String kind = documentKind(documentType);
        String actorUserId = ensureAdmin(request == null ? null : request.actorUserId());
        String normalizedRevisionId = normalize(revisionId);
        HelpCenterRevision target = revisionsRepository.findById(normalizedRevisionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, documentLabel(kind) + " revision not found."));
        if (!kind.equals(revisionKind(target))) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, documentLabel(kind) + " revision not found.");
        }
        String language = revisionLang(target);
        String targetContext = revisionContext(target);
        boolean wasActive = Boolean.TRUE.equals(target.getActive());
        revisionsRepository.delete(target);
        audit("delete", actorUserId, target, "Deleted v" + target.getVersion() + ".");
        adminTelemetryService.record("content.revision.deleted", "content", target.getId(), actorUserId);
        if (wasActive) {
            revisionsForKind(revisionsRepository.findAllByOrderByVersionDesc(), kind, language, targetContext).stream().findFirst().ifPresent(next -> {
                next.setActive(true);
                next.setDocumentType(kind);
                next.setLang(language);
                next.setContextKey(targetContext);
                next.setLanguageLabel(languageLabel(language));
                revisionsRepository.save(next);
            });
        }
        return fullState(kind, language);
    }

    public PrivacyConsentDto privacyConsent(String userId, String revisionId, Integer revisionVersion) {
        String normalizedUserId = normalize(userId);
        String normalizedRevisionId = normalize(revisionId);
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedRevisionId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User and privacy revision are required.");
        }
        return privacyConsentsRepository.findByUserIdAndRevisionId(normalizedUserId, normalizedRevisionId)
                .or(() -> privacyConsentsRepository.findTopByUserIdOrderByUpdatedAtIsoDesc(normalizedUserId))
                .map(this::toPrivacyConsentDto)
                .orElse(null);
    }

    public PrivacyConsentDto savePrivacyConsent(PrivacyConsentSaveRequestDto request) {
        String userId = normalize(request == null ? null : request.userId());
        String revisionId = normalize(request == null ? null : request.revisionId());
        if (!StringUtils.hasText(userId) || !StringUtils.hasText(revisionId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User and privacy revision are required.");
        }

        ensureDefaultRevision(DOCUMENT_PRIVACY);
        HelpCenterRevision revision = revisionsRepository.findById(revisionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Privacy revision not found."));
        if (!DOCUMENT_PRIVACY.equals(revisionKind(revision))) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Privacy revision not found.");
        }

        String nowIso = Instant.now().toString();
        PrivacyConsent consent = privacyConsentsRepository.findByUserIdAndRevisionId(userId, revisionId)
                .orElseGet(PrivacyConsent::new);
        int revisionVersion = Math.max(1, revision.getVersion() == null ? 1 : revision.getVersion());
        int currentConsentVersion = consent.getRevisionVersion() == null ? 0 : consent.getRevisionVersion();
        if (!StringUtils.hasText(consent.getId())) {
            consent.setId(new ObjectId().toHexString());
        }
        if (!StringUtils.hasText(consent.getAcceptedAtIso()) || currentConsentVersion < revisionVersion) {
            consent.setAcceptedAtIso(nowIso);
        }
        consent.setUserId(userId);
        consent.setRevisionId(revisionId);
        consent.setRevisionVersion(revisionVersion);
        consent.setApprovedOptionalSectionIds(normalizeOptionalConsentSectionIds(
                request == null ? null : request.approvedOptionalSectionIds(),
                revision));
        consent.setUpdatedAtIso(nowIso);
        consent.setSource(privacyConsentSource(request == null ? null : request.source()));
        return toPrivacyConsentDto(privacyConsentsRepository.save(consent));
    }

    private HelpCenterStateDto fullState(String kind, String lang) {
        return fullState(kind, lang, null);
    }

    private HelpCenterStateDto fullState(String kind, String lang, String contextKey) {
        String language = contentLang(lang);
        String context = contextKey(kind, contextKey, false);
        List<HelpCenterRevision> revisions = revisionsForKind(revisionsRepository.findAllByOrderByVersionDesc(), kind, language, context);
        HelpCenterRevision active = revisions.stream()
                .filter(revision -> Boolean.TRUE.equals(revision.getActive()))
                .max(Comparator.comparing(HelpCenterRevision::getVersion, Comparator.nullsLast(Integer::compareTo)))
                .orElse(null);
        List<HelpCenterAuditEntry> auditTrail = auditRepository.findAllByOrderByCreatedDateDesc().stream()
                .filter(entry -> kind.equals(auditKind(entry)))
                .filter(entry -> language.equals(auditLang(entry)))
                .toList();
        return new HelpCenterStateDto(
                active == null ? null : toRevisionDto(active),
                revisions.stream().map(this::toRevisionDto).toList(),
                auditTrail.stream().map(this::toAuditDto).toList(),
                contentLanguages());
    }

    private void ensureDefaultRevision(String kind) {
        ensureDefaultRevision(kind, DEFAULT_LANG);
    }

    private void ensureDefaultRevision(String kind, String lang) {
        ensureDefaultRevision(kind, lang, null);
    }

    private void ensureDefaultRevision(String kind, String lang, String contextKey) {
        String context = contextKey(kind, contextKey, false);
        if (DOCUMENT_EXPLANATION.equals(kind) && !StringUtils.hasText(context)) {
            ensureDefaultRevision(kind, lang, DEFAULT_EXPLANATION_CONTEXT);
            ensureDefaultRevision(kind, lang, EXPLANATION_ACTIVITY_RATES_CONTEXT);
            ensureDefaultRevision(kind, lang, EXPLANATION_CHATS_CONTEXT);
            ensureDefaultRevision(kind, lang, EXPLANATION_ASSETS_CONTEXT);
            ensureDefaultRevision(kind, lang, EXPLANATION_ASSETS_CAR_CONTEXT);
            ensureDefaultRevision(kind, lang, EXPLANATION_ASSETS_ACCOMMODATION_CONTEXT);
            ensureDefaultRevision(kind, lang, EXPLANATION_ASSETS_SUPPLIES_CONTEXT);
            ensureDefaultRevision(kind, lang, EXPLANATION_ASSETS_TICKETS_CONTEXT);
            ensureDefaultRevision(kind, lang, EXPLANATION_EVENTS_CONTEXT);
            ensureDefaultRevision(kind, lang, EXPLANATION_EVENT_EDITOR_CONTEXT);
            return;
        }
        dropLegacyVersionIndex();
        backfillDocumentTypes();
        for (ContentLanguageDto contentLanguage : contentLanguages()) {
            String language = contentLang(contentLanguage.lang());
            if (!revisionsForKind(revisionsRepository.findAllByOrderByVersionDesc(), kind, language, context).isEmpty()) {
                backfillExplanationFilterCountCopy(kind, language);
                backfillActivityRatesExplanationCopy(kind, language);
                backfillChatsExplanationCopy(kind, language);
                backfillAssetsExplanationCopy(kind, language);
                backfillEventsExplanationCopy(kind, language);
                backfillEventEditorExplanationCopy(kind, language);
                backfillHomeAffinityNetworkExplanation(kind, language);
                continue;
            }
            String nowIso = Instant.now().toString();
            HelpCenterRevision revision = seedRevision(kind, language, context);
            revision.setDocumentType(kind);
            revision.setLang(language);
            revision.setContextKey(revisionContext(revision));
            revision.setLanguageLabel(languageLabel(language));
            revision.setVersion(revision.getVersion() == null || revision.getVersion() <= 0 ? 1 : revision.getVersion());
            revision.setActive(true);
            revision.setTitle(text(revision.getTitle(), defaultRevisionTitle(kind, language, context)));
            revision.setSummary(text(revision.getSummary(), defaultSummary(kind, language, context)));
            revision.setDescription(text(revision.getDescription(), defaultDescription(kind, language)));
            revision.setHeaderColor(headerColor(revision.getHeaderColor()));
            revision.setSections(revision.getSections() == null || revision.getSections().isEmpty()
                    ? defaultSections(kind, language, context)
                    : normalizeSections(revision.getSections().stream().map(this::toSectionDtoForSeed).toList(), kind));
            revision.setCreatedDate(nowIso);
            revision.setCreatedUser("system");
            revision.setUpdatedDate(nowIso);
            revision.setUpdatedUser("system");
            HelpCenterRevision saved = revisionsRepository.save(revision);
            audit("seed", "system", saved, "Seeded default " + documentLabel(kind).toLowerCase(Locale.ROOT) + " revision v1.");
            backfillExplanationFilterCountCopy(kind, language);
            backfillActivityRatesExplanationCopy(kind, language);
            backfillChatsExplanationCopy(kind, language);
            backfillAssetsExplanationCopy(kind, language);
            backfillEventsExplanationCopy(kind, language);
            backfillEventEditorExplanationCopy(kind, language);
            backfillHomeAffinityNetworkExplanation(kind, language);
        }
    }

    private void backfillExplanationFilterCountCopy(String kind, String lang) {
        if (!DOCUMENT_EXPLANATION.equals(kind)) {
            return;
        }
        String language = contentLang(lang);
        String legacyCopy = "hu".equals(language)
                ? LEGACY_EXPLANATION_FILTER_COUNT_COPY_HU
                : LEGACY_EXPLANATION_FILTER_COUNT_COPY_EN;
        String updatedCopy = "hu".equals(language)
                ? UPDATED_EXPLANATION_FILTER_COUNT_COPY_HU
                : UPDATED_EXPLANATION_FILTER_COUNT_COPY_EN;
        List<HelpCenterRevision> revisions = revisionsForKind(
                revisionsRepository.findAllByOrderByVersionDesc(),
                DOCUMENT_EXPLANATION,
                language);
        for (HelpCenterRevision revision : revisions) {
            boolean changed = false;
            for (HelpCenterSection section : revision.getSections()) {
                if (!"filters".equals(section.getId()) || !StringUtils.hasText(section.getContentHtml())) {
                    continue;
                }
                String updatedHtml = section.getContentHtml().replace(legacyCopy, updatedCopy);
                if (!updatedHtml.equals(section.getContentHtml())) {
                    section.setContentHtml(updatedHtml);
                    changed = true;
                }
            }
            if (changed) {
                revisionsRepository.save(revision);
            }
        }
    }

    private void backfillActivityRatesExplanationCopy(String kind, String lang) {
        if (!DOCUMENT_EXPLANATION.equals(kind)) {
            return;
        }
        String language = contentLang(lang);
        List<HelpCenterRevision> revisions = revisionsForKind(
                revisionsRepository.findAllByOrderByVersionDesc(),
                DOCUMENT_EXPLANATION,
                language,
                EXPLANATION_ACTIVITY_RATES_CONTEXT);
        for (HelpCenterRevision revision : revisions) {
            if (!isLegacyActivityRatesExplanation(revision)) {
                continue;
            }
            revision.setTitle(defaultRevisionTitle(DOCUMENT_EXPLANATION, language, EXPLANATION_ACTIVITY_RATES_CONTEXT));
            revision.setSummary(defaultSummary(DOCUMENT_EXPLANATION, language, EXPLANATION_ACTIVITY_RATES_CONTEXT));
            revision.setSections(defaultActivityRatesExplanationSections(language));
            revision.setUpdatedDate(Instant.now().toString());
            revision.setUpdatedUser(StringUtils.hasText(revision.getUpdatedUser()) ? revision.getUpdatedUser() : "system");
            revisionsRepository.save(revision);
        }
    }

    private void backfillChatsExplanationCopy(String kind, String lang) {
        if (!DOCUMENT_EXPLANATION.equals(kind)) {
            return;
        }
        String language = contentLang(lang);
        List<HelpCenterRevision> revisions = revisionsForKind(
                revisionsRepository.findAllByOrderByVersionDesc(),
                DOCUMENT_EXPLANATION,
                language,
                EXPLANATION_CHATS_CONTEXT);
        for (HelpCenterRevision revision : revisions) {
            if (!isLegacyChatsExplanation(revision)) {
                continue;
            }
            revision.setTitle(defaultRevisionTitle(DOCUMENT_EXPLANATION, language, EXPLANATION_CHATS_CONTEXT));
            revision.setSummary(defaultSummary(DOCUMENT_EXPLANATION, language, EXPLANATION_CHATS_CONTEXT));
            revision.setSections(defaultChatsExplanationSections(language));
            revision.setUpdatedDate(Instant.now().toString());
            revision.setUpdatedUser(StringUtils.hasText(revision.getUpdatedUser()) ? revision.getUpdatedUser() : "system");
            revisionsRepository.save(revision);
        }
    }

    private void backfillAssetsExplanationCopy(String kind, String lang) {
        if (!DOCUMENT_EXPLANATION.equals(kind)) {
            return;
        }
        String language = contentLang(lang);
        List<HelpCenterRevision> revisions = revisionsForKind(
                revisionsRepository.findAllByOrderByVersionDesc(),
                DOCUMENT_EXPLANATION,
                language,
                EXPLANATION_ASSETS_CONTEXT);
        for (HelpCenterRevision revision : revisions) {
            if (!isLegacyAssetsExplanation(revision)) {
                continue;
            }
            revision.setTitle(defaultRevisionTitle(DOCUMENT_EXPLANATION, language, EXPLANATION_ASSETS_CONTEXT));
            revision.setSummary(defaultSummary(DOCUMENT_EXPLANATION, language, EXPLANATION_ASSETS_CONTEXT));
            revision.setSections(defaultAssetsExplanationSections(language));
            revision.setUpdatedDate(Instant.now().toString());
            revision.setUpdatedUser(StringUtils.hasText(revision.getUpdatedUser()) ? revision.getUpdatedUser() : "system");
            revisionsRepository.save(revision);
        }
    }

    private void backfillEventsExplanationCopy(String kind, String lang) {
        if (!DOCUMENT_EXPLANATION.equals(kind)) {
            return;
        }
        String language = contentLang(lang);
        List<HelpCenterRevision> revisions = revisionsForKind(
                revisionsRepository.findAllByOrderByVersionDesc(),
                DOCUMENT_EXPLANATION,
                language,
                EXPLANATION_EVENTS_CONTEXT);
        for (HelpCenterRevision revision : revisions) {
            if (!isLegacyEventsExplanation(revision)) {
                continue;
            }
            revision.setTitle(defaultRevisionTitle(DOCUMENT_EXPLANATION, language, EXPLANATION_EVENTS_CONTEXT));
            revision.setSummary(defaultSummary(DOCUMENT_EXPLANATION, language, EXPLANATION_EVENTS_CONTEXT));
            revision.setSections(defaultEventsExplanationSections(language));
            revision.setUpdatedDate(Instant.now().toString());
            revision.setUpdatedUser(StringUtils.hasText(revision.getUpdatedUser()) ? revision.getUpdatedUser() : "system");
            revisionsRepository.save(revision);
        }
    }

    private void backfillEventEditorExplanationCopy(String kind, String lang) {
        if (!DOCUMENT_EXPLANATION.equals(kind)) {
            return;
        }
        String language = contentLang(lang);
        List<HelpCenterRevision> revisions = revisionsForKind(
                revisionsRepository.findAllByOrderByVersionDesc(),
                DOCUMENT_EXPLANATION,
                language,
                EXPLANATION_EVENT_EDITOR_CONTEXT);
        for (HelpCenterRevision revision : revisions) {
            if (!isLegacyEventEditorExplanation(revision)) {
                continue;
            }
            revision.setTitle(defaultRevisionTitle(DOCUMENT_EXPLANATION, language, EXPLANATION_EVENT_EDITOR_CONTEXT));
            revision.setSummary(defaultSummary(DOCUMENT_EXPLANATION, language, EXPLANATION_EVENT_EDITOR_CONTEXT));
            revision.setSections(defaultEventEditorExplanationSections(language));
            revision.setUpdatedDate(Instant.now().toString());
            revision.setUpdatedUser(StringUtils.hasText(revision.getUpdatedUser()) ? revision.getUpdatedUser() : "system");
            revisionsRepository.save(revision);
        }
    }

    private void backfillHomeAffinityNetworkExplanation(String kind, String lang) {
        if (!DOCUMENT_EXPLANATION.equals(kind)) {
            return;
        }
        String language = contentLang(lang);
        List<HelpCenterRevision> revisions = revisionsForKind(
                revisionsRepository.findAllByOrderByVersionDesc(),
                DOCUMENT_EXPLANATION,
                language,
                DEFAULT_EXPLANATION_CONTEXT);
        for (HelpCenterRevision revision : revisions) {
            List<HelpCenterSection> sections = revision.getSections() == null
                    ? new ArrayList<>()
                    : new ArrayList<>(revision.getSections());
            boolean hasSection = sections.stream()
                    .anyMatch(section -> HOME_AFFINITY_NETWORK_SECTION_ID.equals(normalize(section.getId())));
            boolean hasLegacySection = sections.stream()
                    .anyMatch(this::isLegacyHomeAffinityNetworkSection);
            if (hasSection && !hasLegacySection) {
                continue;
            }
            HelpCenterSection replacement = homeAffinityNetworkSection(language);
            int insertIndex = sections.size();
            for (int index = 0; index < sections.size(); index++) {
                HelpCenterSection section = sections.get(index);
                if (HOME_AFFINITY_NETWORK_SECTION_ID.equals(normalize(section.getId()))) {
                    sections.set(index, replacement);
                    insertIndex = -1;
                    break;
                }
                if ("affinity".equals(normalize(section.getId()))) {
                    insertIndex = index + 1;
                }
            }
            if (insertIndex >= 0) {
                sections.add(insertIndex, replacement);
            }
            revision.setSections(sections);
            revision.setUpdatedDate(Instant.now().toString());
            revision.setUpdatedUser(StringUtils.hasText(revision.getUpdatedUser()) ? revision.getUpdatedUser() : "system");
            revisionsRepository.save(revision);
        }
    }

    private boolean isLegacyHomeAffinityNetworkSection(HelpCenterSection section) {
        if (section == null || !HOME_AFFINITY_NETWORK_SECTION_ID.equals(normalize(section.getId()))) {
            return false;
        }
        String title = text(section.getTitle(), "");
        String blurb = text(section.getBlurb(), "");
        String contentHtml = text(section.getContentHtml(), "");
        return "Affinity and group matching".equals(title)
                || "Your score is compared with the crowd, not read alone.".equals(blurb)
                || "Az értéked a tömeghez képest értelmeződik.".equals(blurb)
                || contentHtml.contains("social graph")
                || contentHtml.contains("kapcsolati gráf")
                || contentHtml.contains("affinity edges")
                || contentHtml.contains("szimpátia-edge");
    }

    private boolean isLegacyActivityRatesExplanation(HelpCenterRevision revision) {
        if (revision == null || revision.getSections() == null) {
            return false;
        }
        return revision.getSections().stream().anyMatch(section -> {
            String id = normalize(section.getId());
            String title = text(section.getTitle(), "");
            String contentHtml = text(section.getContentHtml(), "");
            return LEGACY_ACTIVITY_RATES_EXPLANATION_SECTION_IDS.contains(id)
                    || "Panel actions".equals(title)
                    || "Panelműveletek".equals(title)
                    || "Activity menu".equals(title)
                    || "Tevékenység menü".equals(title)
                    || "Rating list".equals(title)
                    || "Értékelési lista".equals(title)
                    || "Star rating badge".equals(title)
                    || "Csillagos értékelő jelvény".equals(title)
                    || "Scoring a card".equals(title)
                    || "Kártya pontozása".equals(title)
                    || contentHtml.contains("The top-right controls change the panel mode or close it.")
                    || contentHtml.contains("A jobb felső gombok módot váltanak vagy bezárják a panelt.")
                    || contentHtml.contains("The first toolbar menu switches the whole Activities panel.")
                    || contentHtml.contains("Az első eszköztári menü az egész Tevékenységek panelt váltja.")
                    || contentHtml.contains("The star badge is the rating control, not a generic card score.")
                    || contentHtml.contains("A csillagos jelvény az értékelés vezérlője, nem általános kártyapont.")
                    || contentHtml.contains("Use the filter menu to switch between Given, Received, Mutual, Met, and Suggestions.")
                    || contentHtml.contains("A szűrőmenüvel válthatsz: adott, kapott, kölcsönös, találkozott és javaslatok.")
                    || contentHtml.contains("The fullscreen button opens a focused rating flow.")
                    || contentHtml.contains("A teljes képernyő ikon fókuszált értékelési folyamatot nyit.");
        });
    }

    private boolean isLegacyAssetsExplanation(HelpCenterRevision revision) {
        if (revision == null || revision.getSections() == null) {
            return false;
        }
        if (!EXPLANATION_ASSETS_CONTEXT.equals(revisionContext(revision))) {
            return false;
        }
        String revisionTitle = text(revision.getTitle(), "");
        if ("Home explanation".equals(revisionTitle)
                || "Kezdőlap magyarázat".equals(revisionTitle)
                || "Your assets and tickets".equals(revisionTitle)
                || "Saját eszközök és jegyek".equals(revisionTitle)) {
            return true;
        }
        if (revision.getSections().stream().noneMatch(section -> "assets-entry".equals(normalize(section.getId())))) {
            return true;
        }
        return revision.getSections().stream().anyMatch(section -> {
            String id = normalize(section.getId());
            String title = text(section.getTitle(), "");
            return "affinity".equals(id)
                            || "profile".equals(id)
                            || "filters".equals(id)
                            || "history".equals(id)
                            || "Your assets and tickets".equals(title)
                            || "Saját eszközök és jegyek".equals(title);
        });
    }

    private boolean isLegacyEventsExplanation(HelpCenterRevision revision) {
        if (revision == null || revision.getSections() == null) {
            return false;
        }
        if (!EXPLANATION_EVENTS_CONTEXT.equals(revisionContext(revision))) {
            return false;
        }
        String revisionTitle = text(revision.getTitle(), "");
        if ("Home explanation".equals(revisionTitle) || "Kezdőlap magyarázat".equals(revisionTitle)) {
            return true;
        }
        return revision.getSections().stream().anyMatch(section -> {
            String id = normalize(section.getId());
            String title = text(section.getTitle(), "");
            String contentHtml = text(section.getContentHtml(), "");
            return "affinity".equals(id)
                    || "profile".equals(id)
                    || "filters".equals(id)
                    || "history".equals(id)
                    || "Home explanation".equals(title)
                    || "Kezdőlap magyarázat".equals(title)
                    || contentHtml.contains("Tap or drag the Affinity slider")
                    || contentHtml.contains("Tapints vagy húzd a Szimpátia sávot")
                    || contentHtml.contains("Cards can contain more photos and a profile detail view")
                    || contentHtml.contains("A kártya több képet és részletes profilt is rejthet")
                    || contentHtml.contains("This is the event hub inside Activities.")
                    || contentHtml.contains("Ez az eseményközpont a Tevékenységekben.")
                    || contentHtml.contains("Embedded screens like checkout")
                    || contentHtml.contains("A beágyazott képernyők, például fizetés")
                    || contentHtml.contains("Create or auto-fill an event")
                    || contentHtml.contains("Létrehozás vagy automatikus feltöltés");
        });
    }

    private boolean isLegacyEventEditorExplanation(HelpCenterRevision revision) {
        if (revision == null || revision.getSections() == null) {
            return false;
        }
        if (!EXPLANATION_EVENT_EDITOR_CONTEXT.equals(revisionContext(revision))) {
            return false;
        }
        String revisionTitle = text(revision.getTitle(), "");
        if ("Event editor explanation".equals(revisionTitle) || "Eseményszerkesztő magyarázat".equals(revisionTitle)) {
            return true;
        }
        return revision.getSections().stream().anyMatch(section -> {
            String contentHtml = text(section.getContentHtml(), "");
            return contentHtml.contains("This is where the event card and the basic rules are made.")
                    || contentHtml.contains("Itt készül az eseménykártya")
                    || contentHtml.contains("These cards decide how people find, join, and understand the event.")
                    || contentHtml.contains("Ezek döntik el, hogyan találják meg")
                    || contentHtml.contains("Blind Event</strong> hides the crowd before the event")
                    || contentHtml.contains("A <strong>Blind Event</strong> elrejti")
                    || contentHtml.contains("Roles are simple:")
                    || contentHtml.contains("A szerepek egyszerűek")
                    || contentHtml.contains("Assets are the practical things")
                    || contentHtml.contains("Az eszköz itt gyakorlati")
                    || contentHtml.contains("Manager/Admin people are protected from normal disqualify/remove actions")
                    || contentHtml.contains("Az Admin/Manager védett")
                    || contentHtml.contains("helper-organizer role under Admin")
                    || contentHtml.contains("segítő-szervező szerep az Admin alatt");
        });
    }

    private boolean isLegacyChatsExplanation(HelpCenterRevision revision) {
        if (revision == null || revision.getSections() == null) {
            return false;
        }
        if (!EXPLANATION_CHATS_CONTEXT.equals(revisionContext(revision))) {
            return false;
        }
        String revisionTitle = text(revision.getTitle(), "");
        if ("Home explanation".equals(revisionTitle) || "Kezdőlap magyarázat".equals(revisionTitle)) {
            return true;
        }
        return revision.getSections().stream().anyMatch(section -> {
            String id = normalize(section.getId());
            String contentHtml = text(section.getContentHtml(), "");
            return "affinity".equals(id)
                    || "profile".equals(id)
                    || "filters".equals(id)
                    || "history".equals(id)
                    || contentHtml.contains("Tap or drag the Affinity slider")
                    || contentHtml.contains("Tapints vagy húzd a Szimpátia sávot")
                    || contentHtml.contains("Cards can contain more photos and a profile detail view")
                    || contentHtml.contains("A kártya több képet és részletes profilt is rejthet")
                    || contentHtml.contains("The message window shows the channel title, message history")
                    || contentHtml.contains("The message window shows the channel title, history, shared items")
                    || contentHtml.contains("Az üzenetablakban látod a csatorna címét, az üzeneteket")
                    || contentHtml.contains("Az üzenetablakban látod a csatorna címét, az előzményeket")
                    || contentHtml.contains("You can write text, reply to a message, react with emoji")
                    || contentHtml.contains("Írhatsz szöveget, válaszolhatsz üzenetre")
                    || contentHtml.contains("Tap a message to select it. The small buttons")
                    || contentHtml.contains("Koppints egy üzenetre a kijelöléshez")
                    || contentHtml.contains("Kitűzés");
        });
    }

    private List<HelpCenterSection> defaultSections(String kind, String lang, String contextKey) {
        if (DOCUMENT_EXPLANATION.equals(kind)) {
            return defaultExplanationSections(lang, contextKey);
        }
        if ("hu".equals(contentLang(lang))) {
            return DOCUMENT_PRIVACY.equals(kind) ? defaultPrivacySectionsHu() : defaultHelpSectionsHu();
        }
        if (DOCUMENT_PRIVACY.equals(kind)) {
            return defaultPrivacySections();
        }
        return List.of(
                defaultSection(
                        "events",
                        "event_note",
                        "Events and Sub Events",
                        "Build the full event flow with stages or optional items.",
                        """
                        <p><strong>Build the full event flow with stages or optional items.</strong></p>
                        <p>Create a main event, then split execution into sub events for stages, side activities, or optional sessions.</p>
                        <p>Each sub event carries its own date range, description, and status so planning stays clean and trackable.</p>
                        <ul>
                          <li>Supports casual and tournament structures</li>
                          <li>Keeps stage context visible in related screens</li>
                          <li>Lets hosts edit details without losing hierarchy</li>
                        </ul>
                        """),
                defaultSection(
                        "resources",
                        "inventory_2",
                        "Resources and Capacity",
                        "Assign people, cars, accommodation, and supplies with limits.",
                        """
                        <p><strong>Assign people, cars, accommodation, and supplies with limits.</strong></p>
                        <p>Use resource menus to assign assets into sub events and groups, then adjust capacity ranges directly where needed.</p>
                        <p>Badges summarize pending requests and remaining capacity so action priorities are visible at a glance.</p>
                        <ul>
                          <li>Capacity min/max control per assignment</li>
                          <li>Contextual badges for pending requests</li>
                          <li>Route and location support for travel resources</li>
                        </ul>
                        """),
                defaultSection(
                        "activities",
                        "forum",
                        "Activities and Chats",
                        "Coordinate with context-aware channels and filters.",
                        """
                        <p><strong>Coordinate with context-aware channels and filters.</strong></p>
                        <p>Chat channels follow event scope: main event, optional sub event, and group channels can all coexist.</p>
                        <p>Context actions in chat headers help jump directly to related event/sub-event views and resources.</p>
                        <ul>
                          <li>Fast channel filtering by context</li>
                          <li>Unread counters scoped to relevant channels</li>
                          <li>Works for both mobile and desktop flows</li>
                        </ul>
                        """),
                defaultSection(
                        "safety",
                        "verified_user",
                        "Profiles and Safety",
                        "Improve trust with profile quality and moderation tools.",
                        """
                        <p><strong>Improve trust with profile quality and moderation tools.</strong></p>
                        <p>Profile completion updates in real time as users fill key fields and detail sections.</p>
                        <p>Safety controls include report tools, privacy visibility options, and clear moderation pathways.</p>
                        <ul>
                          <li>Live profile completion feedback</li>
                          <li>Report user and feedback workflows</li>
                          <li>Privacy and access visibility controls</li>
                        </ul>
                        """));
    }

    private List<HelpCenterSection> defaultHelpSectionsHu() {
        return List.of(
                defaultSection("events", "event_note", "Események és alesemények", "Építsd fel a teljes eseményfolyamatot szakaszokkal vagy opcionális elemekkel.", "<p><strong>Építsd fel a teljes eseményfolyamatot szakaszokkal vagy opcionális elemekkel.</strong></p><p>Hozz létre fő eseményt, majd bontsd aleseményekre szakaszokhoz, mellékprogramokhoz vagy opcionális alkalmakhoz.</p><ul><li>Alkalmi és verseny jellegű struktúrák támogatása</li><li>A szakaszkontextus látható marad</li><li>A szervezők a hierarchia elvesztése nélkül szerkeszthetnek</li></ul>"),
                defaultSection("resources", "inventory_2", "Erőforrások és kapacitás", "Rendelj embereket, autókat, szállást és kellékeket limitekkel.", "<p><strong>Rendelj embereket, autókat, szállást és kellékeket limitekkel.</strong></p><p>Az erőforrásmenükben eszközöket rendelhetsz aleseményekhez és csoportokhoz, majd közvetlenül állíthatod a kapacitásokat.</p><ul><li>Minimum/maximum kapacitás feladatonként</li><li>Kontextusos jelvények függő kérésekhez</li><li>Útvonal- és helytámogatás utazási erőforrásokhoz</li></ul>"),
                defaultSection("activities", "forum", "Tevékenységek és csevegések", "Koordinálj kontextustudatos csatornákkal és szűrőkkel.", "<p><strong>Koordinálj kontextustudatos csatornákkal és szűrőkkel.</strong></p><p>A csevegőcsatornák követik az esemény hatókörét: fő esemény, opcionális alesemény és csoportcsatorna is együtt létezhet.</p><ul><li>Gyors csatornaszűrés kontextus szerint</li><li>Olvasatlan számlálók releváns csatornákra szűkítve</li><li>Mobilon és asztali nézetben is működik</li></ul>"),
                defaultSection("safety", "verified_user", "Profilok és biztonság", "Erősítsd a bizalmat profilminőséggel és moderációs eszközökkel.", "<p><strong>Erősítsd a bizalmat profilminőséggel és moderációs eszközökkel.</strong></p><p>A profilkészültség valós időben frissül, ahogy a felhasználók kitöltik a fontos mezőket.</p><ul><li>Élő profilkészültségi visszajelzés</li><li>Felhasználójelentési és visszajelzési folyamatok</li><li>Adatvédelmi és hozzáférési kontrollok</li></ul>"));
    }

    private List<HelpCenterSection> defaultExplanationSections(String lang, String contextKey) {
        String context = contextKey(DOCUMENT_EXPLANATION, contextKey, false);
        if (EXPLANATION_ACTIVITY_RATES_CONTEXT.equals(context)) {
            return defaultActivityRatesExplanationSections(lang);
        }
        if (EXPLANATION_CHATS_CONTEXT.equals(context)) {
            return defaultChatsExplanationSections(lang);
        }
        if (EXPLANATION_CONTACTS_CONTEXT.equals(context)) {
            return defaultContactsExplanationSections(lang);
        }
        if (isAssetExplanationContext(context)) {
            return defaultAssetsExplanationSections(lang);
        }
        if (EXPLANATION_EVENTS_CONTEXT.equals(context)) {
            return defaultEventsExplanationSections(lang);
        }
        if (EXPLANATION_EVENT_EDITOR_CONTEXT.equals(context)) {
            return defaultEventEditorExplanationSections(lang);
        }
        if ("hu".equals(contentLang(lang))) {
            return List.of(
                    defaultSection("affinity", "tune", "Szimpátia sáv", "Állítsd be, mennyire szimpatikus a kártya.", "<p>Tapints vagy húzd a Szimpátia sávot 1 és 10 között. A Mehet gomb csak akkor jelenik meg, amikor már választottál értéket.</p>"),
                    homeAffinityNetworkSection(lang),
                    defaultSection("profile", "visibility", "Profil és képek", "A kártya több képet és részletes profilt is rejthet.", "<p>Tapints a kép bal vagy jobb oszlopára a fotók lapozásához. A szem ikon megnyitja a profil részleteit.</p>"),
                    defaultSection("filters", "filter_alt", "Szűrők és módok", "A felső sávval szűkítheted, kik jelenjenek meg.", "<p>A tölcsér ikon nyitja a profilszűrőket. A szám azt mutatja, hogy az adott szűrőfeltétel mellett hány találat van.</p><p><strong>Preferenciák</strong>: normál, saját beállításaid szerinti kártyák. <strong>Közös ismerősök</strong>: valakin vagy eseményen keresztül kapcsolódó profilok. <strong>Hálózaton belül</strong>: párok a meglévő kapcsolati körből. <strong>Hálózaton kívül</strong>: párok azon kívül.</p>"),
                    defaultSection("history", "history", "Előzmények", "A korábbi értékelések később is elérhetők.", "<p>Az előzményeket a history gombbal vagy a menüből nyithatod meg. Az Activity értékeléseknél a csillag ikonon keresztül módosíthatod a saját értékedet.</p>"));
        }
        return List.of(
                defaultSection("affinity", "tune", "Affinity slider", "Choose how strong the card feels for you.", "<p>Tap or drag the Affinity slider from 1 to 10. The Go button appears only after you pick a value.</p>"),
                homeAffinityNetworkSection(lang),
                defaultSection("profile", "visibility", "Profile and photos", "Cards can contain more photos and a profile detail view.", "<p>Tap the left or right image columns to browse photos. Use the eye icon to open profile details.</p>"),
                defaultSection("filters", "filter_alt", "Filters and modes", "Use the top bar to narrow who appears.", "<p>The filter button opens profile filters. The number shows how many results match the selected filter condition.</p><p><strong>Preferences</strong>: normal preference-based cards. <strong>Friends in Common</strong>: people connected through someone or an event. <strong>Inside Network</strong>: pairs from your existing network. <strong>Outside Network</strong>: pairs outside it.</p>"),
                defaultSection("history", "history", "History and edits", "Your previous ratings stay available.", "<p>Open history from the header or menu. In Activity ratings, use the star icon to edit a value you already gave.</p>"));
    }

    private HelpCenterSection homeAffinityNetworkSection(String lang) {
        if ("hu".equals(contentLang(lang))) {
            return defaultSection(
                    HOME_AFFINITY_NETWORK_SECTION_ID,
                    "hub",
                    "Szimpátia és csoportchat",
                    "A válaszod segít olyan kis csoportot találni, ahol könnyebb elkezdeni beszélgetni.",
                    "<p>Amikor 1 és 10 között választasz, azt jelzed, mennyire szívesen beszélgetnél ezzel az emberrel. Nem csak ez az egy szám dönt: többet ér, ha a szimpátia kölcsönös, friss, és a szokásos háttérzajhoz képest is erős.</p><p>Ha több embernél látszik, hogy jó eséllyel szívesen ismerkednének egymással, a MyScoutee kioszthat egy 6-12 fős véletlenszerű csoportos chatet. A csoport továbbra is új és laza, csak olyan irányba van terelve, ahol az első üzenet kevésbé kínos.</p>");
        }
        return defaultSection(
                HOME_AFFINITY_NETWORK_SECTION_ID,
                "hub",
                "Affinity and group chats",
                "Your answer helps find a small group where conversation is easier to start.",
                "<p>When you choose 1-10, you are saying how much you would like to talk with this person. That number is not used alone: it matters more when interest is mutual, recent, and stronger than the usual background noise.</p><p>If several people seem likely to enjoy meeting each other, MyScoutee can place them into a random group chat of 6-12 people. It is still a fresh group, but it is nudged toward people who already have enough shared interest to make the first message feel less awkward.</p>");
    }

    private List<HelpCenterSection> defaultActivityRatesExplanationSections(String lang) {
        if ("hu".equals(contentLang(lang))) {
            return List.of(
                    defaultSection("activity-rate-filter", "north_east", "Mit nézel?", "Itt választod ki, milyen értékeléskártyák látszanak.", "<p>Nyisd le az első menüt, és válassz: akiket te értékeltél, akik téged értékeltek, kölcsönös értékelések, akikkel találkoztál, vagy javaslatok.</p><p>A piros szám azt mutatja, hány kártya van abban a választásban. A Social kapcsoló csak azt dönti el, hogy bekerüljenek-e a közös emberek vagy események alapján ajánlott kártyák.</p>"),
                    defaultSection("activity-header-controls", "route", "Sorrend és nézet", "Ezek a gombok csak azt változtatják, hogyan látod a listát.", "<p>A <strong>Legutóbbi</strong>, <strong>Releváns</strong> és <strong>Korábbi</strong> azt dönti el, mi kerüljön előre. Ettől senkinek nem változik a pontja.</p><p>A <strong>Hónap</strong>, <strong>Hét</strong>, <strong>Nap</strong> és <strong>Távolság</strong> azt dönti el, milyen csoportokban látod ugyanazokat a kártyákat. A <strong>10 km</strong> felirat csak egy csoportcím.</p>"),
                    defaultSection("activity-score-badge", "star", "Egy kártya pontozása", "Koppints egy kártyára, majd az 1-10-es sávval módosítsd az értékelést.", "<p>A csillagos jelvény azt mutatja, most mennyire értékelted azt a kártyát. Ha kijelölsz egy kártyát, az alsó sáv csak azt az egy kártyát módosítja.</p><p>Ha egy kártya csak olvasható, láthatod rajta a kapott pontot, de az alsó sáv nem fogja átírni.</p>"),
                    defaultSection("activity-fullscreen", "fullscreen", "Egyesével pontozás", "A teljes képernyő akkor jó, ha csak egy kártyára szeretnél figyelni.", "<p>A teljes képernyő ikon nagyobb kártyát nyit. A kép tetején lévő kis sávok mutatják, ha több fotó van.</p><p>A pontozósáv közvetlenül a kép alatt van, és csak az éppen látható kártyát módosítja. Kilépés után ugyanabba a szűrt listába térsz vissza.</p>"));
        }
        return List.of(
                defaultSection("activity-rate-filter", "north_east", "What you are looking at", "Pick which kind of rating cards should be shown.", "<p>Open the first menu to choose cards you rated, cards where someone rated you, mutual ratings, people you met, or suggestions.</p><p>The red number tells you how many cards are in that choice. The Social switch simply decides whether cards suggested through shared people or events are included.</p>"),
                defaultSection("activity-header-controls", "route", "Order and view", "These buttons only change how the list is shown.", "<p><strong>Recent</strong>, <strong>Relevant</strong>, and <strong>Past</strong> decide what comes first. They do not change anyone&rsquo;s score.</p><p><strong>Month</strong>, <strong>Week</strong>, <strong>Day</strong>, and <strong>Distance</strong> decide how the same cards are grouped. A label like <strong>10 km</strong> is just a group title.</p>"),
                defaultSection("activity-score-badge", "star", "Rating one card", "Tap a card, then use the 1-10 bar to change your rating.", "<p>The star badge shows your current rating for that card. After you select a card, the bar at the bottom changes only that selected card.</p><p>If a card is read-only, you may still see a received score, but the bottom bar will not change it.</p>"),
                defaultSection("activity-fullscreen", "fullscreen", "Rating one by one", "Use fullscreen when you want to focus on a single card.", "<p>The fullscreen button opens a larger card. The small bars at the top of the image show when there are more photos.</p><p>The rating bar sits below the image and changes only the card you can see. When you exit fullscreen, you return to the same filtered list.</p>"));
    }

    private List<HelpCenterSection> defaultChatsExplanationSections(String lang) {
        if ("hu".equals(contentLang(lang))) {
            return List.of(
                    defaultSection("activity-chat-list", "forum", "Chatlisták", "Itt választod ki, melyik beszélgetéseket látod.", "<p>A <strong>Chatek</strong> nézetben az eseményekhez és csoportokhoz tartozó beszélgetéseket látod. A második menü szűr: Összes, Esemény, Alesemény, Csoport vagy Szerviz.</p><p>A piros buborék olvasatlant vagy várakozó tennivalót jelent. A dátumsávok csoportosítják a beszélgetéseket, így látod, mi friss és mi régebbi.</p>"),
                    defaultSection("activity-chat-card", "chat_bubble", "Egy chat sor olvasása", "A sor megmutatja, ki írt, melyik csatorna ez, és hányan vannak benne.", "<p>A kerek avatar az utolsó írót vagy a csatorna emberét jelzi. A vastag név mutatja, ki írt utoljára, az alatta lévő sor pedig a csatornát, például <strong>Main Event</strong>, <strong>Group Channel</strong> vagy <strong>Contact Organizer</strong>.</p><p>A sötét jelvény, például <strong>4 tag</strong>, azt mutatja, hányan vannak a chatben. A kis piros szám olvasatlan üzenetet vagy chathez tartozó tennivalót jelez.</p>"),
                    defaultSection("activity-chat-channels", "account_tree", "Csatornatípusok", "Más chat más feladatra való.", "<p>A <strong>Main event</strong> a fő esemény chatje. A <strong>Sub event</strong> egy szakaszhoz vagy opcionális részhez tartozik. A <strong>Group</strong> kisebb csapatnak szól. A <strong>Service</strong> vagy <strong>Organizer</strong> kérdéshez, támogatáshoz, értesítéshez vagy admin kezeléshez való.</p><p>Így nem keveredik minden: jegykérdést írhatsz a szervezőnek, szakaszról beszélhetsz az alesemény chatben, és csak a saját csoportoddal egyeztethetsz a group chatben.</p>"),
                    defaultSection("activity-chat-message-window", "mark_chat_unread", "Üzenetek megnyitása", "Koppints egy sorra: megnyílik a beszélgetés és az írómező.", "<p>Felül a csatorna neve látszik. Mellette a tagok gomb, a kapcsolódó esemény vagy csoport gomb és a gombostű ikon van. A gombostű a fontosnak jelölt üzenetek listáját nyitja, hogy később gyorsan visszatalálj.</p><p>Az üzenetek buborékokban vannak: bal oldalon mások, jobb oldalon a saját üzeneted. Egy buborékban lehet szöveg, kép, hang, szavazás, megosztott esemény vagy eszközkártya.</p><p>Koppints egy üzenetre a kijelöléshez. A lebegő gombokkal válaszolhatsz, reagálhatsz, vagy megnyithatod a menüt. A menüben szereptől és üzenettípustól függően Megnyitás, Válasz, Szerkesztés, Visszavonás, Fontosnak jelölés vagy Jelentés jelenhet meg.</p>"),
                    defaultSection("activity-chat-tools", "add_circle", "Hasznos chat eszközök", "A chat nem csak köszönésre van, hanem szervezésre is.", "<p>Az Üzenet írása mező melletti plusz gomb ugyanazokat az eszközöket nyitja, mint a valódi chatben: kép feltöltése, hangüzenet, szavazás, esemény megosztása és eszköz megosztása.</p><p>A szavazás és a megosztott esemény vagy eszköz kártya magában a beszélgetésben jelenik meg, így később is lehet rá szavazni vagy megnyitni. Használd gyakorlati dolgokra: találkozási pont, ki mit hoz, fuvar, jegyek, jóváhagyás vagy utolsó pillanatos változás.</p>"));
        }
        return List.of(
                defaultSection("activity-chat-list", "forum", "Chat lists", "Pick which conversations you want to see.", "<p>Open <strong>Chats</strong> to see conversations connected to your events and groups. The second menu filters the list: All, Event, Sub event, Group, or Service.</p><p>Red bubbles mean unread or waiting items. Date bars group the conversations so you can quickly see what is new today and what is older.</p>"),
                defaultSection("activity-chat-card", "chat_bubble", "Reading a chat row", "A row tells you who spoke, which channel it is, and how many people are inside.", "<p>The round avatar is the last sender or channel person. The bold name is who last wrote, and the line under it shows the channel name, for example <strong>Main Event</strong>, <strong>Group Channel</strong>, or <strong>Contact Organizer</strong>.</p><p>The dark pill like <strong>4 members</strong> shows how many people are in that chat. A small red number on it is unread messages or pending chat-related work.</p>"),
                defaultSection("activity-chat-channels", "account_tree", "Channel types", "Different chats are for different jobs.", "<p><strong>Main event</strong> is the broad event chat. <strong>Sub event</strong> is for one stage or optional part. <strong>Group</strong> is for a smaller team inside the event. <strong>Service</strong> or <strong>Organizer</strong> is for questions, support, notifications, or admin handling.</p><p>This keeps planning tidy: you can ask a ticket question in organizer chat, arrange a stage in sub-event chat, and talk with only your group in group chat.</p>"),
                defaultSection("activity-chat-message-window", "mark_chat_unread", "Opening messages", "Tap a row to open the conversation and the typing box.", "<p>The top bar shows the channel name. The member button opens people in the chat, the context button opens the related event or group area, and the pin icon opens messages marked as important.</p><p>Messages are bubbles: other people are on the left, your messages are on the right. A bubble can hold text, an image, a voice clip, a poll, a shared event, or a shared asset card.</p><p>Tap a message to select it. Floating buttons appear for reply, reaction, and more actions. The menu can show View, Reply, Edit, Unsend, Mark important/remove important, or Report depending on the message and your role.</p>"),
                defaultSection("activity-chat-tools", "add_circle", "Useful chat tools", "Chats are for coordination, not only hello messages.", "<p>The plus button beside Write message opens the same tools you use in the real chat: upload image, send voice clip, create poll, share event, and share asset.</p><p>Polls and shared event or asset cards appear inside the message stream, so people can vote or open the shared item later. Use it for practical planning: meeting spot, who brings what, rides, tickets, approvals, or last-minute changes.</p>"));
    }

    private List<HelpCenterSection> defaultContactsExplanationSections(String lang) {
        if ("hu".equals(contentLang(lang))) {
            return List.of(
                    defaultSection("contacts-list", "contacts", "Kapcsolatlista", "Ez a saját, gyorsan elérhető kapcsolatlistád.", "<p>A keresővel név alapján szűrheted a mentett kapcsolatokat. A <strong>Kapcsolat létrehozása</strong> gombbal kiválasztasz egy tagot, és hozzáadod a saját listádhoz.</p><p>Az üres lista csak azt jelenti, hogy ide még nem mentettél senkit. Ettől az eseményekben, chatekben, értékelésekben és profilokon semmi nem tűnik el.</p>"),
                    defaultSection("contacts-card", "badge", "Egy kapcsolatkártya", "A sor megmutatja, ki az ember, és milyen gyors eléréseket mentettél hozzá.", "<p>Az avatar és a név azonosítja az embert. A szem gomb megnyitja a profilt. A hárompontos gomb nyitja a kártyaműveleteket: mentett elérési módok, szerkesztés és törlés.</p><p>A város alatti chipek egyérintéses elérések, például telefon, email, WhatsApp, Telegram, Facebook, Instagram, LinkedIn vagy weboldal, attól függően, mit mentettél.</p>"),
                    defaultSection("contacts-private-methods", "alternate_email", "Privátabb elérési módok", "Barátokhoz vagy megbízható kapcsolatokhoz több praktikus adatot is menthetsz.", "<p>A nyilvános profilmezők ettől külön maradnak. Ha valakit jobban ismersz, például barátok vagytok, itt tarthatsz privátabb elérési módokat: emailt, telefonszámot, közösségi profilt, weboldalt vagy más hasznos linket.</p><p>A <strong>Szerkesztés</strong> alatt adhatsz hozzá, módosíthatsz vagy törölhetsz módszereket. Ezek a saját gyorsgombjaid ehhez a mentett kapcsolathoz; a kapcsolat törlése csak ebből a listából veszi ki.</p>"));
        }
        return List.of(
                defaultSection("contacts-list", "contacts", "Your contact list", "This is your private quick-reach list.", "<p>Use the search field to filter saved contacts by name. <strong>Create contact</strong> lets you pick a member and add that person to your own list.</p><p>An empty list only means you have not saved anyone here yet. It does not remove people from events, chats, ratings, or profiles.</p>"),
                defaultSection("contacts-card", "badge", "Reading a contact card", "Each row shows who the person is and the shortcuts you saved.", "<p>The avatar and name identify the person. The eye button opens the profile. The three-dot button opens the card actions: saved contact methods, Edit, and Delete.</p><p>The chips below the city are one-tap ways to reach that person, such as phone, email, WhatsApp, Telegram, Facebook, Instagram, LinkedIn, or a website, depending on what you saved.</p>"),
                defaultSection("contacts-private-methods", "alternate_email", "Private contact methods", "Friends or trusted contacts can have richer reach details.", "<p>Public profile fields stay separate from this list. When you know someone well, for example after becoming friends, you can keep more private ways to reach them here: email, phone, social handle, website, or another useful link.</p><p>Use <strong>Edit</strong> to add, change, or remove methods. These are your quick shortcuts for that saved contact; deleting the contact only removes it from this list.</p>"));
    }

    private List<HelpCenterSection> defaultAssetsExplanationSections(String lang) {
        if ("hu".equals(contentLang(lang))) {
            return List.of(
                    defaultSection("assets-entry", "inventory_2", "Saját eszközeid", "Ez a popup a saját készletedet és a jegyeidet mutatja.", "<p>Az első menü vált: <strong>Autó</strong>, <strong>Ingatlan</strong>, <strong>Kellékek</strong> és <strong>Jegy</strong>. A piros szám azt mutatja, mennyi van abból a típusból.</p><p>Az <strong>Autó</strong>, <strong>Ingatlan</strong> és <strong>Kellékek</strong> olyan dolog, amit te adsz meg és eseményhez használhatsz. A plusz gomb újat hoz létre. A <strong>Jegy</strong> más: eseményjegyeket és QR beléptetést mutat, nem szerkeszthető eszközt.</p>"),
                    defaultSection("assets-card", "view_agenda", "Egy eszközkártya", "A kártyáról látod, mi ez, hol van, és mit lehet vele csinálni.", "<p>A kép az eszköz fotója. A kis ikon a típust jelzi. A cím az eszköz neve, alatta a típus/kategória/város látszik, a szöveg pedig rövid megjegyzés.</p><p>A jobb oldali jelvény mennyiséget vagy kapacitást mutat. Ha kis piros szám van rajta, függő kölcsönkérés vár. A hárompontos menüben általában <strong>Megosztás</strong>, <strong>Szerkesztés</strong> és <strong>Törlés</strong> van. Ingatlannál a hely ikon térképet nyithat.</p>"),
                    defaultSection("assets-editor", "edit", "Létrehozás és szerkesztés", "Itt írod le, milyen saját eszközöd van.", "<p>Adj képet, forráslinket, típust, címet, kategóriát, kapacitást, mennyiséget és leírást. A <strong>Public</strong>, <strong>Friends only</strong> vagy <strong>Invitation only</strong> azt dönti el, ki találhatja meg vagy kérheti az eszközt a saját eseményeiden kívül.</p><p>Az <strong>Asset Pricing</strong> az alap árat állítja. A <strong>Lending Policies</strong> olyan szabály, amit kölcsönkérés előtt el kell fogadni. Ingatlannál kötelező helyszín sor és térkép gomb is van.</p>"),
                    defaultSection("assets-requests", "assignment", "Kérések és hozzárendelések", "A jelvényt nyisd meg, ha valaki használni szeretné az eszközöd.", "<p>A kérések popupban válthatsz: <strong>Összes</strong>, <strong>Aktív elemek</strong>, <strong>Függő kérések</strong>, <strong>Kölcsönadva</strong>. Egy sor megmutatja, ki kérte, melyik esemény/alesemény miatt, milyen időablakra, és mennyi hely vagy darab marad.</p><p>Függő kérésnél jóváhagyhatsz vagy elutasíthatsz. Elfogadott emberből néha Manager lehet az adott eszközhöz, hogy esemény közben segítsen kezelni.</p>"),
                    defaultSection("assets-tickets", "qr_code_2", "Jegyek", "A Jegy típus beléptetésre van, nem autóra vagy kellékre.", "<p>A <strong>Jegy</strong> tab jegyes eseményeket listáz. A <strong>Közelgő</strong> vagy <strong>Korábbi</strong> csak a sorrendet váltja. A QR jelvény megnyitja az adott esemény jegykódját.</p><p>A scanner gomb beléptetéshez való: beolvassa a jegy QR kódját, és megmutatja, kihez tartozik, melyik eseményre, milyen szereppel és időponttal.</p>"));
        }
        return List.of(
                defaultSection("assets-entry", "inventory_2", "Your assets", "This popup is your own inventory plus your tickets.", "<p>The first menu switches between <strong>Car</strong>, <strong>Accommodation</strong>, <strong>Supplies</strong>, and <strong>Ticket</strong>. The red numbers are counts for that type.</p><p><strong>Car</strong>, <strong>Accommodation</strong>, and <strong>Supplies</strong> are things you own and can offer to events. The plus button creates a new one. <strong>Ticket</strong> is different: it shows event tickets and QR check-in tools, not editable assets.</p>"),
                defaultSection("assets-card", "view_agenda", "Reading one asset card", "A card tells you what the item is, where it is, and what can happen with it.", "<p>The picture is the asset photo. The small icon shows the type. The title is the item name, the line under it shows type/category/city, and the text below is the short note.</p><p>The badge on the right shows quantity or capacity. If it has a small red number, there are pending borrow requests. The three-dot menu normally gives <strong>Share</strong>, <strong>Edit</strong>, and <strong>Delete</strong>. For accommodation, the location icon can open the map.</p>"),
                defaultSection("assets-editor", "edit", "Creating or editing", "This is where you describe what you own.", "<p>Add a photo, source link, type, title, category, capacity, quantity, and details. <strong>Public</strong>, <strong>Friends only</strong>, or <strong>Invitation only</strong> decides who can find or request the asset outside your own events.</p><p><strong>Asset Pricing</strong> sets the normal charge. <strong>Lending Policies</strong> are rules people must read before borrowing. Accommodation also has a required location row and a map button.</p>"),
                defaultSection("assets-requests", "assignment", "Requests and assignments", "Open the badge when people want to use your item.", "<p>The request popup can show <strong>All</strong>, <strong>Active items</strong>, <strong>Pending requests</strong>, and <strong>Borrowed items</strong>. A row shows who asked, which event/sub-event it belongs to, the time window, and how many items or seats are still free.</p><p>For pending requests you can approve or reject. For accepted people you may be able to make them a Manager for that asset, so they can help handle the item in the event context.</p>"),
                defaultSection("assets-tickets", "qr_code_2", "Tickets", "The Ticket type is for event entry, not for cars or supplies.", "<p>The <strong>Ticket</strong> tab lists ticketed events. Use <strong>Upcoming</strong> or <strong>Past</strong> to change the order. The QR badge opens the ticket code for one event.</p><p>The scanner button is for check-in: it reads a ticket QR and shows who the ticket belongs to, the event, role, and time.</p>"));
    }

    private List<HelpCenterSection> defaultEventsExplanationSections(String lang) {
        if ("hu".equals(contentLang(lang))) {
            return List.of(
                    defaultSection("activity-event-entry", "event", "Eseménylisták", "Itt választod ki, melyik eseménykupacot nézed.", "<p>Az <strong>Események</strong> nézetben látod a meghívásokat, csatlakozott eseményeket, saját eseményeket, piszkozatokat és régi/törölt elemeket. A piros buborékok darabszámok, így látod, hol vár rád valami.</p><p>A <strong>Közelgő</strong>/<strong>Korábbi</strong> és a <strong>Hónap</strong>/<strong>Hét</strong>/<strong>Nap</strong>/<strong>Távolság</strong> csak ugyanazokat a kártyákat rendezi át. A <strong>Felfedezés</strong> nyilvános eseményeket keres. A plusz gomb új eseményt indít.</p>"),
                    defaultSection("activity-event-card", "event_note", "Egy kártya olvasása", "A kártya röviden megmutatja: kép, cím, idő, hely és férőhely.", "<p>A kép az esemény előnézete. A kis avatar a szervezőt vagy meghívót jelzi. A cím az esemény neve, a dátumsor az időpont, a helyszín sor pedig a helyet és távolságot mutatja.</p><p>Az <strong>1 / 5</strong> jelvény azt jelenti, hogy 1 ember bent van az 5 helyből. A kis piros szám függő embereket, meghívásokat vagy kéréseket jelez.</p>"),
                    defaultSection("activity-event-actions", "more_vert", "Mire lehet koppintani", "A férőhely jelvény embereket nyit. A három pont műveleteket nyit.", "<p>Az <strong>1 / 5</strong> jelvényre koppintva látod, kik vannak bent, kik várnak, és kit kell jóváhagyni. Ha te vagy a szervező, itt tudod kezelni az embereket.</p><p>A hárompontos menüben a szereped szerinti műveletek jelennek meg: megtekintés, szerkesztés, piszkozat publikálása, meghívás elfogadása vagy elutasítása, szervező megkeresése, résztvevők értesítése, megosztás, jelentés, kilépés, törlés vagy visszaállítás.</p>"),
                    defaultSection("activity-event-join", "person_add", "Csatlakozás eseményhez", "Van azonnali csatlakozás, és van ahol jóváhagyás, jegy vagy választás kell.", "<p>Ha meghívtak, a kártyáról elfogadhatod vagy elutasíthatod a meghívást. Ha az esemény jóváhagyást, várólistát, jegyet, szabályokat vagy opcionális részeket használ, az app előbb bekéri ezeket.</p><p>Esemény után visszajelző képernyők is jöhetnek. A mélyebb képernyők, például fizetés, tagok, erőforrások és visszajelzés, saját részletesebb magyarázatot is kaphatnak.</p>"),
                    defaultSection("activity-event-hosting", "emoji_events", "Esemény készítése", "Lehet egyszerű találkozó, vagy nagyobb bajnokság jellegű esemény.", "<p>Az <strong>Új esemény</strong> normál eseményt indít. Maradhat egyszerű, vagy építhetsz belőle nagyobb rendszert szakaszokkal, csoportokkal, opcionális részekkel, erőforrásokkal, jegyekkel, árakkal és férőhelylimitekkel.</p><p>Szervezőként automatikus meghívást is használhatsz. Ez a prioritási/relevancia listából dolgozhat, így a jobban illő emberek kerülhetnek előre, nem kell mindenkit kézzel felvenni.</p>"));
        }
        return List.of(
                defaultSection("activity-event-entry", "event", "Event lists", "Pick which pile of events you want to see.", "<p>Open <strong>Events</strong> when you want invitations, events you joined, events you host, drafts, or old/deleted items. The red bubbles are counts, so you know where something waits for you.</p><p><strong>Upcoming</strong>/<strong>Past</strong> and <strong>Month</strong>/<strong>Week</strong>/<strong>Day</strong>/<strong>Distance</strong> only change how the same cards are sorted. <strong>Explore</strong> finds public events. The plus button starts a new one.</p>"),
                defaultSection("activity-event-card", "event_note", "Reading a card", "The card gives the basic story: picture, title, time, place, and seats.", "<p>The image is the event preview. The small avatar is the host or inviter. The title tells you the event name, the date line tells you when it happens, and the place line tells you where it is and how far away it is.</p><p>A badge like <strong>1 / 5</strong> means 1 accepted person out of 5 seats. A small red number on that badge means there are pending people, invitations, or requests to check.</p>"),
                defaultSection("activity-event-actions", "more_vert", "What you can tap", "The seats badge opens people. The three dots open actions.", "<p>Tap the <strong>1 / 5</strong> seats badge to see who is in, who is waiting, and who needs approval. If you host the event, this is where you can manage people.</p><p>Tap the three-dot menu for your available actions: view, edit, publish a draft, accept or reject an invite, contact the organizer, notify participants, share, report, leave, delete, or restore.</p>"),
                defaultSection("activity-event-join", "person_add", "Joining an event", "Some events are instant. Some ask for approval, tickets, or choices first.", "<p>If you were invited, the card can let you accept or reject the invite. If the event has approval, a waitlist, tickets, rules, or optional parts, the app asks for those details before your spot is final.</p><p>After the event, you may also see feedback screens. Those deeper screens can have their own explanation because checkout, members, resources, and feedback have more buttons.</p>"),
                defaultSection("activity-event-hosting", "emoji_events", "Making events", "You can make a small meetup or a bigger tournament-style event.", "<p><strong>Create Event</strong> starts a normal event. From there you can keep it simple, or build a bigger setup with stages, groups, optional parts, resources, tickets, prices, and seat limits.</p><p>If you host, you can also use auto invite. It can pull from the priority/relevance list, so better matched people can be suggested or invited first instead of adding everyone by hand.</p>"));
    }

    private List<HelpCenterSection> defaultEventEditorExplanationSections(String lang) {
        if ("hu".equals(contentLang(lang))) {
            return List.of(
                    defaultSection("event-editor-main", "edit_calendar", "Fő esemény űrlap", "Először ezt töltsd ki: kép, név, létszám, szöveg, dátum és hely.", "<p>A nagy képes mező lesz az esemény fotója. A <strong>Name</strong>, <strong>Capacity</strong> és <strong>Description</strong> kötelező; a piros keret csak azt jelzi, hogy ott még hiányzik valami.</p><p>Felül a <strong>Members</strong> gomb nyitja az embereket. A <strong>Public</strong>, <strong>Friends only</strong> vagy <strong>Invitation only</strong> azt dönti el, ki találhatja meg az eseményt. A piros pipa ment, az X bezár.</p>"),
                    defaultSection("event-editor-switches", "tune", "Ki találja meg, ki kit lát?", "A láthatóság és a Blind/Open két külön beállítás.", "<p>A <strong>Public</strong>, <strong>Friends only</strong> és <strong>Invitation only</strong> azt dönti el, ki találhatja meg vagy kérheti az eseményt. Az <strong>Open Event</strong> és <strong>Blind Event</strong> csak azt dönti el, hogy a sima résztvevők előre láthatják-e egymást.</p><p>A <strong>Blind Event</strong> tehát nem titkos esemény. Csak a résztvevői előnézetet rejti el; az Admin és Manager továbbra is kezeli az embereket. A <strong>Topics</strong> segít a keresésben/illesztésben, az <strong>Auto Inviter</strong> a prioritási tervből tud szabad helyekre meghívni, a <strong>Ticketing</strong> pedig jegy/QR beléptetést kapcsol.</p>"),
                    defaultSection("event-editor-schedule", "event_time", "Idő, ár, szabályok", "Itt állítod: mikor van, van-e ár, milyen szabály van, és hol lesz.", "<p>A <strong>Date</strong> lehet egyszeri vagy ismétlődő. Ismétlődő eseménynél a <strong>Slot Setup</strong> állítja a normál időablakokat és a külön dátumos kivételeket.</p><p>A <strong>Pricing</strong> maradhat OFF, vagy adhatsz árat. Az <strong>Event Policies</strong> olyan szabály, amit csatlakozás/foglalás előtt el kell fogadni. A helyszín sor és a térkép gomb állítja be a helyet.</p>"),
                    defaultSection("event-editor-subevents", "account_tree", "Részek és bajnokság", "A Sub Events kisebb részekre bontja a fő eseményt.", "<p>A <strong>Sub Events</strong> jó szakaszra, körre, mellékprogramra, csoportblokkra vagy opcionális részre. A <strong>Mandatory</strong> a fő esemény része. Az <strong>Optional</strong> külön választható, gyakran saját létszámmal vagy árral.</p><p>A <strong>Casual</strong> sima lista. A <strong>Tournament</strong> szakaszokat, csoportokat, pontokat, státuszváltásokat és ranglistát ad. A szerkesztő az időket a fő eseményen belül tartja; ismétlődő eseménynél ugyanaz az alesemény-idő minden slotban újra megjelenik.</p>"),
                    defaultSection("event-editor-members", "groups", "Tagok és szerepek", "Ez az a popup, ahol a szervező embereket kezel.", "<p>Az <strong>Admin</strong> a fő szervező. A <strong>Manager</strong> Admin alatti segítő: kezelhet tagokat és erőforrásokat, és akkor is megjelenhet, ha valaki egy hozzárendelt autó, szállás vagy kellék felelőse. A <strong>Member</strong> sima résztvevő.</p><p>A <strong>Invite</strong> meghív. A <strong>Pending only</strong> csak a várakozó kéréseket/meghívásokat mutatja. A jelvény mutatja: Admin, Manager, Member, függő kérés, kiküldött meghívó vagy kizárt. A szem profilra visz; a hárompontos menü szereptől és állapottól függően jóváhagyást, elutasítást/törlést, eltávolítást, kizárást, visszaállítást vagy jelentést ad.</p>"),
                    defaultSection("event-editor-assets", "inventory_2", "Erőforrások", "Erőforrás az ember vagy dolog, amit egy részhez hozzárendelsz.", "<p>Egy alesemény vagy csoport menüjéből nyitható: <strong>Members</strong>, <strong>Car</strong>, <strong>Accommodation</strong> és <strong>Supplies</strong>. Az <strong>Assign</strong> olyat tesz hozzá, amit már kezelsz. Az <strong>Explore</strong> elérhető eszközt keres, és kérés/foglalás folyamatot indíthat.</p><p>A számok az elfogadott és függő hozzárendeléseket mutatják. A kapacitásból látod, elég ember, ülés, szálláshely vagy kellék van-e ahhoz a részhez. Ha egy erőforrásnak saját felelőse van, ő Managerként is megjelenhet az esemény környezetében.</p>"));
        }
        return List.of(
                defaultSection("event-editor-main", "edit_calendar", "Main event form", "Fill the card first: picture, name, seats, text, date, and place.", "<p>The big image box is the event photo. <strong>Name</strong>, <strong>Capacity</strong>, and <strong>Description</strong> are required; a red outline just means something is still missing.</p><p>The top <strong>Members</strong> button opens the people list. <strong>Public</strong>, <strong>Friends only</strong>, or <strong>Invitation only</strong> decides who can find the event. The red check saves; X closes.</p>"),
                defaultSection("event-editor-switches", "tune", "Finding, joining, preview", "Visibility and Blind/Open are different things.", "<p><strong>Public</strong>, <strong>Friends only</strong>, and <strong>Invitation only</strong> decide who can discover or join. <strong>Open Event</strong> and <strong>Blind Event</strong> only decide whether normal attendees can preview each other before the event.</p><p><strong>Blind Event</strong> is not a secret event. It hides the attendee preview, while Admin and Manager can still manage members. <strong>Topics</strong> help matching, <strong>Auto Inviter</strong> can fill open seats from the priority plan, and <strong>Ticketing</strong> adds ticket/QR check-in.</p>"),
                defaultSection("event-editor-schedule", "event_time", "Time, price, rules", "This part answers: when, price, rules, and place.", "<p><strong>Date</strong> can be one-time or repeating. If the event repeats, <strong>Slot Setup</strong> controls the normal time windows and any date-specific changes.</p><p><strong>Pricing</strong> can stay off or add a charge. <strong>Event Policies</strong> are rules people must accept before joining or booking. The location row and map button set where the event happens.</p>"),
                defaultSection("event-editor-subevents", "account_tree", "Parts and tournaments", "Sub Events are smaller pieces under the main event.", "<p>Use <strong>Sub Events</strong> for stages, rounds, side plans, group blocks, or optional sessions. <strong>Mandatory</strong> means included in the main event. <strong>Optional</strong> means people can choose it separately, often with its own seats or price.</p><p><strong>Casual</strong> is a simple list. <strong>Tournament</strong> adds stages, groups, scores, status changes, and a leaderboard. The editor keeps sub-event times inside the main event; for repeating events, the same sub-event timing is repeated inside each slot.</p>"),
                defaultSection("event-editor-members", "groups", "Members and roles", "This popup is where organizers handle people.", "<p><strong>Admin</strong> is the main organizer. <strong>Manager</strong> is a helper under Admin: managers can help with members and resources, and can also appear because someone manages an assigned car, accommodation, or supply. <strong>Member</strong> is a normal attendee.</p><p><strong>Invite</strong> adds people. <strong>Pending only</strong> shows waiting requests/invites. The status chip shows Admin, Manager, Member, pending, invite, or disqualified. The eye opens a profile; the three-dot menu can approve, reject/delete, remove, disqualify, reinstate, or report depending on your role and the member state.</p>"),
                defaultSection("event-editor-assets", "inventory_2", "Resources", "Resources are the people and things assigned to one part.", "<p>From a sub-event or group menu you can open <strong>Members</strong>, <strong>Car</strong>, <strong>Accommodation</strong>, or <strong>Supplies</strong>. <strong>Assign</strong> attaches something you already control. <strong>Explore</strong> searches available assets and can start a request/booking flow.</p><p>Counts show accepted and pending assignments. Capacity tells you whether that part has enough people, car seats, beds/rooms, or supplies. If a resource has its own manager, that person can become a Manager for the event context.</p>"));
    }

    private List<HelpCenterSection> defaultPrivacySectionsHu() {
        return List.of(
                defaultSection("privacy", "policy", "Adatvédelem", "Hogyan kezeli a MyScoutee a profilhoz, eseményekhez és közösségi aktivitáshoz kapcsolódó személyes adatokat.", "<p>Hogyan kezeli a MyScoutee a profilhoz, eseményekhez és közösségi aktivitáshoz kapcsolódó személyes adatokat.</p><p><strong>Utolsó frissítés:</strong> 2026. február 1.</p>"),
                defaultSection("contact-details", "contact_mail", "Kapcsolati adatok", "Kihez fordulhatsz adatvédelemmel és adatkezeléssel kapcsolatban.", "<ul><li><strong>Adatkezelő:</strong> MyScoutee demo platform</li><li><strong>Támogatási email:</strong> privacy@myscoutee.app</li><li><strong>DPO kapcsolat:</strong> dpo@myscoutee.app</li></ul>"),
                defaultSection("legal-basis", "gavel", "Jogalap", "Miért kezel adatokat a MyScoutee a termék- és biztonsági folyamatokhoz.", "<ul><li>Szerződés teljesítése a fiók- és eseményfunkciókhoz.</li><li>Jogos érdek a platform biztonsága és a visszaélések megelőzése érdekében.</li><li>Hozzájárulás opcionális profiladatokhoz, pontos helykoordinátákhoz és marketingkommunikációhoz.</li></ul>"),
                defaultSection("your-rights", "fact_check", "Jogaid", "A fiókodhoz és személyes adataidhoz kapcsolódó jogaid.", "<h4>Hozzáférés</h4><ul><li>Kérhetsz másolatot a tárolt személyes adataidról.</li></ul><h4>Helyesbítés</h4><ul><li>Javíthatod a pontatlan profil- vagy fiókadatokat.</li></ul><h4>Törlés</h4><ul><li>Kérheted a fiók és a személyes adatok törlését, ahol ez jogilag lehetséges.</li></ul>"),
                defaultSection("data-categories", "category", "Adatkategóriák", "Milyen adattípusokat kezelhet a MyScoutee.", "<h4>Fiók és azonosítás</h4><ul><li>Név</li><li>Születésnap</li><li>Lakóhely városa</li><li>Nem</li><li>Profilképek</li></ul><h4>Aktivitási adatok</h4><ul><li>Csevegések</li><li>Meghívások</li><li>Események</li><li>Értékelések</li></ul>"),
                defaultSection("purposes", "tips_and_updates", "Célok", "Hogyan támogatják az adatok a profil-, esemény-, chat- és bizalmi funkciókat.", "<ul><li>Profil-, chat-, esemény- és szervezői funkciók működtetése.</li><li>Releváns tagok ajánlása és a felfedezés minőségének javítása.</li><li>Visszaélések, spam és gyanús aktivitás észlelése.</li></ul>"),
                defaultSection("retention", "schedule", "Megőrzés", "Mennyi ideig őrizzük meg az adatokat.", "<ul><li>Fiókprofil-adatok: amíg a fiók aktív.</li><li>Biztonsági és auditnaplók: jogi vagy megfelelőségi igény szerint.</li><li>Törölt fiókok: az adatok a megőrzési idő után törlődnek vagy anonimizálódnak.</li></ul>"),
                defaultSection("sharing", "share", "Harmadik felekkel megosztás", "Mikor kerülhetnek adatok a MyScoutee-n kívülre.", "<ul><li>Szolgáltatókkal tárhely, analitika és támogatási működés céljából.</li><li>Hatóságokkal csak akkor, ha alkalmazandó jog előírja.</li><li>Személyes adatot nem értékesítünk.</li></ul>"),
                defaultSection("security", "security", "Biztonság", "Az adatok védelmét szolgáló kontrollok.", "<ul><li>Szerepköralapú hozzáférés belső eszközökhöz.</li><li>Titkosított adatátvitel.</li><li>Üzemeltetési monitorozás és incidenskezelési folyamatok.</li></ul>"));
    }

    private List<HelpCenterSection> defaultPrivacySections() {
        return List.of(
                defaultSection(
                        "privacy",
                        "policy",
                        "Privacy",
                        "How myscoutee handles personal data for profile, events, and social activity (including GDPR rights).",
                        """
                        <p>How myscoutee handles personal data for profile, events, and social activity (including GDPR rights).</p>
                        <p><strong>Last updated:</strong> February 1, 2026</p>
                        """),
                defaultSection(
                        "contact-details",
                        "contact_mail",
                        "Contact details",
                        "Who to contact about privacy and data protection.",
                        """
                        <ul>
                          <li><strong>Data Controller:</strong> myscoutee demo platform</li>
                          <li><strong>Support Email:</strong> privacy@myscoutee.app</li>
                          <li><strong>DPO Contact:</strong> dpo@myscoutee.app</li>
                        </ul>
                        """),
                defaultSection(
                        "legal-basis",
                        "gavel",
                        "Legal basis",
                        "Why MyScoutee processes data for product and safety workflows.",
                        """
                        <ul>
                          <li>Contract performance for account and event features.</li>
                          <li>Legitimate interest for platform safety and abuse prevention.</li>
                          <li>Consent for optional profile details, precise location coordinates, and marketing communication.</li>
                          <li>Legal obligation for security logs and compliance records.</li>
                        </ul>
                        """),
                defaultSection(
                        "your-rights",
                        "fact_check",
                        "Your rights",
                        "Rights available for your account and personal data.",
                        """
                        <h4>Access</h4>
                        <ul><li>Request a copy of your stored personal data.</li></ul>
                        <h4>Rectification</h4>
                        <ul><li>Correct inaccurate profile or account details.</li></ul>
                        <h4>Erasure</h4>
                        <ul><li>Request account and personal data deletion where legally possible.</li></ul>
                        <h4>Portability</h4>
                        <ul><li>Export your data in a commonly used machine-readable format.</li></ul>
                        <h4>Restriction / Objection</h4>
                        <ul><li>Limit or object to specific processing activities.</li></ul>
                        """),
                defaultSection(
                        "data-categories",
                        "category",
                        "Data categories",
                        "Types of data MyScoutee may process.",
                        """
                        <h4>Account & Identity</h4>
                        <ul><li>Name</li><li>Birthday</li><li>Home city</li><li>Gender</li><li>Profile images</li></ul>
                        <h4>Location & Coordinates</h4>
                        <ul><li>Approximate location (city/region)</li><li>Precise GPS coordinates (latitude/longitude) when requested</li><li>Location update timestamps for event logistics</li></ul>
                        <h4>Activity Data</h4>
                        <ul><li>Chats</li><li>Invitations</li><li>Events</li><li>Hosting interactions</li><li>Ratings</li></ul>
                        <h4>Preference Data</h4>
                        <ul><li>Interests</li><li>Values</li><li>Visibility settings</li><li>Language preferences</li></ul>
                        <h4>Technical Data</h4>
                        <ul><li>Device/browser metadata</li><li>IP/log records</li><li>Session events</li></ul>
                        """),
                defaultSection(
                        "purposes",
                        "tips_and_updates",
                        "Purposes",
                        "How data supports profile, event, chat, and trust features.",
                        """
                        <ul>
                          <li>Operate profile, chat, event, and hosting features.</li>
                          <li>Match relevant members and improve discovery quality.</li>
                          <li>Support location-based matching and distance-aware event coordination.</li>
                          <li>Detect abuse, spam, and suspicious platform activity.</li>
                          <li>Support account requests and compliance processes.</li>
                        </ul>
                        """),
                defaultSection(
                        "retention",
                        "schedule",
                        "Retention",
                        "How long data is kept.",
                        """
                        <ul>
                          <li>Account profile data: retained while account is active.</li>
                          <li>Precise location coordinates: stored only for active location-enabled features and deleted when no longer required.</li>
                          <li>Safety and audit logs: retained based on legal/compliance needs.</li>
                          <li>Deleted accounts: data removed or anonymized after retention window.</li>
                        </ul>
                        """),
                defaultSection(
                        "sharing",
                        "share",
                        "Third-party sharing",
                        "When data may be shared outside MyScoutee.",
                        """
                        <ul>
                          <li>Service providers for hosting, analytics, and support operations.</li>
                          <li>Authorities only when required by applicable law.</li>
                          <li>No sale of personal data.</li>
                        </ul>
                        """),
                defaultSection(
                        "security",
                        "security",
                        "Security",
                        "Controls used to protect data.",
                        """
                        <ul>
                          <li>Role-based access control for internal tools.</li>
                          <li>Encrypted transport for data in transit.</li>
                          <li>Operational monitoring and incident response procedures.</li>
                        </ul>
                        """));
    }

    private HelpCenterSection defaultSection(String id, String icon, String title, String blurb, String contentHtml) {
        HelpCenterSection section = new HelpCenterSection();
        section.setId(id);
        section.setIcon(icon);
        section.setTitle(title);
        section.setBlurb(blurb);
        section.setContentHtml(sanitizeHtml(contentHtml));
        section.setPanelSpan(defaultPanelSpan(id));
        section.setOptional(false);
        return section;
    }

    private HelpCenterRevision seedRevision(String kind, String lang, String contextKey) {
        String language = contentLang(lang);
        String context = contextKey(kind, contextKey, false);
        Resource resource = resourceLoader.getResource(seedResourcePath(kind, language, context));
        if (resource.exists()) {
            try (InputStream inputStream = resource.getInputStream()) {
                HelpCenterRevision revision = objectMapper.readValue(inputStream, HelpCenterRevision.class);
                if (DOCUMENT_EXPLANATION.equals(kind) && StringUtils.hasText(context)) {
                    revision.setContextKey(context);
                }
                return revision;
            } catch (IOException ignored) {
                // Fall back to the built-in seed if the JSON resource is unavailable or malformed.
            }
        }
        HelpCenterRevision revision = new HelpCenterRevision();
        revision.setDocumentType(kind);
        revision.setLang(language);
        revision.setContextKey(DOCUMENT_EXPLANATION.equals(kind) && StringUtils.hasText(context)
                ? context
                : contextKey(kind, revision.getContextKey(), false));
        revision.setLanguageLabel(languageLabel(language));
        revision.setVersion(1);
        revision.setTitle(defaultRevisionTitle(kind, language, context));
        revision.setSummary(defaultSummary(kind, language, context));
        revision.setDescription(defaultDescription(kind, language));
        revision.setHeaderColor("amber");
        revision.setSections(defaultSections(kind, language, context));
        return revision;
    }

    private String seedResourcePath(String kind, String lang, String contextKey) {
        String documentName = DOCUMENT_PRIVACY.equals(kind) ? "Privacy" : "Help";
        if (DOCUMENT_EXPLANATION.equals(kind)) {
            if (EXPLANATION_ACTIVITY_RATES_CONTEXT.equals(contextKey)) {
                documentName = "ExplanationActivitiesRates";
            } else if (EXPLANATION_CHATS_CONTEXT.equals(contextKey)) {
                documentName = "ExplanationChats";
            } else if (EXPLANATION_CONTACTS_CONTEXT.equals(contextKey)) {
                documentName = "ExplanationContacts";
            } else if (isAssetExplanationContext(contextKey)) {
                documentName = "ExplanationAssets";
            } else if (EXPLANATION_EVENTS_CONTEXT.equals(contextKey)) {
                documentName = "ExplanationEvents";
            } else if (EXPLANATION_EVENT_EDITOR_CONTEXT.equals(contextKey)) {
                documentName = "ExplanationEventEditor";
            } else {
                documentName = "ExplanationHome";
            }
        }
        return DEFAULT_SEED_RESOURCE_PREFIX + documentName + "Default." + contentLang(lang) + ".json";
    }

    private HelpCenterSectionDto toSectionDtoForSeed(HelpCenterSection section) {
        return new HelpCenterSectionDto(
                normalize(section == null ? null : section.getId()),
                normalize(section == null ? null : section.getIcon()),
                normalize(section == null ? null : section.getTitle()),
                normalize(section == null ? null : section.getBlurb()),
                normalize(section == null ? null : section.getContentHtml()),
                normalizeImageUrls(section == null ? null : section.getImageUrls()),
                normalizePanelSpan(section == null ? null : section.getPanelSpan(), section == null ? null : section.getId()),
                section != null && Boolean.TRUE.equals(section.getOptional()));
    }

    private List<HelpCenterSection> normalizeSections(List<HelpCenterSectionDto> sections, String kind) {
        if (sections == null || sections.isEmpty()) {
            return List.of();
        }
        List<HelpCenterSection> normalized = new ArrayList<>();
        Set<String> ids = new LinkedHashSet<>();
        for (int index = 0; index < sections.size(); index++) {
            HelpCenterSectionDto source = sections.get(index);
            String title = text(source == null ? null : source.title(), documentLabel(kind) + " section " + (index + 1));
            String baseId = slug(source == null ? null : source.id());
            if (!StringUtils.hasText(baseId)) {
                baseId = slug(title);
            }
            if (!StringUtils.hasText(baseId)) {
                baseId = "section-" + (index + 1);
            }
            String id = uniqueId(baseId, ids);
            String html = sanitizeHtml(source == null ? null : source.contentHtml());
            if (!StringUtils.hasText(html)) {
                continue;
            }
            HelpCenterSection section = new HelpCenterSection();
            section.setId(id);
            section.setIcon(text(source == null ? null : source.icon(), defaultSectionIcon(kind)));
            section.setTitle(title);
            section.setBlurb(normalize(source == null ? null : source.blurb()));
            section.setContentHtml(html);
            section.setImageUrls(normalizeImageUrls(source == null ? null : source.imageUrls()));
            section.setPanelSpan(normalizePanelSpan(source == null ? null : source.panelSpan(), id));
            section.setOptional(DOCUMENT_PRIVACY.equals(kind) && source != null && Boolean.TRUE.equals(source.optional()));
            normalized.add(section);
        }
        return normalized;
    }

    private String uniqueId(String baseId, Set<String> ids) {
        String id = baseId;
        int index = 2;
        while (ids.contains(id)) {
            id = baseId + "-" + index++;
        }
        ids.add(id);
        return id;
    }

    private String sanitizeHtml(String html) {
        String normalized = html == null ? "" : html.trim();
        if (!StringUtils.hasText(normalized)) {
            return "";
        }
        return Jsoup.clean(normalized, HELP_HTML_SAFELIST);
    }

    private HelpCenterRevisionDto toRevisionDto(HelpCenterRevision revision) {
        String kind = revisionKind(revision);
        String language = revisionLang(revision);
        return new HelpCenterRevisionDto(
                revision.getId(),
                kind,
                revisionContext(revision),
                language,
                languageLabel(language),
                revision.getVersion(),
                text(revision.getTitle(), defaultRevisionTitle(kind, language, revisionContext(revision))),
                normalize(revision.getSummary()),
                text(revision.getDescription(), defaultDescription(kind, language)),
                headerColor(revision.getHeaderColor()),
                revision.getSections() == null
                        ? List.of()
                        : revision.getSections().stream().map(section -> toSectionDto(section, kind)).toList(),
                Boolean.TRUE.equals(revision.getActive()),
                normalize(revision.getCreatedDate()),
                normalize(revision.getCreatedUser()),
                normalize(revision.getUpdatedDate()),
                normalize(revision.getUpdatedUser()));
    }

    private HelpCenterSectionDto toSectionDto(HelpCenterSection section, String kind) {
        return new HelpCenterSectionDto(
                normalize(section.getId()),
                text(section.getIcon(), defaultSectionIcon(kind)),
                text(section.getTitle(), documentLabel(kind) + " section"),
                normalize(section.getBlurb()),
                normalize(section.getContentHtml()),
                normalizeImageUrls(section.getImageUrls()),
                normalizePanelSpan(section.getPanelSpan(), section.getId()),
                DOCUMENT_PRIVACY.equals(kind) && Boolean.TRUE.equals(section.getOptional()));
    }

    private String normalizePanelSpan(String panelSpan, String sectionId) {
        String normalized = normalize(panelSpan).toLowerCase(Locale.ROOT);
        if ("span-1".equals(normalized) || "compact".equals(normalized) || "single".equals(normalized) || "one".equals(normalized) || "1".equals(normalized)) {
            return "span-1";
        }
        if ("span-2".equals(normalized) || "wide".equals(normalized) || "double".equals(normalized) || "two".equals(normalized) || "2".equals(normalized)) {
            return "span-2";
        }
        if ("span-3".equals(normalized) || "full".equals(normalized) || "row".equals(normalized) || "all".equals(normalized) || "3".equals(normalized)) {
            return "span-3";
        }
        return defaultPanelSpan(sectionId);
    }

    private String defaultPanelSpan(String sectionId) {
        String id = normalize(sectionId);
        if ("affinity-network".equals(id)
                || "activity-event-entry".equals(id)
                || "activity-event-actions".equals(id)
                || "activity-event-hosting".equals(id)
                || "activity-chat-message-window".equals(id)
                || "contacts-list".equals(id)
                || "contacts-card".equals(id)
                || "contacts-private-methods".equals(id)
                || "assets-entry".equals(id)
                || "assets-card".equals(id)
                || "assets-editor".equals(id)
                || "assets-requests".equals(id)
                || "assets-scope".equals(id)
                || "event-editor-main".equals(id)
                || "event-editor-subevents".equals(id)) {
            return "span-2";
        }
        return "span-1";
    }

    private List<String> normalizeImageUrls(List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            return List.of();
        }
        List<String> normalized = new ArrayList<>();
        Set<String> seen = new LinkedHashSet<>();
        for (String imageUrl : imageUrls) {
            String value = normalize(imageUrl);
            if (!StringUtils.hasText(value) || !seen.add(value)) {
                continue;
            }
            normalized.add(value);
            if (normalized.size() >= 8) {
                break;
            }
        }
        return normalized;
    }

    private HelpCenterAuditEntryDto toAuditDto(HelpCenterAuditEntry entry) {
        String language = auditLang(entry);
        return new HelpCenterAuditEntryDto(
                entry.getId(),
                auditKind(entry),
                language,
                languageLabel(language),
                normalize(entry.getRevisionId()),
                entry.getVersion(),
                normalize(entry.getAction()),
                normalize(entry.getActorUserId()),
                normalize(entry.getCreatedDate()),
                normalize(entry.getMessage()));
    }

    private PrivacyConsentDto toPrivacyConsentDto(PrivacyConsent consent) {
        return new PrivacyConsentDto(
                normalize(consent.getId()),
                normalize(consent.getUserId()),
                normalize(consent.getRevisionId()),
                Math.max(1, consent.getRevisionVersion() == null ? 1 : consent.getRevisionVersion()),
                consent.getApprovedOptionalSectionIds() == null
                        ? List.of()
                        : consent.getApprovedOptionalSectionIds().stream()
                                .map(this::normalize)
                                .filter(StringUtils::hasText)
                                .distinct()
                                .sorted()
                                .toList(),
                normalize(consent.getAcceptedAtIso()),
                normalize(consent.getUpdatedAtIso()),
                privacyConsentSource(consent.getSource()));
    }

    private List<String> normalizeOptionalConsentSectionIds(List<String> sectionIds, HelpCenterRevision revision) {
        Set<String> optionalSectionIds = new LinkedHashSet<>();
        if (revision.getSections() != null) {
            for (HelpCenterSection section : revision.getSections()) {
                String sectionId = normalize(section == null ? null : section.getId());
                if (StringUtils.hasText(sectionId) && section != null && Boolean.TRUE.equals(section.getOptional())) {
                    optionalSectionIds.add(sectionId);
                }
            }
        }
        if (sectionIds == null || sectionIds.isEmpty() || optionalSectionIds.isEmpty()) {
            return List.of();
        }
        Set<String> approvedIds = new LinkedHashSet<>();
        for (String sectionId : sectionIds) {
            String normalizedSectionId = normalize(sectionId);
            if (optionalSectionIds.contains(normalizedSectionId)) {
                approvedIds.add(normalizedSectionId);
            }
        }
        return new ArrayList<>(approvedIds);
    }

    private void audit(String action, String actorUserId, HelpCenterRevision revision, String message) {
        String kind = revisionKind(revision);
        String language = revisionLang(revision);
        HelpCenterAuditEntry entry = new HelpCenterAuditEntry();
        entry.setId(new ObjectId().toHexString());
        entry.setRevisionId(revision.getId());
        entry.setDocumentType(kind);
        entry.setLang(language);
        entry.setLanguageLabel(languageLabel(language));
        entry.setVersion(revision.getVersion());
        entry.setAction(action);
        entry.setActorUserId(text(actorUserId, "admin"));
        entry.setCreatedDate(Instant.now().toString());
        entry.setMessage(message);
        auditRepository.save(entry);
    }

    private void backfillDocumentTypes() {
        List<HelpCenterRevision> revisions = revisionsRepository.findAllByOrderByVersionDesc();
        boolean revisionsChanged = false;
        for (HelpCenterRevision revision : revisions) {
            String kind = revisionKind(revision);
            String language = revisionLang(revision);
            String color = headerColor(revision.getHeaderColor());
            if (!StringUtils.hasText(revision.getDocumentType())) {
                revision.setDocumentType(kind);
                revisionsChanged = true;
            }
            if (!StringUtils.hasText(revision.getLang())) {
                revision.setLang(language);
                revisionsChanged = true;
            }
            if (!languageLabel(language).equals(revision.getLanguageLabel())) {
                revision.setLanguageLabel(languageLabel(language));
                revisionsChanged = true;
            }
            if (!color.equals(revision.getHeaderColor())) {
                revision.setHeaderColor(color);
                revisionsChanged = true;
            }
        }
        if (revisionsChanged) {
            revisionsRepository.saveAll(revisions);
        }

        List<HelpCenterAuditEntry> auditEntries = auditRepository.findAllByOrderByCreatedDateDesc();
        boolean auditChanged = false;
        for (HelpCenterAuditEntry entry : auditEntries) {
            String kind = auditKind(entry);
            String language = auditLang(entry);
            if (!StringUtils.hasText(entry.getDocumentType())) {
                entry.setDocumentType(kind);
                auditChanged = true;
            }
            if (!StringUtils.hasText(entry.getLang())) {
                entry.setLang(language);
                auditChanged = true;
            }
            if (!languageLabel(language).equals(entry.getLanguageLabel())) {
                entry.setLanguageLabel(languageLabel(language));
                auditChanged = true;
            }
        }
        if (auditChanged) {
            auditRepository.saveAll(auditEntries);
        }
    }

    private void dropLegacyVersionIndex() {
        try {
            List<String> indexNames = mongoTemplate.indexOps(HelpCenterRevision.class).getIndexInfo().stream()
                    .map(IndexInfo::getName)
                    .toList();
            for (String indexName : List.of(
                    LEGACY_VERSION_INDEX,
                    "help_revision_document_version",
                    "help_revision_document_active",
                    "help_revision_document_lang_version",
                    "help_revision_document_lang_active")) {
                if (indexNames.contains(indexName)) {
                    mongoTemplate.indexOps(HelpCenterRevision.class).dropIndex(indexName);
                }
            }
        } catch (RuntimeException ignored) {
            // Startup seeding should still work if the index metadata cannot be read in a transient state.
        }
    }

    private List<HelpCenterRevision> revisionsForKind(List<HelpCenterRevision> revisions, String kind, String lang) {
        return revisionsForKind(revisions, kind, lang, null);
    }

    private List<HelpCenterRevision> revisionsForKind(List<HelpCenterRevision> revisions, String kind, String lang, String contextKey) {
        String language = contentLang(lang);
        String context = contextKey(kind, contextKey, false);
        boolean filterByContext = DOCUMENT_EXPLANATION.equals(kind) && StringUtils.hasText(context);
        return revisions.stream()
                .filter(revision -> kind.equals(revisionKind(revision)))
                .filter(revision -> language.equals(revisionLang(revision)))
                .filter(revision -> !filterByContext || context.equals(revisionContext(revision)))
                .peek(revision -> revision.setDocumentType(kind))
                .peek(revision -> {
                    revision.setLang(language);
                    revision.setContextKey(revisionContext(revision));
                    revision.setLanguageLabel(languageLabel(language));
                })
                .toList();
    }

    private String revisionContext(HelpCenterRevision revision) {
        return contextKey(revisionKind(revision), revision == null ? null : revision.getContextKey(), false);
    }

    private static boolean isAssetExplanationContext(String contextKey) {
        return EXPLANATION_ASSETS_CONTEXT.equals(contextKey)
                || EXPLANATION_ASSETS_CAR_CONTEXT.equals(contextKey)
                || EXPLANATION_ASSETS_ACCOMMODATION_CONTEXT.equals(contextKey)
                || EXPLANATION_ASSETS_SUPPLIES_CONTEXT.equals(contextKey)
                || EXPLANATION_ASSETS_TICKETS_CONTEXT.equals(contextKey);
    }

    private String contextKey(String kind, String contextKey, boolean required) {
        if (!DOCUMENT_EXPLANATION.equals(kind)) {
            return "";
        }
        String normalized = normalize(contextKey);
        if (!StringUtils.hasText(normalized) && !required) {
            return "";
        }
        if (!StringUtils.hasText(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Explanation context is required.");
        }
        if (!EXPLANATION_CONTEXT_KEYS.contains(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown explanation context.");
        }
        return normalized;
    }

    private String revisionKind(HelpCenterRevision revision) {
        return documentKind(revision == null ? null : revision.getDocumentType());
    }

    private String auditKind(HelpCenterAuditEntry entry) {
        return documentKind(entry == null ? null : entry.getDocumentType());
    }

    private String revisionLang(HelpCenterRevision revision) {
        return contentLang(revision == null ? null : revision.getLang());
    }

    private String auditLang(HelpCenterAuditEntry entry) {
        return contentLang(entry == null ? null : entry.getLang());
    }

    private String documentKind(String documentType) {
        String normalized = normalize(documentType).toLowerCase(Locale.ROOT);
        if (DOCUMENT_PRIVACY.equals(normalized)) {
            return DOCUMENT_PRIVACY;
        }
        if (DOCUMENT_EXPLANATION.equals(normalized)) {
            return DOCUMENT_EXPLANATION;
        }
        return DOCUMENT_HELP;
    }

    private String defaultTitle(String kind, Integer version, String lang) {
        if ("hu".equals(contentLang(lang))) {
            if (DOCUMENT_PRIVACY.equals(kind)) {
                return "Adatvédelmi verzió v" + version;
            }
            if (DOCUMENT_EXPLANATION.equals(kind)) {
                return "Magyarázat verzió v" + version;
            }
            return "Súgó verzió v" + version;
        }
        if (DOCUMENT_PRIVACY.equals(kind)) {
            return "Privacy revision v" + version;
        }
        if (DOCUMENT_EXPLANATION.equals(kind)) {
            return "Explanation revision v" + version;
        }
        return "Help revision v" + version;
    }

    private String defaultRevisionTitle(String kind, String lang, String contextKey) {
        String context = contextKey(kind, contextKey, false);
        if ("hu".equals(contentLang(lang))) {
            if (DOCUMENT_PRIVACY.equals(kind)) {
                return "Adatvédelem";
            }
            if (DOCUMENT_EXPLANATION.equals(kind)) {
                if (EXPLANATION_ACTIVITY_RATES_CONTEXT.equals(context)) {
                    return "Értékelések magyarázat";
                }
                if (EXPLANATION_CHATS_CONTEXT.equals(context)) {
                    return "Chatek magyarázat";
                }
                if (EXPLANATION_CONTACTS_CONTEXT.equals(context)) {
                    return "Kapcsolatok magyarázat";
                }
                if (EXPLANATION_ASSETS_CAR_CONTEXT.equals(context)) {
                    return "Autó eszközök magyarázat";
                }
                if (EXPLANATION_ASSETS_ACCOMMODATION_CONTEXT.equals(context)) {
                    return "Ingatlan eszközök magyarázat";
                }
                if (EXPLANATION_ASSETS_SUPPLIES_CONTEXT.equals(context)) {
                    return "Kellék eszközök magyarázat";
                }
                if (EXPLANATION_ASSETS_TICKETS_CONTEXT.equals(context)) {
                    return "Jegyek magyarázat";
                }
                if (EXPLANATION_ASSETS_CONTEXT.equals(context)) {
                    return "Eszközök magyarázat";
                }
                if (EXPLANATION_EVENTS_CONTEXT.equals(context)) {
                    return "Események magyarázat";
                }
                if (EXPLANATION_EVENT_EDITOR_CONTEXT.equals(context)) {
                    return "Eseményszerkesztő segítség";
                }
                return "Kezdőlap magyarázat";
            }
            return "MyScoutee súgó";
        }
        if (DOCUMENT_PRIVACY.equals(kind)) {
            return "Data privacy";
        }
        if (DOCUMENT_EXPLANATION.equals(kind)) {
            if (EXPLANATION_ACTIVITY_RATES_CONTEXT.equals(context)) {
                return "Activity ratings explanation";
            }
            if (EXPLANATION_CHATS_CONTEXT.equals(context)) {
                return "Chats explanation";
            }
            if (EXPLANATION_CONTACTS_CONTEXT.equals(context)) {
                return "Contacts explanation";
            }
            if (EXPLANATION_ASSETS_CAR_CONTEXT.equals(context)) {
                return "Car assets explanation";
            }
            if (EXPLANATION_ASSETS_ACCOMMODATION_CONTEXT.equals(context)) {
                return "Accommodation assets explanation";
            }
            if (EXPLANATION_ASSETS_SUPPLIES_CONTEXT.equals(context)) {
                return "Supply assets explanation";
            }
            if (EXPLANATION_ASSETS_TICKETS_CONTEXT.equals(context)) {
                return "Tickets explanation";
            }
            if (EXPLANATION_ASSETS_CONTEXT.equals(context)) {
                return "Assets explanation";
            }
            if (EXPLANATION_EVENTS_CONTEXT.equals(context)) {
                return "Events explanation";
            }
            if (EXPLANATION_EVENT_EDITOR_CONTEXT.equals(context)) {
                return "Event editor guide";
            }
            return "Home explanation";
        }
        return "MyScoutee help";
    }

    private String defaultSummary(String kind, String lang, String contextKey) {
        String context = contextKey(kind, contextKey, false);
        if ("hu".equals(contentLang(lang))) {
            if (DOCUMENT_PRIVACY.equals(kind)) {
                return "Adatvédelem elsőként";
            }
            if (DOCUMENT_EXPLANATION.equals(kind)) {
                if (EXPLANATION_ACTIVITY_RATES_CONTEXT.equals(context)) {
                    return "Szűrés, sorrend és pontozás az értékeléskártyákon";
                }
                if (EXPLANATION_CHATS_CONTEXT.equals(context)) {
                    return "Chatlisták, csatornatípusok és az üzenetablak";
                }
                if (EXPLANATION_CONTACTS_CONTEXT.equals(context)) {
                    return "Mentett kapcsolatok, kártyák, privátabb elérések és szerkesztés";
                }
                if (EXPLANATION_ASSETS_CAR_CONTEXT.equals(context)) {
                    return "Saját autók, kérések és szerkesztés";
                }
                if (EXPLANATION_ASSETS_ACCOMMODATION_CONTEXT.equals(context)) {
                    return "Saját ingatlanok, kérések és szerkesztés";
                }
                if (EXPLANATION_ASSETS_SUPPLIES_CONTEXT.equals(context)) {
                    return "Saját kellékek, mennyiségek és kérések";
                }
                if (EXPLANATION_ASSETS_TICKETS_CONTEXT.equals(context)) {
                    return "Eseményjegyek, QR kódok és beléptetés";
                }
                if (EXPLANATION_ASSETS_CONTEXT.equals(context)) {
                    return "Saját eszközök, kérések, esemény-erőforrások és jegyek";
                }
                if (EXPLANATION_EVENTS_CONTEXT.equals(context)) {
                    return "Eseménylisták, kártyák, csatlakozás és szervezés";
                }
                if (EXPLANATION_EVENT_EDITOR_CONTEXT.equals(context)) {
                    return "Fő beállítások, szerepek, részek, erőforrások és bajnokság";
                }
                return "Így működik a kezdőlap";
            }
            return "Mit tehetsz a MyScoutee-ban";
        }
        if (DOCUMENT_PRIVACY.equals(kind)) {
            return "Privacy first";
        }
        if (DOCUMENT_EXPLANATION.equals(kind)) {
            if (EXPLANATION_ACTIVITY_RATES_CONTEXT.equals(context)) {
                return "Filters, order, and scoring for rating cards";
            }
            if (EXPLANATION_CHATS_CONTEXT.equals(context)) {
                return "Chat lists, channel types, and the message window";
            }
            if (EXPLANATION_CONTACTS_CONTEXT.equals(context)) {
                return "Saved contacts, cards, private reach methods, and editing";
            }
            if (EXPLANATION_ASSETS_CAR_CONTEXT.equals(context)) {
                return "Own cars, requests, and editing";
            }
            if (EXPLANATION_ASSETS_ACCOMMODATION_CONTEXT.equals(context)) {
                return "Own accommodation, requests, and editing";
            }
            if (EXPLANATION_ASSETS_SUPPLIES_CONTEXT.equals(context)) {
                return "Own supplies, quantities, and requests";
            }
            if (EXPLANATION_ASSETS_TICKETS_CONTEXT.equals(context)) {
                return "Event tickets, QR codes, and check-in";
            }
            if (EXPLANATION_ASSETS_CONTEXT.equals(context)) {
                return "Own assets, requests, event resources, and tickets";
            }
            if (EXPLANATION_EVENTS_CONTEXT.equals(context)) {
                return "Event lists, cards, joining, and hosting";
            }
            if (EXPLANATION_EVENT_EDITOR_CONTEXT.equals(context)) {
                return "Main event settings, roles, parts, resources, and tournament flow";
            }
            return "How the home screen works";
        }
        return "What you can do in MyScoutee";
    }

    private String defaultDescription(String kind, String lang) {
        if ("hu".equals(contentLang(lang))) {
            if (DOCUMENT_PRIVACY.equals(kind)) {
                return "Folytatás előtt nézd át és fogadd el, hogyan használja a MyScoutee az adataidat.";
            }
            if (DOCUMENT_EXPLANATION.equals(kind)) {
                return "Rövid alkalmazáson belüli útmutató a kiválasztott képernyőhöz.";
            }
            return "A MyScoutee segít az eseményeket elejétől végéig megtervezni: meghívások, szakaszok és csoportok, erőforrások, valamint kontextushoz kötött csevegések.";
        }
        if (DOCUMENT_PRIVACY.equals(kind)) {
            return DEFAULT_PRIVACY_DESCRIPTION;
        }
        if (DOCUMENT_EXPLANATION.equals(kind)) {
            return DEFAULT_EXPLANATION_DESCRIPTION;
        }
        return DEFAULT_HELP_DESCRIPTION;
    }

    private List<ContentLanguageDto> contentLanguages() {
        return List.of(
                new ContentLanguageDto("en", "English"),
                new ContentLanguageDto("hu", "Magyar"));
    }

    private String contentLang(String value) {
        return text(supportedContentLang(value), DEFAULT_LANG);
    }

    private String supportedContentLang(String value) {
        String normalized = normalize(value).toLowerCase(Locale.ROOT);
        int semicolonIndex = normalized.indexOf(';');
        if (semicolonIndex > 0) {
            normalized = normalized.substring(0, semicolonIndex);
        }
        int dashIndex = normalized.indexOf('-');
        if (dashIndex > 0) {
            normalized = normalized.substring(0, dashIndex);
        }
        return "hu".equals(normalized) || DEFAULT_LANG.equals(normalized) ? normalized : "";
    }

    private String requestContentLang(String explicitLang, String acceptLanguage) {
        if (StringUtils.hasText(normalize(explicitLang))) {
            return contentLang(explicitLang);
        }
        for (String candidate : normalize(acceptLanguage).split(",")) {
            String supportedLang = supportedContentLang(candidate);
            if (StringUtils.hasText(supportedLang)) {
                return supportedLang;
            }
        }
        return DEFAULT_LANG;
    }

    private String languageLabel(String lang) {
        return "hu".equals(contentLang(lang)) ? "Magyar" : "English";
    }

    private String headerColor(String value) {
        return switch (normalize(value)) {
            case "blue", "green", "rose", "violet", "slate" -> normalize(value);
            default -> "amber";
        };
    }

    private String defaultSectionIcon(String kind) {
        if (DOCUMENT_PRIVACY.equals(kind)) {
            return "policy";
        }
        if (DOCUMENT_EXPLANATION.equals(kind)) {
            return "tips_and_updates";
        }
        return "help_outline";
    }

    private String documentLabel(String kind) {
        if (DOCUMENT_PRIVACY.equals(kind)) {
            return "Privacy";
        }
        if (DOCUMENT_EXPLANATION.equals(kind)) {
            return "Explanation";
        }
        return "Help";
    }

    private String ensureAdmin(String adminUserId) {
        String normalized = normalize(adminUserId);
        if (configProperties.isFirebaseEnabled()) {
            String email = resolveFirebaseEmail();
            String configured = normalize(configProperties.getAdminUser());
            if (!StringUtils.hasText(email) || !StringUtils.hasText(configured) || !configured.equalsIgnoreCase(email)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access is restricted.");
            }
            return StringUtils.hasText(normalized) ? normalized : email;
        }
        if (MongoSessionModeContext.currentMode() != MongoSessionMode.DEMO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin demo access is restricted to demo data.");
        }
        return StringUtils.hasText(normalized) ? normalized : "admin";
    }

    private String resolveFirebaseEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication == null ? null : authentication.getPrincipal();
        if (principal instanceof FirebasePrincipal firebasePrincipal) {
            return normalize(firebasePrincipal.getEmail());
        }
        return normalize(authentication == null ? null : authentication.getName());
    }

    private String slug(String value) {
        String normalized = normalize(value).toLowerCase(Locale.ROOT);
        if (!StringUtils.hasText(normalized)) {
            return "";
        }
        return normalized
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
    }

    private String text(String value, String fallback) {
        String normalized = normalize(value);
        return StringUtils.hasText(normalized) ? normalized : fallback;
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private String privacyConsentSource(String value) {
        return "entry".equals(normalize(value)) ? "entry" : "settings";
    }
}
