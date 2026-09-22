package com.raxim.myscoutee.profile.service;
import java.util.Map;
import com.raxim.myscoutee.profile.data.dto.media.MediaDtos.ImageDetailsDto;
import static com.raxim.myscoutee.profile.data.dto.media.MediaDtos.normalizeImageDetails;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
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

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.IdeaPost;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostAdminActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostAdminCountsDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostAdminPageDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostPublicPageDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostSaveRequestDto;
import com.raxim.myscoutee.profile.repository.IdeaPostsRepository;
import com.raxim.myscoutee.profile.repository.LandingArticlesRepository;
import com.raxim.myscoutee.profile.repository.LandingArticlesRepository.LandingArticleCursor;
import com.raxim.myscoutee.profile.repository.LandingArticlesRepository.LandingArticleSlice;
import com.raxim.myscoutee.profile.service.mapper.IdeaPostMapper;

@Service
public class IdeaPostsService {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final String DEFAULT_LANG = "en";
    private static final int EXCERPT_MAX_LENGTH = 180;
    private static final int MAX_IMAGE_URLS = 24;
    private static final int DEFAULT_ADMIN_PAGE_SIZE = 10;
    private static final int MAX_ADMIN_PAGE_SIZE = 50;
    private static final int DEFAULT_PUBLIC_PAGE_SIZE = 10;
    private static final int MAX_PUBLIC_PAGE_SIZE = 50;
    private static final int LANDING_FEATURED_PREVIEW_SIZE = 8;
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
    private final LandingArticlesRepository landingArticlesRepository;
    private final IdeaPostMapper ideaPostMapper;
    private final MediaStorageService mediaStorageService;

    public IdeaPostsService(
            ConfigProperties configProperties,
            IdeaPostsRepository ideaPostsRepository,
            MongoTemplate mongoTemplate,
            AdminTelemetryService adminTelemetryService,
            AppSettingsService appSettingsService,
            LandingArticlesRepository landingArticlesRepository,
            IdeaPostMapper ideaPostMapper,
            MediaStorageService mediaStorageService) {
        this.configProperties = configProperties;
        this.ideaPostsRepository = ideaPostsRepository;
        this.mongoTemplate = mongoTemplate;
        this.adminTelemetryService = adminTelemetryService;
        this.appSettingsService = appSettingsService;
        this.landingArticlesRepository = landingArticlesRepository;
        this.ideaPostMapper = ideaPostMapper;
        this.mediaStorageService = mediaStorageService;
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
                .map(ideaPostMapper::toDto)
                .toList();
    }

    public IdeaPostPublicPageDto publicPostsPage(
            String lang,
            String acceptLanguage,
            Integer page,
            Integer pageSize,
            String cursor) {
        String requestedLanguage = requestContentLang(lang, acceptLanguage);
        int normalizedPage = Math.max(0, page == null ? 0 : page);
        int normalizedPageSize = normalizePublicPageSize(pageSize);
        LandingArticleCursor decodedCursor = decodePublicCursor(cursor);
        String effectiveLanguage = decodedCursor == null
                ? requestedLanguage
                : cursorLanguage(requestedLanguage, decodedCursor.lang());
        LandingArticleSlice slice = landingArticlesRepository.findPage(
                effectiveLanguage,
                normalizedPage,
                normalizedPageSize,
                decodedCursor);
        if (decodedCursor == null && slice.total() == 0L && !DEFAULT_LANG.equals(effectiveLanguage)) {
            effectiveLanguage = DEFAULT_LANG;
            slice = landingArticlesRepository.findPage(
                    effectiveLanguage,
                    normalizedPage,
                    normalizedPageSize,
                    null);
        }
        List<IdeaPostDto> records = slice.records().stream()
                .map(ideaPostMapper::toDto)
                .toList();
        String nextCursor = slice.hasNext() && !slice.records().isEmpty()
                ? encodePublicCursor(effectiveLanguage, slice.records().get(slice.records().size() - 1))
                : null;
        return new IdeaPostPublicPageDto(records, toSafeInt(slice.total()), nextCursor);
    }

