import {
  AppUtils
} from "./chunk-CYVMX3LD.js";

// src/app/shared/core/common/user-profile-state.ts
var UserProfileState = class {
  static HARD_HIDDEN_PROFILE_STATUSES = /* @__PURE__ */ new Set(["blocked", "inactive", "deleted"]);
  static INSIDE_NETWORK_GAME_PROFILE_STATUSES = /* @__PURE__ */ new Set(["public", "friends only"]);
  static isFriendOfActiveUser(userId, activeUserId) {
    if (!userId || userId === activeUserId) {
      return false;
    }
    const [firstId, secondId] = [activeUserId.trim(), userId.trim()].sort();
    const seed = AppUtils.hashText(`friend-pair:${firstId}:${secondId}`);
    return seed % 100 < 32;
  }
  static isPublicGameProfile(user) {
    return user?.operator !== true && user?.profileStatus === "public";
  }
  static isInsideNetworkGameProfile(user) {
    return user?.operator !== true && this.INSIDE_NETWORK_GAME_PROFILE_STATUSES.has(user?.profileStatus ?? "");
  }
  static isActivityRateVisibleProfile(user) {
    return Boolean(user) && user?.operator !== true && !this.HARD_HIDDEN_PROFILE_STATUSES.has(user?.profileStatus ?? "");
  }
  static isEmptyOnboardingProfile(user) {
    const statusText = `${user.statusText ?? ""}`.trim().toLowerCase();
    const completion = Math.max(0, Math.trunc(Number(user.completion) || 0));
    const profileFormVersion = Math.max(0, Math.trunc(Number(user.profileFormVersion) || 0));
    const profileDetails = Array.isArray(user.profileDetails) ? user.profileDetails : [];
    const hasProfileData = Boolean(`${user.name ?? ""}`.trim() || `${user.birthday ?? ""}`.trim() || `${user.city ?? ""}`.trim() || `${user.height ?? ""}`.trim() || `${user.physique ?? ""}`.trim() || (user.languages ?? []).some((language) => `${language ?? ""}`.trim().length > 0) || (user.images ?? []).some((image) => `${image ?? ""}`.trim().length > 0) || profileDetails.some((group) => (group.rows ?? []).some((row) => `${row.value ?? ""}`.trim().length > 0)));
    return !hasProfileData && (statusText === "new" || statusText === "new profile" || completion === 0 && profileFormVersion === 0);
  }
  static friendUsersForActiveUser(users, activeUserId, limit = 12) {
    const normalizedActiveUserId = activeUserId.trim();
    if (!normalizedActiveUserId || limit <= 0) {
      return [];
    }
    const seedableUsers = users.filter((user) => !this.isEmptyOnboardingProfile(user));
    const activeUser = seedableUsers.find((user) => user.id === normalizedActiveUserId) ?? null;
    return seedableUsers.filter((user) => user.id.trim().length > 0 && user.id !== normalizedActiveUserId).map((user) => ({
      user,
      score: this.friendAffinityScore(activeUser, user)
    })).sort((left, right) => right.score - left.score || left.user.id.localeCompare(right.user.id)).slice(0, Math.max(0, Math.trunc(limit))).map((entry) => entry.user);
  }
  static friendAffinityScore(activeUser, candidate) {
    const normalizedCandidateId = candidate.id.trim();
    if (!normalizedCandidateId) {
      return Number.NEGATIVE_INFINITY;
    }
    const normalizedActiveUserId = activeUser?.id?.trim() ?? "";
    const [firstId, secondId] = [normalizedActiveUserId, normalizedCandidateId].sort();
    const pairSeed = AppUtils.hashText(`friend-pair:${firstId}:${secondId}`);
    const cityBonus = activeUser?.city?.trim() && activeUser.city === candidate.city ? 220 : 0;
    const genderBonus = activeUser?.gender && activeUser.gender === candidate.gender ? 40 : 0;
    return 1e4 - pairSeed + cityBonus + genderBonus;
  }
};

export {
  UserProfileState
};
//# sourceMappingURL=chunk-HGLCBXAR.js.map
