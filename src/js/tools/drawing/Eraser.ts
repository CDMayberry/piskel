module pskl {
    export module tools {
        export module drawing {
            export class Eraser extends SimplePen {
                constructor() {
                    super();

                    this.toolId = 'tool-eraser';
                    this.helpText = 'Eraser tool';
                    this.shortcut = pskl.service.keyboard.Shortcuts.TOOL.ERASER;
                }

                /**
                 * @override
                 */
                getToolColor() {
                    return Constants.TRANSPARENT_COLOR;
                };
            }
        }
    }
}