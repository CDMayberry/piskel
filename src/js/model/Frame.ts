module pskl {
    export module model {
        var __idCounter = 0;
        var _emptyPixelGridCache = {};

        export class Frame {
            width: any;
            height: any;
            id: number;
            version: number;
            pixels: any;
            stateIndex: number;

            constructor(width, height) {
                if (!width || !height) {
                    throw 'Bad arguments in pskl.model.Frame constructor : ' + width + ', ' + height;
                }

                if (width && height) {
                    this.width = width;
                    this.height = height;
                    this.id = __idCounter++;
                    this.version = 0;
                    this.pixels = Frame.createEmptyPixelGrid_(width, height);
                    this.stateIndex = 0;
                }
            }

            static fromPixelGrid(pixels, width?, height?) {
                if (!pixels.length) {
                    throw 'Bad arguments in pskl.model.Frame.fromPixelGrid';
                }

                var w;
                var h;
                var buffer;

                if (pixels[0].length) {
                    w = pixels.length;
                    h = pixels[0].length;
                    buffer = [];
                    for (var y = 0; y < h; y++) {
                        for (var x = 0; x < w; x++) {
                            if (typeof pixels[x][y] == 'string') {
                                buffer[y * w + x] = pskl.utils.colorToInt(pixels[x][y]);
                            } else {
                                buffer[y * w + x] = pixels[x][y];
                            }
                        }
                    }
                } else if (width && height) {
                    w = width;
                    h = height;
                    buffer = pixels;
                } else {
                    throw 'Bad arguments in pskl.model.frame.fromPixelGrid, missing width and height';
                }

                var frame = new Frame(w, h);
                frame.setPixels(buffer);
                return frame;

            };

            static createEmptyPixelGrid_(width, height) {
                var pixels;
                var key = width + '-' + height;
                if (_emptyPixelGridCache[key]) {
                    pixels = _emptyPixelGridCache[key];
                } else {
                    pixels = _emptyPixelGridCache[key] = new Uint32Array(width * height);
                    var transparentColorInt = pskl.utils.colorToInt(Constants.TRANSPARENT_COLOR);
                    pixels.fill(transparentColorInt);
                }

                return new Uint32Array(pixels);
            };

            static createEmptyFromFrame(frame) {
                return new Frame(frame.getWidth(), frame.getHeight());
            };

            clone() {
                var clone = new Frame(this.width, this.height);
                clone.setPixels(this.pixels);
                return clone;
            };

            /**
             * Returns a copy of the pixels used by the frame
             */
            getPixels() {
                return this.clonePixels_(this.pixels);
            };

            /**
             * Copies the passed pixels into the frame.
             */
            setPixels(pixels) {
                this.pixels = this.clonePixels_(pixels);
                this.version++;
            };

            clear() {
                this.pixels = Frame.createEmptyPixelGrid_(this.getWidth(), this.getHeight());
                this.version++;
            };

            /**
             * Clone a set of pixels. Should be static utility method
             * @private
             */
            clonePixels_(pixels) {
                return new Uint32Array(pixels);
            };

            getHash() {
                return [this.id, this.version].join('-');
            };

            setPixel(x, y, color) {
                if (this.containsPixel(x, y)) {
                    var index = y * this.width + x;
                    var p = this.pixels[index];
                    color = pskl.utils.colorToInt(color);

                    if (p !== color) {
                        this.pixels[index] = color || pskl.utils.colorToInt(Constants.TRANSPARENT_COLOR);
                        this.version++;
                    }
                }
            };

            getPixel(x, y) {
                if (this.containsPixel(x, y)) {
                    return this.pixels[y * this.width + x];
                } else {
                    return null;
                }
            };

            forEachPixel(callback) {
                var width = this.getWidth();
                var height = this.getHeight();
                var length = width * height;
                for (var i = 0; i < length; i++) {
                    callback(this.pixels[i], i % width, Math.floor(i / width), this);
                }
            };

            getWidth() {
                return this.width;
            };

            getHeight() {
                return this.height;
            };

            containsPixel(col, row) {
                return col >= 0 && row >= 0 && col < this.width && row < this.height;
            };

            isSameSize(otherFrame) {
                return this.getHeight() == otherFrame.getHeight() && this.getWidth() == otherFrame.getWidth();
            };
        }
    }
}