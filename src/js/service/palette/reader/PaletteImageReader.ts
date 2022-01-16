module pskl {
    export module service {
        export module palette {
            export module reader {
                export class PaletteImageReader {
                    file: any;
                    onSuccess: any;
                    onError: any;
                    colorSorter_: color.ColorSorter;

                    constructor(file, onSuccess, onError) {
                        this.file = file;
                        this.onSuccess = onSuccess;
                        this.onError = onError;

                        this.colorSorter_ = new pskl.service.color.ColorSorter();
                    }

                    read() {
                        pskl.utils.FileUtils.readImageFile(this.file, this.onImageLoaded_.bind(this));
                    }

                    private onImageLoaded_(image) {
                        var imageProcessor = new pskl.worker.imageprocessor.ImageProcessor(image,
                            this.onWorkerSuccess_.bind(this),
                            this.onWorkerStep_.bind(this),
                            this.onWorkerError_.bind(this));

                        $.publish(Events.SHOW_PROGRESS, [{ 'name': 'Processing image colors ...' }]);

                        imageProcessor.process();
                    }

                    private onWorkerSuccess_(event) {
                        var data = event.data;
                        var colorsMap = data.colorsMap;

                        var colors = Object.keys(colorsMap);

                        if (colors.length > Constants.MAX_PALETTE_COLORS) {
                            this.onError('Too many colors : ' + colors.length);
                        } else {
                            var uuid = pskl.utils.Uuid.generate();
                            var sortedColors = this.colorSorter_.sort(colors);
                            var palette = new pskl.model.Palette(uuid, this.file.name + ' palette', sortedColors);

                            this.onSuccess(palette);
                        }
                        $.publish(Events.HIDE_PROGRESS);
                    }

                    private onWorkerStep_(event) {
                        var progress = event.data.progress;
                        $.publish(Events.UPDATE_PROGRESS, [{ 'progress': progress }]);
                    }

                    private onWorkerError_(event) {
                        $.publish(Events.HIDE_PROGRESS);
                        this.onError('Unable to process the image : ' + event.data.message);
                    }
                }
            }
        }
    }
}