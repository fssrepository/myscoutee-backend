package com.raxim.myscoutee.domain.community.service;
import com.raxim.myscoutee.domain.community.dto.CaseDetails;

import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.community.document.ServiceCase;
import com.raxim.myscoutee.domain.community.document.ServiceOffering;
import com.raxim.myscoutee.domain.community.document.ServiceProviderCalendar;
import com.raxim.myscoutee.domain.community.repository.ServiceCasesRepository;
import com.raxim.myscoutee.domain.community.repository.ServiceOfferingsRepository;
import com.raxim.myscoutee.domain.community.repository.ServiceProviderCalendarsRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.groups.document.CommunityGroup;
import com.raxim.myscoutee.domain.localization.service.TranslationService;
import com.raxim.myscoutee.domain.payments.service.EventCheckoutPricingService;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.domain.community.dto.CaseAppointmentDtos.*;
import com.raxim.myscoutee.common.dto.SharedDtos.EventSlotTemplateDto;

import com.raxim.myscoutee.domain.events.mapper.ActivityEventSubEventsMapper;
@org.junit.jupiter.api.Tag("standard")
class CaseAppointmentsServiceTest {
 CommunityCasesService cases;ServiceOfferingsService services;ServiceProviderCalendarsRepository calendars;CaseAppointmentsService service;
 ServiceProviderCalendar state;ServiceOfferingsRepository offerings;ServiceCasesRepository caseRecords;
 @BeforeEach void setup(){cases=mock(CommunityCasesService.class);services=mock(ServiceOfferingsService.class);calendars=mock(ServiceProviderCalendarsRepository.class);
  var pricing=new EventCheckoutPricingService(new com.raxim.myscoutee.domain.events.service.EventOwnershipService(mock(ActivityEventsRepository.class), null), new com.raxim.myscoutee.domain.events.service.MemberDirectoryService(mock(ActivityMembersRepository.class), null), mock(TranslationService.class));
  offerings=mock(ServiceOfferingsRepository.class);caseRecords=mock(ServiceCasesRepository.class);service=new CaseAppointmentsService(cases,services,calendars,new ActivityEventSubEventsMapper(),pricing,caseRecords,offerings,new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(mock(UsersRepository.class), null));
  when(cases.visible(anyString(),eq("case"))).thenReturn(new ServiceCase("case",CommunityGroup.COMMUNITY_BASE_ID,"homes","owner","Shared repair","", "maintenance","open",true,List.of("owner","resident"),List.of("owner","resident","provider"),List.of(),List.of(new CaseDetails.Support("provider","service","accepted")),List.of(),List.of(),null,null,"2099-01-01T00:00:00Z","2099-01-01T00:00:00Z",0L,Map.of(),List.of(),List.of()));
  when(offerings.findById("service")).thenReturn(Optional.of(new ServiceOffering("service",CommunityGroup.COMMUNITY_BASE_ID,"provider","Repairs","","maintenance",List.of(),null,List.of(),List.of("provider"),true,"2099-01-01T00:00:00Z","2099-12-31T23:59:59Z","Daily",60,List.of(new EventSlotTemplateDto("morning","2099-01-01T09:20:00Z",null,false,List.of())),null,"published","2099-01-01T00:00:00Z","2099-01-01T00:00:00Z",0L,"")));
  when(calendars.findById("provider")).thenAnswer(inv->Optional.ofNullable(state));
  when(calendars.save(any())).thenAnswer(inv->{var x=(ServiceProviderCalendar)inv.getArgument(0);state=new ServiceProviderCalendar(x.id(),x.appointments(),x.lastOperationId(),x.lastOperationSignature(),x.version()==null?0:x.version()+1);return state;});
 }
 @Test void canonicalScheduleAndRetryKeepOneBookingAndOneNotificationIdentity(){
  var page=service.slots("owner","case","service","provider","day","2099-01-12","2099-01-12",20,null);
  assertThat(page.result().slots()).hasSize(1);var id=page.result().slots().getFirst().id();
  var request=new Selection("owner","service","provider",List.of(id),null,"request-1");
  var saved=service.save("owner","case",request);assertThat(saved.appointments()).hasSize(1);
  assertThat(service.save("owner","case",request)).isEqualTo(saved);verify(calendars,times(1)).save(any());
  verify(cases,times(2)).notifyChange(any(),eq("owner"),eq("appointments-updated"),eq("request-1"));
 }
 @Test void staleOrOverlappingReservationsAreRejectedAndCancellationReleasesTheProvider(){
  String id=service.slots("owner","case","service","provider","day","2099-01-12","2099-01-12",20,null).result().slots().getFirst().id();
  service.save("owner","case",new Selection("owner","service","provider",List.of(id),null,"first"));
  assertThatThrownBy(()->service.save("resident","case",new Selection("resident","service","provider",List.of(id),null,"stale"))).isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
  assertThatThrownBy(()->service.save("resident","case",new Selection("resident","service","provider",List.of(id),0L,"collision"))).isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
  service.save("owner","case",new Selection("owner","service","provider",List.of(),0L,"cancel"));
  assertThat(service.save("resident","case",new Selection("resident","service","provider",List.of(id),1L,"second")).appointments()).hasSize(1);
 }
 @Test void providerCannotBookAsAnUnrelatedCustomerAndFabricatedSlotsAreRejected(){
  assertThatThrownBy(()->service.save("provider","case",new Selection("provider","service","provider",List.of(),null,"provider"))).isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
  assertThatThrownBy(()->service.save("owner","case",new Selection("owner","service","provider",List.of("service:slot:morning:2099-01-12T09:21:00Z"),null,"fake"))).isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
  verify(calendars,never()).save(any());
 }
 @Test void calendarCarriesCaseTypeForAssignedTasksWithoutAdditionalCaseLookups(){
  var c=mock(ServiceCase.class);
  when(c.id()).thenReturn("case");when(c.title()).thenReturn("Shared repair");when(c.caseType()).thenReturn("maintenance");when(c.status()).thenReturn("open");
  when(c.activeParticipantAccountIds()).thenReturn(List.of("provider"));
  when(c.boardTasks()).thenReturn(List.of(new CaseDetails.BoardTask("task","Repair","","todo",List.of("provider"),List.of(),"2099-01-12T10:00:00Z","2099-01-12T11:00:00Z",List.of())));
  when(caseRecords.assignedCalendar(anyString(),eq("provider"),anyString(),anyString())).thenReturn(List.of(c));
  var entries=service.calendar("provider","2099-01-12","2099-01-12");
  assertThat(entries).hasSize(1);assertThat(entries.getFirst().caseType()).isEqualTo("maintenance");
  assertThat(entries.getFirst().task().id()).isEqualTo("task");assertThat(entries.getFirst().caseStatus()).isEqualTo("open");
  verify(caseRecords,never()).findById(anyString());
 }

}
