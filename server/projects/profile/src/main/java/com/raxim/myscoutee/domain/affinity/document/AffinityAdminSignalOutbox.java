package com.raxim.myscoutee.domain.affinity.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.raxim.myscoutee.common.config.mongo.AdminProjectionSignalOutbox;

@Document("affinityAdminSignalOutbox")
public record AffinityAdminSignalOutbox(@Id String id, Long derivedRevision, Long queuesRevision,
        Long deliveredDerivedRevision, Long deliveredQueuesRevision) implements AdminProjectionSignalOutbox.State {}
