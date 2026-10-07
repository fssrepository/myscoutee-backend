package com.raxim.myscoutee.domain.content.api;

import java.util.List;
import com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostAdminActionRequestDto;
import com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostAdminPageDto;
import com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostDto;
import com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostPublicPageDto;
import com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostSaveRequestDto;
public interface IdeaPosts {
    List<com.raxim.myscoutee.domain.content.dto.LandingContentDtos.LandingSlideDto> publicSlides(String groupId);
    List<IdeaPostDto> publicPosts();
    List<IdeaPostDto> publicPosts(String lang);
    List<IdeaPostDto> publicPosts(String lang, String acceptLanguage);
    IdeaPostPublicPageDto publicPostsPage(
            String lang,
            String acceptLanguage,
            Integer page,
            Integer pageSize,
            String cursor);
    IdeaPostPublicPageDto publicPostsPage(String lang, String acceptLanguage, Integer page,
            Integer pageSize, String cursor, String groupId);
    IdeaPostPublicPageDto publicFeaturedPosts(String lang, String acceptLanguage);
    IdeaPostPublicPageDto publicFeaturedPosts(String lang, String acceptLanguage, String groupId);
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
