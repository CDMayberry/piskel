module pskl {
    export module service {

        const ONE_SECOND = 1000;
        const ONE_MINUTE = 60 * ONE_SECOND;

        // Save every minute = 1000 * 60
        const BACKUP_INTERVAL = ONE_MINUTE;
        // Store a new snapshot every 5 minutes.
        const SNAPSHOT_INTERVAL = ONE_MINUTE * 5;
        // Store up to 12 snapshots for a piskel session, min. 1 hour of work
        const MAX_SNAPSHOTS_PER_SESSION = 12;
        const MAX_SESSIONS = 10;

        export class BackupService {
            piskelController: any;
            lastHash: any;
            nextSnapshotDate: number;
            backupDatabase: any;

            constructor(piskelController, backupDatabase?) {
                this.piskelController = piskelController;
                // Immediately store the current when initializing the Service to avoid storing
                // empty sessions.
                this.lastHash = this.piskelController.getPiskel().getHash();
                this.nextSnapshotDate = -1;

                // backupDatabase can be provided for testing purposes.
                this.backupDatabase = backupDatabase || new pskl.database.BackupDatabase();
            }

            init() {
                this.backupDatabase.init().then(function () {
                    window.setInterval(this.backup.bind(this), BACKUP_INTERVAL);
                }.bind(this));
            }

            // This is purely exposed for testing, so that backup dates can be set programmatically.
            currentDate_() {
                return Date.now();
            }

            backup() {
                var piskel = this.piskelController.getPiskel();
                var hash = piskel.getHash();

                // Do not save an unchanged piskel
                if (hash === this.lastHash) {
                    return Q.resolve();
                }

                // Update the hash
                // TODO: should only be done after a successful save.
                this.lastHash = hash;

                // Prepare the backup snapshot.
                var descriptor = piskel.getDescriptor();
                var date = this.currentDate_();
                var snapshot = {
                    session_id: pskl.app.sessionId,
                    date: date,
                    name: descriptor.name,
                    description: descriptor.description,
                    frames: piskel.getFrameCount(),
                    width: piskel.getWidth(),
                    height: piskel.getHeight(),
                    fps: piskel.getFPS(),
                    serialized: pskl.utils.serialization.Serializer.serialize(piskel),
                    id: undefined
                };

                return this.getSnapshotsBySessionId(pskl.app.sessionId).then(function (snapshots) {
                    var latest = snapshots[0];

                    if (latest && date < this.nextSnapshotDate) {
                        // update the latest snapshot
                        snapshot.id = latest.id;
                        return this.backupDatabase.updateSnapshot(snapshot);
                    } else {
                        // add a new snapshot
                        this.nextSnapshotDate = date + SNAPSHOT_INTERVAL;
                        return this.backupDatabase.createSnapshot(snapshot).then(function () {
                            if (snapshots.length >= MAX_SNAPSHOTS_PER_SESSION) {
                                // remove oldest snapshot
                                return this.backupDatabase.deleteSnapshot(snapshots[snapshots.length - 1]);
                            }
                        }.bind(this)).then(function () {
                            var isNewSession = !latest;
                            if (!isNewSession) {
                                return;
                            }
                            return this.backupDatabase.getSessions().then(function (sessions) {
                                if (sessions.length <= MAX_SESSIONS) {
                                    // If MAX_SESSIONS has not been reached, no need to delete
                                    // previous sessions.
                                    return;
                                }

                                // Prepare an array containing all the ids of the sessions to be deleted.
                                var sessionIdsToDelete = sessions.sort(function (s1, s2) {
                                    return s1.startDate - s2.startDate;
                                }).map(function (s) {
                                    return s.id;
                                }).slice(0, sessions.length - MAX_SESSIONS);

                                // Delete all the extra sessions.
                                return Q.all(sessionIdsToDelete.map(function (id) {
                                    return this.deleteSession(id);
                                }.bind(this)));
                            }.bind(this));
                        }.bind(this));
                    }
                }.bind(this)).catch(function (e) {
                    console.error(e);
                });
            }

            getSnapshotsBySessionId(sessionId) {
                return this.backupDatabase.getSnapshotsBySessionId(sessionId);
            }

            deleteSession(sessionId) {
                return this.backupDatabase.deleteSnapshotsForSession(sessionId);
            }

            getPreviousPiskelInfo() {
                return this.backupDatabase.findLastSnapshot(function (snapshot) {
                    return snapshot.session_id !== pskl.app.sessionId;
                });
            }

            list() {
                return this.backupDatabase.getSessions();
            }

            loadSnapshotById(snapshotId) {
                var deferred = Q.defer();

                this.backupDatabase.getSnapshot(snapshotId).then(function (snapshot) {
                    pskl.utils.serialization.Deserializer.deserialize(
                        JSON.parse(snapshot.serialized),
                        function (piskel) {
                            pskl.app.piskelController.setPiskel(piskel);
                            deferred.resolve();
                        }
                    );
                });

                return deferred.promise;
            }

            // Load "latest" backup snapshot.
            load() {
                var deferred = Q.defer();

                this.getPreviousPiskelInfo().then(function (snapshot) {
                    pskl.utils.serialization.Deserializer.deserialize(JSON.parse(snapshot.serialized),
                        function (piskel) {
                            pskl.app.piskelController.setPiskel(piskel);
                            deferred.resolve();
                        }
                    );
                });

                return deferred.promise;
            }
        }
    }
}