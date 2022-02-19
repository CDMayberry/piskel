module pskl {
    export module rendering {
        export class DrawingLoop {
            requestAnimationFrame: any;
            isRunning: boolean;
            previousTime: number;
            callbacks: any[];

            constructor() {
                this.requestAnimationFrame = this.getRequestAnimationFrameShim_();
                this.isRunning = false;
                this.previousTime = 0;
                this.callbacks = [];
                this.loop_ = this.loop_.bind(this);
            }

            addCallback(callback, scope, args) {
                var callbackObj = {
                    fn: callback,
                    scope: scope,
                    args: args
                };

                this.callbacks.push(callbackObj);
                return callbackObj;
            }

            removeCallback(callbackObj) {
                var index = this.callbacks.indexOf(callbackObj);
                if (index != -1) {
                    this.callbacks.splice(index, 1);
                }
            }

            start() {
                this.isRunning = true;
                this.loop_();
            }

            loop_() {
                var currentTime = Date.now();
                var delta = currentTime - this.previousTime;
                this.executeCallbacks_(delta);
                this.previousTime = currentTime;
                this.requestAnimationFrame.call(window, this.loop_);
            }

            executeCallbacks_(deltaTime) {
                for (var i = 0; i < this.callbacks.length; i++) {
                    var cb = this.callbacks[i];
                    cb.fn.call(cb.scope, deltaTime, cb.args);
                }
            }

            stop() {
                this.isRunning = false;
            }

            getRequestAnimationFrameShim_ () {
                var requestAnimationFrame = window.requestAnimationFrame ||
                    //@ts-ignore
                    window.mozRequestAnimationFrame ||
                    //@ts-ignore
                    window.webkitRequestAnimationFrame ||
                    //@ts-ignore
                    window.msRequestAnimationFrame ||
                    function (callback) { window.setTimeout(callback, 1000 / 60); };
        
                return requestAnimationFrame;
            }
        }
    }
}