package com.raxim.myscoutee.profile.service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriUtils;

import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.IdeaPost;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostAdminActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostSaveRequestDto;
import com.raxim.myscoutee.profile.repository.IdeaPostsRepository;

@Service
public class IdeaPostsService {
    private static final int EXCERPT_MAX_LENGTH = 180;
    private static final int MAX_IMAGE_URLS = 24;
    private static final Safelist IDEA_HTML_SAFELIST = Safelist.relaxed()
            .addTags("section", "article", "figure", "figcaption", "h2", "h3", "h4")
            .addAttributes(":all", "class")
            .addAttributes("img", "src", "alt", "title")
            .addAttributes("a", "target", "rel")
            .addProtocols("a", "href", "http", "https", "mailto")
            .addProtocols("img", "src", "http", "https", "data")
            .preserveRelativeLinks(true);

    private final ConfigProperties configProperties;
    private final IdeaPostsRepository ideaPostsRepository;
    private final MediaStorageService mediaStorageService;

    public IdeaPostsService(
            ConfigProperties configProperties,
            IdeaPostsRepository ideaPostsRepository,
            MediaStorageService mediaStorageService) {
        this.configProperties = configProperties;
        this.ideaPostsRepository = ideaPostsRepository;
        this.mediaStorageService = mediaStorageService;
    }

    public List<IdeaPostDto> publicPosts() {
        ensureSeeded();
        return ideaPostsRepository.findByPublishedTrueOrderBySubmittedAtIsoDesc().stream()
                .map(this::toDto)
                .toList();
    }

    public List<IdeaPostDto> adminPosts(String adminUserId) {
        ensureAdmin(adminUserId);
        ensureSeeded();
        return ideaPostsRepository.findAllByOrderBySubmittedAtIsoDesc().stream()
                .map(this::toDto)
                .toList();
    }

    public IdeaPostDto savePost(IdeaPostSaveRequestDto request) {
        String actorUserId = ensureAdmin(request == null ? null : request.actorUserId());
        ensureSeeded();
        String normalizedId = normalize(request == null ? null : request.id());
        IdeaPost post = StringUtils.hasText(normalizedId)
                ? ideaPostsRepository.findById(normalizedId).orElseGet(IdeaPost::new)
                : new IdeaPost();
        String nowIso = Instant.now().toString();
        if (!StringUtils.hasText(post.getId()) && StringUtils.hasText(normalizedId)) {
            post.setId(normalizedId);
        }
        if (!StringUtils.hasText(post.getCreatedDate())) {
            post.setCreatedDate(nowIso);
            post.setCreatedUser(actorUserId);
        }

        String html = sanitizeHtml(request == null ? null : request.contentHtml());
        String title = text(request == null ? null : request.title(), "Untitled idea");
        post.setTitle(title);
        post.setContentHtml(html);
        post.setExcerpt(excerpt(request == null ? null : request.excerpt(), html));
        post.setImageUrls(imageUrls(request == null ? null : request.imageUrls(), request == null ? null : request.imageUrl()));
        post.setImageUrl(primaryImageUrl(request == null ? null : request.imageUrl(), post.getImageUrls()));
        post.setFeatured(request != null && Boolean.TRUE.equals(request.featured()));
        post.setPublished(request == null || !Boolean.FALSE.equals(request.published()));
        post.setSubmittedAtIso(submittedAtIso(request == null ? null : request.submittedAtIso(), post.getSubmittedAtIso(), nowIso));
        post.setUpdatedDate(nowIso);
        post.setUpdatedUser(actorUserId);
        return toDto(ideaPostsRepository.save(post));
    }

    public List<IdeaPostDto> deletePost(String postId, IdeaPostAdminActionRequestDto request) {
        ensureAdmin(request == null ? null : request.actorUserId());
        String normalizedPostId = normalize(postId);
        if (StringUtils.hasText(normalizedPostId)) {
            ideaPostsRepository.findById(normalizedPostId).ifPresent(ideaPostsRepository::delete);
        }
        return ideaPostsRepository.findAllByOrderBySubmittedAtIsoDesc().stream()
                .map(this::toDto)
                .toList();
    }

    private void ensureSeeded() {
        if (!ideaPostsRepository.findAll().isEmpty()) {
            return;
        }
        ideaPostsRepository.saveAll(defaultPosts());
    }

