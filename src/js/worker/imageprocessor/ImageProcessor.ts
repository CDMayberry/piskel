module pskl {
    export module worker {
        export module imageprocessor {
            export class ImageProcessor {
                worker: any;
                image: any;
                onStep: Function;
                onSuccess: Function;
                onError: Function;

                constructor(image, onSuccess, onStep, onError) {
                    this.image = image;

                    this.onStep = onStep;
                    this.onSuccess = onSuccess;
                    this.onError = onError;
                
                    this.worker = pskl.utils.WorkerUtils.createWorker(ImageProcessorWorker, 'image-colors-processor');
                    this.worker.onmessage = this.onWorkerMessage.bind(this);
                }

                process() {
                    var canvas = pskl.utils.CanvasUtils.createFromImage(this.image);
                    var imageData = pskl.utils.CanvasUtils.getImageDataFromCanvas(canvas);
                    this.worker.postMessage({
                      imageData : imageData,
                      width : this.image.width,
                      height : this.image.height
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