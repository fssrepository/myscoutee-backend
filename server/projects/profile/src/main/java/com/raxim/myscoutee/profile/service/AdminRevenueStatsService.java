package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.AdminStatsSnapshot;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.Asset.AssetRequestRecord;
import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventFormItemDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.PaymentsRepository;

@Service
public class AdminRevenueStatsService {
    private static final int TIMELINE_DAYS = 14;
    private static final String STATUS_ACCEPTED = "accepted";
    private static final String REQUEST_KIND_BORROW = "borrow";

    private final ActivityEventsRepository activityEventsRepository;
    private final AssetsRepository assetsRepository;
    private final PaymentsRepository paymentsRepository;

    public AdminRevenueStatsService(
            ActivityEventsRepository activityEventsRepository,
            AssetsRepository assetsRepository,
            PaymentsRepository paymentsRepository) {
        this.activityEventsRepository = activityEventsRepository;
        this.assetsRepository = assetsRepository;
        this.paymentsRepository = paymentsRepository;
    }

    public void refresh(AdminStatsSnapshot snapshot) {
        if (snapshot == null) {
            return;
        }

        Map<String, Long> metrics = new LinkedHashMap<>();
        Map<String, Long> assetCategories = new LinkedHashMap<>();
        Map<String, Map<String, Long>> daily = emptyDailyRevenueActivity();
        Set<String> payingUsers = new java.util.LinkedHashSet<>();
        Set<String> eventSourceIds = new java.util.LinkedHashSet<>();
        Set<String> assetIds = new java.util.LinkedHashSet<>();
        Set<String> eventBuyers = new java.util.LinkedHashSet<>();
        Set<String> assetBorrowers = new java.util.LinkedHashSet<>();

        long payableEvents = 0L;
        long eventUnitCents = 0L;
        long projectedEventCents = 0L;
        for (ActivityEvent event : activityEventsRepository.findAll()) {
            if (!isCanonicalEvent(event)) {
                continue;
            }
            addIfText(eventSourceIds, event.getSourceId());
            long unitCents = eventUnitCents(event);
            if (unitCents <= 0L) {
                continue;
            }
            payableEvents++;
            eventUnitCents += unitCents;
            long capacity = Math.max(1L, safeLong(event.getCapacityTotal()));
            long projected = unitCents * capacity;
            projectedEventCents += projected;
            Map<String, Long> day = daily.computeIfAbsent(dayKey(firstNonBlank(event.getCreatedDate(), event.getUpdatedDate())), ignored -> new LinkedHashMap<>());
            add(day, "payableEvents", 1L);
            add(day, "projectedEventCents", projected);
        }

        long payableAssets = 0L;
        long assetUnitCents = 0L;
        long projectedAssetCents = 0L;
        for (Asset asset : assetsRepository.findAll()) {
            if (asset == null) {
                continue;
            }
            addIfText(assetIds, asset.getAssetId());
            for (AssetRequestRecord request : asset.getRequests() == null ? java.util.List.<AssetRequestRecord>of() : asset.getRequests()) {
                if (isAcceptedBorrowRequest(request)) {
                    addIfText(assetBorrowers, request.userId());
                }
            }
            long unitCents = pricingUnitCents(asset.getPricing());
            if (unitCents <= 0L) {
                continue;
            }
            payableAssets++;
            assetUnitCents += unitCents;
            long quantity = Math.max(1L, safeLong(asset.getQuantity()));
            long projected = unitCents * quantity;
            projectedAssetCents += projected;
            String category = assetRevenueCategory(asset);
            add(assetCategories, category, projected);
            Map<String, Long> day = daily.computeIfAbsent(dayKey(firstNonBlank(asset.getCreatedDate(), asset.getUpdatedDate())), ignored -> new LinkedHashMap<>());
            add(day, "payableAssets", 1L);
            add(day, "projectedAssetCents", projected);
        }

        long actualPayments = 0L;
        long actualPaymentCents = 0L;
        for (Payment payment : paymentsRepository.findAll()) {
            if (!isRevenuePayment(payment)) {
                continue;
            }
            long amountCents = moneyToCents(payment.getAmount()) - moneyToCents(payment.getRefundedAmount());
            if (amountCents <= 0L) {
                continue;
            }
            actualPayments++;
            actualPaymentCents += amountCents;
            String paymentUserId = safeText(payment.getUserId());
            String paymentSourceId = safeText(payment.getSourceId());
            addIfText(payingUsers, paymentUserId);
            if (eventSourceIds.contains(paymentSourceId)) {
                addIfText(eventBuyers, paymentUserId);
            }
            if (assetIds.contains(paymentSourceId)) {
                addIfText(assetBorrowers, paymentUserId);
            }
            Map<String, Long> day = daily.computeIfAbsent(dayKey(firstNonBlank(payment.getJoinedAtIso(), payment.getCreatedDate())), ignored -> new LinkedHashMap<>());
            add(day, "actualPaymentCents", amountCents);
            if (StringUtils.hasText(safeText(payment.getUserId()))) {
                add(day, "payingUsers", 1L);
            }
        }

        metrics.put("payable-events", payableEvents);
        metrics.put("event-unit-cents", eventUnitCents);
        metrics.put("projected-event-cents", projectedEventCents);
        metrics.put("avg-event-ticket-cents", payableEvents == 0L ? 0L : Math.round(eventUnitCents / (double) payableEvents));
        metrics.put("payable-assets", payableAssets);
        metrics.put("asset-unit-cents", assetUnitCents);
        metrics.put("projected-asset-cents", projectedAssetCents);
        metrics.put("avg-asset-price-cents", payableAssets == 0L ? 0L : Math.round(assetUnitCents / (double) payableAssets));
        metrics.put("actual-payments", actualPayments);
        metrics.put("paying-users", (long) payingUsers.size());
        metrics.put("event-buyers", (long) eventBuyers.size());
        metrics.put("asset-borrowers", (long) assetBorrowers.size());
        metrics.put("actual-payment-cents", actualPaymentCents);
        metrics.put("avg-payment-cents", actualPayments == 0L ? 0L : Math.round(actualPaymentCents / (double) actualPayments));

        snapshot.setRevenueMetrics(metrics);
        snapshot.setRevenueAssetCategories(assetCategories);
        snapshot.setDailyRevenueActivity(daily);
    }

