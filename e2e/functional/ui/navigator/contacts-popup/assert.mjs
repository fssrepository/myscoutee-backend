import { assert } from '../../../../shared/assertions.mjs';
import {
  assertNoDocumentHorizontalOverflow,
  openNavigatorMenu,
  waitForSmartListSettled,
  waitForVisibleText
} from '../../lib/ui-contracts.mjs';

export async function assertUi({ page }) {
  await openNavigatorMenu(page);
  await page.clickVisible('.user-menu-panel.open button[aria-label="Contacts"]');
  await page.waitForSelector('.contacts-popup-content');
  await page.waitForNetwork('/api/navigator/contacts', { timeoutMs: 30000 });
  await waitForSmartListSettled(page, '.contacts-popup-content');
  await waitForVisibleText(page, '.contacts-popup-content', 'Kiss Balázs', 30000);
  await waitForVisibleText(page, '.contacts-popup-content', 'balazs.kiss@example.com', 30000);
  await waitForVisibleText(page, '.contacts-popup-content', '+1 312 555 0184', 30000);

  const cardCount = await page.visibleCount('.contact-card');
  assert(cardCount >= 1, 'Contacts popup should render at least one saved contact card', { cardCount });
  await assertNoDocumentHorizontalOverflow(page);
}
