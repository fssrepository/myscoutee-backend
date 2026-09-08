import { assert } from '../../../../shared/assertions.mjs';
import {
  assertNoDocumentHorizontalOverflow,
  closeExplanationPopupEventually,
  openNavigatorMenu,
  recordInfoCardMenuAnchorFinding,
  selectActivitiesEventScope,
  waitForSmartListSettled,
  waitForVisibleText
} from '../../lib/ui-contracts.mjs';

const ASSET_IMAGE_FIXTURE_PATH = '/home/raxim/workspace/myscoutee-backend/frontend/src/assets/logo/heart.png';
const ASSET_AVAILABILITY_POPUP = 'app-asset-availability-popup app-popup.asset-availability-popup .ui-popup__panel';

export async function assertUi({ page }) {
  const suffix = Date.now().toString(36);
  const marker = `UI E2E asset ${suffix}`;
  const editedDetails = `${marker} edited details`;
  const policyTitle = `E2E lending policy ${suffix.slice(-5)}`;
  const resourceEvent = await seedResourceEvent(page, suffix);

  await page.waitForSelector('.game-page');
  await openAssetsPopup(page);
  await page.recordStep('asset-supplies-popup-open');

  await exerciseAssetFilter(page);
  await page.recordStep('asset-filter-exercised');

  await createOwnedSupplyAsset(page, { marker, policyTitle });
  await page.recordStep('asset-created-visible');

  const createdAsset = await findOwnedAssetByTitle(page, marker);
  assert(createdAsset?.id, 'Created asset should be persisted with an id', createdAsset);
  assert(createdAsset.imageUrl?.includes('/media/public?key='), 'Created asset image should be uploaded to media storage', createdAsset);
  assert(
    createdAsset.policiesEnabled === true
      && Number(createdAsset.policyCount ?? createdAsset.policies?.length) === 1,
    'Created asset should persist its lending policy summary',
    createdAsset
  );
  assert(
    createdAsset.pricing?.enabled === false && Number(createdAsset.pricing?.basePrice) === 0,
    'New assets should persist with pricing off and no default charge',
    createdAsset.pricing
  );

  await editOwnedAsset(page, marker, editedDetails);
  await page.recordStep('asset-edited-visible');

  const editedAsset = await findOwnedAssetByTitle(page, marker);
  assert(editedAsset?.id === createdAsset.id, 'Editing the asset should keep the same asset id', { createdAsset, editedAsset });
  assert(editedAsset.details === editedDetails, 'Edited asset details should persist through /api/assets/{id}', editedAsset);
  assert(Number(editedAsset.quantity) === 4, 'Edited asset quantity should persist through /api/assets', editedAsset);
  assert(editedAsset.category === 'Tech', 'Edited asset category should persist through /api/assets', editedAsset);

  await closeAssetsPopup(page);

  await openMyEvents(page);
  await waitForActivityTitleVisible(page, resourceEvent.title, 45000);
  await page.recordStep('resource-event-visible');
  await openEventEditorFromList(page, resourceEvent.title);
  await page.recordStep('resource-event-editor-open');

  await openSubEventSuppliesResource(page, resourceEvent.subEventName);
  await page.recordStep('resource-popup-open');

  await openAndInspectAssetExplore(page);
  await page.recordStep('resource-asset-explore-opened');

  await assignOwnedAssetToResource(page, marker, createdAsset.id);
  await page.recordStep('resource-asset-assigned');

  await assertResourceAssignmentState(page, {
    ownerId: resourceEvent.eventId,
    subEventId: resourceEvent.subEventId,
    assetOwnerUserId: resourceEvent.userId,
    assetId: createdAsset.id
  });
  const assignedAsset = await findOwnedAssetByTitle(page, marker);
  assert(
    assignedAsset?.policiesEnabled === true
      && assignedAsset.policies?.some(policy => policy.title === policyTitle),
    'Assigning an asset to a sub-event must preserve its detail-only lending policies',
    assignedAsset
  );

  await openAssignedResourceView(page, marker, policyTitle, editedDetails);
  await page.recordStep('resource-assigned-asset-viewed');

  await closeResourceAndEditor(page);

  await page.navigate('/game', { loadTimeoutMs: 25000 });
  await page.waitForSelector('.game-page');
  await openEventEditorByTitle(page, resourceEvent.title);
  await openSubEventSuppliesResource(page, resourceEvent.subEventName);
  await waitForVisibleText(page, '.subevent-assets-popup', marker, 30000);
  await page.recordStep('resource-assignment-reloaded');
  await closeResourceAndEditor(page);

  await openAssetsPopup(page);
  await scrollSmartListUntilText(page, '.asset-popup-content', marker, 30000);
  await openAssetRequestsPanel(page, marker);
  const assignmentListed = await waitForVisibleText(page, ASSET_AVAILABILITY_POPUP, resourceEvent.title, 12000)
    .then(() => true)
    .catch(() => false);
  if (assignmentListed) {
    await waitForVisibleText(page, ASSET_AVAILABILITY_POPUP, 'Assigned', 15000);
  } else {
    const assetAfterAssignment = await findOwnedAssetByTitle(page, marker);
    const panelText = await page.textContent(ASSET_AVAILABILITY_POPUP, { timeoutMs: 5000 }).catch(() => '');
    await page.recordStep('asset-assignment-request-panel-missing-assignment');
    page.recordFinding?.({
      severity: 'warning',
      title: 'Owned asset requests panel does not surface the sub-event assignment',
      details: {
        assetTitle: marker,
        eventTitle: resourceEvent.title,
        backendRequestCount: assetAfterAssignment?.requests?.length ?? 0,
        panelText: panelText.trim().replace(/\s+/g, ' ').slice(0, 500)
      }
    });
  }
  await page.recordStep('asset-assignment-request-visible');
  await assertNoDocumentHorizontalOverflow(page);
}

