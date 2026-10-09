package com.raxim.myscoutee.domain.accounts.repository;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Date;
import java.util.HexFormat;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import com.mongodb.client.model.ReturnDocument;
import com.mongodb.client.model.UpdateOptions;
import com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.NavigatorContactDto;
import com.raxim.myscoutee.domain.chat.api.ContactPermissions;
import com.raxim.myscoutee.domain.chat.dto.ContactPermissionDto;

/** Accounts-owned accepted commands. Receipts are written with their local effect. */
@Repository
public class ContactChatAccessOperations {
    private static final String COLLECTION = "contactAccessOperations";
    private final MongoTemplate mongo;
    public ContactChatAccessOperations(MongoTemplate mongo) { this.mongo = mongo; }

    public void ensureIndexes() {
        var collection = mongo.getCollection(COLLECTION);
        collection.createIndex(new Document("state", 1).append("nextAttemptAt", 1));
        collection.createIndex(new Document("pairId", 1).append("state", 1));
        collection.createIndex(new Document("actor", 1));
        collection.createIndex(new Document("target", 1));
    }

    public Document accept(String actor, String target, String workspace, ContactPermissions.Change change,
            NavigatorContactDto contact) {
        String id = hash(change.id() + "@" + change.version());
        var operation = new Document("_id", id).append("pairId", change.id()).append("actor", actor)
                .append("target", target).append("workspace", workspace).append("change", write(change))
                .append("contact", write(contact)).append("state", "pending").append("attempts", 0)
                .append("nextAttemptAt", new Date()).append("acceptedAt", new Date());
        mongo.getCollection(COLLECTION).updateOne(new Document("_id", id),
                new Document("$setOnInsert", operation), new UpdateOptions().upsert(true));
        var saved = find(id);
        var existing = change(saved);
        // A concurrent retry keeps the first immutable timestamp/payload. A
        // competing decision must never replace that already accepted command.
        if (!Objects.equals(saved.getString("actor"), actor) || !Objects.equals(saved.getString("target"), target)
                || !Objects.equals(existing.status(), change.status())
                || !Objects.equals(existing.requestedBy(), change.requestedBy())
                || !Objects.equals(existing.version(), change.version())
                || !Objects.equals(saved.getString("workspace"), workspace)) {
            throw new org.springframework.dao.OptimisticLockingFailureException("A different contact decision was accepted");
        }
        return saved;
    }

    public Document find(String id) { return mongo.getCollection(COLLECTION).find(new Document("_id", id)).first(); }
    public List<Document> pending(String pair) {
        return mongo.getCollection(COLLECTION).find(new Document("pairId", pair).append("state", "pending"))
                .sort(new Document("acceptedAt", 1)).limit(20).into(new java.util.ArrayList<>());
    }
    public List<Document> due() {
        return mongo.getCollection(COLLECTION).find(new Document("state", "pending")
                .append("nextAttemptAt", new Document("$lte", new Date())).append("$or", List.of(
                        new Document("leaseUntil", null), new Document("leaseUntil", new Document("$lte", new Date())))))
                .sort(new Document("nextAttemptAt", 1)).limit(20).into(new java.util.ArrayList<>());
    }
    public Instant nextAttemptAt() {
        // A future lease blocks only its own command, not another due command.
        var next = mongo.getCollection(COLLECTION).aggregate(List.of(
                new Document("$match", new Document("state", "pending")),
                new Document("$project", new Document("due", new Document("$max", List.of(
                        new Document("$ifNull", List.of("$nextAttemptAt", new Date(0))),
                        new Document("$ifNull", List.of("$leaseUntil", new Date(0))))))),
                new Document("$sort", new Document("due", 1)), new Document("$limit", 1))).first();
        return next == null ? null : next.getDate("due").toInstant();
    }

