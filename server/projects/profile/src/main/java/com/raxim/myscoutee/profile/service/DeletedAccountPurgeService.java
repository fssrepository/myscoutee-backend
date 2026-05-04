package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityChat;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatAvatarRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatMessageRecord;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.ActivityChatsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@Service
public class DeletedAccountPurgeService {
    private static final int DELETE_GRACE_DAYS = 30;

    private final UsersRepository usersRepository;
    private final ActivityChatsRepository activityChatsRepository;

    public DeletedAccountPurgeService(
            UsersRepository usersRepository,
            ActivityChatsRepository activityChatsRepository) {
        this.usersRepository = usersRepository;
        this.activityChatsRepository = activityChatsRepository;
    }

    @Scheduled(fixedDelayString = "${users.deleted-account-purge-delay-ms:3600000}")
    public void purgeExpiredDeletedAccounts() {
        String purgeBeforeIso = Instant.now().minus(DELETE_GRACE_DAYS, ChronoUnit.DAYS).toString();
        List<Users> users = usersRepository.findByProfileStatusAndDeletedAtIsoLessThanEqual("deleted", purgeBeforeIso);
        for (Users user : users) {
            purgeUser(user);
        }
    }

    private void purgeUser(Users user) {
        String userId = user == null ? "" : safeText(user.getId());
        if (!StringUtils.hasText(userId)) {
            return;
        }
        anonymizeChatMessages(userId);
        usersRepository.delete(user);
    }

    private void anonymizeChatMessages(String userId) {
        List<ActivityChat> chats = activityChatsRepository.findByMemberIdsContaining(userId);
        List<ActivityChat> changedChats = new ArrayList<>();
        for (ActivityChat chat : chats) {
            if (chat == null) {
                continue;
            }
            boolean changed = false;
            List<String> memberIds = new ArrayList<>();
            for (String memberId : chat.getMemberIds()) {
                if (!userId.equals(safeText(memberId))) {
                    memberIds.add(memberId);
                }
            }
            if (memberIds.size() != chat.getMemberIds().size()) {
                chat.setMemberIds(memberIds);
                changed = true;
            }
            for (ChatMessageRecord message : chat.getMessages()) {
                if (message == null) {
                    continue;
                }
                ChatAvatarRecord senderAvatar = message.getSenderAvatar();
                if (senderAvatar == null || !userId.equals(safeText(senderAvatar.getId()))) {
                    continue;
                }
                message.setSender("Deleted user");
                senderAvatar.setInitials(deletedUserInitials(userId));
                changed = true;
            }
            if (changed) {
                changedChats.add(chat);
            }
        }
        if (!changedChats.isEmpty()) {
            activityChatsRepository.saveAll(changedChats);
        }
    }

    private String deletedUserInitials(String userId) {
        int hash = 0;
        for (char value : safeText(userId).toCharArray()) {
            hash += value;
        }
        return "D" + ((Math.abs(hash) % 9) + 1);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
