package com.raxim.myscoutee.domain.accounts.service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.bson.Document;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.NavigatorContactDto;
import com.raxim.myscoutee.domain.accounts.repository.ContactChatAccessOperations;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.accounts.security.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.domain.chat.api.ContactPermissions;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

/** Continues a command after NavigatorContactsService has validated its authority.
 * No read endpoint runs this workflow, and no browser session/token is persisted.
 */
@Service
public class ContactChatAccessWorkflow {
    private static final org.slf4j.Logger LOG = org.slf4j.LoggerFactory.getLogger(ContactChatAccessWorkflow.class);
    private final ContactChatAccessOperations operations;
    private final ContactPermissions permissions;
    private final NotificationDelivery notifications;
    private final UsersRepository users;
    private final ScheduledMongoSessionRunner databases;

    public ContactChatAccessWorkflow(ContactChatAccessOperations operations, ContactPermissions permissions,
            NotificationDelivery notifications, UsersRepository users, ScheduledMongoSessionRunner databases) {
        this.operations = operations; this.permissions = permissions; this.notifications = notifications;
        this.users = users; this.databases = databases;
    }

    public void finishPending(String pairId) {
        for (var operation : operations.pending(pairId)) process(operation);
    }

    @jakarta.annotation.PostConstruct
    public void ensureIndexes() { databases.runAcrossConfiguredDatabases(operations::ensureIndexes); }

    public ContactPermissions.Permission accept(String actor, String target, String workspace,
            ContactPermissions.Change change, NavigatorContactDto contact) {
        return process(operations.accept(actor, target, workspace, change, contact));
    }

    @org.springframework.beans.factory.annotation.Autowired
    void watchAcceptedCommands(com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService changes) {
        changes.watch("contact-access", java.util.Set.of("contactAccessOperations"),
                java.util.Set.of("state", "nextAttemptAt", "leaseUntil"), () -> {
                    recoverAcceptedCommandsInCurrentDatabase();
                    var next = operations.nextAttemptAt();
                    if (next == null) return null;
                    var retry = java.time.Instant.now().plusSeconds(5);
                    return next.isAfter(retry) ? next : retry;
                });
    }

    public void recoverAcceptedCommands() {
        databases.runAcrossConfiguredDatabases(this::recoverAcceptedCommandsInCurrentDatabase);
    }

    private void recoverAcceptedCommandsInCurrentDatabase() {
        for (var operation : operations.due()) {
                try { process(operation); }
                catch (RuntimeException failure) {
                    // Retry state is already retained; never print the actor or payload.
                    LOG.warn("Accepted contact access operation remains incomplete ({})", failure.getClass().getSimpleName());
                }
            }
    }

    private ContactPermissions.Permission process(Document candidate) {
        if ("complete".equals(candidate.getString("state"))) return operations.receipt(candidate);
        if (!"pending".equals(candidate.getString("state")))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The accepted contact request has changed.");
        Document operation = operations.claim(candidate.getString("_id"));
        if (operation == null) {
            var latest = operations.find(candidate.getString("_id"));
            if (latest != null && "complete".equals(latest.getString("state"))) return operations.receipt(latest);
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Contact request processing is pending.");
        }
        try {
            var receipt = operations.receipt(operation);
            if (receipt == null) {
                ContactPermissions.Permission permission;
                try {
                    permission = saveAcceptedPermission(operation);
                } catch (OptimisticLockingFailureException | DuplicateKeyException conflict) {
                    operations.failed(operation, true);
                    throw new OwnerConflict(conflict);
                }
                operations.remember(operation, permission);
                receipt = com.raxim.myscoutee.domain.chat.dto.ContactPermissionDto.from(permission);
            }
            operations.applyAccounts(operation, receipt);
            var next = receipt;
            JobGroupContext.run(operation.getString("workspace"), () -> notifyOnce(operation, next));
            operations.complete(operation);
            return receipt;
        } catch (OwnerConflict conflict) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The request has changed.", conflict.getCause());
        } catch (RuntimeException failure) {
            operations.failed(operation, false);
            throw failure;
        }
    }

    private static final class OwnerConflict extends RuntimeException {
        private OwnerConflict(RuntimeException cause) { super(cause); }
    }

    private ContactPermissions.Permission saveAcceptedPermission(Document operation) {
        String actor = operation.getString("actor"), target = operation.getString("target");
        var members = users.findByUserIdIn(List.of(actor, target));
        var owner = members.stream().filter(user -> actor.equals(user.getUserId())).findFirst().orElseThrow();
        var peer = members.stream().filter(user -> target.equals(user.getUserId())).findFirst().orElseThrow();
        for (var user : List.of(owner, peer)) {
            if (!Objects.equals(user.getWorkspaceGroupId(), operation.getString("workspace"))
                    || org.springframework.util.StringUtils.hasText(user.getDeletedAtIso())
                    || "deleted".equalsIgnoreCase(user.getProfileStatus()))
                throw new IllegalStateException("Accepted contact participant is no longer available");
        }
        // This is a narrowly scoped continuation of the persisted, previously
        // authorized command, not a new login or replay of an expired JWT.
        // Reload the account-local profile and grant no administrative roles.
        var principal = new FirebasePrincipal(actor, "", List.<String>of(), owner);
        if (!actor.equals(principal.getUserId())) throw new IllegalStateException("Contact actor identity changed");
        var previous = SecurityContextHolder.getContext();
        var context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(UsernamePasswordAuthenticationToken.authenticated(principal, null, List.of()));
        try {
            SecurityContextHolder.setContext(context);
            return permissions.save(operations.change(operation));
        } finally { SecurityContextHolder.setContext(previous); }
    }

    private void notifyOnce(Document operation, ContactPermissions.Permission permission) {
        String kind = "contact-chat-" + ("pending".equals(permission.status()) ? "requested" : permission.status());
        String message = "notification.kind." + kind + ".message";
        String actor = operation.getString("actor");
        notifications.enqueueOnce("contact-access:" + operation.getString("_id"), new NotificationIntent(
                kind, "contact", permission.id(), "users", List.of(operation.getString("target")), "MyScoutee", message,
                "/game", "/assets/logo/heart.webp", "/assets/logo/heart.webp", kind + "-" + permission.id(),
                Map.of("notification_message_key", message, "senderUserId", actor, "contactUserId", actor,
                        "requestVersion", String.valueOf(permission.version())), actor));
    }
}
