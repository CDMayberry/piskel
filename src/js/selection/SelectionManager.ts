module pskl {
    export module selection {

        const SELECTION_REPLAY = {
            PASTE: 'REPLAY_PASTE',
            ERASE: 'REPLAY_ERASE'
        };

        export class SelectionManager {
            piskelController: any;
            currentSelection: any;

            constructor(piskelController) {
                this.piskelController = piskelController;
                this.currentSelection = null;
            }

            init() {
                $.subscribe(Events.SELECTION_CREATED, this.onSelectionCreated_.bind(this));
                $.subscribe(Events.SELECTION_DISMISSED, this.onSelectionDismissed_.bind(this));
                $.subscribe(Events.SELECTION_MOVE_REQUEST, this.onSelectionMoved_.bind(this));
                $.subscribe(Events.CLIPBOARD_COPY, this.copy.bind(this));
                $.subscribe(Events.CLIPBOARD_CUT, this.copy.bind(this));
                $.subscribe(Events.CLIPBOARD_PASTE, this.paste.bind(this));

                var shortcuts = pskl.service.keyboard.Shortcuts;
                pskl.app.shortcutService.registerShortcut(shortcuts.SELECTION.DELETE, this.onDeleteShortcut_.bind(this));
                pskl.app.shortcutService.registerShortcut(shortcuts.SELECTION.COMMIT, this.commit.bind(this));

                $.subscribe(Events.TOOL_SELECTED, this.onToolSelected_.bind(this));
            }

            private cleanSelection_() {
                if (this.currentSelection) {
                    this.currentSelection.reset();
                    this.currentSelection = null;
                }
            }

            private onToolSelected_(evt, tool) {
                var isSelectionTool = tool instanceof pskl.tools.drawing.selection.BaseSelect;
                if (!isSelectionTool) {
                    this.cleanSelection_();
                }
            }

            private onSelectionDismissed_(evt) {
                this.cleanSelection_();
            }

            private onDeleteShortcut_(evt) {
                if (this.currentSelection) {
                    this.erase();
                } else {
                    return true; // bubble
                }
            }

            erase() {
                var pixels = this.currentSelection.pixels;
                var currentFrame = this.piskelController.getCurrentFrame();
                for (var i = 0, l = pixels.length; i < l; i++) {
                    currentFrame.setPixel(pixels[i].col, pixels[i].row, Constants.TRANSPARENT_COLOR);
                }

                $.publish(Events.PISKEL_SAVE_STATE, {
                    type: pskl.service.HistoryService.REPLAY,
                    scope: this,
                    replay: {
                        type: SELECTION_REPLAY.ERASE,
                        pixels: JSON.parse(JSON.stringify(pixels))
                    }
                });
            }

            copy(event, domEvent) {
                if (this.currentSelection && this.piskelController.getCurrentFrame()) {
                    this.currentSelection.fillSelectionFromFrame(this.piskelController.getCurrentFrame());
                    if (domEvent) {
                        domEvent.clipboardData.setData('text/plain', this.currentSelection.stringify());
                        domEvent.preventDefault();
                    }
                    if (event.type === Events.CLIPBOARD_CUT) {
                        this.erase();
                    }
                }
            }

            paste(event, domEvent) {
                var items = domEvent ? domEvent.clipboardData.items : [];

                try {
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];

                        if (/^image/i.test(item.type)) {
                            this.pasteImage_(item);
                            event.stopPropagation();
                            return;
                        }

                        if (/^text\/plain/i.test(item.type)) {
                            this.pasteText_(item);
                            event.stopPropagation();
                            return;
                        }
                    }
                } catch (e) {
                    // Some of the clipboard APIs are not available on Safari/IE
                    // Allow Piskel to fallback on local currentSelection pasting.
                }

                // temporarily keeping this code path for tests and fallbacks.
                if (this.currentSelection && this.currentSelection.hasPastedContent) {
                    this.pastePixelsOnCurrentFrame_(this.currentSelection.pixels);
                }
            }

            pasteImage_(clipboardItem) {
                var blob = clipboardItem.getAsFile();
                pskl.utils.FileUtils.readImageFile(blob, function (image) {
                    pskl.app.fileDropperService.dropPosition_ = { x: 0, y: 0 };
                    pskl.app.fileDropperService.onImageLoaded_(image, blob);
                }.bind(this));
            }

            pasteText_(clipboardItem) {
                var blob = clipboardItem.getAsString(function (selectionString) {
                    var selectionData = JSON.parse(selectionString);
                    var time = selectionData.time;
                    var pixels = selectionData.pixels;

                    if (this.currentSelection && this.currentSelection.time >= time) {
                        // If the local selection is newer or equal to the one coming from the clipboard event
                        // use the local one. The reason is that the "move" information is only updated locally
                        // without synchronizing it to the clipboard.
                        // TODO: the selection should store the origin of the selection and the selection itself
                        // separately.
                        pixels = this.currentSelection.pixels;
                    }

                    if (pixels) {
                        // If the current clipboard data is some random text, pixels will not be defined.
                        this.pastePixelsOnCurrentFrame_(pixels);
                    }
                }.bind(this));
            }

            pastePixelsOnCurrentFrame_(pixels) {
                var frame = this.piskelController.getCurrentFrame();

                this.pastePixels_(frame, pixels);

                $.publish(Events.PISKEL_SAVE_STATE, {
                    type: pskl.service.HistoryService.REPLAY,
                    scope: this,
                    replay: {
                        type: SELECTION_REPLAY.PASTE,
                        pixels: JSON.parse(JSON.stringify(pixels.slice(0)))
                    }
                });
            }

            /**
             * If the currently selected tool is a selection tool, call commitSelection handler on
             * the current tool instance.
             */
            commit() {
                var tool = pskl.app.drawingController.currentToolBehavior;
                var isSelectionTool = tool instanceof pskl.tools.drawing.selection.BaseSelect;
                if (isSelectionTool) {
                    tool.commitSelection();
                }
            };

            replay(frame, replayData) {
                if (replayData.type === SELECTION_REPLAY.PASTE) {
                    this.pastePixels_(frame, replayData.pixels);
                } else if (replayData.type === SELECTION_REPLAY.ERASE) {
                    replayData.pixels.forEach(function (pixel) {
                        frame.setPixel(pixel.col, pixel.row, Constants.TRANSPARENT_COLOR);
                    });
                }
            }

            private pastePixels_(frame, pixels) {
                pixels.forEach(function (pixel) {
                    if (pixel.color === Constants.TRANSPARENT_COLOR || pixel.color === null) {
                        return;
                    }
                    frame.setPixel(pixel.col, pixel.row, pixel.color);
                });
            }

            private onSelectionCreated_(evt, selection) {
                if (selection) {
                    this.currentSelection = selection;
                } else {
                    console.error('No selection provided to SelectionManager');
                }
            }

            private onSelectionMoved_(evt, colDiff, rowDiff) {
                if (this.currentSelection) {
                    this.currentSelection.move(colDiff, rowDiff);
                } else {
                    console.error('Bad state: No currentSelection set when trying to move it in SelectionManager');
                }
            }
        }
    }
}