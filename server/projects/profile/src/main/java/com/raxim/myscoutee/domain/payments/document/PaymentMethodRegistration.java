package com.raxim.myscoutee.domain.payments.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "paymentMethodRegistrations")
@CompoundIndex(name = "payment_method_registration_user_created", def = "{'userId': 1, 'createdAtIso': -1}")
@lombok.Getter @lombok.Setter
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

}
