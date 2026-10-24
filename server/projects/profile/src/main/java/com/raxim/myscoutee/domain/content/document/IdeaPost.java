package com.raxim.myscoutee.domain.content.document;
import java.util.Map;
import com.raxim.myscoutee.domain.media.dto.MediaDtos.ImageDetailsDto;
import static com.raxim.myscoutee.domain.media.dto.MediaDtos.normalizeImageDetails;

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
@lombok.Getter @lombok.Setter
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
    private String languageLabel;
    private String title;
    private String excerpt;
    private String contentHtml;
    private Map<String, ImageDetailsDto> imageDetails;
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

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls == null ? new ArrayList<>() : new ArrayList<>(imageUrls);
    }

}
