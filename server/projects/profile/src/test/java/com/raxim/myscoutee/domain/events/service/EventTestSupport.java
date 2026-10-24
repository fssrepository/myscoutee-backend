package com.raxim.myscoutee.domain.events.service;
public final class EventTestSupport {
    private EventTestSupport() {}
    public static EventOwnershipService ownership(com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository events, org.springframework.data.mongodb.core.MongoTemplate mongo) {
        var owner = new EventOwnershipService(events, null);
        org.springframework.test.util.ReflectionTestUtils.setField(owner, "mongo", mongo);
        return owner;
    }
}