    private List<IdeaPost> defaultPosts() {
        return List.of(
                defaultPost(
                        "idea-why-priority-matching",
                        "Why priority matching feels calmer than swiping",
                        "MyScoutee starts with intent, context, and real plans instead of an endless yes/no loop.",
                        """
                        <p><strong>Most dating apps optimize for quick reactions. MyScoutee is built for decisions that can become real plans.</strong></p>
                        <p>Members can express priority instead of only swiping yes or no, so interest has more texture and the next step can be clearer.</p>
                        <p>That makes the product feel less like a slot machine and more like a social planning tool.</p>
                        <ul>
                          <li>Priority scores communicate stronger intent.</li>
                          <li>Context helps people understand why a match makes sense.</li>
                          <li>Events give the connection a natural next step.</li>
                        </ul>
                        """,
                        true,
                        "2026-04-29T10:00:00.000Z"),
                defaultPost(
                        "idea-social-first-dating",
                        "From lonely browsing to social-first meeting",
                        "Groups, hosts, and event context make introductions feel more natural and lower-pressure.",
                        """
                        <p>MyScoutee is useful when someone wants to meet people without making every conversation feel like an interview.</p>
                        <p>A hosted activity creates shared context before the first message, which makes the first interaction easier to start and easier to trust.</p>
                        <figure>
                          <img src="@image_url" alt="People joining a social event">
                          <figcaption>Shared plans give people something real to react to.</figcaption>
                        </figure>
                        """,
                        true,
                        "2026-04-24T12:30:00.000Z"),
                defaultPost(
                        "idea-host-use-case",
                        "Use case: host a small event and let the right people join",
                        "Hosts can describe the plan, capacity, resources, and tone before inviting or approving members.",
                        """
                        <p>A host can create a small plan, split it into optional parts, and keep logistics visible from the start.</p>
                        <p>Instead of managing scattered messages, the event can carry details like time, capacity, resources, members, and chat context.</p>
                        <ul>
                          <li>Great for brunches, walks, games, sport sessions, or low-pressure meetups.</li>
                          <li>Useful when the host wants a specific vibe and group size.</li>
                          <li>Clearer than posting a vague invitation into a generic feed.</li>
                        </ul>
                        """,
                        true,
                        "2026-04-20T09:15:00.000Z"),
                defaultPost(
                        "idea-trust-context",
                        "Trust grows faster when context stays attached",
                        "Profiles, event history, feedback, and scoped chats help people understand who they are meeting.",
                        """
                        <p>Trust is easier when the product keeps context visible. A person is not only a photo; they are also how they join, host, communicate, and follow through.</p>
                        <p>MyScoutee can connect profile signals, event participation, feedback, and scoped chats so users do not have to guess from one empty message thread.</p>
                        """,
                        true,
                        "2026-04-16T16:45:00.000Z"),
                defaultPost(
                        "idea-register-value",
                        "What viewers unlock when they register",
                        "Registration turns a static landing page into matching, event discovery, hosting, chat, and feedback.",
                        """
                        <p>Visitors can understand the idea from the landing page, but the value starts once they register and build a profile.</p>
                        <p>From there, MyScoutee can show relevant people, support event invitations, coordinate in chats, and learn from feedback after real social activity.</p>
                        <ul>
                          <li>Discover people through priorities and activities.</li>
                          <li>Join or host plans with clearer expectations.</li>
                          <li>Use feedback to make the next match or event better.</li>
                        </ul>
                        """,
                        false,
                        "2026-04-11T13:20:00.000Z"));
    }

    private IdeaPost defaultPost(
            String id,
            String title,
            String excerpt,
            String contentHtml,
            boolean featured,
            String submittedAtIso) {
        IdeaPost post = new IdeaPost();
        String nowIso = Instant.now().toString();
        String imageUrl = seedImageUrl(id);
        post.setId(id);
        post.setTitle(title);
        post.setExcerpt(excerpt);
        post.setContentHtml(sanitizeHtml(contentHtml.replace("@image_url", imageUrl)));
        post.setImageUrl(imageUrl);
        post.setImageUrls(List.of(imageUrl));
        post.setFeatured(featured);
        post.setPublished(true);
        post.setSubmittedAtIso(submittedAtIso);
        post.setCreatedDate(nowIso);
        post.setCreatedUser("system");
        post.setUpdatedDate(nowIso);
        post.setUpdatedUser("system");
        return post;
    }

    private String seedImageUrl(String postId) {
        String svg = seedImageSvg(postId);
        String storedUrl = mediaStorageService.storeImageBytes(
                "idea",
                "system",
                postId,
                postId + ".svg",
                "image/svg+xml",
                svg.getBytes(StandardCharsets.UTF_8));
        if (StringUtils.hasText(storedUrl)) {
            return storedUrl;
        }
        return "data:image/svg+xml;charset=UTF-8," + UriUtils.encode(svg, StandardCharsets.UTF_8);
    }

