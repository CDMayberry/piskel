module pskl {
    export module tools {
        export module drawing {
            export module selection {
                export class ShapeSelect extends BaseSelect {
                    constructor() {
                        super();

                        this.toolId = 'tool-shape-select';
                        this.helpText = 'Shape selection';
                        this.shortcut = pskl.service.keyboard.Shortcuts.TOOL.SHAPE_SELECT;
                    }

                    /**
                     * For the shape select tool, you just need to click one time to create a selection.
                     * So we just need to implement onSelectStart_ (no need for onSelect_ & onSelectEnd_)
                     * @override
                     */
                    onSelectStart_(col, row, frame, overlay) {
                        if (this.hasSelection) {
                            this.hasSelection = false;
                            this.commitSelection();
                        } else {
                            this.hasSelection = true;
                            // From the pixel clicked, get shape using an algorithm similar to the paintbucket one:
                            var pixels = pskl.PixelUtils.getSimilarConnectedPixelsFromFrame(frame, col, row);
                            this.selection = new pskl.selection.ShapeSelection(pixels);

                            $.publish(Events.SELECTION_CREATED, [this.selection]);
                            this.drawSelectionOnOverlay_(overlay);
                        }
                    }

                    onSelect_(col: any, row: any, frame: any, overlay: any) {
                        //throw new Error("Method not implemented.");
                    }
                    onSelectEnd_(col: any, row: any, frame: any, overlay: any) {
                        //throw new Error("Method not implemented.");
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