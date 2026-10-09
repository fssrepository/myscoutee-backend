package com.raxim.myscoutee.domain.content.api;
import com.raxim.myscoutee.domain.content.dto.ContentModerationDtos.Item;
public interface ContentRegistration { com.raxim.myscoutee.domain.content.dto.ContentModerationDtos.Snapshot snapshot(); Item register(String category, String sourceId, String ownerId, String title, String imageUrl); }
