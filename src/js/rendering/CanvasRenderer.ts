(function () {

    var ns = $.namespace('pskl.rendering');
    ns.CanvasRenderer = function (frame, zoom) {
        this.frame = frame;
        this.zoom = zoom;
        this.opacity_ = 1;
        this.transparentColor_ = 'white';
    };

    /**
     * Decide which color should be used to represent transparent pixels
     * Default : white
     * @param  {String} color the color to use either as '#ABCDEF' or 'red' or 'rgb(x,y,z)' or 'rgba(x,y,z,a)'
     */
    ns.CanvasRenderer.prototype.drawTransparentAs = function (color) {
        this.transparentColor_ = color;
    };

    ns.CanvasRenderer.prototype.setOpacity = function (opacity) {
        this.opacity_ = opacity;
    };

    ns.CanvasRenderer.prototype.render = function () {
        var canvas = this.createCanvas_();

        // Draw in canvas
        pskl.utils.FrameUtils.drawToCanvas(this.frame, canvas, this.transparentColor_, this.opacity_);

        var scaledCanvas = this.createCanvas_(this.zoom);
        var scaledContext = scaledCanvas.getContext('2d');
        pskl.utils.CanvasUtils.disableImageSmoothing(scaledCanvas);
        scaledContext.scale(this.zoom, this.zoom);
        scaledContext.drawImage(canvas, 0, 0);

        return scaledCanvas;
    };

    ns.CanvasRenderer.prototype.createCanvas_ = function (zoom) {
        zoom = zoom || 1;
        var width = this.frame.getWidth() * zoom;
        var height = this.frame.getHeight() * zoom;
        return pskl.utils.CanvasUtils.createCanvas(width, height);
    };
})();

module pskl {
    export module rendering {
        export class CanvasRenderer {
            frame: pskl.model.Frame;
            zoom: number;
            opacity_: number;
            transparentColor_: string;

            constructor(frame, zoom) {
                this.frame = frame;
                this.zoom = zoom;
                this.opacity_ = 1;
                this.transparentColor_ = 'white';
            }

            /**
             * Decide which color should be used to represent transparent pixels
             * Default : white
             * @param  {String} color the color to use either as '#ABCDEF' or 'red' or 'rgb(x,y,z)' or 'rgba(x,y,z,a)'
             */
            drawTransparentAs(color) {
                this.transparentColor_ = color;
            }

            setOpacity(opacity) {
                this.opacity_ = opacity;
            }

            render() {
                var canvas = this.createCanvas_();

                // Draw in canvas
                pskl.utils.FrameUtils.drawToCanvas(this.frame, canvas, this.transparentColor_, this.opacity_);

                var scaledCanvas = this.createCanvas_(this.zoom);
                var scaledContext = scaledCanvas.getContext('2d');
                pskl.utils.CanvasUtils.disableImageSmoothing(scaledCanvas);
                scaledContext.scale(this.zoom, this.zoom);
                scaledContext.drawImage(canvas, 0, 0);

                return scaledCanvas;
            }

            createCanvas_(zoom: number = 1) {
                var width = this.frame.getWidth() * zoom;
                var height = this.frame.getHeight() * zoom;
                return pskl.utils.CanvasUtils.createCanvas(width, height);
            }
        }
    }
}