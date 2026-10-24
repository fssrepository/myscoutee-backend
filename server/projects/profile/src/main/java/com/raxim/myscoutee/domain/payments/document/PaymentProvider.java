package com.raxim.myscoutee.domain.payments.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "paymentProviders")
@CompoundIndexes({
        @CompoundIndex(
                name = "payment_provider_enabled_sort",
                def = "{'enabled': 1, 'sortOrder': 1, 'label': 1, '_id': 1}")
})
@lombok.Getter @lombok.Setter
public class PaymentProvider {
    @Id
    private String id;
    private String label;
    private String logoUrl;
    private String logoAlt;
    private String palette;
    private Boolean enabled;
    private Integer sortOrder;

}
