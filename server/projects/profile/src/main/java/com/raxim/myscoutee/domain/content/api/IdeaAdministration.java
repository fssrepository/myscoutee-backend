package com.raxim.myscoutee.domain.content.api;

import java.util.List;
import com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostAdminActionRequestDto;
import com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostAdminPageDto;
import com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostDto;
import com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostPublicPageDto;
import com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostSaveRequestDto;
/** Existing administrator operations; public content stays with its original API. */
public interface IdeaAdministration {
    List<IdeaPostDto> adminPosts(String adminUserId);
    List<IdeaPostDto> adminPosts(String adminUserId, String lang);
    IdeaPostAdminPageDto adminPostsPage(
            String adminUserId,
            String lang,
            String status,
            Integer pageSize,
            String cursor);
    IdeaPostDto savePost(IdeaPostSaveRequestDto request);
    IdeaPostDto deletePost(String postId, IdeaPostAdminActionRequestDto request);
    IdeaPostDto restorePost(String postId, IdeaPostAdminActionRequestDto request);
}
