import {
  assert,
  expectArray,
  expectBoolean,
  expectKeys,
  expectNumber,
  expectObject,
  expectOneOf,
  expectString
} from '../../../shared/assertions.mjs';

const REGISTRY_LIFECYCLES = [
  'UNCONFIGURED',
  'INSPECTED',
  'CONFIGURED',
  'REGISTERING',
  'REGISTERED',
  'ERROR'
];
const NODE_IDENTITY_STATES = ['MISSING', 'READY', 'INCOMPLETE', 'SIMULATED'];
const CONFIGURATION_CAPABILITIES = ['AVAILABLE', 'BACKEND_UNAVAILABLE'];
const FIREBASE_TEST_KINDS = ['FIREBASE_AUTHENTICATION', 'FIREBASE_MESSAGING'];
const TLS_CERTIFICATE_MODES = ['AUTOMATIC', 'MANUAL'];
const REPORT_STATUSES = ['PENDING', 'BLOCKED', 'ACCEPTED'];
const SYNC_STATES = ['BUSY', 'DORMANT', 'BLOCKED', 'PENDING', 'SYNCHRONIZED', 'ERROR'];
const WRITE_ONLY_CONFIGURATION_KEYS = new Set([
  'credential',
  'credentialEnvelope',
  'authenticationCredential',
  'authenticationCredentialEnvelope',
  'messagingCredential',
  'messagingCredentialEnvelope',
  'destinationToken',
  'browserReadinessToken',
  'browserConfigurationRevision',
  'browserAppId',
  'certificate',
  'privateKey'
]);

export function operatorHeaders(operatorUserId = 'operator-demo-dev') {
  return {
    'X-App-Session-Kind': 'demo',
    'X-Demo-User-Id': operatorUserId
  };
}

export function assertOperatorConfiguration(
  value,
  path = 'operator configuration',
  options = {}
) {
  const configuration = expectKeys(value, [
    'capability',
    'unavailableReason',
    'adminEmails',
    'privacyContact',
    'socialLinks',
    'branding',
    'payment',
    'firebase',
    'updatedAt'
  ], path);
  expectOneOf(configuration.capability, CONFIGURATION_CAPABILITIES, `${path}.capability`);
  expectNullableString(configuration.unavailableReason, `${path}.unavailableReason`);

  const adminEmails = expectArray(configuration.adminEmails, `${path}.adminEmails`);
  assert(adminEmails.length <= 32, `${path}.adminEmails should contain at most 32 values`);
  adminEmails.forEach((email, index) => {
    const normalized = expectString(email, `${path}.adminEmails[${index}]`);
    assert(normalized === normalized.toLowerCase(), `${path}.adminEmails[${index}] should be normalized`);
    assert(normalized.includes('@'), `${path}.adminEmails[${index}] should look like an e-mail address`);
  });
  assert(
    new Set(adminEmails).size === adminEmails.length,
    `${path}.adminEmails should not contain duplicates`
  );

  assertPrivacyContact(configuration.privacyContact, `${path}.privacyContact`);
  const socialLinks = assertSocialLinks(configuration.socialLinks, `${path}.socialLinks`);
  const branding = assertBranding(configuration.branding, `${path}.branding`);
  assert(
    JSON.stringify(branding.socialLinks) === JSON.stringify(socialLinks),
    `${path}.branding.socialLinks should match the top-level socialLinks`
  );
  assertPaymentConfiguration(configuration.payment, `${path}.payment`, {
    capability: configuration.capability
  });
  assertFirebaseConfiguration(configuration.firebase, `${path}.firebase`);
  expectNullableIsoTimestamp(configuration.updatedAt, `${path}.updatedAt`);
  assertNoWriteOnlyConfiguration(configuration, path, options.forbiddenValues ?? []);
  return configuration;
}

export function assertOperatorTlsConfiguration(
  value,
  path = 'operator TLS configuration',
  options = {}
) {
  const configuration = expectKeys(value, [
    'capability',
    'unavailableReason',
    'enabled',
    'mode',
    'domain',
    'contactEmail',
    'autoRenew',
    'certificateConfigured',
    'certificateIssuer',
    'certificateExpiresAt',
    'updatedAt'
  ], path);
  expectOneOf(configuration.capability, CONFIGURATION_CAPABILITIES, `${path}.capability`);
  expectNullableString(configuration.unavailableReason, `${path}.unavailableReason`);
  expectBoolean(configuration.enabled, `${path}.enabled`);
  expectOneOf(configuration.mode, TLS_CERTIFICATE_MODES, `${path}.mode`);
  const domain = expectString(configuration.domain, `${path}.domain`, { allowEmpty: true });
  const contactEmail = expectString(
    configuration.contactEmail,
    `${path}.contactEmail`,
    { allowEmpty: true }
  );
  expectBoolean(configuration.autoRenew, `${path}.autoRenew`);
  expectBoolean(configuration.certificateConfigured, `${path}.certificateConfigured`);
  expectNullableString(configuration.certificateIssuer, `${path}.certificateIssuer`);
  expectNullableIsoTimestamp(
    configuration.certificateExpiresAt,
    `${path}.certificateExpiresAt`
  );
  expectNullableIsoTimestamp(configuration.updatedAt, `${path}.updatedAt`);

  assert(domain === domain.toLowerCase(), `${path}.domain should be normalized`);
  assert(contactEmail === contactEmail.toLowerCase(), `${path}.contactEmail should be normalized`);
  if (configuration.enabled) {
    expectString(domain, `${path}.domain`);
  }
  if (configuration.enabled && configuration.mode === 'AUTOMATIC') {
    assert(contactEmail.includes('@'), `${path}.contactEmail should look like an e-mail address`);
  }
  if (configuration.mode === 'MANUAL') {
    assert(configuration.autoRenew === false, `${path}.autoRenew should be false in manual mode`);
  }
  assertNoWriteOnlyConfiguration(configuration, path, options.forbiddenValues ?? []);
  return configuration;
}

