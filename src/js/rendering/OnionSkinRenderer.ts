module pskl {
    export module rendering {
        export class OnionSkinRenderer extends CompositeRenderer {
            piskelController: any;
            renderer: any;
            hash: string;

            constructor(renderer, piskelController) {
                super();

                this.piskelController = piskelController;
                this.renderer = renderer;
                this.add(this.renderer);

                this.hash = '';
            }

            static createInContainer(container, renderingOptions, piskelController) {
                // Do not use CachedFrameRenderers here, caching is performed in the render method
                var renderer = new pskl.rendering.frame.FrameRenderer(container, renderingOptions, ['onion-skin-canvas']);
                return new OnionSkinRenderer(renderer, piskelController);
            }

            render() {
                var frames = this.getOnionFrames_();
                var hash = this.computeHash_(frames);
                if (this.hash != hash) {
                    this.hash = hash;
                    this.clear();
                    if (frames.length > 0) {
                        var mergedFrame = pskl.utils.FrameUtils.merge(frames);
                        this.renderer.render(mergedFrame);
                    }
                }
            }

            getOnionFrames_() {
                var frames = [];

                var currentFrameIndex = this.piskelController.getCurrentFrameIndex();
                var layer = this.piskelController.getCurrentLayer();

                var previousIndex = currentFrameIndex - 1;
                var previousFrame = layer.getFrameAt(previousIndex);
                if (previousFrame) {
                    frames.push(previousFrame);
                }

                var nextIndex = currentFrameIndex + 1;
                var nextFrame = layer.getFrameAt(nextIndex);
                if (nextFrame) {
                    frames.push(nextFrame);
                }

                return frames;
            }

            computeHash_(frames) {
                var offset = this.getOffset();
                var size = this.getDisplaySize();
                var layers = this.piskelController.getLayers();
                return [
                    this.getZoom(),
                    this.getGridWidth(),
                    offset.x,
                    offset.y,
                    size.width,
                    size.height,
                    frames.map(function (f) {
                        return f.getHash();
                    }).join('-'),
                    layers.length
                ].join('-');
            }

            /**
             * See @pskl.rendering.frame.CachedFrameRenderer
             * Same issue : FrameRenderer setDisplaySize destroys the canvas
             * @param {Number} width
             * @param {Number} height
             */
            setDisplaySize(width, height) {
                var size = this.getDisplaySize();
                if (size.width !== width || size.height !== height) {
                    super.setDisplaySize.call(this, width, height);
                }
            }

            flush() {
                this.hash = '';
            }
        }
    }
}