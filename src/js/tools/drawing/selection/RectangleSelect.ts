module pskl {
    export module tools {
        export module drawing {
            export module selection {
                export class RectangleSelect extends AbstractDragSelect {
                    constructor() {
                        super();
                        

                        this.toolId = 'tool-rectangle-select';
                        this.helpText = 'Rectangle selection';
                        this.shortcut = pskl.service.keyboard.Shortcuts.TOOL.RECTANGLE_SELECT;
                    }

                    /** @override */
                    onDragSelectStart_ (col, row) {
                        $.publish(Events.DRAG_START, [col, row]);
                    }

                    /**
                     * When creating the rectangle selection, we clear the current overlayFrame and
                     * redraw the current rectangle based on the origin coordinate and
                     * the current mouse coordinate in sprite.
                     * @override
                     */
                    onDragSelect_ (col, row, frame, overlay) {
                        overlay.clear();
                        this.selection = new pskl.selection.RectangularSelection(this.startCol, this.startRow, col, row);
                        $.publish(Events.SELECTION_CREATED, [this.selection]);
                        this.drawSelectionOnOverlay_(overlay);
                    }

                    /** @override */
                    onDragSelectEnd_ (col, row, frame, overlay) {
                        this.onSelect_(col, row, frame, overlay);
                        $.publish(Events.DRAG_END);
                    }

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