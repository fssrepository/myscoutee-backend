package com.raxim.myscoutee.domain.payments.document;

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
@lombok.Getter @lombok.Setter
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

}
