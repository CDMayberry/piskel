module pskl {
    export module rendering {
        export class PiskelRenderer {
            piskelController: any;
            frames: any[];

            constructor(piskelController) {
                var frames = [];
                for (var i = 0; i < piskelController.getFrameCount(); i++) {
                    frames.push(piskelController.renderFrameAt(i, true));
                }
                this.piskelController = piskelController;
                this.frames = frames;
            }

            renderAsCanvas(columns?: number) {
                columns = columns || this.frames.length;
                var rows = Math.ceil(this.frames.length / columns);

                var canvas = this.createCanvas_(columns, rows);

                for (var i = 0; i < this.frames.length; i++) {
                    var frame = this.frames[i];
                    var posX = (i % columns) * this.piskelController.getWidth();
                    var posY = Math.floor(i / columns) * this.piskelController.getHeight();
                    this.drawFrameInCanvas_(frame, canvas, posX, posY);
                }
                return canvas;
            }

            private drawFrameInCanvas_(frame, canvas, offsetWidth, offsetHeight) {
                var context = canvas.getContext('2d');
                context.drawImage(frame, offsetWidth, offsetHeight, frame.width, frame.height);
            }

            private createCanvas_(columns, rows) {
                var width = columns * this.piskelController.getWidth();
                var height = rows * this.piskelController.getHeight();
                return pskl.utils.CanvasUtils.createCanvas(width, height);
            }
        }
    }
}