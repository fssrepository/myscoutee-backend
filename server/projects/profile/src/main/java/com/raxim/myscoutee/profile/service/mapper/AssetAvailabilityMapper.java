package com.raxim.myscoutee.profile.service.mapper;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.Asset.AssetRequestBookingRecord;
import com.raxim.myscoutee.profile.data.document.AssetRequest;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetOccupancyPageDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetOccupancyRowDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetOccupancyStatDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetOccupancyStatsPageDto;

@Component
public class AssetAvailabilityMapper {
    private static final DateTimeFormatter SCHEDULE_DATE = DateTimeFormatter.ofPattern("MMM d", Locale.US);
    private static final DateTimeFormatter SCHEDULE_TIME = DateTimeFormatter.ofPattern("h:mm a", Locale.US);

    public AssetOccupancyPageDto toOccupancyPage(
            String ownerUserId,
            String assetId,
            List<AssetRequest> requests,
            String dateIso,
            String filter,
            String order,
            Integer page,
            Integer pageSize,
            String cursor) {
        String normalizedOwnerUserId = normalizeId(ownerUserId);
        String normalizedAssetId = normalizeId(assetId);
        DateRange dateRange = availabilityDateRange(dateIso);
        String normalizedFilter = normalizeFilter(filter);
        String normalizedOrder = normalizeOrder(order);
        List<AssetRequest> source = safeRequests(requests);
        List<AssetRequest> rows = source.stream()
                .filter(request -> matchesOrder(request, normalizedOrder))
                .filter(request -> matchesFilter(request, normalizedFilter))
                .filter(request -> dateRange == null || requestOverlaps(request, dateRange.start(), dateRange.end()))
                .sorted((left, right) -> compareRequests(left, right, normalizedOrder))
                .toList();
        List<AssetOccupancyRowDto> mapped = rows.stream()
                .map(request -> toOccupancyRowDto(normalizedOwnerUserId, normalizedAssetId, source, request, dateRange))
                .toList();
        PageSlice<AssetOccupancyRowDto> slice = slice(mapped, page, pageSize, cursor);
        return new AssetOccupancyPageDto(slice.items(), mapped.size(), slice.nextCursor());
    }

    public AssetOccupancyStatsPageDto toStatsPage(
            String ownerUserId,
            String assetId,
            List<AssetRequest> requests,
            String rangeStart,
            String rangeEnd,
            String filter,
            String order,
            Integer page,
            Integer pageSize,
            String cursor) {
        String normalizedOwnerUserId = normalizeId(ownerUserId);
        String normalizedAssetId = normalizeId(assetId);
        String normalizedFilter = normalizeFilter(filter);
        String normalizedOrder = normalizeOrder(order);
        List<AssetRequest> source = safeRequests(requests).stream()
                .filter(request -> matchesOrder(request, normalizedOrder))
                .filter(request -> matchesFilter(request, normalizedFilter))
                .toList();
        DateRange range = statsRange(rangeStart, rangeEnd);
        List<AssetOccupancyStatDto> stats = new ArrayList<>();
        LocalDate day = range.start();
        while (!day.isAfter(range.end())) {
            stats.add(toOccupancyStatDto(normalizedOwnerUserId, normalizedAssetId, source, day));
            day = day.plusDays(1);
        }
        if ("earlier".equals(normalizedOrder)) {
            Collections.reverse(stats);
        }
        PageSlice<AssetOccupancyStatDto> slice = slice(stats, page, pageSize, cursor);
        return new AssetOccupancyStatsPageDto(slice.items(), stats.size(), slice.nextCursor());
    }

