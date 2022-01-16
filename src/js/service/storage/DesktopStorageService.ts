module pskl {
    export module service {
        export module storage {
            const PISKEL_EXTENSION = '.piskel';

            export class DesktopStorageService {
                piskelController: any;
                hideNotificationTimeoutID: number;

                constructor(piskelController) {
                    this.piskelController = piskelController || pskl.app.piskelController;
                    this.hideNotificationTimeoutID = 0;
                }

                init() { }

                save(piskel, saveAsNew) {
                    if (piskel.savePath && !saveAsNew) {
                        return this.saveAtPath_(piskel, piskel.savePath);
                    } else {
                        var name = piskel.getDescriptor().name;
                        var filenamePromise = pskl.utils.FileUtilsDesktop.chooseFilenameDialog(name, PISKEL_EXTENSION);
                        return filenamePromise.then(this.saveAtPath_.bind(this, piskel));
                    }
                }

                saveAtPath_(piskel, savePath) {
                    if (!savePath) {
                        return Q.reject('Invalid file name');
                    }

                    var serialized = pskl.utils.serialization.Serializer.serialize(piskel);
                    savePath = this.addExtensionIfNeeded_(savePath);
                    piskel.savePath = savePath;
                    piskel.setName(this.extractFilename_(savePath));
                    return pskl.utils.FileUtilsDesktop.saveToFile(serialized, savePath);
                }

                openPiskel() {
                    return pskl.utils.FileUtilsDesktop.chooseFilenameDialog().then(this.load);
                }

                load(savePath) {
                    pskl.utils.FileUtilsDesktop.readFile(savePath).then(function (content) {
                        pskl.utils.PiskelFileUtils.decodePiskelFile(content, function (piskel) {
                            // store save path so we can re-save without opening the save dialog
                            piskel.savePath = savePath;
                            pskl.app.piskelController.setPiskel(piskel);
                        });
                    });
                }

                addExtensionIfNeeded_(filename) {
                    var hasExtension = filename.substr(-PISKEL_EXTENSION.length) === PISKEL_EXTENSION;
                    if (!hasExtension) {
                        return filename + PISKEL_EXTENSION;
                    }
                    return filename;
                }

                extractFilename_(savePath) {
                    var matches = (/[\/\\]([^\/\\]*)\.piskel$/gi).exec(savePath);
                    if (matches && matches[1]) {
                        return matches[1];
                    }
                }
            }
        }
    }
}