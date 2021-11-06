module pskl {
    export module utils {
        export module WorkerUtils {
            var workers = {};

            export function createWorker(worker, workerId) {
                if (!workers[workerId]) {
                    workers[workerId] = createWorkerURL(worker);
                }

                return new Worker(workers[workerId]);
            }

            export function createWorkerURL(worker) {
                // remove "function () {" at the start of the worker string and the last "}" before the end
                var typedArray = [(worker + '').replace(/function\s*\(\)\s*\{/, '').replace(/\}[^}]*$/, '')];
                var blob = new Blob(typedArray, { type: 'application/javascript' });
                return window.URL.createObjectURL(blob);
            }
        }
    }
}