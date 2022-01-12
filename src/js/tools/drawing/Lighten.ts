module pskl {
    export module tools {
        export module drawing {
            const DEFAULT_STEP = 3;

            export class Lighten extends SimplePen {
                constructor() {
                    super();

                    this.toolId = 'tool-lighten';
                    this.helpText = 'Lighten';
                    this.shortcut = pskl.service.keyboard.Shortcuts.TOOL.LIGHTEN;

                    this.tooltipDescriptors = [
                        { key: 'ctrl', description: 'Darken' },
                        { key: 'shift', description: 'Apply only once per pixel' }
                    ];
                }

                /**
                 * @Override
                 */
                applyToolAt (col, row, frame, overlay, event) {
                    this.previousCol = col;
                    this.previousRow = row;
            
                    var penSize = pskl.app.penSizeService.getPenSize();
                    var points = pskl.PixelUtils.resizePixel(col, row, penSize);
                    points.forEach(function (point) {
                        var modifiedColor = this.getModifiedColor_(point[0], point[1], frame, overlay, event);
                        this.draw(modifiedColor, point[0], point[1], frame, overlay);
                    }.bind(this));
                };
            
                getModifiedColor_ (col, row, frame, overlay, event) {
                    // get colors in overlay and in frame
                    var overlayColor = overlay.getPixel(col, row);
                    var frameColor = frame.getPixel(col, row);
            
                    var isPixelModified = overlayColor !== pskl.utils.colorToInt(Constants.TRANSPARENT_COLOR);
                    var pixelColor = isPixelModified ? overlayColor : frameColor;
            
                    var isTransparent = pixelColor === pskl.utils.colorToInt(Constants.TRANSPARENT_COLOR);
                    if (isTransparent) {
                        return Constants.TRANSPARENT_COLOR;
                    }
            
                    var oncePerPixel = event.shiftKey;
                    if (oncePerPixel && isPixelModified) {
                        return pixelColor;
                    }
            
                    var step = oncePerPixel ? DEFAULT_STEP * 2 : DEFAULT_STEP;
                    var isDarken = pskl.utils.UserAgent.isMac ? event.metaKey : event.ctrlKey;
            
                    var color;
                    if (isDarken) {
                        color = window.tinycolor.darken(pskl.utils.intToColor(pixelColor), step);
                    } else {
                        color = window.tinycolor.lighten(pskl.utils.intToColor(pixelColor), step);
                    }
            
                    // Convert tinycolor color to string format.
                    return color.toHexString();
                };

            }
        }
    }
}