    private AssetOccupancyStatDto toOccupancyStatDto(
            String ownerUserId,
            String assetId,
            List<AssetRequest> requests,
            LocalDate date) {
        LocalDate nextDay = date.plusDays(1);
        List<AssetRequest> overlapping = requests.stream()
                .filter(request -> requestOverlaps(request, date, nextDay))
                .toList();
        int occupied = overlapping.stream()
                .filter(this::isCommittedRequest)
                .mapToInt(this::requestQuantity)
                .sum();
        List<AssetRequest> pending = overlapping.stream()
                .filter(this::isPendingRequest)
                .toList();
        int pendingQuantity = pending.stream().mapToInt(this::requestQuantity).sum();
        String dateIso = date.toString();
        return new AssetOccupancyStatDto(
                assetId + ":" + dateIso,
                assetId,
                ownerUserId,
                dateIso,
                date.atStartOfDay().toString(),
                nextDay.atStartOfDay().toString(),
                occupied,
                assetCapacity(requests),
                pending.size(),
                pendingQuantity,
                overlapping.size());
    }

    private AssetOccupancyRowDto toOccupancyRowDto(
            String ownerUserId,
            String assetId,
            List<AssetRequest> requests,
            AssetRequest request,
            DateRange dateRange) {
        DateRange requestRange = requestDateRange(request);
        List<AssetRequest> committed = requests.stream()
                .filter(this::isCommittedRequest)
                .filter(other -> dateRange == null
                        ? requestsOverlap(request, other)
                        : requestOverlaps(other, dateRange.start(), dateRange.end()))
                .toList();
        List<AssetRequest> pending = requests.stream()
                .filter(this::isPendingRequest)
                .filter(other -> dateRange == null
                        ? requestsOverlap(request, other)
                        : requestOverlaps(other, dateRange.start(), dateRange.end()))
                .toList();
        int occupied = committed.stream().mapToInt(this::requestQuantity).sum();
        int pendingCurrentQuantity = isCommittedRequest(request) ? 0 : requestQuantity(request);
        int capacity = assetCapacity(request);
        AssetRequestBookingRecord booking = request == null ? null : request.booking();
        return new AssetOccupancyRowDto(
                normalizeId(request == null ? null : request.id()),
                normalizeId(request == null ? assetId : request.assetId()),
                normalizeId(request == null ? ownerUserId : request.ownerUserId()),
                requestRange == null ? "" : requestRange.start().toString(),
                safeNullableText(booking == null ? null : booking.startAtIso()),
                safeNullableText(booking == null ? null : booking.endAtIso()),
                safeText(request == null ? null : request.name()),
                joinedSubtitle(booking),
                visibleNote(request),
                scheduleLabel(request),
                safeNullableText(request == null ? null : request.initials()),
                null,
                normalizeGender(request == null ? null : request.gender()),
                isManualRequest(request) ? "assigned" : normalizeStatus(request == null ? null : request.status()),
                normalizeRequestKind(request == null ? null : request.requestKind()),
                requestQuantity(request),
                occupied,
                capacity,
                capacity - occupied - pendingCurrentQuantity,
                pending.size(),
                pending.stream().mapToInt(this::requestQuantity).sum(),
                safeNullableText(booking == null ? null : booking.eventId()),
                safeNullableText(booking == null ? null : booking.eventTitle()),
                safeNullableText(booking == null ? null : booking.subEventId()),
                safeNullableText(booking == null ? null : booking.subEventTitle()),
                safeNullableText(booking == null ? null : booking.startAtIso()),
                safeNullableText(booking == null ? null : booking.endAtIso()),
                menuActions(request));
    }

    private String joinedSubtitle(AssetRequestBookingRecord booking) {
        if (booking == null) {
            return null;
        }
        String eventTitle = safeText(booking.eventTitle());
        String subEventTitle = safeText(booking.subEventTitle());
        if (StringUtils.hasText(eventTitle) && StringUtils.hasText(subEventTitle)) {
            return eventTitle + " · " + subEventTitle;
        }
        return StringUtils.hasText(eventTitle) ? eventTitle : safeNullableText(subEventTitle);
    }

    private String visibleNote(AssetRequest request) {
        String note = safeText(request == null ? null : request.note());
        if (!StringUtils.hasText(note) || isSystemNote(note)) {
            return null;
        }
        return note;
    }

    private boolean isSystemNote(String note) {
        return "Awaiting owner confirmation.".equals(note)
                || "Approved and synced with the plan.".equals(note)
                || "Reserved and assigned by the owner.".equals(note)
                || "Borrow request approved by the owner.".equals(note)
                || "Promoted to asset manager.".equals(note);
    }

