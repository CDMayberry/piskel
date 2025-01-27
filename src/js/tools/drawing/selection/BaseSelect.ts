module pskl {
    export module tools {
        export module drawing {
            export module selection {
                export abstract class BaseSelect extends BaseTool {
                    secondaryToolId: string;
                    startCol: any;
                    startRow: any;
                    lastMoveCol: any;
                    lastMoveRow: any;
                    selection: any;
                    hasSelection: boolean;
                    mode: string;
                    isMovingContent_: any;

                    constructor() {
                        super();

                        this.secondaryToolId = pskl.tools.drawing.Move.TOOL_ID;

                        // Select's first point coordinates (set in applyToolAt)
                        this.startCol = null;
                        this.startRow = null;

                        this.lastMoveCol = null;
                        this.lastMoveRow = null;

                        this.selection = null;
                        this.hasSelection = false;

                        this.tooltipDescriptors = [
                            { description: 'Drag the selection to move it. You may switch to other layers and frames.' },
                            { key: 'ctrl+c', description: 'Copy the selected area' },
                            { key: 'ctrl+v', description: 'Paste the copied area' },
                            { key: 'shift', description: 'Hold to move the content' }
                        ];

                        $.subscribe(Events.SELECTION_DISMISSED, this.onSelectionDismissed_.bind(this));
                    }

                    /**
                     * @override
                     */
                    applyToolAt(col, row, frame, overlay, event) {
                        this.startCol = col;
                        this.startRow = row;

                        this.lastMoveCol = col;
                        this.lastMoveRow = row;

                        // The select tool can be in two different state.
                        // If the initial click of the tool is not on a selection, we go in 'select'
                        // mode to create a selection.
                        // If the initial click is on a previous selection, we go in 'moveSelection'
                        // mode to allow to move the selection by drag'n dropping it.
                        if (!this.isInSelection(col, row)) {
                            this.mode = 'select';
                            this.onSelectStart_(col, row, frame, overlay);
                        } else {
                            this.mode = 'moveSelection';
                            if (event.shiftKey && !this.isMovingContent_) {
                                this.isMovingContent_ = true;
                                $.publish(Events.CLIPBOARD_CUT);
                                this.drawSelectionOnOverlay_(overlay);
                            }
                            this.onSelectionMoveStart_(col, row, frame, overlay);
                        }
                    };

                    /**
                     * @override
                     */
                    moveToolAt(col, row, frame, overlay, event) {
                        if (this.mode == 'select') {
                            this.onSelect_(col, row, frame, overlay);
                        } else if (this.mode == 'moveSelection') {
                            this.onSelectionMove_(col, row, frame, overlay);
                        }
                    };

                    /**
                     * @override
                     */
                    releaseToolAt(col, row, frame, overlay, event) {
                        if (this.mode == 'select') {
                            this.onSelectEnd_(col, row, frame, overlay);
                        } else if (this.mode == 'moveSelection') {
                            this.onSelectionMoveEnd_(col, row, frame, overlay);
                        }
                    };

                    /**
                     * If we mouseover the selection draw inside the overlay frame, show the 'move' cursor
                     * instead of the 'select' one. It indicates that we can move the selection by dragndroping it.
                     * @override
                     */
                    moveUnactiveToolAt(col, row, frame, overlay, event) {
                        if (overlay.containsPixel(col, row)) {
                            if (this.isInSelection(col, row)) {
                                // We're hovering the selection, show the move tool:
                                document.body.classList.add(this.secondaryToolId);
                                document.body.classList.remove(this.toolId);
                            } else {
                                // We're not hovering the selection, show create selection tool:
                                document.body.classList.add(this.toolId);
                                document.body.classList.remove(this.secondaryToolId);
                            }
                        }

                        if (!this.hasSelection) {
                            pskl.tools.drawing.BaseTool.prototype.moveUnactiveToolAt.apply(this, arguments);
                        }
                    };

                    isInSelection(col, row) {
                        return this.selection && this.selection.pixels.some(function (pixel) {
                            return pixel.col === col && pixel.row === row;
                        });
                    };

                    /**
                     * Protected method, should be called when the selection is committed,
                     * typically by clicking outside of the selected area.
                     */
                    commitSelection() {
                        if (this.isMovingContent_) {
                            $.publish(Events.CLIPBOARD_PASTE);
                            this.isMovingContent_ = false;
                        }

                        // Clean previous selection:
                        $.publish(Events.SELECTION_DISMISSED);
                    };

                    /**
                     * Protected method, should be called when the selection is dismissed.
                     */
                    onSelectionDismissed_() {
                        var overlay = pskl.app.drawingController.overlayFrame;
                        overlay.clear();
                        this.hasSelection = false;
                    };

                    /**
                     * For each pixel in the selection draw it in white transparent on the tool overlay
                     * @protected
                     */
                    drawSelectionOnOverlay_(overlay) {
                        var pixels = this.selection.pixels;
                        for (var i = 0, l = pixels.length; i < l; i++) {
                            var pixel = pixels[i];
                            var hasColor = pixel.color && pixel.color !== Constants.TRANSPARENT_COLOR;
                            var color = hasColor ? this.getTransparentVariant_(pixel.color) : Constants.SELECTION_TRANSPARENT_COLOR;

                            overlay.setPixel(pixels[i].col, pixels[i].row, color);
                        }
                    }

                    getTransparentVariant_ = pskl.utils.FunctionUtils.memo(function (colorStr) {
                        var color = window.tinycolor(colorStr);
                        color = window.tinycolor.lighten(color, 10);
                        color.setAlpha(0.5);
                        return color.toRgbString();
                    }, {}) as (color?) => any;

                    // The list of callbacks to implement by specialized tools to implement the selection creation behavior.
                    /** @protected */
                    abstract onSelectStart_(col, row, frame, overlay);
                    /** @protected */
                    abstract onSelect_(col, row, frame, overlay);
                    /** @protected */
                    abstract onSelectEnd_(col, row, frame, overlay);

                    // The list of callbacks that define the drag'n drop behavior of the selection.
                    /** @private */

                    abstract onSelectionMoveStart_(col, row, frame, overlay);

                    /** @private */
                    private onSelectionMove_(col, row, frame, overlay) {
                        var deltaCol = col - this.lastMoveCol;
                        var deltaRow = row - this.lastMoveRow;

                        var colDiff = col - this.startCol;
                        var rowDiff = row - this.startRow;

                        this.selection.move(deltaCol, deltaRow);

                        overlay.clear();
                        this.drawSelectionOnOverlay_(overlay);

                        this.lastMoveCol = col;
                        this.lastMoveRow = row;
                    };

                    /** @private */
                    private onSelectionMoveEnd_(col, row, frame, overlay) {
                        this.onSelectionMove_(col, row, frame, overlay);
                    };
                }
            }
        }
    }
}