package com.raxim.myscoutee.microservices.transport.groups;

import java.net.URI;
import java.time.Duration;
import java.util.*;
import com.raxim.myscoutee.domain.groups.api.GroupDirectory;
import com.raxim.myscoutee.domain.groups.dto.GroupDirectoryEntryDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteGroupDirectory extends RemoteReadTransport implements GroupDirectory {
    private final ObjectMapper mapper;
    public RemoteGroupDirectory(URI origin,String token,boolean allowHttp,Duration connectTimeout,
            Duration requestTimeout,ObjectMapper mapper,MeterRegistry metrics) {
        super(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics);this.mapper=mapper;
    }
    @Override public Optional<GroupDirectoryEntryDto> findById(String id) {
        return optional(GroupDirectoryProtocol.ENTRY,id,new TypeReference<GroupDirectoryEntryDto>() {},"groups.directory-entry");
    }
    @Override public Optional<GroupName> name(String id) {
        return optional(GroupDirectoryProtocol.NAME,id,new TypeReference<GroupName>() {},"groups.directory-name");
    }
    @Override public Optional<GroupType> type(String id) {
        return optional(GroupDirectoryProtocol.TYPE,id,new TypeReference<GroupType>() {},"groups.directory-type");
    }
    @Override public List<GroupDirectoryEntryDto> findByIdIn(Collection<String> ids) {
        return batch(GroupDirectoryProtocol.ENTRIES,ids,new TypeReference<List<GroupDirectoryEntryDto>>() {},"groups.directory-entries");
    }
    @Override public List<GroupDirectoryEntryDto> findAllById(Iterable<String> ids) {
        return batch(GroupDirectoryProtocol.ALL_IDS,ids,new TypeReference<List<GroupDirectoryEntryDto>>() {},"groups.directory-all-ids");
    }
    @Override public Set<String> activeCommunityIds(Collection<String> ids) {
        return batch(GroupDirectoryProtocol.ACTIVE,ids,new TypeReference<Set<String>>() {},"groups.directory-active");
    }
    @Override public Set<String> workGroupIds(Collection<String> ids) {
        return batch(GroupDirectoryProtocol.WORK_IDS,ids,new TypeReference<Set<String>>() {},"groups.directory-work-ids");
    }
    @Override public Map<String,String> baseGroupIds(Collection<String> ids) {
        return batch(GroupDirectoryProtocol.BASE_IDS,ids,new TypeReference<Map<String,String>>() {},"groups.directory-base-ids");
    }
    @Override public Map<String,String> workspaceBaseIds() {
        return exchange(GroupDirectoryProtocol.BASES,new TypeReference<Map<String,String>>() {},"groups.directory-bases",GroupDirectoryProtocol.MAX_RESPONSE_BYTES,value -> true);
    }
    private <T> T batch(String path,Iterable<String> ids,TypeReference<T> type,String operation) {
        return exchange(path,GroupDirectoryProtocol.encode(ids,mapper),type,operation,GroupDirectoryProtocol.MAX_RESPONSE_BYTES,value -> true);
    }
    private <T> Optional<T> optional(String path,String id,TypeReference<T> type,String operation) {
        try {
            return Optional.of(exchange(queryPath(path,"id",id),type,operation,GroupDirectoryProtocol.MAX_RESPONSE_BYTES,value -> true));
        } catch (RemoteReadException failure) {
            if (failure.status()==404 && "NOT_FOUND".equals(failure.remoteCode())) return Optional.empty();
            throw failure;
        }
    }
}