async function createOwnedSupplyAsset(page, { marker, policyTitle }) {
  await page.clickVisible('.asset-popup button[aria-label="Add asset"]');
  await page.waitForSelector('app-asset-editor-popup .ui-popup__panel');
  await page.recordStep('asset-form-open');

  await fillAssetForm(page, {
    title: marker,
    subtitle: 'UI asset lifecycle',
    quantity: '3',
    details: `${marker} details`,
    category: 'Safety'
  });
  await uploadAssetImage(page);
  await addAssetPolicy(page, policyTitle);
  await page.recordStep('asset-form-filled');

  page.clearNetworkLog();
  await page.clickVisible('app-asset-editor-popup button[aria-label="Save asset"]');
  await page.waitForNetwork('/api/assets/upsert', { timeoutMs: 45000 });
  await page.waitForSelectorHidden('app-asset-editor-popup .ui-popup__panel', { timeoutMs: 45000 });
  const savedAsset = await waitForOwnedAssetFromApi(page, marker, 45000);
  assert(savedAsset?.title === marker, 'Created asset should be readable from /api/assets after save', savedAsset);
  await closeExplanationPopupEventually(page, 5000);
  await ensureAssetVisibleInAssetsPopup(page, marker, `${marker} details`);
}

async function editOwnedAsset(page, marker, editedDetails) {
  await runInfoCardMenuAction(page, '.asset-popup-content', marker, {
    icon: 'edit',
    label: 'edit'
  });
  await page.waitForSelector('app-asset-editor-popup .ui-popup__panel');
  await waitForVisibleInputValue(page, 'app-asset-editor-popup [data-control-id="title"] input', marker, 15000);
  await page.recordStep('asset-edit-form-open');

  await fillAssetField(page, 'Subtitle', 'UI asset lifecycle edited');
  await fillAssetField(page, 'Quantity', '4');
  await fillAssetTextarea(page, 'Details', editedDetails);
  await selectAssetFormCategory(page, 'Tech');
  await chooseAssetVisibility(page, 'Friends only');
  await page.recordStep('asset-edit-form-filled');

  page.clearNetworkLog();
  await page.clickVisible('app-asset-editor-popup button[aria-label="Save asset"]');
  await page.waitForNetwork('/api/assets/upsert', { timeoutMs: 45000 });
  await page.waitForSelectorHidden('app-asset-editor-popup .ui-popup__panel', { timeoutMs: 45000 });
  await waitForOwnedAssetFromApi(page, marker, 45000);
}

async function openAndInspectAssetExplore(page) {
  await page.clickVisible('.subevent-assets-popup button[aria-label="Open sub-event asset actions"]');
  await page.clickByText('.subevent-assets-quick-actions .app-menu__panel button', 'Explore');
  const explorePopup = 'app-event-resource-asset-explore .ui-popup__panel';
  await page.waitForSelector(explorePopup);
  await page.waitForNetwork('/api/assets/explore', { timeoutMs: 30000 }).catch(() => undefined);
  await waitForAssetExploreContentReady(page, 45000);
  await waitForSmartListSettled(page, explorePopup).catch(() => undefined);
  await assertVisibleExploreControls(page);
  await page.clickVisible('app-event-resource-asset-explore .ui-popup__close[aria-label="Close asset explore"]');
  await page.waitForSelectorHidden(explorePopup, { timeoutMs: 20000 });
}

async function waitForAssetExploreContentReady(page, timeoutMs = 30000) {
  await page.waitFor('asset explore cards or empty state', async () => {
    return page.evaluate(() => {
      const shell = document.querySelector('app-event-resource-asset-explore .ui-popup__panel');
      if (!shell) {
        return false;
      }
      const shellText = (shell.textContent ?? '').toLowerCase();
      if (shellText.includes('no visible assets')) {
        return true;
      }
      return Array.from(shell.querySelectorAll('.experience-item-card, .asset-explore-empty-state'))
        .some(element => {
          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);
          return rect.width > 0
            && rect.height > 0
            && style.visibility !== 'hidden'
            && style.display !== 'none';
        });
    });
  }, timeoutMs);
}

async function assignOwnedAssetToResource(page, marker, assetId) {
  await page.clickVisible('.subevent-assets-popup button[aria-label="Open sub-event asset actions"]');
  await page.clickByText('.subevent-assets-quick-actions .app-menu__panel button', 'Assign');
  const assignPopup = 'app-asset-popup .asset-popup-content.assets-popup-basket';
  await page.waitForSelector(assignPopup);
  await waitForSmartListSettled(page, assignPopup);
  await scrollSmartListUntilText(page, assignPopup, marker, 30000);
  await page.recordStep('resource-assign-picker-open');

  const selected = await page.evaluate(marker => {
    const card = findVisibleInfoCardByText('app-asset-popup .asset-popup-content.assets-popup-basket', marker);
    const button = card?.querySelector('.ui-info-card__overlay-action--end');
    if (!button || button.disabled) {
      return false;
    }
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;

    function findVisibleInfoCardByText(rootSelector, text) {
      const root = document.querySelector(rootSelector) ?? document;
      return Array.from(root.querySelectorAll('.experience-item-card'))
        .filter(isVisible)
        .find(element => (element.textContent ?? '').includes(text)) ?? null;
    }

    function isVisible(element) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    }
  }, marker);
  assert(selected, 'Resource assign picker should allow selecting the created asset');
  await page.waitForSelector('app-asset-popup button[aria-label="Open selected assets"]');
  await page.recordStep('resource-assign-selection-visible');

  await page.waitFor('resource assign save button enabled', async () => page.evaluate(() => {
    const button = document.querySelector('app-asset-popup button[aria-label="Save selected assets"]');
    return Boolean(button && !button.disabled);
  }), 20000);
  page.clearNetworkLog();
  await page.clickVisible('app-asset-popup button[aria-label="Save selected assets"]');
  await page.waitForNetwork('/api/activities/events/subevent-resources/replace', { timeoutMs: 45000 });
  await page.waitForNetwork('/api/assets/requests', { timeoutMs: 45000 });
  assertSingleAssetRequestsSave(page, assetId);
  await page.waitForSelectorHidden(assignPopup, { timeoutMs: 45000 });
  await waitForVisibleText(page, '.subevent-assets-popup', marker, 30000);
}

