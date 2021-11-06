module pskl {
    export module model {
        export class Layer {
            name: any;
            frames: any[];
            opacity: number;

            constructor(name) {
                if (!name) {
                    throw 'Invalid arguments in Layer constructor : \'name\' is mandatory';
                }

                this.name = name;
                this.frames = [];
                this.opacity = 1;
            }

            static fromFrames(name, frames) {
                var layer = new Layer(name);
                frames.forEach(layer.addFrame.bind(layer));
                return layer;
            }

            getName() {
                return this.name;
            };

            setName(name) {
                this.name = name;
            };

            getOpacity() {
                return this.opacity;
            };

            setOpacity(opacity) {
                if (typeof opacity == 'string') {
                    opacity = parseFloat(opacity);
                }
                if (opacity === null || isNaN(opacity) || opacity < 0 || opacity > 1) {
                    return;
                }
                this.opacity = +opacity.toFixed(3);
            };

            isTransparent() {
                return this.opacity < 1;
            };

            getFrames() {
                return this.frames;
            };

            getFrameAt(index) {
                return this.frames[index];
            };

            addFrame(frame) {
                this.frames.push(frame);
            };

            addFrameAt(frame, index) {
                this.frames.splice(index, 0, frame);
            };

            removeFrame(frame) {
                var index = this.frames.indexOf(frame);
                this.removeFrameAt(index);
            };

            removeFrameAt(index) {
                if (this.frames[index]) {
                    this.frames.splice(index, 1);
                } else {
                    console.error('Invalid index in removeFrameAt : %s (size : %s)', index, this.size());
                }
            };

            moveFrame(fromIndex, toIndex) {
                var frame = this.frames.splice(fromIndex, 1)[0];
                this.frames.splice(toIndex, 0, frame);
            };

            swapFramesAt(fromIndex, toIndex) {
                var fromFrame = this.frames[fromIndex];
                var toFrame = this.frames[toIndex];
                if (fromFrame && toFrame) {
                    this.frames[toIndex] = fromFrame;
                    this.frames[fromIndex] = toFrame;
                } else {
                    console.error('Frame not found in moveFrameAt (from %s, to %s)', fromIndex, toIndex);
                }
            };

            duplicateFrame(frame) {
                var index = this.frames.indexOf(frame);
                this.duplicateFrameAt(index);
            };

            duplicateFrameAt(index) {
                var frame = this.frames[index];
                if (frame) {
                    var clone = frame.clone();
                    this.addFrameAt(clone, index);
                } else {
                    console.error('Frame not found in duplicateFrameAt (at %s)', index);
                }
            };

            size() {
                return this.frames.length;
            };

            getHash() {
                return this.frames.map(frame => frame.getHash()).join('-');
            };
        }
    }
}