package com.raxim.myscoutee.domain.payments.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "paymentMethodRegistrations")
@CompoundIndex(name = "payment_method_registration_user_created", def = "{'userId': 1, 'createdAtIso': -1}")
public class PaymentMethodRegistration {
    @Id
    private String id;
    @Version
    private Long version;
    private String userId;
    private String provider;
    private String status;
    private String gatewayRegistrationId;
    private String gatewayPaymentUrl;
    private String replacesPaymentMethodId;
    private String completedPaymentMethodId;
    private String createdAtIso;
    private String updatedAtIso;
    private String expiresAtIso;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getGatewayRegistrationId() { return gatewayRegistrationId; }
    public void setGatewayRegistrationId(String gatewayRegistrationId) { this.gatewayRegistrationId = gatewayRegistrationId; }
    public String getGatewayPaymentUrl() { return gatewayPaymentUrl; }
    public void setGatewayPaymentUrl(String gatewayPaymentUrl) { this.gatewayPaymentUrl = gatewayPaymentUrl; }
    public String getReplacesPaymentMethodId() { return replacesPaymentMethodId; }
    public void setReplacesPaymentMethodId(String replacesPaymentMethodId) { this.replacesPaymentMethodId = replacesPaymentMethodId; }
    public String getCompletedPaymentMethodId() { return completedPaymentMethodId; }
    public void setCompletedPaymentMethodId(String completedPaymentMethodId) { this.completedPaymentMethodId = completedPaymentMethodId; }
    public String getCreatedAtIso() { return createdAtIso; }
    public void setCreatedAtIso(String createdAtIso) { this.createdAtIso = createdAtIso; }
    public String getUpdatedAtIso() { return updatedAtIso; }
    public void setUpdatedAtIso(String updatedAtIso) { this.updatedAtIso = updatedAtIso; }
    public String getExpiresAtIso() { return expiresAtIso; }
    public void setExpiresAtIso(String expiresAtIso) { this.expiresAtIso = expiresAtIso; }
}