export function assertRegistryStatus(value, path = 'operator registry status', options = {}) {
  const status = expectKeys(value, [
    'mode',
    'lifecycle',
    'enabled',
    'simulation',
    'registryOptions',
    'candidateDefaults',
    'draftInspection',
    'selection',
    'nodeIdentity',
    'enrollment',
    'audit',
    'lastError'
  ], path);
  expectOneOf(status.mode, ['DEMO', 'REAL'], `${path}.mode`);
  if (options.expectedMode) {
    assert(status.mode === options.expectedMode, `${path}.mode should be ${options.expectedMode}`, status);
  }
  expectOneOf(status.lifecycle, REGISTRY_LIFECYCLES, `${path}.lifecycle`);
  expectBoolean(status.enabled, `${path}.enabled`);
  expectBoolean(status.simulation, `${path}.simulation`);

  const optionsList = expectArray(status.registryOptions, `${path}.registryOptions`);
  optionsList.forEach((item, index) => assertRegistryOption(item, `${path}.registryOptions[${index}]`));
  if (status.candidateDefaults !== null) {
    const defaults = expectKeys(status.candidateDefaults, ['baseUrl', 'registryScope'], `${path}.candidateDefaults`);
    expectNullableString(defaults.baseUrl, `${path}.candidateDefaults.baseUrl`);
    expectNullableString(defaults.registryScope, `${path}.candidateDefaults.registryScope`);
  }
  if (status.draftInspection !== null) {
    const draft = expectKeys(
      status.draftInspection,
      ['baseUrl', 'registryScope', 'inspectedAt', 'expiresAt'],
      `${path}.draftInspection`
    );
    expectAbsoluteHttpUrl(draft.baseUrl, `${path}.draftInspection.baseUrl`);
    expectString(draft.registryScope, `${path}.draftInspection.registryScope`);
    expectIsoTimestamp(draft.inspectedAt, `${path}.draftInspection.inspectedAt`);
    expectIsoTimestamp(draft.expiresAt, `${path}.draftInspection.expiresAt`);
  }
  if (status.selection !== null) {
    const selection = expectKeys(
      status.selection,
      ['baseUrl', 'registryIdentity', 'confirmedAt'],
      `${path}.selection`
    );
    expectAbsoluteHttpUrl(selection.baseUrl, `${path}.selection.baseUrl`);
    assertRegistryIdentity(selection.registryIdentity, `${path}.selection.registryIdentity`);
    expectIsoTimestamp(selection.confirmedAt, `${path}.selection.confirmedAt`);
  }

  const nodeIdentity = expectKeys(status.nodeIdentity, ['state', 'initializedAt'], `${path}.nodeIdentity`);
  expectOneOf(nodeIdentity.state, NODE_IDENTITY_STATES, `${path}.nodeIdentity.state`);
  expectNullableIsoTimestamp(nodeIdentity.initializedAt, `${path}.nodeIdentity.initializedAt`);
  if (status.enrollment !== null) {
    const enrollment = expectKeys(status.enrollment, [
      'deploymentCode',
      'installationTestBatchId',
      'installationTestAcceptedAt',
      'installationTestLedgerIndex',
      'completedAt'
    ], `${path}.enrollment`);
    expectString(enrollment.deploymentCode, `${path}.enrollment.deploymentCode`);
    expectString(enrollment.installationTestBatchId, `${path}.enrollment.installationTestBatchId`);
    expectIsoTimestamp(
      enrollment.installationTestAcceptedAt,
      `${path}.enrollment.installationTestAcceptedAt`
    );
    expectOptionalNonNegativeInteger(
      enrollment.installationTestLedgerIndex,
      `${path}.enrollment.installationTestLedgerIndex`
    );
    expectIsoTimestamp(enrollment.completedAt, `${path}.enrollment.completedAt`);
  }
  assertRegistryAudit(status.audit, `${path}.audit`);
  if (status.lastError !== null) {
    const error = expectKeys(status.lastError, ['code', 'message', 'at', 'retryable'], `${path}.lastError`);
    expectString(error.code, `${path}.lastError.code`);
    expectString(error.message, `${path}.lastError.message`);
    expectIsoTimestamp(error.at, `${path}.lastError.at`);
    expectBoolean(error.retryable, `${path}.lastError.retryable`);
  }

  if (status.lifecycle === 'UNCONFIGURED') {
    assert(status.enabled === false, `${path}.enabled should be false while unconfigured`, status);
    assert(status.selection === null, `${path}.selection should be null while unconfigured`, status);
    assert(status.enrollment === null, `${path}.enrollment should be null while unconfigured`, status);
  }
  if (status.lifecycle === 'REGISTERED') {
    assert(status.enabled === true, `${path}.enabled should be true while registered`, status);
    assert(status.selection !== null, `${path}.selection should be present while registered`, status);
    assert(status.enrollment !== null, `${path}.enrollment should be present while registered`, status);
  }
  return status;
}

export function assertRegistryInspection(value, path = 'operator registry inspection') {
  const inspection = expectKeys(value, [
    'inspectionToken',
    'expiresAt',
    'baseUrl',
    'simulation',
    'registryIdentity'
  ], path);
  const token = expectString(inspection.inspectionToken, `${path}.inspectionToken`);
  assert(token.startsWith('inspection_'), `${path}.inspectionToken should use the inspection token namespace`);
  expectIsoTimestamp(inspection.expiresAt, `${path}.expiresAt`);
  expectAbsoluteHttpUrl(inspection.baseUrl, `${path}.baseUrl`);
  expectBoolean(inspection.simulation, `${path}.simulation`);
  assertRegistryIdentity(inspection.registryIdentity, `${path}.registryIdentity`);
  return inspection;
}

