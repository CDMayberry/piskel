module pskl {
    export module tools {
        export module drawing {
            export class DitheringTool extends SimplePen {
                constructor() {
                    super();

                    this.toolId = 'tool-dithering';
                    this.helpText = 'Dithering tool';
                    this.shortcut = pskl.service.keyboard.Shortcuts.TOOL.DITHERING;
                }

                supportsDynamicPenSize () {
                    return true;
                }
    
                /**
                 * @override
                 */
                applyToolAt (col, row, frame, overlay, event) {
                    this.previousCol = col;
                    this.previousRow = row;
    
                    var penSize = pskl.app.penSizeService.getPenSize();
                    var points = pskl.PixelUtils.resizePixel(col, row, penSize);
                    points.forEach(function (point) {
                        this.applyToolOnPixel(point[0], point[1], frame, overlay, event);
                    }.bind(this));
                };
    
                applyToolOnPixel (col, row, frame, overlay, event) {
                    var usePrimaryColor = !!((col + row) % 2);
    
                    if (pskl.app.mouseStateService.isRightButtonPressed()) {
                        usePrimaryColor = !usePrimaryColor;
                    }
    
                    var ditheringColor = usePrimaryColor ?
                        pskl.app.selectedColorsService.getPrimaryColor() :
                        pskl.app.selectedColorsService.getSecondaryColor();
    
                    this.draw(ditheringColor, col, row, frame, overlay);
                };
            }
        }
    }
}