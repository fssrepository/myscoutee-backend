import { assert } from '../../../../shared/assertions.mjs';
import { openNavigatorMenu, waitForVisibleText } from '../../lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  const marker = `UI E2E help ${Date.now().toString(36)}`;
  await page.waitForSelector('.admin-workspace');
  await openNavigatorMenu(page);
  await page.recordStep('admin-navigator-menu-open');
  await page.click('button[aria-label="Open content editor"]');
  await page.waitForSelector('.popup-panel-help-editor');
  await page.recordStep('help-editor-open');
  await page.click('.help-editor-document-menu-btn');
  await page.click('.help-editor-document-menu-branch');
  await page.click('.help-editor-document-menu-surface');
  await page.waitForNetwork('/api/admin/explanation');
  await page.waitForSelector('.popup-panel-help-editor');
  await page.recordStep('explanation-document-selected');
  await clickVisibleHelpEditorEditButton(page);
  await page.waitForSelector('.help-editor-draft-row');
  await page.recordStep('explanation-edit-mode-open');
  await ensureDraftExplanationSectionOpen(page);
  await page.waitForSelector('app-editable-image-carousel');
  await page.waitForSelector('.editable-image-carousel');
  await page.recordStep('explanation-edit-carousel-visible');
  await page.waitFor('seeded explanation carousel image backgrounds', async () => {
    return page.evaluate(() => {
      return Array.from(document.querySelectorAll('.editable-image-carousel__slot.is-filled')).some(element => {
        const background = window.getComputedStyle(element).backgroundImage;
        return background && background !== 'none' && !background.includes('help-seeded-image:');
      });
    });
  }, 12000);
  const backgrounds = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.editable-image-carousel__slot.is-filled'))
      .map(element => window.getComputedStyle(element).backgroundImage)
      .filter(value => value && value !== 'none');
  });
  assert(backgrounds.length > 0, 'Help editor explanation carousel should render seeded image backgrounds');
  const imageUrls = backgrounds.map(extractCssBackgroundUrl).filter(Boolean);
  assert(imageUrls.length > 0, 'Help editor carousel backgrounds should expose image URLs', { backgrounds });
  const loadedImages = await page.evaluate(async imageUrls => {
    const loadImage = url => new Promise(resolve => {
      const image = new Image();
      const timeout = window.setTimeout(() => resolve({ url, ok: false, reason: 'timeout' }), 10000);
      image.onload = () => {
        window.clearTimeout(timeout);
        resolve({ url, ok: image.naturalWidth > 0, width: image.naturalWidth, height: image.naturalHeight });
      };
      image.onerror = () => {
        window.clearTimeout(timeout);
        resolve({ url, ok: false, reason: 'error' });
      };
      image.src = url;
    });
    return Promise.all(imageUrls.map(loadImage));
  }, imageUrls);
  assert(loadedImages.every(item => item.ok), 'Help editor MiniIO carousel images should load in the browser', {
    loadedImages
  });
  await page.recordStep('explanation-edit-carousel-images-loaded');

  await updateDraftContent(page, marker);
  await page.recordStep('explanation-edit-content-updated');
  await page.clickVisible('.help-editor-draft-row .help-editor-confirm-btn');
  await page.waitForNetwork('/api/admin/explanation', { timeoutMs: 30000 });
  await waitForVisibleText(page, '.popup-panel-help-editor', marker, 30000);
  await page.recordStep('explanation-revision-saved-visible');
}

function extractCssBackgroundUrl(value) {
  const match = `${value ?? ''}`.match(/^url\(["']?(.+?)["']?\)$/);
  return match?.[1] ?? '';
}

async function clickVisibleHelpEditorEditButton(page) {
  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button[aria-label="Edit revision"]'))
      .filter(button => {
        const rect = button.getBoundingClientRect();
        const style = window.getComputedStyle(button);
        return rect.width > 0
          && rect.height > 0
          && style.display !== 'none'
          && style.visibility !== 'hidden'
          && !button.disabled;
      });
    const button = buttons[0];
    if (!button) {
      return false;
    }
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  });
  assert(clicked, 'Help editor should expose an editable explanation revision');
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
    if (isVisible(document.querySelector('app-editable-image-carousel'))) {
      return true;
    }

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

    const sectionToggle = Array.from(draft.querySelectorAll('.help-editor-edit-section .help-editor-caret-btn'))
      .find(button => !button.disabled && button.getAttribute('aria-expanded') !== 'true' && isVisible(button));
    if (sectionToggle) {
      sectionToggle.scrollIntoView({ block: 'center', inline: 'center' });
      sectionToggle.click();
    }
    return true;
  });
  assert(opened, 'Help editor draft section should be openable');
}

async function updateDraftContent(page, marker) {
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
