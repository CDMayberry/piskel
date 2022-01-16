module pskl {
    export module service {
        export module storage {
            export class IndexedDbStorageService {
                piskelController: any;
                piskelDatabase: database.PiskelDatabase;

                constructor(piskelController) {
                    this.piskelController = piskelController;
                    this.piskelDatabase = new pskl.database.PiskelDatabase();
                }

                init() {
                    this.piskelDatabase.init().catch(function (e) {
                        console.log('Failed to initialize PiskelDatabase, local browser saves will be unavailable.');
                    });
                }

                save(piskel) {
                    var name = piskel.getDescriptor().name;
                    var description = piskel.getDescriptor().description;
                    var date = Date.now();
                    var serialized = pskl.utils.serialization.Serializer.serialize(piskel);

                    return this.save_(name, description, date, serialized);
                }

                private save_(name, description, date, serialized) {
                    return this.piskelDatabase.get(name).then(function (piskelData) {
                        if (typeof piskelData !== 'undefined') {
                            return this.piskelDatabase.update(name, description, date, serialized);
                        } else {
                            return this.piskelDatabase.create(name, description, date, serialized);
                        }
                    }.bind(this));
                }

                load(name) {
                    return this.piskelDatabase.get(name).then(function (piskelData) {
                        if (typeof piskelData !== 'undefined') {
                            var serialized = piskelData.serialized;
                            pskl.utils.serialization.Deserializer.deserialize(
                                JSON.parse(serialized),
                                function (piskel) {
                                    pskl.app.piskelController.setPiskel(piskel);
                                }
                            );
                        } else {
                            console.log('no local browser save found for name: ' + name);
                        }
                    });
                }

                remove(name) {
                    return this.piskelDatabase.delete(name);
                }

                getKeys() {
                    return this.piskelDatabase.list();
                }
            }
        }
    }
}