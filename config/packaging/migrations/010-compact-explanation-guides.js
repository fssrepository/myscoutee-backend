// Install compact tours through the retained-data migration chain. Preserve
// operator-authored revisions and explicit inactive/custom selections.
const fs = require('fs');
const directory = process.env.MYSCOUTEE_MIGRATION_SEED_DIRECTORY
    || '/docker-entrypoint-initdb.d/myscoutee_db';
const seeds = EJSON.parse(fs.readFileSync(directory + '/helpCenterRevisions.json', 'utf8'));
const fields = EJSON.parse(fs.readFileSync(directory + '/helpCenterGuideFields.json', 'utf8'));
const targets = seeds.filter(row => row.documentType === 'explanation'
    && Number(row.version) === 4 && row.presentation === 'tour');
if (targets.length === 0 || fields.length === 0
        || fields.some(row => !row._id || !row.id || !row.screenKey)) {
    throw new Error('Invalid 1.3.2 compact-guide seeds.');
}
const canonical = value => {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === 'object') return Object.fromEntries(
        Object.keys(value).sort().map(key => [key, canonical(value[key])]));
    return value;
};
const contentFields = ['documentType', 'contextKey', 'lang', 'version', 'title',
    'summary', 'description', 'headerColor', 'presentation', 'sections', 'createdUser', 'updatedUser'];
const unchanged = (row, seed) => !!row && !!seed && contentFields.every(key =>
    JSON.stringify(canonical(row[key])) === JSON.stringify(canonical(seed[key])));
const seedById = new Map(seeds.map(row => [row._id, row]));
const current = db.helpCenterRevisions.find({documentType: 'explanation'}).toArray();
const operations = [];
let activated = 0;
let retained = 0;
for (const target of targets) {
    const previous = current.filter(row => row.contextKey === target.contextKey && row.lang === target.lang);
    let installed = previous.find(row => row._id === target._id);
    if (!installed) {
        if (previous.some(row => Number(row.version) === 4)) { retained++; continue; }
        const active = previous.filter(row => row.active === true);
        const followsDefault = active.length === 1 && unchanged(active[0], seedById.get(active[0]._id));
        installed = {...target, active: previous.length === 0 || followsDefault};
        operations.push({updateOne: {filter: {_id: target._id}, update: {$setOnInsert: installed}, upsert: true}});
    }
    if (installed.active === true && unchanged(installed, target)) {
        activated++;
        for (const row of previous.filter(row => row.active === true && Number(row.version) < 4)) {
            if (unchanged(row, seedById.get(row._id))) operations.push({updateOne: {
                filter: {_id: row._id, active: true, updatedUser: row.updatedUser},
                update: {$set: {active: false}}
            }});
        }
    } else { retained++; }
}
if (operations.length) db.helpCenterRevisions.bulkWrite(operations, {ordered: true});
db.helpCenterGuideFields.bulkWrite(fields.map(row => ({replaceOne: {
    filter: {_id: row._id}, replacement: row, upsert: true
}})), {ordered: true});
db.helpCenterGuideFields.createIndex({screenKey: 1, id: 1}, {name: 'help_guide_field_screen_id', unique: true});
db.helpCenterGuideFields.createIndex({screenKey: 1, order: 1}, {name: 'help_guide_field_screen_order'});
print('Migration010: compact guide contexts active=' + activated + ', retained custom/inactive=' + retained
    + '; indexed guide fields=' + fields.length + '. User collections unchanged.');
