package com.raxim.myscoutee.domain.payments.service;
import java.util.*;
import java.util.function.Function;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import com.raxim.myscoutee.common.mongo.OwnerScopedQuery;
import com.raxim.myscoutee.domain.accounts.api.AccountJobScopes;
import com.raxim.myscoutee.domain.platform.api.JobAudience;
@Service
public class PaymentJobQueries {
    private final MongoTemplate mongo;
    private final AccountJobScopes owners;
    private final JobAudience audience;
    public PaymentJobQueries(MongoTemplate mongo, AccountJobScopes owners, JobAudience audience) {
        this.mongo = mongo; this.owners = owners; this.audience = audience;
    }
    <T> List<T> find(Query query, Class<T> type, Function<T, String> ownerId) {
        var scope = audience.workspaceScope();
        return OwnerScopedQuery.find(mongo, query, type, ownerId, ids -> owners.matchingOwners(ids, scope));
    }
}
