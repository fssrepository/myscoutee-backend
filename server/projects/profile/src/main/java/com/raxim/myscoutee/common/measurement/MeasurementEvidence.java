package com.raxim.myscoutee.common.measurement;
/** Raw persisted action fields; operator validation remains authoritative. */
public record MeasurementEvidence(String userId, String actionType, String occurredAt, String sourceId) {
    public static final java.util.Comparator<MeasurementEvidence> ORDER =
        java.util.Comparator.comparing(MeasurementEvidence::userId, java.util.Comparator.nullsFirst(String::compareTo))
            .thenComparing(MeasurementEvidence::occurredAt, java.util.Comparator.nullsFirst(String::compareTo))
            .thenComparing(MeasurementEvidence::actionType, java.util.Comparator.nullsFirst(String::compareTo))
            .thenComparing(MeasurementEvidence::sourceId, java.util.Comparator.nullsFirst(String::compareTo));
}
