module pskl {
    export module utils {
        export module serialization {
            export module arraybuffer {
                export module ArrayBufferSerializer {
                    // I think there is a PR on the main repo for serializedHiddenFrames?
                    export function calculateRequiredBytes(piskel, framesData, serializedHiddenFrames?) {
                        var width = piskel.getWidth();
                        var height = piskel.getHeight();
                        var descriptorNameLength = piskel.getDescriptor().name.length;
                        var descriptorDescriptionLength = piskel.getDescriptor().description.length;
                        var layersLength = piskel.getLayers().length;

                        var bytes = 0;

                        /********/
                        /* META */
                        /********/
                        // Piskel meta
                        bytes += 4 * 2;

                        // Descriptor meta
                        bytes += 2 * 2;

                        // Layers meta
                        bytes += 1 * 2;

                        /********/
                        /* DATA */
                        /********/
                        // Descriptor name
                        bytes += descriptorNameLength * 2;

                        // Descriptor description
                        bytes += descriptorDescriptionLength * 2;

                        // Layers
                        for (var i = 0, layers = piskel.getLayers(); i < layers.length; i++) {
                            bytes += 5 * 2;
                            bytes += layers[i].name.length * 2;
                            bytes += framesData[i].length;
                            if (bytes % 2 == 1) {
                                bytes++;
                            }
                        }

                        return bytes;
                    }

                    export function serialize(piskel) {
                        var i;
                        var j;
                        var layers;
                        var dataUri;
                        var dataUriLength;

                        // Render frames
                        var framesData = [];
                        for (i = 0, layers = piskel.getLayers(); i < layers.length; i++) {
                            var renderer = new pskl.rendering.FramesheetRenderer(layers[i].getFrames());
                            dataUri = renderer.renderAsCanvas().toDataURL().split(',')[1];
                            dataUriLength = dataUri.length;
                            framesData.push({ uri: dataUri, length: dataUriLength });
                        }

                        var frames = pskl.app.piskelController.getLayerAt(0).getFrames();
                        var hiddenFrames = piskel.hiddenFrames;
                        var serializedHiddenFrames = hiddenFrames.join('-');

                        var bytes = calculateRequiredBytes(
                            piskel,
                            framesData,
                            serializedHiddenFrames
                        );

                        var buffer = new ArrayBuffer(bytes);
                        var arr8 = new Uint8Array(buffer);
                        var arr16 = new Uint16Array(buffer);

                        var width = piskel.getWidth();
                        var height = piskel.getHeight();
                        var descriptorName = piskel.getDescriptor().name;
                        var descriptorNameLength = descriptorName.length;
                        var descriptorDescription = piskel.getDescriptor().description;
                        var descriptorDescriptionLength = descriptorDescription.length;

                        /********/
                        /* META */
                        /********/
                        // Piskel meta
                        arr16[0] = Constants.MODEL_VERSION;
                        arr16[1] = width;
                        arr16[2] = height;
                        arr16[3] = pskl.app.piskelController.getFPS();

                        // Descriptor meta
                        arr16[4] = descriptorNameLength;
                        arr16[5] = descriptorDescriptionLength;

                        // Layers meta
                        arr16[6] = piskel.getLayers().length;

                        // Frames meta
                        arr16[7] = serializedHiddenFrames.length;

                        var currentIndex = 8;

                        /********/
                        /* DATA */
                        /********/
                        // Descriptor name
                        for (i = 0; i < descriptorNameLength; i++) {
                            arr16[currentIndex + i] = descriptorName.charCodeAt(i);
                        }
                        currentIndex = currentIndex + descriptorNameLength;

                        // Descriptor description
                        for (i = 0; i < descriptorDescriptionLength; i++) {
                            arr16[currentIndex + i] = descriptorDescription.charCodeAt(i);
                        }
                        currentIndex = currentIndex + descriptorDescriptionLength;

                        // Hidden frames
                        for (i = 0; i < serializedHiddenFrames.length; i++) {
                            arr16[currentIndex + i] = serializedHiddenFrames.charCodeAt(i);
                        }
                        currentIndex = currentIndex + serializedHiddenFrames.length;

                        // Layers
                        for (i = 0, layers = piskel.getLayers(); i < layers.length; i++) {
                            var layer = layers[i];
                            var frames = layer.getFrames();

                            var layerName = layer.getName();
                            var layerNameLength = layerName.length;
                            var opacity = layer.getOpacity();
                            var frameCount = frames.length;

                            dataUri = framesData[i].uri;
                            dataUriLength = framesData[i].length;

                            // Meta
                            arr16[currentIndex] = layerNameLength;
                            arr16[currentIndex + 1] = Math.floor(opacity * 65535);
                            arr16[currentIndex + 2] = frameCount;
                            arr16[currentIndex + 3] = ((dataUriLength & 0xffff0000) >> 16) >>> 0; // Upper 16
                            arr16[currentIndex + 4] = ((dataUriLength & 0x0000ffff)) >>> 0;       // Lower 16

                            // Name
                            for (j = 0; j < layerNameLength; j++) {
                                arr16[currentIndex + 5 + j] = layerName.charCodeAt(j);
                            }

                            // Data URI
                            for (j = 0; j < dataUriLength; j++) {
                                arr8[(currentIndex + 5 + layerNameLength) * 2 + j] = dataUri.charCodeAt(j);
                            }

                            currentIndex += Math.ceil(5 + layerNameLength + (dataUriLength / 2));
                        }

                        return buffer;
                    }
                }
            }
        }
    }
}