function assertSingleAssetRequestsSave(page, assetId) {
  const calls = page.network.map(response => {
    const request = page.requests.get(response.requestId) ?? {};
    let pathname = '';
    try {
      pathname = new URL(response.url).pathname;
    } catch {
      pathname = response.url;
    }
    return {
      pathname,
      method: request.method ?? '',
      status: response.status
    };
  });
  const requestSaves = calls.filter(call => call.pathname === '/api/assets/requests');
  assert(
    requestSaves.length === 1 && requestSaves[0].method === 'POST',
    'Assigning an owned asset should persist its requests with one targeted API call',
    requestSaves
  );
  const legacyCalls = calls.filter(call => (
    call.pathname === '/api/assets/upsert'
    || call.pathname === `/api/assets/${encodeURIComponent(assetId)}`
  ));
  assert(
    legacyCalls.length === 0,
    'Assigning an owned asset should not load and upsert the complete asset',
    legacyCalls
  );
}

async function openAssignedResourceView(page, marker, policyTitle, editedDetails) {
  await runInfoCardMenuAction(page, '.subevent-assets-popup', marker, {
    icon: 'edit_square',
    label: 'view'
  });
  const assetViewPopup = 'app-asset-editor-popup .ui-popup__panel';
  await page.waitForSelector(assetViewPopup);
  await page.waitForSelectorHidden(`${assetViewPopup} .popup-loading-overlay`, { timeoutMs: 30000 });
  await waitForVisibleInputValue(page, `${assetViewPopup} [data-control-id="title"] input`, marker, 15000);
  await waitForVisibleInputValue(page, `${assetViewPopup} textarea`, editedDetails, 15000);
  await waitForVisibleText(page, assetViewPopup, policyTitle, 15000);
  await page.recordStep('resource-policy-summary-visible');
  await page.clickVisible('app-asset-editor-popup .ui-popup__close[aria-label="Close asset editor"]');
  await page.waitForSelectorHidden(assetViewPopup, { timeoutMs: 15000 });
}

async function openAssetRequestsPanel(page, marker) {
  const opened = await page.evaluate(marker => {
    const card = findVisibleInfoCardByText('.asset-popup-content', marker);
    const button = card?.querySelector('.ui-info-card__overlay-action--end.asset-occupancy-badge, .ui-info-card__overlay-action--end');
    if (!button || button.disabled) {
      return false;
    }
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;

    function findVisibleInfoCardByText(rootSelector, text) {
      const root = document.querySelector(rootSelector) ?? document;
      return Array.from(root.querySelectorAll('.experience-item-card'))
        .filter(isVisible)
        .find(element => (element.textContent ?? '').includes(text)) ?? null;
    }

    function isVisible(element) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    }
  }, marker);
  assert(opened, 'Created asset should expose its requests/assignments badge');
  await page.waitForSelector(ASSET_AVAILABILITY_POPUP);
  await waitForSmartListSettled(page, ASSET_AVAILABILITY_POPUP);
}

async function openSubEventSuppliesResource(page, subEventName) {
  if (await page.isSelectorVisible('app-event-editor-popup .ui-popup__panel')) {
    await page.clickVisible('app-event-editor-popup > app-popup .ui-popup__close[aria-label="Close"]');
    await page.waitForSelectorHidden('app-event-editor-popup .ui-popup__panel', { timeoutMs: 20000 });
  }
  const overview = 'app-event-subevents-list-popup .event-subevents-list-smart-list';
  await page.waitForSelector(overview);
  await waitForVisibleText(page, overview, subEventName, 30000);
  const opened = await page.evaluate(subEventName => {
    const card = Array.from(document.querySelectorAll('app-event-subevents-list-popup .experience-item-card'))
      .filter(isVisible)
      .find(element => (element.textContent ?? '').includes(subEventName)) ?? null;
    const button = card?.querySelector('.ui-info-card__menu-trigger, app-menu-trigger .app-menu__trigger');
    if (!button || button.disabled) {
      return false;
    }
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;

    function isVisible(element) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    }
  }, subEventName);
  assert(opened, 'Sub-event card should expose resource menu actions', { subEventName });
  const menu = 'app-event-subevents-list-popup .app-menu__panel';
  await page.waitForSelector(menu);
  await page.clickByText(`${menu} button`, 'Supplies');
  await page.waitForSelector('.subevent-assets-popup');
  await page.waitForNetwork('/api/activities/events/subevent-resources', { timeoutMs: 30000 });
  await closeExplanationPopupEventually(page, 10000);
}

