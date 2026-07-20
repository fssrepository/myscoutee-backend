package com.raxim.myscoutee.profile.data.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutPricingSummaryRowDto;

@Document(collection = "eventCheckoutBasketItems")
@CompoundIndexes({
        @CompoundIndex(name = "checkout_basket_user_source_status", def = "{'userId': 1, 'sourceId': 1, 'status': 1, 'resultState': 1, 'updatedAtIso': -1}"),
        @CompoundIndex(name = "checkout_basket_user_source_item", def = "{'userId': 1, 'sourceId': 1, 'itemId': 1}", unique = true, sparse = true),
        @CompoundIndex(name = "checkout_basket_expiry_status", def = "{'expiresAtIso': 1, 'status': 1}")
})
public class EventCheckoutBasketItem {
    @Id
    private String id;

    @Indexed(name = "checkout_basket_item_id", sparse = true)
    private String itemId;

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
    private List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows = new ArrayList<>();
    private List<String> appliedPromoCodes = new ArrayList<>();
    private String checkoutSessionId;
    private String createdAtIso;
    private String updatedAtIso;
    private String expiresAtIso;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }

    public String getKind() { return kind; }
    public void setKind(String kind) { this.kind = kind; }

    public String getSlotSourceId() { return slotSourceId; }
    public void setSlotSourceId(String slotSourceId) { this.slotSourceId = slotSourceId; }

    public String getSlotTemplateId() { return slotTemplateId; }
    public void setSlotTemplateId(String slotTemplateId) { this.slotTemplateId = slotTemplateId; }

    public String getSelectedDateKey() { return selectedDateKey; }
    public void setSelectedDateKey(String selectedDateKey) { this.selectedDateKey = selectedDateKey; }

    public String getSubEventId() { return subEventId; }
    public void setSubEventId(String subEventId) { this.subEventId = subEventId; }

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getResultState() { return resultState; }
    public void setResultState(String resultState) { this.resultState = resultState; }

    public List<EventCheckoutPricingSummaryRowDto> getPricingSummaryRows() { return pricingSummaryRows; }
    public void setPricingSummaryRows(List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows) {
        this.pricingSummaryRows = pricingSummaryRows == null ? new ArrayList<>() : new ArrayList<>(pricingSummaryRows);
    }

    public List<String> getAppliedPromoCodes() { return appliedPromoCodes; }
    public void setAppliedPromoCodes(List<String> appliedPromoCodes) {
        this.appliedPromoCodes = appliedPromoCodes == null ? new ArrayList<>() : new ArrayList<>(appliedPromoCodes);
    }

    public String getCheckoutSessionId() { return checkoutSessionId; }
    public void setCheckoutSessionId(String checkoutSessionId) { this.checkoutSessionId = checkoutSessionId; }

    public String getCreatedAtIso() { return createdAtIso; }
    public void setCreatedAtIso(String createdAtIso) { this.createdAtIso = createdAtIso; }

    public String getUpdatedAtIso() { return updatedAtIso; }
    public void setUpdatedAtIso(String updatedAtIso) { this.updatedAtIso = updatedAtIso; }

    public String getExpiresAtIso() { return expiresAtIso; }
    public void setExpiresAtIso(String expiresAtIso) { this.expiresAtIso = expiresAtIso; }
}
