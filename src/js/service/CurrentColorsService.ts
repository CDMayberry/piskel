module pskl {
    export module service {

        const batchAll = function (frames, job) {
            var batches = [];
            frames = frames.slice(0);
            while (frames.length) {
                batches.push(frames.splice(0, 10));
            }
            var result = Q([]);
            batches.forEach(function (batch) {
                result = result.then(function (results) {
                    return Q.all(batch.map(job)).then(function (partials) {
                        return results.concat(partials);
                    });
                });
            });
            return result;
        };

        export class CurrentColorsService {
            piskelController: any;
            cache: any;
            currentColors: any[];
            cachedFrameProcessor: model.frame.AsyncCachedFrameProcessor;
            paletteService: any;
            throttledUpdateCurrentColors_: () => void;
            constructor(piskelController) {
                this.piskelController = piskelController;
                // cache of current colors by history state
                this.cache = {};
                this.currentColors = [];

                this.cachedFrameProcessor = new pskl.model.frame.AsyncCachedFrameProcessor();
                this.cachedFrameProcessor.setFrameProcessor(this.getFrameColors_.bind(this));
                this.throttledUpdateCurrentColors_ = pskl.utils.FunctionUtils.throttle(this.updateCurrentColors_.bind(this), 1000);

                this.paletteService = pskl.app.paletteService;
            }

            init() {
                $.subscribe(Events.HISTORY_STATE_SAVED, this.throttledUpdateCurrentColors_);
                $.subscribe(Events.HISTORY_STATE_LOADED, this.loadColorsFromCache_.bind(this));
            };

            getCurrentColors() {
                return this.currentColors;
            };

            setCurrentColors(colors) {
                var historyIndex = pskl.app.historyService.currentIndex;
                this.cache[historyIndex] = colors;
                if (colors.join('') !== this.currentColors.join('')) {
                    this.currentColors = colors;
                    $.publish(Events.CURRENT_COLORS_UPDATED);
                }
            };

            // ISSUE: Duplicates existed in JS, which is correct? The lower ones seem to have been better...
            // loadColorsFromCache_ () {
            //     var historyIndex = pskl.app.historyService.currentIndex;
            //     var colors = this.cache[historyIndex];
            //     if (colors) {
            //         this.setCurrentColors(colors);
            //     } else {
            //         this.updateCurrentColors_();
            //     }
            // }

            updateCurrentColors_() {
                var layers = this.piskelController.getLayers();

                // Concatenate all frames in a single array.
                var frames = layers.map(function (l) {
                    return l.getFrames();
                }).reduce(function (p, n) {
                    return p.concat(n);
                });

                batchAll(frames, function (frame) {
                    return this.cachedFrameProcessor.get(frame);
                }.bind(this))
                    .then(function (results) {
                        var colors = {};
                        results.forEach(function (result) {
                            Object.keys(result).forEach(function (color) {
                                colors[color] = true;
                            });
                        });
                        // Remove transparent color from used colors
                        delete colors[pskl.utils.colorToInt(Constants.TRANSPARENT_COLOR)];

                        var hexColors = Object.keys(colors).map(function (color) {
                            return pskl.utils.intToHex(color);
                        });
                        this.setCurrentColors(hexColors);
                    }.bind(this));
            }

            isCurrentColorsPaletteSelected_() {
                var paletteId = pskl.UserSettings.get(pskl.UserSettings.SELECTED_PALETTE);
                var palette = this.paletteService.getPaletteById(paletteId);

                return palette && palette.id === Constants.CURRENT_COLORS_PALETTE_ID;
            }

            loadColorsFromCache_() {
                var historyIndex = pskl.app.historyService.currentIndex;
                var colors = this.cache[historyIndex];
                if (colors) {
                    this.setCurrentColors(colors);
                }
            }

            getFrameColors_(frame, processorCallback) {
                var frameColorsWorker = new pskl.worker.framecolors.FrameColors(frame,
                    function (event) {
                        processorCallback(event.data.colors);
                    },
                    function () { },
                    function (event) { processorCallback({}); }
                );

                frameColorsWorker.process();
            };
        }
    }
}