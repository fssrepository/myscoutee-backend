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
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterAdminActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterAuditEntryDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterRevisionDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterRevisionSaveRequestDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterSectionDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterStateDto;
import com.raxim.myscoutee.profile.repository.HelpCenterAuditRepository;
import com.raxim.myscoutee.profile.repository.HelpCenterRevisionsRepository;

@Service
public class HelpCenterService {
    private static final String DEFAULT_HELP_DESCRIPTION = "MyScoutee helps you plan events end-to-end: invite people, split into stages/groups, assign resources, and coordinate in context chats.";
    private static final Safelist HELP_HTML_SAFELIST = Safelist.relaxed()
            .addTags("section", "article", "h3", "h4")
            .addAttributes(":all", "class")
            .addAttributes("a", "target", "rel")
            .addProtocols("a", "href", "http", "https", "mailto");

    private final ConfigProperties configProperties;
    private final HelpCenterRevisionsRepository revisionsRepository;
    private final HelpCenterAuditRepository auditRepository;

    public HelpCenterService(
            ConfigProperties configProperties,
            HelpCenterRevisionsRepository revisionsRepository,
            HelpCenterAuditRepository auditRepository) {
        this.configProperties = configProperties;
        this.revisionsRepository = revisionsRepository;
        this.auditRepository = auditRepository;
    }

    public HelpCenterStateDto activeState() {
        ensureDefaultRevision();
        HelpCenterRevision active = revisionsRepository.findFirstByActiveTrueOrderByVersionDesc().orElse(null);
        return new HelpCenterStateDto(
                active == null ? null : toRevisionDto(active),
                active == null ? List.of() : List.of(toRevisionDto(active)),
                List.of());
    }

    public HelpCenterStateDto adminState(String adminUserId) {
        ensureAdmin(adminUserId);
        ensureDefaultRevision();
        return fullState();
    }

    public HelpCenterStateDto saveRevision(HelpCenterRevisionSaveRequestDto request) {
        String actorUserId = ensureAdmin(request == null ? null : request.actorUserId());
        List<HelpCenterSection> sections = normalizeSections(request == null ? null : request.sections());
        List<HelpCenterRevision> currentRevisions = revisionsRepository.findAllByOrderByVersionDesc();
        Integer nextVersion = currentRevisions.stream()
                .map(HelpCenterRevision::getVersion)
                .filter(value -> value != null && value > 0)
                .max(Integer::compareTo)
                .orElse(0) + 1;
        String nowIso = Instant.now().toString();
        HelpCenterRevision revision = new HelpCenterRevision();
        revision.setVersion(nextVersion);
        revision.setActive(false);
        revision.setTitle(text(request == null ? null : request.title(), "Help revision v" + nextVersion));
        revision.setSummary(text(request == null ? null : request.summary(), "What you can do in MyScoutee"));
        revision.setDescription(text(request == null ? null : request.description(), DEFAULT_HELP_DESCRIPTION));
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
        return fullState();
    }

