// src/app/home/shared/home-game-filter.shared.ts
var GAME_FILTER_AGE_MIN = 18;
var GAME_FILTER_AGE_MAX = 120;
var GAME_FILTER_HEIGHT_MIN_CM = 40;
var GAME_FILTER_HEIGHT_MAX_CM = 250;
var DEFAULT_GAME_USER_FACET = {
  interests: [],
  values: [],
  smoking: "never",
  drinking: "never",
  workout: "weekly",
  pets: "all pets welcome",
  familyPlans: "open to both",
  children: "no",
  loveStyle: "slow-burn connection",
  communicationStyle: "direct + warm",
  sexualOrientation: "straight",
  religion: "not religious"
};
function parseGameHeightCm(height) {
  const parsed = Number.parseInt(height, 10);
  return Number.isFinite(parsed) ? parsed : null;
}
function createInitialGameFilter(_activeUser) {
  return {
    ageMin: GAME_FILTER_AGE_MIN,
    ageMax: GAME_FILTER_AGE_MAX,
    heightMinCm: GAME_FILTER_HEIGHT_MIN_CM,
    heightMaxCm: GAME_FILTER_HEIGHT_MAX_CM,
    interests: [],
    values: [],
    physiques: [],
    languages: [],
    genders: [],
    horoscopes: [],
    traitLabels: [],
    smoking: [],
    drinking: [],
    workout: [],
    pets: [],
    familyPlans: [],
    children: [],
    loveStyles: [],
    communicationStyles: [],
    sexualOrientations: [],
    religions: []
  };
}
function cloneGameFilter(filter) {
  return {
    ageMin: filter.ageMin,
    ageMax: filter.ageMax,
    heightMinCm: filter.heightMinCm,
    heightMaxCm: filter.heightMaxCm,
    interests: [...filter.interests],
    values: [...filter.values],
    physiques: [...filter.physiques],
    languages: [...filter.languages],
    genders: [...filter.genders],
    horoscopes: [...filter.horoscopes],
    traitLabels: [...filter.traitLabels],
    smoking: [...filter.smoking],
    drinking: [...filter.drinking],
    workout: [...filter.workout],
    pets: [...filter.pets],
    familyPlans: [...filter.familyPlans],
    children: [...filter.children],
    loveStyles: [...filter.loveStyles],
    communicationStyles: [...filter.communicationStyles],
    sexualOrientations: [...filter.sexualOrientations],
    religions: [...filter.religions]
  };
}
function normalizeGameFilter(filter) {
  const minAge = Math.max(GAME_FILTER_AGE_MIN, Math.min(filter.ageMin, filter.ageMax));
  const maxAge = Math.min(GAME_FILTER_AGE_MAX, Math.max(filter.ageMin, filter.ageMax));
  const minHeight = Math.max(GAME_FILTER_HEIGHT_MIN_CM, Math.min(filter.heightMinCm, filter.heightMaxCm));
  const maxHeight = Math.min(GAME_FILTER_HEIGHT_MAX_CM, Math.max(filter.heightMinCm, filter.heightMaxCm));
  return {
    ageMin: minAge,
    ageMax: maxAge,
    heightMinCm: minHeight,
    heightMaxCm: maxHeight,
    interests: [...filter.interests],
    values: [...filter.values],
    physiques: [...filter.physiques],
    languages: [...filter.languages],
    genders: [...filter.genders],
    horoscopes: [...filter.horoscopes],
    traitLabels: [...filter.traitLabels],
    smoking: [...filter.smoking],
    drinking: [...filter.drinking],
    workout: [...filter.workout],
    pets: [...filter.pets],
    familyPlans: [...filter.familyPlans],
    children: [...filter.children],
    loveStyles: [...filter.loveStyles],
    communicationStyles: [...filter.communicationStyles],
    sexualOrientations: [...filter.sexualOrientations],
    religions: [...filter.religions]
  };
}
function isGameFilterActive(filter, activeUser) {
  const baseline = createInitialGameFilter(activeUser);
  return filter.ageMin !== baseline.ageMin || filter.ageMax !== baseline.ageMax || filter.heightMinCm !== baseline.heightMinCm || filter.heightMaxCm !== baseline.heightMaxCm || filter.interests.length > 0 || filter.values.length > 0 || filter.physiques.length > 0 || filter.languages.length > 0 || filter.genders.length > 0 || filter.horoscopes.length > 0 || filter.traitLabels.length > 0 || filter.smoking.length > 0 || filter.drinking.length > 0 || filter.workout.length > 0 || filter.pets.length > 0 || filter.familyPlans.length > 0 || filter.children.length > 0 || filter.loveStyles.length > 0 || filter.communicationStyles.length > 0 || filter.sexualOrientations.length > 0 || filter.religions.length > 0;
}
function getGameUserFacet(user, userFacets) {
  return userFacets[user.id] ?? DEFAULT_GAME_USER_FACET;
}
function getGameUserInterests(user, userFacets) {
  return getGameUserFacet(user, userFacets).interests;
}
function getGameUserValues(user, userFacets) {
  return getGameUserFacet(user, userFacets).values;
}

export {
  GAME_FILTER_AGE_MIN,
  GAME_FILTER_AGE_MAX,
  GAME_FILTER_HEIGHT_MIN_CM,
  GAME_FILTER_HEIGHT_MAX_CM,
  parseGameHeightCm,
  createInitialGameFilter,
  cloneGameFilter,
  normalizeGameFilter,
  isGameFilterActive,
  getGameUserFacet,
  getGameUserInterests,
  getGameUserValues
};
//# sourceMappingURL=chunk-NJMZZHNL.js.map
