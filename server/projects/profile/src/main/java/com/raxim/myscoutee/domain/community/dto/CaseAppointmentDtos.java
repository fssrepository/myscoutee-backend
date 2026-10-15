package com.raxim.myscoutee.domain.community.dto;
import com.raxim.myscoutee.domain.community.dto.CaseDetails;
import java.util.List;
import com.raxim.myscoutee.domain.community.document.ServiceProviderCalendar.Appointment;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutSlotsResultDto;
public final class CaseAppointmentDtos {
    private CaseAppointmentDtos() {}
    public record CalendarEntry(Appointment appointment, String caseTitle, String serviceTitle, String customerName,
            String caseId, com.raxim.myscoutee.domain.community.dto.CaseDetails.BoardTask task, String caseType, String caseStatus) {}
    public record Cancel(String userId, String providerAccountId) {}
    public record Selection(String userId, String serviceId, String providerAccountId, List<String> slotIds, Long version, String operationId) {}
    public record Slots(EventCheckoutSlotsResultDto result, Long version, List<Appointment> appointments, com.raxim.myscoutee.domain.community.document.ServiceOffering service) {}
    public record Saved(Long version, List<Appointment> appointments) {}
}
