module pskl {
    export module tools {
        export module transform {
            export class AbstractTransformTool extends Tool {
                applyTransformation(evt) {
                    var allFrames = evt.shiftKey;
                    var allLayers = pskl.utils.UserAgent.isMac ? evt.metaKey : evt.ctrlKey;

                    this.applyTool_(evt.altKey, allFrames, allLayers);

                    $.publish(Events.PISKEL_RESET);

                    this.raiseSaveStateEvent({
                        altKey: evt.altKey,
                        allFrames: allFrames,
                        allLayers: allLayers
                    });
                }

                applyTool_ (altKey, allFrames, allLayers) {
                    var currentFrameIndex = pskl.app.piskelController.getCurrentFrameIndex();
                    var layers = allLayers ? pskl.app.piskelController.getLayers() : [pskl.app.piskelController.getCurrentLayer()];
                    layers.forEach(function (layer) {
                        var frames = allFrames ? layer.getFrames() : [layer.getFrameAt(currentFrameIndex)];
                        frames.forEach(function (frame) {
                            this.applyToolOnFrame_(frame, altKey);
                        }.bind(this));
                    }.bind(this));
                }

                replay (frame, replayData) {
                    this.applyTool_(replayData.altKey, replayData.allFrames, replayData.allLayers);
                }
            }
        }
    }
}