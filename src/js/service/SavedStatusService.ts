module pskl {
    export module service {
        export class SavedStatusService {
            piskelController: any;
            historyService: any;
            lastSavedStateIndex: string;

            constructor(piskelController, historyService) {
                this.piskelController = piskelController;
                this.historyService = historyService;
                this.lastSavedStateIndex = '';

                this.publishStatusUpdateEvent_ = this.publishStatusUpdateEvent_.bind(this);
            }

            init() {
                $.subscribe(Events.TOOL_RELEASED, this.publishStatusUpdateEvent_);
                $.subscribe(Events.PISKEL_RESET, this.publishStatusUpdateEvent_);
                $.subscribe(Events.PISKEL_SAVED, this.onPiskelSaved.bind(this));
                this.lastSavedStateIndex = this.historyService.getCurrentStateId();
            }

            onPiskelSaved() {
                this.lastSavedStateIndex = this.historyService.getCurrentStateId();
                this.publishStatusUpdateEvent_();
            }

            publishStatusUpdateEvent_() {
                $.publish(Events.PISKEL_SAVED_STATUS_UPDATE);
            }

            isDirty() {
                return (this.lastSavedStateIndex != this.historyService.getCurrentStateId());
            }
        }
    }
}