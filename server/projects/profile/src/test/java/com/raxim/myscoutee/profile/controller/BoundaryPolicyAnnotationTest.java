package com.raxim.myscoutee.profile.controller;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Method;

import org.junit.jupiter.api.Test;
import org.springframework.web.multipart.MultipartFile;

import com.raxim.myscoutee.profile.controller.activities.ChatsController;
import com.raxim.myscoutee.profile.controller.activities.ActivitiesEventLeaderboardController;
import com.raxim.myscoutee.profile.controller.activities.ActivitiesEventsController;
import com.raxim.myscoutee.profile.controller.auth.AuthController;
import com.raxim.myscoutee.profile.controller.assets.AssetsController;
import com.raxim.myscoutee.profile.controller.help.HelpCenterController;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatMessageMutationRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatPostMessageRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatSupportCaseMutationRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDeleteRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetMakeManagerRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetReplaceRequestDto;
import com.raxim.myscoutee.profile.controller.media.MediaController;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserDeleteRequestDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserDto;
import com.raxim.myscoutee.profile.data.dto.events.EventLeaderboardDtos.EventLeaderboardEntryUpsertRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackDetailDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackNoteRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackToggleRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventStageActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.PrivacyConsentSaveRequestDto;
import com.raxim.myscoutee.profile.data.dto.media.MediaDtos.MediaImageImportRequestDto;
import com.raxim.myscoutee.profile.security.AccessPolicyKeys;
import com.raxim.myscoutee.profile.security.RequiresPolicy;

class BoundaryPolicyAnnotationTest {
    @Test
    void authProfileWriteMethodsDeclareProfilePolicies() throws Exception {
        assertMethodPolicy(
                AuthController.class,
                "saveProfile",
                new Class<?>[] { UserDto.class },
                AccessPolicyKeys.USER_PROFILE_EDIT,
                "#request?.id()",
                "#request?.id()");
        assertMethodPolicy(
                AuthController.class,
                "deleteUser",
                new Class<?>[] { UserDeleteRequestDto.class },
                AccessPolicyKeys.USER_PROFILE_DELETE,
                "#request?.userId() ?: #actorUserId",
                "#request?.userId() ?: #actorUserId");
    }

    @Test
    void mediaUploadImageDeclaresMediaUploadPolicy() throws Exception {
        Method method = MediaController.class.getDeclaredMethod(
                "uploadImage",
                String.class,
                String.class,
                MultipartFile.class);

        RequiresPolicy policy = method.getAnnotation(RequiresPolicy.class);

        assertPolicy(policy, AccessPolicyKeys.USER_MEDIA_UPLOAD, "#ownerId", "#ownerId");
    }

    @Test
    void mediaImportImageDeclaresMediaImportPolicy() throws Exception {
        Method method = MediaController.class.getDeclaredMethod("importImage", MediaImageImportRequestDto.class);

        RequiresPolicy policy = method.getAnnotation(RequiresPolicy.class);

        assertPolicy(policy, AccessPolicyKeys.USER_MEDIA_IMPORT, "#request?.ownerId()", "#request?.ownerId()");
    }

    @Test
    void mediaUploadAudioDeclaresMediaUploadPolicy() throws Exception {
        Method method = MediaController.class.getDeclaredMethod(
                "uploadAudio",
                String.class,
                String.class,
                MultipartFile.class);

        RequiresPolicy policy = method.getAnnotation(RequiresPolicy.class);

        assertPolicy(policy, AccessPolicyKeys.USER_MEDIA_UPLOAD, "#ownerId", "#ownerId");
    }