    public Document claim(String id) {
        var query = new Document("_id", id).append("state", "pending").append("$or", List.of(
                new Document("leaseUntil", null), new Document("leaseUntil", new Document("$lte", new Date()))));
        return mongo.getCollection(COLLECTION).findOneAndUpdate(query,
                new Document("$set", new Document("lease", UUID.randomUUID().toString())
                        .append("leaseUntil", Date.from(Instant.now().plusSeconds(60)))),
                new FindOneAndUpdateOptions().returnDocument(ReturnDocument.AFTER));
    }
    public ContactPermissions.Change change(Document operation) {
        return mongo.getConverter().read(ContactPermissions.Change.class, operation.get("change", Document.class));
    }
    public ContactPermissionDto receipt(Document operation) {
        Document value = operation == null ? null : operation.get("receipt", Document.class);
        return value == null ? null : mongo.getConverter().read(ContactPermissionDto.class, value);
    }
    public void remember(Document operation, ContactPermissions.Permission permission) {
        updateLeased(operation, new Document("$set", new Document("receipt", write(ContactPermissionDto.from(permission)))));
    }
    public void complete(Document operation) {
        updateLeased(operation, new Document("$set", new Document("state", "complete").append("completedAt", new Date()))
                .append("$unset", new Document("lease", "").append("leaseUntil", "").append("lastFailure", "")));
    }
    public void failed(Document operation, boolean conflict) {
        long attempts = operation.get("attempts") instanceof Number n ? n.longValue() : 0;
        long delay = Math.min(300, 5L << Math.min(6, attempts));
        updateLeased(operation, new Document("$set", new Document("state", conflict ? "conflict" : "pending")
                .append("lastFailure", conflict ? "OWNER_CONFLICT" : "RETRYABLE")
                .append("nextAttemptAt", Date.from(Instant.now().plusSeconds(delay))))
                .append("$inc", new Document("attempts", 1))
                .append("$unset", new Document("lease", "").append("leaseUntil", "")));
    }
    private void updateLeased(Document operation, Document update) {
        if (mongo.getCollection(COLLECTION).updateOne(new Document("_id", operation.getString("_id"))
                .append("state", "pending").append("lease", operation.getString("lease")), update).getMatchedCount() != 1) {
            throw new IllegalStateException("Contact operation lease changed; retry the persisted operation");
        }
    }

    public void applyAccounts(Document operation, ContactPermissions.Permission permission) {
        String actor = operation.getString("actor"), target = operation.getString("target");
        boolean pending = "pending".equals(permission.status());
        String counterOwner = pending ? target : actor;
        String key = hash(permission.id());
        String counterVersion = "contactPermissionCounterVersions." + key;
        Document filter = new Document("userId", counterOwner).append("$expr", newer(counterVersion, permission.version()));
        var counter = new Document("$max", List.of(0, new Document("$add", List.of(
                new Document("$ifNull", List.of("$contactRequestsPending", 0)), pending ? 1 : -1))));
        mongo.getCollection("users").updateOne(filter, List.of(new Document("$set",
                new Document("contactRequestsPending", counter).append(counterVersion, permission.version()))));
        if (mongo.getCollection("users").find(new Document("userId", counterOwner)).projection(new Document("_id", 1)).first() == null)
            throw new IllegalStateException("Contact counter owner no longer exists");
        if (!"approved".equals(permission.status())) return;

        var dto = mongo.getConverter().read(NavigatorContactDto.class, operation.get("contact", Document.class));
        // Use the existing contact record shape, without replacing the user's
        // other contacts. Private methods are intentionally absent here.
        var contact = new Document("id", dto.id()).append("userId", dto.userId()).append("name", dto.name())
                .append("initials", dto.initials()).append("gender", dto.gender()).append("city", dto.city())
                .append("avatarUrl", dto.avatarUrl()).append("headline", dto.headline())
                .append("createdAtIso", dto.createdAtIso()).append("updatedAtIso", dto.updatedAtIso()).append("methods", List.of());
        var profiles = mongo.getCollection("navigatorContacts");
        profiles.updateOne(new Document("userId", actor), new Document("$setOnInsert",
                new Document("userId", actor).append("contacts", List.of())), new UpdateOptions().upsert(true));
        String contactVersion = "contactPermissionVersions." + key;
        var contacts = new Document("$ifNull", List.of("$contacts", List.of()));
        var alreadySaved = new Document("$in", List.of(new Document("$literal", target),
                new Document("$ifNull", List.of("$contacts.userId", List.of()))));
        profiles.updateOne(new Document("userId", actor).append("$expr", newer(contactVersion, permission.version())),
                List.of(new Document("$set", new Document("contacts", new Document("$cond", List.of(alreadySaved,
                        contacts, new Document("$concatArrays", List.of(contacts, new Document("$literal", List.of(contact)))))))
                        .append(contactVersion, permission.version()).append("updatedAtIso", new Document("$literal", permission.decidedAtIso())))));
        var profile = profiles.find(new Document("userId", actor)).first();
        String applied = "contactPermissionContactVersions." + key;
        mongo.getCollection("users").updateOne(new Document("userId", actor).append("$expr", newer(applied, permission.version())),
                List.of(new Document("$set", new Document("activities", new Document("$mergeObjects", List.of(
                        new Document("$ifNull", List.of("$activities", new Document())),
                        new Document("contacts", profile.getList("contacts", Document.class).size()))))
                        .append(applied, permission.version()))));
    }
    private Document newer(String field, Long version) {
        return new Document("$lt", List.of(new Document("$ifNull", List.of("$" + field, -1L)), version));
    }
    private Document write(Object value) { var document = new Document(); mongo.getConverter().write(value, document); return document; }
    private static String hash(String value) {
        try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8))); }
        catch (java.security.NoSuchAlgorithmException impossible) { throw new IllegalStateException(impossible); }
    }
}
