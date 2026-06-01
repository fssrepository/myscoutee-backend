export async function assertUi({ page }) {
  await page.waitForSelector('app-root');
  await page.recordStep('help-session-root');
}