export function assertCommunityProviders(value, path = 'operator community providers') {
  const providers = expectArray(value, path);
  const ids = new Set();
  providers.forEach((entry, index) => {
    const providerPath = `${path}[${index}]`;
    const provider = expectKeys(entry, [
      'id',
      'name',
      'purpose',
      'url',
      'configured',
      'available'
    ], providerPath);
    const id = expectString(provider.id, `${providerPath}.id`);
    assert(!ids.has(id), `${path} should not contain duplicate provider id ${id}`);
    ids.add(id);
    expectString(provider.name, `${providerPath}.name`);
    expectString(provider.purpose, `${providerPath}.purpose`);
    expectAbsoluteHttpsUrl(provider.url, `${providerPath}.url`);
    expectBoolean(provider.configured, `${providerPath}.configured`);
    expectBoolean(provider.available, `${providerPath}.available`);
  });
  return providers;
}

export function assertOperatorRevenue(value, path = 'operator revenue') {
  const revenue = expectKeys(value, [
    'generatedAtIso',
    'rulesetVersion',
    'commissionRateBasisPoints',
    'currencies'
  ], path);
  expectIsoTimestamp(revenue.generatedAtIso, `${path}.generatedAtIso`);
  expectString(revenue.rulesetVersion, `${path}.rulesetVersion`);
  const commissionRate = expectNonNegativeInteger(
    revenue.commissionRateBasisPoints,
    `${path}.commissionRateBasisPoints`
  );
  assert(commissionRate <= 10_000, `${path}.commissionRateBasisPoints should not exceed 10000`);

  const currencies = expectArray(revenue.currencies, `${path}.currencies`);
  const currencyCodes = new Set();
  currencies.forEach((entry, index) => {
    const currencyPath = `${path}.currencies[${index}]`;
    const currency = expectKeys(entry, [
      'currencyCode',
      'fractionDigits',
      'payableEvents',
      'payableAssets',
      'projectedEventMinor',
      'projectedAssetMinor',
      'capturedPaymentMinor',
      'refundedPaymentMinor',
      'netPaymentMinor',
      'commissionBasisMinor',
      'estimatedCommissionMinor',
      'paymentCount',
      'payingUsers',
      'eventBuyers',
      'assetBorrowers',
      'assetCategories',
      'timeline'
    ], currencyPath);
    const code = expectString(currency.currencyCode, `${currencyPath}.currencyCode`);
    assert(/^[A-Z]{3}$/.test(code), `${currencyPath}.currencyCode should be an ISO-style code`);
    assert(!currencyCodes.has(code), `${path}.currencies should not contain duplicate ${code}`);
    currencyCodes.add(code);
    const fractionDigits = expectNonNegativeInteger(currency.fractionDigits, `${currencyPath}.fractionDigits`);
    assert(fractionDigits <= 6, `${currencyPath}.fractionDigits should be at most 6`);
    for (const field of [
      'payableEvents',
      'payableAssets',
      'projectedEventMinor',
      'projectedAssetMinor',
      'capturedPaymentMinor',
      'refundedPaymentMinor',
      'netPaymentMinor',
      'commissionBasisMinor',
      'estimatedCommissionMinor',
      'paymentCount',
      'payingUsers',
      'eventBuyers',
      'assetBorrowers'
    ]) {
      expectNonNegativeInteger(currency[field], `${currencyPath}.${field}`);
    }
    assert(
      currency.netPaymentMinor
        === currency.capturedPaymentMinor - currency.refundedPaymentMinor,
      `${currencyPath}.netPaymentMinor should equal captured minus refunded`
    );
    assert(
      currency.commissionBasisMinor === currency.netPaymentMinor,
      `${currencyPath}.commissionBasisMinor should equal netPaymentMinor`
    );
    assert(
      currency.estimatedCommissionMinor
        === commissionMinor(currency.commissionBasisMinor, commissionRate),
      `${currencyPath}.estimatedCommissionMinor should use the advertised commission rate`
    );

    const categories = assertRevenueAssetCategories(
      currency.assetCategories,
      `${currencyPath}.assetCategories`
    );
    assert(
      categories.reduce((sum, category) => sum + category.payableAssets, 0)
        === currency.payableAssets,
      `${currencyPath}.assetCategories should account for every payable asset`
    );
    assert(
      categories.reduce((sum, category) => sum + category.projectedMinor, 0)
        === currency.projectedAssetMinor,
      `${currencyPath}.assetCategories should account for projected asset revenue`
    );

    const timeline = assertRevenueTimeline(
      currency.timeline,
      `${currencyPath}.timeline`,
      commissionRate
    );
    assert(timeline.length === 14, `${currencyPath}.timeline should contain 14 UTC days`);
    const generatedDay = new Date(revenue.generatedAtIso).toISOString().slice(0, 10);
    timeline.forEach((point, pointIndex) => {
      const expectedDay = new Date(`${generatedDay}T00:00:00.000Z`);
      expectedDay.setUTCDate(expectedDay.getUTCDate() - (timeline.length - 1 - pointIndex));
      assert(
        point.dateKey === expectedDay.toISOString().slice(0, 10),
        `${currencyPath}.timeline[${pointIndex}].dateKey should be consecutive`
      );
    });
  });
  return revenue;
}

export function assertMeasurementReportPage(value, path = 'operator measurement reports') {
  return assertReportPage(value, path, assertMeasurementReport);
}

export function assertRevenueReportPage(value, path = 'operator revenue reports') {
  return assertReportPage(value, path, assertRevenueReport);
}

export function assertOperatorUpdateOverview(value, path = 'operator update overview') {
  const overview = expectKeys(value, ['enabled', 'currentVersion', 'latestJob'], path);
  expectBoolean(overview.enabled, `${path}.enabled`);
  expectString(overview.currentVersion, `${path}.currentVersion`, { allowEmpty: true });
  if (overview.latestJob !== null) {
    assertOperatorUpdateJob(overview.latestJob, `${path}.latestJob`);
  }
  return overview;
}

export function assertConfigurationTestResult(value, path = 'operator configuration test') {
  const result = expectKeys(value, ['kind', 'success', 'message', 'testedAt', 'firebase'], path);
  expectOneOf(result.kind, FIREBASE_TEST_KINDS, `${path}.kind`);
  expectBoolean(result.success, `${path}.success`);
  expectString(result.message, `${path}.message`);
  expectIsoTimestamp(result.testedAt, `${path}.testedAt`);
  if (result.firebase !== null) {
    assertFirebaseConfiguration(result.firebase, `${path}.firebase`);
  }
  assertNoWriteOnlyConfiguration(result, path);
  return result;
}