    public IdeaPostPublicPageDto publicFeaturedPosts(String lang, String acceptLanguage) {
        String effectiveLanguage = requestContentLang(lang, acceptLanguage);
        LandingArticleSlice preview = landingArticlesRepository.findFeaturedPreview(
                effectiveLanguage,
                LANDING_FEATURED_PREVIEW_SIZE);
        if (preview.total() == 0L && !DEFAULT_LANG.equals(effectiveLanguage)) {
            effectiveLanguage = DEFAULT_LANG;
            preview = landingArticlesRepository.findFeaturedPreview(
                    effectiveLanguage,
                    LANDING_FEATURED_PREVIEW_SIZE);
        }
        return new IdeaPostPublicPageDto(
                preview.records().stream().map(ideaPostMapper::toDto).toList(),
                toSafeInt(preview.total()),
                null);
    }

    public List<IdeaPostDto> adminPosts(String adminUserId) {
        return adminPosts(adminUserId, DEFAULT_LANG);
    }

    public List<IdeaPostDto> adminPosts(String adminUserId, String lang) {
        ensureAdmin(adminUserId);
        return ideaPostsRepository.findAllByLangOrderBySubmittedAtIsoDesc(contentLang(lang)).stream()
                .map(ideaPostMapper::toDto)
                .toList();
    }

