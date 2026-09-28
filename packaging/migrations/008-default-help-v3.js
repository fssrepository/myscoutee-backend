// Publish the packaged common help on retained installations. Operator-authored
// revisions and deliberate inactive/custom selections remain deployment state.
const directory = process.env.MYSCOUTEE_MIGRATION_SEED_DIRECTORY
    || '/docker-entrypoint-initdb.d/myscoutee_db';
const seeds = EJSON.parse(require('fs').readFileSync(directory + '/helpCenterRevisions.json', 'utf8'));
const contentFields = ['documentType', 'lang', 'version', 'title', 'summary',
    'description', 'headerColor', 'sections', 'createdUser', 'updatedUser'];
const canonical = value => {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === 'object') return Object.fromEntries(
        Object.keys(value).sort().map(key => [key, canonical(value[key])]));
    return value;
};
const unchanged = (document, seed) => {
    return document && seed && contentFields.every(field =>
        JSON.stringify(canonical(document[field])) === JSON.stringify(canonical(seed[field])));
};
for (const lang of ['en', 'hu']) {
    const id = lang === 'en' ? 'help-default-v3' : 'help-default-hu-v3';
    const target = seeds.find(row => row._id === id);
    if (!target || target.documentType !== 'help' || target.lang !== lang
            || Number(target.version) !== 3 || target.active !== true) {
        throw new Error('Missing canonical help v3 seed: ' + lang);
    }
    const selector = {documentType: 'help', lang};
    const previous = db.helpCenterRevisions.find(selector).toArray();
    let installed = previous.find(row => row._id === id);
    if (!installed) {
        if (previous.some(row => Number(row.version) === 3)) {
            print('Migration008: retained operator help version3 (' + lang + '); packaged help requires explicit import.');
            continue;
        }
        const active = previous.filter(row => row.active === true);
        const followsDefault = active.length === 1 && unchanged(active[0],
            seeds.find(row => row._id === active[0]._id && Number(row.version) < 3));
        installed = {...target, active: previous.length === 0 || followsDefault};
        db.helpCenterRevisions.insertOne(installed);
        print('Migration008: added common help v3 (' + lang + '), active=' + installed.active);
    }
    // Also finishes a retry interrupted after insertion but before deactivation.
    if (installed.active === true && unchanged(installed, target)) {
        for (const row of previous.filter(row => row.active === true && Number(row.version) < 3)) {
            const seed = seeds.find(seed => seed._id === row._id);
            if (unchanged(row, seed)) db.helpCenterRevisions.updateOne(
                {_id: row._id, active: true, updatedUser: row.updatedUser}, {$set: {active: false}});
        }
    }
}
