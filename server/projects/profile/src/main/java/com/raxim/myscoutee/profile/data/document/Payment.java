package com.raxim.myscoutee.profile.data.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
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
    @CompoundIndex(name = "payment_recipient_created", def = "{'recipientUserId': 1, 'createdDate': -1}"),
    @CompoundIndex(name = "payment_user_source_booking", def = "{'userId': 1, 'sourceId': 1, 'bookingStatus': 1, 'createdDate': -1}"),
    @CompoundIndex(name = "payment_revision_root", def = "{'revisionRootSessionId': 1, 'revisionNumber': -1, 'createdDate': -1}"),
    @CompoundIndex(
            name = "payment_revenue_period_scan",
            def = "{'status': 1, 'provider': 1, 'auditKind': 1, 'createdDate': 1, '_id': 1}")
})
public class Payment {
    @Id
    private String id;
    @Version
    private Long version;
    private String affiliateOwnerUserId;
    private boolean affiliateAttributionResolved;
    @Indexed(name = "payment_affiliate_pending", partialFilter = "{'affiliateRevenuePending':true}")
    private boolean affiliateRevenuePending;
    public String getAffiliateOwnerUserId() { return affiliateOwnerUserId; }
    public void setAffiliateOwnerUserId(String value) { affiliateOwnerUserId = value; }
    public boolean isAffiliateAttributionResolved() { return affiliateAttributionResolved; }
    public void setAffiliateAttributionResolved(boolean value) { affiliateAttributionResolved = value; }
    public boolean isAffiliateRevenuePending() { return affiliateRevenuePending; }
    public void setAffiliateRevenuePending(boolean value) { affiliateRevenuePending = value; }
    private String userId;
    private String recipientUserId;
    private String sourceId;
    private String paymentMethodId;
    private String provider;
    private String status;
    private Double amount;
    private String currency;
    @Indexed(name = "payment_checkout_session", unique = true, sparse = true)
    private String checkoutSessionId;
    @Indexed(name = "payment_gateway_session", unique = true, sparse = true)
    private String gatewaySessionId;
    @Indexed(name = "payment_gateway_authorization", unique = true, sparse = true)
    private String gatewayAuthorizationId;
    private String gatewayStatus;
    private String gatewayActionUrl;
    private String gatewayRefundId;
    private String gatewayRefundStatus;
    private String authorizationExpiresAtIso;
    private String capturedAtIso;
    private String releasedAtIso;
    private String failedAtIso;
    private String fulfillmentStatus;
    private String fulfillmentKind;
    private String contextEventId;
    private String contextSubEventId;
    private String lastGatewayError;
    private String predecessorPaymentId;
    private String successorPaymentId;
    private String slotSourceId;
    private String bookingStartAtIso;
    private String bookingEndAtIso;
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
    private String refundRequestStatus;
    private String refundRequestedAtIso;
    private String refundRequestedByUserId;
    private String refundReviewedAtIso;
    private String refundReviewedByUserId;
    private PricingCancellationPolicyDto cancellationPolicy;
    private String auditKind;
    private String revisionRootSessionId;
    private String supersedesPaymentId;
    private Integer revisionNumber;
    private Double adjustmentAmount;
    private Integer bookingQuantity;
    private Double accountedSpentAmount;
    private String gatewayApprovedAtIso;
    private List<String> processedGatewayEventIds = new ArrayList<>();
    private String createdDate;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getRecipientUserId() { return recipientUserId; }
    public void setRecipientUserId(String recipientUserId) { this.recipientUserId = recipientUserId; }

    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }

    public String getPaymentMethodId() { return paymentMethodId; }
    public void setPaymentMethodId(String paymentMethodId) { this.paymentMethodId = paymentMethodId; }

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

    public String getGatewayAuthorizationId() { return gatewayAuthorizationId; }
    public void setGatewayAuthorizationId(String gatewayAuthorizationId) { this.gatewayAuthorizationId = gatewayAuthorizationId; }

    public String getGatewayStatus() { return gatewayStatus; }
    public void setGatewayStatus(String gatewayStatus) { this.gatewayStatus = gatewayStatus; }

    public String getGatewayActionUrl() { return gatewayActionUrl; }
    public void setGatewayActionUrl(String gatewayActionUrl) { this.gatewayActionUrl = gatewayActionUrl; }

    public String getGatewayRefundId() { return gatewayRefundId; }
    public void setGatewayRefundId(String gatewayRefundId) { this.gatewayRefundId = gatewayRefundId; }

    public String getGatewayRefundStatus() { return gatewayRefundStatus; }
    public void setGatewayRefundStatus(String gatewayRefundStatus) { this.gatewayRefundStatus = gatewayRefundStatus; }

    public String getAuthorizationExpiresAtIso() { return authorizationExpiresAtIso; }
    public void setAuthorizationExpiresAtIso(String authorizationExpiresAtIso) { this.authorizationExpiresAtIso = authorizationExpiresAtIso; }

    public String getCapturedAtIso() { return capturedAtIso; }
    public void setCapturedAtIso(String capturedAtIso) { this.capturedAtIso = capturedAtIso; }

    public String getReleasedAtIso() { return releasedAtIso; }
    public void setReleasedAtIso(String releasedAtIso) { this.releasedAtIso = releasedAtIso; }

    public String getFailedAtIso() { return failedAtIso; }
    public void setFailedAtIso(String failedAtIso) { this.failedAtIso = failedAtIso; }

    public String getFulfillmentStatus() { return fulfillmentStatus; }
    public void setFulfillmentStatus(String fulfillmentStatus) { this.fulfillmentStatus = fulfillmentStatus; }

    public String getFulfillmentKind() { return fulfillmentKind; }
    public void setFulfillmentKind(String fulfillmentKind) { this.fulfillmentKind = fulfillmentKind; }

    public String getContextEventId() { return contextEventId; }
    public void setContextEventId(String contextEventId) { this.contextEventId = contextEventId; }

    public String getContextSubEventId() { return contextSubEventId; }
    public void setContextSubEventId(String contextSubEventId) { this.contextSubEventId = contextSubEventId; }

    public String getLastGatewayError() { return lastGatewayError; }
    public void setLastGatewayError(String lastGatewayError) { this.lastGatewayError = lastGatewayError; }

    public String getPredecessorPaymentId() { return predecessorPaymentId; }
    public void setPredecessorPaymentId(String predecessorPaymentId) { this.predecessorPaymentId = predecessorPaymentId; }

    public String getSuccessorPaymentId() { return successorPaymentId; }
    public void setSuccessorPaymentId(String successorPaymentId) { this.successorPaymentId = successorPaymentId; }

    public String getSlotSourceId() { return slotSourceId; }
    public void setSlotSourceId(String slotSourceId) { this.slotSourceId = slotSourceId; }

    public String getBookingStartAtIso() { return bookingStartAtIso; }
    public void setBookingStartAtIso(String bookingStartAtIso) { this.bookingStartAtIso = bookingStartAtIso; }

    public String getBookingEndAtIso() { return bookingEndAtIso; }
    public void setBookingEndAtIso(String bookingEndAtIso) { this.bookingEndAtIso = bookingEndAtIso; }

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

    public String getRefundRequestStatus() { return refundRequestStatus; }
    public void setRefundRequestStatus(String refundRequestStatus) { this.refundRequestStatus = refundRequestStatus; }

    public String getRefundRequestedAtIso() { return refundRequestedAtIso; }
    public void setRefundRequestedAtIso(String refundRequestedAtIso) { this.refundRequestedAtIso = refundRequestedAtIso; }

    public String getRefundRequestedByUserId() { return refundRequestedByUserId; }
    public void setRefundRequestedByUserId(String refundRequestedByUserId) { this.refundRequestedByUserId = refundRequestedByUserId; }

    public String getRefundReviewedAtIso() { return refundReviewedAtIso; }
    public void setRefundReviewedAtIso(String refundReviewedAtIso) { this.refundReviewedAtIso = refundReviewedAtIso; }

    public String getRefundReviewedByUserId() { return refundReviewedByUserId; }
    public void setRefundReviewedByUserId(String refundReviewedByUserId) { this.refundReviewedByUserId = refundReviewedByUserId; }

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

    public Double getAccountedSpentAmount() { return accountedSpentAmount; }
    public void setAccountedSpentAmount(Double accountedSpentAmount) { this.accountedSpentAmount = accountedSpentAmount; }

    public String getGatewayApprovedAtIso() { return gatewayApprovedAtIso; }
    public void setGatewayApprovedAtIso(String gatewayApprovedAtIso) { this.gatewayApprovedAtIso = gatewayApprovedAtIso; }

    public List<String> getProcessedGatewayEventIds() { return processedGatewayEventIds; }
    public void setProcessedGatewayEventIds(List<String> processedGatewayEventIds) {
        this.processedGatewayEventIds = processedGatewayEventIds == null
                ? new ArrayList<>()
                : new ArrayList<>(processedGatewayEventIds);
    }

    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }
}