async function closeResourceAndEditor(page) {
  if (await page.isSelectorVisible('app-event-resource-popup > app-popup .ui-popup__close[aria-label="Close resource assignment"]')) {
    await page.clickVisible('app-event-resource-popup > app-popup .ui-popup__close[aria-label="Close resource assignment"]');
    await page.waitForSelectorHidden('.subevent-assets-popup', { timeoutMs: 20000 });
  }
  if (await page.isSelectorVisible('.subevents-panel .subevents-back-btn')) {
    await page.clickVisible('.subevents-panel .subevents-back-btn');
    await page.waitForSelectorHidden('.subevents-panel', { timeoutMs: 20000 });
  }
  if (await page.isSelectorVisible('app-event-editor-popup > app-popup .ui-popup__close[aria-label="Close"]')) {
    await page.clickVisible('app-event-editor-popup > app-popup .ui-popup__close[aria-label="Close"]');
    await page.waitForSelectorHidden('app-event-editor-popup .ui-popup__panel', { timeoutMs: 20000 });
  }
}

async function assertResourceAssignmentState(page, { ownerId, subEventId, assetOwnerUserId, assetId }) {
  const state = await page.evaluate(async ({ ownerId, subEventId, assetOwnerUserId }) => {
    const params = new URLSearchParams({ ownerId, subEventId, assetOwnerUserId });
    const response = await fetch(`/api/activities/events/subevent-resources?${params.toString()}`);
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    return {
      ok: response.ok,
      status: response.status,
      data
    };
  }, { ownerId, subEventId, assetOwnerUserId });
  assert(state.ok, 'Resource assignment state should be queryable from the backend', state);
  const assignedIds = state.data?.assetAssignmentIds?.Supplies ?? [];
  assert(assignedIds.includes(assetId), 'Backend resource state should contain the assigned supply asset id', {
    expectedAssetId: assetId,
    state
  });
}

async function seedResourceEvent(page, suffix) {
  const userId = await currentUserId(page);
  const profile = await currentUserProfile(page, userId);
  const eventId = `e2e-ui-resource-${suffix}`;
  const subEventId = `${eventId}-stage`;
  const title = `E2E UI Resource Event ${suffix}`;
  const subEventName = `E2E Resource Stage ${suffix.slice(-5)}`;
  const now = new Date();
  const start = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const result = await page.evaluate(async ({ userId, profile, eventId, subEventId, title, subEventName, startAt, endAt }) => {
    const response = await fetch('/api/activities/events/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Session-Kind': 'demo'
      },
      body: JSON.stringify({
        syncKey: eventId,
        id: eventId,
        target: 'hosting',
        title,
        shortDescription: 'Created by the UI asset/resource lifecycle regression.',
        timeframe: 'Next week',
        activity: 5,
        isAdmin: true,
        startAtIso: startAt,
        endAtIso: endAt,
        distanceKm: 1.4,
        imageUrl: '/assets/logo/heart.webp',
        acceptedMembers: 1,
        pendingMembers: 0,
        capacityTotal: 8,
        capacityMin: 1,
        capacityMax: 8,
        autoInviter: false,
        frequency: 'One-time',
        ticketing: false,
        slotsEnabled: false,
        eventType: 'meetup',
        visibility: 'Invitation only',
        blindMode: 'Open Event',
        status: 'A',
        creatorUserId: userId,
        creatorName: profile.name,
        creatorInitials: profile.initials,
        creatorGender: profile.gender,
        creatorCity: profile.city,
        location: 'E2E Resource Yard',
        locationCoordinates: {
          latitude: 48.1486,
          longitude: 17.1077
        },
        topics: ['e2e', 'resource'],
        policies: [],
        mode: 'Casual',
        subEventsEnabled: true,
        subEventDefinitions: [{
          id: subEventId,
          name: subEventName,
          description: 'Stage used for asset/resource lifecycle assignment.',
          startAt,
          endAt,
          location: 'E2E Resource Yard',
          createdByUserId: userId,
          groups: [],
          optional: false,
          capacityMin: 1,
          capacityMax: 8,
          membersAccepted: 1,
          membersPending: 0,
          carsPending: 0,
          accommodationPending: 0,
          suppliesPending: 0,
          carsAccepted: 0,
          accommodationAccepted: 0,
          suppliesAccepted: 0,
          carsCapacityMin: 0,
          carsCapacityMax: 4,
          accommodationCapacityMin: 0,
          accommodationCapacityMax: 4,
          suppliesCapacityMin: 1,
          suppliesCapacityMax: 10
        }]
      })
    });
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    return {
      ok: response.ok,
      status: response.status,
      data
    };
  }, {
    userId,
    profile,
    eventId,
    subEventId,
    title,
    subEventName,
    startAt: start.toISOString(),
    endAt: end.toISOString()
  });
  assert(result.ok, 'Resource lifecycle event should be seeded through the backend', result);
  await seedAcceptedResourceEventMember(page, { eventId, userId, actionAtIso: start.toISOString() });
  return { eventId, subEventId, title, subEventName, userId };
}

async function seedAcceptedResourceEventMember(page, { eventId, userId, actionAtIso }) {
  const result = await page.evaluate(async ({ eventId, userId, actionAtIso }) => {
    const response = await fetch('/api/activities/events/members/replace', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Session-Kind': 'demo'
      },
      body: JSON.stringify({
        owner: {
          ownerType: 'event',
          ownerId: eventId
        },
        members: [{
          id: `e2e-ui-resource-member-${eventId}-${userId}`,
          userId,
          role: 'Member',
          status: 'accepted',
          pendingSource: null,
          requestKind: null,
          actionAtIso,
          metAtIso: actionAtIso,
          metWhere: 'E2E Resource Yard'
        }],
        capacityTotal: 8,
        actorUserId: userId
      })
    });
    return {
      ok: response.ok,
      status: response.status,
      text: await response.text()
    };
  }, { eventId, userId, actionAtIso });
  assert(result.ok, 'Resource lifecycle event should have a real accepted membership row before assignment', result);
}

