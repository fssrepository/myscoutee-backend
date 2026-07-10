package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
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
import com.raxim.myscoutee.profile.data.document.IdeaPost;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostAdminActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostAdminCountsDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostAdminPageDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostSaveRequestDto;
import com.raxim.myscoutee.profile.repository.IdeaPostsRepository;

@Service
public class IdeaPostsService {
    private static final String DEFAULT_LANG = "en";
    private static final int EXCERPT_MAX_LENGTH = 180;
    private static final int MAX_IMAGE_URLS = 24;
    private static final int DEFAULT_ADMIN_PAGE_SIZE = 10;
    private static final int MAX_ADMIN_PAGE_SIZE = 50;
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
    private final MongoTemplate mongoTemplate;
    private final AdminTelemetryService adminTelemetryService;
    private final AppSettingsService appSettingsService;

    public IdeaPostsService(
            ConfigProperties configProperties,
            IdeaPostsRepository ideaPostsRepository,
            MongoTemplate mongoTemplate,
            AdminTelemetryService adminTelemetryService,
            AppSettingsService appSettingsService) {
        this.configProperties = configProperties;
        this.ideaPostsRepository = ideaPostsRepository;
        this.mongoTemplate = mongoTemplate;
        this.adminTelemetryService = adminTelemetryService;
        this.appSettingsService = appSettingsService;
    }

    public List<IdeaPostDto> publicPosts() {
        return publicPosts(DEFAULT_LANG);
    }

    public List<IdeaPostDto> publicPosts(String lang) {
        return publicPosts(lang, DEFAULT_LANG);
    }

    public List<IdeaPostDto> publicPosts(String lang, String acceptLanguage) {
        String language = requestContentLang(lang, acceptLanguage);
        List<IdeaPost> posts = ideaPostsRepository.findByPublishedTrueAndLangOrderBySubmittedAtIsoDesc(language);
        if (posts.isEmpty() && !DEFAULT_LANG.equals(language)) {
            posts = ideaPostsRepository.findByPublishedTrueAndLangOrderBySubmittedAtIsoDesc(DEFAULT_LANG);
        }
        return posts.stream()
                .filter(post -> !Boolean.TRUE.equals(post.getTrashed()))
                .map(this::toDto)
                .toList();
    }

    public List<IdeaPostDto> adminPosts(String adminUserId) {
        return adminPosts(adminUserId, DEFAULT_LANG);
    }

    public List<IdeaPostDto> adminPosts(String adminUserId, String lang) {
        ensureAdmin(adminUserId);
        return ideaPostsRepository.findAllByLangOrderBySubmittedAtIsoDesc(contentLang(lang)).stream()
                .map(this::toDto)
                .toList();
    }

    public IdeaPostAdminPageDto adminPostsPage(
            String adminUserId,
            String lang,
            String status,
            Integer page,
            Integer pageSize,
            String cursor) {
        ensureAdmin(adminUserId);
        String language = contentLang(lang);
        String normalizedStatus = adminStatus(status);
        int limit = normalizePageSize(pageSize);
        long offset = resolvePageOffset(page, limit, cursor);
        Criteria pageCriteria = adminPostsCriteria(language, normalizedStatus);
        long total = mongoTemplate.count(Query.query(pageCriteria), IdeaPost.class);
        List<IdeaPostDto> records = mongoTemplate.find(
                Query.query(pageCriteria)
                        .with(Sort.by(
                                Sort.Order.desc("submittedAtIso"),
                                Sort.Order.desc("_id")))
                        .skip(Math.min(offset, total))
                        .limit(limit),
                IdeaPost.class).stream()
                .map(this::toDto)
                .toList();
        long nextOffset = Math.min(offset, total) + records.size();
        return new IdeaPostAdminPageDto(
                records,
                toSafeInt(total),
                nextOffset < total ? String.valueOf(nextOffset) : null,
                adminPostCounts(language));
    }

