module pskl {
    export module tools {
        export module drawing {
            export class ShapeTool extends BaseTool {
                startCol: any;
                startRow: any;

                constructor() {
                    super();

                    // Shapes's first point coordinates (set in applyToolAt)
                    this.startCol = null;
                    this.startRow = null;

                    this.tooltipDescriptors = [
                        { key: 'shift', description: 'Keep 1 to 1 ratio' }
                    ];
                }

                supportsDynamicPenSize() {
                    return true;
                }

                /**
                 * @override
                 */
                applyToolAt(col, row, frame, overlay, event) {
                    $.publish(Events.DRAG_START, [col, row]);
                    this.startCol = col;
                    this.startRow = row;

                    // Drawing the first point of the rectangle in the fake overlay canvas:
                    var penSize = pskl.app.penSizeService.getPenSize();
                    this.draw(col, row, this.getToolColor(), overlay, penSize);
                }

                moveToolAt(col, row, frame, overlay, event) {
                    var coords = this.getCoordinates_(col, row, event);
                    $.publish(Events.CURSOR_MOVED, [coords.col, coords.row]);

                    overlay.clear();
                    var color = this.getToolColor();
                    if (color == Constants.TRANSPARENT_COLOR) {
                        color = Constants.SELECTION_TRANSPARENT_COLOR;
                    }

                    // draw in overlay
                    var penSize = pskl.app.penSizeService.getPenSize();
                    this.draw(coords.col, coords.row, color, overlay, penSize);
                }

                /**
                 * @override
                 */
                releaseToolAt(col, row, frame, overlay, event) {
                    overlay.clear();
                    var coords = this.getCoordinates_(col, row, event);
                    var color = this.getToolColor();
                    var penSize = pskl.app.penSizeService.getPenSize();
                    this.draw(coords.col, coords.row, color, frame, penSize);

                    $.publish(Events.DRAG_END);
                    this.raiseSaveStateEvent({
                        col: coords.col,
                        row: coords.row,
                        startCol: this.startCol,
                        startRow: this.startRow,
                        color: color,
                        penSize: penSize
                    });
                }

                /**
                 * @override
                 */
                replay(frame, replayData) {
                    this.startCol = replayData.startCol;
                    this.startRow = replayData.startRow;
                    this.draw(replayData.col, replayData.row, replayData.color, frame, replayData.penSize);
                }

                /**
                 * Transform the current coordinates based on the original event
                 * @param {Number} col current col/x coordinate in the frame
                 * @param {Number} row current row/y coordinate in the frame
                 * @param {Event} event current event (can be mousemove, mouseup ...)
                 * @return {Object} {row : Number, col : Number}
                 */
                getCoordinates_(col, row, event) {
                    if (event.shiftKey) {
                        return this.getScaledCoordinates_(col, row);
                    } else {
                        return { col: col, row: row };
                    }
                }

                /**
                 * Transform the coordinates to preserve a square 1:1 ratio from the origin of the shape
                 * @param {Number} col current col/x coordinate in the frame
                 * @param {Number} row current row/y coordinate in the frame
                 * @return {Object} {row : Number, col : Number}
                 */
                getScaledCoordinates_(col, row) {
                    var dX = this.startCol - col;
                    var absX = Math.abs(dX);

                    var dY = this.startRow - row;
                    var absY = Math.abs(dY);

                    var delta = Math.min(absX, absY);
                    row = this.startRow - ((dY / absY) * delta);
                    col = this.startCol - ((dX / absX) * delta);

                    return {
                        col: col,
                        row: row
                    };
                }

                draw(col, row, color, frame, penSize) { throw 'abstract method should be implemented'; }
            }
        }
    }
}