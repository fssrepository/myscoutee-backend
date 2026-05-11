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
    private static final String DEFAULT_LANG = "en";
    private static final String LEGACY_VERSION_INDEX = "help_revision_version";
    private static final String DEFAULT_SEED_RESOURCE_PREFIX = "classpath:mongo-seed/profile/helpCenter";
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
        String kind = documentKind(documentType);
        String language = requestContentLang(lang, acceptLanguage);
        ensureDefaultRevision(kind, language);
        HelpCenterRevision active = revisionsRepository.findFirstByDocumentTypeAndLangAndActiveTrueOrderByVersionDesc(kind, language)
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
        String kind = documentKind(documentType);
        String language = contentLang(lang);
        ensureAdmin(adminUserId);
        ensureDefaultRevision(kind, language);
        return fullState(kind, language);
    }

    public HelpCenterStateDto saveRevision(HelpCenterRevisionSaveRequestDto request) {
        return saveRevision(request, DOCUMENT_HELP);
    }

    public HelpCenterStateDto saveRevision(HelpCenterRevisionSaveRequestDto request, String documentType) {
        String kind = documentKind(documentType);
        String language = contentLang(request == null ? null : request.lang());
        String actorUserId = ensureAdmin(request == null ? null : request.actorUserId());
        ensureDefaultRevision(kind, language);
        List<HelpCenterSection> sections = normalizeSections(request == null ? null : request.sections(), kind);
        List<HelpCenterRevision> currentRevisions = revisionsForKind(revisionsRepository.findAllByOrderByVersionDesc(), kind, language);
        Integer nextVersion = currentRevisions.stream()
                .map(HelpCenterRevision::getVersion)
                .filter(value -> value != null && value > 0)
                .max(Integer::compareTo)
                .orElse(0) + 1;
        String nowIso = Instant.now().toString();
        HelpCenterRevision revision = new HelpCenterRevision();
        revision.setDocumentType(kind);
        revision.setLang(language);
        revision.setLanguageLabel(languageLabel(language));
        revision.setVersion(nextVersion);
        revision.setActive(false);
        revision.setTitle(text(request == null ? null : request.title(), defaultTitle(kind, nextVersion, language)));
        revision.setSummary(text(request == null ? null : request.summary(), defaultSummary(kind, language)));
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
        List<HelpCenterRevision> revisions = revisionsRepository.findAllByOrderByVersionDesc();
        for (HelpCenterRevision revision : revisions) {
            String revisionKind = revisionKind(revision);
            String revisionLang = revisionLang(revision);
            revision.setDocumentType(revisionKind);
            revision.setLang(revisionLang);
            revision.setLanguageLabel(languageLabel(revisionLang));
            if (kind.equals(revisionKind) && language.equals(revisionLang)) {
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
        boolean wasActive = Boolean.TRUE.equals(target.getActive());
        revisionsRepository.delete(target);
        audit("delete", actorUserId, target, "Deleted v" + target.getVersion() + ".");
        adminTelemetryService.record("content.revision.deleted", "content", target.getId(), actorUserId);
        if (wasActive) {
            revisionsForKind(revisionsRepository.findAllByOrderByVersionDesc(), kind, language).stream().findFirst().ifPresent(next -> {
                next.setActive(true);
                next.setDocumentType(kind);
                next.setLang(language);
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
        String language = contentLang(lang);
        List<HelpCenterRevision> revisions = revisionsForKind(revisionsRepository.findAllByOrderByVersionDesc(), kind, language);
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
        dropLegacyVersionIndex();
        backfillDocumentTypes();
        for (ContentLanguageDto contentLanguage : contentLanguages()) {
            String language = contentLang(contentLanguage.lang());
            if (!revisionsForKind(revisionsRepository.findAllByOrderByVersionDesc(), kind, language).isEmpty()) {
                continue;
            }
            String nowIso = Instant.now().toString();
            HelpCenterRevision revision = seedRevision(kind, language);
            revision.setDocumentType(kind);
            revision.setLang(language);
            revision.setLanguageLabel(languageLabel(language));
            revision.setVersion(revision.getVersion() == null || revision.getVersion() <= 0 ? 1 : revision.getVersion());
            revision.setActive(true);
            revision.setTitle(text(revision.getTitle(), defaultRevisionTitle(kind, language)));
            revision.setSummary(text(revision.getSummary(), defaultSummary(kind, language)));
            revision.setDescription(text(revision.getDescription(), defaultDescription(kind, language)));
            revision.setHeaderColor(headerColor(revision.getHeaderColor()));
            revision.setSections(revision.getSections() == null || revision.getSections().isEmpty()
                    ? defaultSections(kind, language)
                    : normalizeSections(revision.getSections().stream().map(this::toSectionDtoForSeed).toList(), kind));
            revision.setCreatedDate(nowIso);
            revision.setCreatedUser("system");
            revision.setUpdatedDate(nowIso);
            revision.setUpdatedUser("system");
            HelpCenterRevision saved = revisionsRepository.save(revision);
            audit("seed", "system", saved, "Seeded default " + documentLabel(kind).toLowerCase(Locale.ROOT) + " revision v1.");
        }
    }

    private List<HelpCenterSection> defaultSections(String kind, String lang) {
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
        section.setOptional(false);
        return section;
    }

    private HelpCenterRevision seedRevision(String kind, String lang) {
        String language = contentLang(lang);
        Resource resource = resourceLoader.getResource(seedResourcePath(kind, language));
        if (resource.exists()) {
            try (InputStream inputStream = resource.getInputStream()) {
                return objectMapper.readValue(inputStream, HelpCenterRevision.class);
            } catch (IOException ignored) {
                // Fall back to the built-in seed if the JSON resource is unavailable or malformed.
            }
        }
        HelpCenterRevision revision = new HelpCenterRevision();
        revision.setDocumentType(kind);
        revision.setLang(language);
        revision.setLanguageLabel(languageLabel(language));
        revision.setVersion(1);
        revision.setTitle(defaultRevisionTitle(kind, language));
        revision.setSummary(defaultSummary(kind, language));
        revision.setDescription(defaultDescription(kind, language));
        revision.setHeaderColor("amber");
        revision.setSections(defaultSections(kind, language));
        return revision;
    }

    private String seedResourcePath(String kind, String lang) {
        String documentName = DOCUMENT_PRIVACY.equals(kind) ? "Privacy" : "Help";
        return DEFAULT_SEED_RESOURCE_PREFIX + documentName + "Default." + contentLang(lang) + ".json";
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
        String language = revisionLang(revision);
        return new HelpCenterRevisionDto(
                revision.getId(),
                kind,
                language,
                languageLabel(language),
                revision.getVersion(),
                text(revision.getTitle(), defaultRevisionTitle(kind, language)),
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
                DOCUMENT_PRIVACY.equals(kind) && Boolean.TRUE.equals(section.getOptional()));
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
            for (String indexName : List.of(LEGACY_VERSION_INDEX, "help_revision_document_version", "help_revision_document_active")) {
                if (indexNames.contains(indexName)) {
                    mongoTemplate.indexOps(HelpCenterRevision.class).dropIndex(indexName);
                }
            }
        } catch (RuntimeException ignored) {
            // Startup seeding should still work if the index metadata cannot be read in a transient state.
        }
    }

    private List<HelpCenterRevision> revisionsForKind(List<HelpCenterRevision> revisions, String kind, String lang) {
        String language = contentLang(lang);
        return revisions.stream()
                .filter(revision -> kind.equals(revisionKind(revision)))
                .filter(revision -> language.equals(revisionLang(revision)))
                .peek(revision -> revision.setDocumentType(kind))
                .peek(revision -> {
                    revision.setLang(language);
                    revision.setLanguageLabel(languageLabel(language));
                })
                .toList();
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
        return DOCUMENT_PRIVACY.equals(normalized) ? DOCUMENT_PRIVACY : DOCUMENT_HELP;
    }

    private String defaultTitle(String kind, Integer version, String lang) {
        if ("hu".equals(contentLang(lang))) {
            return DOCUMENT_PRIVACY.equals(kind) ? "Adatvédelmi verzió v" + version : "Súgó verzió v" + version;
        }
        return DOCUMENT_PRIVACY.equals(kind) ? "Privacy revision v" + version : "Help revision v" + version;
    }

    private String defaultRevisionTitle(String kind, String lang) {
        if ("hu".equals(contentLang(lang))) {
            return DOCUMENT_PRIVACY.equals(kind) ? "Adatvédelem" : "MyScoutee súgó";
        }
        return DOCUMENT_PRIVACY.equals(kind) ? "Data privacy" : "MyScoutee help";
    }

    private String defaultSummary(String kind, String lang) {
        if ("hu".equals(contentLang(lang))) {
            return DOCUMENT_PRIVACY.equals(kind) ? "Adatvédelem elsőként" : "Mit tehetsz a MyScoutee-ban";
        }
        return DOCUMENT_PRIVACY.equals(kind) ? "Privacy first" : "What you can do in MyScoutee";
    }

    private String defaultDescription(String kind, String lang) {
        if ("hu".equals(contentLang(lang))) {
            return DOCUMENT_PRIVACY.equals(kind)
                    ? "Folytatás előtt nézd át és fogadd el, hogyan használja a MyScoutee az adataidat."
                    : "A MyScoutee segít az eseményeket elejétől végéig megtervezni: meghívások, szakaszok és csoportok, erőforrások, valamint kontextushoz kötött csevegések.";
        }
        return DOCUMENT_PRIVACY.equals(kind) ? DEFAULT_PRIVACY_DESCRIPTION : DEFAULT_HELP_DESCRIPTION;
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