    @Test
    void eventBoundaryMethodsDeclareEventPolicies() throws Exception {
        assertMethodPolicy(
                ActivitiesEventsController.class,
                "publish",
                new Class<?>[] { EventActionRequestDto.class },
                AccessPolicyKeys.EVENT_PUBLISH,
                "#actorUserId",
                "#request?.sourceId()");
        assertMethodPolicy(
                ActivitiesEventsController.class,
                "unpublish",
                new Class<?>[] { EventActionRequestDto.class },
                AccessPolicyKeys.EVENT_UNPUBLISH,
                "#actorUserId",
                "#request?.sourceId()");
        assertMethodPolicy(
                ActivitiesEventsController.class,
                "takeOver",
                new Class<?>[] { EventActionRequestDto.class },
                AccessPolicyKeys.EVENT_TAKEOVER,
                "#actorUserId",
                "#request?.sourceId()");
        assertMethodPolicy(
                ActivitiesEventsController.class,
                "requestJoin",
                new Class<?>[] { EventActionRequestDto.class },
                AccessPolicyKeys.EVENT_JOIN,
                "#request?.userId() ?: #actorUserId",
                "#request?.sourceId()");
        assertMethodPolicy(
                ActivitiesEventsController.class,
                "applyStageAction",
                new Class<?>[] { EventStageActionRequestDto.class },
                AccessPolicyKeys.EVENT_STAGE_ACTION,
                "#actorUserId",
                "#request?.sourceId()");
    }

    @Test
    void eventFeedbackMethodsDeclareFeedbackPolicies() throws Exception {
        assertMethodPolicy(
                ActivitiesEventsController.class,
                "submitFeedback",
                new Class<?>[] { EventFeedbackDetailDto.class },
                AccessPolicyKeys.EVENT_FEEDBACK_SUBMIT,
                "#actorUserId",
                "#request?.eventId()");
        assertMethodPolicy(
                ActivitiesEventsController.class,
                "saveFeedbackNote",
                new Class<?>[] { EventFeedbackNoteRequestDto.class },
                AccessPolicyKeys.EVENT_FEEDBACK_NOTE,
                "#request?.userId() ?: #actorUserId",
                "#request?.eventId()");
        assertMethodPolicy(
                ActivitiesEventsController.class,
                "removeFeedbackEvent",
                new Class<?>[] { EventFeedbackToggleRequestDto.class },
                AccessPolicyKeys.EVENT_FEEDBACK_REMOVE,
                "#request?.userId() ?: #actorUserId",
                "#request?.eventId()");
        assertMethodPolicy(
                ActivitiesEventsController.class,
                "restoreFeedbackEvent",
                new Class<?>[] { EventFeedbackToggleRequestDto.class },
                AccessPolicyKeys.EVENT_FEEDBACK_RESTORE,
                "#request?.userId() ?: #actorUserId",
                "#request?.eventId()");
    }

    @Test
    void assetBoundaryMethodsDeclareAssetPolicies() throws Exception {
        assertMethodPolicy(
                AssetsController.class,
                "replace",
                new Class<?>[] { AssetReplaceRequestDto.class },
                AccessPolicyKeys.ASSET_REPLACE,
                "#request?.userId()",
                "#request?.userId()");
        assertMethodPolicy(
                AssetsController.class,
                "delete",
                new Class<?>[] { AssetDeleteRequestDto.class },
                AccessPolicyKeys.ASSET_DELETE,
                "#request?.userId()",
                "#request?.assetId()");
        assertMethodPolicy(
                AssetsController.class,
                "restore",
                new Class<?>[] { AssetDeleteRequestDto.class },
                AccessPolicyKeys.ASSET_RESTORE,
                "#request?.userId()",
                "#request?.assetId()");
        assertMethodPolicy(
                AssetsController.class,
                "takeOver",
                new Class<?>[] { AssetDeleteRequestDto.class },
                AccessPolicyKeys.ASSET_TAKEOVER,
                "#request?.userId()",
                "#request?.assetId()");
        assertMethodPolicy(
                AssetsController.class,
                "makeManager",
                new Class<?>[] { AssetMakeManagerRequestDto.class },
                AccessPolicyKeys.ASSET_MANAGER_PROMOTE_ACTOR,
                "#request?.userId()",
                "#request?.assetId()");
    }

