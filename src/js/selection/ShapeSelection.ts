module pskl {
    export module selection {
        export class ShapeSelection extends BaseSelection {
            constructor(pixels) {
                super();

                this.pixels = pixels;
            }
        }
    }
}