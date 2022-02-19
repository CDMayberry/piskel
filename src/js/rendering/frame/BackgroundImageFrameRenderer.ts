module pskl {
    export module rendering {
        export module frame {
            export class BackgroundImageFrameRenderer {
                container: any;
                frameContainer: any;
                cachedFrameProcessor: model.frame.CachedFrameProcessor;
                zoom: any;

                constructor(container, zoom) {
                    this.container = container;
                    this.setZoom(zoom);

                    var containerDocument = container.ownerDocument;
                    this.frameContainer = containerDocument.createElement('div');
                    this.frameContainer.classList.add('background-image-frame-container');
                    container.appendChild(this.frameContainer);

                    this.cachedFrameProcessor = new pskl.model.frame.CachedFrameProcessor();
                    this.cachedFrameProcessor.setFrameProcessor(this.frameToDataUrl_.bind(this));
                }

                private frameToDataUrl_(frame) {
                    var canvas;
                    if (frame instanceof pskl.model.frame.RenderedFrame) {
                        canvas = pskl.utils.ImageResizer.scale(frame.getRenderedFrame(), this.zoom);
                    } else {
                        canvas = pskl.utils.FrameUtils.toImage(frame, this.zoom);
                    }
                    return canvas.toDataURL('image/png');
                }

                render(frame) {
                    var imageSrc = this.cachedFrameProcessor.get(frame, this.zoom);
                    this.frameContainer.style.backgroundImage = 'url(' + imageSrc + ')';
                }

                show() {
                    if (this.frameContainer) {
                        this.frameContainer.style.display = 'block';
                    }
                }

                setZoom(zoom) {
                    this.zoom = zoom;
                }

                getZoom() {
                    return this.zoom;
                }

                setRepeated(repeat) {
                    var repeatValue;
                    if (repeat) {
                        repeatValue = 'repeat';
                    } else {
                        repeatValue = 'no-repeat';
                    }
                    this.frameContainer.style.backgroundRepeat = repeatValue;
                }
            }
        }
    }
}