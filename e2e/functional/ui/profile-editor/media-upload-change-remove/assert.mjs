import { assert } from '../../../../shared/assertions.mjs';
import { assertNoDocumentHorizontalOverflow, openNavigatorMenu } from '../../lib/ui-contracts.mjs';
import { fileURLToPath } from 'node:url';

const FIRST_IMAGE_FIXTURE = {
  path: fileURLToPath(new URL('../../../../../frontend/src/assets/logo/heart.png', import.meta.url)),
  name: 'e2e-profile-heart.png'
};
const SECOND_IMAGE_FIXTURE = {
  path: fileURLToPath(new URL('../../../../../frontend/src/assets/icon/android-chrome-192x192.png', import.meta.url)),
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

  const secondUrl = await uploadProfileImageToSlot(page, slotIndex, SECOND_IMAGE_FIXTURE, firstUrl);
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
  await page.waitForSelector('.profile-editor-popup-content');
  await page.waitForSelector('.profile-editor-wrap');
}

async function openImageEditor(page) {
  await page.clickVisible('.profile-editor-popup-content button[aria-label="Open image editor"]');
  await page.waitForSelector('.image-editor-wrap');
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
    const buttons = Array.from(document.querySelectorAll('.image-editor-wrap .image-carousel__slot'))
      .filter(visible);
    return buttons.findIndex(button => !button.classList.contains('is-filled') && !backgroundUrl(button));
  });
}

async function removeExistingUploadedMediaSlots(page) {
  const slotIndexes = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.image-editor-wrap .image-carousel__slot'))
      .map((slot, index) => ({ index, filled: slot.classList.contains('is-filled') }))
      .filter(slot => slot.index >= 3 && slot.filled)
      .map(slot => slot.index)
      .sort((first, second) => second - first);
  });
  if (slotIndexes.length === 0) {
    return 0;
  }
  for (const slotIndex of slotIndexes) {
    const clicked = await page.evaluate(slotIndex => {
      const slot = document.querySelectorAll('.image-editor-wrap .image-carousel__slot')[slotIndex];
      const remove = slot?.querySelector('button[aria-label="Remove image"]');
      if (!remove) {
        return false;
      }
      remove.click();
      return true;
    }, slotIndex);
    assert(clicked, `Existing uploaded profile image ${slotIndex + 1} should be removable`);
    await page.waitFor(`uploaded profile image ${slotIndex + 1} removed`, async () => {
      const snapshot = await readImageSlotSnapshot(page);
      return snapshot.filledCount < slotIndex + 1;
    }, 10000);
  }
  await page.waitFor('stale uploaded profile images removed from visible slots', async () => {
    const snapshot = await readImageSlotSnapshot(page);
    return snapshot.filledCount === 3;
  }, 15000);
  return slotIndexes.length;
}

async function uploadProfileImageToSlot(page, slotIndex, fixture, previousUrl = '') {
  await selectImageSlotForUpload(page, slotIndex);
  page.clearNetworkLog();
  await page.setFileInputFiles(
    '.image-editor-wrap .image-carousel__slot-input',
    fixture.path,
    { index: slotIndex }
  );
  await page.waitForNetwork('/api/media/images', { timeoutMs: 45000 });
  await page.waitFor('profile image upload finished', async () => {
    return page.evaluate(({ slotIndex, previousUrl }) => {
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
      const rings = Array.from(document.querySelectorAll('.image-editor-wrap .image-carousel__upload-ring'))
        .filter(visible);
      const slot = document.querySelectorAll('.image-editor-wrap .image-carousel__slot')[slotIndex];
      const currentUrl = slot ? backgroundUrl(slot) : '';
      return rings.length === 0 && Boolean(currentUrl) && currentUrl !== previousUrl;
    }, { slotIndex, previousUrl });
  }, 45000);
  const url = await imageSlotUrl(page, slotIndex);
  assert(url, 'Profile image slot should expose a background URL after upload', { slotIndex });
  assert(url.includes('/media/public?key='), 'Profile image upload should return a public media URL', {
    fixture: fixture.name,
    slotIndex,
    url
  });
  return url;
}

