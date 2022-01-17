module pskl {
    export module selection {

        const OUTSIDE = -1;
        const INSIDE = 1;
        const VISITED = 2;

        export class LassoSelection extends BaseSelection {
            pixelsMap: any;
            constructor(pixels, frame) {
                super();

                // transform the selected pixels array to a Map to get a faster lookup
                this.pixelsMap = {};
                pixels.forEach(function (pixel) {
                    this.setPixelInMap_(pixel, INSIDE);
                }.bind(this));

                this.pixels = this.getLassoPixels_(frame);
            }

            getLassoPixels_(frame) {
                var lassoPixels = [];

                frame.forEachPixel(function (color, pixelCol, pixelRow) {
                    var pixel = { col: pixelCol, row: pixelRow };
                    if (this.isInSelection_(pixel, frame)) {
                        lassoPixels.push(pixel);
                    }
                }.bind(this));

                return lassoPixels;
            }

            isInSelection_(pixel, frame) {
                var alreadyVisited = this.getPixelInMap_(pixel);
                if (!alreadyVisited) {
                    this.visitPixel_(pixel, frame);
                }

                return this.getPixelInMap_(pixel) == INSIDE;
            }

            visitPixel_(pixel, frame) {
                var frameBorderReached = false;
                var visitedPixels = pskl.PixelUtils.visitConnectedPixels(pixel, frame, function (connectedPixel) {
                    var alreadyVisited = this.getPixelInMap_(connectedPixel);
                    if (alreadyVisited) {
                        return false;
                    }

                    if (!frame.containsPixel(connectedPixel.col, connectedPixel.row)) {
                        frameBorderReached = true;
                        return false;
                    }

                    this.setPixelInMap_(connectedPixel, VISITED);
                    return true;
                }.bind(this));

                visitedPixels.forEach(function (visitedPixel) {
                    this.setPixelInMap_(visitedPixel, frameBorderReached ? OUTSIDE : INSIDE);
                }.bind(this));
            }

            setPixelInMap_(pixel, value) {
                this.pixelsMap[pixel.col] = this.pixelsMap[pixel.col] || {};
                this.pixelsMap[pixel.col][pixel.row] = value;
            }

            getPixelInMap_(pixel) {
                return this.pixelsMap[pixel.col] && this.pixelsMap[pixel.col][pixel.row];
            }
        }
    }
}