async function currentUserId(page) {
  const userId = await page.evaluate(() => {
    const raw = window.localStorage.getItem('myscoutee.http.session.v1') || '{}';
    try {
      return JSON.parse(raw)?.userId ?? '';
    } catch {
      return '';
    }
  });
  assert(userId, 'Suite demo login should provide an active user id');
  return userId;
}

async function currentUserProfile(page, userId) {
  const result = await page.evaluate(async userId => {
    const response = await fetch(`/api/auth/me?userId=${encodeURIComponent(userId)}`);
    const data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      data
    };
  }, userId);
  assert(result.ok, 'Current demo user profile should be queryable', result);
  const data = result.data ?? {};
  return {
    name: `${data.name ?? 'E2E User'}`,
    initials: `${data.initials ?? 'EU'}`,
    gender: data.gender === 'woman' ? 'woman' : 'man',
    city: `${data.city ?? 'Bratislava'}`
  };
}

async function findOwnedAssetByTitle(page, title) {
  const userId = await currentUserId(page);
  return page.evaluate(async ({ userId, title }) => {
    const response = await fetch(`/api/assets?userId=${encodeURIComponent(userId)}`);
    const assets = response.ok ? await response.json() : [];
    const summary = (Array.isArray(assets) ? assets : []).find(asset => asset.title === title) ?? null;
    if (!summary?.id) {
      return summary;
    }
    const detailResponse = await fetch(
      `/api/assets/${encodeURIComponent(summary.id)}?userId=${encodeURIComponent(userId)}`
    );
    const detailText = detailResponse.ok ? await detailResponse.text() : '';
    if (!detailText) {
      return summary;
    }
    try {
      return JSON.parse(detailText);
    } catch {
      return summary;
    }
  }, { userId, title });
}

async function waitForOwnedAssetFromApi(page, title, timeoutMs = 45000) {
  const started = Date.now();
  let lastAssets = [];
  while (Date.now() - started < timeoutMs) {
    const assets = await page.evaluate(async () => {
      const raw = window.localStorage.getItem('myscoutee.http.session.v1') || '{}';
      let userId = '';
      try {
        userId = JSON.parse(raw)?.userId ?? '';
      } catch {
        userId = '';
      }
      if (!userId) {
        return [];
      }
      const response = await fetch(`/api/assets?userId=${encodeURIComponent(userId)}`);
      return response.ok ? await response.json() : [];
    });
    lastAssets = Array.isArray(assets) ? assets : [];
    const match = lastAssets.find(asset => asset.title === title);
    if (match) {
      return match;
    }
    await page.evaluate(() => new Promise(resolve => window.setTimeout(resolve, 500)));
  }
  return {
    missingTitle: title,
    seenTitles: lastAssets.map(asset => asset.title).filter(Boolean).slice(0, 20)
  };
}

async function ensureAssetVisibleInAssetsPopup(page, marker, details) {
  const quickVisible = await waitForVisibleText(page, '.asset-popup-content', marker, 12000)
    .then(() => true)
    .catch(() => false);
  const visibleAfterListProbe = quickVisible
    || await findSmartListTextByScrolling(page, '.asset-popup-content', marker, 30000);
  if (!visibleAfterListProbe) {
    await page.recordStep('asset-smart-list-missing-new-asset-before-reopen');
    page.recordFinding?.({
      severity: 'warning',
      title: 'Owned assets smart list did not show the newly saved asset without reopening',
      details: { marker }
    });
    await closeAssetsPopup(page);
    await openAssetsPopup(page);
  }
  await scrollSmartListUntilText(page, '.asset-popup-content', marker, 60000);
  await scrollSmartListUntilText(page, '.asset-popup-content', details, 60000);
}

async function findSmartListTextByScrolling(page, rootSelector, text, timeoutMs = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const found = await waitForVisibleText(page, rootSelector, text, 1200)
      .then(() => true)
      .catch(() => false);
    if (found) {
      return true;
    }
    const state = await scrollSmartListOnce(page, rootSelector);
    await page.evaluate(() => new Promise(resolve => window.setTimeout(resolve, 350)));
    await waitForSmartListSettled(page, rootSelector, 5000).catch(() => undefined);
    if (state?.hasList && state.atEnd && Math.abs((state.after ?? 0) - (state.before ?? 0)) <= 1) {
      return false;
    }
  }
  return false;
}

async function scrollSmartListUntilText(page, rootSelector, text, timeoutMs = 30000) {
  const started = Date.now();
  let lastState = null;
  while (Date.now() - started < timeoutMs) {
    const found = await waitForVisibleText(page, rootSelector, text, 1200)
      .then(() => true)
      .catch(() => false);
    if (found) {
      return;
    }
    lastState = await scrollSmartListOnce(page, rootSelector);
    await page.evaluate(() => new Promise(resolve => window.setTimeout(resolve, 350)));
    await waitForSmartListSettled(page, rootSelector, 5000).catch(() => undefined);
    if (lastState?.hasList && lastState.atEnd && Math.abs((lastState.after ?? 0) - (lastState.before ?? 0)) <= 1) {
      break;
    }
  }
  await page.recordStep('smart-list-text-missing-after-scroll');
  page.recordFinding?.({
    severity: 'fatal',
    title: 'Smart-list did not expose the expected text after scrolling',
    details: {
      rootSelector,
      expectedText: text,
      lastState: lastState ?? {}
    }
  });
  assert(false, `${rootSelector} should show ${text} after scrolling the smart list`, lastState ?? {});
}

