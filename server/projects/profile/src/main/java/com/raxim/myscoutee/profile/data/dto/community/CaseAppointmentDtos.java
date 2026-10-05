package com.raxim.myscoutee.profile.data.dto.community;
import java.util.List;
import com.raxim.myscoutee.profile.data.document.ServiceProviderCalendar.Appointment;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSlotsResultDto;
public final class CaseAppointmentDtos {
    private CaseAppointmentDtos() {}
    public record CalendarEntry(Appointment appointment, String caseTitle, String serviceTitle, String customerName,
            String caseId, com.raxim.myscoutee.profile.data.document.ServiceCase.BoardTask task) {}
    public record Cancel(String userId, String providerAccountId) {}
    public record Selection(String userId, String serviceId, String providerAccountId, List<String> slotIds, Long version, String operationId) {}
    public record Slots(EventCheckoutSlotsResultDto result, Long version, List<Appointment> appointments, com.raxim.myscoutee.profile.data.document.ServiceOffering service) {}
    public record Saved(Long version, List<Appointment> appointments) {}
}
