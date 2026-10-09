package com.raxim.myscoutee.microservices.transport.events;

import java.util.List;
import java.util.function.Supplier;
import com.raxim.myscoutee.domain.events.api.EventHomeReads;
import com.raxim.myscoutee.domain.events.dto.EventHomeDto;
import com.raxim.myscoutee.microservices.transport.events.EventHomeReadsProtocol.Error;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public final class EventHomeReadsEndpoint {
    private final EventHomeReads owner;
    public EventHomeReadsEndpoint(EventHomeReads owner) { this.owner=owner; }
    @GetMapping(value=EventHomeReadsProtocol.SOURCE,produces="application/json")
    public ResponseEntity<?> source(@RequestParam(required=false) String sourceId) {
        if (!EventHomeReadsProtocol.validId(sourceId)) return response(400,new Error("INVALID_REQUEST"));
        return read(()->owner.findBySourceId(sourceId));
    }
    @GetMapping(value=EventHomeReadsProtocol.HOME,produces="application/json")
    public ResponseEntity<?> home() { return read(owner::findHomeGameMemberProjections); }
    private ResponseEntity<?> read(Supplier<List<? extends EventHomeReads.Event>> action) {
        try {
            var value=action.get().stream().map(event->event==null?null:EventHomeDto.from(event)).toList();
            return response(200,value);
        } catch (RuntimeException unavailable) { return response(503,new Error("EVENT_HOME_READS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status,Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
