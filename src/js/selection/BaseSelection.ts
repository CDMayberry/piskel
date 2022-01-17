module pskl {
    export module selection {
        export abstract class BaseSelection {
            pixels: any[];
            time: any;
            hasPastedContent: boolean;

            constructor() {
                this.reset();
            }

            stringify() {
                return JSON.stringify({
                    pixels: this.pixels,
                    time: this.time
                });
            }

            parse(str) {
                var selectionData = JSON.parse(str);
                this.pixels = selectionData.pixels;
                this.time = selectionData.time;
            }

            reset() {
                this.pixels = [];
                this.hasPastedContent = false;
                this.time = -1;
            }

            move(colDiff, rowDiff) {
                var movedPixels = [];

                for (var i = 0, l = this.pixels.length; i < l; i++) {
                    var movedPixel = this.pixels[i];
                    movedPixel.col += colDiff;
                    movedPixel.row += rowDiff;
                    movedPixels.push(movedPixel);
                }

                this.pixels = movedPixels;
            }

            fillSelectionFromFrame(targetFrame) {
                this.pixels.forEach(function (pixel) {
                    var color = targetFrame.getPixel(pixel.col, pixel.row);
                    pixel.color = color || Constants.TRANSPARENT_COLOR;
                });

                this.hasPastedContent = true;
                // Keep track of the selection time to compare between local selection and
                // paste event selections.
                this.time = Date.now();
            }
        }
    }
}