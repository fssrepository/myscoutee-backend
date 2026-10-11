package com.raxim.myscoutee.domain.accounts.service;

import java.util.Objects;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.domain.accounts.api.LocationEligibility;
import com.raxim.myscoutee.domain.accounts.api.ProfileReadState;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserLocationEligibilityResponseDto;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.access.api.AccessPermissions;
import com.raxim.myscoutee.domain.access.api.RegionSecurity;
import com.raxim.myscoutee.domain.platform.api.CountryDirectory;

/** Account location writes and login-region policy, independent of profile discovery. */
@Service
public class AccountLocationService implements LocationEligibility {
    private static final String DEFAULT_SEED_PARTITION_KEY = "country:hu";
    private static final String SEED_USER_IMAGE_HOST = "randomuser.me/";
    private static final String INELIGIBLE_REGION_MESSAGE = "Login is currently unavailable from your country or region for security reasons. Please come back later.";

    private final UsersRepository usersRepository;
    private final SelectedProfileService selectedProfile;
    private final AccessPermissions accessControlService;
    private final CountryDirectory countryPartitionService;
    private final RegionSecurity regionSecurityProperties;
    private final ProfileReadState readState;

    public AccountLocationService(UsersRepository usersRepository, SelectedProfileService selectedProfile,
            AccessPermissions accessControlService, CountryDirectory countryPartitionService,
            RegionSecurity regionSecurityProperties, @Lazy ProfileReadState readState) {
        this.usersRepository = usersRepository; this.selectedProfile = selectedProfile;
        this.accessControlService = accessControlService; this.countryPartitionService = countryPartitionService;
        this.regionSecurityProperties = regionSecurityProperties; this.readState = readState;
    }

    // The profile-load caller retains its demo-selector eviction after producing the response.
    public void updateLoadedLocation(String requestedUserId, Double latitude, Double longitude) {
        if (latitude != null || longitude != null) {
            if (latitude == null || longitude == null || !Double.isFinite(latitude) || !Double.isFinite(longitude)
                    || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid location coordinates.");
            }
            Users selected = selectedProfile.resolveCurrentUser(requestedUserId);
            if (selected == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found.");
            if (!accessControlService.canCurrentActorEditProfile(selected.getUserId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Authenticated user is not allowed to edit this profile.");
            }
            var coordinates = new LocationCoordinatesDto(latitude, longitude);
            Users account = StringUtils.hasText(selected.getAccountUserId())
                    ? usersRepository.findByUserId(selected.getAccountUserId()).orElseThrow(
                            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found.")) : selected;
            String resolvedPartition = countryPartitionService.resolvePartitionKey(coordinates, account.getPartitionKey());
            if (regionSecurityProperties.isEnabled() && !StringUtils.hasText(resolvedPartition)) {
                // Discard an unsupported pending sample, not the already admitted profile load.
                if (account.getLocationCoordinates() != null) return;
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, INELIGIBLE_REGION_MESSAGE);
            }
            // Resolve the point once for the account and group profile, before either field update.
            String accountPartition = resolveStoredPartitionKey(resolvedPartition, account.getPartitionKey(), account);
            String selectedPartition = account == selected ? accountPartition
                    : resolveStoredPartitionKey(resolvedPartition, selected.getPartitionKey(), selected);
            persistLoadedLocation(account, coordinates, accountPartition);
            if (account != selected) persistLoadedLocation(selected, coordinates, selectedPartition);
        }
    }

    private void persistLoadedLocation(Users user, LocationCoordinatesDto coordinates, String partition) {
        var record = toLocationCoordinatesRecord(coordinates);
        usersRepository.updateLocation(user.getUserId(), record, partition);
        user.setLocationCoordinates(record);
        user.setPartitionKey(partition);
        readState.evictUserReadCaches(user.getUserId());
    }

    String validatedLocationPartition(Users current, LocationCoordinatesDto coordinates) {
        String resolved = countryPartitionService.resolvePartitionKey(coordinates, current == null ? null : current.getPartitionKey());
        String stored = current == null ? null : current.getPartitionKey();
        boolean retainsStored = StringUtils.hasText(stored)
                && sameLocation(coordinates, current.getLocationCoordinates());
        if (regionSecurityProperties.isEnabled() && coordinates != null
                && !StringUtils.hasText(resolved) && !retainsStored) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, INELIGIBLE_REGION_MESSAGE);
        }
        return resolveStoredPartitionKey(resolved, stored, current);
    }

    public UserLocationEligibilityResponseDto queryLocationEligibility(Double latitude, Double longitude) {
        if (!regionSecurityProperties.isEnabled()) {
            return new UserLocationEligibilityResponseDto(true, null, null, false, false);
        }

        if (latitude == null || longitude == null || !Double.isFinite(latitude) || !Double.isFinite(longitude)) {
            return new UserLocationEligibilityResponseDto(false, null, null, true, true);
        }

        LocationCoordinatesDto coordinates = new LocationCoordinatesDto(latitude, longitude);
        String partitionKey = countryPartitionService.resolvePartitionKey(coordinates);
        return new UserLocationEligibilityResponseDto(
                StringUtils.hasText(partitionKey),
                partitionKey,
                StringUtils.hasText(partitionKey) ? null : INELIGIBLE_REGION_MESSAGE,
                true,
                false);
    }

    String resolveStoredPartitionKey(
            LocationCoordinatesDto coordinates,
            String currentPartitionKey,
            Users partitionOwner) {
        String resolvedPartitionKey = countryPartitionService.resolvePartitionKey(coordinates);
        return resolveStoredPartitionKey(resolvedPartitionKey, currentPartitionKey, partitionOwner);
    }

    String resolveStoredPartitionKey(
            String resolvedPartitionKey,
            String currentPartitionKey,
            Users partitionOwner) {
        if (StringUtils.hasText(resolvedPartitionKey)) {
            return resolvedPartitionKey;
        }

        String normalizedCurrentPartitionKey = safeText(currentPartitionKey);
        if (StringUtils.hasText(normalizedCurrentPartitionKey)) {
            return normalizedCurrentPartitionKey;
        }

        return isSeedLikeHungaryUser(partitionOwner) ? DEFAULT_SEED_PARTITION_KEY : null;
    }

    private boolean sameLocation(
            LocationCoordinatesDto requested,
            Users.LocationCoordinatesRecord stored) {
        return requested != null
                && stored != null
                && Objects.equals(requested.latitude(), stored.latitude())
                && Objects.equals(requested.longitude(), stored.longitude());
    }

    private boolean isSeedLikeHungaryUser(Users user) {
        if (user == null) {
            return false;
        }

        return (user.getImages() == null ? java.util.stream.Stream.<String>empty() : user.getImages().stream())
                .filter(Objects::nonNull).map(String::trim).filter(StringUtils::hasText)
                .anyMatch(this::isSeedImageUrl);
    }

    private boolean isSeedImageUrl(String value) {
        return safeText(value).contains(SEED_USER_IMAGE_HOST);
    }

    static LocationCoordinatesDto toLocationCoordinatesDto(Users.LocationCoordinatesRecord record) {
        if (record == null) {
            return null;
        }
        return new LocationCoordinatesDto(record.latitude(), record.longitude());
    }

    static Users.LocationCoordinatesRecord toLocationCoordinatesRecord(LocationCoordinatesDto dto) {
        if (dto == null) {
            return null;
        }
        return new Users.LocationCoordinatesRecord(dto.latitude(), dto.longitude());
    }

    private String safeText(String value) { return value == null ? "" : value.trim(); }
}
