import { queryE2eMongo } from '../../../backend/lib/e2e-fixtures.mjs';

const TOKEN = 'e2e-admin-help-route';
const OWNER_USER_ID = 'bf057de7c586eede7e84bdc7';

export async function prepare({ ctx }) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (60 * 60 * 1000));
  await queryE2eMongo(ctx, `db.shareTokens.updateOne(
    { token: ${JSON.stringify(TOKEN)} },
    {
      $set: {
        token: ${JSON.stringify(TOKEN)},
        kind: 'adminHelp',
        entityId: '/game',
        ownerUserId: ${JSON.stringify(OWNER_USER_ID)},
        createdAtIso: ${JSON.stringify(now.toISOString())},
        expiresAtIso: ${JSON.stringify(expiresAt.toISOString())}
      },
      $setOnInsert: { _id: ${JSON.stringify(TOKEN)} }
    },
    { upsert: true }
  )`);
  return {};
}
