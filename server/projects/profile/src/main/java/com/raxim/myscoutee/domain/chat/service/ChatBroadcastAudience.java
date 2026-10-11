package com.raxim.myscoutee.domain.chat.service;

import java.util.Set;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;

/** Optional live membership recheck for a resource conversation, once per realm and broadcast. */
interface ChatBroadcastAudience {
    boolean supports(String chatId);
    Set<String> members(String chatId, MongoSessionMode mode);
}
