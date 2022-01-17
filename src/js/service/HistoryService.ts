module pskl {
    export module service {
        export class HistoryService {
            piskelController: any;
            shortcutService: any;
            deserializer: any;
            stateQueue: any[];
            serializer: any;
            currentIndex: number;
            lastLoadState: number;

            constructor(piskelController, shortcutService?, deserializer?, serializer?) {
                // Use the real piskel controller that will not fire events when calling setters
                this.piskelController = piskelController.getWrappedPiskelController();

                this.shortcutService = shortcutService || pskl.app.shortcutService;
                this.deserializer = deserializer || pskl.utils.serialization.arraybuffer.ArrayBufferDeserializer;
                this.serializer = serializer || pskl.utils.serialization.arraybuffer.ArrayBufferSerializer;

                this.stateQueue = [];
                this.currentIndex = -1;
                this.lastLoadState = -1;
            }

            static SNAPSHOT = 'SNAPSHOT';

            // Default save state
            static REPLAY = 'REPLAY';

            // Period (in number of state saved) between two snapshots
            static SNAPSHOT_PERIOD = 50;

            // Interval/buffer (in milliseconds) between two state load (ctrl+z/y spamming)
            static LOAD_STATE_INTERVAL = 50;

            // Maximum number of states that can be recorded.
            static MAX_SAVED_STATES = 500;


            init() {
                $.subscribe(Events.PISKEL_SAVE_STATE, this.onSaveStateEvent.bind(this));

                var shortcuts = pskl.service.keyboard.Shortcuts;
                this.shortcutService.registerShortcut(shortcuts.MISC.UNDO, this.undo.bind(this));
                this.shortcutService.registerShortcut(shortcuts.MISC.REDO, this.redo.bind(this));

                this.saveState({
                    type: HistoryService.SNAPSHOT
                });
            };

            onSaveStateEvent(evt, action) {
                this.saveState(action);
            };

            saveState(action) {
                this.stateQueue = this.stateQueue.slice(0, this.currentIndex + 1);
                this.currentIndex = this.currentIndex + 1;

                var state = {
                    action: action,
                    frameIndex: action.state ? action.state.frameIndex : this.piskelController.currentFrameIndex,
                    layerIndex: action.state ? action.state.layerIndex : this.piskelController.currentLayerIndex,
                    fps: this.piskelController.getFPS(),
                    uuid: pskl.utils.Uuid.generate(),
                    piskel: undefined
                };

                var isSnapshot = action.type === HistoryService.SNAPSHOT;
                var isAtAutoSnapshotInterval = this.currentIndex % HistoryService.SNAPSHOT_PERIOD === 0;
                if (isSnapshot || isAtAutoSnapshotInterval) {
                    var piskel = this.piskelController.getPiskel();
                    state.piskel = this.serializer.serialize(piskel);
                }

                // If the new state pushes over MAX_SAVED_STATES, erase all states between the first and
                // second snapshot states.
                if (this.stateQueue.length > HistoryService.MAX_SAVED_STATES) {
                    var firstSnapshotIndex = this.getNextSnapshotIndex_(1);
                    this.stateQueue.splice(0, firstSnapshotIndex);
                    this.currentIndex = this.currentIndex - firstSnapshotIndex;
                }
                this.stateQueue.push(state);
                $.publish(Events.HISTORY_STATE_SAVED);
            }

            getCurrentStateId() {
                var state = this.stateQueue[this.currentIndex];
                if (!state) {
                    return false;
                }

                return state.uuid;
            }

            undo() {
                this.loadState(this.currentIndex - 1);
            }

            redo() {
                this.loadState(this.currentIndex + 1);
            }

            isLoadStateAllowed_(index) {
                var timeOk = (Date.now() - this.lastLoadState) > HistoryService.LOAD_STATE_INTERVAL;
                var indexInRange = index >= 0 && index < this.stateQueue.length;
                return timeOk && indexInRange;
            }

            getPreviousSnapshotIndex_(index) {
                while (this.stateQueue[index] && !this.stateQueue[index].piskel) {
                    index = index - 1;
                }
                return index;
            }

            getNextSnapshotIndex_(index) {
                while (this.stateQueue[index] && !this.stateQueue[index].piskel) {
                    index = index + 1;
                }
                return index;
            }

            loadState(index) {
                try {
                    if (this.isLoadStateAllowed_(index)) {
                        this.lastLoadState = Date.now();

                        var snapshotIndex = this.getPreviousSnapshotIndex_(index);
                        if (snapshotIndex < 0) {
                            throw 'Could not find previous SNAPSHOT saved in history stateQueue';
                        }
                        var serializedPiskel = this.getSnapshotFromState_(snapshotIndex);
                        var onPiskelLoadedCb = this.onPiskelLoaded_.bind(this, index, snapshotIndex);
                        this.deserializer.deserialize(serializedPiskel, onPiskelLoadedCb);
                    }
                } catch (error) {
                    console.error('[CRITICAL ERROR] : Unable to load a history state.');
                    this.logError_(error);
                    this.stateQueue = [];
                    this.currentIndex = -1;
                }
            }

            logError_(error) {
                if (typeof error === 'string') {
                    console.error(error);
                } else {
                    console.error(error.message);
                    console.error(error.stack);
                }
            }

            getSnapshotFromState_(stateIndex) {
                var state = this.stateQueue[stateIndex];
                var piskelSnapshot = state.piskel;

                state.piskel = piskelSnapshot;

                return piskelSnapshot;
            }

            onPiskelLoaded_(index, snapshotIndex, piskel) {
                var originalSize = this.getPiskelSize_();
                piskel.setDescriptor(this.piskelController.piskel.getDescriptor());
                // propagate save path to the new piskel instance
                piskel.savePath = this.piskelController.piskel.savePath;
                this.piskelController.setPiskel(piskel);

                for (var i = snapshotIndex + 1; i <= index; i++) {
                    var state = this.stateQueue[i];
                    this.setupState(state);
                    this.replayState(state);
                }

                // Should only do this when going backwards
                var lastState = this.stateQueue[index + 1];
                if (lastState) {
                    this.setupState(lastState);
                }

                this.currentIndex = index;
                $.publish(Events.PISKEL_RESET);
                $.publish(Events.HISTORY_STATE_LOADED);
                if (originalSize !== this.getPiskelSize_()) {
                    $.publish(Events.FRAME_SIZE_CHANGED);
                }
            }

            getPiskelSize_() {
                return this.piskelController.getWidth() + 'x' + this.piskelController.getHeight();
            }

            setupState(state) {
                this.piskelController.setCurrentFrameIndex(state.frameIndex);
                this.piskelController.setCurrentLayerIndex(state.layerIndex);
                this.piskelController.setFPS(state.fps);
            }

            replayState(state) {
                var action = state.action;
                var type = action.type;
                var layer = this.piskelController.getLayerAt(state.layerIndex);
                var frame = layer.getFrameAt(state.frameIndex);
                action.scope.replay(frame, action.replay);
            }
        }
    }
}