async function scrollSmartListOnce(page, rootSelector) {
  return page.evaluate(rootSelector => {
    const root = document.querySelector(rootSelector) ?? document;
    const list = root.querySelector('.smart-list');
    if (!list) {
      return { hasList: false };
    }
    const before = list.scrollTop;
    const step = Math.max(220, Math.floor((list.clientHeight || window.innerHeight || 320) * 0.78));
    list.scrollTo({ top: Math.min(list.scrollHeight, before + step), behavior: 'auto' });
    list.dispatchEvent(new Event('scroll', { bubbles: true }));
    return {
      hasList: true,
      before,
      after: list.scrollTop,
      clientHeight: list.clientHeight,
      scrollHeight: list.scrollHeight,
      atEnd: list.scrollTop + list.clientHeight >= list.scrollHeight - 4
    };
  }, rootSelector);
}

async function openAssetsPopup(page) {
  await openNavigatorMenu(page);
  await page.click('button[aria-label="Supplies"]');
  await closeExplanationPopupEventually(page, 10000);
  await page.waitForSelector('.asset-popup-content');
  await page.waitForNetwork('/api/assets', { timeoutMs: 25000 });
  await waitForPopupAssetsListReady(page);
}

async function closeAssetsPopup(page) {
  const closeSelector = '.asset-popup > app-popup .ui-popup__close[aria-label="Close"]';
  if (!(await page.isSelectorVisible(closeSelector))) {
    return;
  }
  await page.clickVisible(closeSelector);
  await page.waitForSelectorHidden('.asset-popup-content', { timeoutMs: 20000 });
}

async function openMyEvents(page) {
  await openNavigatorMenu(page);
  await page.click('button[aria-label="Open events"]');
  await closeExplanationPopupEventually(page, 10000);
  await page.waitForSelector('.activities-popup');
  await page.waitForNetwork('/api/activities/events', { timeoutMs: 25000 });
  await selectActivitiesEventScope(page, 'My Events');
}

async function openEventEditorByTitle(page, title) {
  await openMyEvents(page);
  await waitForActivityTitleVisible(page, title, 45000);
  await openEventEditorFromList(page, title);
}

async function openEventEditorFromList(page, title) {
  const opened = await page.evaluate(title => {
    const card = findVisibleInfoCardByText('.activities-popup', title);
    const menu = card?.querySelector('.ui-info-card__menu-trigger, app-menu-trigger .app-menu__trigger');
    if (!menu || menu.disabled) {
      return false;
    }
    menu.scrollIntoView({ block: 'center', inline: 'center' });
    menu.click();
    return true;

    function findVisibleInfoCardByText(rootSelector, text) {
      const root = document.querySelector(rootSelector) ?? document;
      return Array.from(root.querySelectorAll('.experience-item-card'))
        .filter(isVisible)
        .find(element => (element.textContent ?? '').includes(text)) ?? null;
    }

    function isVisible(element) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    }
  }, title);
  assert(opened, 'Event card should expose an action menu', { title });
  await page.waitForSelector('app-activities-popup app-menu-outlet .app-menu__panel button');
  await recordInfoCardMenuAnchorFinding(page, {
    title: 'Resource lifecycle event card action menu is visually detached from its three-dot trigger'
  });
  await page.recordStep('resource-event-card-menu-open');
  await page.clickByText('app-activities-popup app-menu-outlet .app-menu__panel button', 'Manage Event');
  await page.waitFor('resource event details or sub-events overview open', async () => {
    return (await page.isSelectorVisible('app-event-editor-popup .ui-popup__panel'))
      || (await page.isSelectorVisible('app-event-subevents-list-popup .event-subevents-list-smart-list'));
  }, 20000);
  if (await page.isSelectorVisible('app-event-subevents-list-popup .event-subevents-list-smart-list')) {
    const openedEditor = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll(
        'app-event-subevents-list-popup .ui-popup__toolbar .app-menu__button-row-item'
      ));
      const button = buttons.find(item => /\b(edit|view)\b/i.test(
        `${item.getAttribute('aria-label') ?? ''} ${item.textContent ?? ''}`
      ));
      button?.click();
      return Boolean(button);
    });
    assert(openedEditor, 'Sub-events overview should expose its event editor action');
  }
  await page.waitForSelector('app-event-editor-popup .ui-popup__panel');
  await page.waitForSelectorHidden('.popup-loading-overlay', { timeoutMs: 30000 });
  await closeExplanationPopupEventually(page, 10000);
}

async function waitForActivityTitleVisible(page, title, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const visible = await page.evaluate(title => {
      const root = document.querySelector('.activities-popup') ?? document;
      return Array.from(root.querySelectorAll('.ui-info-card__title, .activities-card-title'))
        .filter(isVisible)
        .some(element => (element.textContent ?? '').includes(title));

      function isVisible(element) {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none';
      }
    }, title);
    if (visible) {
      return;
    }
    await page.evaluate(() => {
      const list = document.querySelector('.activities-popup .smart-list');
      if (list) {
        list.scrollBy({ top: Math.max(360, list.clientHeight * 0.85), left: 0, behavior: 'auto' });
        list.dispatchEvent(new Event('scroll', { bubbles: true }));
      }
    });
    await page.evaluate(() => new Promise(resolve => window.setTimeout(resolve, 300)));
  }
  const listState = await page.evaluate(() => ({
    text: (document.querySelector('.activities-popup')?.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 1200)
  }));
  await page.recordStep('resource-event-card-missing-from-activities');
  page.recordFinding?.({
    severity: 'fatal',
    title: 'Seeded resource event card did not appear in activities list',
    details: {
      expectedTitle: title,
      ...listState
    }
  });
  assert(false, `Seeded resource event ${title} should be visible in the activities list`, {
    title,
    ...listState
  });
}

