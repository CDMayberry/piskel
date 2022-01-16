module pskl {
    export module service {
        export class ImportService {
            piskelController_: any;
            constructor(piskelController) {
                this.piskelController_ = piskelController;
            }
            init() {
                $.subscribe(Events.PISKEL_FILE_IMPORT_FAILED, this.onPiskelFileImportFailed_);
            }

            /**
             * Called when a piskel load failed event is published. Display an appropriate error message.
             * TODO: for some failure reasons, we might want to display a dialog with more details.
             */
            onPiskelFileImportFailed_(evt, reason) {
                $.publish(Events.SHOW_NOTIFICATION, [{
                    'content': 'Piskel file import failed (' + reason + ')',
                    'hideDelay': 10000
                }]);
            }

            /**
             * Given an image object and some options, create a new Piskel and open it
             * for editing.
             * @param {Image} image
             * @param {Object} options
             *        - {String}  importType 'single' if not spritesheet
             *        - {String}  name
             *        - {Boolean} smoothing
             *        - {Number}  frameSizeX
             *        - {Number}  frameSizeY
             *        - {Number}  frameOffsetX (only used in spritesheet imports)
             *        - {Number}  frameOffsetY (only used in spritesheet imports)
             * @param {Function} onComplete
             *        Callback called when the new piskel has been created, with the new piskel
             *        as single argument.
             */
            newPiskelFromImage(image, options, onComplete: Function) {
                onComplete = onComplete || Constants.EMPTY_FUNCTION;
                var importType = options.importType;
                var name = options.name;
                var smoothing = options.smoothing;
                var frameSizeX = options.frameSizeX;
                var frameSizeY = options.frameSizeY;
                var frameOffsetX = options.frameOffsetX;
                var frameOffsetY = options.frameOffsetY;

                //@ts-ignore
                var gifLoader = new window.SuperGif({
                    gif: image
                });

                gifLoader.load({
                    success: function () {
                        var images = gifLoader.getFrames().map(function (frame) {
                            return pskl.utils.CanvasUtils.createFromImageData(frame.data);
                        });

                        var piskel;
                        if (importType === 'single' || images.length > 1) {
                            // Single image import or animated gif
                            piskel = this.createPiskelFromImages_(images, name, frameSizeX, frameSizeY, smoothing);
                        } else {
                            // Spritesheet
                            var frameImages = this.createImagesFromSheet_(images[0], frameSizeX, frameSizeY, frameOffsetX, frameOffsetY);
                            piskel = this.createPiskelFromImages_(frameImages, name, frameSizeX, frameSizeY, smoothing);
                        }
                        onComplete(piskel);
                    }.bind(this),
                    error: function () {
                        var piskel;
                        if (importType === 'single') {
                            // Single image
                            piskel = this.createPiskelFromImages_([image], name, frameSizeX, frameSizeY, smoothing);
                        } else {
                            // Spritesheet
                            var frameImages = this.createImagesFromSheet_(image, frameSizeX, frameSizeY, frameOffsetX, frameOffsetY);
                            piskel = this.createPiskelFromImages_(frameImages, name, frameSizeX, frameSizeY, smoothing);
                        }
                        onComplete(piskel);
                    }.bind(this)
                });
            }

            /**
             * @param {!Image} image
             * @returns {canvas[]}
             * @private
             */
            createImagesFromSheet_(image, frameSizeX: number, frameSizeY: number, frameOffsetX: number, frameOffsetY: number) {
                return pskl.utils.CanvasUtils.createFramesFromImage(
                    image,
                    frameOffsetX,
                    frameOffsetY,
                    frameSizeX,
                    frameSizeY,
              /*useHorizonalStrips=*/ true,
              /*ignoreEmptyFrames=*/ true);
            }

            /**
             * @param images images -> canvas[]?
             * @private
             */
            createPiskelFromImages_(images: any[], name: string, frameSizeX: number, frameSizeY: number, smoothing: boolean) {
                name = name || 'Imported piskel';
                var frames = this.createFramesFromImages_(images, frameSizeX, frameSizeY, smoothing);
                var layer = pskl.model.Layer.fromFrames('Layer 1', frames);
                var descriptor = new pskl.model.piskel.Descriptor(name, '');
                return pskl.model.Piskel.fromLayers([layer], Constants.DEFAULT.FPS, descriptor);
            }

            /**
             * @param images images -> canvas[]?
             * @private
             */
            createFramesFromImages_(images: any[], frameSizeX: number, frameSizeY: number, smoothing: boolean): pskl.model.Frame[] {
                return images.map(function (image) {
                    var resizedImage = pskl.utils.ImageResizer.resize(image, frameSizeX, frameSizeY, smoothing);
                    return pskl.utils.FrameUtils.createFromImage(resizedImage);
                });
            }
        }
    }
}