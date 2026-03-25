package com.raxim.myscoutee.profile.controller.activities;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.dto.events.EventsDtos.ActivitiesEventSyncPayloadDto;
import com.raxim.myscoutee.profile.dto.events.EventsDtos.EventActionRequestDto;
import com.raxim.myscoutee.profile.dto.events.EventsDtos.EventRecordDto;
import com.raxim.myscoutee.profile.dto.events.EventsDtos.EventsExplorePageDto;
import com.raxim.myscoutee.profile.dto.events.EventsDtos.EventsExploreQueryDto;
import com.raxim.myscoutee.profile.dto.events.EventsDtos.EventsFilterRequestDto;

@RestController
@RequestMapping("/activities/events")
public class ActivitiesEventsController {

    @GetMapping
    public List<EventRecordDto> queryItems(@RequestParam("userId") String userId) {
        return List.of();
    }

    @GetMapping("/invitations")
    public List<EventRecordDto> queryInvitations(@RequestParam("userId") String userId) {
        return List.of();
    }

    @GetMapping("/attending")
    public List<EventRecordDto> queryAttending(@RequestParam("userId") String userId) {
        return List.of();
    }

    @GetMapping("/hosting")
    public List<EventRecordDto> queryHosting(@RequestParam("userId") String userId) {
        return List.of();
    }

    @GetMapping("/trash")
    public List<EventRecordDto> queryTrash(@RequestParam("userId") String userId) {
        return List.of();
    }

    @PostMapping("/filter")
    public List<EventRecordDto> filter(@RequestBody EventsFilterRequestDto request) {
        return List.of();
    }

    @PostMapping("/explore")
    public EventsExplorePageDto explore(@RequestBody EventsExploreQueryDto request) {
        return new EventsExplorePageDto(List.of(), 0, null);
    }

    @PostMapping("/trash")
    public void trash(@RequestBody EventActionRequestDto request) {
        // no-op skeleton
    }

    @PostMapping("/publish")
    public void publish(@RequestBody EventActionRequestDto request) {
        // no-op skeleton
    }

    @PostMapping("/restore")
    public void restore(@RequestBody EventActionRequestDto request) {
        // no-op skeleton
    }

    @PostMapping("/sync")
    public void sync(@RequestBody ActivitiesEventSyncPayloadDto request) {
        // no-op skeleton
    }
}
