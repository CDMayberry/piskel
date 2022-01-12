module pskl {
    export module tools {
        export module drawing {
            export class Rectangle extends ShapeTool {
                constructor() {
                    super();

                    this.toolId = 'tool-rectangle';
                    this.helpText = 'Rectangle tool';
                    this.shortcut = pskl.service.keyboard.Shortcuts.TOOL.RECTANGLE;
                }

                /**
                 * @override
                 */
                draw(col, row, color, targetFrame, penSize) {
                    var rectangle = pskl.PixelUtils.getOrderedRectangleCoordinates(this.startCol, this.startRow, col, row);

                    for (var x = rectangle.x0; x <= rectangle.x1; x++) {
                        for (var y = rectangle.y0; y <= rectangle.y1; y++) {
                            if (
                                x > rectangle.x1 - penSize ||
                                x < rectangle.x0 + penSize ||
                                y > rectangle.y1 - penSize ||
                                y < rectangle.y0 + penSize
                            ) {
                                targetFrame.setPixel(x, y, color);
                            }
                        }
                    }
                }
            }
        }
    }
}