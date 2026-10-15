package com.raxim.myscoutee.domain.accounts.service;

import java.util.Optional;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.accounts.api.AccountMediaSessions;
import com.raxim.myscoutee.domain.accounts.document.UserSessionState;

@Service
public class AccountMediaSessionService implements AccountMediaSessions {
    private final MongoTemplate mongo;
    private final com.raxim.myscoutee.domain.accounts.repository.UsersRepository users;
    private final CommunityGroupProfilesService profiles;
    public AccountMediaSessionService(MongoTemplate mongo,
            com.raxim.myscoutee.domain.accounts.repository.UsersRepository users, CommunityGroupProfilesService profiles) {
        this.mongo = mongo; this.users = users; this.profiles = profiles;
    }
    @Override
    public Optional<String> authenticateMediaToken(String userId, String tokenHash) {
        if (!mongo.exists(Query.query(Criteria.where("_id").is(userId)
                .and("activeSessions").elemMatch(Criteria.where("mediaTokenHash").is(tokenHash))), UserSessionState.class)) return Optional.empty();
        var account = users.findByUserId(userId).orElse(null);
        return account == null ? Optional.empty() : Optional.of(profiles.current(account).getUserId());
    }
    @Override
    public Optional<MediaToken> mediaToken(String userId, String sessionId) {
        UserSessionState state = mongo.findOne(session(userId, sessionId), UserSessionState.class);
        if (state == null) return Optional.empty();
        return state.getActiveSessions().stream().filter(s -> sessionId.equals(s.getSessionId()))
                .findFirst().map(s -> new MediaToken(s.getMediaTokenHash()));
    }
    @Override
    public boolean replaceMediaToken(String userId, String sessionId, String tokenHash) {
        return mongo.updateFirst(session(userId, sessionId), new Update().set("activeSessions.$.mediaTokenHash", tokenHash),
                UserSessionState.class).getMatchedCount() == 1;
    }
    private Query session(String userId, String sessionId) {
        Query query = Query.query(Criteria.where("_id").is(userId).and("activeSessions.sessionId").is(sessionId));
        query.fields().include("activeSessions");
        return query;
    }
}
