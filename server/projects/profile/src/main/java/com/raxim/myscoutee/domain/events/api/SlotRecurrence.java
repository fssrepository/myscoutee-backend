package com.raxim.myscoutee.domain.events.api;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
public interface SlotRecurrence {
    List<LocalDateTime> generateSlotOccurrenceStarts(String frequency, LocalDateTime templateStart, LocalDateTime horizonStart, LocalDateTime horizonEnd);
    LocalDate slotOccurrenceAnchorDateKey(LocalDateTime occurrenceStart, LocalDateTime templateStart, LocalDateTime parentStart);
}