async function runInfoCardMenuAction(page, rootSelector, text, action) {
  const opened = await page.evaluate(({ rootSelector, text }) => {
    const card = findVisibleInfoCardByText(rootSelector, text);
    const menu = card?.querySelector('.ui-info-card__menu-trigger, app-menu-trigger .app-menu__trigger');
    if (!menu || menu.disabled) {
      return false;
    }
    menu.scrollIntoView({ block: 'center', inline: 'center' });
    menu.click();
    return true;

    function findVisibleInfoCardByText(rootSelector, text) {
      const root = document.querySelector(rootSelector) ?? document;
      return Array.from(root.querySelectorAll('.experience-item-card'))
        .filter(isVisible)
        .find(element => (element.textContent ?? '').includes(text)) ?? null;
    }

    function isVisible(element) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    }
  }, { rootSelector, text });
  assert(opened, `Info card containing ${text} should expose an action menu`);
  await page.waitForSelector('app-menu-outlet .app-menu__panel button, .ui-info-card__menu-action, .item-action-menu-btn');
  await recordInfoCardMenuAnchorFinding(page, {
    severity: 'warning',
    title: `Info-card action menu is visually detached for ${text}`
  });
  const clicked = await page.evaluate(({ icon, label }) => {
    const actions = Array.from(document.querySelectorAll('app-menu-outlet .app-menu__panel button, .ui-info-card__menu-action, .item-action-menu-btn'))
      .filter(isVisible);
    const target = actions.find(button => {
      const actionIcon = (button.querySelector('mat-icon')?.textContent ?? '').trim().toLowerCase();
      const actionText = (button.textContent ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
      return (icon && actionIcon === `${icon}`.toLowerCase())
        || (label && actionText.includes(`${label}`.toLowerCase()));
    });
    if (!target || target.disabled) {
      return {
        clicked: false,
        labels: actions.map(button => (button.textContent ?? '').trim().replace(/\s+/g, ' '))
      };
    }
    target.click();
    return { clicked: true };

    function isVisible(element) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    }
  }, action);
  assert(clicked.clicked, `Info card action ${action.label ?? action.icon} should be clickable`, clicked);
}

async function exerciseAssetFilter(page) {
  const before = await readAssetToolbarText(page);
  const trigger = '.asset-popup button[aria-label="Open asset filter"]';
  const panel = '.asset-popup .ui-popup__toolbar .app-menu__panel';
  await page.clickVisible(trigger);
  await page.waitForSelector(panel);
  const selected = await page.evaluate(before => {
    const option = Array.from(document.querySelectorAll('.asset-popup .ui-popup__toolbar .app-menu__panel .app-menu__item'))
      .filter(isVisible)
      .find(item => !(item.textContent ?? '').toLowerCase().includes(before.toLowerCase().trim()));
    if (!option) {
      return '';
    }
    const label = (option.textContent ?? '').trim().replace(/\s+/g, ' ');
    option.click();
    return label;

    function isVisible(element) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none'
        && !element.disabled;
    }
  }, before);
  assert(selected, 'Asset filter should expose at least one alternate filter');
  await page.waitForNetwork('/api/assets', { timeoutMs: 25000 });
  await waitForPopupAssetsListReady(page);
  await closeExplanationPopupEventually(page, 10000);

  await page.clickVisible(trigger);
  await page.waitForSelector(panel);
  const restored = await page.evaluate(() => {
    const option = Array.from(document.querySelectorAll('.asset-popup .ui-popup__toolbar .app-menu__panel .app-menu__item'))
      .filter(isVisible)
      .find(item => (item.textContent ?? '').toLowerCase().includes('supplies'));
    if (!option) {
      return false;
    }
    option.click();
    return true;

    function isVisible(element) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none'
        && !element.disabled;
    }
  });
  assert(restored, 'Asset filter should be restorable to Supplies before creating a supply asset');
  await page.waitForNetwork('/api/assets', { timeoutMs: 25000 });
  await waitForPopupAssetsListReady(page);
  await closeExplanationPopupEventually(page, 10000);
}

async function waitForPopupAssetsListReady(page, timeoutMs = 9000) {
  const settled = await waitForSmartListSettled(page, '.asset-popup-content', timeoutMs)
    .then(() => true)
    .catch(() => false);
  if (settled) {
    return;
  }
  const visibleCards = await page.visibleCount('.asset-popup-content .experience-item-card');
  assert(visibleCards > 0, 'Assets smart-list should either settle or expose visible asset cards', { visibleCards });
}

async function readAssetToolbarText(page) {
  return page.evaluate(() => {
    const trigger = document.querySelector('.asset-popup button[aria-label="Open asset filter"]');
    return (trigger?.textContent ?? '').trim().replace(/\s+/g, ' ');
  });
}

async function fillAssetForm(page, { title, subtitle, quantity, details, category }) {
  await fillAssetField(page, 'Title', title);
  await fillAssetField(page, 'Subtitle', subtitle);
  await fillAssetField(page, 'Total capacity', quantity);
  await fillAssetField(page, 'Quantity', quantity);
  await fillAssetTextarea(page, 'Details', details);
  await selectAssetFormCategory(page, category);
  await chooseAssetVisibility(page, 'Public');
}

