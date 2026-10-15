package com.raxim.myscoutee.domain.events.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.raxim.myscoutee.common.config.mongo.AdminProjectionSignalOutbox;

@Document("eventAdminSignalOutbox")
public record EventAdminSignalOutbox(@Id String id, Long derivedRevision, Long queuesRevision,
        Long deliveredDerivedRevision, Long deliveredQueuesRevision) implements AdminProjectionSignalOutbox.State {}
