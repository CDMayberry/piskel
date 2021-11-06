/// <reference path="../../lib/q.d.ts" />

module pskl {
    export module utils {
        export module serialization {
            export class Deserializer {
                layersToLoad_: number;
                data_: any;
                callback_: any;
                piskel_: any;
                layers_: any[];
                hiddenFrames: any[];

                constructor(data, callback) {
                    this.layersToLoad_ = 0;
                    this.data_ = data;
                    this.callback_ = callback;
                    this.piskel_ = null;
                    this.layers_ = [];
                }

                static deserialize(data, onSuccess, onError) {
                    try {
                        var deserializer;
                        if (data.modelVersion == Constants.MODEL_VERSION) {
                            deserializer = new Deserializer(data, onSuccess);
                        } else if (data.modelVersion == 1) {
                            deserializer = new backward.Deserializer_v1(data, onSuccess);
                        } else {
                            deserializer = new backward.Deserializer_v0(data, onSuccess);
                        }
                        deserializer.deserialize();
                    } catch (e) {
                        console.error(e);
                        if (typeof onError === 'function') {
                            onError(e);
                        }
                    }
                }

                deserialize() {
                    var data = this.data_;
                    var piskelData = data.piskel;
                    var name = piskelData.name || 'Deserialized piskel';
                    var description = piskelData.description || '';
                    var fps = typeof piskelData.fps != 'undefined' ? piskelData.fps : 12;

                    var descriptor = new pskl.model.piskel.Descriptor(name, description);
                    this.piskel_ = new pskl.model.Piskel(piskelData.width, piskelData.height, fps, descriptor);
                    this.hiddenFrames = piskelData.hiddenFrames || [];

                    this.layersToLoad_ = piskelData.layers.length;
                    piskelData.layers.forEach(this.deserializeLayer.bind(this));
                }

                deserializeLayer(layerString, index) {
                    var layerData = JSON.parse(layerString);
                    var layer = new pskl.model.Layer(layerData.name);
                    layer.setOpacity(layerData.opacity);

                    // Backward compatibility: if the layerData is not chunked but contains a single base64PNG,
                    // create a fake chunk, expected to represent all frames side-by-side.
                    if (typeof layerData.chunks === 'undefined' && layerData.base64PNG) {
                        this.normalizeLayerData_(layerData);
                    }

                    var chunks = layerData.chunks;

                    // Prepare a frames array to store frame objects extracted from the chunks.
                    var frames = [];
                    Q.all(chunks.map(function (chunk) {
                        // Create a promise for each chunk.
                        var deferred = Q.defer();
                        var image = new Image();
                        // Load the chunk image in an Image object.
                        image.onload = function () {
                            // extract the chunkFrames from the chunk image
                            var chunkFrames = pskl.utils.FrameUtils.createFramesFromChunk(image, chunk.layout);
                            // add each image to the frames array, at the extracted index
                            chunkFrames.forEach(function (chunkFrame) {
                                frames[chunkFrame.index] = chunkFrame.frame;
                            });
                            deferred.resolve();
                        };
                        image.src = chunk.base64PNG;
                        return deferred.promise;
                    })).then(function () {
                        frames.forEach(function (frame) {
                            layer.addFrame(frame);
                        });
                        this.layers_[index] = layer;
                        this.onLayerLoaded_();
                    }.bind(this)).catch(function (error) {
                        console.error('Failed to deserialize layer');
                        console.error(error);
                    });

                    return layer;
                }

                onLayerLoaded_() {
                    this.layersToLoad_ = this.layersToLoad_ - 1;
                    if (this.layersToLoad_ === 0) {
                        this.layers_.forEach(function (layer) {
                            this.piskel_.addLayer(layer);
                        }.bind(this));
                        this.piskel_.hiddenFrames = this.hiddenFrames;
                        this.callback_(this.piskel_);
                    }
                }

                normalizeLayerData_ = function (layerData) {
                    var layout = [];
                    for (var i = 0; i < layerData.frameCount; i++) {
                        layout.push([i]);
                    }
                    layerData.chunks = [{
                        base64PNG: layerData.base64PNG,
                        layout: layout
                    }];
                }
            }
        }
    }
}