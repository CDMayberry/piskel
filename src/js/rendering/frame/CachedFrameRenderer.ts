module pskl {
    export module rendering {
        export module frame {
            export class CachedFrameRenderer extends FrameRenderer {
                serializedFrame: string;

                constructor(container, renderingOptions, classList) {
                    super(container, renderingOptions, classList);
                    this.serializedFrame = '';
                }

                /**
                 * Only call display size if provided values are different from current values.
                 * FrameRenderer.setDisplaySize destroys the underlying canvas
                 * If the canvas is destroyed, a rendering is mandatory.
                 * (Alternatively we could find a way to force the rendering of the CachedFrameRenderer from the outside)
                 */
                setDisplaySize(width: number, height: number) {
                    if (this.displayWidth !== width || this.displayHeight !== height) {
                        super.setDisplaySize(width, height);
                    }
                }

                render(frame: pskl.model.Frame) {
                    var offset = this.getOffset();
                    var size = this.getDisplaySize();
                    var serializedFrame = [
                        this.getZoom(),
                        this.getGridWidth(),
                        this.getGridSpacing(),
                        this.getGridColor(),
                        pskl.UserSettings.get('SEAMLESS_MODE'),
                        pskl.UserSettings.get('SEAMLESS_OPACITY'),
                        offset.x, offset.y,
                        size.width, size.height,
                        frame.getHash()
                    ].join('-');

                    if (this.serializedFrame != serializedFrame) {
                        this.serializedFrame = serializedFrame;
                        super.render(frame);
                    }
                }
            }
        }
    }
}