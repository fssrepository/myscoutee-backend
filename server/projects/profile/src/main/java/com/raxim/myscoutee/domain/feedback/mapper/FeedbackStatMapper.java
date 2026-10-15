package com.raxim.myscoutee.domain.feedback.mapper;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackStatDto;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackStatOptionDto;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.FeedbackStatSectionDto;

@Component
public class FeedbackStatMapper {
    public record FeedbackStatRecord(
            String eventId,
            String viewerUserId,
            String submittedAtIso,
            String updatedAtIso,
            String overallValue,
            String improveValue,
            List<String> personalityTraitIds) {
    }

    public FeedbackStatDto toDto(String eventId, List<FeedbackStatRecord> records) {
        String normalizedEventId = normalizeId(eventId);
        List<FeedbackStatRecord> safeRecords = records == null ? List.of() : records.stream()
                .filter(Objects::nonNull)
                .filter(record -> Objects.equals(normalizedEventId, normalizeId(record.eventId())))
                .toList();
        int totalResponses = safeRecords.size();
        return new FeedbackStatDto(
                normalizedEventId,
                totalResponses,
                List.of(
                        toSection(
                                "overall",
                                totalResponses,
                                safeRecords.stream().map(FeedbackStatRecord::overallValue).toList()),
                        toSection(
                                "improve",
                                totalResponses,
                                safeRecords.stream().map(FeedbackStatRecord::improveValue).toList()),
                        toSection(
                                "traits",
                                totalResponses,
                                safeRecords.stream().flatMap(record -> safeList(record.personalityTraitIds()).stream()).toList())));
    }

    private FeedbackStatSectionDto toSection(
            String key,
            int responseCount,
            List<String> values) {
        return new FeedbackStatSectionDto(
                safeText(key),
                Math.max(0, responseCount),
                countOptions(values));
    }

    private List<FeedbackStatOptionDto> countOptions(List<String> values) {
        Map<String, Integer> countByKey = new LinkedHashMap<>();
        for (String value : safeList(values)) {
            String normalizedValue = safeText(value);
            if (!StringUtils.hasText(normalizedValue)) {
                continue;
            }
            countByKey.put(normalizedValue, countByKey.getOrDefault(normalizedValue, 0) + 1);
        }
        return countByKey.entrySet().stream()
                .map(entry -> new FeedbackStatOptionDto(entry.getKey(), Math.max(0, entry.getValue())))
                .filter(option -> StringUtils.hasText(option.key()) && option.count() > 0)
                .sorted(Comparator
                        .comparing(FeedbackStatOptionDto::count, Comparator.reverseOrder())
                        .thenComparing(FeedbackStatOptionDto::key))
                .toList();
    }

    private static List<String> safeList(List<String> values) {
        return values == null ? List.of() : values;
    }

    private static String normalizeId(String value) {
        return safeText(value);
    }

    private static String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
