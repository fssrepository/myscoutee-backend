// Advance renamed Feedback policy/permission identities without resetting
// operator restrictions or losing existing explicit allow/deny grants.
const fs = require('fs');
const directory = process.env.MYSCOUTEE_MIGRATION_SEED_DIRECTORY;
if (!directory) throw new Error('Missing pinned Feedback access policies.');
const targets = EJSON.parse(fs.readFileSync(directory + '/accessPolicyDefinitions.json', 'utf8'));
if (!Array.isArray(targets) || targets.length !== 4
    || targets.some(row => !/^feedback\.(submit|note|remove|restore)$/.test(row.policyKey)
        || row.permission !== row.policyKey || row.resourceType !== 'event'
        || row._id !== 'access-policy-' + row.policyKey.replace('.', '-')
        || row.syncKey !== row._id)
    || new Set(targets.map(row => row.policyKey)).size !== 4) {
    throw new Error('Invalid pinned Feedback access policies.');
}
const policies = db.getCollection('accessPolicyDefinitions');
for (const target of targets) {
    const previousKey = 'event.' + target.policyKey;
    const previous = policies.findOne({policyKey: previousKey});
    let current = policies.findOne({$or: [{_id: target._id}, {syncKey: target.syncKey}, {policyKey: target.policyKey}]});
    if (current && current.policyKey !== target.policyKey) {
        throw new Error('Conflicting Feedback policy identity: ' + target.policyKey);
    }
    if (!current) {
        const document = previous ? {...previous, _id: target._id, syncKey: target.syncKey,
            policyKey: target.policyKey,
            permission: previous.permission === previousKey ? target.permission : previous.permission} : target;
        policies.updateOne({policyKey: target.policyKey}, {$setOnInsert: document}, {upsert: true});
        current = policies.findOne({policyKey: target.policyKey});
    }
    // A custom current permission continues to own its grants unchanged.
    // For the canonical rename, move both ALLOW and DENY, preserving every
    // other grant field and identity. Legacy policy records remain retained.
    if (current.permission === target.permission) {
        db.getCollection('accessGrants').updateMany(
            {resourceType: target.resourceType, permission: previousKey},
            {$set: {permission: target.permission}});
    }
}
print('Migration019: Feedback policies and grants advanced; operator restrictions retained.');
