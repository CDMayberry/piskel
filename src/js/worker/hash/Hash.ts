module pskl {
    export module worker {
        export module hash {
            export class Hash {
                str: any;
                worker: any;
                onStep: Function;
                onSuccess: Function;
                onError: Function;
                onMessage: Function;

                constructor(str, onSuccess, onStep, onError) {
                    this.str = str;

                    this.onStep = onStep;
                    this.onSuccess = onSuccess;
                    this.onError = onError;

                    this.worker = pskl.utils.WorkerUtils.createWorker(HashWorker, 'hash');
                    this.worker.onmessage = this.onWorkerMessage.bind(this);
                }

                process() {
                    this.worker.postMessage({
                        str: this.str
                    });
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