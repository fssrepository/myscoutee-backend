import { runE2eMongo } from '../../../shared/mongo-fixture.mjs';
export { queryE2eMongo } from '../../../shared/mongo-fixture.mjs';

export function e2eFixtureId(ctx, label) {
  const suffix = `${ctx.vars.runId ?? Date.now()}`
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .slice(-72);
  return `e2e-${label}-${suffix}`;
}

export async function seedE2eProfiles(ctx, profiles) {
  const normalized = profiles.map(profile => ({
    id: requiredText(profile.id, 'profile id'),
    name: requiredText(profile.name, 'profile name'),
    initials: requiredText(profile.initials, 'profile initials'),
    gender: profile.gender ?? 'woman',
    age: profile.age ?? 30,
    birthday: profile.birthday ?? '1996-01-01',
    city: profile.city ?? 'Bratislava',
    height: profile.height ?? '175 cm',
    physique: profile.physique ?? 'active',
    languages: profile.languages ?? ['en'],
    statusText: profile.statusText ?? 'E2E fixture',
    profileStatus: profile.profileStatus ?? 'public',
    locationCoordinates: profile.locationCoordinates ?? {
      latitude: 48.1486,
      longitude: 17.1077
    },
    images: profile.images ?? []
  }));
  const evalScript = `
const profiles = ${JSON.stringify(normalized)};
const emptyActivities = {
  game: 0,
  chats: 0,
  invitations: 0,
  events: 0,
  hosting: 0,
  cars: 0,
  accommodation: 0,
  supplies: 0,
  tickets: 0,
  contacts: 0,
  feedback: 0,
  chat: {
    all: 0,
    event: 0,
    subEvent: 0,
    group: 0,
    service: 0,
    appSupport: 0,
    supportCases: { pending: 0, warned: 0, picked: 0, solved: 0, blocked: 0, all: 0 }
  },
  event: { all: 0, active: 0, pending: 0, invitations: 0, hosting: 0, drafts: 0, trash: 0, watchlist: 0 },
  asset: { cars: 0, accommodation: 0, supplies: 0, tickets: 0, carsPending: 0, accommodationPending: 0, suppliesPending: 0 },
  feedbackCounts: { ownEvents: 0, pending: 0, feedbacked: 0, removed: 0 },
  adminJobs: 0,
  adminMetrics: 0,
  paymentRefundsPending: 0,
  notifications: 0
};
for (const profile of profiles) {
  const result = db.users.updateOne(
    { userId: profile.id },
    {
      $set: {
        userId: profile.id,
        name: profile.name,
        initials: profile.initials,
        gender: profile.gender,
        age: profile.age,
        birthday: profile.birthday,
        city: profile.city,
        height: profile.height,
        physique: profile.physique,
        languages: profile.languages,
        statusText: profile.statusText,
        profileStatus: profile.profileStatus,
        previousProfileStatus: '',
        deletedAtIso: '',
        status: 'A',
        operator: false,
        completion: 100,
        profileFormVersion: 2,
        locationCoordinates: profile.locationCoordinates,
        images: profile.images,
        activities: emptyActivities,
        notificationPreferences: { muted: false },
        accountPurgePendingCounterTracked: false,
        networkMeasurementExcluded: true,
        networkMeasurementExclusionReason: 'functional-e2e-fixture'
      },
      $setOnInsert: {
        _id: profile.id,
        syncKey: 'fixture:' + profile.id
      }
    },
    { upsert: true }
  );
  if (result.matchedCount + result.upsertedCount !== 1) {
    throw new Error('Expected one E2E profile fixture write for ' + profile.id);
  }
}
`;
  await runE2eMongo(ctx, evalScript);
}


function requiredText(value, label) {
  const normalized = `${value ?? ''}`.trim();
  if (!normalized) {
    throw new Error(`E2E ${label} is required`);
  }
  return normalized;
}
