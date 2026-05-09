package com.raxim.myscoutee.profile.service;

import static com.raxim.myscoutee.profile.data.dto.experience.ExperienceDtos.ExperienceEntryDto;
import static com.raxim.myscoutee.profile.data.dto.experience.ExperienceDtos.UserExperiencesResponseDto;
import static com.raxim.myscoutee.profile.data.dto.experience.ExperienceDtos.UserExperiencesSaveRequestDto;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.UserExperienceProfile;
import com.raxim.myscoutee.profile.repository.UserExperienceProfilesRepository;

@Service
public class UserExperienceProfilesService {
    private final UserExperienceProfilesRepository userExperienceProfilesRepository;
    private final HomeUserProfileService homeUserProfileService;
    private final AffinityRecomputeTaskService affinityRecomputeTaskService;

    public UserExperienceProfilesService(
            UserExperienceProfilesRepository userExperienceProfilesRepository,
            HomeUserProfileService homeUserProfileService,
            AffinityRecomputeTaskService affinityRecomputeTaskService) {
        this.userExperienceProfilesRepository = userExperienceProfilesRepository;
        this.homeUserProfileService = homeUserProfileService;
        this.affinityRecomputeTaskService = affinityRecomputeTaskService;
    }

    public UserExperiencesResponseDto queryUserExperiences(String requestedUserId) {
        String resolvedUserId = resolveUserId(requestedUserId);
        if (!StringUtils.hasText(resolvedUserId)) {
            return new UserExperiencesResponseDto(normalizeId(requestedUserId), List.of());
        }

        List<ExperienceEntryDto> entries = userExperienceProfilesRepository.findByUserId(resolvedUserId)
                .map(UserExperienceProfile::getEntries)
                .map(this::toDtos)
                .orElseGet(List::of);
        return new UserExperiencesResponseDto(resolvedUserId, entries);
    }

    public UserExperiencesResponseDto saveUserExperiences(UserExperiencesSaveRequestDto request) {
        String resolvedUserId = resolveUserId(request == null ? null : request.userId());
        if (!StringUtils.hasText(resolvedUserId)) {
            return new UserExperiencesResponseDto(normalizeId(request == null ? null : request.userId()), List.of());
        }

        UserExperienceProfile profile = userExperienceProfilesRepository.findByUserId(resolvedUserId)
                .orElseGet(UserExperienceProfile::new);
        profile.setUserId(resolvedUserId);
        profile.setUpdatedAtIso(OffsetDateTime.now(ZoneOffset.UTC).toString());
        profile.setEntries(normalizeEntries(request == null ? null : request.entries()));
        UserExperienceProfile saved = userExperienceProfilesRepository.save(profile);
        affinityRecomputeTaskService.enqueueUserChanged(resolvedUserId);
        return new UserExperiencesResponseDto(resolvedUserId, toDtos(saved.getEntries()));
    }

    private String resolveUserId(String requestedUserId) {
        return normalizeId(homeUserProfileService.resolveSelectedUserId(requestedUserId));
    }

    private List<ExperienceEntryDto> toDtos(List<UserExperienceProfile.ExperienceItemRecord> entries) {
        if (entries == null || entries.isEmpty()) {
            return List.of();
        }
        List<ExperienceEntryDto> next = new ArrayList<>();
        for (UserExperienceProfile.ExperienceItemRecord entry : entries) {
            if (entry == null) {
                continue;
            }
            next.add(new ExperienceEntryDto(
                    normalizeId(entry.getId()),
                    normalizeType(entry.getType()),
                    safeText(entry.getTitle()),
                    safeText(entry.getOrg()),
                    safeText(entry.getCity()),
                    safeText(entry.getDateFrom()),
                    normalizeDateTo(entry.getDateTo()),
                    safeText(entry.getDescription())));
        }
        return List.copyOf(next);
    }

    private List<UserExperienceProfile.ExperienceItemRecord> normalizeEntries(List<ExperienceEntryDto> entries) {
        if (entries == null || entries.isEmpty()) {
            return List.of();
        }

        List<UserExperienceProfile.ExperienceItemRecord> next = new ArrayList<>();
        for (ExperienceEntryDto entry : entries) {
            if (entry == null) {
                continue;
            }
            UserExperienceProfile.ExperienceItemRecord record = new UserExperienceProfile.ExperienceItemRecord();
            String normalizedId = normalizeId(entry.id());
            record.setId(StringUtils.hasText(normalizedId) ? normalizedId : "exp-" + UUID.randomUUID());
            record.setType(normalizeType(entry.type()));
            record.setTitle(safeText(entry.title()));
            record.setOrg(safeText(entry.org()));
            record.setCity(safeText(entry.city()));
            record.setDateFrom(safeText(entry.dateFrom()));
            record.setDateTo(normalizeDateTo(entry.dateTo()));
            record.setDescription(safeText(entry.description()));
            next.add(record);
        }
        return List.copyOf(next);
    }

    private String normalizeType(String value) {
        String normalized = safeText(value);
        return switch (normalized) {
            case "School", "Online Session", "Additional Project" -> normalized;
            default -> "Workspace";
        };
    }

    private String normalizeDateTo(String value) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : "Present";
    }

    private String normalizeId(String value) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : null;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