async function selectImageSlotForUpload(page, slotIndex) {
  const firstClick = await page.evaluate(slotIndex => {
    const button = document.querySelectorAll('.image-editor-wrap .image-carousel__slot-hit')[slotIndex];
    if (!button || button.disabled) {
      return { clicked: false };
    }
    const slot = button.closest('.image-carousel__slot');
    const background = slot ? window.getComputedStyle(slot).backgroundImage || '' : '';
    const hadImage = background.includes('url(');
    const wasSelected = Boolean(slot?.classList.contains('is-selected'));
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return { clicked: true, hadImage, wasSelected };
  }, slotIndex);
  assert(firstClick.clicked, `Profile image slot ${slotIndex + 1} should be selectable`, firstClick);
  if (firstClick.hadImage && !firstClick.wasSelected) {
    await page.waitFor(`profile image slot ${slotIndex + 1} selected`, async () => {
      return page.evaluate(slotIndex => {
        const slot = document.querySelectorAll('.image-editor-wrap .image-carousel__slot')[slotIndex];
        return Boolean(slot?.classList.contains('is-selected'));
      }, slotIndex);
    }, 10000);
    const secondClick = await page.evaluate(slotIndex => {
      const button = document.querySelectorAll('.image-editor-wrap .image-carousel__slot-hit')[slotIndex];
      if (!button || button.disabled) {
        return false;
      }
      button.click();
      return true;
    }, slotIndex);
    assert(secondClick, `Selected profile image slot ${slotIndex + 1} should reopen file picker`);
  }
}

async function removeProfileImageSlot(page, slotIndex) {
  const removedUrl = await imageSlotUrl(page, slotIndex);
  assert(removedUrl, 'Profile image slot should contain an image before remove', { slotIndex });
  const clicked = await page.evaluate(slotIndex => {
    const slot = document.querySelectorAll('.image-editor-wrap .image-carousel__slot')[slotIndex];
    const remove = slot?.querySelector('button[aria-label="Remove image"]');
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
    const slot = document.querySelectorAll('.image-editor-wrap .image-carousel__slot')[slotIndex];
    return slot ? backgroundUrl(slot) : '';
  }, slotIndex);
}

async function assertImageUrlPresent(page, expectedUrl, message) {
  const rendered = await page.waitFor('profile image URL rendered after reload', async () => {
    const snapshot = await readImageSlotSnapshot(page);
    return snapshot.urls.includes(expectedUrl);
  }, 15000).then(() => true).catch(() => false);
  const snapshot = await readImageSlotSnapshot(page);
  assert(rendered && snapshot.urls.includes(expectedUrl), message, { expectedUrl, snapshot });
}

async function assertImageUrlAbsent(page, expectedUrl, message) {
  await page.waitFor('profile image carousel settled after reload', async () => {
    const snapshot = await readImageSlotSnapshot(page);
    return snapshot.filledCount === snapshot.urls.length;
  }, 15000);
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
    const slots = Array.from(document.querySelectorAll('.image-editor-wrap .image-carousel__slot'))
      .filter(visible)
      .map((button, index) => ({
        index,
        selected: button.classList.contains('is-selected'),
        featured: index === 0 && button.classList.contains('is-filled'),
        filled: button.classList.contains('is-filled'),
        url: backgroundUrl(button)
      }));
    return {
      slotCount: slots.length,
      filledCount: slots.filter(slot => slot.filled).length,
      urls: slots.map(slot => slot.url).filter(Boolean),
      slots
    };
  });
}

async function closeAndPersistProfile(page) {
  page.clearNetworkLog();
  if (await page.isSelectorVisible('.image-editor-wrap')) {
    await page.clickVisible('app-profile-editor .ui-popup__close[aria-label="Close"]');
    await page.waitForSelector('.profile-editor-popup-content');
  }
  await page.clickVisible('app-profile-editor button[aria-label="Save profile"]');
  await page.waitForNetwork('/api/auth/me/profile-ext', { timeoutMs: 30000 });
  await page.waitForSelectorHidden('.profile-editor-popup-content', { timeoutMs: 20000 });
}
