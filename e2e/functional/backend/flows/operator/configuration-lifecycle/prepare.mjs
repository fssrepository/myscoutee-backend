import { operatorHeaders } from '../../../lib/operator-contracts.mjs';

export async function skip({ ctx }) {
  const current = await ctx.http.get('/api/operator/configuration', {
    headers: operatorHeaders(ctx.vars.operatorUserId),
    expectedStatus: 200
  });
  const paymentSecret = current.data?.payment?.credentialConfigured === true;
  const firebaseSecrets = current.data?.firebase?.authenticationCredentialConfigured === true
    || current.data?.firebase?.messagingCredentialConfigured === true;
  if (paymentSecret || firebaseSecrets) {
    return 'refuses to overwrite a pre-existing encrypted operator credential';
  }
  if (current.data?.capability !== 'AVAILABLE') {
    throw new Error(
      `operator configuration backend must be AVAILABLE in the disposable e2e stack, got ${
        current.data?.capability ?? 'unavailable'
      }`
    );
  }
  return '';
}
