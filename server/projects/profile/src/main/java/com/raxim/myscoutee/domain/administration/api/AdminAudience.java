package com.raxim.myscoutee.domain.administration.api;

import java.util.List;
public interface AdminAudience {
    List<String> adminNotificationRecipientUserIds(String actorUserId);
}
