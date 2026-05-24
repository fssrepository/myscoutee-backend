import { assert } from '../../../shared/assertions.mjs';
import { openNavigatorMenu, waitForVisibleText } from '../../lib/ui-contracts.mjs';
import { fileURLToPath } from 'node:url';

const FIRST_IMAGE_FIXTURE = {
  path: fileURLToPath(new URL('../../../../frontend/src/assets/logo/heart.png', import.meta.url)),
  name: 'e2e-help-heart.png'
};
const SECOND_IMAGE_FIXTURE = {
  path: fileURLToPath(new URL('../../../../frontend/src/assets/icon/android-chrome-192x192.png', import.meta.url)),
  name: 'e2e-help-icon.png'
};

export async function assertUi({ page }) {
  const marker = `UI E2E help media ${Date.now().toString(36)}`;
  let savedRevisionId = '';

  try {
    await openHelpEditorExplanation(page);
    await page.recordStep('help-version-media-explanation-open');

    await startEmptyRevision(page);
    await ensureDraftExplanationSectionOpen(page);
    await page.recordStep('help-version-media-draft-created');

    await addAndRemoveExtraSection(page);
    await page.recordStep('help-version-media-section-add-remove');

    await fillDraftContent(page, marker);
    await page.recordStep('help-version-media-content-filled');

    const firstUrl = await uploadHelpImageToDraftSlot(page, 0, FIRST_IMAGE_FIXTURE);
    assert(firstUrl.includes('/api/media/public?key='), 'First help editor media upload should resolve through API media storage', { firstUrl });
    await assertDraftCarouselImagePresent(page, firstUrl);
    await page.recordStep('help-version-media-first-image-added');

    await removeDraftCarouselSlot(page, 0, firstUrl);
    await assertDraftCarouselImageAbsent(page, firstUrl);
    await page.recordStep('help-version-media-first-image-removed');

    const secondUrl = await uploadHelpImageToDraftSlot(page, 0, SECOND_IMAGE_FIXTURE);
    assert(secondUrl.includes('/api/media/public?key='), 'Second help editor media upload should resolve through API media storage', { secondUrl });
    assert(secondUrl !== firstUrl, 'Re-adding media should produce a distinct stored image URL', { firstUrl, secondUrl });
    await assertDraftCarouselImagePresent(page, secondUrl);
    await page.recordStep('help-version-media-second-image-added');

    page.clearNetworkLog();
    await page.clickVisible('.help-editor-draft-row .help-editor-confirm-btn');
    await page.waitForNetwork('/api/admin/explanation/revisions', { timeoutMs: 45000 });
    await waitForVisibleText(page, '.popup-panel-help-editor', marker, 45000);
    const savedRevision = await readRevisionByMarker(page, marker);
    assert(savedRevision?.id, 'Saved help editor revision should be visible in component state', { savedRevision });
    savedRevisionId = savedRevision.id;
    assert(
      savedRevision.imageUrls.includes(secondUrl),
      'Saved help editor revision should keep the re-added media URL',
      { savedRevision, secondUrl }
    );
    assert(!savedRevision.imageUrls.includes(firstUrl), 'Removed help editor media URL should not be saved', {
      savedRevision,
      firstUrl
    });
    await page.recordStep('help-version-media-revision-saved');

    await reloadAndOpenHelpEditorExplanation(page);
    await waitForVisibleText(page, '.popup-panel-help-editor', marker, 45000);
    const reloadedRevision = await readRevisionByMarker(page, marker);
    assert(reloadedRevision?.id === savedRevisionId, 'Saved help editor revision should reload from backend', {
      savedRevisionId,
      reloadedRevision
    });
    assert(reloadedRevision.imageUrls.includes(secondUrl), 'Reloaded help editor revision should keep saved media URL', {
      reloadedRevision,
      secondUrl
    });
    await assertImageLoadsInBrowser(page, secondUrl);
    await openSavedRevisionPreview(page, marker);
    await assertSavedPreviewReferencesImage(page, marker, secondUrl);
    await page.recordStep('help-version-media-revision-reloaded');

    await deleteRevisionThroughUi(page, marker);
    await waitForRevisionAbsent(page, marker, savedRevisionId);
    savedRevisionId = '';
    await page.recordStep('help-version-media-revision-deleted');
  } finally {
    if (savedRevisionId) {
      await deleteRevisionViaApi(page, savedRevisionId).catch(error => {
        page.recordFinding?.({
          severity: 'warning',
          title: 'Help editor test revision cleanup failed',
          details: { savedRevisionId, error: error.message }
        });
      });
    }
  }
}

async function openHelpEditorExplanation(page) {
  await page.waitForSelector('.admin-workspace');
  await openNavigatorMenu(page);
  await page.recordStep('help-version-media-admin-menu-open');
  await page.click('button[aria-label="Open content editor"]');
  await page.waitForSelector('.popup-panel-help-editor');
  await selectFirstExplanationSurface(page);
}

