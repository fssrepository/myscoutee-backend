#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import { runUiStress } from '@fssrepository/myscoutee-e2e/stress/ui/run.mjs';

const repoRoot = fileURLToPath(new URL('../../../../', import.meta.url));
await runUiStress({ repoRoot, e2eRoot: fileURLToPath(new URL('../../', import.meta.url)), resetE2eDatabase: async ctx => {
    const { resetE2eDatabase } = await import('../../functional/backend/hooks/e2e-db.mjs');
    return resetE2eDatabase(ctx);
  }
});
