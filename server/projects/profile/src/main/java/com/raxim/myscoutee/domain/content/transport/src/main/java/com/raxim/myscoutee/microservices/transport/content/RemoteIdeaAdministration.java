package com.raxim.myscoutee.microservices.transport.content;

import com.raxim.myscoutee.domain.content.api.IdeaAdministration;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteIdeaAdministration extends RemoteReadTransport implements IdeaAdministration {
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer;
    public RemoteIdeaAdministration(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostDto> adminPosts(String adminUserId) {
        var command = new IdeaAdministrationProtocol.AdminPosts1(IdeaAdministrationProtocol.Scope.current(), adminUserId);
        if (!IdeaAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid idea-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > IdeaAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("idea-administration request exceeds byte limit");
        var result = ownerExchange(IdeaAdministrationProtocol.ADMINPOSTS_1, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostDto>>() {},
                "idea-administration.adminposts_1", IdeaAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostDto> adminPosts(String adminUserId, String lang) {
        var command = new IdeaAdministrationProtocol.AdminPosts2(IdeaAdministrationProtocol.Scope.current(), adminUserId, lang);
        if (!IdeaAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid idea-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > IdeaAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("idea-administration request exceeds byte limit");
        var result = ownerExchange(IdeaAdministrationProtocol.ADMINPOSTS_2, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostDto>>() {},
                "idea-administration.adminposts_2", IdeaAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostAdminPageDto adminPostsPage(String adminUserId, String lang, String status, Integer pageSize, String cursor) {
        var command = new IdeaAdministrationProtocol.AdminPostsPage1(IdeaAdministrationProtocol.Scope.current(), adminUserId, lang, status, pageSize, cursor);
        if (!IdeaAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid idea-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > IdeaAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("idea-administration request exceeds byte limit");
        var result = ownerExchange(IdeaAdministrationProtocol.ADMINPOSTSPAGE_1, bytes, new TypeReference<com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostAdminPageDto>() {},
                "idea-administration.adminpostspage_1", IdeaAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostDto savePost(com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostSaveRequestDto request) {
        var command = new IdeaAdministrationProtocol.SavePost1(IdeaAdministrationProtocol.Scope.current(), request);
        if (!IdeaAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid idea-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > IdeaAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("idea-administration request exceeds byte limit");
        var result = ownerExchange(IdeaAdministrationProtocol.SAVEPOST_1, bytes, new TypeReference<com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostDto>() {},
                "idea-administration.savepost_1", IdeaAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostDto deletePost(String postId, com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostAdminActionRequestDto request) {
        var command = new IdeaAdministrationProtocol.DeletePost1(IdeaAdministrationProtocol.Scope.current(), postId, request);
        if (!IdeaAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid idea-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > IdeaAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("idea-administration request exceeds byte limit");
        var result = ownerExchange(IdeaAdministrationProtocol.DELETEPOST_1, bytes, new TypeReference<com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostDto>() {},
                "idea-administration.deletepost_1", IdeaAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostDto restorePost(String postId, com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostAdminActionRequestDto request) {
        var command = new IdeaAdministrationProtocol.RestorePost1(IdeaAdministrationProtocol.Scope.current(), postId, request);
        if (!IdeaAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid idea-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > IdeaAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("idea-administration request exceeds byte limit");
        var result = ownerExchange(IdeaAdministrationProtocol.RESTOREPOST_1, bytes, new TypeReference<com.raxim.myscoutee.domain.content.dto.IdeaPostDtos.IdeaPostDto>() {},
                "idea-administration.restorepost_1", IdeaAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try {
            if (IdeaAdministrationProtocol.delegated(path)) return exchangeAuthorized(path, bytes, type, operation, limit, valid,
                    java.util.Map.of(com.raxim.myscoutee.microservices.transport.security.ActorDelegation.HEADER,
                            signer.issueForCurrent(IdeaAdministrationProtocol.AUDIENCE, "POST", path, bytes)));
            return exchange(path, bytes, type, operation, limit, valid);
        }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}