    public IdeaPostDto savePost(IdeaPostSaveRequestDto request) {
        String actorUserId = ensureAdmin(request == null ? null : request.actorUserId());
        String normalizedId = normalize(request == null ? null : request.id());
        String language = contentLang(request == null ? null : request.lang());
        String requestedContentKey = normalize(request == null ? null : request.contentKey());
        IdeaPost post = StringUtils.hasText(normalizedId)
                ? ideaPostsRepository.findById(normalizedId).orElseGet(IdeaPost::new)
                : StringUtils.hasText(requestedContentKey)
                        ? ideaPostsRepository.findByContentKeyAndLang(requestedContentKey, language).orElseGet(IdeaPost::new)
                        : new IdeaPost();
        String nowIso = Instant.now().toString();
        if (!StringUtils.hasText(post.getId()) && StringUtils.hasText(normalizedId)) {
            post.setId(normalizedId);
        }
        String contentKey = text(requestedContentKey, contentKeyFromId(StringUtils.hasText(normalizedId) ? normalizedId : post.getId()));
        if (!StringUtils.hasText(contentKey)) {
            contentKey = "idea-" + Instant.now().toEpochMilli();
        }
        if (!StringUtils.hasText(post.getCreatedDate())) {
            post.setCreatedDate(nowIso);
            post.setCreatedUser(actorUserId);
        }

        String html = sanitizeHtml(request == null ? null : request.contentHtml());
        String title = text(request == null ? null : request.title(), "Untitled idea");
        post.setContentKey(contentKey);
        post.setLang(language);
        post.setLanguageLabel(languageLabel(language));
        post.setTitle(title);
        post.setContentHtml(html);
        post.setExcerpt(excerpt(request == null ? null : request.excerpt(), html));
        post.setImageUrls(imageUrls(request == null ? null : request.imageUrls(), request == null ? null : request.imageUrl()));
        post.setImageUrl(primaryImageUrl(request == null ? null : request.imageUrl(), post.getImageUrls()));
        post.setFeatured(request != null && Boolean.TRUE.equals(request.featured()));
        post.setPublished(request == null || !Boolean.FALSE.equals(request.published()));
        post.setTrashed(false);
        post.setTrashedAtIso(null);
        post.setTrashedByUserId(null);
        post.setSubmittedAtIso(submittedAtIso(request == null ? null : request.submittedAtIso(), post.getSubmittedAtIso(), nowIso));
        post.setUpdatedDate(nowIso);
        post.setUpdatedUser(actorUserId);
        IdeaPost saved = ideaPostsRepository.save(post);
        adminTelemetryService.record("article.saved", "content", saved.getId(), actorUserId);
        return toDto(saved);
    }

    public List<IdeaPostDto> deletePost(String postId, IdeaPostAdminActionRequestDto request) {
        String actorUserId = ensureAdmin(request == null ? null : request.actorUserId());
        String normalizedPostId = normalize(postId);
        if (StringUtils.hasText(normalizedPostId)) {
            ideaPostsRepository.findById(normalizedPostId).ifPresent(post -> {
                String nowIso = Instant.now().toString();
                post.setFeatured(false);
                post.setPublished(false);
                post.setTrashed(true);
                post.setTrashedAtIso(nowIso);
                post.setTrashedByUserId(actorUserId);
                post.setUpdatedDate(nowIso);
                post.setUpdatedUser(actorUserId);
                ideaPostsRepository.save(post);
                adminTelemetryService.record("article.deleted", "content", post.getId(), actorUserId);
            });
        }
        return ideaPostsRepository.findAllByOrderBySubmittedAtIsoDesc().stream()
                .map(this::toDto)
                .toList();
    }

