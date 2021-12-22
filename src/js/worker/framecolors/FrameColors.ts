module pskl {
    export module worker {
        export module framecolors {
            export class FrameColors {
                pixels: any;
                worker: any;
                onStep: Function;
                onSuccess: Function;
                onError: Function;
                onMessage: Function;

                constructor(frame, onSuccess, onStep, onError) {
                    this.pixels = frame.pixels;

                    this.onStep = onStep;
                    this.onSuccess = onSuccess;
                    this.onError = onError;

                    this.worker = pskl.utils.WorkerUtils.createWorker(FrameColorsWorker, 'frame-colors');
                    this.worker.onmessage = this.onWorkerMessage.bind(this);
                }

                process() {
                    this.worker.postMessage([
                        pskl.utils.colorToInt(Constants.TRANSPARENT_COLOR),
                        Constants.MAX_WORKER_COLORS, this.pixels
                    ]);
                }

                onWorkerMessage(event) {
                    if (event.data.type === 'STEP') {
                        this.onStep(event);
                    } else if (event.data.type === 'SUCCESS') {
                        this.onSuccess(event);
                        this.worker.terminate();
                    } else if (event.data.type === 'ERROR') {
                        this.onError(event);
                        this.worker.terminate();
                    }
                }
            }
        }
    }
}