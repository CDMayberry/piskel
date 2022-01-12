module pskl {
    export module tools {
        export module drawing {
            export abstract class BaseTool extends Tool {
                highlightedPixelCol: any;
                highlightedPixelRow: any;
                shortcut: service.keyboard.Shortcut;

                constructor() {
                    super();
                    this.toolId = 'tool-base';
                }

                applyToolAt(col, row, frame, overlay, event) { }

                moveToolAt(col, row, frame, overlay, event) { }

                abstract replay(frame, replayData);

                supportsDynamicPenSize() {
                    return false;
                }

                getToolColor() {
                    if (pskl.app.mouseStateService.isRightButtonPressed()) {
                        return pskl.app.selectedColorsService.getSecondaryColor();
                    }
                    return pskl.app.selectedColorsService.getPrimaryColor();
                }

                moveUnactiveToolAt(col, row, frame, overlay, event) {
                    if (overlay.containsPixel(col, row)) {
                        this.updateHighlightedPixel(frame, overlay, col, row);
                    } else {
                        this.hideHighlightedPixel(overlay);
                    }
                }

                updateHighlightedPixel(frame, overlay, col, row) {
                    if (!isNaN(this.highlightedPixelCol) &&
                        !isNaN(this.highlightedPixelRow) &&
                        (this.highlightedPixelRow != row ||
                            this.highlightedPixelCol != col)) {

                        // Clean the previously highlighted pixel:
                        overlay.clear();
                    }

                    var frameColor = pskl.utils.intToColor(frame.getPixel(col, row));
                    var highlightColor = this.getHighlightColor_(frameColor);
                    var size = this.supportsDynamicPenSize() ? pskl.app.penSizeService.getPenSize() : 1;
                    pskl.PixelUtils.resizePixel(col, row, size).forEach(function (point) {
                        overlay.setPixel(point[0], point[1], highlightColor);
                    });

                    this.highlightedPixelCol = col;
                    this.highlightedPixelRow = row;
                }

                getHighlightColor_(frameColor) {
                    if (!frameColor) {
                        return Constants.TOOL_HIGHLIGHT_COLOR_DARK;
                    }

                    var luminance = window.tinycolor(frameColor).toHsl().l;
                    if (luminance > 0.5) {
                        return Constants.TOOL_HIGHLIGHT_COLOR_DARK;
                    } else {
                        return Constants.TOOL_HIGHLIGHT_COLOR_LIGHT;
                    }
                }

                hideHighlightedPixel(overlay) {
                    if (this.highlightedPixelRow !== null && this.highlightedPixelCol !== null) {
                        overlay.clear();
                        this.highlightedPixelRow = null;
                        this.highlightedPixelCol = null;
                    }
                }

                releaseToolAt(col, row, frame, overlay, event) { }

                /**
                 * Does the tool support the ALT modifier. To be overridden by subclasses.
                 *
                 * @return {Boolean} true if the tool supports ALT.
                 */
                supportsAlt() {
                    return false;
                }
            }
        }
    }
}