    public HelpCenterStateDto activateRevision(String revisionId, HelpCenterAdminActionRequestDto request) {
        String actorUserId = ensureAdmin(request == null ? null : request.actorUserId());
        String normalizedRevisionId = normalize(revisionId);
        HelpCenterRevision target = revisionsRepository.findById(normalizedRevisionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Help revision not found."));
        List<HelpCenterRevision> revisions = revisionsRepository.findAllByOrderByVersionDesc();
        for (HelpCenterRevision revision : revisions) {
            revision.setActive(normalizedRevisionId.equals(revision.getId()));
        }
        revisionsRepository.saveAll(revisions);
        audit("activate", actorUserId, target, "Activated v" + target.getVersion() + ".");
        return fullState();
    }

    public HelpCenterStateDto deleteRevision(String revisionId, HelpCenterAdminActionRequestDto request) {
        String actorUserId = ensureAdmin(request == null ? null : request.actorUserId());
        String normalizedRevisionId = normalize(revisionId);
        HelpCenterRevision target = revisionsRepository.findById(normalizedRevisionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Help revision not found."));
        boolean wasActive = Boolean.TRUE.equals(target.getActive());
        revisionsRepository.delete(target);
        audit("delete", actorUserId, target, "Deleted v" + target.getVersion() + ".");
        if (wasActive) {
            revisionsRepository.findFirstByOrderByVersionDesc().ifPresent(next -> {
                next.setActive(true);
                revisionsRepository.save(next);
            });
        }
        return fullState();
    }

    private HelpCenterStateDto fullState() {
        List<HelpCenterRevision> revisions = revisionsRepository.findAllByOrderByVersionDesc();
        HelpCenterRevision active = revisions.stream()
                .filter(revision -> Boolean.TRUE.equals(revision.getActive()))
                .max(Comparator.comparing(HelpCenterRevision::getVersion, Comparator.nullsLast(Integer::compareTo)))
                .orElse(null);
        List<HelpCenterAuditEntry> auditTrail = auditRepository.findAllByOrderByCreatedDateDesc();
        return new HelpCenterStateDto(
                active == null ? null : toRevisionDto(active),
                revisions.stream().map(this::toRevisionDto).toList(),
                auditTrail.stream().map(this::toAuditDto).toList());
    }

    private void ensureDefaultRevision() {
        if (revisionsRepository.count() > 0 || auditRepository.count() > 0) {
            return;
        }
        String nowIso = Instant.now().toString();
        HelpCenterRevision revision = new HelpCenterRevision();
        revision.setVersion(1);
        revision.setActive(true);
        revision.setTitle("MyScoutee help");
        revision.setSummary("What you can do in MyScoutee");
        revision.setDescription(DEFAULT_HELP_DESCRIPTION);
        revision.setSections(defaultSections());
        revision.setCreatedDate(nowIso);
        revision.setCreatedUser("system");
        revision.setUpdatedDate(nowIso);
        revision.setUpdatedUser("system");
        HelpCenterRevision saved = revisionsRepository.save(revision);
        audit("seed", "system", saved, "Seeded default help revision v1.");
    }

    private List<HelpCenterSection> defaultSections() {
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

    private HelpCenterSection defaultSection(String id, String icon, String title, String blurb, String contentHtml) {
        HelpCenterSection section = new HelpCenterSection();
        section.setId(id);
        section.setIcon(icon);
        section.setTitle(title);
        section.setBlurb(blurb);
        section.setContentHtml(sanitizeHtml(contentHtml));
        return section;
    }

    private List<HelpCenterSection> normalizeSections(List<HelpCenterSectionDto> sections) {
        if (sections == null || sections.isEmpty()) {
            return List.of();
        }
        List<HelpCenterSection> normalized = new ArrayList<>();
        Set<String> ids = new LinkedHashSet<>();
        for (int index = 0; index < sections.size(); index++) {
            HelpCenterSectionDto source = sections.get(index);
            String title = text(source == null ? null : source.title(), "Help section " + (index + 1));
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
            section.setIcon(text(source == null ? null : source.icon(), "help_outline"));
            section.setTitle(title);
            section.setBlurb(normalize(source == null ? null : source.blurb()));
            section.setContentHtml(html);
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
        return new HelpCenterRevisionDto(
                revision.getId(),
                revision.getVersion(),
                text(revision.getTitle(), "Help revision"),
                normalize(revision.getSummary()),
                text(revision.getDescription(), DEFAULT_HELP_DESCRIPTION),
                revision.getSections() == null
                        ? List.of()
                        : revision.getSections().stream().map(this::toSectionDto).toList(),
                Boolean.TRUE.equals(revision.getActive()),
                normalize(revision.getCreatedDate()),
                normalize(revision.getCreatedUser()),
                normalize(revision.getUpdatedDate()),
                normalize(revision.getUpdatedUser()));
    }

    private HelpCenterSectionDto toSectionDto(HelpCenterSection section) {
        return new HelpCenterSectionDto(
                normalize(section.getId()),
                text(section.getIcon(), "help_outline"),
                text(section.getTitle(), "Help section"),
                normalize(section.getBlurb()),
                normalize(section.getContentHtml()));
    }

    private HelpCenterAuditEntryDto toAuditDto(HelpCenterAuditEntry entry) {
        return new HelpCenterAuditEntryDto(
                entry.getId(),
                normalize(entry.getRevisionId()),
                entry.getVersion(),
                normalize(entry.getAction()),
                normalize(entry.getActorUserId()),
                normalize(entry.getCreatedDate()),
                normalize(entry.getMessage()));
    }

    private void audit(String action, String actorUserId, HelpCenterRevision revision, String message) {
        HelpCenterAuditEntry entry = new HelpCenterAuditEntry();
        entry.setId(new ObjectId().toHexString());
        entry.setRevisionId(revision.getId());
        entry.setVersion(revision.getVersion());
        entry.setAction(action);
        entry.setActorUserId(text(actorUserId, "admin"));
        entry.setCreatedDate(Instant.now().toString());
        entry.setMessage(message);
        auditRepository.save(entry);
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
}
