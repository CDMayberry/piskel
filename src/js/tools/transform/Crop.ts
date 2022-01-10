module pskl {
    export module tools {
        export module transform {
            export class Crop extends Tool {
                constructor() {
                    super();

                    this.toolId = 'tool-crop';
                    this.helpText = 'Crop the sprite';
                    this.tooltipDescriptors = [
                        {
                            description: 'Crop to fit the content or the selection. ' +
                                'Applies to all frames and layers!'
                        }
                    ];
                }

                applyTransformation (evt) {
                    var frames = this.getFrames_();
            
                    var boundaries;
                    if (pskl.app.selectionManager.currentSelection) {
                        // If we have a selection, we will compute the boundaries of the selection instead
                        // of looping on the frames.
                        boundaries = this.getBoundariesForSelection_();
                    } else {
                        boundaries = pskl.tools.transform.TransformUtils.getBoundaries(frames);
                    }
            
                    var applied = this.applyTool_(frames, boundaries);
                    if (applied) {
                        this.raiseSaveStateEvent({
                            boundaries: boundaries
                        });
                    }
                }

                replay (frame, replayData) {
                    var frames = this.getFrames_();
                    this.applyTool_(frames, replayData.boundaries);
                }

                applyTool_ (frames, boundaries) {
                    if (boundaries.minx >= boundaries.maxx) {
                        return false;
                    }
            
                    var currentPiskel = pskl.app.piskelController.getPiskel();
                    var width = 1 + boundaries.maxx - boundaries.minx;
                    var height = 1 + boundaries.maxy - boundaries.miny;
            
                    if (width === currentPiskel.getWidth() && height === currentPiskel.getHeight()) {
                        // Do not perform an unnecessary resize if it's a noop.
                        return false;
                    }
            
                    frames.forEach(function (frame) {
                        pskl.tools.transform.TransformUtils.moveFramePixels(frame, -boundaries.minx, -boundaries.miny);
                    });
            
                    var piskel = pskl.utils.ResizeUtils.resizePiskel(currentPiskel, {
                        width: 1 + boundaries.maxx - boundaries.minx,
                        height: 1 + boundaries.maxy - boundaries.miny,
                        origin: 'TOP-LEFT',
                        resizeContent: false
                    });
            
                    // Clear the current selection.
                    $.publish(Events.SELECTION_DISMISSED);
            
                    // Replace the current piskel with the resized version.
                    pskl.app.piskelController.setPiskel(piskel, {
                        preserveState: true,
                        // Saving is already handled by recording the transform tool action, no need for
                        // an expensive snapshot.
                        noSnapshot: true
                    });
            
                    return true;
                }

                getFrames_ () {
                    var currentPiskel = pskl.app.piskelController.getPiskel();
            
                    // Get all frames in a single array.
                    var frames = currentPiskel.getLayers().map(function (l) {
                        return l.getFrames();
                    }).reduce(function (p, n) {
                        return p.concat(n);
                    });
            
                    return frames;
                }

                getBoundariesForSelection_ () {
                    var selectionManager = pskl.app.selectionManager;
                    var pixels = selectionManager.currentSelection.pixels;
            
                    // Fetch the first frame to perform out-of-bound checks.
                    var currentPiskel = pskl.app.piskelController.getPiskel();
                    var exampleFrame = currentPiskel.getLayerAt(0).getFrameAt(0);
            
                    // Anything different from Constants.TRANSPARENT_COLOR toInt().
                    var FAKE_COLOR = 1;
                    // Create a fake frame reimplementing the forEachPixel API.
                    var selectionFrame = {
                        forEachPixel: function (callback) {
                            for (var i = 0; i < pixels.length; i++) {
                                var pixel = pixels[i];
                                // Selections might contain out of bound pixels, filter those out.
                                if (exampleFrame.containsPixel(pixel.col, pixel.row)) {
                                    callback(FAKE_COLOR, pixel.col, pixel.row);
                                }
                            }
                        }
                    };
            
                    return pskl.tools.transform.TransformUtils.getBoundaries([selectionFrame]);
                }
            }
        }
    }
}