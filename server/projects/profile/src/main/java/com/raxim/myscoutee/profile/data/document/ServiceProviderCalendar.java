package com.raxim.myscoutee.profile.data.document;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutPricingSummaryRowDto;
/** One optimistic-lock owner serializes reservations across this provider's services and cases. */
@Document("serviceProviderCalendars")
public record ServiceProviderCalendar(@Id String id, List<Appointment> appointments, String lastOperationId,
        String lastOperationSignature, @Version Long version) {
    public record Appointment(String id, String caseId, String serviceId, String providerAccountId, String customerAccountId,
            String slotId, String slotTemplateId, String startAtIso, String endAtIso, String status,
            double amount, String currency, List<EventCheckoutPricingSummaryRowDto> pricingSummaryRows,
            String createdAtIso, String updatedAtIso) {}
}
