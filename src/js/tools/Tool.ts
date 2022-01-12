module pskl {
    export module tools {
        export class Tool {
            toolId: string;
            helpText: string;
            tooltipDescriptors: any[];

            constructor() {
                this.toolId = 'tool';
                this.helpText = 'Abstract tool';
                this.tooltipDescriptors = [];
            }

            getHelpText() {
                return this.helpText;
            }

            getId() {
                return this.toolId;
            }

            raiseSaveStateEvent(replayData) {
                $.publish(Events.PISKEL_SAVE_STATE, {
                    //@ts-ignore
                    type: pskl.service.HistoryService.REPLAY,
                    scope: this,
                    replay: replayData
                });
            }
        }
    }
}