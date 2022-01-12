module pskl {
    export module tools {
        export module drawing {
            export class PaintBucket extends BaseTool {
                constructor() {
                    super();

                    this.toolId = 'tool-paint-bucket';
                    this.helpText = 'Paint bucket tool';
                    this.shortcut = pskl.service.keyboard.Shortcuts.TOOL.PAINT_BUCKET;
                }

                /**
                 * @override
                 */
                applyToolAt(col, row, frame, overlay, event) {
                    var color = this.getToolColor();
                    pskl.PixelUtils.paintSimilarConnectedPixelsFromFrame(frame, col, row, color);

                    this.raiseSaveStateEvent({
                        col: col,
                        row: row,
                        color: color
                    });
                }

                replay(frame, replayData) {
                    pskl.PixelUtils.paintSimilarConnectedPixelsFromFrame(frame, replayData.col, replayData.row, replayData.color);
                }
            }
        }
    }
}