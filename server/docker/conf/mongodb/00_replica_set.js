const replicaSetName = (process.env.MONGO_REPLICA_SET_NAME || process.env.MONGODB_REPLICA_SET || '').trim();

if (replicaSetName) {
  const replicaSetHost = (process.env.MONGO_REPLICA_SET_HOST || 'mongodb:27017').trim();
  try {
    const status = rs.status();
    print(`Replica set ${status.set || replicaSetName} already initialized.`);
  } catch (error) {
    try {
      rs.initiate({
        _id: replicaSetName,
        members: [
          {
            _id: 0,
            host: replicaSetHost
          }
        ]
      });
      print(`Replica set ${replicaSetName} initialized with member ${replicaSetHost}.`);
    } catch (initError) {
      print(`Replica set ${replicaSetName} was not initialized: ${initError.message}`);
    }
  }
}
