module pskl {
    export module model {
        export class Piskel {
            layers: any[];
            width: any;
            height: any;
            descriptor: any;
            savePath: any;
            fps: any;
            hiddenFrames: any[];

            constructor(width, height, fps, descriptor) {
                if (width && height && descriptor) {
                    this.layers = [];
                    this.width = width;
                    this.height = height;
                    this.descriptor = descriptor;
                    this.savePath = null;
                    this.fps = fps;
                    this.hiddenFrames = [];
                } else {
                    throw 'Missing arguments in Piskel constructor: ' + Array.prototype.join.call(arguments, ',');
                }
            }

            static fromLayers(layers, fps, descriptor) {
                var piskel = null;
                if (layers.length > 0 && layers[0].size() > 0) {
                    var sampleFrame = layers[0].getFrameAt(0);
                    piskel = new pskl.model.Piskel(sampleFrame.getWidth(), sampleFrame.getHeight(), fps, descriptor);
                    layers.forEach(piskel.addLayer.bind(piskel));
                } else {
                    throw 'Piskel.fromLayers expects array of non empty pskl.model.Layer as first argument';
                }
                return piskel;
            }

            getLayers () {
                return this.layers;
            };
        
            getHeight () {
                return this.height;
            };
        
            getWidth () {
                return this.width;
            };
        
            getFPS () {
                return this.fps;
            };
        
            getLayerAt (index) {
                return this.layers[index];
            };
        
            getLayersByName (name) {
                return this.layers.filter(function (l) {
                    return l.getName() == name;
                });
            };
        
            getFrameCount () {
                return this.getLayerAt(0).size();
            };
        
            addLayer (layer) {
                this.layers.push(layer);
            };
        
            addLayerAt (layer, index) {
                this.layers.splice(index, 0, layer);
            };
        
            moveLayerUp (layer, toTop) {
                var index = this.layers.indexOf(layer);
                var toIndex = toTop ? this.layers.length - 1 : index + 1;
                this.moveLayer_(index, toIndex);
            };
        
            moveLayerDown (layer, toBottom) {
                var index = this.layers.indexOf(layer);
                var toIndex = toBottom ? 0 : index - 1;
                this.moveLayer_(index, toIndex);
            };

            /**
             * Move the layer at the provided index to the provided toIndex.
             */
            moveLayer_ (fromIndex, toIndex) {
                if (fromIndex == -1 || toIndex == -1 || fromIndex == toIndex) {
                    return;
                }
                toIndex = pskl.utils.math.minmax(toIndex, 0, this.layers.length - 1);
                var layer = this.layers.splice(fromIndex, 1)[0];
                this.layers.splice(toIndex, 0, layer);
            };
        
            removeLayer (layer) {
                var index = this.layers.indexOf(layer);
                if (index != -1) {
                    this.layers.splice(index, 1);
                }
            };
        
            removeLayerAt (index) {
                this.layers.splice(index, 1);
            };
        
            getDescriptor () {
                return this.descriptor;
            };
        
            setDescriptor (descriptor) {
                this.descriptor = descriptor;
                $.publish(Events.PISKEL_DESCRIPTOR_UPDATED);
            };
        
            setName (name) {
                this.descriptor.name = name;
                $.publish(Events.PISKEL_DESCRIPTOR_UPDATED);
            };
        
            getHash () {
                return this.layers.map(layer => layer.getHash()).join('-');
            };
        }
    }
}