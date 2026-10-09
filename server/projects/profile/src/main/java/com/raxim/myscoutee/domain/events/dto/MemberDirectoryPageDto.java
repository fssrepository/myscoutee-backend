package com.raxim.myscoutee.domain.events.dto;

import java.util.List;

public record MemberDirectoryPageDto(long total, List<MemberDirectoryEntryDto> items) {
    public MemberDirectoryPageDto { items = List.copyOf(items); }
}
