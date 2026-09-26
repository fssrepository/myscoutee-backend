// Initialize only the new stored counter. Never replace groups or memberships.
// Subsequent changes are maintained by the normal member write commands.
for (const group of db.communityGroups.find({pendingMembers: {$exists: false}})) {
    const pending = db.activityMembers.countDocuments({ownerType: 'community', ownerId: group._id, status: 'pending'});
    db.communityGroups.updateOne({_id: group._id, pendingMembers: {$exists: false}}, {$set: {pendingMembers: pending}});
}
print('Migration007: missing group member counters initialized.');
