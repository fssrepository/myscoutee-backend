package com.raxim.myscoutee.domain.accounts.config;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.mongodb.client.MongoCollection;
import com.raxim.myscoutee.domain.accounts.security.firebase.DevelopmentIdentityEmail;
import com.raxim.myscoutee.domain.accounts.document.Users;

import jakarta.annotation.PostConstruct;

@Component
public class UserIdentityIndexInitializer {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserIdentityIndexInitializer.class);
    private static final String EMAIL_INDEX = "users_email";
    private static final String DEMO_PROFILE_PREFIX = "demo-profile-";

    private final MongoTemplate mongoTemplate;

    public UserIdentityIndexInitializer(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @PostConstruct
    public void migrateAndEnsureEmailIndex() {
        MongoCollection<Document> users = mongoTemplate.getCollection(
                mongoTemplate.getCollectionName(Users.class));
        normalizeDevelopmentAndStoredEmails(users);
        requireUniqueNormalizedEmails(users);

        Document existing = users.listIndexes()
                .into(new ArrayList<>())
                .stream()
                .filter(index -> EMAIL_INDEX.equals(index.getString("name")))
                .findFirst()
                .orElse(null);
        if (existing != null && !Boolean.TRUE.equals(existing.getBoolean("unique"))) {
            users.dropIndex(EMAIL_INDEX);
        }
        mongoTemplate.indexOps(Users.class).createIndex(
                new Index()
                        .on("email", Direction.ASC)
                        .unique()
                        .sparse()
                        .named(EMAIL_INDEX));
    }

    private void normalizeDevelopmentAndStoredEmails(MongoCollection<Document> users) {
        for (Document user : users.find().projection(new Document("userId", 1)
                .append("email", 1)
                .append("firebaseUid", 1)
                .append("googleId", 1)
                .append("facebookId", 1))) {
            String userId = text(user.get("userId"));
            String email = normalizeEmail(user.get("email"));
            boolean demoProfile = userId.startsWith(DEMO_PROFILE_PREFIX);
            boolean externalIdentity = hasText(user.get("firebaseUid"))
                    || hasText(user.get("googleId"))
                    || hasText(user.get("facebookId"));
            String expected = demoProfile && !externalIdentity
                    ? DevelopmentIdentityEmail.forProfile(userId)
                    : email;
            if (!StringUtils.hasText(expected)) {
                continue;
            }
            if (!expected.equals(text(user.get("email")))) {
                users.updateOne(
                        new Document("_id", user.get("_id")),
                        new Document("$set", new Document("email", expected)));
                LOGGER.info("Normalized stored identity email for user {}.", userId);
            }
        }
    }

    private void requireUniqueNormalizedEmails(MongoCollection<Document> users) {
        Map<String, List<String>> ownersByEmail = new LinkedHashMap<>();
        for (Document user : users.find(new Document("email", new Document("$type", "string")))
                .projection(new Document("userId", 1).append("email", 1))) {
            String email = normalizeEmail(user.get("email"));
            if (StringUtils.hasText(email)) {
                ownersByEmail.computeIfAbsent(email, ignored -> new ArrayList<>())
                        .add(text(user.get("userId")));
            }
        }
        List<String> collisions = ownersByEmail.entrySet().stream()
                .filter(entry -> entry.getValue().size() > 1)
                .map(entry -> entry.getKey() + " -> " + entry.getValue())
                .toList();
        if (!collisions.isEmpty()) {
            throw new IllegalStateException(
                    "Duplicate normalized user email ownership must be resolved before startup: "
                            + String.join("; ", collisions));
        }
    }

    private String normalizeEmail(Object value) {
        return text(value).toLowerCase(Locale.ROOT);
    }

    private boolean hasText(Object value) {
        return StringUtils.hasText(text(value));
    }

    private String text(Object value) {
        return value == null ? "" : value.toString().trim();
    }
}
