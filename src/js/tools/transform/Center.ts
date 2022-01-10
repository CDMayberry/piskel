module pskl {
    export module tools {
        export module transform {
            export class Center extends AbstractTransformTool {
                constructor() {
                    super();

                    this.toolId = 'tool-center';
                    this.helpText = 'Align image to the center';
                    this.tooltipDescriptors = [
                        { key: 'ctrl', description: 'Apply to all layers' },
                        { key: 'shift', description: 'Apply to all frames' }
                    ];
                }

                applyToolOnFrame_(frame) {
                    TransformUtils.center(frame);
                }
            }
        }
    }
}