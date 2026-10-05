package com.raxim.myscoutee.profile.controller;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.raxim.myscoutee.profile.service.CommunityCasesService;
import com.raxim.myscoutee.profile.service.CaseAppointmentsService;
import com.raxim.myscoutee.profile.data.dto.community.CaseAppointmentDtos.*;
import com.raxim.myscoutee.profile.data.document.ServiceProviderCalendar.Appointment;
@RestController
public class CaseAppointmentsController {
 private final CaseAppointmentsService appointments;private final CommunityCasesService cases;
 public CaseAppointmentsController(CaseAppointmentsService appointments,CommunityCasesService cases){this.appointments=appointments;this.cases=cases;}
 @GetMapping("/community-cases/{caseId}/appointments") public Slots slots(@PathVariable String caseId,@RequestParam String userId,@RequestParam String serviceId,@RequestParam String providerAccountId,
         @RequestParam(defaultValue="day")String view,@RequestParam(required=false)String rangeStart,@RequestParam(required=false)String rangeEnd,@RequestParam(defaultValue="20")int limit,@RequestParam(required=false)String cursor){
     return appointments.slots(cases.actor(userId),caseId,serviceId,providerAccountId,view,rangeStart,rangeEnd,limit,cursor);
 }
 @PostMapping("/community-cases/{caseId}/appointments")public Saved save(@PathVariable String caseId,@RequestBody Selection r){return appointments.save(cases.actor(r.userId()),caseId,r);}
 @PostMapping("/community-cases/{caseId}/appointments/{appointmentId}/cancel") public void cancel(@PathVariable String caseId,@PathVariable String appointmentId,@RequestBody Cancel r){appointments.cancel(cases.actor(r.userId()),caseId,r.providerAccountId(),appointmentId);}
 @GetMapping("/service-offerings/calendar")public List<CalendarEntry> calendar(@RequestParam String userId,@RequestParam String rangeStart,@RequestParam String rangeEnd){return appointments.calendar(cases.actor(userId),rangeStart,rangeEnd);}
}
