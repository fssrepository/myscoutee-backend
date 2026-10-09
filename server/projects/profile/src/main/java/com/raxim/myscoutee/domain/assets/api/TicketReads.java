package com.raxim.myscoutee.domain.assets.api;

import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetTicketsPageDto;

/** Ticket page owned by assets; caller authentication remains authoritative. */
public interface TicketReads {
    AssetTicketsPageDto queryTicketPage(String userId, Integer page, Integer pageSize, String order);
}