    private String scheduleLabel(AssetRequest request) {
        AssetRequestBookingRecord booking = request == null ? null : request.booking();
        LocalDateTime start = parseDateTime(booking == null ? null : booking.startAtIso());
        LocalDateTime end = parseDateTime(booking == null ? null : booking.endAtIso());
        if (start != null && end != null) {
            return formatRange(start, end);
        }
        String timeframe = safeText(booking == null ? null : booking.timeframe());
        if (StringUtils.hasText(timeframe)) {
            return timeframe;
        }
        return safeNullableText(booking == null ? null : booking.slotLabel());
    }

    private String formatRange(LocalDateTime start, LocalDateTime end) {
        boolean sameDay = start.toLocalDate().equals(end.toLocalDate());
        if (sameDay) {
            return SCHEDULE_DATE.format(start) + " " + SCHEDULE_TIME.format(start) + " - " + SCHEDULE_TIME.format(end);
        }
        return SCHEDULE_DATE.format(start) + " " + SCHEDULE_TIME.format(start)
                + " - " + SCHEDULE_DATE.format(end) + " " + SCHEDULE_TIME.format(end);
    }

    private List<String> menuActions(AssetRequest request) {
        if (isPendingRequest(request)) {
            return List.of("accept", "remove");
        }
        AssetRequestBookingRecord booking = request == null ? null : request.booking();
        if (isManualRequest(request)
                && StringUtils.hasText(safeText(booking == null ? null : booking.eventId()))
                && StringUtils.hasText(safeText(booking == null ? null : booking.subEventId()))) {
            return List.of("manage");
        }
        if (!isManualRequest(request) && "accepted".equals(normalizeStatus(request == null ? null : request.status()))) {
            return List.of("makeManager");
        }
        return List.of();
    }

    private boolean matchesFilter(AssetRequest request, String filter) {
        if ("pending-requests".equals(filter)) {
            return isPendingRequest(request);
        }
        if ("borrowed-items".equals(filter)) {
            return "accepted".equals(normalizeStatus(request == null ? null : request.status())) && !isManualRequest(request);
        }
        if ("active-items".equals(filter)) {
            return isCommittedRequest(request);
        }
        return true;
    }

    private boolean matchesOrder(AssetRequest request, String order) {
        LocalDateTime end = requestEndTime(request);
        if (end == null) {
            return false;
        }
        boolean finished = end.isBefore(LocalDateTime.now(ZoneOffset.UTC));
        return "earlier".equals(order) ? finished : !finished;
    }

    private int compareRequests(AssetRequest left, AssetRequest right, String order) {
        int direction = "earlier".equals(order) ? -1 : 1;
        int day = direction * Long.compare(daySortTime(left), daySortTime(right));
        if (day != 0) {
            return day;
        }
        int time = direction * Long.compare(sortTime(left), sortTime(right));
        if (time != 0) {
            return time;
        }
        int bucket = Integer.compare(bucketOrder(left), bucketOrder(right));
        if (bucket != 0) {
            return bucket;
        }
        return normalizeId(left == null ? null : left.id()).compareTo(normalizeId(right == null ? null : right.id()));
    }

    private int bucketOrder(AssetRequest request) {
        if (isPendingRequest(request)) {
            return 0;
        }
        if ("accepted".equals(normalizeStatus(request == null ? null : request.status())) && !isManualRequest(request)) {
            return 1;
        }
        return 2;
    }

    private long sortTime(AssetRequest request) {
        AssetRequestBookingRecord booking = request == null ? null : request.booking();
        LocalDateTime value = parseDateTime(booking == null
                ? request == null ? null : request.requestedAtIso()
                : firstNonBlank(booking.startAtIso(), request == null ? null : request.requestedAtIso()));
        if (value != null) {
            return value.toInstant(ZoneOffset.UTC).toEpochMilli();
        }
        DateRange range = requestDateRange(request);
        return range == null ? 0L : range.start().atStartOfDay().toInstant(ZoneOffset.UTC).toEpochMilli();
    }

