// Copy the pre-centralization Feedback records into their canonical collections.
// Retain legacy documents/indexes; conflicting current data stops the upgrade.
const fs = require('fs');
const directory = process.env.MYSCOUTEE_MIGRATION_SEED_DIRECTORY;
if (!directory) throw new Error('Missing pinned Feedback/worker index snapshot.');
const catalog = JSON.parse(fs.readFileSync(directory + '/runtime-indexes.json', 'utf8'));
for (const {collection, key, options} of catalog.indexes) {
    db.getCollection(collection).createIndex(key, options);
}
function canonical(value) {
    const plain = EJSON.serialize(value, {relaxed: false});
    function sorted(item) {
        if (Array.isArray(item)) return item.map(sorted);
        if (item && typeof item === 'object') return Object.fromEntries(
            Object.keys(item).sort().map(key => [key, sorted(item[key])])
        );
        return item;
    }
    return JSON.stringify(sorted(plain));
}
for (const [legacy, current, oldType, newType] of [
    ['eventFeedbackStates', 'feedbackStates', 'EventFeedbackState', 'FeedbackState'],
    ['eventFeedbackAnswers', 'feedbackAnswers', 'EventFeedbackAnswer', 'FeedbackAnswer']
]) {
    const target = db.getCollection(current);
    let inserted = 0;
    const cursor = db.getCollection(legacy).find({}).batchSize(500);
    while (cursor.hasNext()) {
        const source = cursor.next();
        const document = {...source};
        if (document._class === 'com.raxim.myscoutee.domain.events.document.' + oldType) {
            document._class = 'com.raxim.myscoutee.domain.feedback.document.' + newType;
        }
        const existing = target.findOne({_id: document._id});
        if (existing) {
            if (canonical(existing) !== canonical(document)) {
                throw new Error('Conflicting retained Feedback record: ' + legacy + '/' + document._id);
            }
            continue;
        }
        inserted += target.updateOne({_id: document._id}, {$setOnInsert: document}, {upsert: true}).upsertedCount;
    }
    print('Migration018: ' + inserted + ' retained ' + legacy + ' records copied; source unchanged.');
}
