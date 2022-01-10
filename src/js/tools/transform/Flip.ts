module pskl {
    export module tools {
        export module transform {
            export class Flip extends AbstractTransformTool {
                constructor() {
                    super();

                    this.toolId = 'tool-flip';
                    this.helpText = 'Flip horizontally';
                    this.tooltipDescriptors = [
                        { key: 'alt', description: 'Flip vertically' },
                        { key: 'ctrl', description: 'Apply to all layers' },
                        { key: 'shift', description: 'Apply to all frames' }
                    ];
                }

                applyToolOnFrame_(frame, altKey) {
                    var axis;

                    if (altKey) {
                        axis = TransformUtils.HORIZONTAL;
                    } else {
                        axis = TransformUtils.VERTICAL;
                    }

                    TransformUtils.flip(frame, axis);
                }
            }
        }
    }
}