module pskl {
    export module tools {
        export module drawing {
            export class VerticalMirrorPen extends SimplePen {
                constructor() {
                    super();

                    this.toolId = 'tool-vertical-mirror-pen';
                    this.helpText = 'Vertical Mirror pen';
                    this.shortcut = pskl.service.keyboard.Shortcuts.TOOL.MIRROR_PEN;

                    this.tooltipDescriptors = [
                        { key: 'ctrl', description: 'Use horizontal axis' },
                        { key: 'shift', description: 'Use horizontal and vertical axis' }
                    ]
                }
                /**
 * @override
 */
                applyToolAt(col, row, frame, overlay, event) {
                    var color = this.getToolColor();
                    this.drawUsingPenSize(color, col, row, frame, overlay);

                    var mirroredCol = this.getSymmetricCol_(col, frame);
                    var mirroredRow = this.getSymmetricRow_(row, frame);

                    var hasCtrlKey = pskl.utils.UserAgent.isMac ? event.metaKey : event.ctrlKey;
                    if (!hasCtrlKey) {
                        this.drawUsingPenSize(color, mirroredCol, row, frame, overlay);
                    }

                    if (event.shiftKey || hasCtrlKey) {
                        this.drawUsingPenSize(color, col, mirroredRow, frame, overlay);
                    }

                    if (event.shiftKey) {
                        this.drawUsingPenSize(color, mirroredCol, mirroredRow, frame, overlay);
                    }

                    this.previousCol = col;
                    this.previousRow = row;
                };

                getSymmetricCol_(col, frame) {
                    return frame.getWidth() - col - this.getPenSizeOffset_();
                };

                getSymmetricRow_(row, frame) {
                    return frame.getHeight() - row - this.getPenSizeOffset_();
                };

                /**
                 * Depending on the pen size, the mirrored index need to have an offset of 1 pixel.
                 */
                getPenSizeOffset_(row?, frame?) {
                    return pskl.app.penSizeService.getPenSize() % 2;
                };
            }
        }
    }
}