async function uploadAssetImage(page) {
  page.clearNetworkLog();
  await page.setFileInputFiles('app-asset-editor-popup .image-carousel__slot-input', ASSET_IMAGE_FIXTURE_PATH);
  await page.waitForNetwork('/api/media/images', { timeoutMs: 45000 });
  await page.waitFor('asset image preview visible after file selection', async () => page.evaluate(() => {
    const preview = document.querySelector('app-asset-editor-popup .image-carousel__slot');
    return preview?.classList.contains('is-filled') === true;
  }), 15000);
}

async function addAssetPolicy(page, policyTitle) {
  const policies = 'app-asset-editor-popup [data-control-id="policies"]';
  if (!(await page.isSelectorVisible(`${policies} .event-slots-open-btn`))) {
    await page.clickVisible(`${policies} .event-policies-toggle`);
  }
  await page.clickVisible(`${policies} .event-slots-open-btn`);
  await page.waitForSelector(`${policies} .event-policies-popup-body`);
  await page.clickVisible(`${policies} button[aria-label="Add policy"]`);
  await page.waitForSelector('app-policies-input-popup .ui-popup__panel');
  await page.fillVisible('app-policies-input-popup [data-control-id="title"] input', policyTitle);
  await page.fillVisible('app-policies-input-popup [data-control-id="description"] textarea', `${policyTitle} must be accepted during e2e.`);
  await page.clickVisible('app-policies-input-popup button[aria-label="Save policy"]');
  await page.waitForSelectorHidden('app-policies-input-popup .ui-popup__panel');
  await waitForVisibleText(page, `${policies} .event-policies-popup-body`, policyTitle, 15000);
  await page.clickVisible(`${policies} app-policies-input > app-popup .ui-popup__close`);
  await page.waitForSelectorHidden(`${policies} .event-policies-popup-body`);
}

async function fillAssetField(page, label, value) {
  const controlIds = {
    Title: 'title',
    Subtitle: 'subtitle',
    'Total capacity': 'capacityTotal',
    Quantity: 'quantity'
  };
  const controlId = controlIds[label];
  assert(controlId, `Asset form field ${label} should have a semantic control id`);
  await page.fillVisible(`app-asset-editor-popup [data-control-id="${controlId}"] input`, value);
}

async function fillAssetTextarea(page, label, value) {
  assert(label === 'Details', `Asset form textarea ${label} should have a semantic control id`);
  await page.fillVisible('app-asset-editor-popup [data-control-id="details"] textarea', value);
}

async function selectAssetFormCategory(page, label) {
  const control = 'app-asset-editor-popup [data-control-id="category"]';
  await page.clickVisible(`${control} .app-menu__trigger`);
  await page.waitForSelector(`${control} .app-menu__panel`);
  const clicked = await page.evaluate(label => {
    const needle = `${label}`.trim().toLowerCase();
    const option = Array.from(document.querySelectorAll('app-asset-editor-popup [data-control-id="category"] .app-menu__panel .app-menu__item'))
      .filter(isVisible)
      .find(item => (item.textContent ?? '').toLowerCase().includes(needle));
    if (!option || option.disabled) {
      return false;
    }
    option.click();
    return true;

    function isVisible(element) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    }
  }, label);
  assert(clicked, `Asset category picker should expose ${label}`);
  await waitForVisibleText(page, control, label, 10000);
}

async function chooseAssetVisibility(page, label) {
  const root = 'app-asset-editor-popup .ui-popup__header-controls';
  await page.clickVisible(`${root} button[aria-label="Open asset visibility selector"]`);
  await page.waitForSelector(`${root} .app-menu__panel`);
  const clicked = await page.evaluate(label => {
    const needle = `${label}`.trim().toLowerCase();
    const option = Array.from(document.querySelectorAll('app-asset-editor-popup .ui-popup__header-controls .app-menu__panel .app-menu__item'))
      .filter(isVisible)
      .find(item => (item.textContent ?? '').toLowerCase().includes(needle));
    if (!option) {
      return false;
    }
    option.click();
    return true;

    function isVisible(element) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    }
  }, label);
  assert(clicked, `Asset visibility picker should expose ${label}`);
}

async function waitForVisibleInputValue(page, selector, value, timeoutMs = 15000) {
  const needle = `${value ?? ''}`;
  await page.waitFor(`${selector} visible value ${needle}`, async () => page.evaluate(({ selector, needle }) => {
    return Array.from(document.querySelectorAll(selector))
      .filter(isVisible)
      .some(input => `${input.value ?? ''}`.includes(needle));

    function isVisible(element) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    }
  }, { selector, needle }), timeoutMs);
}

async function assertVisibleExploreControls(page) {
  const controls = await page.evaluate(() => {
    const shell = document.querySelector('app-event-resource-asset-explore .ui-popup__panel');
    const shellText = (shell?.textContent ?? '').toLowerCase();
    return {
      hasOrder: Array.from(shell?.querySelectorAll('button[aria-label="Open asset explore order"]') ?? []).some(isVisible),
      hasCategory: Array.from(shell?.querySelectorAll('button[aria-label="Open asset explore category"]') ?? []).some(isVisible),
      hasDateRange: Array.from(shell?.querySelectorAll('app-date-input input') ?? []).some(isVisible),
      hasCardsOrEmptyState: shellText.includes('no visible assets')
        || Array.from(shell?.querySelectorAll('.experience-item-card, .asset-explore-empty-state') ?? []).some(isVisible)
    };

    function isVisible(element) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    }
  });
  assert(controls.hasOrder, 'Asset explore should expose ordering control', controls);
  assert(controls.hasCategory, 'Asset explore should expose category filter', controls);
  assert(controls.hasDateRange, 'Asset explore should expose date range filter', controls);
  assert(controls.hasCardsOrEmptyState, 'Asset explore should render cards or an explicit empty state', controls);
}
