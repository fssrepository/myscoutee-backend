package com.raxim.myscoutee.domain.operator.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;

/**
 * Durable, append-only client-side journal for signed daily revenue reports.
 *
 * <p>A period/revision row is never rewritten with different accounting
 * content. Delivery attempts may refresh their timestamp, nonce, and
 * signature, while the logical idempotency key and payload remain stable.</p>
 */
@Document(collection = "revenueReportOutbox")
@CompoundIndexes({
        @CompoundIndex(
                name = "revenue_outbox_deployment_period_revision",
                def = "{'deploymentId': 1, 'period': 1, 'revision': 1}",
                unique = true),
        @CompoundIndex(
                name = "revenue_outbox_delivery",
                def = "{'deploymentId': 1, 'status': 1, 'nextRetryAt': 1, 'period': 1, 'revision': 1}")
})
@lombok.Getter @lombok.Setter
public class RevenueReportOutboxItem extends RegistryOutboxIdentity {
    public static final int SCHEMA_VERSION = 1;

    public RevenueReportOutboxItem() { super(SCHEMA_VERSION); }

    private String period;
    private Long revision;
    private String supersedesBatchId;
    private String kind;
    private String rulesetVersion;
    private Integer commissionRateBasisPoints;
    private List<RegistryProtocol.RevenueCurrencyRow> currencies =
            new ArrayList<>();
    private String aggregateHash;
    private String payloadHash;
    @Indexed(name = "revenue_outbox_idempotency", unique = true)
    private String idempotencyKey;
    private String status;
    private Integer attemptCount;
    private String nextRetryAt;
    private SignedAttempt lastAttempt;
    private Failure lastFailure;
    private RegistryProtocol.RevenueBatchResponse acceptedResponse;
    private String acceptedAt;
    private String createdAt;
    private String updatedAt;

    public void setCurrencies(
            List<RegistryProtocol.RevenueCurrencyRow> currencies) {
        this.currencies = currencies == null
                ? new ArrayList<>()
                : new ArrayList<>(currencies);
    }

    public void setAcceptedResponse(
            RegistryProtocol.RevenueBatchResponse acceptedResponse) {
        this.acceptedResponse = acceptedResponse;
    }

    @lombok.Getter @lombok.Setter
    public static class SignedAttempt {
        private String timestamp;
        private String nonce;
        private String signature;
        private String persistedAt;

    }

    @lombok.Getter @lombok.Setter
    public static class Failure {
        private String code;
        private String message;
        private String at;
        private Boolean retryable;

    }
}