    public IdeaPostDto restorePost(String postId, IdeaPostAdminActionRequestDto request) {
        String actorUserId = ensureAdmin(request == null ? null : request.actorUserId());
        String normalizedPostId = normalize(postId);
        IdeaPost post = StringUtils.hasText(normalizedPostId)
                ? ideaPostsRepository.findById(normalizedPostId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found."))
                : null;
        if (post == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Article id is required.");
        }
        String nowIso = Instant.now().toString();
        post.setFeatured(false);
        post.setPublished(false);
        post.setTrashed(false);
        post.setTrashedAtIso(null);
        post.setTrashedByUserId(null);
        post.setUpdatedDate(nowIso);
        post.setUpdatedUser(actorUserId);
        IdeaPost saved = ideaPostsRepository.save(post);
        adminTelemetryService.record("article.restored", "content", saved.getId(), actorUserId);
        return toDto(saved);
    }

    private IdeaPostDto toDto(IdeaPost post) {
        return new IdeaPostDto(
                normalize(post.getId()),
                text(post.getContentKey(), contentKeyFromId(post.getId())),
                contentLang(post.getLang()),
                languageLabel(post.getLang()),
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
                Boolean.TRUE.equals(post.getTrashed()),
                normalize(post.getTrashedAtIso()),
                normalize(post.getTrashedByUserId()),
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

    private IdeaPostAdminCountsDto adminPostCounts(String lang) {
        return new IdeaPostAdminCountsDto(
                countAdminPosts(lang, "all"),
                countAdminPosts(lang, "featured"),
                countAdminPosts(lang, "published"),
                countAdminPosts(lang, "drafts"),
                countAdminPosts(lang, "trashed"));
    }

    private int countAdminPosts(String lang, String status) {
        return toSafeInt(mongoTemplate.count(Query.query(adminPostsCriteria(lang, status)), IdeaPost.class));
    }

    private Criteria adminPostsCriteria(String lang, String status) {
        List<Criteria> criteria = new ArrayList<>();
        criteria.add(Criteria.where("lang").is(contentLang(lang)));
        switch (adminStatus(status)) {
            case "featured" -> {
                criteria.add(Criteria.where("trashed").ne(true));
                criteria.add(Criteria.where("featured").is(true));
            }
            case "published" -> {
                criteria.add(Criteria.where("trashed").ne(true));
                criteria.add(Criteria.where("published").ne(false));
            }
            case "drafts" -> {
                criteria.add(Criteria.where("trashed").ne(true));
                criteria.add(Criteria.where("published").is(false));
            }
            case "trashed" -> criteria.add(Criteria.where("trashed").is(true));
            default -> criteria.add(Criteria.where("trashed").ne(true));
        }
        return new Criteria().andOperator(criteria.toArray(Criteria[]::new));
    }

    private String adminStatus(String value) {
        return switch (normalize(value).toLowerCase()) {
            case "featured", "published", "drafts", "trashed" -> normalize(value).toLowerCase();
            case "draft" -> "drafts";
            case "trash" -> "trashed";
            default -> "all";
        };
    }

    private int normalizePageSize(Integer pageSize) {
        int requested = pageSize == null ? DEFAULT_ADMIN_PAGE_SIZE : pageSize;
        return Math.max(1, Math.min(MAX_ADMIN_PAGE_SIZE, requested));
    }

    private long resolvePageOffset(Integer page, int pageSize, String cursor) {
        String normalizedCursor = normalize(cursor);
        if (StringUtils.hasText(normalizedCursor)) {
            try {
                return Math.max(0L, Long.parseLong(normalizedCursor));
            } catch (NumberFormatException ignored) {
                return 0L;
            }
        }
        return Math.max(0L, page == null ? 0L : page.longValue()) * Math.max(1L, pageSize);
    }

    private int toSafeInt(long value) {
        if (value <= 0L) {
            return 0;
        }
        return value > Integer.MAX_VALUE ? Integer.MAX_VALUE : (int) value;
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

    private String text(String value, String fallback) {
        String normalized = normalize(value);
        return StringUtils.hasText(normalized) ? normalized : fallback;
    }

    private String contentLang(String value) {
        return text(supportedContentLang(value), DEFAULT_LANG);
    }

    private String supportedContentLang(String value) {
        String normalized = normalize(value).toLowerCase();
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

    private String contentKeyFromId(String id) {
        String normalized = normalize(id);
        if (!StringUtils.hasText(normalized)) {
            return "";
        }
        return normalized.endsWith("-hu")
                ? normalized.substring(0, normalized.length() - 3)
                : normalized;
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}
