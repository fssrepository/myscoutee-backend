package com.raxim.myscoutee.profile.data.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutLineItemDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutBasketItemDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutPricingSummaryRowDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingCancellationPolicyDto;

@Document(collection = "payments")
@CompoundIndexes({
    @CompoundIndex(name = "payment_user_source", def = "{'userId': 1, 'sourceId': 1, 'createdDate': -1}"),
    @CompoundIndex(name = "payment_user_source_booking", def = "{'userId': 1, 'sourceId': 1, 'bookingStatus': 1, 'createdDate': -1}"),
    @CompoundIndex(name = "payment_revision_root", def = "{'revisionRootSessionId': 1, 'revisionNumber': -1, 'createdDate': -1}")
})
public class Payment {
    @Id
    private String id;
    private String userId;
    private String sourceId;
    private String provider;
    private String status;
    private Double amount;
    private String currency;
    @Indexed(name = "payment_checkout_session", unique = true, sparse = true)
    private String checkoutSessionId;
    @Indexed(name = "payment_gateway_session", unique = true, sparse = true)
    private String gatewaySessionId;
    private String slotSourceId;
    private String bookingStartAtIso;
    private List<String> optionalSubEventIds = new ArrayList<>();
    private List<String> acceptedPolicyIds = new ArrayList<>();
    private List<EventCheckoutBasketItemDto> basketItems = new ArrayList<>();
    private List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows = new ArrayList<>();
    private List<EventCheckoutLineItemDto> lineItems = new ArrayList<>();
    private List<String> appliedPromoCodes = new ArrayList<>();
    private String bookingStatus;
    private String joinedAtIso;
    private String cancelledAtIso;
    private String refundedAtIso;
    private String refundStatus;
    private Double refundedAmount;
    private String refundCurrency;
    private String refundRuleId;
    private String refundNote;
    private PricingCancellationPolicyDto cancellationPolicy;
    private String auditKind;
    private String revisionRootSessionId;
    private String supersedesPaymentId;
    private Integer revisionNumber;
    private Double adjustmentAmount;
    private Integer bookingQuantity;
    private String createdDate;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getCheckoutSessionId() { return checkoutSessionId; }
    public void setCheckoutSessionId(String checkoutSessionId) { this.checkoutSessionId = checkoutSessionId; }

    public String getGatewaySessionId() { return gatewaySessionId; }
    public void setGatewaySessionId(String gatewaySessionId) { this.gatewaySessionId = gatewaySessionId; }

    public String getSlotSourceId() { return slotSourceId; }
    public void setSlotSourceId(String slotSourceId) { this.slotSourceId = slotSourceId; }

    public String getBookingStartAtIso() { return bookingStartAtIso; }
    public void setBookingStartAtIso(String bookingStartAtIso) { this.bookingStartAtIso = bookingStartAtIso; }

    public List<String> getOptionalSubEventIds() { return optionalSubEventIds; }
    public void setOptionalSubEventIds(List<String> optionalSubEventIds) {
        this.optionalSubEventIds = optionalSubEventIds == null ? new ArrayList<>() : new ArrayList<>(optionalSubEventIds);
    }

    public List<String> getAcceptedPolicyIds() { return acceptedPolicyIds; }
    public void setAcceptedPolicyIds(List<String> acceptedPolicyIds) {
        this.acceptedPolicyIds = acceptedPolicyIds == null ? new ArrayList<>() : new ArrayList<>(acceptedPolicyIds);
    }

    public List<EventCheckoutBasketItemDto> getBasketItems() { return basketItems; }
    public void setBasketItems(List<EventCheckoutBasketItemDto> basketItems) {
        this.basketItems = basketItems == null ? new ArrayList<>() : new ArrayList<>(basketItems);
    }

    public List<EventCheckoutPricingSummaryRowDto> getPricingSummaryRows() { return pricingSummaryRows; }
    public void setPricingSummaryRows(List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows) {
        this.pricingSummaryRows = pricingSummaryRows == null ? new ArrayList<>() : new ArrayList<>(pricingSummaryRows);
    }

    public List<EventCheckoutLineItemDto> getLineItems() { return lineItems; }
    public void setLineItems(List<EventCheckoutLineItemDto> lineItems) {
        this.lineItems = lineItems == null ? new ArrayList<>() : new ArrayList<>(lineItems);
    }

    public List<String> getAppliedPromoCodes() { return appliedPromoCodes; }
    public void setAppliedPromoCodes(List<String> appliedPromoCodes) {
        this.appliedPromoCodes = appliedPromoCodes == null ? new ArrayList<>() : new ArrayList<>(appliedPromoCodes);
    }

    public String getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }

    public String getJoinedAtIso() { return joinedAtIso; }
    public void setJoinedAtIso(String joinedAtIso) { this.joinedAtIso = joinedAtIso; }

    public String getCancelledAtIso() { return cancelledAtIso; }
    public void setCancelledAtIso(String cancelledAtIso) { this.cancelledAtIso = cancelledAtIso; }

    public String getRefundedAtIso() { return refundedAtIso; }
    public void setRefundedAtIso(String refundedAtIso) { this.refundedAtIso = refundedAtIso; }

    public String getRefundStatus() { return refundStatus; }
    public void setRefundStatus(String refundStatus) { this.refundStatus = refundStatus; }

    public Double getRefundedAmount() { return refundedAmount; }
    public void setRefundedAmount(Double refundedAmount) { this.refundedAmount = refundedAmount; }

    public String getRefundCurrency() { return refundCurrency; }
    public void setRefundCurrency(String refundCurrency) { this.refundCurrency = refundCurrency; }

    public String getRefundRuleId() { return refundRuleId; }
    public void setRefundRuleId(String refundRuleId) { this.refundRuleId = refundRuleId; }

    public String getRefundNote() { return refundNote; }
    public void setRefundNote(String refundNote) { this.refundNote = refundNote; }

    public PricingCancellationPolicyDto getCancellationPolicy() { return cancellationPolicy; }
    public void setCancellationPolicy(PricingCancellationPolicyDto cancellationPolicy) { this.cancellationPolicy = cancellationPolicy; }

    public String getAuditKind() { return auditKind; }
    public void setAuditKind(String auditKind) { this.auditKind = auditKind; }

    public String getRevisionRootSessionId() { return revisionRootSessionId; }
    public void setRevisionRootSessionId(String revisionRootSessionId) { this.revisionRootSessionId = revisionRootSessionId; }

    public String getSupersedesPaymentId() { return supersedesPaymentId; }
    public void setSupersedesPaymentId(String supersedesPaymentId) { this.supersedesPaymentId = supersedesPaymentId; }

    public Integer getRevisionNumber() { return revisionNumber; }
    public void setRevisionNumber(Integer revisionNumber) { this.revisionNumber = revisionNumber; }

    public Double getAdjustmentAmount() { return adjustmentAmount; }
    public void setAdjustmentAmount(Double adjustmentAmount) { this.adjustmentAmount = adjustmentAmount; }

    public Integer getBookingQuantity() { return bookingQuantity; }
    public void setBookingQuantity(Integer bookingQuantity) { this.bookingQuantity = bookingQuantity; }

    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }
}
