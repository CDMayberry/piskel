module pskl {
    export module tools {
        export module transform {
            export class Clone extends AbstractTransformTool {
                constructor() {
                    super();
                    
                    this.toolId = 'tool-clone';
                    this.helpText = 'Clone current layer to all frames';
                    this.tooltipDescriptors = [];
                }

                applyTool_(altKey, allFrames, allLayers) {
                    var ref = pskl.app.piskelController.getCurrentFrame();
                    var layer = pskl.app.piskelController.getCurrentLayer();
                    layer.getFrames().forEach(function (frame) {
                        if (frame !== ref) {
                            frame.setPixels(ref.getPixels());
                        }
                    });
                }
            }
        }
    }
}