    private boolean isCanonicalEvent(ActivityEvent event) {
        return event != null
                && !Boolean.TRUE.equals(event.getGenerated())
                && StringUtils.hasText(safeText(event.getSourceId()));
    }

    private long eventUnitCents(ActivityEvent event) {
        if (event == null || !Boolean.TRUE.equals(event.getTicketing())) {
            return 0L;
        }
        long total = pricingUnitCents(event.getPricing());
        for (SubEventFormItemDto subEvent : event.getSubEvents() == null ? java.util.List.<SubEventFormItemDto>of() : event.getSubEvents()) {
            if (subEvent == null) {
                continue;
            }
            if (Boolean.TRUE.equals(subEvent.optional())) {
                total += pricingUnitCents(subEvent.pricing());
            }
        }
        return total;
    }

    private long pricingUnitCents(PricingConfigDto pricing) {
        if (pricing == null) {
            return 0L;
        }
        long base = moneyToCents(pricing.basePrice());
        long slot = pricing.slotOverrides() == null
                ? 0L
                : pricing.slotOverrides().stream()
                        .mapToLong(item -> moneyToCents(item == null ? null : item.price()))
                        .max()
                        .orElse(0L);
        return Math.max(base, slot);
    }

    private String assetRevenueCategory(Asset asset) {
        if (asset == null) {
            return "Asset";
        }
        String value = firstNonBlank(asset.getType(), firstNonBlank(asset.getCategory(), "Asset"));
        String normalized = safeText(value).toLowerCase(Locale.ROOT);
        if ("car".equals(normalized) || "transport".equals(normalized) || "vehicle".equals(normalized)) {
            return "Car";
        }
        if ("accommodation".equals(normalized) || "lodging".equals(normalized) || "stay".equals(normalized)) {
            return "Accommodation";
        }
        if ("supplies".equals(normalized) || "supply".equals(normalized) || "equipment".equals(normalized) || "gear".equals(normalized)) {
            return "Supplies";
        }
        return value;
    }

    private boolean isRevenuePayment(Payment payment) {
        if (payment == null) {
            return false;
        }
        String bookingStatus = safeText(payment.getBookingStatus()).toLowerCase(Locale.ROOT);
        String refundStatus = safeText(payment.getRefundStatus()).toLowerCase(Locale.ROOT);
        return !"cancelled".equals(bookingStatus) && !"full".equals(refundStatus);
    }

    private boolean isAcceptedBorrowRequest(AssetRequestRecord request) {
        return request != null
                && STATUS_ACCEPTED.equals(safeText(request.status()).toLowerCase(Locale.ROOT))
                && REQUEST_KIND_BORROW.equals(safeText(request.requestKind()).toLowerCase(Locale.ROOT));
    }

    private Map<String, Map<String, Long>> emptyDailyRevenueActivity() {
        Map<String, Map<String, Long>> result = new LinkedHashMap<>();
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        for (int index = 0; index < TIMELINE_DAYS; index++) {
            LocalDate day = today.minusDays(TIMELINE_DAYS - 1L - index);
            result.put(day.format(DateTimeFormatter.ISO_LOCAL_DATE), new LinkedHashMap<>());
        }
        return result;
    }

    private String dayKey(String value) {
        try {
            return Instant.parse(safeText(value)).atZone(ZoneOffset.UTC).toLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE);
        } catch (RuntimeException ignored) {
            return LocalDate.now(ZoneOffset.UTC).format(DateTimeFormatter.ISO_LOCAL_DATE);
        }
    }

    private long moneyToCents(Number value) {
        return value == null ? 0L : Math.max(0L, Math.round(value.doubleValue() * 100d));
    }

    private long safeLong(Number value) {
        return value == null ? 0L : Math.max(0L, value.longValue());
    }

    private void add(Map<String, Long> target, String key, long amount) {
        target.put(key, target.getOrDefault(key, 0L) + amount);
    }

    private void addIfText(Set<String> target, String value) {
        String normalized = safeText(value);
        if (StringUtils.hasText(normalized)) {
            target.add(normalized);
        }
    }

    private String firstNonBlank(String value, String fallback) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : safeText(fallback);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
