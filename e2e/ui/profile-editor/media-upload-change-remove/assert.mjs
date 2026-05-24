import { assert } from '../../../shared/assertions.mjs';
import { assertNoDocumentHorizontalOverflow, openNavigatorMenu } from '../../lib/ui-contracts.mjs';

const FIRST_IMAGE_FIXTURE = {
  url: '/assets/logo/heart.png',
  name: 'e2e-profile-heart.png'
};
const SECOND_IMAGE_FIXTURE = {
  url: '/assets/icon/android-chrome-192x192.png',
  name: 'e2e-profile-icon.png'
};

export async function assertUi({ page }) {
  await page.waitForSelector('.game-page');
  await openProfileEditor(page);
  await openImageEditor(page);
  await page.recordStep('profile-media-editor-open');

  const cleanedSlots = await removeExistingUploadedMediaSlots(page);
  if (cleanedSlots > 0) {
    await page.recordStep('profile-media-stale-uploads-cleaned');
  }

  const slotIndex = await findEmptyImageSlot(page);
  assert(slotIndex >= 0, 'Profile media test needs at least one empty image slot', await readImageSlotSnapshot(page));

  const firstUrl = await uploadProfileImageToSlot(page, slotIndex, FIRST_IMAGE_FIXTURE);
  assert(firstUrl.includes('/media/public?key='), 'Uploaded profile image should resolve to media storage URL', { firstUrl });
  await page.recordStep('profile-media-uploaded');

  await closeAndPersistProfile(page);
  await reloadProfileImageEditor(page);
  await assertImageUrlPresent(page, firstUrl, 'Uploaded profile image should reload from backend');
  await page.recordStep('profile-media-upload-reloaded');

  const secondUrl = await uploadProfileImageToSlot(page, slotIndex, SECOND_IMAGE_FIXTURE);
  assert(secondUrl.includes('/media/public?key='), 'Replacement profile image should resolve to media storage URL', { secondUrl });
  assert(secondUrl !== firstUrl, 'Replacing a profile image should produce a new media URL', { firstUrl, secondUrl });
  await page.recordStep('profile-media-replaced');

  await closeAndPersistProfile(page);
  await reloadProfileImageEditor(page);
  await assertImageUrlPresent(page, secondUrl, 'Replaced profile image should reload from backend');
  await assertImageUrlAbsent(page, firstUrl, 'Original uploaded profile image should no longer be in profile slots after replace');
  await page.recordStep('profile-media-replace-reloaded');

  await removeProfileImageSlot(page, slotIndex);
  await page.recordStep('profile-media-removed');

  await closeAndPersistProfile(page);
  await reloadProfileImageEditor(page);
  await assertImageUrlAbsent(page, secondUrl, 'Removed profile image should stay removed after reload');
  await page.recordStep('profile-media-remove-reloaded');
  await assertNoDocumentHorizontalOverflow(page);
}

async function openProfileEditor(page) {
  await openNavigatorMenu(page);
  await page.recordStep('profile-media-navigator-menu-open');
  await page.click('button[aria-label="Open profile editor"]');
  await page.waitForSelector('.popup-panel-profile-editor');
  await page.waitForSelector('.profile-editor-wrap');
}

async function openImageEditor(page) {
  await page.clickVisible('.popup-panel-profile-editor .avatar-edit-btn[aria-label="Open image editor"]');
  await page.waitForSelector('.popup-panel-image-editor');
  await page.waitForSelector('.image-editor-wrap');
}

async function reloadProfileImageEditor(page) {
  await page.navigate('/game', { loadTimeoutMs: 25000 });
  await page.waitForSelector('.game-page');
  await openProfileEditor(page);
  await openImageEditor(page);
}