    private long daySortTime(AssetRequest request) {
        DateRange range = requestDateRange(request);
        LocalDate value = range == null ? parseDate(request == null ? null : request.requestedAtIso()) : range.start();
        return value == null ? 0L : value.atStartOfDay().toInstant(ZoneOffset.UTC).toEpochMilli();
    }

    private LocalDateTime requestEndTime(AssetRequest request) {
        AssetRequestBookingRecord booking = request == null ? null : request.booking();
        LocalDateTime start = parseDateTime(booking == null
                ? request == null ? null : request.requestedAtIso()
                : firstNonBlank(booking.startAtIso(), request == null ? null : request.requestedAtIso()));
        if (start == null) {
            return null;
        }
        LocalDateTime end = parseDateTime(booking == null ? null : booking.endAtIso());
        return end != null && end.isAfter(start) ? end : start.plusDays(1);
    }

    private boolean requestsOverlap(AssetRequest left, AssetRequest right) {
        if (normalizeId(left == null ? null : left.id()).equals(normalizeId(right == null ? null : right.id()))) {
            return true;
        }
        DateRange leftRange = requestDateRange(left);
        DateRange rightRange = requestDateRange(right);
        if (leftRange != null && rightRange != null) {
            return leftRange.start().isBefore(rightRange.end()) && rightRange.start().isBefore(leftRange.end());
        }
        String leftWindow = requestWindowKey(left);
        String rightWindow = requestWindowKey(right);
        return StringUtils.hasText(leftWindow) && leftWindow.equals(rightWindow);
    }

    private boolean requestOverlaps(AssetRequest request, LocalDate start, LocalDate end) {
        DateRange range = requestDateRange(request);
        return range != null && range.start().isBefore(end) && start.isBefore(range.end());
    }

    private DateRange requestDateRange(AssetRequest request) {
        AssetRequestBookingRecord booking = request == null ? null : request.booking();
        LocalDate start = parseDate(booking == null ? null : firstNonBlank(booking.startAtIso(), request.requestedAtIso()));
        if (start == null) {
            return null;
        }
        LocalDate parsedEnd = parseDate(booking == null ? null : booking.endAtIso());
        LocalDate end = parsedEnd != null && parsedEnd.isAfter(start) ? parsedEnd : start.plusDays(1);
        return new DateRange(start, end);
    }

    private String requestWindowKey(AssetRequest request) {
        AssetRequestBookingRecord booking = request == null ? null : request.booking();
        return List.of(
                        safeText(booking == null ? null : booking.eventId()),
                        safeText(booking == null ? null : booking.subEventId()),
                        safeText(booking == null ? null : booking.slotLabel()),
                        safeText(booking == null ? null : booking.timeframe()))
                .stream()
                .filter(StringUtils::hasText)
                .reduce((left, right) -> left + "|" + right)
                .orElse("");
    }

    private DateRange availabilityDateRange(String dateIso) {
        LocalDate parsed = parseDateOnly(dateIso);
        return parsed == null ? null : new DateRange(parsed, parsed.plusDays(1));
    }

    private DateRange statsRange(String rangeStart, String rangeEnd) {
        LocalDate fallback = LocalDate.now(ZoneOffset.UTC);
        LocalDate start = parseDateOnly(rangeStart);
        if (start == null) {
            start = fallback.withDayOfMonth(1);
        }
        LocalDate end = parseDateOnly(rangeEnd);
        if (end == null) {
            end = start.withDayOfMonth(start.lengthOfMonth());
        }
        if (end.isBefore(start)) {
            return new DateRange(end, start);
        }
        return new DateRange(start, end);
    }

    private LocalDate parseDateOnly(String value) {
        String normalized = safeText(value);
        if (!StringUtils.hasText(normalized)) {
            return null;
        }
        try {
            return LocalDate.parse(normalized.length() >= 10 ? normalized.substring(0, 10) : normalized);
        } catch (DateTimeParseException ex) {
            return null;
        }
    }

    private LocalDate parseDate(String value) {
        LocalDate localDate = parseDateOnly(value);
        if (localDate != null) {
            return localDate;
        }
        LocalDateTime localDateTime = parseDateTime(value);
        return localDateTime == null ? null : localDateTime.toLocalDate();
    }

