module pskl {
    export module model {
        export module frame {
            /**
             * Create a frame instance that provides an image getter. Can be faster
             * to use after merging using transparency. Transparent frames are merged to
             * an image and this allows to reuse the image rather than retransform into
             * a frame before calling the renderers.
             *
             * This rendered frame should only be used with renderers that support it.
             *
             * @param {Function} imageFn getter that will create the image
             * @param {Number} width image width in pixels
             * @param {Number} height image height in pixels
             * @param {String} id will be used as hash, so should be as unique as possible
             */

            export class RenderedFrame {
                width: any;
                height: any;
                id: any;
                renderFn: any;

                constructor(renderFn, width, height, id) {
                    this.width = width;
                    this.height = height;
                    this.id = id;
                    this.renderFn = renderFn;
                }

                getRenderedFrame() {
                    return this.renderFn();
                }

                getHash() {
                    return this.id;
                }

                getWidth() {
                    return this.width;
                }

                getHeight() {
                    return this.height;
                }

                getPixels = Constants.ABSTRACT_FUNCTION;
                containsPixel = Constants.ABSTRACT_FUNCTION;
                isSameSize = Constants.ABSTRACT_FUNCTION;
                clone = Constants.ABSTRACT_FUNCTION;
                setPixels = Constants.ABSTRACT_FUNCTION;
                clear = Constants.ABSTRACT_FUNCTION;
                setPixel = Constants.ABSTRACT_FUNCTION;
                getPixel = Constants.ABSTRACT_FUNCTION;
                forEachPixel = Constants.ABSTRACT_FUNCTION;
            }
        }
    }
}