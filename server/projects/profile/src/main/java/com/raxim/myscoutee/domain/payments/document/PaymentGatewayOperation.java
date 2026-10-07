package com.raxim.myscoutee.domain.payments.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "payment_gateway_operations")
public class PaymentGatewayOperation {
    @Id
    private String id;
    @Version
    private Long version;
    @Indexed(name = "payment_gateway_operation_key", unique = true)
    private String operationKey;
    @Indexed(name = "payment_gateway_operation_status")
    private String status;
    private String operationType;
    private String paymentId;
    private String amount;
    private Integer attempts;
    private String nextAttemptAtIso;
    private String lockedAtIso;
    private String completedAtIso;
    private String lastError;
    private String createdAtIso;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    public String getOperationKey() { return operationKey; }
    public void setOperationKey(String operationKey) { this.operationKey = operationKey; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getOperationType() { return operationType; }
    public void setOperationType(String operationType) { this.operationType = operationType; }
    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
    public String getAmount() { return amount; }
    public void setAmount(String amount) { this.amount = amount; }
    public Integer getAttempts() { return attempts; }
    public void setAttempts(Integer attempts) { this.attempts = attempts; }
    public String getNextAttemptAtIso() { return nextAttemptAtIso; }
    public void setNextAttemptAtIso(String nextAttemptAtIso) { this.nextAttemptAtIso = nextAttemptAtIso; }
    public String getLockedAtIso() { return lockedAtIso; }
    public void setLockedAtIso(String lockedAtIso) { this.lockedAtIso = lockedAtIso; }
    public String getCompletedAtIso() { return completedAtIso; }
    public void setCompletedAtIso(String completedAtIso) { this.completedAtIso = completedAtIso; }
    public String getLastError() { return lastError; }
    public void setLastError(String lastError) { this.lastError = lastError; }
    public String getCreatedAtIso() { return createdAtIso; }
    public void setCreatedAtIso(String createdAtIso) { this.createdAtIso = createdAtIso; }
}
