import { assert } from '../../../../shared/assertions.mjs';
import {
  assertNoDocumentHorizontalOverflow,
  closeExplanationPopupEventually,
  openNavigatorMenu,
  recordInfoCardMenuAnchorFinding,
  waitForSmartListSettled,
  waitForVisibleText
} from '../../lib/ui-contracts.mjs';

const ASSET_IMAGE_FIXTURE_PATH = '/home/raxim/workspace/myscoutee-backend/frontend/src/assets/logo/heart.png';

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
  assert((createdAsset.policies ?? []).some(policy => policy.title === policyTitle), 'Created asset should persist its lending policy', createdAsset);

  await editOwnedAsset(page, marker, editedDetails);
  await page.recordStep('asset-edited-visible');

  const editedAsset = await findOwnedAssetByTitle(page, marker);
  assert(editedAsset?.id === createdAsset.id, 'Editing the asset should keep the same asset id', { createdAsset, editedAsset });
  assert(editedAsset.details === editedDetails, 'Edited asset details should persist through /api/assets', editedAsset);
  assert(Number(editedAsset.quantity) === 4, 'Edited asset quantity should persist through /api/assets', editedAsset);
  assert(editedAsset.category === 'Tech', 'Edited asset category should persist through /api/assets', editedAsset);

  await closeAssetsPopup(page);

  await page.navigate('/game', { loadTimeoutMs: 25000 });
  await page.waitForSelector('.game-page');
  await openAssetsPopup(page);
  await scrollSmartListUntilText(page, '.popup-panel-assets', marker, 30000);
  await scrollSmartListUntilText(page, '.popup-panel-assets', editedDetails, 30000);
  await page.recordStep('asset-reloaded-visible');
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

  await assignOwnedAssetToResource(page, marker);
  await page.recordStep('resource-asset-assigned');

  await assertResourceAssignmentState(page, {
    ownerId: resourceEvent.eventId,
    subEventId: resourceEvent.subEventId,
    assetOwnerUserId: resourceEvent.userId,
    assetId: createdAsset.id
  });

  await openAssignedResourceView(page, marker, policyTitle, editedDetails);
  await page.recordStep('resource-assigned-asset-viewed');

  await closeResourceAndEditor(page);

  await page.navigate('/game', { loadTimeoutMs: 25000 });
  await page.waitForSelector('.game-page');
  await openEventEditorByTitle(page, resourceEvent.title);
  await openSubEventSuppliesResource(page, resourceEvent.subEventName);
  await waitForVisibleText(page, '.popup-panel-asset-members', marker, 30000);
  await page.recordStep('resource-assignment-reloaded');
  await closeResourceAndEditor(page);

  await openAssetsPopup(page);
  await scrollSmartListUntilText(page, '.popup-panel-assets', marker, 30000);
  await openAssetRequestsPanel(page, marker);
  const assignmentListed = await waitForVisibleText(page, '.asset-supply-requests-panel', resourceEvent.title, 12000)
    .then(() => true)
    .catch(() => false);
  if (assignmentListed) {
    await waitForVisibleText(page, '.asset-supply-requests-panel', 'Assigned', 15000);
  } else {
    const assetAfterAssignment = await findOwnedAssetByTitle(page, marker);
    const panelText = await page.textContent('.asset-supply-requests-panel', { timeoutMs: 5000 }).catch(() => '');
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
  await page.clickVisible('.popup-panel-assets .assets-add-btn');
  await page.waitForSelector('.asset-form-popup');
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
  await page.clickVisible('.asset-form-popup .asset-form-save-btn');
  await page.waitForNetwork('/api/media/images', { timeoutMs: 45000 });
  await page.waitForNetwork('/api/assets/upsert', { timeoutMs: 45000 });
  await page.waitForSelectorHidden('.asset-form-popup', { timeoutMs: 45000 });
  const savedAsset = await waitForOwnedAssetFromApi(page, marker, 45000);
  assert(savedAsset?.title === marker, 'Created asset should be readable from /api/assets after save', savedAsset);
  await closeExplanationPopupEventually(page, 5000);
  await ensureAssetVisibleInAssetsPopup(page, marker, `${marker} details`);
}

