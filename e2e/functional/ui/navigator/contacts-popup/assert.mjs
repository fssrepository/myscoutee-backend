import { assert } from '../../../../shared/assertions.mjs';
import {
  assertNoDocumentHorizontalOverflow,
  openNavigatorMenu,
  waitForSmartListSettled,
  waitForVisibleText
} from '../../lib/ui-contracts.mjs';

const DEFAULT_UI_USER_ID = 'bf057de7c586eede7e84bdc7';

export async function assertUi({ page }) {
  const activeUserId = process.env.E2E_UI_USER_ID ?? DEFAULT_UI_USER_ID;
  await seedContactStorage(page, activeUserId);
  await openNavigatorMenu(page);
  await page.clickVisible('.user-menu-panel.open .asset-shortcut-contact');
  await page.waitForSelector('.popup-panel-contacts');
  await waitForSmartListSettled(page, '.popup-panel-contacts');
  await waitForVisibleText(page, '.popup-panel-contacts', 'E2E Saved Contact', 30000);
  await waitForVisibleText(page, '.popup-panel-contacts', 'navigator-contact-e2e@example.com', 30000);
  await waitForVisibleText(page, '.popup-panel-contacts', '+421 900 000 001', 30000);

  const cardCount = await page.visibleCount('.navigator-contact-card');
  assert(cardCount >= 1, 'Contacts popup should render at least one saved contact card', { cardCount });
  await assertNoDocumentHorizontalOverflow(page);
}

async function seedContactStorage(page, userId) {
  await page.evaluate(({ userId }) => {
    const key = `myscoutee.demo.navigator.contacts.v1.${userId}`;
    window.localStorage.setItem(key, JSON.stringify([
      {
        id: `e2e-ui-contact-${Date.now()}`,
        userId: 'e2e-ui-contact-user',
        name: 'E2E Saved Contact',
        initials: 'ES',
        gender: 'man',
        city: 'Bratislava',
        avatarUrl: '',
        headline: 'Saved contact with direct methods',
        createdAtIso: '2026-06-04T00:00:00Z',
        updatedAtIso: '2026-06-04T00:00:00Z',
        methods: [
          {
            id: 'e2e-ui-contact-email',
            type: 'email',
            value: 'navigator-contact-e2e@example.com'
          },
          {
            id: 'e2e-ui-contact-phone',
            type: 'phone',
            value: '+421 900 000 001'
          }
        ]
      }
    ]));
  }, { userId });
}
