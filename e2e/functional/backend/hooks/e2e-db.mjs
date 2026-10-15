import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export const E2E_RESET_COLLECTIONS = [
  'accessGrants',
  'accessPolicyDefinitions',
  'activityEventRuntimeItems',
  'activitySubEventGroups',
  'activitySubEventStageRuntime',
  'adminAffinityGraphEdges',
  'adminAffinityGraphForests',
  'adminAffinityGraphLayouts',
  'adminAffinityGraphNodes',
  'users',
  'userRates',
  'userFilterPreferences',
  'assets',
  'assetRequests',
  'adminStats',
  'adminMonitoring',
  'affinityConfigs',
  'activityMembers',
  'activityResources',
  'chats',
  'chatMessages',
  'events',
  'eventCheckoutBasketItems',
  'feedbackStates',
  'feedbackAnswers',
  'eventTickets',
  'eventTicketAudit',
  'eventWatchSubscriptions',
  'helpCenterRevisions',
  'helpCenterAudit',
  'privacyConsents',
  'userExperienceProfiles',
  'navigatorContacts',
  'userFeedback',
  'userReports',
  'userSessionActions',
  'payments',
  'shareTokens',
  'ideaPosts',
  'eventLeaderboardEntries',
  'globalIdentityLinkStates',
  'globalIdentityPresenceChunkOutbox',
  'notificationRuleConfigs',
  'notificationTemplates',
  'notificationOutbox',
  'scheduledMessageTasks',
  'scheduledMessageDeliveries',
  'scheduledMessageRuns',
  'schedulerPlanMarkers',
  'emailOutbox',
  'emailTemplates',
  'emailCampaignRules',
  'accountPurgeJobs',
  'affinityRecomputeTasks',
  'userAffinityEdges',
  'countryPartitions',
  'i18n_bundles',
  'i18n_messages',
  'deploymentConfigurations',
  'operatorRegistrySettings',
  'operatorRegistryEndpoints',
  'operatorClaimSubmissionSnapshots',
  'qualifiedMauReportOutbox',
  'revenueReportOutbox',
  'communityProviders',
  'paymentMethodRegistrations',
  'paymentProviders',
  'payment_gateway_operations',
  'savedPaymentMethods',
  'userLoginAudits',
  'userNotifications',
  'userSessionStates',
  'appSettings'
];
const E2E_AFFINITY_LAYOUT_COLLECTIONS = [
  'adminAffinityGraphEdges',
  'adminAffinityGraphForests',
  'adminAffinityGraphLayouts',
  'adminAffinityGraphNodes'
];

export async function resetE2eDatabase(ctx) {
  const dbName = process.env.E2E_DATABASE
    ?? process.env.MONGO_E2E_DATABASE
    ?? 'e2e_db';
  ctx.vars.e2eDatabase = dbName;

  if (process.env.E2E_RESET_COMMAND) {
    await runShellCommand(process.env.E2E_RESET_COMMAND);
    return;
  }

  const evalScript = E2E_RESET_COLLECTIONS
    .map(collection => `db.getCollection(${JSON.stringify(collection)}).deleteMany({});`)
    .join('\n');
  await runMongoEval(dbName, evalScript);
  await importE2eSeed(dbName);
  await clearResetWindowAffinityLayout(dbName);
  await restartE2eBackend();
}