async function reloadAndOpenHelpEditorExplanation(page) {
  await page.navigate('/admin/workspace', { loadTimeoutMs: 30000 });
  await page.waitForSelector('.admin-workspace');
  await openNavigatorMenu(page);
  await page.click('button[aria-label="Open content editor"]');
  await page.waitForSelector('.popup-panel-help-editor');
  await selectFirstExplanationSurface(page);
}

async function selectFirstExplanationSurface(page) {
  await page.click('.help-editor-document-menu-btn');
  await page.click('.help-editor-document-menu-branch');
  await page.click('.help-editor-document-menu-surface');
  await page.waitForNetwork('/api/admin/explanation', { timeoutMs: 30000 });
  await page.waitForSelector('.popup-panel-help-editor');
}

async function startEmptyRevision(page) {
  await page.clickVisible('button[title="Create empty revision"]');
  await page.waitForSelector('.help-editor-draft-row');
  const contextSelected = await page.evaluate(() => {
    const text = document.querySelector('.help-editor-draft-row .help-editor-context-trigger')?.textContent ?? '';
    return text.trim().length > 0 && !text.includes('Choose screen');
  });
  assert(contextSelected, 'New explanation revision should inherit the selected canonical screen');
}

async function ensureDraftExplanationSectionOpen(page) {
  const opened = await page.evaluate(() => {
    const isVisible = element => {
      if (!element) {
        return false;
      }
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.display !== 'none'
        && style.visibility !== 'hidden';
    };
    const draft = document.querySelector('.help-editor-draft-row');
    if (!draft) {
      return false;
    }
    if (!isVisible(draft.querySelector('.help-editor-draft-body'))) {
      const draftToggle = draft.querySelector('.help-editor-draft-header-actions .help-editor-caret-btn');
      if (draftToggle && !draftToggle.disabled) {
        draftToggle.scrollIntoView({ block: 'center', inline: 'center' });
        draftToggle.click();
      }
    }
    if (isVisible(draft.querySelector('app-editable-image-carousel'))) {
      return true;
    }
    const sectionToggle = Array.from(draft.querySelectorAll('.help-editor-edit-section .help-editor-caret-btn'))
      .find(button => !button.disabled && button.getAttribute('aria-expanded') !== 'true' && isVisible(button));
    if (sectionToggle) {
      sectionToggle.scrollIntoView({ block: 'center', inline: 'center' });
      sectionToggle.click();
    }
    return true;
  });
  assert(opened, 'Help editor draft section should be openable');
  await page.waitForSelector('.help-editor-draft-row app-editable-image-carousel');
  await page.waitForSelector('.help-editor-draft-row .editable-image-carousel');
}

async function addAndRemoveExtraSection(page) {
  const before = await draftSectionCount(page);
  await page.clickVisible('.help-editor-hero-add-section-btn');
  await page.waitFor('extra help editor draft section added', async () => {
    return (await draftSectionCount(page)) === before + 1;
  }, 15000);
  const removed = await page.evaluate(() => {
    const isVisible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.display !== 'none'
        && style.visibility !== 'hidden';
    };
    const sections = Array.from(document.querySelectorAll('.help-editor-draft-row .help-editor-edit-section'))
      .filter(isVisible);
    const last = sections[sections.length - 1];
    const button = last?.querySelector('.help-editor-danger-btn');
    if (!button || button.disabled) {
      return false;
    }
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  });
  assert(removed, 'Added help editor draft section should expose a remove button');
  await page.waitFor('extra help editor draft section removed', async () => {
    return (await draftSectionCount(page)) === before;
  }, 15000);
  await ensureDraftExplanationSectionOpen(page);
}

async function draftSectionCount(page) {
  return page.evaluate(() => document.querySelectorAll('.help-editor-draft-row .help-editor-edit-section').length);
}

async function fillDraftContent(page, marker) {
  await page.fillVisible('.help-editor-draft-title-input', `${marker} title`);
  await page.fillVisible('.help-editor-draft-summary-input', `${marker} header`);
  await page.fillVisible('textarea[name="helpDescription"]', `${marker} description`);
  await page.fillVisible('.help-editor-section-title-input', `${marker} section`);
  if ((await page.visibleCount('.help-editor-html-textarea')) === 0) {
    await page.clickVisible('.help-editor-edit-section .help-editor-mode-toggle');
  }
  await page.waitForSelector('.help-editor-html-textarea');
  await page.fillVisible('.help-editor-html-textarea', `<p>${marker} body saved by UI e2e.</p>`);
}