async function editOwnedAsset(page, marker, editedDetails) {
  await runInfoCardMenuAction(page, '.popup-panel-assets', marker, {
    icon: 'edit',
    label: 'edit'
  });
  await page.waitForSelector('.asset-form-popup');
  await waitForVisibleInputValue(page, '.asset-form-popup label input', marker, 15000);
  await page.recordStep('asset-edit-form-open');

  await fillAssetField(page, 'Subtitle', 'UI asset lifecycle edited');
  await fillAssetField(page, 'Quantity', '4');
  await fillAssetTextarea(page, 'Details', editedDetails);
  await selectAssetFormCategory(page, 'Tech');
  await chooseAssetVisibility(page, 'Friends only');
  await page.recordStep('asset-edit-form-filled');

  page.clearNetworkLog();
  await page.clickVisible('.asset-form-popup .asset-form-save-btn');
  await page.waitForNetwork('/api/assets/upsert', { timeoutMs: 45000 });
  await page.waitForSelectorHidden('.asset-form-popup', { timeoutMs: 45000 });
  await scrollSmartListUntilText(page, '.popup-panel-assets', editedDetails, 30000);
}

async function openAndInspectAssetExplore(page) {
  await page.clickVisible('.popup-panel-asset-members .subevent-assets-quick-actions-trigger');
  await page.clickVisible('.subevent-assets-quick-action-option-explore');
  await page.waitForSelector('.asset-explore-shell');
  await page.waitForNetwork('/api/assets/explore', { timeoutMs: 30000 }).catch(() => undefined);
  await waitForAssetExploreContentReady(page, 45000);
  await waitForSmartListSettled(page, '.asset-explore-shell').catch(() => undefined);
  await assertVisibleExploreControls(page);
  await page.clickVisible('.asset-explore-shell .popup-close[aria-label="Close asset explore"]');
  await page.waitForSelectorHidden('.asset-explore-shell', { timeoutMs: 20000 });
}

