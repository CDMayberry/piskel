module pskl {
    export module tools {
        export module drawing {
            export class ColorPicker extends BaseTool {
                constructor() {
                    super();

                    this.toolId = 'tool-colorpicker';
                    this.helpText = 'Color picker';
                    this.shortcut = pskl.service.keyboard.Shortcuts.TOOL.COLORPICKER;
                }

                // Was not implemented in js?
                replay(frame: any, replayData: any) {
                    throw new Error("Method not implemented.");
                }

                applyToolAt(col, row, frame, overlay, event) {
                    if (frame.containsPixel(col, row)) {
                        var sampledColor = pskl.utils.intToColor(frame.getPixel(col, row));
                        if (pskl.app.mouseStateService.isLeftButtonPressed()) {
                            $.publish(Events.SELECT_PRIMARY_COLOR, [sampledColor]);
                        } else if (pskl.app.mouseStateService.isRightButtonPressed()) {
                            $.publish(Events.SELECT_SECONDARY_COLOR, [sampledColor]);
                        }
                    }
                }
            }
        }
    }
}