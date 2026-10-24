// Change only references to exact package-owned images. Keep document identity,
// operator text, selections, timestamps and every unrelated media URL intact.
const replacements = JSON.parse(require('fs').readFileSync(
    process.env.MYSCOUTEE_MIGRATION_SEED_DIRECTORY + '/image-replacements.json', 'utf8'));
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const frontend = replacements.frontend.map(row => ({...row,
    pattern: new RegExp('(^|["\x27])(/?)' + escapeRegex(row.previousPath) + '(?=$|[?#"\x27])', 'g')}));
const media = replacements.minio.filter(row => row.previousKey).flatMap(row => ['/media/public?key=', '/api/media/public?key='].flatMap(prefix => [
    [prefix + row.previousKey, prefix + row.key],
    [prefix + encodeURIComponent(row.previousKey), prefix + encodeURIComponent(row.key)]
]));
const replace = value => {
    if (typeof value === 'string') {
        let result = value;
        for (const row of frontend) result = result.replace(row.pattern, (_match, quote, slash) =>
            quote + (row.path.startsWith('/') ? '' : slash) + row.path);
        for (const [before, after] of media) {
            if (result === before || result.startsWith(before + '&') || result.startsWith(before + '#')) {
                result = after + result.slice(before.length);
            }
        }
        return result;
    }
    if (Array.isArray(value)) return value.map(replace);
    // mongosh BSON documents may originate in another JS realm. Preserve BSON
    // scalar values while traversing ordinary nested document content.
    if (value && Object.prototype.toString.call(value) === '[object Object]' && !value._bsontype) {
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replace(item)]));
    }
    return value;
};
const candidate = new RegExp([
    ...replacements.frontend.map(row => escapeRegex(row.previousPath)),
    ...replacements.minio.filter(row => row.previousKey).flatMap(row => [escapeRegex(row.previousKey), escapeRegex(encodeURIComponent(row.previousKey))])
].join('|'));
const targets = {
    landingSlides: ['imageUrl'],
    ideaPosts: ['imageUrl', 'imageUrls', 'imageDetails', 'contentHtml'],
    campaigns: ['imageUrls', 'imageDetails', 'description', 'contentHtml'],
    serviceOfferings: ['imageUrls', 'imageDetails', 'description'],
    events: ['imageUrl'],
    helpCenterRevisions: ['sections'],
    i18n_messages: ['value']
};
let modified = 0;
for (const [collection, fields] of Object.entries(targets)) {
    let operations = [];
    const flush = () => {
        if (!operations.length) return;
        const result = db.getCollection(collection).bulkWrite(operations, {ordered: true});
        if (result.matchedCount !== operations.length) throw new Error('Concurrent image-reference edit; retry migration023.');
        modified += result.modifiedCount;
        operations = [];
    };
    // One projected cursor per owning collection, never a query per image/row.
    const projection = Object.fromEntries(['_id', ...fields].map(field => [field, 1]));
    // Nested help sections have several content fields; the small help catalog
    // is projected once rather than assuming a particular section schema.
    const query = collection === 'helpCenterRevisions' ? {}
        : {$or: fields.map(field => ({[field]: {$regex: candidate}}))};
    db.getCollection(collection).find(query, projection).forEach(row => {
        const set = {}, previous = {_id: row._id};
        for (const field of fields) {
            const next = field === 'imageDetails' && row[field]
                ? Object.fromEntries(Object.entries(row[field]).map(([url, details]) => [replace(url), details]))
                : replace(row[field]);
            if (EJSON.stringify(next) !== EJSON.stringify(row[field])) {
                set[field] = next;
                previous[field] = row[field];
            }
        }
        if (Object.keys(set).length) operations.push({updateOne: {filter: previous, update: {$set: set}}});
        if (operations.length >= 500) flush();
    });
    flush();
}
print('Migration023: updated ' + modified + ' package-image references; unrelated data retained.');
