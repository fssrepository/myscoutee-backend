package com.raxim.myscoutee.profile.controller.activities;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.CalendarExportService;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CalendarExportControllerTest {
    @Test void emptyCalendarReturnsNoContentWithoutAnAttachment() {
        var access = mock(AccessControlService.class);
        var service = mock(CalendarExportService.class);
        var auth = mock(Authentication.class);
        when(access.resolveActorUserId(auth)).thenReturn("actor");
        when(service.export("actor")).thenReturn("");
        var response = new CalendarExportController(access, service).export(auth);
        assertEquals(204, response.getStatusCode().value());
        assertNull(response.getBody());
        assertNull(response.getHeaders().getContentDisposition().getFilename());
        assertEquals("private, no-store", response.getHeaders().getCacheControl());
    }
    @Test void requiresResolvedActorAndReturnsPrivateDownload() {
        var access = mock(AccessControlService.class);
        var service = mock(CalendarExportService.class);
        var controller = new CalendarExportController(access, service);
        assertThrows(ResponseStatusException.class, () -> controller.export(null));
        verifyNoInteractions(service);
        var auth = mock(Authentication.class);
        when(access.resolveActorUserId(auth)).thenReturn("actor");
        when(service.export("actor")).thenReturn("calendar");
        var response = controller.export(auth);
        assertEquals("calendar", response.getBody());
        assertEquals("private, no-store", response.getHeaders().getCacheControl());
        assertEquals("myscoutee-calendar.ics", response.getHeaders().getContentDisposition().getFilename());
        verify(service).export("actor");
    }
}
