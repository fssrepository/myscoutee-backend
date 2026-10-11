package com.raxim.myscoutee.domain.chat.service;

import static com.raxim.myscoutee.domain.chat.service.ChatRecordContext.*;
import java.util.*;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.assets.api.AssetCatalog;
import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import com.raxim.myscoutee.domain.events.api.EventOwnership.SubEvent;

/** Existing product context helpers shared by resource creation and activity presentation. */
final class ChatActivityContext {
    private ChatActivityContext() {}
    static final String ASSET_TYPE_TRANSPORT = AssetCatalog.TYPE_TRANSPORT;
    static final String ASSET_TYPE_ACCOMMODATION = AssetCatalog.TYPE_ACCOMMODATION;
    static final String ASSET_TYPE_SUPPLIES = AssetCatalog.TYPE_SUPPLIES;

    static SubEvent findChatContextSubEvent(Event event, String subEventId) {
        String normalizedSubEventId = normalizeId(subEventId);
        if (event == null || !StringUtils.hasText(normalizedSubEventId)) {
            return null;
        }
        return (event.getSubEvents() == null ? List.<SubEvent>of() : event.getSubEvents()).stream()
                .filter(Objects::nonNull)
                .filter(item -> normalizedSubEventId.equals(normalizeId(item.id())))
                .findFirst()
                .orElse(null);
    }

}
