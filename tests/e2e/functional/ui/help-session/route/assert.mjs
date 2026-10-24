import { assert } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';

export async function assertUi({ page }) {
  await page.waitForUrlPath('/game', 25000);
  await page.waitForSelector('.game-page', { timeoutMs: 25000 });
  const storage = await page.evaluate(() => {
    const parse = (value) => {
      try {
        return JSON.parse(value || '{}');
      } catch {
        return {};
      }
    };
    return {
      supportSession: parse(window.sessionStorage.getItem('myscoutee.http.admin-support.session.v1')),
      adminAppSession: parse(window.localStorage.getItem('myscoutee.http.session.v1')),
      adminWorkspaceSession: parse(window.localStorage.getItem('myscoutee.http.admin.session.v1')),
      activeDemoUserId: window.localStorage.getItem('myscoutee.http.demo.active-user.v1') || ''
    };
  });
  const session = storage.supportSession;
  assert(session?.kind === 'demo', 'Shared help route should establish a demo support session', session);
  assert(session?.userId === 'bf057de7c586eede7e84bdc7', 'Shared help route should select the token owner', session);
  assert(
    typeof session?.sessionId === 'string' && session.sessionId.startsWith('session:'),
    'Shared help route should retain the server-tracked support session id',
    session
  );
  assert(session?.supportContext?.kind === 'admin-support', 'Shared help route should retain admin support context', session);
  assert(
    storage.adminAppSession?.kind === 'demo'
      && storage.adminAppSession?.userId === 'admin-demo-ava',
    'Support perspective must not replace the original admin app session in localStorage',
    storage
  );
  assert(
    storage.adminWorkspaceSession?.adminUserId === 'admin-demo-ava',
    'Support perspective must not replace the original admin workspace session',
    storage
  );
  assert(
    storage.activeDemoUserId === 'admin-demo-ava',
    'Support perspective must not replace the original active admin demo identity',
    storage
  );
  await page.recordStep('help-session-target-open');
}
