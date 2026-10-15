package com.raxim.myscoutee.domain.community.service;

import com.raxim.myscoutee.domain.groups.api.BaseGroups;

import com.raxim.myscoutee.domain.accounts.api.ProfileSummary;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummaries;
import com.raxim.myscoutee.domain.community.document.ServiceCase;
import com.raxim.myscoutee.domain.community.document.ServiceOffering;
import com.raxim.myscoutee.domain.community.document.ServiceProviderCalendar;
import com.raxim.myscoutee.domain.community.repository.ServiceCasesRepository;
import com.raxim.myscoutee.domain.community.repository.ServiceOfferingsRepository;
import com.raxim.myscoutee.domain.community.repository.ServiceProviderCalendarsRepository;
import com.raxim.myscoutee.domain.payments.api.ServiceSlotPricing;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.raxim.myscoutee.domain.community.document.ServiceProviderCalendar.Appointment;
import com.raxim.myscoutee.domain.community.dto.CaseAppointmentDtos.*;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.*;

import com.raxim.myscoutee.domain.events.api.SlotRecurrence;
import static com.raxim.myscoutee.domain.groups.api.CommunityAuthority.error;

@Service
public class CaseAppointmentsService {
    private final CommunityCasesService cases;
    private final ServiceOfferingsService services;
    private final ServiceProviderCalendarsRepository calendars;
    private final SlotRecurrence recurrence;
    private final ServiceSlotPricing pricing;
    private final ServiceCasesRepository caseRecords; private final ServiceOfferingsRepository serviceRecords; private final ProfileSummaries users;
    public CaseAppointmentsService(CommunityCasesService cases,ServiceOfferingsService services,ServiceProviderCalendarsRepository calendars,
            SlotRecurrence recurrence,ServiceSlotPricing pricing,ServiceCasesRepository caseRecords,ServiceOfferingsRepository serviceRecords,ProfileSummaries users) {
        this.cases=cases;this.services=services;this.calendars=calendars;this.recurrence=recurrence;this.pricing=pricing;this.caseRecords=caseRecords;this.serviceRecords=serviceRecords;this.users=users;
    }
    private record Context(ServiceCase caseRecord, ServiceOffering service, ServiceProviderCalendar calendar) {}
    private Context context(String actor,String caseId,String serviceId,String provider) {
        var c=cases.visible(actor,caseId);var s=serviceRecords.findById(serviceId).orElseThrow(()->error(HttpStatus.NOT_FOUND));
        if (!BaseGroups.COMMUNITY_BASE_ID.equals(s.baseGroupId()) || !c.activeParticipantAccountIds().contains(actor)
                || c.support().stream().noneMatch(v->provider.equals(v.accountId())&&serviceId.equals(v.serviceId()))) throw error(HttpStatus.FORBIDDEN);
        return new Context(c,s,calendars.findById(provider).orElse(new ServiceProviderCalendar(provider,List.of(),null,null,null)));
    }
    private boolean bookable(Context c,String provider) {
        return Set.of("open","in-progress").contains(c.caseRecord.status()) && "published".equals(c.service.status()) && c.service.slotsEnabled()
                && c.service.staffAccountIds().contains(provider) && c.caseRecord.support().stream().anyMatch(v->provider.equals(v.accountId())&&c.service.id().equals(v.serviceId())&&"accepted".equals(v.status()));
    }
    public Slots slots(String actor,String caseId,String serviceId,String provider,String view,String startDate,String endDate,int limit,String cursor) {
        var c=context(actor,caseId,serviceId,provider);
        LocalDate start,end;
        try {start=startDate==null?LocalDate.now(ZoneOffset.UTC):LocalDate.parse(startDate);end=endDate==null?start.plusDays(31):LocalDate.parse(endDate);}
        catch(DateTimeException e){throw error(HttpStatus.BAD_REQUEST);}
        if(end.isBefore(start)||end.isAfter(start.plusDays(92)))throw error(HttpStatus.BAD_REQUEST);
        var own=c.calendar.appointments().stream().filter(a->owns(a,actor,caseId,serviceId)&&"booked".equals(a.status())).toList();
        List<EventCheckoutSlotDto> rows;
        if("basket".equals(view)||!bookable(c,provider)) rows=own.stream().filter(a->Instant.parse(a.startAtIso()).isAfter(Instant.now())).map(a->slotFromAppointment(c.service,a)).toList();
        else rows=occurrences(c.service,start.atStartOfDay(),end.atTime(23,59,59)).stream().map(o->slot(c,actor,provider,o)).toList();
        var days=new LinkedHashMap<String,List<EventCheckoutSlotDto>>();
        rows.forEach(s->days.computeIfAbsent(s.startAtIso().substring(0,10),key->new ArrayList<>()).add(s));
        var summaries=days.entrySet().stream().map(e->new EventCheckoutSlotDayDto(e.getKey(),e.getValue().size(),
                (int)e.getValue().stream().filter(s->s.availableSlots()>0).count(),e.getValue().stream().anyMatch(s->Boolean.TRUE.equals(s.bookedByViewer())),
                e.getValue().stream().mapToDouble(EventCheckoutSlotDto::amount).min().orElse(0),currency(c.service))).toList();
        int offset=CommunityCasesService.page(cursor),size=Math.max(1,Math.min(100,limit)),from=Math.min(offset,rows.size()),to=Math.min(from+size,rows.size());
        return new Slots(new EventCheckoutSlotsResultDto(caseId,"service",summaries,rows.subList(from,to),rows.size(),to<rows.size()?""+to:null,currency(c.service),List.of(),null),
                c.calendar.version(),own,c.service);
    }
    public List<CalendarEntry> calendar(String actor,String startDate,String endDate) {
        LocalDate start,end;try {start=LocalDate.parse(startDate);end=LocalDate.parse(endDate);}catch(RuntimeException e){throw error(HttpStatus.BAD_REQUEST);}
        if(end.isBefore(start)||end.isAfter(start.plusDays(92)))throw error(HttpStatus.BAD_REQUEST);
        String from=start.atStartOfDay().toInstant(ZoneOffset.UTC).toString(),to=end.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC).toString();
        var rows=calendars.findById(actor).map(c->c.appointments().stream().filter(a->"booked".equals(a.status())&&Instant.parse(a.startAtIso()).isBefore(Instant.parse(to))&&Instant.parse(a.endAtIso()).isAfter(Instant.parse(from)))
                .sorted(Comparator.comparing(Appointment::startAtIso)).toList()).orElse(List.of());
        var caseMap=new HashMap<String,ServiceCase>();caseRecords.findAllById(rows.stream().map(Appointment::caseId).distinct().toList()).forEach(c->caseMap.put(c.id(),c));
        var serviceMap=new HashMap<String,ServiceOffering>();serviceRecords.findAllById(rows.stream().map(Appointment::serviceId).distinct().toList()).forEach(s->serviceMap.put(s.id(),s));
        var people=new HashMap<String,ProfileSummary>();users.findByUserIdIn(rows.stream().map(Appointment::customerAccountId).distinct().toList()).forEach(u->people.put(u.getUserId(),u));
        var entries = new ArrayList<CalendarEntry>();
        rows.stream().filter(a->caseMap.containsKey(a.caseId())&&caseMap.get(a.caseId()).activeParticipantAccountIds().contains(actor)).forEach(a->entries.add(new CalendarEntry(a,caseMap.get(a.caseId()).title(),
                serviceMap.containsKey(a.serviceId())?serviceMap.get(a.serviceId()).title():"",people.containsKey(a.customerAccountId())?people.get(a.customerAccountId()).getName():"",a.caseId(),null,caseMap.get(a.caseId()).caseType(),caseMap.get(a.caseId()).status())));
        for (var c : caseRecords.assignedCalendar(BaseGroups.COMMUNITY_BASE_ID, actor, from, to)) {
            if (!c.activeParticipantAccountIds().contains(actor)) continue;
            for (var task : c.boardTasks()) {
                if ("deleted".equals(task.status()) || !task.assigneeAccountIds().contains(actor) || task.startAtIso() == null) continue;
                var taskStart = Instant.parse(task.startAtIso());
                var taskEnd = task.endAtIso() == null ? taskStart : Instant.parse(task.endAtIso());
                if (taskStart.isBefore(Instant.parse(to)) && (taskEnd.isAfter(Instant.parse(from)) || !taskStart.isBefore(Instant.parse(from))))
                    entries.add(new CalendarEntry(null,c.title(),task.title(),"",c.id(),task,c.caseType(),c.status()));
            }
        }
        entries.sort(Comparator.comparing(e->e.task()==null?e.appointment().startAtIso():e.task().startAtIso()));
        return entries;
    }
    public void cancel(String actor,String caseId,String provider,String appointmentId) {
        var c=cases.visible(actor,caseId);var calendar=calendars.findById(provider).orElseThrow(()->error(HttpStatus.NOT_FOUND));
        var a=calendar.appointments().stream().filter(v->v.id().equals(appointmentId)&&v.caseId().equals(caseId)).findFirst().orElseThrow(()->error(HttpStatus.NOT_FOUND));
        if(!actor.equals(provider)&&!actor.equals(a.customerAccountId())&&!cases.canManage(c,actor))throw error(HttpStatus.FORBIDDEN);
        if(!"cancelled".equals(a.status())) {
            var rows=calendar.appointments().stream().map(v->!v.id().equals(a.id())?v:new Appointment(v.id(),v.caseId(),v.serviceId(),v.providerAccountId(),v.customerAccountId(),v.slotId(),v.slotTemplateId(),v.startAtIso(),v.endAtIso(),"cancelled",v.amount(),v.currency(),v.pricingSummaryRows(),v.createdAtIso(),Instant.now().toString())).toList();
            try{calendars.save(new ServiceProviderCalendar(calendar.id(),rows,null,null,calendar.version()));}
            catch(org.springframework.dao.OptimisticLockingFailureException ex){throw error(HttpStatus.CONFLICT);}
        }
        cases.notifyChange(c,actor,"appointments-updated","cancel:"+a.id());
    }
    public Saved save(String actor,String caseId,Selection r) {
        if(r.operationId()==null||r.operationId().isBlank()||r.operationId().length()>100||r.slotIds()==null||r.slotIds().size()>50||r.slotIds().stream().anyMatch(Objects::isNull))throw error(HttpStatus.BAD_REQUEST);
        var c=context(actor,caseId,r.serviceId(),r.providerAccountId());
        if(!c.caseRecord.audienceAccountIds().contains(actor)&&!actor.equals(c.caseRecord.ownerAccountId()))throw error(HttpStatus.FORBIDDEN);
        var ids=new TreeSet<>(r.slotIds());String signature=actor+":"+caseId+":"+r.serviceId()+":"+String.join("|",ids);
        if(r.operationId().equals(c.calendar.lastOperationId())) {
            if(!signature.equals(c.calendar.lastOperationSignature()))throw error(HttpStatus.CONFLICT);
            cases.notifyChange(c.caseRecord,actor,"appointments-updated",r.operationId());return saved(c.calendar,actor,caseId,r.serviceId());
        }
        if(!Objects.equals(c.calendar.version(),r.version()))throw error(HttpStatus.CONFLICT);
        var now=Instant.now();var byId=new LinkedHashMap<String,Appointment>();c.calendar.appointments().forEach(a->byId.put(a.id(),a));
        var selected=new ArrayList<Appointment>();
        for(String id:ids) {
            var previous=c.calendar.appointments().stream().filter(a->owns(a,actor,caseId,r.serviceId())&&id.equals(a.slotId())&&"booked".equals(a.status())&&Instant.parse(a.startAtIso()).isAfter(now)).findFirst().orElse(null);
            if(previous!=null){selected.add(previous);continue;}
            if(!bookable(c,r.providerAccountId()))throw error(HttpStatus.CONFLICT);
            String prefix=c.service.id()+":slot:";if(!id.startsWith(prefix))throw error(HttpStatus.BAD_REQUEST);
            // The timestamp is parsed only to bound the canonical schedule lookup; it never authorizes a slot.
            var timestamp=java.util.regex.Pattern.compile(":(\\d{4}-\\d{2}-\\d{2}T.*Z)$").matcher(id);
            if(!timestamp.find())throw error(HttpStatus.BAD_REQUEST);
            Instant date;try{date=Instant.parse(timestamp.group(1));}catch(RuntimeException e){throw error(HttpStatus.BAD_REQUEST);}
            var day=date.atOffset(ZoneOffset.UTC).toLocalDate();
            var o=occurrences(c.service,day.atStartOfDay(),day.atTime(23,59,59)).stream().filter(v->v.id.equals(id)).findFirst().orElseThrow(()->error(HttpStatus.CONFLICT));
            if(!o.start.toInstant(ZoneOffset.UTC).isAfter(now))throw error(HttpStatus.CONFLICT);
            if(c.calendar.appointments().stream().filter(a->"booked".equals(a.status())&&!owns(a,actor,caseId,r.serviceId())).anyMatch(a->overlaps(a,o)))throw error(HttpStatus.CONFLICT);
            if(selected.stream().anyMatch(a->overlaps(a,o)))throw error(HttpStatus.CONFLICT);
            var old=c.calendar.appointments().stream().filter(a->owns(a,actor,caseId,r.serviceId())&&id.equals(a.slotId())&&"booked".equals(a.status())).findFirst().orElse(null);
            if(old!=null){selected.add(old);continue;}
            var quote=pricing.quoteServiceSlot(c.service.pricing(),o.templateId,iso(o.start),0);
            selected.add(new Appointment(UUID.randomUUID().toString(),caseId,r.serviceId(),r.providerAccountId(),actor,id,o.templateId,iso(o.start),iso(o.end),"booked",quote.amount(),quote.currency(),quote.rows(),now.toString(),now.toString()));
        }
        for(int i=0;i<selected.size();i++)for(int j=i+1;j<selected.size();j++) {
            var a=selected.get(i);var b=selected.get(j);
            if(Instant.parse(a.startAtIso()).isBefore(Instant.parse(b.endAtIso()))&&Instant.parse(a.endAtIso()).isAfter(Instant.parse(b.startAtIso())))throw error(HttpStatus.CONFLICT);
        }
        for(var old:c.calendar.appointments())if(owns(old,actor,caseId,r.serviceId())&&"booked".equals(old.status())&&Instant.parse(old.startAtIso()).isAfter(now)&&!ids.contains(old.slotId()))
            byId.put(old.id(),new Appointment(old.id(),old.caseId(),old.serviceId(),old.providerAccountId(),old.customerAccountId(),old.slotId(),old.slotTemplateId(),old.startAtIso(),old.endAtIso(),"cancelled",old.amount(),old.currency(),old.pricingSummaryRows(),old.createdAtIso(),now.toString()));
        selected.forEach(a->byId.put(a.id(),a));
        ServiceProviderCalendar result;
        try {result=calendars.save(new ServiceProviderCalendar(c.calendar.id(),List.copyOf(byId.values()),r.operationId(),signature,c.calendar.version()));}
        catch(org.springframework.dao.OptimisticLockingFailureException|org.springframework.dao.DuplicateKeyException e){throw error(HttpStatus.CONFLICT);}
        cases.notifyChange(c.caseRecord,actor,"appointments-updated",r.operationId());
        return saved(result,actor,caseId,r.serviceId());
    }
    private Saved saved(ServiceProviderCalendar c,String actor,String caseId,String serviceId) {return new Saved(c.version(),c.appointments().stream().filter(a->owns(a,actor,caseId,serviceId)&&"booked".equals(a.status())).toList());}
    private boolean owns(Appointment a,String actor,String caseId,String serviceId) {return actor.equals(a.customerAccountId())&&caseId.equals(a.caseId())&&serviceId.equals(a.serviceId());}
    private boolean overlaps(Appointment a,Occurrence o) {return Instant.parse(a.startAtIso()).isBefore(o.end.toInstant(ZoneOffset.UTC))&&Instant.parse(a.endAtIso()).isAfter(o.start.toInstant(ZoneOffset.UTC));}
    private record Occurrence(String id,String templateId,LocalDateTime start,LocalDateTime end) {}
    private List<Occurrence> occurrences(ServiceOffering s,LocalDateTime from,LocalDateTime to) {
        var windowStart=Instant.parse(s.startAtIso()).atOffset(ZoneOffset.UTC).toLocalDateTime();var windowEnd=Instant.parse(s.endAtIso()).atOffset(ZoneOffset.UTC).toLocalDateTime();
        var overrides=new HashSet<LocalDate>();for(var t:s.slotTemplates())if(t.overrideDate()!=null&&!t.overrideDate().isBlank())overrides.add(LocalDate.parse(t.overrideDate().substring(0,10)));
        var rows=new ArrayList<Occurrence>();
        for(var t:s.slotTemplates()) {
            if(Boolean.TRUE.equals(t.closed()))continue;
            var template=Instant.parse(t.startAt()).atOffset(ZoneOffset.UTC).toLocalDateTime();boolean override=t.overrideDate()!=null&&!t.overrideDate().isBlank();
            for(var start:recurrence.generateSlotOccurrenceStarts(override?"One-time":s.frequency(),template,from,to)) {
                if(!override&&overrides.contains(recurrence.slotOccurrenceAnchorDateKey(start,template,windowStart)))continue;
                var end=start.plusMinutes(s.durationMinutes());if(start.isBefore(windowStart)||end.isAfter(windowEnd))continue;
                rows.add(new Occurrence(s.id()+":slot:"+t.id()+":"+iso(start),t.id(),start,end));
            }
        }
        return rows.stream().sorted(Comparator.comparing(Occurrence::start).thenComparing(Occurrence::id)).toList();
    }
    private EventCheckoutSlotDto slot(Context c,String actor,String provider,Occurrence o) {
        var overlaps=c.calendar.appointments().stream().filter(a->"booked".equals(a.status())&&overlaps(a,o)).toList();
        boolean mine=overlaps.stream().anyMatch(a->owns(a,actor,c.caseRecord.id(),c.service.id())&&o.id.equals(a.slotId()));
        int available=overlaps.isEmpty()&&o.start.toInstant(ZoneOffset.UTC).isAfter(Instant.now())?1:0;
        var quote=pricing.quoteServiceSlot(c.service.pricing(),o.templateId,iso(o.start),overlaps.isEmpty()?0:1);
        return new EventCheckoutSlotDto(o.id,c.caseRecord.id(),o.id,o.templateId,c.service.title(),iso(o.start)+" – "+iso(o.end),iso(o.start),iso(o.end),1,overlaps.isEmpty()?0:1,0,available,mine,quote.amount(),quote.currency(),quote.rows());
    }
    private EventCheckoutSlotDto slotFromAppointment(ServiceOffering s,Appointment a) {return new EventCheckoutSlotDto(a.slotId(),a.caseId(),a.slotId(),a.slotTemplateId(),s.title(),a.startAtIso()+" – "+a.endAtIso(),a.startAtIso(),a.endAtIso(),1,1,0,0,true,a.amount(),a.currency(),a.pricingSummaryRows());}
    private static String iso(LocalDateTime date){return DateTimeFormatter.ISO_INSTANT.format(date.toInstant(ZoneOffset.UTC));}
    private static String currency(ServiceOffering s){return s.pricing()==null?"USD":s.pricing().currency();}
}