export function assertOperatorSync(value, path = 'operator synchronization') {
  const sync = expectKeys(value, [
    'state',
    'code',
    'message',
    'materialized',
    'submitted',
    'accepted',
    'pending',
    'blocked'
  ], path);
  expectOneOf(sync.state, SYNC_STATES, `${path}.state`);
  expectNullableString(sync.code, `${path}.code`);
  expectString(sync.message, `${path}.message`);
  for (const field of ['materialized', 'submitted', 'accepted', 'pending', 'blocked']) {
    expectNonNegativeInteger(sync[field], `${path}.${field}`);
  }
  const timestampKey = Object.prototype.hasOwnProperty.call(sync, 'synchronizedAtIso')
    ? 'synchronizedAtIso'
    : 'synchronizedAt';
  expectIsoTimestamp(sync[timestampKey], `${path}.${timestampKey}`);
  return sync;
}

export function assertClaimOverview(value, path = 'operator claim overview') {
  const overview = expectKeys(value, ['status', 'submission'], path);
  const status = expectKeys(overview.status, [
    'claimed',
    'claimedAt',
    'claimantUserId',
    'claimantName',
    'claimantAvatarUrl',
    'operatorGroupId',
    'activeLinkId',
    'sharePercent',
    'shareNumerator',
    'shareDenominator',
    'verificationCapability',
    'verificationUnavailableReason',
    'verificationStatus',
    'verificationSubmittedAt',
    'legalName',
    'eligibilityStatus'
  ], `${path}.status`);
  expectBoolean(status.claimed, `${path}.status.claimed`);
  for (const field of [
    'claimedAt',
    'claimantUserId',
    'claimantName',
    'claimantAvatarUrl',
    'operatorGroupId',
    'activeLinkId',
    'verificationUnavailableReason',
    'verificationStatus',
    'verificationSubmittedAt',
    'legalName'
  ]) {
    expectNullableString(status[field], `${path}.status.${field}`);
  }
  expectNumber(status.sharePercent, `${path}.status.sharePercent`);
  expectString(status.shareNumerator, `${path}.status.shareNumerator`, { allowEmpty: true });
  expectString(status.shareDenominator, `${path}.status.shareDenominator`, { allowEmpty: true });
  expectString(status.verificationCapability, `${path}.status.verificationCapability`);
  expectString(status.eligibilityStatus, `${path}.status.eligibilityStatus`);
  if (status.claimed) {
    assert(status.operatorGroupId, `${path}.status.operatorGroupId should be present for a claim`);
  }
  if (overview.submission !== null) {
    assertClaimSubmission(overview.submission, `${path}.submission`);
  }
  return overview;
}

export function assertLeaderboardPage(value, path = 'operator leaderboard') {
  const page = expectKeys(value, ['snapshot', 'view', 'items', 'nextCursor'], path);
  assertLeaderboardSnapshot(page.snapshot, `${path}.snapshot`);
  expectOneOf(page.view, ['founder', 'claimed', 'unclaimed'], `${path}.view`);
  const items = expectArray(page.items, `${path}.items`);
  items.forEach((item, index) => assertLeaderboardRow(item, `${path}.items[${index}]`));
  expectNullableString(page.nextCursor, `${path}.nextCursor`);
  return page;
}

export function assertAnnouncementPage(value, path = 'operator announcements') {
  const page = expectKeys(value, ['snapshot', 'items', 'nextCursor'], path);
  const snapshot = expectKeys(page.snapshot, [
    'snapshotId',
    'asOf',
    'throughSequence',
    'announcementHeadHash',
    'kind',
    'severity',
    'channel',
    'includeExpired',
    'createdAt',
    'snapshotHash'
  ], `${path}.snapshot`);
  expectString(snapshot.snapshotId, `${path}.snapshot.snapshotId`);
  expectIsoTimestamp(snapshot.asOf, `${path}.snapshot.asOf`);
  expectNonNegativeInteger(snapshot.throughSequence, `${path}.snapshot.throughSequence`);
  expectString(snapshot.announcementHeadHash, `${path}.snapshot.announcementHeadHash`, { allowEmpty: true });
  for (const field of ['kind', 'severity', 'channel']) {
    expectString(snapshot[field], `${path}.snapshot.${field}`, { allowEmpty: true });
  }
  expectBoolean(snapshot.includeExpired, `${path}.snapshot.includeExpired`);
  expectIsoTimestamp(snapshot.createdAt, `${path}.snapshot.createdAt`);
  expectString(snapshot.snapshotHash, `${path}.snapshot.snapshotHash`);
  const items = expectArray(page.items, `${path}.items`);
  items.forEach((item, index) => assertAnnouncement(item, `${path}.items[${index}]`));
  expectNullableString(page.nextCursor, `${path}.nextCursor`);
  return page;
}

export function assertNoWriteOnlyConfiguration(value, path = 'value', forbiddenValues = []) {
  visit(value, path, (entry, entryPath, key) => {
    assert(
      !WRITE_ONLY_CONFIGURATION_KEYS.has(key),
      `${entryPath} must not expose a write-only configuration field`
    );
    if (typeof entry === 'string') {
      for (const forbiddenValue of forbiddenValues.filter(Boolean)) {
        assert(
          !entry.includes(forbiddenValue),
          `${entryPath} must not echo a write-only secret`
        );
      }
    }
  });
}

function assertPrivacyContact(value, path) {
  const contact = expectKeys(value, [
    'configured',
    'dataControllerName',
    'privacyContactEmail'
  ], path);
  expectBoolean(contact.configured, `${path}.configured`);
  expectString(contact.dataControllerName, `${path}.dataControllerName`, { allowEmpty: true });
  expectString(contact.privacyContactEmail, `${path}.privacyContactEmail`, { allowEmpty: true });
  if (contact.configured) {
    expectString(contact.dataControllerName, `${path}.dataControllerName`);
    const email = expectString(contact.privacyContactEmail, `${path}.privacyContactEmail`);
    assert(email.includes('@'), `${path}.privacyContactEmail should look like an e-mail address`);
  }
}