    @Test
    void chatBoundaryMethodsDeclareChatPolicies() throws Exception {
        assertMethodPolicy(
                ChatsController.class,
                "sendMessage",
                new Class<?>[] { String.class, ChatPostMessageRequestDto.class, String.class },
                AccessPolicyKeys.CHAT_MESSAGE_CREATE,
                "#userId ?: #actorUserId",
                "#chatId");
        assertMethodPolicy(
                ChatsController.class,
                "editMessage",
                new Class<?>[] { String.class, String.class, ChatMessageMutationRequestDto.class, String.class },
                AccessPolicyKeys.CHAT_MESSAGE_EDIT,
                "#userId ?: #actorUserId",
                "#chatId");
        assertMethodPolicy(
                ChatsController.class,
                "deleteMessage",
                new Class<?>[] { String.class, String.class, String.class },
                AccessPolicyKeys.CHAT_MESSAGE_DELETE,
                "#userId ?: #actorUserId",
                "#chatId");
        assertMethodPolicy(
                ChatsController.class,
                "pinMessage",
                new Class<?>[] { String.class, String.class, ChatMessageMutationRequestDto.class, String.class },
                AccessPolicyKeys.CHAT_MESSAGE_PIN,
                "#userId ?: #actorUserId",
                "#chatId");
        assertMethodPolicy(
                ChatsController.class,
                "reactToMessage",
                new Class<?>[] { String.class, String.class, ChatMessageMutationRequestDto.class, String.class },
                AccessPolicyKeys.CHAT_REACTION_MANAGE,
                "#userId ?: #actorUserId",
                "#chatId");
        assertMethodPolicy(
                ChatsController.class,
                "updateMessageAttachments",
                new Class<?>[] { String.class, String.class, ChatMessageMutationRequestDto.class, String.class },
                AccessPolicyKeys.CHAT_ATTACHMENT_ADD,
                "#userId ?: #actorUserId",
                "#chatId");
        assertMethodPolicy(
                ChatsController.class,
                "updateSupportCase",
                new Class<?>[] { String.class, ChatSupportCaseMutationRequestDto.class, String.class },
                AccessPolicyKeys.CHAT_SUPPORT_MANAGE,
                "#request?.userId() ?: #userId ?: #actorUserId",
                "#chatId");
    }

    @Test
    void leaderboardAndPrivacyMethodsDeclarePolicies() throws Exception {
        assertMethodPolicy(
                ActivitiesEventLeaderboardController.class,
                "upsertEntry",
                new Class<?>[] { EventLeaderboardEntryUpsertRequestDto.class },
                AccessPolicyKeys.EVENT_LEADERBOARD_ENTRY_SUBMIT,
                "#request?.actorUserId() ?: #actorUserId",
                "#request?.eventId()");
        assertMethodPolicy(
                HelpCenterController.class,
                "savePrivacyConsent",
                new Class<?>[] { PrivacyConsentSaveRequestDto.class },
                AccessPolicyKeys.PRIVACY_CONSENT_SUBMIT,
                "#request?.userId()",
                "#request?.userId()");
    }

    private void assertMethodPolicy(
            Class<?> controllerClass,
            String methodName,
            Class<?>[] parameterTypes,
            String key,
            String subject,
            String resourceId) throws Exception {
        Method method = controllerClass.getDeclaredMethod(methodName, parameterTypes);
        assertPolicy(method.getAnnotation(RequiresPolicy.class), key, subject, resourceId);
    }

    private void assertPolicy(RequiresPolicy policy, String key, String subject, String resourceId) {
        assertThat(policy).isNotNull();
        assertThat(policy.key()).isEqualTo(key);
        assertThat(policy.subject()).isEqualTo(subject);
        assertThat(policy.resourceId()).isEqualTo(resourceId);
        assertThat(policy.skipWhenAuthenticationOptional()).isTrue();
    }
}
