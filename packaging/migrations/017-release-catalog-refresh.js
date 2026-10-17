// Extend the migration016 default/custom/inactive policy to the later catalogs.
// Inputs are pinned for this recorded step; runtime test data is never an input.
const fs = require('fs');
const directory = process.env.MYSCOUTEE_MIGRATION_SEED_DIRECTORY;
const updates = EJSON.parse(fs.readFileSync(directory + '/catalog-updates.json', 'utf8'));
const {fields, removedFieldIds, previousRevisions, addedRevisions, revisionUpdates, retiredRevisions, catalogUpdates} = updates;
if (![fields, removedFieldIds, previousRevisions, addedRevisions, revisionUpdates, retiredRevisions, catalogUpdates].every(Array.isArray)) {
    throw new Error('Invalid catalog refresh inputs');
}
const validRevision = row => row && typeof row._id === 'string' && row._id
    && ['help', 'explanation', 'privacy', 'terms'].includes(row.documentType)
    && typeof row.lang === 'string' && Number.isInteger(row.version) && typeof row.active === 'boolean';
if ([...previousRevisions, ...addedRevisions, ...retiredRevisions].some(row => !validRevision(row))
    || revisionUpdates.some(row => !validRevision(row.previous) || !validRevision(row.target)
        || row.previous._id !== row.target._id)
    || catalogUpdates.some(row => !['ideaPosts', 'landingSlides'].includes(row.collection)
        || !row.previous?._id || row.previous._id !== row.target?._id)
    || fields.some(row => !row._id || !row.screenKey || !row.id)
    || removedFieldIds.some(id => typeof id !== 'string' || !id)) {
    throw new Error('Invalid catalog refresh records');
}
const canonical = value => Array.isArray(value) ? value.map(canonical)
    : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const equal = (left, right) => JSON.stringify(canonical(left)) === JSON.stringify(canonical(right));
const content = row => Object.fromEntries(Object.entries(row).filter(([key]) => key !== 'active'));
const unchanged = (row, seed) => row && seed && equal(content(row), content(seed));
const previousById = new Map(previousRevisions.map(row => [row._id, row]));
const scopeKey = row => JSON.stringify([row.baseGroupId ?? null, row.documentType, row.lang, row.contextKey ?? null]);
const currentById = new Map();
const currentByScope = new Map();
for (const row of db.helpCenterRevisions.find({documentType: {$in: ['help', 'explanation', 'privacy', 'terms']}}).toArray()) {
    currentById.set(row._id, row);
    const key = scopeKey(row);
    if (!currentByScope.has(key)) currentByScope.set(key, []);
    currentByScope.get(key).push(row);
}
const revisionWrites = [];

// Insert a new default before retiring its unchanged predecessor, as in 016.
// Existing custom, inactive, newer and same-version operator selections win.
for (const target of [...addedRevisions].sort((left, right) => Number(right.active) - Number(left.active) || right.version - left.version)) {
    const key = scopeKey(target);
    if (!currentByScope.has(key)) currentByScope.set(key, []);
    const current = currentByScope.get(key);
    const active = current.filter(row => row.active === true);
    let installed = current.find(row => row._id === target._id);
    if (!installed && !current.some(row => row.version === target.version)) {
        const followsDefault = active.length === 1 && active[0].version < target.version
            && unchanged(active[0], previousById.get(active[0]._id));
        installed = {...target, active: target.active && (current.length === 0 || followsDefault)};
        revisionWrites.push({insertOne: {document: installed}});
        current.push(installed);
        currentById.set(installed._id, installed);
    }
    if (installed?.active === true && unchanged(installed, target)) {
        for (const row of active) {
            if (row.version < target.version && unchanged(row, previousById.get(row._id))) {
                revisionWrites.push({updateOne: {filter: {_id: row._id, active: true}, update: {$set: {active: false}}}});
                row.active = false;
            }
        }
    }
}

// Same-ID copy corrections retain the stored active/inactive choice.
for (const {previous, target} of revisionUpdates) {
    const stored = currentById.get(previous._id);
    if (unchanged(stored, previous)) {
        revisionWrites.push({replaceOne: {filter: {_id: previous._id}, replacement: {...target, active: stored.active}}});
    }
}
// Removed screens retain history and custom guides. Retire only their original
// active packaged defaults; an operator-reactivated inactive revision survives.
for (const previous of retiredRevisions) {
    const stored = currentById.get(previous._id);
    if (previous.active && stored?.active === true && unchanged(stored, previous)) {
        revisionWrites.push({updateOne: {filter: {_id: stored._id, active: true}, update: {$set: {active: false}}}});
    }
}
if (revisionWrites.length) db.helpCenterRevisions.bulkWrite(revisionWrites, {ordered: true});
for (const {collection, previous, target} of catalogUpdates) {
    if (!['ideaPosts', 'landingSlides'].includes(collection)) throw new Error('Unexpected editable catalog');
    const owner = db.getCollection(collection);
    if (equal(owner.findOne({_id: previous._id}), previous)) owner.replaceOne({_id: previous._id}, target);
}

// These exact IDs are package-owned control metadata, matching migration016.
if (fields.length) db.helpCenterGuideFields.bulkWrite(fields.map(row => ({replaceOne: {
    filter: {_id: row._id}, replacement: row, upsert: true
}})), {ordered: true});
if (removedFieldIds.length) db.helpCenterGuideFields.deleteMany({_id: {$in: removedFieldIds}});
print('Migration017: later packaged catalogs applied; operator selections and user data retained.');