function assertSocialLinks(value, path) {
  const links = expectArray(value, path);
  assert(links.length <= 12, `${path} should contain at most 12 links`);
  const providers = new Set();
  const urls = new Set();
  links.forEach((entry, index) => {
    const linkPath = `${path}[${index}]`;
    const link = expectKeys(entry, ['provider', 'label', 'url', 'icon', 'handle'], linkPath);
    const provider = expectString(link.provider, `${linkPath}.provider`);
    assert(/^[a-z0-9][a-z0-9._-]*$/.test(provider), `${linkPath}.provider should be normalized`);
    assert(!providers.has(provider), `${path} should not contain duplicate provider ${provider}`);
    providers.add(provider);
    expectString(link.label, `${linkPath}.label`);
    const url = expectAbsoluteHttpsUrl(link.url, `${linkPath}.url`);
    assert(!urls.has(url), `${path} should not contain duplicate URL ${url}`);
    urls.add(url);
    expectNullableString(link.icon, `${linkPath}.icon`);
    expectNullableString(link.handle, `${linkPath}.handle`);
  });
  return links;
}

function assertBranding(value, path) {
  const branding = expectKeys(value, [
    'productName',
    'logoCharacterIndex',
    'homeLabel',
    'logoUrl',
    'themePreset',
    'revision',
    'socialLinks'
  ], path);
  const productName = expectString(branding.productName, `${path}.productName`);
  if (branding.logoCharacterIndex !== null) {
    const index = expectNonNegativeInteger(branding.logoCharacterIndex, `${path}.logoCharacterIndex`);
    assert(
      index < [...productName].length,
      `${path}.logoCharacterIndex should address a character in productName`
    );
  }
  expectString(branding.homeLabel, `${path}.homeLabel`);
  expectString(branding.logoUrl, `${path}.logoUrl`, { allowEmpty: true });
  expectString(branding.themePreset, `${path}.themePreset`);
  expectNonNegativeInteger(branding.revision, `${path}.revision`);
  assertSocialLinks(branding.socialLinks, `${path}.socialLinks`);
  return branding;
}

function assertPaymentConfiguration(value, path, options = {}) {
  const payment = expectKeys(value, [
    'availableProviders',
    'providerId',
    'publicBaseUrl',
    'merchantAccount',
    'credentialConfigured',
    'credentialMask'
  ], path);
  const providers = expectArray(payment.availableProviders, `${path}.availableProviders`);
  const providerIds = new Set();
  providers.forEach((entry, index) => {
    const providerPath = `${path}.availableProviders[${index}]`;
    const provider = expectKeys(entry, ['id', 'label', 'logoUrl', 'logoAlt', 'palette'], providerPath);
    const id = expectString(provider.id, `${providerPath}.id`);
    assert(!providerIds.has(id), `${path}.availableProviders should not contain duplicate ${id}`);
    providerIds.add(id);
    expectString(provider.label, `${providerPath}.label`);
    expectNullableString(provider.logoUrl, `${providerPath}.logoUrl`);
    expectNullableString(provider.logoAlt, `${providerPath}.logoAlt`);
    expectNullableString(provider.palette, `${providerPath}.palette`);
  });
  expectNullableString(payment.providerId, `${path}.providerId`);
  if (payment.providerId !== null && options.capability === 'AVAILABLE') {
    assert(providerIds.has(payment.providerId), `${path}.providerId should reference an available provider`);
  }
  if (payment.publicBaseUrl !== null) {
    expectAbsoluteHttpUrl(payment.publicBaseUrl, `${path}.publicBaseUrl`);
  }
  expectNullableString(payment.merchantAccount, `${path}.merchantAccount`);
  expectBoolean(payment.credentialConfigured, `${path}.credentialConfigured`);
  expectNullableString(payment.credentialMask, `${path}.credentialMask`);
  if (payment.credentialConfigured) {
    assert(payment.providerId, `${path}.providerId should be present when a credential is configured`);
    assert(payment.publicBaseUrl, `${path}.publicBaseUrl should be present when a credential is configured`);
    assert(payment.credentialMask?.startsWith('••••'), `${path}.credentialMask should be masked`);
    if (payment.providerId === 'barion') {
      assert(payment.merchantAccount?.includes('@'), `${path}.merchantAccount should be an e-mail for Barion`);
    }
  } else {
    assert(payment.credentialMask === null, `${path}.credentialMask should be null without a credential`);
  }
}

function assertFirebaseConfiguration(value, path) {
  const firebase = expectKeys(value, [
    'projectId',
    'authenticationCredentialConfigured',
    'messagingCredentialConfigured',
    'publicConfiguration',
    'active',
    'readyToActivate',
    'authenticationTestedAt',
    'messagingTestedAt',
    'activatedAt'
  ], path);
  expectString(firebase.projectId, `${path}.projectId`, { allowEmpty: true });
  expectBoolean(firebase.authenticationCredentialConfigured, `${path}.authenticationCredentialConfigured`);
  expectBoolean(firebase.messagingCredentialConfigured, `${path}.messagingCredentialConfigured`);
  const publicConfiguration = expectKeys(firebase.publicConfiguration, [
    'revision',
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
    'measurementId',
    'vapidKey'
  ], `${path}.publicConfiguration`);
  expectNonNegativeInteger(publicConfiguration.revision, `${path}.publicConfiguration.revision`);
  for (const field of [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
    'measurementId',
    'vapidKey'
  ]) {
    expectString(publicConfiguration[field], `${path}.publicConfiguration.${field}`, { allowEmpty: true });
  }
  assert(
    firebase.projectId === publicConfiguration.projectId,
    `${path}.projectId should match publicConfiguration.projectId`
  );
  expectBoolean(firebase.active, `${path}.active`);
  expectBoolean(firebase.readyToActivate, `${path}.readyToActivate`);
  expectNullableIsoTimestamp(firebase.authenticationTestedAt, `${path}.authenticationTestedAt`);
  expectNullableIsoTimestamp(firebase.messagingTestedAt, `${path}.messagingTestedAt`);
  expectNullableIsoTimestamp(firebase.activatedAt, `${path}.activatedAt`);
  if (firebase.active) {
    assert(firebase.readyToActivate, `${path}.readyToActivate should be true while Firebase is active`);
  }
}