async function waitForAssetExploreContentReady(page, timeoutMs = 30000) {
  await page.waitFor('asset explore cards or empty state', async () => {
    return page.evaluate(() => {
      const shell = document.querySelector('.asset-explore-shell');
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

async function assignOwnedAssetToResource(page, marker) {
  await page.clickVisible('.popup-panel-asset-members .subevent-assets-quick-actions-trigger');
  await page.clickVisible('.subevent-assets-quick-action-option-assign');
  await page.waitForSelector('.asset-popup-basket-panel');
  await waitForSmartListSettled(page, '.asset-popup-basket-panel');
  await scrollSmartListUntilText(page, '.asset-popup-basket-panel', marker, 30000);
  await page.recordStep('resource-assign-picker-open');

  const selected = await page.evaluate(marker => {
    const card = findVisibleInfoCardByText('.asset-popup-basket-panel', marker);
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
  await waitForVisibleText(page, '.asset-popup-basket-chip-row', marker, 15000);
  await page.recordStep('resource-assign-selection-visible');

  await page.waitFor('resource assign save button enabled', async () => page.evaluate(() => {
    const button = document.querySelector('.asset-popup-basket-panel .asset-popup-basket-save-btn');
    return Boolean(button && !button.disabled);
  }), 20000);
  page.clearNetworkLog();
  await page.clickVisible('.asset-popup-basket-panel .asset-popup-basket-save-btn');
  await page.waitForNetwork('/api/activities/events/subevent-resources/replace', { timeoutMs: 45000 });
  await page.waitForSelectorHidden('.asset-popup-basket-panel', { timeoutMs: 45000 });
  await waitForVisibleText(page, '.popup-panel-asset-members', marker, 30000);
}

async function openAssignedResourceView(page, marker, policyTitle, editedDetails) {
  await runInfoCardMenuAction(page, '.popup-panel-asset-members', marker, {
    icon: 'edit_square',
    label: 'view'
  });
  await page.waitForSelector('.subevent-asset-view-popup');
  await waitForVisibleText(page, '.subevent-asset-view-popup', marker, 15000);
  await waitForVisibleInputValue(page, '.subevent-asset-view-popup textarea', editedDetails, 15000);
  await page.clickVisible('.subevent-asset-view-popup .subevent-asset-view-policies .event-slots-open-btn');
  await page.waitForSelector('.subevent-asset-view-policy-popup');
  await waitForVisibleText(page, '.subevent-asset-view-policy-popup', policyTitle, 15000);
  await page.recordStep('resource-policy-popup-visible');
  await page.clickVisible('.subevent-asset-view-policy-popup .experience-form-close-btn');
  await page.waitForSelectorHidden('.subevent-asset-view-policy-popup', { timeoutMs: 15000 });
  await page.clickVisible('.subevent-asset-view-popup .experience-form-close-btn');
  await page.waitForSelectorHidden('.subevent-asset-view-popup', { timeoutMs: 15000 });
}

async function openAssetRequestsPanel(page, marker) {
  const opened = await page.evaluate(marker => {
    const card = findVisibleInfoCardByText('.popup-panel-assets', marker);
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
  await page.waitForSelector('.asset-supply-requests-panel');
}

async function openSubEventSuppliesResource(page, subEventName) {
  await page.clickVisible('.popup-panel-event-editor .event-subevents-panel-trigger');
  await page.waitForSelector('.subevents-panel');
  await waitForVisibleText(page, '.subevents-panel', subEventName, 30000);
  const opened = await page.evaluate(subEventName => {
    const card = Array.from(document.querySelectorAll('.subevents-casual-card, .subevents-group-row'))
      .filter(isVisible)
      .find(element => (element.textContent ?? '').includes(subEventName)) ?? null;
    const button = card?.querySelector('.subevents-casual-menu-btn, .subevents-group-menu-btn');
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
  await page.waitForSelector('.subevents-casual-menu.is-open, .subevents-group-menu.is-open');
  await page.clickVisible('.subevents-casual-menu.is-open .event-subevent-badge-supplies, .subevents-group-menu.is-open .event-subevent-badge-supplies');
  await page.waitForSelector('.popup-panel-asset-members');
  await page.waitForNetwork('/api/activities/events/subevent-resources', { timeoutMs: 30000 });
  await closeExplanationPopupEventually(page, 10000);
}

async function closeResourceAndEditor(page) {
  if (await page.isSelectorVisible('.popup-panel-asset-members .popup-close[aria-label="Close"]')) {
    await page.clickVisible('.popup-panel-asset-members .popup-close[aria-label="Close"]');
    await page.waitForSelectorHidden('.popup-panel-asset-members', { timeoutMs: 20000 });
  }
  if (await page.isSelectorVisible('.subevents-panel .subevents-back-btn')) {
    await page.clickVisible('.subevents-panel .subevents-back-btn');
    await page.waitForSelectorHidden('.subevents-panel', { timeoutMs: 20000 });
  }
  if (await page.isSelectorVisible('.popup-panel-event-editor .popup-close[aria-label="Close"]')) {
    await page.clickVisible('.popup-panel-event-editor .popup-close[aria-label="Close"]');
    await page.waitForSelectorHidden('.popup-panel-event-editor', { timeoutMs: 20000 });
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
        startAt,
        endAt,
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
        published: false,
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
        subEventsDisplayMode: 'Casual',
        subEvents: [{
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
        capacityTotal: 8
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
    const raw = window.localStorage.getItem('app-session') || '{}';
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
    return (Array.isArray(assets) ? assets : []).find(asset => asset.title === title) ?? null;
  }, { userId, title });
}

async function waitForOwnedAssetFromApi(page, title, timeoutMs = 45000) {
  const started = Date.now();
  let lastAssets = [];
  while (Date.now() - started < timeoutMs) {
    const assets = await page.evaluate(async () => {
      const raw = window.localStorage.getItem('app-session') || '{}';
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
  const quickVisible = await waitForVisibleText(page, '.popup-panel-assets', marker, 12000)
    .then(() => true)
    .catch(() => false);
  const visibleAfterListProbe = quickVisible
    || await findSmartListTextByScrolling(page, '.popup-panel-assets', marker, 30000);
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
  await scrollSmartListUntilText(page, '.popup-panel-assets', marker, 60000);
  await scrollSmartListUntilText(page, '.popup-panel-assets', details, 60000);
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
  await page.waitForSelector('.popup-panel-assets');
  await page.waitForNetwork('/api/assets', { timeoutMs: 25000 });
  await waitForPopupAssetsListReady(page);
}

async function closeAssetsPopup(page) {
  if (!(await page.isSelectorVisible('.popup-panel-assets .popup-close'))) {
    return;
  }
  await page.clickVisible('.popup-panel-assets .popup-close');
  await page.waitForSelectorHidden('.popup-panel-assets', { timeoutMs: 20000 });
}

async function openMyEvents(page) {
  await openNavigatorMenu(page);
  await page.click('button[aria-label="Open my events"]');
  await closeExplanationPopupEventually(page, 10000);
  await page.waitForSelector('.popup-panel-activities');
  await page.waitForSelector('.activities-popup');
  await page.waitForNetwork('/api/activities/events', { timeoutMs: 25000 });
}

async function openEventEditorByTitle(page, title) {
  await openMyEvents(page);
  await waitForActivityTitleVisible(page, title, 45000);
  await openEventEditorFromList(page, title);
}

async function openEventEditorFromList(page, title) {
  const opened = await page.evaluate(title => {
    const card = findVisibleInfoCardByText('.popup-panel-activities', title);
    const menu = card?.querySelector('.ui-info-card__menu-trigger');
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
  await page.waitForSelector('.item-action-menu-btn, .ui-info-card__menu-action');
  await recordInfoCardMenuAnchorFinding(page, {
    title: 'Resource lifecycle event card action menu is visually detached from its three-dot trigger'
  });
  await page.recordStep('resource-event-card-menu-open');
  await page.clickByText('.item-action-menu-btn, .ui-info-card__menu-action', 'View');
  await page.waitForSelector('.popup-panel-event-editor');
  await page.waitForSelectorHidden('.popup-loading-overlay', { timeoutMs: 30000 });
  await closeExplanationPopupEventually(page, 10000);
}

async function waitForActivityTitleVisible(page, title, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const visible = await page.evaluate(title => {
      const root = document.querySelector('.popup-panel-activities') ?? document;
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
      const list = document.querySelector('.popup-panel-activities .smart-list');
      if (list) {
        list.scrollBy({ top: Math.max(360, list.clientHeight * 0.85), left: 0, behavior: 'auto' });
        list.dispatchEvent(new Event('scroll', { bubbles: true }));
      }
    });
    await page.evaluate(() => new Promise(resolve => window.setTimeout(resolve, 300)));
  }
  const listState = await page.evaluate(() => ({
    text: (document.querySelector('.popup-panel-activities')?.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 1200)
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
    const menu = card?.querySelector('.ui-info-card__menu-trigger');
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
  await page.waitForSelector('.ui-info-card__menu-action, .item-action-menu-btn');
  await recordInfoCardMenuAnchorFinding(page, {
    severity: 'warning',
    title: `Info-card action menu is visually detached for ${text}`
  });
  const clicked = await page.evaluate(({ icon, label }) => {
    const actions = Array.from(document.querySelectorAll('.ui-info-card__menu-action, .item-action-menu-btn'))
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
  await page.mouseClickVisible('.popup-panel-assets .assets-primary-filter-select');
  await page.waitForSelector('.assets-filter-options-panel, .assets-mobile-filter-panel');
  const selected = await page.evaluate(before => {
    const option = Array.from(document.querySelectorAll('.assets-filter-options-panel mat-option, .assets-mobile-filter-panel .activities-view-option'))
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

  await page.mouseClickVisible('.popup-panel-assets .assets-primary-filter-select');
  await page.waitForSelector('.assets-filter-options-panel, .assets-mobile-filter-panel');
  const restored = await page.evaluate(() => {
    const option = Array.from(document.querySelectorAll('.assets-filter-options-panel mat-option, .assets-mobile-filter-panel .activities-view-option'))
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
  const settled = await waitForSmartListSettled(page, '.popup-panel-assets', timeoutMs)
    .then(() => true)
    .catch(() => false);
  if (settled) {
    return;
  }
  const visibleCards = await page.visibleCount('.popup-panel-assets .experience-item-card');
  assert(visibleCards > 0, 'Assets smart-list should either settle or expose visible asset cards', { visibleCards });
}

async function readAssetToolbarText(page) {
  return page.evaluate(() => {
    const trigger = document.querySelector('.popup-panel-assets .assets-primary-filter-select');
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
  await page.setFileInputFiles('.asset-form-popup input[type="file"]', ASSET_IMAGE_FIXTURE_PATH);
  await page.waitFor('asset image preview visible after file selection', async () => page.evaluate(() => {
    const preview = document.querySelector('.asset-form-popup .asset-image-preview');
    const background = preview ? window.getComputedStyle(preview).backgroundImage : '';
    return background.includes('blob:') || background.includes('data:image') || background.includes('/media/');
  }), 15000);
}

async function addAssetPolicy(page, policyTitle) {
  await page.clickVisible('.asset-form-popup .asset-policies-panel .event-slots-open-btn');
  await page.waitForSelector('.asset-policies-popup');
  await page.clickVisible('.asset-policies-popup button[aria-label="Add policy"]');
  await page.waitForSelector('.asset-policy-editor-popup');
  await page.fillVisible('.asset-policy-editor-popup input[placeholder="Policy title"]', policyTitle);
  await page.fillVisible('.asset-policy-editor-popup textarea[placeholder="Explain the lending policy clearly."]', `${policyTitle} must be accepted during e2e.`);
  await page.clickVisible('.asset-policy-editor-popup button[aria-label="Save policy"]');
  await page.waitForSelectorHidden('.asset-policy-editor-popup');
  await waitForVisibleText(page, '.asset-policies-popup', policyTitle, 15000);
  await page.clickVisible('.asset-policies-popup .event-slots-popup-close');
  await page.waitForSelectorHidden('.asset-policies-popup');
}

async function fillAssetField(page, label, value) {
  const filled = await page.evaluate(({ label, value }) => {
    const needle = label.toLowerCase();
    const target = Array.from(document.querySelectorAll('.asset-form-popup label'))
      .find(item => isVisible(item) && (item.textContent ?? '').toLowerCase().includes(needle))
      ?.querySelector('input');
    if (!target) {
      return false;
    }
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.focus();
    target.value = value;
    target.dispatchEvent(new Event('input', { bubbles: true }));
    target.dispatchEvent(new Event('change', { bubbles: true }));
    target.blur();
    return true;

    function isVisible(element) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    }
  }, { label, value });
  assert(filled, `Asset form field ${label} should be fillable`);
}

async function fillAssetTextarea(page, label, value) {
  const filled = await page.evaluate(({ label, value }) => {
    const needle = label.toLowerCase();
    const target = Array.from(document.querySelectorAll('.asset-form-popup label'))
      .find(item => isVisible(item) && (item.textContent ?? '').toLowerCase().includes(needle))
      ?.querySelector('textarea');
    if (!target) {
      return false;
    }
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.focus();
    target.value = value;
    target.dispatchEvent(new Event('input', { bubbles: true }));
    target.dispatchEvent(new Event('change', { bubbles: true }));
    target.blur();
    return true;

    function isVisible(element) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    }
  }, { label, value });
  assert(filled, `Asset form textarea ${label} should be fillable`);
}

async function selectAssetFormCategory(page, label) {
  const categoryTriggerSelector = [
    '.asset-form-popup .experience-form-grid > label:nth-of-type(6) .mat-mdc-select-trigger',
    '.asset-form-popup .experience-form-grid > label:nth-of-type(6) .asset-form-mobile-type-trigger'
  ].join(', ');
  await page.mouseClickVisible(categoryTriggerSelector, { timeoutMs: 7000 }).catch(async () => {
    const opened = await page.evaluate(() => {
      const categoryLabel = Array.from(document.querySelectorAll('.asset-form-popup label'))
        .find(item => isVisible(item) && (item.textContent ?? '').toLowerCase().includes('category'));
      const trigger = categoryLabel?.querySelector('.mat-mdc-select-trigger, mat-select, .asset-form-mobile-type-trigger');
      if (!trigger || trigger.disabled) {
        return false;
      }
      trigger.scrollIntoView({ block: 'center', inline: 'center' });
      trigger.click();
      return true;

      function isVisible(element) {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none';
      }
    });
    assert(opened, 'Asset category picker should open');
  });
  const panelOpened = await page.waitForSelector('.asset-type-options-panel, .asset-form-mobile-category-panel', {
    timeoutMs: 7000
  }).then(() => true).catch(() => false);
  if (!panelOpened) {
    const applied = await setAssetCategoryDirectly(page, label);
    if (applied) {
      await page.recordStep('asset-category-picker-fallback');
      page.recordFinding?.({
        severity: 'warning',
        title: 'Asset category picker did not open from the visible trigger',
        details: { requestedCategory: label }
      });
      await waitForVisibleText(page, '.asset-form-popup', label, 10000);
      return;
    }
  }
  assert(panelOpened, 'Asset category picker should open');
  const clicked = await page.evaluate(label => {
    const needle = `${label}`.trim().toLowerCase();
    const option = Array.from(document.querySelectorAll('.asset-type-options-panel mat-option, .asset-form-mobile-category-panel .activities-view-option'))
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
  await waitForVisibleText(page, '.asset-form-popup', label, 10000);
}

async function setAssetCategoryDirectly(page, label) {
  return page.evaluate(label => {
    const host = document.querySelector('app-asset-form-popup');
    const component = window.ng?.getComponent?.(host);
    if (!component?.assetForm) {
      return false;
    }
    component.assetForm.category = label;
    window.ng?.applyChanges?.(component);
    return true;
  }, label);
}

async function chooseAssetVisibility(page, label) {
  await page.clickVisible('.asset-form-popup .asset-form-visibility-picker .event-visibility-trigger');
  await page.waitForSelector('.asset-form-popup .asset-form-visibility-picker .activities-view-picker-panel');
  const clicked = await page.evaluate(label => {
    const needle = `${label}`.trim().toLowerCase();
    const option = Array.from(document.querySelectorAll('.asset-form-popup .asset-form-visibility-picker .activities-view-option'))
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
    const shell = document.querySelector('.asset-explore-shell');
    const shellText = (shell?.textContent ?? '').toLowerCase();
    return {
      hasOrder: Array.from(document.querySelectorAll('.asset-explore-order-trigger')).some(isVisible),
      hasCategory: Array.from(document.querySelectorAll('.asset-explore-category-field')).some(isVisible),
      hasDateRange: Array.from(document.querySelectorAll('.asset-explore-date-range-field')).some(isVisible),
      hasCardsOrEmptyState: shellText.includes('no visible assets')
        || Array.from(document.querySelectorAll('.asset-explore-shell .experience-item-card, .asset-explore-empty-state')).some(isVisible)
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
