package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;

import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingCancellationPolicyDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingCancellationRuleDto;

final class PaymentRefundCalculator {
    private PaymentRefundCalculator() {}

    static Preview preview(Payment payment, String requestedAtIso) {
        double paid = money(payment == null ? null : payment.getAmount());
        String currency = text(payment == null ? null : payment.getCurrency(), "USD").toUpperCase();
        if (paid <= 0) {
            return new Preview(0D, 0D, currency, "none", null, null, null, null, null,
                    "This payment has no refundable amount.");
        }
        PricingCancellationPolicyDto policy = payment.getCancellationPolicy();
        LocalDateTime bookingStart = dateTime(payment.getBookingStartAtIso());
        LocalDateTime requestedAt = dateTime(requestedAtIso);
        if (policy == null || !Boolean.TRUE.equals(policy.enabled()) || bookingStart == null || requestedAt == null) {
            return new Preview(paid, 0D, currency, "not_eligible", null, null, null, null, null,
                    "No cancellation refund policy applies to this payment.");
        }
        PricingCancellationRuleDto rule = eligibleRule(policy.rules(), bookingStart, requestedAt);
        if (rule == null) {
            return new Preview(paid, 0D, currency, "not_eligible", null, null, null, null, null,
                    "The refund request is outside the configured refund windows.");
        }
        double refundable = switch (text(rule.refundKind(), "percent")) {
            case "full" -> paid;
            case "fixed_amount" -> Math.min(paid, money(rule.refundValue()));
            case "none" -> 0D;
            default -> money(paid * Math.max(0D, Math.min(100D, money(rule.refundValue()))) / 100D);
        };
        String status = refundable <= 0 ? "not_eligible" : refundable >= paid ? "full" : "partial";
        return new Preview(
                paid,
                refundable,
                currency,
                status,
                text(rule.id(), null),
                text(rule.offsetUnit(), "days"),
                Math.max(0, rule.offsetValue() == null ? 0 : rule.offsetValue()),
                text(rule.refundKind(), "percent"),
                rule.refundValue(),
                describe(rule));
    }

    static Preview storedOrCurrentPreview(Payment payment, String nowIso) {
        String requestStatus = text(payment == null ? null : payment.getRefundRequestStatus(), "none");
        String paymentStatus = text(payment == null ? null : payment.getStatus(), "").toLowerCase(Locale.ROOT);
        boolean finalizedRefund = List.of("released", "refunded", "partially_refunded").contains(paymentStatus)
                && payment.getRefundedAmount() != null
                && money(payment.getRefundedAmount()) > 0;
        if ((("pending".equals(requestStatus) || "approved".equals(requestStatus)) || finalizedRefund)
                && payment.getRefundedAmount() != null) {
            double paid = money(payment.getAmount());
            double refundable = Math.min(paid, money(payment.getRefundedAmount()));
            String status = refundable <= 0 ? "not_eligible" : refundable >= paid ? "full" : "partial";
            PricingCancellationRuleDto storedRule = ruleById(
                    payment.getCancellationPolicy() == null ? null : payment.getCancellationPolicy().rules(),
                    payment.getRefundRuleId());
            return new Preview(
                    paid,
                    refundable,
                    text(payment.getRefundCurrency(), text(payment.getCurrency(), "USD")).toUpperCase(),
                    status,
                    text(payment.getRefundRuleId(), null),
                    storedRule == null ? null : text(storedRule.offsetUnit(), "days"),
                    storedRule == null ? null : Math.max(0, storedRule.offsetValue() == null ? 0 : storedRule.offsetValue()),
                    storedRule == null ? null : text(storedRule.refundKind(), "percent"),
                    storedRule == null ? null : storedRule.refundValue(),
                    text(payment.getRefundNote(), "The recorded refund amount was returned to the payer."));
        }
        return preview(payment, nowIso);
    }

    private static PricingCancellationRuleDto eligibleRule(
            List<PricingCancellationRuleDto> rules,
            LocalDateTime bookingStart,
            LocalDateTime requestedAt) {
        if (rules == null) return null;
        PricingCancellationRuleDto best = null;
        LocalDateTime bestDeadline = null;
        for (PricingCancellationRuleDto rule : rules) {
            if (rule == null) continue;
            int offset = Math.max(0, rule.offsetValue() == null ? 0 : rule.offsetValue());
            LocalDateTime deadline = switch (text(rule.offsetUnit(), "days")) {
                case "hours" -> bookingStart.minusHours(offset);
                case "weeks" -> bookingStart.minusWeeks(offset);
                case "months" -> bookingStart.minusMonths(offset);
                default -> bookingStart.minusDays(offset);
            };
            if (requestedAt.isAfter(deadline)) continue;
            if (best == null || deadline.isBefore(bestDeadline)) {
                best = rule;
                bestDeadline = deadline;
            }
        }
        return best;
    }

    private static PricingCancellationRuleDto ruleById(List<PricingCancellationRuleDto> rules, String ruleId) {
        if (rules == null || ruleId == null || ruleId.isBlank()) return null;
        return rules.stream()
                .filter(rule -> rule != null && ruleId.trim().equals(text(rule.id(), null)))
                .findFirst()
                .orElse(null);
    }

    private static String describe(PricingCancellationRuleDto rule) {
        int offset = Math.max(0, rule.offsetValue() == null ? 0 : rule.offsetValue());
        String window = offset + " " + text(rule.offsetUnit(), "days") + " before start";
        return switch (text(rule.refundKind(), "percent")) {
            case "full" -> "Full refund when requested at least " + window + ".";
            case "fixed_amount" -> "Refund " + money(rule.refundValue()) + " when requested at least " + window + ".";
            case "none" -> "No refund under the " + window + " rule.";
            default -> "Refund " + money(rule.refundValue()) + "% when requested at least " + window + ".";
        };
    }

    private static LocalDateTime dateTime(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            return LocalDateTime.parse(value.trim());
        } catch (DateTimeParseException ignored) {
        }
        try {
            return Instant.parse(value.trim()).atOffset(ZoneOffset.UTC).toLocalDateTime();
        } catch (DateTimeParseException ignored) {
            return null;
        }
    }

    private static double money(Double value) {
        return money(value == null ? 0D : value.doubleValue());
    }

    private static double money(double value) {
        return Math.round(Math.max(0D, value) * 100D) / 100D;
    }

    private static String text(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }

    record Preview(
            double paidAmount,
            double refundableAmount,
            String currency,
            String status,
            String ruleId,
            String ruleOffsetUnit,
            Integer ruleOffsetValue,
            String refundKind,
            Double refundValue,
            String ruleDescription) {
        double retainedAmount() {
            return money(paidAmount - refundableAmount);
        }
    }
}
