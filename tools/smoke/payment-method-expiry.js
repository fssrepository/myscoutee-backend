/* global db, EJSON, print, process, quit */
(() => {
  'use strict';

  const PREFIX = 'smoke-fixture:v1:payment-method-expiry';
  const SNAPSHOT_COLLECTION = 'smokeFixtureSnapshots';
  const SNAPSHOT_ID = `${PREFIX}:snapshot`;
  const CARD_ID = `${PREFIX}:card`;
  const RULE_KEYS = ['payment-method-expiry', 'notification-outbox'];
  const command = text(process.env.SMOKE_COMMAND);
  const requestedDb = text(process.env.SMOKE_DB);
  const targetUserId = text(process.env.SMOKE_USER_ID);

  function text(value) {
    return value == null ? '' : String(value).trim();
  }

  function fail(message) {
    throw new Error(`[payment-method-expiry] ${message}`);
  }

  function collection(name) {
    return db.getCollection(name);
  }

  function printObject(value) {
    print(EJSON.stringify(value, null, 2, { relaxed: true }));
  }

  function snapshotField(document, key) {
    return Object.prototype.hasOwnProperty.call(document || {}, key)
      ? { present: true, value: document[key] }
      : { present: false };
  }

  function restoreField(selector, key, saved) {
    const update = saved && saved.present
      ? { $set: { [key]: saved.value } }
      : { $unset: { [key]: '' } };
    const result = collection('users').updateOne(selector, update);
    if (result.matchedCount !== 1) fail(`could not restore user field '${key}'.`);
  }

  function notificationSelector() {
    return {
      $or: [
        { entityId: CARD_ID },
        { collapseKey: `payment-card-expired-${CARD_ID}` },
        { 'payload.paymentMethodId': CARD_ID }
      ]
    };
  }

  function assertDeploymentSafety() {
    const currentDb = db.getName();
    if (currentDb !== requestedDb) {
      fail(`mongosh selected '${currentDb}', but SMOKE_DB requested '${requestedDb}'.`);
    }
    const expected = {
      demo_db: ['MyScoutee Demo Operator', 'privacy@demo.myscoutee.test'],
      e2e_db: ['MyScoutee E2E Operator', 'privacy@e2e.myscoutee.test']
    }[currentDb];
    const marker = collection('deploymentConfigurations').findOne({
      _id: 'deployment-configuration',
      schemaVersion: 4
    });
    const privacy = marker && marker.privacyContact ? marker.privacyContact : {};
    if (!expected
        || privacy.dataControllerName !== expected[0]
        || privacy.privacyContactEmail !== expected[1]) {
      fail(`deployment marker mismatch for '${currentDb}'; refusing to continue.`);
    }
  }

  function targetUser() {
    const user = collection('users').findOne({
      $or: [{ _id: targetUserId }, { userId: targetUserId }]
    });
    if (!user) fail(`user '${targetUserId}' does not exist.`);
    return user;
  }

  function prepare() {
    if (collection(SNAPSHOT_COLLECTION).findOne({ _id: SNAPSHOT_ID })) {
      fail("fixture is already prepared; use 'status' or 'reset'.");
    }
    const user = targetUser();
    const rules = RULE_KEYS.map(ruleKey => collection('notificationRuleConfigs').findOne({ ruleKey }));
    if (rules.some(rule => !rule)) fail('required notification rules are missing.');
    const expiryRule = rules[0];
    if (text(expiryRule.runState && expiryRule.runState.currentStatus) === 'running') {
      fail('payment-method-expiry is already running; retry after it reaches a terminal state.');
    }
    const existingCard = collection('savedPaymentMethods').findOne({ _id: CARD_ID });
    const existingOutbox = collection('notificationOutbox').find(notificationSelector()).toArray();
    const existingNotifications = collection('userNotifications').find(notificationSelector()).toArray();
    if (existingCard || existingOutbox.length || existingNotifications.length) {
      fail("fixture artifacts exist without a snapshot; inspect them before retrying.");
    }

    const now = new Date();
    const previousMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    const expiryYear = previousMonth.getUTCFullYear();
    const expiryMonth = previousMonth.getUTCMonth() + 1;
    const preparedAtIso = now.toISOString();
    const userSelector = { $or: [{ _id: targetUserId }, { userId: targetUserId }] };
    collection(SNAPSHOT_COLLECTION).insertOne({
      _id: SNAPSHOT_ID,
      fixture: PREFIX,
      database: db.getName(),
      targetUserId,
      preparedAtIso,
      userSelector,
      userActivities: snapshotField(user, 'activities'),
      rules
    });

    const dueAtIso = new Date(now.getTime() - 2 * 86_400_000).toISOString();
    const ruleResult = collection('notificationRuleConfigs').updateOne(
      { ruleKey: 'payment-method-expiry' },
      {
        $set: {
          'runState.currentStatus': 'idle',
          'runState.progressPercent': 0,
          'runState.progressDetail': 'Prepared for expiry integration smoke.',
          'runState.lastRunAtIso': dueAtIso,
          'runState.startedAtIso': '',
          'runState.finishedAtIso': '',
          updatedDate: preparedAtIso,
          updatedUser: PREFIX
        }
      }
    );
    if (ruleResult.matchedCount !== 1) fail('could not arm payment-method-expiry.');

    collection('savedPaymentMethods').insertOne({
      _id: CARD_ID,
      userId: targetUserId,
      provider: 'stripe',
      providerPaymentMethodRef: `${PREFIX}:provider-card`,
      brand: 'Visa',
      last4: '0008',
      expiryMonth,
      expiryYear,
      expiryKey: expiryYear * 100 + expiryMonth,
      cardholderName: 'EXPIRY CHECKPOINT',
      artworkKey: 'ruby',
      status: 'active',
      createdAtIso: preparedAtIso,
      updatedAtIso: preparedAtIso,
      createdUser: PREFIX,
      updatedUser: PREFIX
    });
    printObject({ phase: 'prepared', cardId: CARD_ID, userId: targetUserId, preparedAtIso });
  }

  function result() {
    const snapshot = collection(SNAPSHOT_COLLECTION).findOne({ _id: SNAPSHOT_ID });
    const card = collection('savedPaymentMethods').findOne({ _id: CARD_ID });
    const outbox = collection('notificationOutbox').find(notificationSelector()).toArray();
    const notifications = collection('userNotifications').find(notificationSelector()).toArray();
    const rule = collection('notificationRuleConfigs').findOne({ ruleKey: 'payment-method-expiry' });
    const passed = Boolean(snapshot
      && card
      && text(card.status) === 'expired'
      && text(card.expiredNotifiedAtIso)
      && outbox.length === 1
      && notifications.length === 1
      && text(rule && rule.runState && rule.runState.lastRunAtIso) > text(snapshot.preparedAtIso));
    return {
      phase: snapshot ? (passed ? 'verified' : 'waiting') : 'not-prepared',
      passed,
      card: card ? {
        id: card._id,
        status: card.status,
        expiredNotifiedAtIso: card.expiredNotifiedAtIso || null
      } : null,
      outboxCount: outbox.length,
      notificationCount: notifications.length,
      notification: notifications[0] ? {
        title: notifications[0].title,
        message: notifications[0].message,
        titleKey: notifications[0].payload && notifications[0].payload.notification_title_key,
        messageKey: notifications[0].payload && notifications[0].payload.notification_message_key,
        last4: notifications[0].payload && notifications[0].payload.last4
      } : null,
      job: rule && rule.runState ? {
        status: rule.runState.lastRunStatus,
        count: rule.runState.lastRunCount,
        detail: rule.runState.lastRunDetail,
        lastRunAtIso: rule.runState.lastRunAtIso
      } : null
    };
  }

  function status(checkOnly) {
    const value = result();
    if (!checkOnly || value.passed) printObject(value);
    if (checkOnly && !value.passed) quit(3);
  }

  function reset() {
    const snapshot = collection(SNAPSHOT_COLLECTION).findOne({ _id: SNAPSHOT_ID });
    if (!snapshot) {
      printObject({ phase: 'not-prepared', reset: false });
      return;
    }
    collection('notificationOutbox').deleteMany(notificationSelector());
    collection('userNotifications').deleteMany(notificationSelector());
    collection('savedPaymentMethods').deleteOne({ _id: CARD_ID });
    for (const savedRule of snapshot.rules || []) {
      collection('notificationRuleConfigs').replaceOne({ _id: savedRule._id }, savedRule, { upsert: true });
    }
    restoreField(snapshot.userSelector, 'activities', snapshot.userActivities);
    collection(SNAPSHOT_COLLECTION).deleteOne({ _id: SNAPSHOT_ID });
    printObject({ phase: 'not-prepared', reset: true, cardId: CARD_ID });
  }

  assertDeploymentSafety();
  switch (command) {
    case 'prepare': prepare(); break;
    case 'status': status(false); break;
    case 'check': status(true); break;
    case 'reset': reset(); break;
    default: fail(`unsupported command '${command}'.`);
  }
})();
