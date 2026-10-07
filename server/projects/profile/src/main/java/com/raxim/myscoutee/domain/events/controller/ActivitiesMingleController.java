package com.raxim.myscoutee.domain.events.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.domain.events.dto.MingleDtos.MingleActionRequestDto;
import com.raxim.myscoutee.domain.events.dto.MingleDtos.MingleActionErrorDto;
import com.raxim.myscoutee.domain.events.dto.MingleDtos.MingleStateDto;
import com.raxim.myscoutee.domain.events.service.ActivitiesMingleService;
import com.raxim.myscoutee.domain.events.service.MingleActionException;

@RestController
@RequestMapping("/activities/events/mingle")
public class ActivitiesMingleController {
    private final ActivitiesMingleService activitiesMingleService;

    public ActivitiesMingleController(ActivitiesMingleService activitiesMingleService) {
        this.activitiesMingleService = activitiesMingleService;
    }

    @GetMapping("/state")
    public MingleStateDto queryState(
            @RequestParam("userId") String userId,
            @RequestParam(value = "eventId", required = false) String eventId,
            @RequestParam(value = "roundNumber", required = false) Integer roundNumber) {
        return activitiesMingleService.queryState(userId, eventId, roundNumber);
    }

    @PostMapping("/action")
    public MingleStateDto applyAction(@RequestBody MingleActionRequestDto request) {
        return activitiesMingleService.applyAction(request);
    }

    @ExceptionHandler(MingleActionException.class)
    public ResponseEntity<MingleActionErrorDto> handleActionFailure(MingleActionException exception) {
        return ResponseEntity
                .status(exception.getStatusCode())
                .body(new MingleActionErrorDto(exception.getCode(), exception.getParameters()));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<MingleActionErrorDto> handleUnexpectedActionFailure(ResponseStatusException exception) {
        return ResponseEntity
                .status(exception.getStatusCode())
                .body(new MingleActionErrorDto("MINGLE_ACTION_FAILED", Map.of()));
    }
}