function assertRegistryOption(value, path) {
  const option = expectKeys(value, ['id', 'label', 'baseUrl', 'registryScope', 'selected'], path);
  expectString(option.id, `${path}.id`);
  expectString(option.label, `${path}.label`);
  expectAbsoluteHttpUrl(option.baseUrl, `${path}.baseUrl`);
  expectString(option.registryScope, `${path}.registryScope`);
  expectBoolean(option.selected, `${path}.selected`);
}

function assertRegistryIdentity(value, path) {
  const identity = expectKeys(value, ['identityEndpoint', 'protocolVersion', 'registryScope'], path);
  expectAbsoluteHttpUrl(identity.identityEndpoint, `${path}.identityEndpoint`);
  expectString(identity.protocolVersion, `${path}.protocolVersion`);
  expectString(identity.registryScope, `${path}.registryScope`);
}

function assertRegistryAudit(value, path) {
  const audit = expectKeys(value, [
    'createdAt',
    'updatedAt',
    'lastAttemptAt',
    'lastSuccessAt',
    'disabledAt',
    'updatedBy'
  ], path);
  for (const field of ['createdAt', 'updatedAt', 'lastAttemptAt', 'lastSuccessAt', 'disabledAt']) {
    expectNullableIsoTimestamp(audit[field], `${path}.${field}`);
  }
  expectNullableString(audit.updatedBy, `${path}.updatedBy`);
}

function assertReportPage(value, path, itemAssertion) {
  const page = expectKeys(value, ['items', 'page', 'size', 'totalElements', 'totalPages'], path);
  const items = expectArray(page.items, `${path}.items`);
  items.forEach((item, index) => itemAssertion(item, `${path}.items[${index}]`));
  const pageNumber = expectNonNegativeInteger(page.page, `${path}.page`);
  const size = expectNonNegativeInteger(page.size, `${path}.size`);
  const totalElements = expectNonNegativeInteger(page.totalElements, `${path}.totalElements`);
  const totalPages = expectNonNegativeInteger(page.totalPages, `${path}.totalPages`);
  assert(size > 0, `${path}.size should be positive`);
  assert(items.length <= size, `${path}.items should not exceed the requested page size`);
  assert(totalElements >= items.length, `${path}.totalElements should cover returned items`);
  assert(
    totalPages === Math.ceil(totalElements / size),
    `${path}.totalPages should match totalElements and size`
  );
  if (items.length > 0) {
    assert(pageNumber < totalPages, `${path}.page should identify a populated page`);
  }
  return page;
}

function assertMeasurementReport(value, path) {
  const report = expectKeys(value, [
    'id',
    'period',
    'windowStart',
    'windowEnd',
    'revision',
    'rulesetVersion',
    'qualifiedMauCount',
    'actionCount',
    'status',
    'attemptCount',
    'nextRetryAt',
    'failureCode',
    'failureMessage',
    'batchId',
    'acceptedAt',
    'createdAt',
    'updatedAt'
  ], path);
  expectString(report.id, `${path}.id`);
  expectString(report.period, `${path}.period`);
  expectIsoTimestamp(report.windowStart, `${path}.windowStart`);
  expectIsoTimestamp(report.windowEnd, `${path}.windowEnd`);
  expectNonNegativeInteger(report.revision, `${path}.revision`);
  expectString(report.rulesetVersion, `${path}.rulesetVersion`);
  expectNonNegativeInteger(report.qualifiedMauCount, `${path}.qualifiedMauCount`);
  expectNonNegativeInteger(report.actionCount, `${path}.actionCount`);
  expectOneOf(report.status, REPORT_STATUSES, `${path}.status`);
  expectNonNegativeInteger(report.attemptCount, `${path}.attemptCount`);
  for (const field of ['nextRetryAt', 'acceptedAt', 'createdAt', 'updatedAt']) {
    expectNullableIsoTimestamp(report[field], `${path}.${field}`);
  }
  for (const field of ['failureCode', 'failureMessage', 'batchId']) {
    expectNullableString(report[field], `${path}.${field}`);
  }
}

function assertRevenueReport(value, path) {
  const report = expectKeys(value, [
    'id',
    'period',
    'revision',
    'supersedesBatchId',
    'rulesetVersion',
    'commissionRateBasisPoints',
    'currencies',
    'payloadHash',
    'status',
    'attemptCount',
    'nextRetryAt',
    'failureCode',
    'failureMessage',
    'failureRetryable',
    'failedAt',
    'acceptedBatchId',
    'acceptedAt',
    'createdAt',
    'updatedAt'
  ], path);
  expectString(report.id, `${path}.id`);
  expectString(report.period, `${path}.period`);
  expectNonNegativeInteger(report.revision, `${path}.revision`);
  expectNullableString(report.supersedesBatchId, `${path}.supersedesBatchId`);
  expectString(report.rulesetVersion, `${path}.rulesetVersion`);
  expectNonNegativeInteger(report.commissionRateBasisPoints, `${path}.commissionRateBasisPoints`);
  const currencies = expectArray(report.currencies, `${path}.currencies`);
  currencies.forEach((currency, index) => {
    const currencyPath = `${path}.currencies[${index}]`;
    const item = expectKeys(currency, [
      'currencyCode',
      'fractionDigits',
      'capturedMinor',
      'refundedMinor',
      'netMinor',
      'commissionBasisMinor',
      'estimatedCommissionMinor',
      'paymentCount'
    ], currencyPath);
    expectString(item.currencyCode, `${currencyPath}.currencyCode`);
    for (const field of [
      'fractionDigits',
      'capturedMinor',
      'refundedMinor',
      'netMinor',
      'commissionBasisMinor',
      'estimatedCommissionMinor',
      'paymentCount'
    ]) {
      expectNonNegativeInteger(item[field], `${currencyPath}.${field}`);
    }
  });
  expectString(report.payloadHash, `${path}.payloadHash`);
  expectOneOf(report.status, REPORT_STATUSES, `${path}.status`);
  expectNonNegativeInteger(report.attemptCount, `${path}.attemptCount`);
  for (const field of [
    'nextRetryAt',
    'failedAt',
    'acceptedAt',
    'createdAt',
    'updatedAt'
  ]) {
    expectNullableIsoTimestamp(report[field], `${path}.${field}`);
  }
  for (const field of ['failureCode', 'failureMessage', 'acceptedBatchId']) {
    expectNullableString(report[field], `${path}.${field}`);
  }
  if (report.failureRetryable !== null) {
    expectBoolean(report.failureRetryable, `${path}.failureRetryable`);
  }
}