async function uploadHelpImageToDraftSlot(page, slotIndex, fixture) {
  await clickDraftCarouselSlot(page, slotIndex);
  page.clearNetworkLog();
  await page.setFileInputFiles('.help-editor-draft-row .editable-image-carousel__slot-input', fixture.path, {
    index: slotIndex
  });
  await page.waitForNetwork('/api/media/images', { timeoutMs: 45000 });
  await page.waitFor('help editor carousel upload completed', async () => {
    return page.evaluate(() => {
      return !Array.from(document.querySelectorAll('.help-editor-draft-row .editable-image-carousel__upload-ring'))
        .some(element => {
          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);
          return rect.width > 0
            && rect.height > 0
            && style.display !== 'none'
            && style.visibility !== 'hidden';
        });
    });
  }, 45000);
  const imageUrl = await draftCarouselImageUrlAtSlot(page, slotIndex);
  assert(imageUrl, 'Help editor carousel slot should expose a media URL after upload', { fixture, slotIndex });
  await assertImageLoadsInBrowser(page, imageUrl);
  await assertDraftCarouselImagePresent(page, imageUrl);
  return imageUrl;
}

async function clickDraftCarouselSlot(page, slotIndex) {
  const clicked = await page.evaluate(slotIndex => {
    const buttons = Array.from(document.querySelectorAll('.help-editor-draft-row .editable-image-carousel__slot-hit'));
    const button = buttons[Math.max(0, Math.trunc(Number(slotIndex) || 0))];
    if (!button || button.disabled) {
      return false;
    }
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  }, slotIndex);
  assert(clicked, `Help editor carousel slot ${slotIndex + 1} should be clickable`);
}

async function removeDraftCarouselSlot(page, slotIndex, expectedUrl) {
  const removed = await page.evaluate(({ slotIndex, expectedUrl }) => {
    const slots = Array.from(document.querySelectorAll('.help-editor-draft-row .editable-image-carousel__slot'));
    const slot = slots[Math.max(0, Math.trunc(Number(slotIndex) || 0))];
    if (!slot) {
      return false;
    }
    const background = window.getComputedStyle(slot).backgroundImage || '';
    if (expectedUrl && !decodeURIComponent(background).includes(expectedUrl)) {
      return false;
    }
    const remove = slot.querySelector('.editable-image-carousel__slot-action--remove');
    if (!remove || remove.disabled) {
      return false;
    }
    remove.scrollIntoView({ block: 'center', inline: 'center' });
    remove.click();
    return true;
  }, { slotIndex, expectedUrl });
  assert(removed, `Help editor carousel slot ${slotIndex + 1} should expose a remove button`);
}

async function assertDraftCarouselImagePresent(page, expectedUrl) {
  await page.waitFor(`help editor draft carousel contains ${expectedUrl}`, async () => {
    const snapshot = await readDraftCarouselSnapshot(page);
    return snapshot.urls.includes(expectedUrl);
  }, 30000);
}

async function assertDraftCarouselImageAbsent(page, expectedUrl) {
  await page.waitFor(`help editor draft carousel removed ${expectedUrl}`, async () => {
    const snapshot = await readDraftCarouselSnapshot(page);
    return !snapshot.urls.includes(expectedUrl);
  }, 15000);
}

