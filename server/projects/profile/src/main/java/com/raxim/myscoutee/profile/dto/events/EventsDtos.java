package com.raxim.myscoutee.profile.dto.events;

import java.util.List;

import com.raxim.myscoutee.profile.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.SubEventFormItemDto;

public final class EventsDtos {
    private EventsDtos() {
    }

    public record EventsFilterRequestDto(
            String userId,
            String filter,
            String hostingPublicationFilter) {
    }

    public record EventsExploreQueryDto(
            String userId,
            String order,
            String view,
            Boolean friendsOnly,
            Boolean openSpotsOnly,
            String topic,
            Integer limit,
            String cursor) {
    }

    public record EventActionRequestDto(
            String userId,
            String type,
            String sourceId) {
    }

    public record EventRecordDto(
            String id,
            String userId,
            String type,
            String avatar,
            String title,
            String subtitle,
            String timeframe,
            String inviter,
            Integer unread,
            Integer activity,
            Boolean isAdmin,
            Boolean isInvitation,
            Boolean isHosting,
            Boolean isTrashed,
            Boolean published,
            String trashedAtIso,
            String creatorUserId,
            String creatorName,
            String creatorInitials,
            String creatorGender,
            String creatorCity,
            String visibility,
            String blindMode,
            String startAtIso,
            String endAtIso,
            Double distanceKm,
            String imageUrl,
            String sourceLink,
            String location,
            LocationCoordinatesDto locationCoordinates,
            Integer capacityMin,
            Integer capacityMax,
            Integer capacityTotal,
            Boolean autoInviter,
            String frequency,
            Boolean ticketing,
            Integer acceptedMembers,
            Integer pendingMembers,
            List<String> acceptedMemberUserIds,
            List<String> pendingMemberUserIds,
            List<String> topics,
            List<SubEventFormItemDto> subEvents,
            String subEventsDisplayMode,
            Double rating,
            Double relevance,
            Double affinity) {
    }

    public record EventsExplorePageDto(
            List<EventRecordDto> records,
            Integer total,
            String nextCursor) {
    }

    public record ActivitiesEventSyncPayloadDto(
            String id,
            String target,
            String title,
            String shortDescription,
            String timeframe,
            Integer activity,
            Boolean isAdmin,
            String startAt,
            String endAt,
            Double distanceKm,
            String imageUrl,
            Integer acceptedMembers,
            Integer pendingMembers,
            Integer capacityTotal,
            Integer capacityMin,
            Integer capacityMax,
            Boolean autoInviter,
            String frequency,
            Boolean ticketing,
            String visibility,
            String blindMode,
            Boolean published,
            String creatorUserId,
            String creatorName,
            String creatorInitials,
            String creatorGender,
            String creatorCity,
            String location,
            LocationCoordinatesDto locationCoordinates,
            String sourceLink,
            List<String> acceptedMemberUserIds,
            List<String> pendingMemberUserIds,
            List<String> topics,
            List<SubEventFormItemDto> subEvents,
            String subEventsDisplayMode) {
    }
}
