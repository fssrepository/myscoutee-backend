package com.raxim.myscoutee.profile.data.document;
import java.util.Map;
import com.raxim.myscoutee.profile.data.dto.media.MediaDtos.ImageDetailsDto;
import static com.raxim.myscoutee.profile.data.dto.media.MediaDtos.normalizeImageDetails;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ideaPosts")
@CompoundIndexes({
        @CompoundIndex(name = "idea_post_content_lang", def = "{'contentKey': 1, 'lang': 1}", unique = true),
        @CompoundIndex(name = "idea_post_lang_submitted", def = "{'lang': 1, 'submittedAtIso': -1}"),
        @CompoundIndex(name = "idea_post_lang_published_submitted", def = "{'lang': 1, 'published': 1, 'submittedAtIso': -1}"),
        @CompoundIndex(name = "idea_post_public_page", def = "{'lang': 1, 'published': 1, 'submittedAtIso': -1, '_id': -1}"),
        @CompoundIndex(name = "idea_post_public_featured_preview", def = "{'lang': 1, 'published': 1, 'featured': 1, 'submittedAtIso': -1, '_id': -1}"),
        @CompoundIndex(name = "idea_post_published_submitted", def = "{'published': 1, 'submittedAtIso': -1}"),
        @CompoundIndex(name = "idea_post_featured_submitted", def = "{'featured': 1, 'published': 1, 'submittedAtIso': -1}"),
        @CompoundIndex(name = "idea_post_trashed_submitted", def = "{'trashed': 1, 'submittedAtIso': -1}")
})
public class IdeaPost {
    @Id
    private String id;

    @Indexed(name = "idea_post_submitted_at")
    private String submittedAtIso;

    @Indexed(name = "idea_post_content_key")
    private String contentKey;

    @Indexed(name = "idea_post_lang")
    private String lang;
    private String workspaceGroupId;
    public String getWorkspaceGroupId() { return workspaceGroupId; }
    public void setWorkspaceGroupId(String value) { workspaceGroupId = value; }
    private String languageLabel;
    private String title;
    private String excerpt;
    private String contentHtml;
    private Map<String, ImageDetailsDto> imageDetails;
    public Map<String, ImageDetailsDto> getImageDetails() { return imageDetails; }
    public void setImageDetails(Map<String, ImageDetailsDto> value) { imageDetails = value; }
    private String imageUrl;
    private List<String> imageUrls = new ArrayList<>();
    private Boolean featured;
    private Boolean published;
    private Boolean trashed;
    private String trashedAtIso;
    private String trashedByUserId;
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSubmittedAtIso() {
        return submittedAtIso;
    }

    public void setSubmittedAtIso(String submittedAtIso) {
        this.submittedAtIso = submittedAtIso;
    }

    public String getContentKey() {
        return contentKey;
    }

    public void setContentKey(String contentKey) {
        this.contentKey = contentKey;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }

    public String getLanguageLabel() {
        return languageLabel;
    }

    public void setLanguageLabel(String languageLabel) {
        this.languageLabel = languageLabel;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getExcerpt() {
        return excerpt;
    }

    public void setExcerpt(String excerpt) {
        this.excerpt = excerpt;
    }

    public String getContentHtml() {
        return contentHtml;
    }

    public void setContentHtml(String contentHtml) {
        this.contentHtml = contentHtml;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls == null ? new ArrayList<>() : new ArrayList<>(imageUrls);
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    public Boolean getPublished() {
        return published;
    }

    public void setPublished(Boolean published) {
        this.published = published;
    }

    public Boolean getTrashed() {
        return trashed;
    }

    public void setTrashed(Boolean trashed) {
        this.trashed = trashed;
    }

    public String getTrashedAtIso() {
        return trashedAtIso;
    }

    public void setTrashedAtIso(String trashedAtIso) {
        this.trashedAtIso = trashedAtIso;
    }

    public String getTrashedByUserId() {
        return trashedByUserId;
    }

    public void setTrashedByUserId(String trashedByUserId) {
        this.trashedByUserId = trashedByUserId;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public String getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(String createdUser) {
        this.createdUser = createdUser;
    }

    public String getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(String updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getUpdatedUser() {
        return updatedUser;
    }

    public void setUpdatedUser(String updatedUser) {
        this.updatedUser = updatedUser;
    }
}