async function readDraftCarouselSnapshot(page) {
  return page.evaluate(() => {
    const backgroundUrl = element => {
      const background = window.getComputedStyle(element).backgroundImage || '';
      return background.match(/url\(["']?(.*?)["']?\)/)?.[1] ?? '';
    };
    const urls = Array.from(document.querySelectorAll('.help-editor-draft-row .editable-image-carousel__slot'))
      .map(backgroundUrl)
      .filter(Boolean)
      .map(url => url.startsWith(window.location.origin) ? url.slice(window.location.origin.length) : url);
    return { urls };
  });
}

async function draftCarouselImageUrlAtSlot(page, slotIndex) {
  return page.evaluate(slotIndex => {
    const host = document.querySelector('.help-editor-draft-row app-editable-image-carousel');
    const carousel = window.ng?.getComponent?.(host);
    const componentUrls = typeof carousel?.imageSlots === 'function'
      ? carousel.imageSlots()
      : [];
    const value = componentUrls[Math.max(0, Math.trunc(Number(slotIndex) || 0))] ?? '';
    if (value) {
      return `${value}`;
    }
    const slot = Array.from(document.querySelectorAll('.help-editor-draft-row .editable-image-carousel__slot'))[slotIndex];
    const background = slot ? window.getComputedStyle(slot).backgroundImage || '' : '';
    return background.match(/url\(["']?(.*?)["']?\)/)?.[1] ?? '';
  }, slotIndex);
}

async function readRevisionByMarker(page, marker) {
  return page.evaluate(marker => {
    const host = document.querySelector('app-admin-help-editor-popup');
    const component = window.ng?.getComponent?.(host);
    const revisions = typeof component?.revisions === 'function' ? component.revisions() : [];
    const revision = revisions.find(item => JSON.stringify(item).includes(marker));
    if (!revision) {
      return null;
    }
    return {
      id: revision.id,
      version: revision.version,
      title: revision.title,
      summary: revision.summary,
      active: revision.active === true,
      sectionCount: Array.isArray(revision.sections) ? revision.sections.length : 0,
      imageUrls: Array.from(new Set((revision.sections ?? []).flatMap(section => section.imageUrls ?? [])))
    };
  }, marker);
}

async function openSavedRevisionPreview(page, marker) {
  const opened = await page.evaluate(marker => {
    const isVisible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.display !== 'none'
        && style.visibility !== 'hidden';
    };
    const card = Array.from(document.querySelectorAll('.help-editor-revision-card'))
      .find(item => item.textContent?.includes(marker) && !item.classList.contains('help-editor-draft-card'));
    if (!card) {
      return false;
    }
    card.scrollIntoView({ block: 'center', inline: 'center' });
    if (!card.classList.contains('is-open')) {
      const toggle = card.querySelector('.help-editor-revision-toggle, .help-editor-caret-btn');
      toggle?.click();
    }
    const sectionToggle = Array.from(card.querySelectorAll('.help-editor-preview-section-toggle'))
      .find(isVisible);
    if (sectionToggle && sectionToggle.getAttribute('aria-expanded') !== 'true') {
      sectionToggle.click();
    }
    return true;
  }, marker);
  assert(opened, 'Saved help editor revision preview should be openable');
  await page.waitForSelector('.help-editor-revision-card .help-editor-html-preview');
}

async function assertSavedPreviewReferencesImage(page, marker, expectedUrl) {
  await page.waitFor('saved help editor preview references saved image', async () => {
    return page.evaluate(({ marker, expectedUrl }) => {
      const card = Array.from(document.querySelectorAll('.help-editor-revision-card'))
        .find(item => item.textContent?.includes(marker) && !item.classList.contains('help-editor-draft-card'));
      const html = card?.innerHTML ?? '';
      return html.includes(expectedUrl) || decodeURIComponent(html).includes(expectedUrl);
    }, { marker, expectedUrl });
  }, 30000);
}

async function assertImageLoadsInBrowser(page, imageUrl) {
  const result = await page.evaluate(imageUrl => {
    return new Promise(resolve => {
      const image = new Image();
      const timeout = window.setTimeout(() => resolve({ ok: false, reason: 'timeout', imageUrl }), 12000);
      image.onload = () => {
        window.clearTimeout(timeout);
        resolve({
          ok: image.naturalWidth > 0,
          width: image.naturalWidth,
          height: image.naturalHeight,
          imageUrl
        });
      };
      image.onerror = () => {
        window.clearTimeout(timeout);
        resolve({ ok: false, reason: 'error', imageUrl });
      };
      image.src = new URL(imageUrl, window.location.origin).toString();
    });
  }, imageUrl);
  assert(result.ok, 'Uploaded help editor image should load in the browser', result);
}

async function deleteRevisionThroughUi(page, marker) {
  const clicked = await page.evaluate(marker => {
    const card = Array.from(document.querySelectorAll('.help-editor-revision-card'))
      .find(item => item.textContent?.includes(marker) && !item.classList.contains('help-editor-draft-card'));
    const button = card?.querySelector('button[aria-label="Delete revision"]');
    if (!button || button.disabled) {
      return false;
    }
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  }, marker);
  assert(clicked, 'Saved help editor revision should expose Delete revision action');
  await page.waitForSelector('.confirmation-dialog');
  page.clearNetworkLog();
  await page.clickVisible('.confirmation-dialog-confirm-btn');
  await page.waitForNetwork('/api/admin/explanation/revisions/', { timeoutMs: 45000 });
  await page.waitForSelectorHidden('.confirmation-dialog', { timeoutMs: 45000 });
}

async function waitForRevisionAbsent(page, marker, revisionId) {
  await page.waitFor('help editor revision deleted from UI state', async () => {
    const present = await page.evaluate(({ marker, revisionId }) => {
      const host = document.querySelector('app-admin-help-editor-popup');
      const component = window.ng?.getComponent?.(host);
      const revisions = typeof component?.revisions === 'function' ? component.revisions() : [];
      return revisions.some(item => item.id === revisionId || JSON.stringify(item).includes(marker));
    }, { marker, revisionId });
    return !present;
  }, 45000);
}

async function deleteRevisionViaApi(page, revisionId) {
  const result = await page.evaluate(async revisionId => {
    const response = await fetch(`/api/admin/explanation/revisions/${encodeURIComponent(revisionId)}`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ actorUserId: 'admin-demo-ava' })
    });
    return { ok: response.ok, status: response.status };
  }, revisionId);
  assert(result.ok, 'Help editor cleanup delete should succeed', { revisionId, result });
}