function assertRevenueAssetCategories(value, path) {
  const categories = expectArray(value, path);
  categories.forEach((entry, index) => {
    const categoryPath = `${path}[${index}]`;
    const category = expectKeys(entry, [
      'key',
      'labelKey',
      'label',
      'icon',
      'tone',
      'payableAssets',
      'projectedMinor'
    ], categoryPath);
    for (const field of ['key', 'icon', 'tone']) {
      expectString(category[field], `${categoryPath}.${field}`);
    }
    expectNullableString(category.labelKey, `${categoryPath}.labelKey`);
    expectNullableString(category.label, `${categoryPath}.label`);
    assert(
      Boolean(category.labelKey) !== Boolean(category.label),
      `${categoryPath} should expose exactly one of labelKey or label`
    );
    expectNonNegativeInteger(category.payableAssets, `${categoryPath}.payableAssets`);
    expectNonNegativeInteger(category.projectedMinor, `${categoryPath}.projectedMinor`);
  });
  return categories;
}

function assertRevenueTimeline(value, path, commissionRate) {
  const timeline = expectArray(value, path);
  timeline.forEach((entry, index) => {
    const pointPath = `${path}[${index}]`;
    const point = expectKeys(entry, [
      'dateKey',
      'label',
      'payableEvents',
      'payableAssets',
      'projectedEventMinor',
      'projectedAssetMinor',
      'capturedPaymentMinor',
      'refundedPaymentMinor',
      'netPaymentMinor',
      'commissionBasisMinor',
      'estimatedCommissionMinor',
      'paymentCount',
      'payingUsers'
    ], pointPath);
    expectString(point.dateKey, `${pointPath}.dateKey`);
    expectString(point.label, `${pointPath}.label`);
    for (const field of [
      'payableEvents',
      'payableAssets',
      'projectedEventMinor',
      'projectedAssetMinor',
      'capturedPaymentMinor',
      'refundedPaymentMinor',
      'netPaymentMinor',
      'commissionBasisMinor',
      'estimatedCommissionMinor',
      'paymentCount',
      'payingUsers'
    ]) {
      expectNonNegativeInteger(point[field], `${pointPath}.${field}`);
    }
    assert(point.label === point.dateKey, `${pointPath}.label should match dateKey`);
    assert(
      point.netPaymentMinor
        === point.capturedPaymentMinor - point.refundedPaymentMinor,
      `${pointPath}.netPaymentMinor should equal captured minus refunded`
    );
    assert(
      point.commissionBasisMinor === point.netPaymentMinor,
      `${pointPath}.commissionBasisMinor should equal netPaymentMinor`
    );
    assert(
      point.estimatedCommissionMinor
        === commissionMinor(point.commissionBasisMinor, commissionRate),
      `${pointPath}.estimatedCommissionMinor should use the advertised commission rate`
    );
  });
  return timeline;
}

function commissionMinor(basisMinor, rateBasisPoints) {
  return Number(
    (BigInt(basisMinor) * BigInt(rateBasisPoints)) / 10_000n
  );
}

function assertOperatorUpdateJob(value, path) {
  const job = expectKeys(value, [
    'schemaVersion',
    'jobId',
    'phase',
    'percent',
    'message',
    'updatedAt',
    'requestedAt',
    'requestedBy',
    'manifestHash',
    'currentVersion',
    'targetVersion',
    'channel',
    'artifactSha256',
    'backupPath'
  ], path);
  expectNonNegativeInteger(job.schemaVersion, `${path}.schemaVersion`);
  expectString(job.jobId, `${path}.jobId`);
  expectString(job.phase, `${path}.phase`);
  const percent = expectNonNegativeInteger(job.percent, `${path}.percent`);
  assert(percent <= 100, `${path}.percent should not exceed 100`);
  expectNullableString(job.message, `${path}.message`);
  expectIsoTimestamp(job.updatedAt, `${path}.updatedAt`);
  expectIsoTimestamp(job.requestedAt, `${path}.requestedAt`);
  for (const field of [
    'requestedBy',
    'manifestHash',
    'currentVersion',
    'targetVersion',
    'channel',
    'artifactSha256'
  ]) {
    expectString(job[field], `${path}.${field}`);
  }
  expectNullableString(job.backupPath, `${path}.backupPath`);
}

function assertClaimSubmission(value, path) {
  const submission = expectKeys(value, [
    'legalName',
    'registrationNumber',
    'jurisdiction',
    'registeredAddress',
    'website',
    'verificationContactName',
    'verificationContactRole',
    'verificationContactEmail',
    'authorityAttested'
  ], path);
  for (const field of [
    'legalName',
    'registrationNumber',
    'jurisdiction',
    'registeredAddress',
    'website',
    'verificationContactName',
    'verificationContactRole',
    'verificationContactEmail'
  ]) {
    expectNullableString(submission[field], `${path}.${field}`);
  }
  expectBoolean(submission.authorityAttested, `${path}.authorityAttested`);
}