    private LocalDateTime parseDateTime(String value) {
        String normalized = safeText(value);
        if (!StringUtils.hasText(normalized)) {
            return null;
        }
        try {
            return LocalDateTime.parse(normalized.replace("/", "-"));
        } catch (DateTimeParseException ignored) {
            try {
                return LocalDateTime.ofInstant(Instant.parse(normalized), ZoneOffset.UTC);
            } catch (DateTimeParseException ignoredAgain) {
                LocalDate date = parseDateOnly(normalized);
                return date == null ? null : date.atStartOfDay();
            }
        }
    }

    private int assetCapacity(List<AssetRequest> requests) {
        return safeRequests(requests).stream()
                .map(AssetRequest::assetCapacity)
                .mapToInt(value -> normalizeCount(value, 0))
                .filter(value -> value > 0)
                .findFirst()
                .orElse(0);
    }

    private int assetCapacity(AssetRequest request) {
        return Math.max(0, normalizeCount(request == null ? null : request.assetCapacity(), 0));
    }

    private int requestQuantity(AssetRequest request) {
        AssetRequestBookingRecord booking = request == null ? null : request.booking();
        return Math.max(1, normalizeCount(booking == null ? null : booking.quantity(), 1));
    }

    private boolean isCommittedRequest(AssetRequest request) {
        return "accepted".equals(normalizeStatus(request == null ? null : request.status())) || isManualRequest(request);
    }

    private boolean isPendingRequest(AssetRequest request) {
        return "pending".equals(normalizeStatus(request == null ? null : request.status())) && !isManualRequest(request);
    }

    private boolean isManualRequest(AssetRequest request) {
        return "manual".equals(normalizeRequestKind(request == null ? null : request.requestKind()));
    }

    private String normalizeFilter(String filter) {
        String normalized = safeText(filter);
        if ("active-items".equals(normalized) || "pending-requests".equals(normalized) || "borrowed-items".equals(normalized)) {
            return normalized;
        }
        return "all";
    }

    private String normalizeOrder(String order) {
        return "earlier".equals(safeText(order)) ? "earlier" : "later";
    }

    private String normalizeStatus(String value) {
        String normalized = safeText(value);
        return "accepted".equals(normalized) ? "accepted" : "pending";
    }

    private String normalizeRequestKind(String value) {
        return "manual".equals(safeText(value)) ? "manual" : "borrow";
    }

    private String normalizeGender(String value) {
        String normalized = safeText(value);
        return "man".equals(normalized) ? "man" : "woman";
    }

    private int normalizeCount(Integer value, int fallback) {
        return value == null ? fallback : value.intValue();
    }

    private List<AssetRequest> safeRequests(List<AssetRequest> requests) {
        return requests == null ? List.of() : requests;
    }

    private <T> PageSlice<T> slice(List<T> items, Integer page, Integer pageSize, String cursor) {
        List<T> source = items == null ? List.of() : items;
        int size = Math.max(1, Math.min(120, pageSize == null ? 20 : pageSize.intValue()));
        int cursorIndex = parseCursor(cursor);
        int normalizedPage = Math.max(0, page == null ? 0 : page.intValue());
        int start = cursorIndex >= 0 ? cursorIndex : normalizedPage * size;
        start = Math.min(Math.max(0, start), source.size());
        int end = Math.min(source.size(), start + size);
        String nextCursor = end < source.size() ? String.valueOf(end) : null;
        return new PageSlice<>(source.subList(start, end), nextCursor);
    }

    private int parseCursor(String cursor) {
        try {
            return Integer.parseInt(safeText(cursor));
        } catch (NumberFormatException ex) {
            return -1;
        }
    }

    private String firstNonBlank(String left, String right) {
        return StringUtils.hasText(safeText(left)) ? safeText(left) : safeText(right);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String safeNullableText(String value) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : null;
    }

    private String normalizeId(String value) {
        return safeText(value);
    }

    private record DateRange(LocalDate start, LocalDate end) {
    }

    private record PageSlice<T>(List<T> items, String nextCursor) {
    }
}
