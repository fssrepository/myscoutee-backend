import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const DEFAULT_COLLECTIONS = [
  'users',
  'userRates',
  'userFilterPreferences',
  'assets',
  'adminStats',
  'adminMonitoring',
  'affinityConfigs',
  'activityMembers',
  'activityResources',
  'chats',
  'events',
  'eventFeedbackStates',
  'eventFeedbackAnswers',
  'eventTickets',
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
  'operatorClaimSubmissionSnapshots',
  'qualifiedMauReportOutbox',
  'revenueReportOutbox',
  'communityProviders',
  'appSettings'
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

  const evalScript = DEFAULT_COLLECTIONS
    .map(collection => `db.getCollection(${JSON.stringify(collection)}).deleteMany({});`)
    .join('\n');
  await runMongoEval(dbName, evalScript);
  await importE2eSeed(dbName);
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
