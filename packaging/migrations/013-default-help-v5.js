// Publish the existing v5 help through the retained-data upgrade path. Reuse
// migration008's default/custom/inactive rules, independently per group/language.
const fs = require('fs');
const directory = process.env.MYSCOUTEE_MIGRATION_SEED_DIRECTORY
    || '/docker-entrypoint-initdb.d/myscoutee_db';
const seeds = EJSON.parse(fs.readFileSync(directory + '/helpCenterRevisions.json', 'utf8'));
const targetIds = ['help-default-v5', 'help-default-hu-v5',
    'work:help-default-v5', 'work:help-default-hu-v5',
    'community:help-default-v5', 'community:help-default-hu-v5'];
const targets = targetIds.map(id => seeds.find(row => row._id === id));
if (targets.some(row => !row || row.documentType !== 'help' || Number(row.version) !== 5
        || row.active !== true || !['en', 'hu'].includes(row.lang))) {
    throw new Error('Missing canonical help v5 seeds.');
}
const canonical = value => {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === 'object') return Object.fromEntries(
        Object.keys(value).sort().map(key => [key, canonical(value[key])]));
    return value;
};
const contentFields = ['documentType', 'lang', 'version', 'title', 'summary',
    'description', 'headerColor', 'sections', 'createdUser', 'updatedUser',
    'languageLabel', 'presentation', 'isSystem'];
const sameScope = (row, target) => (row.baseGroupId ?? null) === (target.baseGroupId ?? null)
    && (row.contextKey ?? null) === (target.contextKey ?? null) && row.lang === target.lang;
const unchanged = (row, seed) => row && seed && sameScope(row, seed) && contentFields.every(key =>
    JSON.stringify(canonical(row[key])) === JSON.stringify(canonical(seed[key])));
const seedById = new Map(seeds.map(row => [row._id, row]));

// Retained pre-group installations still have the old unique index. Use the
// same replacement order and definitions as the canonical Mongo seed policy.
db.helpCenterRevisions.createIndex({baseGroupId: 1, documentType: 1, lang: 1, contextKey: 1, version: -1},
    {name: 'help_revision_group_document_lang_context_version', unique: true});
if (db.helpCenterRevisions.getIndexes().some(index => index.name === 'help_revision_document_lang_context_version')) {
    db.helpCenterRevisions.dropIndex('help_revision_document_lang_context_version');
}
db.helpCenterRevisions.createIndex({baseGroupId: 1, documentType: 1, lang: 1, contextKey: 1, active: 1, version: -1},
    {name: 'help_revision_group_document_lang_context_active'});

const current = db.helpCenterRevisions.find({documentType: 'help'}).toArray();
const operations = [];
let added = 0;
let retained = 0;
for (const target of targets) {
    const previous = current.filter(row => sameScope(row, target));
    let installed = previous.find(row => row._id === target._id);
    if (!installed) {
        if (previous.some(row => Number(row.version) === 5)) {
            print('Migration013: retained operator help version5 (' + target._id + '); packaged help requires explicit import.');
            retained++;
            continue;
        }
        const active = previous.filter(row => row.active === true);
        const followsDefault = active.length === 1 && Number(active[0].version) < 5
            && unchanged(active[0], seedById.get(active[0]._id));
        installed = {...target, active: previous.length === 0 || followsDefault};
        operations.push({insertOne: {document: installed}});
        added++;
    }
    // Complete an interrupted insertion before retiring its old default.
    if (installed.active === true && unchanged(installed, target)) {
        for (const row of previous.filter(row => row.active === true && Number(row.version) < 5)) {
            if (unchanged(row, seedById.get(row._id))) operations.push({updateOne: {
                filter: {_id: row._id, active: true, updatedUser: row.updatedUser},
                update: {$set: {active: false}}
            }});
        }
    } else { retained++; }
}
if (operations.length) db.helpCenterRevisions.bulkWrite(operations, {ordered: true});
print('Migration013: help v5 added=' + added + ', retained custom/inactive=' + retained
    + '; Privacy, Terms, guides and user data unchanged.');
