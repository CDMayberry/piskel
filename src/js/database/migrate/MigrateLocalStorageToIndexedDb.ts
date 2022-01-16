module pskl {
    export module database {
        export module migrate {
            export module MigrateLocalStorageToIndexedDb {
                export function migrate(piskelDatabase) {
                    var deferred = Q.defer();

                    var localStorageService = pskl.app.localStorageService;

                    var localStorageKeys = localStorageService.getKeys();
                    var migrationData = localStorageKeys.map(function (key) {
                        return {
                            name: key.name,
                            description: key.description,
                            date: key.date,
                            serialized: localStorageService.getPiskel(key.name)
                        };
                    });

                    // Define the sequential migration process.
                    // Wait for each sprite to be saved before saving the next one.
                    var success = true;
                    var migrateSprite = function (index) {
                        var data = migrationData[index];
                        if (!data) {
                            console.log('Data migration from local storage to indexed db finished.');
                            if (success) {
                                console.log('Local storage piskels successfully migrated. Old copies will be deleted.');
                                deleteLocalStoragePiskels();
                            }

                            deferred.resolve();
                        } else {
                            save_(piskelDatabase, data)
                                .then(function () {
                                    migrateSprite(index + 1);
                                })
                                .catch(function (e) {
                                    var success = false;
                                    console.error('Failed to migrate local storage sprite for name: ' + data.name);
                                    migrateSprite(index + 1);
                                });
                        }
                    };

                    // Start the migration.
                    migrateSprite(0);

                    return deferred.promise;
                }

                export function save_(piskelDatabase, piskelData) {
                    return piskelDatabase.get(piskelData.name).then(function (data) {
                        if (typeof data !== 'undefined') {
                            return piskelDatabase.update(piskelData.name, piskelData.description, piskelData.date, piskelData.serialized);
                        } else {
                            return piskelDatabase.create(piskelData.name, piskelData.description, piskelData.date, piskelData.serialized);
                        }
                    });
                }

                export function deleteLocalStoragePiskels() {
                    var localStorageKeys = pskl.app.localStorageService.getKeys();

                    // Remove all sprites.
                    localStorageKeys.forEach(function (key) {
                        window.localStorage.removeItem('piskel.' + key.name);
                    });

                    // Remove keys.
                    window.localStorage.removeItem('piskel.keys');
                }
            }
        }
    }
}
