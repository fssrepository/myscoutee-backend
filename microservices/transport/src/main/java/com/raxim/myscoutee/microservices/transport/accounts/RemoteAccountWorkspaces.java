package com.raxim.myscoutee.microservices.transport.accounts;

import com.raxim.myscoutee.domain.accounts.api.AccountWorkspaces;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteAccountWorkspaces extends RemoteReadTransport implements AccountWorkspaces {
    private final ObjectMapper mapper;
    public RemoteAccountWorkspaces(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto select(String accountId, String groupId) {
        var command = new AccountWorkspacesProtocol.Select(AccountWorkspacesProtocol.Scope.current(), accountId, groupId);
        if (!AccountWorkspacesProtocol.valid(command)) throw new IllegalArgumentException("Invalid account-workspaces request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AccountWorkspacesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("account-workspaces request exceeds byte limit");
        var result = ownerExchange(AccountWorkspacesProtocol.SELECT, bytes, new TypeReference<AccountWorkspacesProtocol.Result>() {},
                "account-workspaces.select", AccountWorkspacesProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto activate(String accountId, String groupId) {
        var command = new AccountWorkspacesProtocol.Select(AccountWorkspacesProtocol.Scope.current(), accountId, groupId);
        if (!AccountWorkspacesProtocol.valid(command)) throw new IllegalArgumentException("Invalid account-workspaces request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AccountWorkspacesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("account-workspaces request exceeds byte limit");
        var result = ownerExchange(AccountWorkspacesProtocol.ACTIVATE, bytes, new TypeReference<AccountWorkspacesProtocol.Result>() {},
                "account-workspaces.activate", AccountWorkspacesProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto admit(com.raxim.myscoutee.domain.groups.api.GroupView group, String accountId) {
        var command = new AccountWorkspacesProtocol.Policy(AccountWorkspacesProtocol.Scope.current(), com.raxim.myscoutee.domain.groups.dto.GroupDirectoryEntryDto .from(group), accountId);
        if (!AccountWorkspacesProtocol.valid(command)) throw new IllegalArgumentException("Invalid account-workspaces request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AccountWorkspacesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("account-workspaces request exceeds byte limit");
        var result = ownerExchange(AccountWorkspacesProtocol.ADMIT, bytes, new TypeReference<AccountWorkspacesProtocol.Result>() {},
                "account-workspaces.admit", AccountWorkspacesProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()));
        return result.value();
    }
    @Override public void applyPolicy(com.raxim.myscoutee.domain.groups.api.GroupView group) {
        var command = new AccountWorkspacesProtocol.Policy(AccountWorkspacesProtocol.Scope.current(), com.raxim.myscoutee.domain.groups.dto.GroupDirectoryEntryDto.from(group), null);
        if (!AccountWorkspacesProtocol.valid(command)) throw new IllegalArgumentException("Invalid account-workspaces request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AccountWorkspacesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("account-workspaces request exceeds byte limit");
        var result = ownerExchange(AccountWorkspacesProtocol.POLICY, bytes, new TypeReference<AccountWorkspacesProtocol.Receipt>() {},
                "account-workspaces.policy", AccountWorkspacesProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public void clearActiveWorkspace(String accountId, String groupId) {
        var command = new AccountWorkspacesProtocol.Select(AccountWorkspacesProtocol.Scope.current(), accountId, groupId);
        if (!AccountWorkspacesProtocol.valid(command)) throw new IllegalArgumentException("Invalid account-workspaces request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AccountWorkspacesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("account-workspaces request exceeds byte limit");
        var result = ownerExchange(AccountWorkspacesProtocol.CLEAR, bytes, new TypeReference<AccountWorkspacesProtocol.Receipt>() {},
                "account-workspaces.clear", AccountWorkspacesProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.completed()));
    }
    @Override public java.util.Map<String, com.raxim.myscoutee.domain.accounts.dto.AccountWorkspaceDto> profilesByGroup(String accountId) {
        var command = new AccountWorkspacesProtocol.Roster(AccountWorkspacesProtocol.Scope.current(), accountId);
        if (!AccountWorkspacesProtocol.valid(command)) throw new IllegalArgumentException("Invalid account-workspaces request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AccountWorkspacesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("account-workspaces request exceeds byte limit");
        var result = ownerExchange(AccountWorkspacesProtocol.ROSTER, bytes, new TypeReference<java.util.Map<String, com.raxim.myscoutee.domain.accounts.dto.AccountWorkspaceDto>>() {},
                "account-workspaces.roster", AccountWorkspacesProtocol.MAX_RESPONSE_BYTES, value -> value.values().stream().allMatch(java.util.Objects::nonNull));
        return result;
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try { return exchange(path, bytes, type, operation, limit, valid); }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}
