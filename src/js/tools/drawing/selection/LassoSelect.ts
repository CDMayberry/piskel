module pskl {
    export module tools {
        export module drawing {
            export module selection {
                export class LassoSelect extends AbstractDragSelect {
                    pixels: any;
                    previousCol: any;
                    previousRow: any;
                    constructor() {
                        super();

                        this.toolId = 'tool-lasso-select';
                        this.helpText = 'Lasso selection';
                        this.shortcut = pskl.service.keyboard.Shortcuts.TOOL.LASSO_SELECT;
                    }


                    /** @override */
                    onDragSelectStart_(col, row) {
                        this.pixels = [{ col: col, row: row }];

                        this.startCol = col;
                        this.startRow = row;

                        this.previousCol = col;
                        this.previousRow = row;

                        $.publish(Events.DRAG_START, [col, row]);
                    };

                    /** @override */
                    onDragSelect_(col, row, frame, overlay) {
                        this.addPixel_(col, row, frame);
                        // use ShapeSelection during selection, contains only the pixels hovered by the user
                        var selection = new pskl.selection.ShapeSelection(this.getLassoPixels_());
                        this.setSelection_(selection, overlay);
                    };

                    /** @override */
                    onDragSelectEnd_(col, row, frame, overlay) {
                        this.addPixel_(col, row, frame);
                        // use LassoSelection to finalize selection, includes pixels inside the lasso shape
                        var selection = new pskl.selection.LassoSelection(this.getLassoPixels_(), frame);
                        this.setSelection_(selection, overlay);

                        $.publish(Events.DRAG_END);
                    };

                    /**
                     * Retrieve the lasso shape as an array of pixels. A line is added between the origin of the selection
                     * and the last known coordinate to make sure the shape is closed.
                     *
                     * @return {Array} array of pixels corresponding to the whole lasso shape
                     * @private
                     */
                    getLassoPixels_() {
                        var line = pskl.PixelUtils.getLinePixels(this.previousCol, this.startCol, this.previousRow, this.startRow);
                        return this.pixels.concat(line);
                    };

                    /**
                     * Add the provided pixel to the lasso pixels Array.
                     * @private
                     */
                    addPixel_(col, row, frame) {
                        // normalize coordinates to always remain inside the frame
                        col = pskl.utils.math.minmax(col, 0, frame.getWidth() - 1);
                        row = pskl.utils.math.minmax(row, 0, frame.getHeight() - 1);

                        // line interpolation needed in case mousemove was too fast
                        var interpolatedPixels = pskl.PixelUtils.getLinePixels(col, this.previousCol, row, this.previousRow);
                        this.pixels = this.pixels.concat(interpolatedPixels);

                        // update state
                        this.previousCol = col;
                        this.previousRow = row;
                    };

                    /** @private */
                    setSelection_(selection, overlay) {
                        this.selection = selection;

                        $.publish(Events.SELECTION_CREATED, [this.selection]);
                        overlay.clear();
                        this.drawSelectionOnOverlay_(overlay);
                    };

                    onSelectionMoveStart_(col: any, row: any, frame: any, overlay: any) {
                        //throw new Error("Method not implemented.");
                    }
                    replay(frame: any, replayData: any) {
                        throw new Error("Method not implemented.");
                    }
                }
            }
        }
    }
}