    public IdeaPostAdminPageDto adminPostsPage(
            String adminUserId,
            String lang,
            String status,
            Integer pageSize,
            String cursor) {
        ensureAdmin(adminUserId);
        String language = contentLang(lang);
        String normalizedStatus = adminStatus(status);
        int limit = normalizePageSize(pageSize);
        AdminIdeaPostCursor decodedCursor = parseAdminCursor(cursor, language, normalizedStatus);
        Criteria filterCriteria = adminPostsCriteria(language, normalizedStatus);
        long total = mongoTemplate.count(Query.query(filterCriteria), IdeaPost.class);
        Criteria pageCriteria = decodedCursor == null
                ? filterCriteria
                : new Criteria().andOperator(
                        filterCriteria,
                        new Criteria().orOperator(
                                Criteria.where("submittedAtIso").lt(decodedCursor.submittedAtIso()),
                                new Criteria().andOperator(
                                        Criteria.where("submittedAtIso").is(decodedCursor.submittedAtIso()),
                                        Criteria.where("_id").lt(decodedCursor.id()))));
        List<IdeaPost> matches = mongoTemplate.find(
                Query.query(pageCriteria)
                        .with(Sort.by(
                                Sort.Order.desc("submittedAtIso"),
                                Sort.Order.desc("_id")))
                        .limit(limit + 1),
                IdeaPost.class);
        boolean hasNext = matches.size() > limit;
        List<IdeaPost> pageRecords = hasNext
                ? List.copyOf(matches.subList(0, limit))
                : List.copyOf(matches);
        List<IdeaPostDto> records = pageRecords.stream()
                .map(ideaPostMapper::toDto)
                .toList();
        String nextCursor = hasNext && !pageRecords.isEmpty()
                ? serializeAdminCursor(language, normalizedStatus, pageRecords.get(pageRecords.size() - 1))
                : null;
        return new IdeaPostAdminPageDto(
                records,
                toSafeInt(total),
                nextCursor,
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
        String contentKey = text(
                requestedContentKey,
                text(post.getContentKey(), contentKeyFromId(StringUtils.hasText(normalizedId) ? normalizedId : post.getId())));
        if (!StringUtils.hasText(contentKey)) {
            contentKey = "idea-" + Instant.now().toEpochMilli();
        }
        if (!StringUtils.hasText(post.getCreatedDate())) {
            post.setCreatedDate(nowIso);
            post.setCreatedUser(actorUserId);
        }

        List<String> requestedImageUrls = imageUrls(
                request == null ? null : request.imageUrls(),
                request == null ? null : request.imageUrl());
        Map<String, String> removedManagedImages = removedManagedImages(
                post,
                requestedImageUrls,
                request == null ? null : request.removedImageUrls());
        String requestedHtml = request == null ? null : request.contentHtml();
        String html = removedManagedImages.isEmpty()
                && requestedHtml != null
                && requestedHtml.equals(post.getContentHtml())
                        ? post.getContentHtml()
                        : sanitizeHtml(removeManagedImageReferences(requestedHtml, removedManagedImages.keySet()));
        String title = text(request == null ? null : request.title(), "Untitled idea");
        post.setContentKey(contentKey);
        post.setLang(language);
        post.setLanguageLabel(languageLabel(language));
        post.setTitle(title);
        post.setContentHtml(html);
        post.setExcerpt(excerpt(request == null ? null : request.excerpt(), html));
        post.setImageDetails(normalizeImageDetails(
                request == null || request.imageDetails() == null ? post.getImageDetails() : request.imageDetails(), requestedImageUrls));
        post.setImageUrls(requestedImageUrls);
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
        removedManagedImages.values().forEach(mediaStorageService::deletePublicObjectOrThrow);
        adminTelemetryService.record("article.saved", "content", saved.getId(), actorUserId);
        return ideaPostMapper.toDto(saved);
    }

    public IdeaPostDto deletePost(String postId, IdeaPostAdminActionRequestDto request) {
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
        post.setTrashed(true);
        post.setTrashedAtIso(nowIso);
        post.setTrashedByUserId(actorUserId);
        post.setUpdatedDate(nowIso);
        post.setUpdatedUser(actorUserId);
        IdeaPost saved = ideaPostsRepository.save(post);
        adminTelemetryService.record("article.deleted", "content", saved.getId(), actorUserId);
        return ideaPostMapper.toDto(saved);
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
        return ideaPostMapper.toDto(saved);
    }

    private String sanitizeHtml(String html) {
        String normalized = normalize(html);
        if (!StringUtils.hasText(normalized)) {
            return "";
        }
        return Jsoup.clean(normalized, "https://myscoutee.invalid/", IDEA_HTML_SAFELIST);
    }

    private Map<String, String> removedManagedImages(
            IdeaPost post,
            List<String> requestedImageUrls,
            List<String> explicitlyRemovedImageUrls) {
        Set<String> retainedGroups = managedImageGroups(requestedImageUrls);
        Map<String, String> removedImagesByGroup = new LinkedHashMap<>();
        List<String> previousImageUrls = imageUrls(
                post == null ? null : post.getImageUrls(),
                post == null ? null : post.getImageUrl());
        for (String imageUrl : previousImageUrls) {
            addRemovedManagedImage(removedImagesByGroup, retainedGroups, imageUrl);
        }
        for (String imageUrl : explicitlyRemovedImageUrls == null ? List.<String>of() : explicitlyRemovedImageUrls) {
            addRemovedManagedImage(removedImagesByGroup, retainedGroups, imageUrl);
        }
        return removedImagesByGroup;
    }

    private Set<String> managedImageGroups(List<String> imageUrls) {
        Set<String> groups = new LinkedHashSet<>();
        for (String imageUrl : imageUrls == null ? List.<String>of() : imageUrls) {
            String group = mediaStorageService.managedImageSetGroupKey(imageUrl);
            if (StringUtils.hasText(group)) {
                groups.add(group);
            }
        }
        return groups;
    }

    private void addRemovedManagedImage(
            Map<String, String> removedImagesByGroup,
            Set<String> retainedGroups,
            String imageUrl) {
        String group = mediaStorageService.managedImageSetGroupKey(imageUrl);
        if (StringUtils.hasText(group) && !retainedGroups.contains(group)) {
            removedImagesByGroup.putIfAbsent(group, imageUrl);
        }
    }

    private String removeManagedImageReferences(String html, Set<String> removedGroups) {
        String normalized = normalize(html);
        if (!StringUtils.hasText(normalized) || removedGroups == null || removedGroups.isEmpty()) {
            return normalized;
        }
        Document document = Jsoup.parseBodyFragment(normalized);
        for (Element element : document.select("img, a[href]")) {
            String attribute = "img".equals(element.normalName()) ? "src" : "href";
            String reference = element.attr(attribute);
            if ("img".equals(element.normalName()) && !StringUtils.hasText(reference)) {
                element.remove();
                continue;
            }
            String group = mediaStorageService.managedImageSetGroupKey(reference);
            if (StringUtils.hasText(group) && removedGroups.contains(group)) {
                element.remove();
            }
        }
        for (Element figure : document.select("figure")) {
            if (!StringUtils.hasText(figure.text()) && figure.children().isEmpty()) {
                figure.remove();
            }
        }
        return document.body().html();
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

    private int normalizePublicPageSize(Integer pageSize) {
        int requested = pageSize == null ? DEFAULT_PUBLIC_PAGE_SIZE : pageSize;
        return Math.max(1, Math.min(MAX_PUBLIC_PAGE_SIZE, requested));
    }

    private LandingArticleCursor decodePublicCursor(String cursor) {
        String normalizedCursor = normalize(cursor);
        if (!StringUtils.hasText(normalizedCursor)) {
            return null;
        }
        try {
            String decoded = new String(
                    Base64.getUrlDecoder().decode(normalizedCursor),
                    StandardCharsets.UTF_8);
            String[] fields = decoded.split("\\n", -1);
            String language = fields.length == 3 ? supportedContentLang(fields[0]) : "";
            String submittedAtIso = fields.length == 3 ? fields[1].trim() : "";
            String id = fields.length == 3 ? fields[2].trim() : "";
            if (!StringUtils.hasText(language)
                    || !StringUtils.hasText(submittedAtIso)
                    || !StringUtils.hasText(id)) {
                throw new IllegalArgumentException("Cursor fields are missing.");
            }
            return new LandingArticleCursor(language, submittedAtIso, id);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid article cursor.", exception);
        }
    }

    private String encodePublicCursor(String language, IdeaPost post) {
        String value = contentLang(language)
                + "\n"
                + normalize(post.getSubmittedAtIso())
                + "\n"
                + normalize(post.getId());
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private String cursorLanguage(String requestedLanguage, String cursorLanguage) {
        String normalizedCursorLanguage = supportedContentLang(cursorLanguage);
        boolean sameLanguage = requestedLanguage.equals(normalizedCursorLanguage);
        boolean englishFallback = !DEFAULT_LANG.equals(requestedLanguage)
                && DEFAULT_LANG.equals(normalizedCursorLanguage);
        if (!sameLanguage && !englishFallback) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Article cursor language does not match the request.");
        }
        return normalizedCursorLanguage;
    }

    private AdminIdeaPostCursor parseAdminCursor(String cursor, String lang, String status) {
        String normalizedCursor = normalize(cursor);
        if (!StringUtils.hasText(normalizedCursor)) {
            return null;
        }
        try {
            Map<String, String> parsed = OBJECT_MAPPER.readValue(normalizedCursor, new TypeReference<>() { });
            AdminIdeaPostCursor parsedCursor = new AdminIdeaPostCursor(
                    normalize(parsed.get("lang")),
                    adminStatus(parsed.get("status")),
                    normalize(parsed.get("submittedAtIso")),
                    normalize(parsed.get("id")));
            if (!lang.equals(parsedCursor.lang())
                    || !status.equals(parsedCursor.status())
                    || !StringUtils.hasText(parsedCursor.submittedAtIso())
                    || !StringUtils.hasText(parsedCursor.id())) {
                throw new IllegalArgumentException("Cursor does not match the article list.");
            }
            return parsedCursor;
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid article cursor.", exception);
        }
    }

    private String serializeAdminCursor(String lang, String status, IdeaPost post) {
        try {
            return OBJECT_MAPPER.writeValueAsString(Map.of(
                    "lang", contentLang(lang),
                    "status", adminStatus(status),
                    "submittedAtIso", normalize(post == null ? null : post.getSubmittedAtIso()),
                    "id", normalize(post == null ? null : post.getId())));
        } catch (Exception exception) {
            throw new IllegalStateException("Article cursor could not be serialized.", exception);
        }
    }

    private int toSafeInt(long value) {
        if (value <= 0L) {
            return 0;
        }
        return value > Integer.MAX_VALUE ? Integer.MAX_VALUE : (int) value;
    }

    private record AdminIdeaPostCursor(
            String lang,
            String status,
            String submittedAtIso,
            String id) {
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
