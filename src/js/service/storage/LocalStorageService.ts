module pskl {
    export module service {
        export module storage {
            export class LocalStorageService {
                piskelController: any;
                constructor(piskelController) {
                    if (piskelController === undefined) {
                        throw 'Bad LocalStorageService initialization: <undefined piskelController>';
                    }
                    this.piskelController = piskelController;
                }

                init() { }

                save(piskel) {
                    var name = piskel.getDescriptor().name;
                    var description = piskel.getDescriptor().description;

                    var serialized = pskl.utils.serialization.Serializer.serialize(piskel);
                    if (pskl.app.localStorageService.getPiskel(name)) {
                        var confirmOverwrite = window.confirm('There is already a piskel saved as ' + name + '. Overwrite ?');
                        if (!confirmOverwrite) {
                            return Q.reject('Cancelled by user, "' + name + '" already exists');
                        }
                    }

                    try {
                        this.removeFromKeys_(name);
                        this.addToKeys_(name, description, Date.now());
                        window.localStorage.setItem('piskel.' + name, serialized);
                        return Q.resolve();
                    } catch (e) {
                        return Q.reject(e.message);
                    }
                }

                load(name) {
                    var piskelString = this.getPiskel(name);
                    var key = this.getKey_(name);

                    pskl.utils.serialization.Deserializer.deserialize(JSON.parse(piskelString), function (piskel) {
                        pskl.app.piskelController.setPiskel(piskel);
                    });
                }

                remove(name) {
                    this.removeFromKeys_(name);
                    window.localStorage.removeItem('piskel.' + name);
                }

                private saveKeys_(keys) {
                    window.localStorage.setItem('piskel.keys', JSON.stringify(keys));
                }

                private removeFromKeys_(name) {
                    var keys = this.getKeys();
                    var otherKeys = keys.filter(function (key) {
                        return key.name !== name;
                    });

                    this.saveKeys_(otherKeys);
                }

                private getKey_(name) {
                    var matches = this.getKeys().filter(function (key) {
                        return key.name === name;
                    });
                    if (matches.length > 0) {
                        return matches[0];
                    } else {
                        return null;
                    }
                }

                addToKeys_(name, description, date) {
                    var keys = this.getKeys();
                    keys.push({
                        name: name,
                        description: description,
                        date: date
                    });
                    this.saveKeys_(keys);
                }

                getPiskel(name) {
                    return window.localStorage.getItem('piskel.' + name);
                }

                getKeys(name?) {
                    var keysString = window.localStorage.getItem('piskel.keys');
                    return JSON.parse(keysString) || [];
                }
            }
        }
    }
}