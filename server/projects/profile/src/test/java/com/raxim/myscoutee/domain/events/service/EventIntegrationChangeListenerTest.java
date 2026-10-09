package com.raxim.myscoutee.domain.events.service;
import static org.mockito.Mockito.*;
import org.bson.Document;
import org.junit.jupiter.api.*;
import org.springframework.data.mongodb.core.mapping.event.AfterSaveEvent;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.integrations.api.EventChanges;
@Tag("standard")
class EventIntegrationChangeListenerTest {
 @Test void eachEventAndMembershipSaveHasOneProducerAndAssetsKeepTheirOwnListener() {
  var changes=mock(EventChanges.class);var listener=new EventIntegrationChangeListener(changes);
  var event=new ActivityEvent();var member=new ActivityMember();
  listener.onAfterSave(new AfterSaveEvent<>(event,new Document(),"events"));
  listener.onAfterSave(new AfterSaveEvent<>(member,new Document(),"activityMembers"));
  listener.onAfterSave(new AfterSaveEvent<>(new Asset(),new Document(),"assets"));
  verify(changes).enqueue(event);verify(changes).enqueue(member);verifyNoMoreInteractions(changes);
 }
}
