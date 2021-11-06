module pskl {
    export module utils {
        export module serialization {
            export module backward {
                export class Deserializer_v1 {
                    callback_: any;
                    data_: any;

                    constructor(data, callback) {
                        this.callback_ = callback;
                        this.data_ = data;
                    }

                    deserialize() {
                        var piskelData = this.data_.piskel;
                        var descriptor = new pskl.model.piskel.Descriptor('Deserialized piskel', '');
                        var piskel = new pskl.model.Piskel(piskelData.width, piskelData.height, Constants.DEFAULT.FPS, descriptor);

                        piskelData.layers.forEach(function (serializedLayer) {
                            var layer = this.deserializeLayer(serializedLayer);
                            piskel.addLayer(layer);
                        }.bind(this));

                        this.callback_(piskel);
                    }

                    deserializeLayer(layerString) {
                        var layerData = JSON.parse(layerString);
                        var layer = new pskl.model.Layer(layerData.name);
                        layerData.frames.forEach(function (serializedFrame) {
                            var frame = this.deserializeFrame(serializedFrame);
                            layer.addFrame(frame);
                        }.bind(this));

                        return layer;
                    }

                    deserializeFrame = function (frameString) {
                        var framePixelGrid = JSON.parse(frameString);
                        return pskl.model.Frame.fromPixelGrid(framePixelGrid);
                    }
                }
            }
        }
    }
}