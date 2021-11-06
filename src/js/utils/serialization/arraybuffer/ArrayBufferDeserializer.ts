module pskl {
    export module utils {
        export module serialization {
            export module arraybuffer {
                // TODO: Someday shift to just Deserializer, arraybuffer is already in the name of the parent namespace.
                export module ArrayBufferDeserializer {
                    export function deserialize(data, callback) {
                        var i;
                        var j;
                        var buffer = data;
                        var arr8 = new Uint8Array(buffer);
                        var arr16 = new Uint16Array(arr8.buffer);
                        var sub;

                        /********/
                        /* META */
                        /********/
                        // Piskel meta
                        var modelVersion = arr16[0];
                        var width = arr16[1];
                        var height = arr16[2];
                        var fps = arr16[3];

                        // Descriptor meta
                        var descriptorNameLength = arr16[4];
                        var descriptorDescriptionLength = arr16[5];

                        // Layers meta
                        var layerCount = arr16[6];

                        // Layers meta
                        var serializedHiddenFramesLength = arr16[7];

                        var currentIndex = 8;
                        /********/
                        /* DATA */
                        /********/
                        // Descriptor name
                        var descriptorName = '';
                        for (i = 0; i < descriptorNameLength; i++) {
                            descriptorName += String.fromCharCode(arr16[currentIndex + i]);
                        }
                        currentIndex += descriptorNameLength;

                        // Descriptor description
                        var descriptorDescription = '';
                        for (i = 0; i < descriptorDescriptionLength; i++) {
                            descriptorDescription = String.fromCharCode(arr16[8 + descriptorNameLength + i]);
                        }
                        currentIndex += descriptorDescriptionLength;

                        // Hidden frames
                        var serializedHiddenFrames = '';
                        for (i = 0; i < serializedHiddenFramesLength; i++) {
                            serializedHiddenFrames = String.fromCharCode(arr16[8 + descriptorNameLength + i]);
                        }
                        var hiddenFrames = serializedHiddenFrames.split('-');
                        currentIndex += serializedHiddenFramesLength;

                        // Layers
                        var layers = [];
                        var layer;
                        for (i = 0; i < layerCount; i++) {
                            layer = {};
                            var frames = [];

                            // Meta
                            var layerNameLength = arr16[currentIndex];
                            var opacity = arr16[currentIndex + 1] / 65535;
                            var frameCount = arr16[currentIndex + 2];
                            var dataUriLengthFirstHalf = arr16[currentIndex + 3];
                            var dataUriLengthSecondHalf = arr16[currentIndex + 4];
                            var dataUriLength = (dataUriLengthSecondHalf >>> 0) | (dataUriLengthFirstHalf << 16 >>> 0);

                            // Name
                            var layerName = '';
                            for (j = 0; j < layerNameLength; j++) {
                                layerName += String.fromCharCode(arr16[currentIndex + 5 + j]);
                            }

                            // Data URI
                            var dataUri = '';
                            for (j = 0; j < dataUriLength; j++) {
                                dataUri += String.fromCharCode(arr8[(currentIndex + 5 + layerNameLength) * 2 + j]);
                            }
                            dataUri = 'data:image/png;base64,' + dataUri;

                            currentIndex += Math.ceil(5 + layerNameLength + (dataUriLength / 2));

                            layer.name = layerName;
                            layer.opacity = opacity;
                            layer.frameCount = frameCount;
                            layer.dataUri = dataUri;
                            layers.push(layer);
                        }

                        var descriptor = new pskl.model.piskel.Descriptor(descriptorName, descriptorDescription);
                        var piskel = new pskl.model.Piskel(width, height, fps, descriptor);
                        piskel.hiddenFrames = hiddenFrames;
                        var loadedLayers = 0;

                        var loadLayerImage = function (layer, cb) {
                            var image = new Image();
                            image.onload = function () {
                                var frames = pskl.utils.FrameUtils.createFramesFromSpritesheet(this, layer.frameCount);
                                frames.forEach(function (frame) {
                                    layer.model.addFrame(frame);
                                });

                                loadedLayers++;
                                if (loadedLayers == layerCount) {
                                    cb(piskel);
                                }
                            };
                            image.src = layer.dataUri;
                        };

                        for (i = 0; i < layerCount; i++) {
                            layer = layers[i];
                            var nlayer = new pskl.model.Layer(layer.name);
                            layer.model = nlayer;
                            nlayer.setOpacity(layer.opacity);
                            piskel.addLayer(nlayer);

                            loadLayerImage.bind(this, layer, callback)();
                        }
                    }
                }
            }
        }
    }
}