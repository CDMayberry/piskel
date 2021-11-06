module pskl {
    export module utils {
        export module serialization {
            export module backward {
                export class Deserializer_v0 {
                    data_: any;
                    callback_: any;

                    constructor(data, callback) {
                        this.data_ = data;
                        this.callback_ = callback;
                    }

                    deserialize() {
                        var pixelGrids = this.data_;
                        var frames = pixelGrids.map(function (grid) {
                            return pskl.model.Frame.fromPixelGrid(grid);
                        });
                        var descriptor = new pskl.model.piskel.Descriptor('Deserialized piskel', '');
                        var layer = pskl.model.Layer.fromFrames('Layer 1', frames);

                        this.callback_(pskl.model.Piskel.fromLayers([layer], Constants.DEFAULT.FPS, descriptor));
                    }
                }
            }
        }
    }
}
