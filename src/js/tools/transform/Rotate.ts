
module pskl {
    export module tools {
        export module transform {
            export class Rotate extends AbstractTransformTool {
                toolId: string;
                helpText: string;
                tooltipDescriptors: { key: string; description: string; }[];

                constructor() {
                    super();

                    this.toolId = 'tool-rotate';
                    this.helpText = 'Counter-clockwise rotation';
                    this.tooltipDescriptors = [
                        { key: 'alt', description: 'Clockwise rotation' },
                        { key: 'ctrl', description: 'Apply to all layers' },
                        { key: 'shift', description: 'Apply to all frames' }];
                }

                applyToolOnFrame_ (frame, altKey) {
                    var direction;
            
                    if (altKey) {
                        direction = TransformUtils.CLOCKWISE;
                    } else {
                        direction = TransformUtils.COUNTERCLOCKWISE;
                    }
            
                    TransformUtils.rotate(frame, direction);
                }
            }
        }
    }
}