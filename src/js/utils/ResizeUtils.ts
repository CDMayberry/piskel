module pskl {
    export module utils {
        export module ResizeUtils {
            /**
 * Resize the provided piskel instance and return a new instance using the provided resize options
 * @param  {Piskel} piskel  [description]
 * @param  {Object} options
 *         - width {Number} target width after the resize
 *         - height {Number} target height after the resize
 *         - resizeContent {Booleam} true of the sprite content should be resized
 *         - origin {String} should be a valid AnchorWidget origin
 * @return {Piskel} The resized piskel
 */
            export function resizePiskel(piskel, options) {
                var fps = piskel.getFPS();
                var resizedLayers = piskel.getLayers().map(function (layer) {
                    return resizeLayer(layer, options);
                });

                var resizedPiskel = pskl.model.Piskel.fromLayers(resizedLayers, fps, piskel.getDescriptor());
                // propagate savepath to new Piskel
                resizedPiskel.savePath = piskel.savePath;

                return resizedPiskel;
            }

            export function resizeLayer(layer, options) {
                var opacity = layer.getOpacity();
                var resizedFrames = layer.getFrames().map(function (frame) {
                    return resizeFrame(frame, options);
                });
                var resizedLayer = pskl.model.Layer.fromFrames(layer.getName(), resizedFrames);
                resizedLayer.setOpacity(opacity);
                return resizedLayer;
            }

            export function resizeFrame(frame, options) {
                var width = options.width;
                var height = options.height;
                var origin = options.origin;

                if (options.resizeContent) {
                    return pskl.utils.FrameUtils.resize(frame, width, height, false);
                } else {
                    var resizedFrame = new pskl.model.Frame(width, height);
                    frame.forEachPixel(function (color, x, y) {
                        var translated = translateCoordinates(x, y, frame, resizedFrame, origin);
                        if (resizedFrame.containsPixel(translated.x, translated.y)) {
                            resizedFrame.setPixel(translated.x, translated.y, color);
                        }
                    });

                    return resizedFrame;
                }
            }

            export function translateCoordinates(x, y, frame, resizedFrame, origin) {
                return {
                    x: translateX(x, frame.width, resizedFrame.width, origin),
                    y: translateY(y, frame.height, resizedFrame.height, origin)
                };
            }

            export function translateX(x, width, resizedWidth, origin) {
                if (origin.indexOf('LEFT') != -1) {
                    return x;
                } else if (origin.indexOf('RIGHT') != -1) {
                    return x - (width - resizedWidth);
                } else {
                    return x - Math.round((width - resizedWidth) / 2);
                }
            }

            export function translateY(y, height, resizedHeight, origin) {
                if (origin.indexOf('TOP') != -1) {
                    return y;
                } else if (origin.indexOf('BOTTOM') != -1) {
                    return y - (height - resizedHeight);
                } else {
                    return y - Math.round((height - resizedHeight) / 2);
                }
            }
        }
    }
}