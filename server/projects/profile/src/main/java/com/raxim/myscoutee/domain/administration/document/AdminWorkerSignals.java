package com.raxim.myscoutee.domain.administration.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/** Database-scoped invalidation revisions, owned exclusively by administration. */
@Document("adminWorkerSignals")
public record AdminWorkerSignals(@Id String id, Long derivedRevision, Long queuesRevision) {}
