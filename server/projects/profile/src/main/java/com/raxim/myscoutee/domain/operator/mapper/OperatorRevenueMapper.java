package com.raxim.myscoutee.domain.operator.mapper;

import com.raxim.myscoutee.domain.operator.service.OperatorRevenueService;
import com.raxim.myscoutee.domain.operator.service.OperatorRevenueSnapshot;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.operator.dto.OperatorRevenueDtos.OperatorRevenueAssetCategoryDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorRevenueDtos.OperatorRevenueCurrencyDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorRevenueDtos.OperatorRevenueDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorRevenueDtos.OperatorRevenueTimelinePointDto;

@Component
public class OperatorRevenueMapper {
    public OperatorRevenueDto toDto(OperatorRevenueSnapshot snapshot) {
        List<OperatorRevenueCurrencyDto> currencies = snapshot.currencies().stream()
                .map(this::toCurrencyDto)
                .toList();
        return new OperatorRevenueDto(
                snapshot.generatedAt().toString(),
                OperatorRevenueService.RULESET_VERSION,
                OperatorRevenueService.COMMISSION_RATE_BASIS_POINTS,
                currencies);
    }

    private OperatorRevenueCurrencyDto toCurrencyDto(
            OperatorRevenueSnapshot.CurrencySnapshot currency) {
        return new OperatorRevenueCurrencyDto(
                currency.currencyCode(),
                currency.fractionDigits(),
                currency.payableEvents(),
                currency.payableAssets(),
                currency.projectedEventMinor(),
                currency.projectedAssetMinor(),
                currency.capturedPaymentMinor(),
                currency.refundedPaymentMinor(),
                currency.netPaymentMinor(),
                currency.commissionBasisMinor(),
                currency.estimatedCommissionMinor(),
                currency.paymentCount(),
                currency.payingUsers(),
                currency.eventBuyers(),
                currency.assetBorrowers(),
                currency.assetCategories().stream()
                        .map(this::toAssetCategoryDto)
                        .toList(),
                currency.timeline().stream()
                        .map(this::toTimelinePointDto)
                        .toList());
    }

    private OperatorRevenueAssetCategoryDto toAssetCategoryDto(
            OperatorRevenueSnapshot.AssetCategorySnapshot category) {
        String key = normalizeCategoryKey(category.key());
        boolean known = switch (key) {
            case "accommodation", "transport", "supplies" -> true;
            default -> false;
        };
        return new OperatorRevenueAssetCategoryDto(
                key,
                known ? "operator.revenue.category." + key : null,
                known ? null : category.label(),
                switch (key) {
                    case "accommodation" -> "hotel";
                    case "transport" -> "directions_car";
                    case "supplies" -> "inventory_2";
                    default -> "category";
                },
                switch (key) {
                    case "accommodation" -> "gold";
                    case "transport" -> "blue";
                    case "supplies" -> "green";
                    default -> "slate";
                },
                category.payableAssets(),
                category.projectedMinor());
    }

    private OperatorRevenueTimelinePointDto toTimelinePointDto(
            OperatorRevenueSnapshot.TimelinePointSnapshot point) {
        return new OperatorRevenueTimelinePointDto(
                point.dateKey(),
                point.dateKey(),
                point.payableEvents(),
                point.payableAssets(),
                point.projectedEventMinor(),
                point.projectedAssetMinor(),
                point.capturedPaymentMinor(),
                point.refundedPaymentMinor(),
                point.netPaymentMinor(),
                point.commissionBasisMinor(),
                point.estimatedCommissionMinor(),
                point.paymentCount(),
                point.payingUsers());
    }

    private String normalizeCategoryKey(String value) {
        String normalized = value == null
                ? ""
                : value.trim().toLowerCase(Locale.ROOT)
                        .replaceAll("[^a-z0-9]+", "-")
                        .replaceAll("(^-+|-+$)", "");
        return StringUtils.hasText(normalized) ? normalized : "asset";
    }
}