async function findEmptyImageSlot(page) {
  return page.evaluate(() => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const backgroundUrl = element => {
      const background = window.getComputedStyle(element).backgroundImage || '';
      const match = background.match(/url\(["']?(.*?)["']?\)/);
      return match?.[1] ?? '';
    };
    const buttons = Array.from(document.querySelectorAll('.popup-panel-image-editor .image-editor-grid button'))
      .filter(visible);
    return buttons.findIndex(button => !backgroundUrl(button));
  });
}

async function removeExistingUploadedMediaSlots(page) {
  const removedCount = await page.evaluate(() => {
    const backgroundUrl = element => {
      const background = window.getComputedStyle(element).backgroundImage || '';
      const match = background.match(/url\(["']?(.*?)["']?\)/);
      return match?.[1] ?? '';
    };
    let removed = 0;
    const buttons = Array.from(document.querySelectorAll('.popup-panel-image-editor .image-editor-grid button'));
    for (const button of buttons) {
      const url = backgroundUrl(button);
      if (!url.includes('/media/public?key=profile/')) {
        continue;
      }
      const remove = button.querySelector('.remove-slot');
      if (!remove) {
        continue;
      }
      remove.click();
      removed += 1;
    }
    return removed;
  });
  if (removedCount <= 0) {
    return 0;
  }
  await page.waitFor('stale uploaded profile images removed from visible slots', async () => {
    const snapshot = await readImageSlotSnapshot(page);
    return !snapshot.urls.some(url => url.includes('/media/public?key=profile/'));
  }, 15000);
  return removedCount;
}

async function uploadProfileImageToSlot(page, slotIndex, fixture) {
  await selectImageSlotForUpload(page, slotIndex);
  page.clearNetworkLog();
  const uploaded = await uploadProfileImageViaBackend(page, slotIndex, fixture);
  assert(uploaded.ok, 'Profile image should upload through the backend media endpoint', uploaded);
  assert(uploaded.imageUrl.includes('/media/public?key='), 'Profile image upload should return a public media URL', uploaded);
  await page.waitFor('profile image upload finished', async () => {
    return page.evaluate(slotIndex => {
      const visible = element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0
          && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
      };
      const backgroundUrl = element => {
        const background = window.getComputedStyle(element).backgroundImage || '';
        const match = background.match(/url\(["']?(.*?)["']?\)/);
        return match?.[1] ?? '';
      };
      const rings = Array.from(document.querySelectorAll('.popup-panel-image-editor .slot-upload-ring'))
        .filter(visible);
      const slot = document.querySelectorAll('.popup-panel-image-editor .image-editor-grid button')[slotIndex];
      return rings.length === 0 && Boolean(slot && backgroundUrl(slot));
    }, slotIndex);
  }, 45000);
  const url = await imageSlotUrl(page, slotIndex);
  assert(url, 'Profile image slot should expose a background URL after upload', { slotIndex });
  return url;
}

async function uploadProfileImageViaBackend(page, slotIndex, fixture) {
  return page.evaluate(async ({ slotIndex, fixture }) => {
    const host = document.querySelector('app-profile-editor');
    const component = window.ng?.getComponent?.(host);
    if (!component?.profileUser?.id || !Array.isArray(component.imageSlots)) {
      return { ok: false, reason: 'component unavailable' };
    }
    const response = await fetch(fixture.url);
    if (!response.ok) {
      return { ok: false, reason: `fixture ${fixture.url} returned ${response.status}` };
    }
    const blob = await response.blob();
    const file = new File([blob], fixture.name, { type: blob.type || 'image/png' });
    const formData = new FormData();
    formData.append('image', file, file.name);
    formData.append('slotIndex', String(slotIndex));
    formData.append('userId', component.profileUser.id);
    const uploadResponse = await fetch('/api/auth/me/profile-image', {
      method: 'POST',
      body: formData
    });
    const text = await uploadResponse.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!uploadResponse.ok) {
      return { ok: false, status: uploadResponse.status, data };
    }
    const imageUrl = typeof data?.imageUrl === 'string' && data.imageUrl.trim()
      ? data.imageUrl.trim()
      : typeof data?.url === 'string' && data.url.trim()
        ? data.url.trim()
        : '';
    if (!imageUrl) {
      return { ok: false, status: uploadResponse.status, data, reason: 'missing imageUrl' };
    }
    component.imageSlots[slotIndex] = imageUrl;
    component.selectedImageIndex = slotIndex;
    component.syncActiveUserImageSlotsState?.(false);
    component.cdr?.markForCheck?.();
    return { ok: true, name: file.name, type: file.type, size: file.size, imageUrl };
  }, { slotIndex, fixture });
}

async function selectImageSlotForUpload(page, slotIndex) {
  const firstClick = await page.evaluate(slotIndex => {
    const button = document.querySelectorAll('.popup-panel-image-editor .image-editor-grid button')[slotIndex];
    if (!button || button.disabled) {
      return { clicked: false };
    }
    const background = window.getComputedStyle(button).backgroundImage || '';
    const hadImage = background.includes('url(');
    const wasSelected = button.classList.contains('slot-selected');
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return { clicked: true, hadImage, wasSelected };
  }, slotIndex);
  assert(firstClick.clicked, `Profile image slot ${slotIndex + 1} should be selectable`, firstClick);
  if (firstClick.hadImage && !firstClick.wasSelected) {
    await page.waitFor(`profile image slot ${slotIndex + 1} selected`, async () => {
      return page.evaluate(slotIndex => {
        const button = document.querySelectorAll('.popup-panel-image-editor .image-editor-grid button')[slotIndex];
        return Boolean(button?.classList.contains('slot-selected'));
      }, slotIndex);
    }, 10000);
    const secondClick = await page.evaluate(slotIndex => {
      const button = document.querySelectorAll('.popup-panel-image-editor .image-editor-grid button')[slotIndex];
      if (!button || button.disabled) {
        return false;
      }
      button.click();
      return true;
    }, slotIndex);
    assert(secondClick, `Selected profile image slot ${slotIndex + 1} should reopen file picker`);
  }
  await rememberSelectedImageSlotForHeadlessUpload(page, slotIndex);
}

async function rememberSelectedImageSlotForHeadlessUpload(page, slotIndex) {
  await page.evaluate(slotIndex => {
    const host = document.querySelector('app-profile-editor');
    const component = window.ng?.getComponent?.(host);
    if (!component || !('pendingSlotUploadIndex' in component)) {
      return false;
    }
    component.pendingSlotUploadIndex = slotIndex;
    return true;
  }, slotIndex).catch(() => false);
}

async function removeProfileImageSlot(page, slotIndex) {
  const removedUrl = await imageSlotUrl(page, slotIndex);
  assert(removedUrl, 'Profile image slot should contain an image before remove', { slotIndex });
  const clicked = await page.evaluate(slotIndex => {
    const button = document.querySelectorAll('.popup-panel-image-editor .image-editor-grid button')[slotIndex];
    const remove = button?.querySelector('.remove-slot');
    if (!remove) {
      return false;
    }
    remove.scrollIntoView({ block: 'center', inline: 'center' });
    remove.click();
    return true;
  }, slotIndex);
  assert(clicked, `Profile image slot ${slotIndex + 1} should expose remove button`);
  await page.waitFor('profile image removed from slot', async () => {
    const url = await imageSlotUrl(page, slotIndex);
    return !url || url !== removedUrl;
  }, 15000);
}

async function imageSlotUrl(page, slotIndex) {
  return page.evaluate(slotIndex => {
    const backgroundUrl = element => {
      const background = window.getComputedStyle(element).backgroundImage || '';
      const match = background.match(/url\(["']?(.*?)["']?\)/);
      return match?.[1] ?? '';
    };
    const slot = document.querySelectorAll('.popup-panel-image-editor .image-editor-grid button')[slotIndex];
    return slot ? backgroundUrl(slot) : '';
  }, slotIndex);
}

async function assertImageUrlPresent(page, expectedUrl, message) {
  const snapshot = await readImageSlotSnapshot(page);
  assert(snapshot.urls.includes(expectedUrl), message, { expectedUrl, snapshot });
}

async function assertImageUrlAbsent(page, expectedUrl, message) {
  const snapshot = await readImageSlotSnapshot(page);
  assert(!snapshot.urls.includes(expectedUrl), message, { expectedUrl, snapshot });
}

async function readImageSlotSnapshot(page) {
  return page.evaluate(() => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none';
    };
    const backgroundUrl = element => {
      const background = window.getComputedStyle(element).backgroundImage || '';
      const match = background.match(/url\(["']?(.*?)["']?\)/);
      return match?.[1] ?? '';
    };
    const slots = Array.from(document.querySelectorAll('.popup-panel-image-editor .image-editor-grid button'))
      .filter(visible)
      .map((button, index) => ({
        index,
        selected: button.classList.contains('slot-selected'),
        featured: button.classList.contains('slot-featured'),
        url: backgroundUrl(button)
      }));
    return {
      slotCount: slots.length,
      filledCount: slots.filter(slot => Boolean(slot.url)).length,
      urls: slots.map(slot => slot.url).filter(Boolean),
      slots
    };
  });
}

async function closeAndPersistProfile(page) {
  page.clearNetworkLog();
  if (await page.isSelectorVisible('.popup-panel-image-editor')) {
    await page.clickVisible('.popup-panel-image-editor button.popup-back-btn[aria-label="Back"]');
    await page.waitForSelector('.popup-panel-profile-editor');
  }
  await page.clickVisible('.popup-panel-profile-editor button.popup-close[aria-label="Close"]');
  await page.waitForNetwork('/api/auth/me/profile', { timeoutMs: 30000 });
  await page.waitForSelectorHidden('.popup-panel-profile-editor', { timeoutMs: 20000 });
}
