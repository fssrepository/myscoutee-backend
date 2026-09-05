package com.raxim.myscoutee.profile.data.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "savedPaymentMethods")
@CompoundIndexes({
    @CompoundIndex(name = "saved_payment_method_user_status_created", def = "{'userId': 1, 'status': 1, 'createdAtIso': -1}"),
    @CompoundIndex(name = "saved_payment_method_expiry_scan", def = "{'status': 1, 'expiryKey': 1, 'expiredNotifiedAtIso': 1}"),
    @CompoundIndex(name = "saved_payment_method_user_art_status", def = "{'userId': 1, 'artworkKey': 1, 'status': 1}")
})
public class SavedPaymentMethod {
    @Id
    private String id;
    @Version
    private Long version;
    private String userId;
    private String provider;
    private String providerPaymentMethodRef;
    @Indexed(name = "saved_payment_method_registration", unique = true, sparse = true)
    private String registrationId;
    private String brand;
    private String last4;
    private Integer expiryMonth;
    private Integer expiryYear;
    private Integer expiryKey;
    private String cardholderName;
    private String artworkKey;
    private String status;
    private String replacesPaymentMethodId;
    private String replacedByPaymentMethodId;
    private String createdAtIso;
    private String updatedAtIso;
    private String expiredNotifiedAtIso;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getProviderPaymentMethodRef() { return providerPaymentMethodRef; }
    public void setProviderPaymentMethodRef(String providerPaymentMethodRef) { this.providerPaymentMethodRef = providerPaymentMethodRef; }
    public String getRegistrationId() { return registrationId; }
    public void setRegistrationId(String registrationId) { this.registrationId = registrationId; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getLast4() { return last4; }
    public void setLast4(String last4) { this.last4 = last4; }
    public Integer getExpiryMonth() { return expiryMonth; }
    public void setExpiryMonth(Integer expiryMonth) { this.expiryMonth = expiryMonth; }
    public Integer getExpiryYear() { return expiryYear; }
    public void setExpiryYear(Integer expiryYear) { this.expiryYear = expiryYear; }
    public Integer getExpiryKey() { return expiryKey; }
    public void setExpiryKey(Integer expiryKey) { this.expiryKey = expiryKey; }
    public String getCardholderName() { return cardholderName; }
    public void setCardholderName(String cardholderName) { this.cardholderName = cardholderName; }
    public String getArtworkKey() { return artworkKey; }
    public void setArtworkKey(String artworkKey) { this.artworkKey = artworkKey; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getReplacesPaymentMethodId() { return replacesPaymentMethodId; }
    public void setReplacesPaymentMethodId(String replacesPaymentMethodId) { this.replacesPaymentMethodId = replacesPaymentMethodId; }
    public String getReplacedByPaymentMethodId() { return replacedByPaymentMethodId; }
    public void setReplacedByPaymentMethodId(String replacedByPaymentMethodId) { this.replacedByPaymentMethodId = replacedByPaymentMethodId; }
    public String getCreatedAtIso() { return createdAtIso; }
    public void setCreatedAtIso(String createdAtIso) { this.createdAtIso = createdAtIso; }
    public String getUpdatedAtIso() { return updatedAtIso; }
    public void setUpdatedAtIso(String updatedAtIso) { this.updatedAtIso = updatedAtIso; }
    public String getExpiredNotifiedAtIso() { return expiredNotifiedAtIso; }
    public void setExpiredNotifiedAtIso(String expiredNotifiedAtIso) { this.expiredNotifiedAtIso = expiredNotifiedAtIso; }
}
