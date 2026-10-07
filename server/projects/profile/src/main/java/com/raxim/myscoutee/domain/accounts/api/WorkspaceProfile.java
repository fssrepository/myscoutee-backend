package com.raxim.myscoutee.domain.accounts.api;

import java.util.List;

/** Read-only local profile view; callers must not retain it as a persistence handle. */
public interface WorkspaceProfile {
    String getId();
    Integer getCompletion();
    String getPartitionKey();
    ActivityCounts getActivities();
    List<? extends Device> getDevices();
    interface ActivityCounts { Integer events(); Integer hosting(); Integer game(); }
    interface Device {
        String getLastSeenAtIso();
        String getLastRegisteredAtIso();
        Boolean getNotificationsEnabled();
        String getFirebaseToken();
    }
    String getUserId();
    String getAccountUserId();
    String getWorkspaceGroupId();
    String getProfileStatus();
    String getStatus();
    String getHostTier();
    String getStatusText();
    String getEmail();
    String getInitials();
    String getGender();
    String getName();
    String getCity();
    List<String> getImages();
    List<String> getLanguages();
    Coordinates getLocationCoordinates();
    interface Coordinates { Double latitude(); Double longitude(); }
    String getSyncKey();
    Integer getAge();
    String getHeight();
    String getPhysique();
    String getHoroscope();
    String getTraitLabel();
    String getHeadline();
    String getAbout();
    Double getAffinity();
    List<? extends ProfileDetailGroupRecord> getProfileDetails();
    UserImpressionsRecord getImpressions();
    interface ProfileDetailGroupRecord { String title(); List<? extends ProfileDetailRowRecord> rows(); }
    interface ProfileDetailRowRecord { String labelKey(); String value(); String privacy(); List<String> options(); }
    interface UserImpressionsRecord { UserImpressionsSectionRecord host(); UserImpressionsSectionRecord member(); }
    interface UserImpressionsSectionRecord { Integer unreadCount(); Double averageRating(); Integer peopleMet(); Integer totalEvents(); Integer repeatCount(); Integer noShowCount(); List<String> vibeBadges(); List<String> personalityBadges(); List<? extends UserPersonalityTraitRecord> personalityTraits(); List<String> categoryBadges(); }
    interface UserPersonalityTraitRecord { String id(); String label(); Integer percent(); Integer evidenceCount(); String lastRatedAtIso(); }
    java.util.Map<String, Double> getPaymentSpentTotals();
    java.util.Map<String, Double> getPaymentIncomeTotals();
    java.util.Map<String, Double> getPaymentAllTotals();
}