    private String seedImageSvg(String postId) {
        int tone = Math.abs(postId.hashCode()) % 5;
        String[][] palettes = {
                { "#eff6ff", "#6e8fc1", "#f1b66d", "#173456" },
                { "#f4fbf5", "#6aa98a", "#d9a652", "#1f3d34" },
                { "#fff7f0", "#c98256", "#7aa4c7", "#263b56" },
                { "#f7f2ff", "#8d78b8", "#e7b36d", "#21314c" },
                { "#f3f7f8", "#658aa3", "#d3a871", "#1d3442" }
        };
        String[] palette = palettes[tone];
        return """
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" role="img">
                  <defs>
                    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stop-color="%s"/>
                      <stop offset="0.56" stop-color="#ffffff"/>
                      <stop offset="1" stop-color="%s"/>
                    </linearGradient>
                    <filter id="soft" x="-20%%" y="-20%%" width="140%%" height="140%%">
                      <feGaussianBlur stdDeviation="24"/>
                    </filter>
                  </defs>
                  <rect width="1200" height="700" fill="url(#sky)"/>
                  <g filter="url(#soft)" opacity="0.78">
                    <circle cx="240" cy="170" r="132" fill="%s"/>
                    <circle cx="930" cy="190" r="150" fill="%s"/>
                    <rect x="615" y="310" width="380" height="210" rx="34" fill="%s" opacity="0.45"/>
                  </g>
                  <rect x="0" y="475" width="1200" height="225" fill="#ffffff" opacity="0.62"/>
                  <rect x="105" y="150" width="390" height="285" rx="28" fill="#ffffff" opacity="0.74"/>
                  <rect x="145" y="192" width="310" height="22" rx="11" fill="%s" opacity="0.22"/>
                  <rect x="145" y="238" width="260" height="18" rx="9" fill="%s" opacity="0.18"/>
                  <rect x="145" y="284" width="185" height="18" rx="9" fill="%s" opacity="0.16"/>
                  <circle cx="792" cy="285" r="54" fill="%s" opacity="0.7"/>
                  <circle cx="910" cy="312" r="48" fill="%s" opacity="0.52"/>
                  <circle cx="690" cy="322" r="42" fill="%s" opacity="0.48"/>
                  <path d="M640 520c46-85 230-94 320 0" fill="%s" opacity="0.22"/>
                  <path d="M112 550c145-42 295-44 454-2 162 43 332 42 520-6" fill="none" stroke="%s" stroke-width="18" opacity="0.18"/>
                  <rect x="0" y="0" width="1200" height="700" fill="#0a1726" opacity="0.02"/>
                </svg>
                """.formatted(
                palette[0],
                palette[1],
                palette[2],
                palette[1],
                palette[2],
                palette[3],
                palette[3],
                palette[3],
                palette[1],
                palette[2],
                palette[3],
                palette[3],
                palette[3]);
    }

    private IdeaPostDto toDto(IdeaPost post) {
        return new IdeaPostDto(
                normalize(post.getId()),
                text(post.getTitle(), "Untitled idea"),
                normalize(post.getExcerpt()),
                normalize(post.getContentHtml()),
                normalize(post.getImageUrl()),
                post.getImageUrls() == null
                        ? List.of()
                        : post.getImageUrls().stream()
                                .map(this::normalize)
                                .filter(StringUtils::hasText)
                                .distinct()
                                .toList(),
                Boolean.TRUE.equals(post.getFeatured()),
                !Boolean.FALSE.equals(post.getPublished()),
                normalize(post.getSubmittedAtIso()),
                normalize(post.getCreatedDate()),
                normalize(post.getCreatedUser()),
                normalize(post.getUpdatedDate()),
                normalize(post.getUpdatedUser()));
    }

    private String sanitizeHtml(String html) {
        String normalized = normalize(html);
        if (!StringUtils.hasText(normalized)) {
            return "";
        }
        return Jsoup.clean(normalized, IDEA_HTML_SAFELIST);
    }

    private String excerpt(String explicitExcerpt, String contentHtml) {
        String normalizedExcerpt = normalize(explicitExcerpt);
        if (StringUtils.hasText(normalizedExcerpt)) {
            return trimToLength(normalizedExcerpt, EXCERPT_MAX_LENGTH);
        }
        return trimToLength(Jsoup.parse(normalize(contentHtml)).text(), EXCERPT_MAX_LENGTH);
    }

    private String trimToLength(String value, int maxLength) {
        String normalized = normalize(value).replaceAll("\\s+", " ");
        if (normalized.length() <= maxLength) {
            return normalized;
        }
        return normalized.substring(0, Math.max(0, maxLength - 1)).trim() + "…";
    }

    private List<String> imageUrls(List<String> imageUrls, String primaryImageUrl) {
        Set<String> urls = new LinkedHashSet<>();
        String normalizedPrimary = normalize(primaryImageUrl);
        if (StringUtils.hasText(normalizedPrimary)) {
            urls.add(normalizedPrimary);
        }
        if (imageUrls != null) {
            for (String imageUrl : imageUrls) {
                String normalized = normalize(imageUrl);
                if (StringUtils.hasText(normalized)) {
                    urls.add(normalized);
                }
                if (urls.size() >= MAX_IMAGE_URLS) {
                    break;
                }
            }
        }
        return new ArrayList<>(urls);
    }

    private String primaryImageUrl(String imageUrl, List<String> imageUrls) {
        String normalizedImageUrl = normalize(imageUrl);
        if (StringUtils.hasText(normalizedImageUrl)) {
            return normalizedImageUrl;
        }
        return imageUrls == null || imageUrls.isEmpty() ? "" : imageUrls.get(0);
    }

    private String submittedAtIso(String requested, String existing, String fallback) {
        String normalized = normalize(requested);
        if (StringUtils.hasText(normalized)) {
            try {
                return Instant.parse(normalized).toString();
            } catch (RuntimeException ignored) {
                return normalized;
            }
        }
        return text(existing, fallback);
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

    private String text(String value, String fallback) {
        String normalized = normalize(value);
        return StringUtils.hasText(normalized) ? normalized : fallback;
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}
