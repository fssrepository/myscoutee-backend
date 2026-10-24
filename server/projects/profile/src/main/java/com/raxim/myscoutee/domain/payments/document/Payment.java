package com.raxim.myscoutee.domain.payments.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutLineItemDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutBasketItemDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutPricingSummaryRowDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingCancellationPolicyDto;

@Document(collection = "payments")
@CompoundIndexes({
    @CompoundIndex(name = "payment_cancellation_pending", def = "{'auditKind': 1, 'refundRequestedTargetAmount': 1}"),
    @CompoundIndex(name = "payment_euro_pending", def = "{'euroCheckedAt': 1}", partialFilter = "{'euro': null, 'auditKind': 'payment', 'accountedSpentAmount': {'$gt': 0}}"),
    @CompoundIndex(name = "payment_user_source", def = "{'userId': 1, 'sourceId': 1, 'createdDate': -1}"),
    @CompoundIndex(name = "payment_recipient_created", def = "{'recipientUserId': 1, 'createdDate': -1}"),
    @CompoundIndex(name = "payment_user_source_booking", def = "{'userId': 1, 'sourceId': 1, 'bookingStatus': 1, 'createdDate': -1}"),
    @CompoundIndex(name = "payment_revision_root", def = "{'revisionRootSessionId': 1, 'revisionNumber': -1, 'createdDate': -1}"),
    @CompoundIndex(
            name = "payment_revenue_period_scan",
            def = "{'status': 1, 'provider': 1, 'auditKind': 1, 'createdDate': 1, '_id': 1}")
})
@lombok.Getter @lombok.Setter
public class Payment implements com.raxim.myscoutee.domain.payments.api.PaymentView {
    @Id
    private String id;
    @Version
    private Long version;
    private com.raxim.myscoutee.domain.payments.dto.ExchangeRateDtos.Snapshot euro;
    @Indexed(name = "payment_affiliate_owner")
    private String affiliateOwnerUserId;
    private boolean affiliateAttributionResolved;
    @Indexed(name = "payment_affiliate_pending", partialFilter = "{'affiliateRevenuePending':true}")
    private boolean affiliateRevenuePending;
    private String receiptNote;
    private String receiptPayerName;
    private String receiptRecipientName;
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
    // Durable refund intent: the target is cumulative, the gateway amount is only the unpaid remainder.
    private String gatewayRefundOperationKey;
    private Double gatewayRefundAmount;
    private Double gatewayRefundTargetAmount;
    private boolean eventChangeRefundEligible;
    private Double refundRequestedTargetAmount;
    private String cancellationRequestedBy;
    private String cancellationReason;
    private String cancellationSessionMode;
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

    public void setOptionalSubEventIds(List<String> optionalSubEventIds) {
        this.optionalSubEventIds = optionalSubEventIds == null ? new ArrayList<>() : new ArrayList<>(optionalSubEventIds);
    }

    public void setAcceptedPolicyIds(List<String> acceptedPolicyIds) {
        this.acceptedPolicyIds = acceptedPolicyIds == null ? new ArrayList<>() : new ArrayList<>(acceptedPolicyIds);
    }

    public void setBasketItems(List<EventCheckoutBasketItemDto> basketItems) {
        this.basketItems = basketItems == null ? new ArrayList<>() : new ArrayList<>(basketItems);
    }

    public void setPricingSummaryRows(List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows) {
        this.pricingSummaryRows = pricingSummaryRows == null ? new ArrayList<>() : new ArrayList<>(pricingSummaryRows);
    }

    public void setLineItems(List<EventCheckoutLineItemDto> lineItems) {
        this.lineItems = lineItems == null ? new ArrayList<>() : new ArrayList<>(lineItems);
    }

    public void setAppliedPromoCodes(List<String> appliedPromoCodes) {
        this.appliedPromoCodes = appliedPromoCodes == null ? new ArrayList<>() : new ArrayList<>(appliedPromoCodes);
    }

    public void setProcessedGatewayEventIds(List<String> processedGatewayEventIds) {
        this.processedGatewayEventIds = processedGatewayEventIds == null
                ? new ArrayList<>()
                : new ArrayList<>(processedGatewayEventIds);
    }

}
