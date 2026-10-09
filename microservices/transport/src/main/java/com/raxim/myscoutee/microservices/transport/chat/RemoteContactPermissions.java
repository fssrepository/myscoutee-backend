package com.raxim.myscoutee.microservices.transport.chat;

import java.net.URI;
import java.time.Duration;
import java.util.*;
import com.raxim.myscoutee.domain.chat.api.ContactPermissions;
import com.raxim.myscoutee.domain.chat.dto.ContactPermissionDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteCommandTransport;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.dao.*;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteContactPermissions extends RemoteCommandTransport implements ContactPermissions {
    private final ObjectMapper mapper;
    private final ActorDelegation.Signer issuer;
    public RemoteContactPermissions(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, ActorDelegation.Signer issuer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.issuer = issuer;
    }
    @Override public String pairId(String first, String second) { return ContactPermissions.canonicalPairId(first, second); }
    @Override public List<ContactPermissionDto> findForUser(String userId) {
        if (!ContactPermissionsProtocol.id(userId, 512)) throw new IllegalArgumentException("Invalid permission user");
        var body = mapper.writeValueAsBytes(new ContactPermissionsProtocol.UserQuery(userId));
        var proof = issuer.issue(userId, ContactPermissionsProtocol.AUDIENCE, "POST", ContactPermissionsProtocol.USER, body);
        return exchangeAuthorized(ContactPermissionsProtocol.USER, body, new TypeReference<List<ContactPermissionDto>>() {},
                "chat.contact-permissions.user", 2 * 1024 * 1024,
                values -> values.stream().allMatch(value -> valid(value) && ContactPermissionsProtocol.participant(value, userId)),
                Map.of(ActorDelegation.HEADER, proof));
    }
    @Override public Optional<ContactPermissionDto> findById(String id) {
        if (!ContactPermissionsProtocol.id(id, 2048)) throw new IllegalArgumentException("Invalid permission ID");
        var body = mapper.writeValueAsBytes(new ContactPermissionsProtocol.EntryQuery(id));
        try {
            return Optional.of(exchangeAuthorized(ContactPermissionsProtocol.ENTRY, body, new TypeReference<ContactPermissionDto>() {},
                    "chat.contact-permissions.entry", 16384, value -> valid(value) && id.equals(value.id()),
                    Map.of(ActorDelegation.HEADER, sign(ContactPermissionsProtocol.ENTRY, body))));
        } catch (RemoteReadException failed) {
            if (failed.status() == 404 && "NOT_FOUND".equals(failed.remoteCode())) return Optional.empty();
            throw failed;
        }
    }
    @Override public ContactPermissionDto save(Change change) {
        if (!ContactPermissionsProtocol.valid(change)) throw new IllegalArgumentException("Invalid contact permission change");
        var body = mapper.writeValueAsBytes(new ContactPermissionsProtocol.Save(change));
        if (body.length > ContactPermissionsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Contact permission change exceeds limit");
        try {
            return command(ContactPermissionsProtocol.SAVE, body, new TypeReference<ContactPermissionDto>() {},
                    "chat.contact-permissions.save", 16384, value -> valid(value) && change.id().equals(value.id()) && value.version() != null,
                    sign(ContactPermissionsProtocol.SAVE, body), change.id() + "@" + change.version() + ":" + change.status());
        } catch (RemoteReadException failed) {
            if (failed.status() == 409 && "VERSION_CONFLICT".equals(failed.remoteCode()))
                throw new OptimisticLockingFailureException("Contact permission version changed");
            if (failed.status() == 409 && "DUPLICATE_PERMISSION".equals(failed.remoteCode()))
                throw new DuplicateKeyException("Contact permission already exists");
            throw failed;
        }
    }
    private String sign(String path, byte[] body) { return issuer.issueForCurrent(ContactPermissionsProtocol.AUDIENCE, "POST", path, body); }
    private boolean valid(ContactPermissionDto value) {
        return value != null && ContactPermissionsProtocol.id(value.id(), 2048)
                && ContactPermissionsProtocol.id(value.leftUserId(), 512) && ContactPermissionsProtocol.id(value.rightUserId(), 512);
    }
}
