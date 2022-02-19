module pskl {
    export module rendering {

        export class FramesheetRenderer {
            frames: pskl.model.Frame[];

            constructor(frames: pskl.model.Frame[]) {
                if (frames.length > 0) {
                    this.frames = frames;
                } else {
                    throw 'FramesheetRenderer : Invalid argument : frames is empty';
                }
            }

            renderAsCanvas(columns?: number) {
                columns = columns || this.frames.length;
                var rows = Math.ceil(this.frames.length / columns);

                var canvas = this.createCanvas_(columns, rows);

                for (var i = 0; i < this.frames.length; i++) {
                    var frame = this.frames[i];
                    var posX = (i % columns) * frame.getWidth();
                    var posY = Math.floor(i / columns) * frame.getHeight();
                    this.drawFrameInCanvas_(frame, canvas, posX, posY);
                }
                return canvas;
            }

            drawFrameInCanvas_(frame, canvas, offsetWidth, offsetHeight) {
                var context = canvas.getContext('2d');
                var imageData = context.createImageData(frame.getWidth(), frame.getHeight());
                var pixels = frame.getPixels();
                var data = new Uint8ClampedArray(pixels.buffer);
                imageData.data.set(data);
                context.putImageData(imageData, offsetWidth, offsetHeight);
            }

            createCanvas_(columns, rows) {
                var sampleFrame = this.frames[0];
                var width = columns * sampleFrame.getWidth();
                var height = rows * sampleFrame.getHeight();
                return pskl.utils.CanvasUtils.createCanvas(width, height);
            }
        }
    }
}