function assertLeaderboardSnapshot(value, path) {
  const snapshot = expectKeys(value, [
    'snapshotId',
    'formulaVersion',
    'rulesetVersion',
    'throughPeriod',
    'throughLedgerIndex',
    'throughAuditIndex',
    'throughReviewIndex',
    'throughEligibilityIndex',
    'ledgerHeadHash',
    'auditHeadHash',
    'reviewHeadHash',
    'eligibilityHeadHash',
    'founderUnitsNumerator',
    'founderUnitsDenominator',
    'founderShareNumerator',
    'founderShareDenominator',
    'measuredWeightNumerator',
    'measuredWeightDenominator',
    'claimedWeightNumerator',
    'claimedWeightDenominator',
    'createdAt',
    'snapshotHash'
  ], path);
  for (const field of [
    'snapshotId',
    'formulaVersion',
    'rulesetVersion',
    'throughPeriod',
    'ledgerHeadHash',
    'auditHeadHash',
    'reviewHeadHash',
    'eligibilityHeadHash',
    'founderUnitsNumerator',
    'founderUnitsDenominator',
    'founderShareNumerator',
    'founderShareDenominator',
    'measuredWeightNumerator',
    'measuredWeightDenominator',
    'claimedWeightNumerator',
    'claimedWeightDenominator',
    'snapshotHash'
  ]) {
    expectString(snapshot[field], `${path}.${field}`, { allowEmpty: true });
  }
  for (const field of [
    'throughLedgerIndex',
    'throughAuditIndex',
    'throughReviewIndex',
    'throughEligibilityIndex'
  ]) {
    expectNonNegativeInteger(snapshot[field], `${path}.${field}`);
  }
  expectIsoTimestamp(snapshot.createdAt, `${path}.createdAt`);
}

function assertLeaderboardRow(value, path) {
  const row = expectKeys(value, [
    'rowId',
    'view',
    'groupId',
    'label',
    'avatarUrl',
    'claimState',
    'eligibilityStatus',
    'deploymentCount',
    'weightNumerator',
    'weightDenominator',
    'shareNumerator',
    'shareDenominator'
  ], path);
  expectString(row.rowId, `${path}.rowId`);
  expectOneOf(row.view, ['founder', 'claimed', 'unclaimed'], `${path}.view`);
  expectNullableString(row.groupId, `${path}.groupId`);
  expectString(row.label, `${path}.label`);
  expectNullableString(row.avatarUrl, `${path}.avatarUrl`);
  expectString(row.claimState, `${path}.claimState`);
  expectString(row.eligibilityStatus, `${path}.eligibilityStatus`);
  expectNonNegativeInteger(row.deploymentCount, `${path}.deploymentCount`);
  for (const field of [
    'weightNumerator',
    'weightDenominator',
    'shareNumerator',
    'shareDenominator'
  ]) {
    expectString(row[field], `${path}.${field}`);
  }
}

function assertAnnouncement(value, path) {
  const announcement = expectKeys(value, [
    'sequence',
    'announcementId',
    'kind',
    'severity',
    'publishedAt',
    'expiresAt',
    'titleKey',
    'bodyKey',
    'localizations',
    'links',
    'updateManifest',
    'updateManifestHash',
    'announcementHash'
  ], path);
  expectNonNegativeInteger(announcement.sequence, `${path}.sequence`);
  for (const field of ['announcementId', 'kind', 'severity', 'announcementHash']) {
    expectString(announcement[field], `${path}.${field}`);
  }
  expectIsoTimestamp(announcement.publishedAt, `${path}.publishedAt`);
  expectNullableIsoTimestamp(announcement.expiresAt, `${path}.expiresAt`);
  expectNullableString(announcement.titleKey, `${path}.titleKey`);
  expectNullableString(announcement.bodyKey, `${path}.bodyKey`);
  expectArray(announcement.localizations, `${path}.localizations`);
  expectArray(announcement.links, `${path}.links`);
  expectNullableString(announcement.updateManifestHash, `${path}.updateManifestHash`);
  if (announcement.updateManifest !== null) {
    expectObject(announcement.updateManifest, `${path}.updateManifest`);
  }
}

function expectNonNegativeInteger(value, path) {
  const number = expectNumber(value, path);
  assert(Number.isSafeInteger(number) && number >= 0, `${path} should be a non-negative integer`, { value });
  return number;
}

function expectOptionalNonNegativeInteger(value, path) {
  if (value === null || value === undefined) {
    return value;
  }
  return expectNonNegativeInteger(value, path);
}

function expectNullableString(value, path) {
  if (value === null || value === undefined) {
    return value;
  }
  return expectString(value, path, { allowEmpty: true });
}

function expectIsoTimestamp(value, path) {
  const timestamp = expectString(value, path);
  assert(!Number.isNaN(Date.parse(timestamp)), `${path} should be an ISO timestamp`, { value });
  return timestamp;
}

function expectNullableIsoTimestamp(value, path) {
  if (value === null || value === undefined) {
    return value;
  }
  return expectIsoTimestamp(value, path);
}

function expectAbsoluteHttpUrl(value, path) {
  const raw = expectString(value, path);
  let url;
  try {
    url = new URL(raw);
  } catch {
    assert(false, `${path} should be an absolute HTTP(S) URL`, { value });
  }
  assert(['http:', 'https:'].includes(url.protocol), `${path} should use HTTP(S)`, { value });
  return raw;
}

function expectAbsoluteHttpsUrl(value, path) {
  const raw = expectAbsoluteHttpUrl(value, path);
  assert(new URL(raw).protocol === 'https:', `${path} should use HTTPS`, { value });
  return raw;
}

function visit(value, path, callback, key = '') {
  callback(value, path, key);
  if (Array.isArray(value)) {
    value.forEach((entry, index) => visit(entry, `${path}[${index}]`, callback, `${index}`));
    return;
  }
  if (!value || typeof value !== 'object') {
    return;
  }
  for (const [entryKey, entryValue] of Object.entries(value)) {
    visit(entryValue, `${path}.${entryKey}`, callback, entryKey);
  }
}
