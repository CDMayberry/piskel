module pskl {
    export module rendering {
        export module frame {

            export class FrameRenderer extends AbstractRenderer {
                defaultRenderingOptions: { supportGridRendering: boolean; zoom: number; };
                container: any;
                zoom: number;
                offset: { x: number; y: number; };
                margin: { x: number; y: number; };
                supportGridRendering: any;
                classList: any[];
                canvas: any; // HTMLElement is missing things?
                displayCanvas: any; // HTMLElement is missing things?
                displayWidth: number;
                displayHeight: number;
                private gridWidth_: any;
                private gridSpacing_: any;

                constructor(container, renderingOptions, classList) {
                    super();

                    this.defaultRenderingOptions = {
                        'supportGridRendering': false,
                        'zoom': 1
                    };

                    renderingOptions = $.extend(true, {}, this.defaultRenderingOptions, renderingOptions);

                    if (container === undefined) {
                        throw 'Bad FrameRenderer initialization. <container> undefined.';
                    }

                    if (isNaN(renderingOptions.zoom)) {
                        throw 'Bad FrameRenderer initialization. <zoom> not well defined.';
                    }

                    this.container = container;

                    this.zoom = renderingOptions.zoom;

                    this.offset = {
                        x: 0,
                        y: 0
                    };

                    this.margin = {
                        x: 0,
                        y: 0
                    };

                    this.supportGridRendering = renderingOptions.supportGridRendering;

                    this.classList = classList || [];
                    this.classList.push('canvas');

                    /**
                     * Off dom canvas, will be used to draw the frame at 1:1 ratio
                     * @type {HTMLElement}
                     */
                    this.canvas = null;

                    /**
                     * Displayed canvas, scaled-up from the offdom canvas
                     * @type {HTMLElement}
                     */
                    this.displayCanvas = null;
                    this.setDisplaySize(renderingOptions.width, renderingOptions.height);

                    this.setGridWidth(this.getUserGridWidth_());
                    this.setGridSpacing(this.getUserGridSpacing_());

                    $.subscribe(Events.USER_SETTINGS_CHANGED, this.onUserSettingsChange_.bind(this));
                }


                render(frame) {
                    if (frame) {
                        this.clear();
                        this.renderFrame_(frame);
                    }
                }

                clear() {
                    pskl.utils.CanvasUtils.clear(this.canvas);
                    pskl.utils.CanvasUtils.clear(this.displayCanvas);
                }

                setZoom(zoom) {
                    // Minimum zoom is one to ensure one sprite pixel occupies at least one pixel on screen.
                    var minimumZoom = 1;
                    // Maximum zoom is relative to the display dimensions to ensure at least 10 pixels can
                    // be drawn on screen.
                    var maximumZoom = Math.min(this.displayWidth, this.displayHeight) / 10;
                    zoom = pskl.utils.math.minmax(zoom, minimumZoom, maximumZoom);

                    if (zoom == this.zoom) {
                        return;
                    }

                    // back up center coordinates
                    var centerX = this.offset.x + (this.displayWidth / (2 * this.zoom));
                    var centerY = this.offset.y + (this.displayHeight / (2 * this.zoom));

                    this.zoom = zoom;
                    // recenter
                    this.setOffset(
                        centerX - (this.displayWidth / (2 * this.zoom)),
                        centerY - (this.displayHeight / (2 * this.zoom))
                    );
                }

                getZoom() {
                    return this.zoom;
                }

                setDisplaySize(width, height) {
                    this.displayWidth = width;
                    this.displayHeight = height;
                    if (this.displayCanvas) {
                        this.displayCanvas.parentNode.removeChild(this.displayCanvas);
                        this.displayCanvas = null;
                    }
                    this.createDisplayCanvas_();
                }

                getDisplaySize() {
                    return {
                        height: this.displayHeight,
                        width: this.displayWidth
                    };
                };

                getOffset() {
                    return {
                        x: this.offset.x,
                        y: this.offset.y
                    };
                }

                setOffset(x, y) {
                    var width = pskl.app.piskelController.getWidth();
                    var height = pskl.app.piskelController.getHeight();
                    var maxX = width - (this.displayWidth / this.zoom);
                    x = pskl.utils.math.minmax(x, 0, maxX);
                    var maxY = height - (this.displayHeight / this.zoom);
                    y = pskl.utils.math.minmax(y, 0, maxY);

                    this.offset.x = x;
                    this.offset.y = y;
                }

                getGridColor() {
                    return pskl.UserSettings.get(pskl.UserSettings.GRID_COLOR);
                }

                setGridWidth(value) {
                    this.gridWidth_ = value;
                }

                setGridSpacing(value) {
                    this.gridSpacing_ = value;
                }

                getGridWidth() {
                    if (!this.supportGridRendering) {
                        return 0;
                    }

                    return this.gridWidth_;
                }

                getGridSpacing() {
                    if (!this.supportGridRendering) {
                        return 0;
                    }

                    return this.gridSpacing_;
                }

                /**
                 * Compute a grid width value best suited to the current display context,
                 * particularly for the current zoom level
                 */
                private computeGridWidthForDisplay_() {
                    var gridSpacing = this.getGridSpacing();
                    if (this.zoom * gridSpacing < 6) {
                        return 0;
                    }

                    var gridWidth = this.getGridWidth();
                    while (gridWidth > 1 && this.zoom < 6 * gridWidth) {
                        gridWidth--;
                    }

                    return gridWidth;
                }

                private updateMargins_(frame) {
                    var deltaX = this.displayWidth - (this.zoom * frame.getWidth());
                    this.margin.x = Math.max(0, deltaX) / 2;

                    var deltaY = this.displayHeight - (this.zoom * frame.getHeight());
                    this.margin.y = Math.max(0, deltaY) / 2;
                }

                private createDisplayCanvas_() {
                    var height = this.displayHeight;
                    var width = this.displayWidth;

                    this.displayCanvas = pskl.utils.CanvasUtils.createCanvas(width, height, this.classList);
                    pskl.utils.CanvasUtils.disableImageSmoothing(this.displayCanvas);
                    this.container.appendChild(this.displayCanvas);
                }

                private onUserSettingsChange_(evt, settingName, settingValue) {
                    var settings = pskl.UserSettings;
                    if (settingName == settings.GRID_WIDTH ||
                        settingName == settings.GRID_SPACING ||
                        settingName == settings.GRID_ENABLED) {
                        this.setGridWidth(this.getUserGridWidth_());
                        this.setGridSpacing(this.getUserGridSpacing_());
                    }
                }

                private getUserGridWidth_() {
                    var gridEnabled = pskl.UserSettings.get(pskl.UserSettings.GRID_ENABLED);
                    var width = pskl.UserSettings.get(pskl.UserSettings.GRID_WIDTH);
                    return gridEnabled ? width : 0;
                }

                private getUserGridSpacing_() {
                    var gridEnabled = pskl.UserSettings.get(pskl.UserSettings.GRID_ENABLED);
                    var spacing = pskl.UserSettings.get(pskl.UserSettings.GRID_SPACING);
                    return gridEnabled ? spacing : 0;
                }

                /**
                 * Transform a screen pixel-based coordinate (relative to the top-left corner of the rendered
                 * frame) into a sprite coordinate in column and row.
                 * @public
                 */
                getCoordinates(x, y) {
                    var containerRect = this.container.getBoundingClientRect();
                    x = x - containerRect.left;
                    y = y - containerRect.top;

                    // apply margins
                    x = x - this.margin.x;
                    y = y - this.margin.y;

                    var cellSize = this.zoom;
                    // apply frame offset
                    x = x + this.offset.x * cellSize;
                    y = y + this.offset.y * cellSize;

                    return {
                        x: Math.floor(x / cellSize),
                        y: Math.floor(y / cellSize)
                    };
                }

                reverseCoordinates(x, y) {
                    var cellSize = this.zoom;

                    x = x * cellSize;
                    y = y * cellSize;

                    x = x - this.offset.x * cellSize;
                    y = y - this.offset.y * cellSize;

                    x = x + this.margin.x;
                    y = y + this.margin.y;

                    var containerRect = this.container.getBoundingClientRect();
                    x = x + containerRect.left;
                    y = y + containerRect.top;

                    return {
                        x: x + (cellSize / 2),
                        y: y + (cellSize / 2)
                    };
                }

                private renderFrame_(frame) {
                    if (!this.canvas || frame.getWidth() != this.canvas.width || frame.getHeight() != this.canvas.height) {
                        this.canvas = pskl.utils.CanvasUtils.createCanvas(frame.getWidth(), frame.getHeight());
                    }

                    var w = this.canvas.width;
                    var h = this.canvas.height;
                    var z = this.zoom;

                    // Draw in canvas
                    pskl.utils.FrameUtils.drawToCanvas(frame, this.canvas);

                    this.updateMargins_(frame);

                    var displayContext = this.displayCanvas.getContext('2d');
                    displayContext.save();

                    var translateX = this.margin.x - this.offset.x * z;
                    var translateY = this.margin.y - this.offset.y * z;

                    var isZoomedOut = translateX > 0 || translateY > 0;
                    // Draw the background / zoomed-out color only if needed. Otherwise the clearRect
                    // happening after that will clear "out of bounds" and seems to be doing nothing
                    // on some chromebooks (cf https://github.com/piskelapp/piskel/issues/651)
                    if (isZoomedOut) {
                        // Draw background
                        displayContext.fillStyle = Constants.ZOOMED_OUT_BACKGROUND_COLOR;
                        // The -1 on the width and height here is a workaround for a Chrome-only bug
                        // that was potentially fixed, but is very hardware dependant. Seems to be
                        // triggered when doing clear rect or fill rect using the full width & height
                        // of a canvas. (https://bugs.chromium.org/p/chromium/issues/detail?id=469906)
                        displayContext.fillRect(0, 0, this.displayCanvas.width - 1, this.displayCanvas.height - 1);
                    }

                    displayContext.translate(translateX, translateY);

                    // Scale up to draw the canvas content
                    displayContext.scale(z, z);

                    if (pskl.UserSettings.get('SEAMLESS_MODE')) {
                        displayContext.clearRect(-1 * w, -1 * h, 3 * w, 3 * h);
                    } else {
                        displayContext.clearRect(0, 0, w, h);
                    }

                    if (pskl.UserSettings.get('SEAMLESS_MODE')) {
                        this.drawTiledFrames_(displayContext, this.canvas, w, h, 1);
                    }
                    displayContext.drawImage(this.canvas, 0, 0);

                    // Draw grid.
                    var gridWidth = this.computeGridWidthForDisplay_();
                    var gridSpacing = this.getGridSpacing();
                    if (gridWidth > 0) {
                        var gridColor = this.getGridColor();
                        // Scale out before drawing the grid.
                        displayContext.scale(1 / z, 1 / z);

                        var drawOrClear;
                        if (gridColor === Constants.TRANSPARENT_COLOR) {
                            drawOrClear = displayContext.clearRect.bind(displayContext);
                        } else {
                            displayContext.fillStyle = gridColor;
                            drawOrClear = displayContext.fillRect.bind(displayContext);
                        }

                        // Draw or clear vertical lines.
                        for (var i = 1; i < frame.getWidth(); i++) {
                            if (i % gridSpacing == 0) {
                                drawOrClear((i * z) - (gridWidth / 2), 0, gridWidth, h * z);
                            }
                        }
                        // Draw or clear horizontal lines.
                        for (var j = 1; j < frame.getHeight(); j++) {
                            if (j % gridSpacing == 0) {
                                drawOrClear(0, (j * z) - (gridWidth / 2), w * z, gridWidth);
                            }
                        }
                    }

                    displayContext.restore();
                }

                /**
                 * Draw repeatedly the provided image around the main drawing area. Used for seamless
                 * drawing mode, to easily create seamless textures. A colored overlay is applied to
                 * differentiate those additional frames from the main frame.
                 */
                private drawTiledFrames_(context, image, w, h, z) {
                    var opacity = pskl.UserSettings.get('SEAMLESS_OPACITY');
                    opacity = pskl.utils.math.minmax(opacity, 0, 1);
                    context.fillStyle = 'rgba(255, 255, 255, ' + opacity + ')';
                    [[0, -1], [0, 1], [-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1]].forEach(function (d) {
                        context.drawImage(image, d[0] * w * z, d[1] * h * z);
                        context.fillRect(d[0] * w * z, d[1] * h * z, w * z, h * z);
                    });
                }
            }

        }
    }
}