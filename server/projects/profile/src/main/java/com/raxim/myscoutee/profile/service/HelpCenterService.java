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
    private static final String LEGACY_VERSION_INDEX = "help_revision_version";
    private static final String DEFAULT_PRIVACY_SEED_RESOURCE = "classpath:mongo-seed/profile/helpCenterPrivacyDefault.json";
    private static final String DEFAULT_HELP_DESCRIPTION = "MyScoutee helps you plan events end-to-end: invite people, split into stages/groups, assign resources, and coordinate in context chats.";
    private static final String DEFAULT_PRIVACY_DESCRIPTION = "Before continuing, please review and accept how your data is used in MyScoutee.";
    private static final Safelist HELP_HTML_SAFELIST = Safelist.relaxed()
            .addTags("section", "article", "h3", "h4")
            .addAttributes(":all", "class")
            .addAttributes("a", "target", "rel")
            .addProtocols("a", "href", "http", "https", "mailto");

    private final ConfigProperties configProperties;
    private final HelpCenterRevisionsRepository revisionsRepository;
    private final HelpCenterAuditRepository auditRepository;
    private final PrivacyConsentsRepository privacyConsentsRepository;
    private final MongoTemplate mongoTemplate;
    private final ObjectMapper objectMapper;
    private final ResourceLoader resourceLoader;

    public HelpCenterService(
            ConfigProperties configProperties,
            HelpCenterRevisionsRepository revisionsRepository,
            HelpCenterAuditRepository auditRepository,
            PrivacyConsentsRepository privacyConsentsRepository,
            MongoTemplate mongoTemplate,
            ObjectMapper objectMapper,
            ResourceLoader resourceLoader) {
        this.configProperties = configProperties;
        this.revisionsRepository = revisionsRepository;
        this.auditRepository = auditRepository;
        this.privacyConsentsRepository = privacyConsentsRepository;
        this.mongoTemplate = mongoTemplate;
        this.objectMapper = objectMapper;
        this.resourceLoader = resourceLoader;
    }

    public HelpCenterStateDto activeState() {
        return activeState(DOCUMENT_HELP);
    }

    public HelpCenterStateDto activeState(String documentType) {
        String kind = documentKind(documentType);
        ensureDefaultRevision(kind);
        HelpCenterRevision active = revisionsForKind(revisionsRepository.findAllByOrderByVersionDesc(), kind).stream()
                .filter(revision -> Boolean.TRUE.equals(revision.getActive()))
                .max(Comparator.comparing(HelpCenterRevision::getVersion, Comparator.nullsLast(Integer::compareTo)))
                .orElse(null);
        return new HelpCenterStateDto(
                active == null ? null : toRevisionDto(active),
                active == null ? List.of() : List.of(toRevisionDto(active)),
                List.of());
    }

    public HelpCenterStateDto adminState(String adminUserId) {
        return adminState(adminUserId, DOCUMENT_HELP);
    }

    public HelpCenterStateDto adminState(String adminUserId, String documentType) {
        String kind = documentKind(documentType);
        ensureAdmin(adminUserId);
        ensureDefaultRevision(kind);
        return fullState(kind);
    }

    public HelpCenterStateDto saveRevision(HelpCenterRevisionSaveRequestDto request) {
        return saveRevision(request, DOCUMENT_HELP);
    }

    public HelpCenterStateDto saveRevision(HelpCenterRevisionSaveRequestDto request, String documentType) {
        String kind = documentKind(documentType);
        String actorUserId = ensureAdmin(request == null ? null : request.actorUserId());
        ensureDefaultRevision(kind);
        List<HelpCenterSection> sections = normalizeSections(request == null ? null : request.sections(), kind);
        List<HelpCenterRevision> currentRevisions = revisionsForKind(revisionsRepository.findAllByOrderByVersionDesc(), kind);
        Integer nextVersion = currentRevisions.stream()
                .map(HelpCenterRevision::getVersion)
                .filter(value -> value != null && value > 0)
                .max(Integer::compareTo)
                .orElse(0) + 1;
        String nowIso = Instant.now().toString();
        HelpCenterRevision revision = new HelpCenterRevision();
        revision.setDocumentType(kind);
        revision.setVersion(nextVersion);
        revision.setActive(false);
        revision.setTitle(text(request == null ? null : request.title(), defaultTitle(kind, nextVersion)));
        revision.setSummary(text(request == null ? null : request.summary(), defaultSummary(kind)));
        revision.setDescription(text(request == null ? null : request.description(), defaultDescription(kind)));
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
        return fullState(kind);
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
        List<HelpCenterRevision> revisions = revisionsRepository.findAllByOrderByVersionDesc();
        for (HelpCenterRevision revision : revisions) {
            String revisionKind = revisionKind(revision);
            revision.setDocumentType(revisionKind);
            if (kind.equals(revisionKind)) {
                revision.setActive(normalizedRevisionId.equals(revision.getId()));
            }
        }
        revisionsRepository.saveAll(revisions);
        audit("activate", actorUserId, target, "Activated v" + target.getVersion() + ".");
        return fullState(kind);
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
        boolean wasActive = Boolean.TRUE.equals(target.getActive());
        revisionsRepository.delete(target);
        audit("delete", actorUserId, target, "Deleted v" + target.getVersion() + ".");
        if (wasActive) {
            revisionsForKind(revisionsRepository.findAllByOrderByVersionDesc(), kind).stream().findFirst().ifPresent(next -> {
                next.setActive(true);
                next.setDocumentType(kind);
                revisionsRepository.save(next);
            });
        }
        return fullState(kind);
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

    private HelpCenterStateDto fullState(String kind) {
        List<HelpCenterRevision> revisions = revisionsForKind(revisionsRepository.findAllByOrderByVersionDesc(), kind);
        HelpCenterRevision active = revisions.stream()
                .filter(revision -> Boolean.TRUE.equals(revision.getActive()))
                .max(Comparator.comparing(HelpCenterRevision::getVersion, Comparator.nullsLast(Integer::compareTo)))
                .orElse(null);
        List<HelpCenterAuditEntry> auditTrail = auditRepository.findAllByOrderByCreatedDateDesc().stream()
                .filter(entry -> kind.equals(auditKind(entry)))
                .toList();
        return new HelpCenterStateDto(
                active == null ? null : toRevisionDto(active),
                revisions.stream().map(this::toRevisionDto).toList(),
                auditTrail.stream().map(this::toAuditDto).toList());
    }

    private void ensureDefaultRevision(String kind) {
        dropLegacyVersionIndex();
        backfillDocumentTypes();
        if (!revisionsForKind(revisionsRepository.findAllByOrderByVersionDesc(), kind).isEmpty()) {
            return;
        }
        String nowIso = Instant.now().toString();
        HelpCenterRevision revision = seedRevision(kind);
        revision.setDocumentType(kind);
        revision.setVersion(revision.getVersion() == null || revision.getVersion() <= 0 ? 1 : revision.getVersion());
        revision.setActive(true);
        revision.setTitle(text(revision.getTitle(), defaultRevisionTitle(kind)));
        revision.setSummary(text(revision.getSummary(), defaultSummary(kind)));
        revision.setDescription(text(revision.getDescription(), defaultDescription(kind)));
        revision.setHeaderColor(headerColor(revision.getHeaderColor()));
        revision.setSections(revision.getSections() == null || revision.getSections().isEmpty()
                ? defaultSections(kind)
                : normalizeSections(revision.getSections().stream().map(this::toSectionDtoForSeed).toList(), kind));
        revision.setCreatedDate(nowIso);
        revision.setCreatedUser("system");
        revision.setUpdatedDate(nowIso);
        revision.setUpdatedUser("system");
        HelpCenterRevision saved = revisionsRepository.save(revision);
        audit("seed", "system", saved, "Seeded default " + documentLabel(kind).toLowerCase(Locale.ROOT) + " revision v1.");
    }

    private List<HelpCenterSection> defaultSections(String kind) {
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
        section.setOptional(false);
        return section;
    }

    private HelpCenterRevision seedRevision(String kind) {
        if (DOCUMENT_PRIVACY.equals(kind)) {
            Resource resource = resourceLoader.getResource(DEFAULT_PRIVACY_SEED_RESOURCE);
            if (resource.exists()) {
                try (InputStream inputStream = resource.getInputStream()) {
                    return objectMapper.readValue(inputStream, HelpCenterRevision.class);
                } catch (IOException ignored) {
                    // Fall back to the built-in seed if the JSON resource is unavailable or malformed.
                }
            }
        }
        HelpCenterRevision revision = new HelpCenterRevision();
        revision.setDocumentType(kind);
        revision.setVersion(1);
        revision.setTitle(defaultRevisionTitle(kind));
        revision.setSummary(defaultSummary(kind));
        revision.setDescription(defaultDescription(kind));
        revision.setHeaderColor("amber");
        revision.setSections(defaultSections(kind));
        return revision;
    }

    private HelpCenterSectionDto toSectionDtoForSeed(HelpCenterSection section) {
        return new HelpCenterSectionDto(
                normalize(section == null ? null : section.getId()),
                normalize(section == null ? null : section.getIcon()),
                normalize(section == null ? null : section.getTitle()),
                normalize(section == null ? null : section.getBlurb()),
                normalize(section == null ? null : section.getContentHtml()),
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
        return new HelpCenterRevisionDto(
                revision.getId(),
                kind,
                revision.getVersion(),
                text(revision.getTitle(), defaultRevisionTitle(kind)),
                normalize(revision.getSummary()),
                text(revision.getDescription(), defaultDescription(kind)),
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
                DOCUMENT_PRIVACY.equals(kind) && Boolean.TRUE.equals(section.getOptional()));
    }

    private HelpCenterAuditEntryDto toAuditDto(HelpCenterAuditEntry entry) {
        return new HelpCenterAuditEntryDto(
                entry.getId(),
                auditKind(entry),
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
        HelpCenterAuditEntry entry = new HelpCenterAuditEntry();
        entry.setId(new ObjectId().toHexString());
        entry.setRevisionId(revision.getId());
        entry.setDocumentType(kind);
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
            String color = headerColor(revision.getHeaderColor());
            if (!StringUtils.hasText(revision.getDocumentType())) {
                revision.setDocumentType(kind);
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
            if (!StringUtils.hasText(entry.getDocumentType())) {
                entry.setDocumentType(kind);
                auditChanged = true;
            }
        }
        if (auditChanged) {
            auditRepository.saveAll(auditEntries);
        }
    }

    private void dropLegacyVersionIndex() {
        try {
            boolean exists = mongoTemplate.indexOps(HelpCenterRevision.class).getIndexInfo().stream()
                    .map(IndexInfo::getName)
                    .anyMatch(LEGACY_VERSION_INDEX::equals);
            if (exists) {
                mongoTemplate.indexOps(HelpCenterRevision.class).dropIndex(LEGACY_VERSION_INDEX);
            }
        } catch (RuntimeException ignored) {
            // Startup seeding should still work if the index metadata cannot be read in a transient state.
        }
    }

    private List<HelpCenterRevision> revisionsForKind(List<HelpCenterRevision> revisions, String kind) {
        return revisions.stream()
                .filter(revision -> kind.equals(revisionKind(revision)))
                .peek(revision -> revision.setDocumentType(kind))
                .toList();
    }

    private String revisionKind(HelpCenterRevision revision) {
        return documentKind(revision == null ? null : revision.getDocumentType());
    }

    private String auditKind(HelpCenterAuditEntry entry) {
        return documentKind(entry == null ? null : entry.getDocumentType());
    }

    private String documentKind(String documentType) {
        String normalized = normalize(documentType).toLowerCase(Locale.ROOT);
        return DOCUMENT_PRIVACY.equals(normalized) ? DOCUMENT_PRIVACY : DOCUMENT_HELP;
    }

    private String defaultTitle(String kind, Integer version) {
        return DOCUMENT_PRIVACY.equals(kind) ? "Privacy revision v" + version : "Help revision v" + version;
    }

    private String defaultRevisionTitle(String kind) {
        return DOCUMENT_PRIVACY.equals(kind) ? "Data privacy" : "MyScoutee help";
    }

    private String defaultSummary(String kind) {
        return DOCUMENT_PRIVACY.equals(kind) ? "Privacy first" : "What you can do in MyScoutee";
    }

    private String defaultDescription(String kind) {
        return DOCUMENT_PRIVACY.equals(kind) ? DEFAULT_PRIVACY_DESCRIPTION : DEFAULT_HELP_DESCRIPTION;
    }

    private String headerColor(String value) {
        return switch (normalize(value)) {
            case "blue", "green", "rose", "violet", "slate" -> normalize(value);
            default -> "amber";
        };
    }

    private String defaultSectionIcon(String kind) {
        return DOCUMENT_PRIVACY.equals(kind) ? "policy" : "help_outline";
    }

    private String documentLabel(String kind) {
        return DOCUMENT_PRIVACY.equals(kind) ? "Privacy" : "Help";
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
