package com.raxim.myscoutee.profile.service;

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
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

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
    private static final int REVISION_SAVE_MAX_ATTEMPTS = 5;
    private static final String EXPLANATION_CHATS_CONTEXT = "chats";
    private static final String EXPLANATION_CONTACTS_CONTEXT = "contacts";
    private static final String EXPLANATION_ASSETS_CONTEXT = "assets";
    private static final String EXPLANATION_ASSETS_CAR_CONTEXT = "assets.car";
    private static final String EXPLANATION_ASSETS_ACCOMMODATION_CONTEXT = "assets.accommodation";
    private static final String EXPLANATION_ASSETS_SUPPLIES_CONTEXT = "assets.supplies";
    private static final String EXPLANATION_ASSETS_TICKETS_CONTEXT = "assets.tickets";
    private static final String EXPLANATION_EVENTS_CONTEXT = "events";
    private static final String EXPLANATION_EVENT_EDITOR_CONTEXT = "event.editor";
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
    private final AdminTelemetryService adminTelemetryService;
    private final AppSettingsService appSettingsService;

    public HelpCenterService(
            ConfigProperties configProperties,
            HelpCenterRevisionsRepository revisionsRepository,
            HelpCenterAuditRepository auditRepository,
            PrivacyConsentsRepository privacyConsentsRepository,
            AdminTelemetryService adminTelemetryService,
            AppSettingsService appSettingsService) {
        this.configProperties = configProperties;
        this.revisionsRepository = revisionsRepository;
        this.auditRepository = auditRepository;
        this.privacyConsentsRepository = privacyConsentsRepository;
        this.adminTelemetryService = adminTelemetryService;
        this.appSettingsService = appSettingsService;
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
            return new HelpCenterStateDto(null, List.of(), List.of(), List.of());
        }
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
                List.of());
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
        List<HelpCenterSection> sections = normalizeSections(request == null ? null : request.sections(), kind);
        HelpCenterRevision saved = saveNewRevisionWithNextVersion(request, kind, language, context, actorUserId, sections);
        String baseRevisionId = normalize(request == null ? null : request.baseRevisionId());
        audit("create", actorUserId, saved, StringUtils.hasText(baseRevisionId)
                ? "Created v" + saved.getVersion() + " from " + baseRevisionId + "."
                : "Created v" + saved.getVersion() + ".");
        adminTelemetryService.record("content.revision.saved", "content", saved.getId(), actorUserId);
        return fullState(kind, language, context);
    }

    private HelpCenterRevision saveNewRevisionWithNextVersion(
            HelpCenterRevisionSaveRequestDto request,
            String kind,
            String language,
            String context,
            String actorUserId,
            List<HelpCenterSection> sections) {
        DuplicateKeyException lastDuplicate = null;
        for (int attempt = 0; attempt < REVISION_SAVE_MAX_ATTEMPTS; attempt++) {
            List<HelpCenterRevision> currentRevisions = revisionsForKind(
                    revisionsRepository.findAllByOrderByVersionDesc(),
                    kind,
                    language,
                    context);
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
            revision.setSummary(normalize(request == null ? null : request.summary()));
            revision.setDescription(normalize(request == null ? null : request.description()));
            revision.setHeaderColor(headerColor(request == null ? null : request.headerColor()));
            revision.setSections(sections);
            revision.setCreatedDate(nowIso);
            revision.setCreatedUser(actorUserId);
            revision.setUpdatedDate(nowIso);
            revision.setUpdatedUser(actorUserId);
            try {
                return revisionsRepository.save(revision);
            } catch (DuplicateKeyException duplicateKeyException) {
                lastDuplicate = duplicateKeyException;
            }
        }
        throw new DuplicateKeyException("Could not allocate a help center revision version after retries.", lastDuplicate);
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
        return fullState(kind, language, targetContext);
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
        return fullState(kind, language, targetContext);
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
                List.of());
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
                text(revision.getTitle(), defaultTitle(kind, revision.getVersion(), language)),
                normalize(revision.getSummary()),
                normalize(revision.getDescription()),
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
        if (DOCUMENT_PRIVACY.equals(kind)) {
            return "Privacy revision v" + version;
        }
        if (DOCUMENT_EXPLANATION.equals(kind)) {
            return "Explanation revision v" + version;
        }
        return "Help revision v" + version;
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
            if (!appSettingsService.isAdminEmail(email)) {
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