async function restartE2eBackend() {
  if (process.env.E2E_RESTART_BACKEND_AFTER_RESET === 'false') {
    return;
  }
  const container = process.env.E2E_BACKEND_CONTAINER ?? 'myscoutee';
  try {
    await execFileAsync('docker', ['restart', container], {
      timeout: Number(process.env.E2E_BACKEND_RESTART_TIMEOUT_MS ?? 30000),
      maxBuffer: 1024 * 1024
    });
  } catch (error) {
    throw new Error(`Unable to restart the existing E2E backend container ${container} after reset. ${error.message}`);
  }

  const deadline = Date.now() + Number(process.env.E2E_BACKEND_READY_TIMEOUT_MS ?? 120000);
  let lastError = null;
  while (Date.now() <= deadline) {
    try {
      await execFileAsync('docker', [
        'exec',
        container,
        'wget',
        '-qO-',
        'http://127.0.0.1:8080/auth/demo-users?limit=1'
      ], {
        timeout: 5000,
        maxBuffer: 1024 * 1024
      });
      return;
    } catch (error) {
      lastError = error;
      await delay(500);
    }
  }
  throw new Error(`E2E backend container ${container} did not become ready after database reset. ${lastError?.message ?? ''}`);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function clearResetWindowAffinityLayout(dbName) {
  const cleanup = E2E_AFFINITY_LAYOUT_COLLECTIONS
    .map(collection => `db.getCollection(${JSON.stringify(collection)}).deleteMany({});`)
    .join('\n');
  const evalScript = `
${cleanup}
const graphUsers = db.users.countDocuments({
  userId: { $not: /^admin-demo-/ },
  profileStatus: { $in: ['public', 'friends only', 'host only'] }
});
const graphEdges = db.userAffinityEdges.countDocuments({ edgeWeight: { $gt: 0 } });
if (graphUsers < 1 || graphEdges < 1) {
  throw new Error('E2E affinity source fixture is empty after seed import: users=' + graphUsers + ', edges=' + graphEdges);
}
`;
  await runMongoEval(dbName, evalScript);
}

async function runMongoEval(dbName, evalScript) {
  const args = [
    'exec',
    process.env.E2E_MONGO_CONTAINER ?? 'mongodb',
    'mongosh',
    '--username',
    process.env.E2E_MONGO_USERNAME ?? process.env.MONGO_APP_USERNAME ?? 'guest',
    '--password',
    process.env.E2E_MONGO_PASSWORD ?? process.env.MONGO_APP_PASSWORD ?? 'guest',
    '--authenticationDatabase',
    dbName,
    '--quiet',
    dbName,
    '--eval',
    evalScript
  ];
  try {
    await execFileAsync('docker', args, {
      timeout: Number(process.env.E2E_RESET_TIMEOUT_MS ?? 30000),
      maxBuffer: 1024 * 1024
    });
  } catch (error) {
    throw new Error(
      `Unable to reset e2e database ${dbName}. Start e2e compose first or set E2E_SKIP_E2E_RESET=true. ${error.message}`
    );
  }
}

async function importE2eSeed(dbName) {
  const args = [
    'exec',
    '-e',
    `MONGO_APP_DATABASE=${dbName}`,
    '-e',
    `MONGO_INITDB_DATABASE=${dbName}`,
    '-e',
    `MONGO_SEED_DIRECTORY=${process.env.E2E_SEED_DIRECTORY ?? 'e2e_db'}`,
    '-e',
    `MONGO_IMPORT_ALLOWED_COLLECTIONS_BY_DB=${dbName}:*`,
    '-e',
    'MONGO_IMPORT_REPLACE_COLLECTIONS=true',
    process.env.E2E_MONGO_CONTAINER ?? 'mongodb',
    '/docker-entrypoint-initdb.d/mongo_import.sh'
  ];
  try {
    await execFileAsync('docker', args, {
      timeout: Number(process.env.E2E_SEED_TIMEOUT_MS ?? 120000),
      maxBuffer: 10 * 1024 * 1024
    });
  } catch (error) {
    throw new Error(`Unable to import e2e seed into ${dbName}. ${error.message}`);
  }
}

async function runShellCommand(command) {
  const shell = process.env.SHELL ?? '/bin/bash';
  await execFileAsync(shell, ['-lc', command], {
    timeout: Number(process.env.E2E_RESET_TIMEOUT_MS ?? 30000),
    maxBuffer: 1024 * 1024
  });
}
