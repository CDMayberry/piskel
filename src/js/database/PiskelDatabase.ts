module pskl {
    export module database {

        const DB_NAME = 'PiskelDatabase';
        const DB_VERSION = 1;

        // Simple wrapper to promisify a request.
        const _requestPromise = function (req) {
            var deferred = Q.defer();
            req.onsuccess = deferred.resolve.bind(deferred);
            req.onerror = deferred.reject.bind(deferred);
            return deferred.promise;
        };

        export class PiskelDatabase {
            db: any;

            constructor(options?) {
                this.db = null;
            }

            static DB_NAME = DB_NAME;
            init() {
                var request = window.indexedDB.open(DB_NAME, DB_VERSION);
                request.onupgradeneeded = this.onUpgradeNeeded_.bind(this);

                return _requestPromise(request).then(function (event) {
                    this.db = event.target.result;
                    return this.db;
                }.bind(this));
            }

            onUpgradeNeeded_(event) {
                // Set this.db early to allow migration scripts to access it in oncomplete.
                this.db = event.target.result;

                // Create an object store "piskels" with the autoIncrement flag set as true.
                var objectStore = this.db.createObjectStore('piskels', { keyPath: 'name' });
                objectStore.transaction.oncomplete = function (event) {
                    pskl.database.migrate.MigrateLocalStorageToIndexedDb.migrate(this);
                }.bind(this);
            }

            openObjectStore_() {
                return this.db.transaction(['piskels'], 'readwrite').objectStore('piskels');
            };

            /**
             * Send a get request for the provided name.
             * Returns a promise that resolves the request event.
             */
            get(name) {
                var objectStore = this.openObjectStore_();
                return _requestPromise(objectStore.get(name)).then(function (event) {
                    return event.target.result;
                });
            }

            /**
             * List all locally saved piskels.
             * Returns a promise that resolves an array of objects:
             * - name: name of the piskel
             * - description: description of the piskel
             * - date: save date
             *
             * The sprite content is not contained in the object and
             * needs to be retrieved with a separate get.
             */
            list() {
                var deferred = Q.defer();

                var piskels = [];
                var objectStore = this.openObjectStore_();
                var cursor = objectStore.openCursor();
                cursor.onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        piskels.push({
                            name: cursor.value.name,
                            date: cursor.value.date,
                            description: cursor.value.description
                        });
                        cursor.continue();
                    } else {
                        // Cursor consumed all availabled piskels
                        deferred.resolve(piskels);
                    }
                };

                cursor.onerror = function () {
                    deferred.reject();
                };

                return deferred.promise;
            }

            /**
             * Send an put request for the provided args.
             * Returns a promise that resolves the request event.
             */
            update(name, description, date, serialized) {
                var data = {} as any;

                data.name = name;
                data.serialized = serialized;
                data.date = date;
                data.description = description;

                var objectStore = this.openObjectStore_();
                return _requestPromise(objectStore.put(data));
            }

            /**
             * Send an add request for the provided args.
             * Returns a promise that resolves the request event.
             */
            create(name, description, date, serialized) {
                var data = {} as any;

                data.name = name;
                data.serialized = serialized;
                data.date = date;
                data.description = description;

                var objectStore = this.openObjectStore_();
                return _requestPromise(objectStore.add(data));
            }

            /**
             * Delete a saved piskel for the provided name.
             * Returns a promise that resolves the request event.
             */
            delete(name) {
                var objectStore = this.openObjectStore_();
                return _requestPromise(objectStore.delete(name));
            }
        }
    }
}