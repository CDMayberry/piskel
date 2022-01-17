module pskl {
    export module selection {
        export class RectangularSelection extends BaseSelection {
            constructor(x0, y0, x1, y1) {
                super();
                this.pixels = pskl.PixelUtils.getRectanglePixels(x0, y0, x1, y1);
            }
        }
    }
}