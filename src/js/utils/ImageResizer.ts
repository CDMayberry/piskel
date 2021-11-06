module pskl {
    export module utils {
        export module ImageResizer {
            export function scale(image, factor, smoothingEnabled) {
                resize(image, image.width * factor, image.height * factor, smoothingEnabled);
            }

            export function resize(image, targetWidth, targetHeight, smoothingEnabled) {
                var canvas = pskl.utils.CanvasUtils.createCanvas(targetWidth, targetHeight);
                var context = canvas.getContext('2d');
                context.save();

                if (!smoothingEnabled) {
                    pskl.utils.CanvasUtils.disableImageSmoothing(canvas);
                }

                context.translate(canvas.width / 2, canvas.height / 2);
                context.scale(targetWidth / image.width, targetHeight / image.height);
                context.drawImage(image, -image.width / 2, -image.height / 2);
                context.restore();

                return canvas;
            }
        }
    }
}