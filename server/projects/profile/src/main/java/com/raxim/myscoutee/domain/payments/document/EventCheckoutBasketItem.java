package com.raxim.myscoutee.domain.payments.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutPricingSummaryRowDto;

@Document(collection = "eventCheckoutBasketItems")
@CompoundIndexes({
        @CompoundIndex(name = "checkout_basket_user_source_status", def = "{'userId': 1, 'sourceId': 1, 'status': 1, 'updatedAtIso': -1}"),
        @CompoundIndex(name = "checkout_basket_user_source_result_status", def = "{'userId': 1, 'sourceId': 1, 'status': 1, 'resultState': 1, 'updatedAtIso': -1}"),
        @CompoundIndex(name = "checkout_basket_expiry_status", def = "{'expiresAtIso': 1, 'status': 1}")
})
@lombok.Getter @lombok.Setter
public class EventCheckoutBasketItem {
    @Id
    private String id;

    @Indexed(name = "checkout_basket_item_id", sparse = true)
    private String itemId;

    private Boolean reservationActive;

    private String userId;
    private String sourceId;
    private String kind;
    private String slotSourceId;
    private String slotTemplateId;
    private String selectedDateKey;
    private String subEventId;
    private String resourceType;
    private String label;
    private String detail;
    private Double amount;
    private String currency;
    private Integer quantity;
    private String status;
    private String resultState;
    private Boolean pendingCounterTracked;
    private List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows = new ArrayList<>();
    private List<String> appliedPromoCodes = new ArrayList<>();
    private String checkoutSessionId;
    private String createdAtIso;
    private String updatedAtIso;
    private String expiresAtIso;

    public void setPricingSummaryRows(List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows) {
        this.pricingSummaryRows = pricingSummaryRows == null ? new ArrayList<>() : new ArrayList<>(pricingSummaryRows);
    }

    public void setAppliedPromoCodes(List<String> appliedPromoCodes) {
        this.appliedPromoCodes = appliedPromoCodes == null ? new ArrayList<>() : new ArrayList<>(appliedPromoCodes);
    }

}
