module pskl {
    export module tools {
        export module drawing {
            export module selection {
                export abstract class AbstractDragSelect extends BaseSelect {
                    constructor() {
                        super();
                    }

                    onSelectStart_(col, row, frame, overlay) {
                        if (this.hasSelection) {
                            this.hasSelection = false;
                            this.commitSelection();
                        } else {
                            this.hasSelection = true;
                            this.onDragSelectStart_(col, row);
                            overlay.setPixel(col, row, this.getTransparentVariant_(Constants.SELECTION_TRANSPARENT_COLOR));
                        }
                    }

                    /** @override */
                    onSelect_(col, row, frame, overlay) {
                        if (!this.hasSelection && (this.startCol !== col || this.startRow !== row)) {
                            this.hasSelection = true;
                            this.onDragSelectStart_(col, row);
                        }

                        if (this.hasSelection) {
                            this.onDragSelect_(col, row, frame, overlay);
                        }
                    }

                    /** @override */
                    onSelectEnd_(col, row, frame, overlay) {
                        if (this.hasSelection) {
                            this.onDragSelectEnd_(col, row, frame, overlay);
                        }
                    }

                    /** @private */
                    startDragSelection_(col, row, overlay) {
                        this.hasSelection = true;
                        this.onDragSelectStart_(col, row);
                        overlay.setPixel(col, row, this.getTransparentVariant_(Constants.SELECTION_TRANSPARENT_COLOR));
                    }

                    /** @protected */
                    abstract onDragSelectStart_(col, row, frame?, overlay?);
                    /** @protected */
                    abstract onDragSelect_(col, row, frame?, overlay?);
                    /** @protected */
                    abstract onDragSelectEnd_(col, row, frame?, overlay?);
                }
            }
        }
    }
}