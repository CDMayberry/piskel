module pskl {
  export module widget {

    export class SynchronizedInputs {
      leftInput: any;
      rightInput: any;
      synchronize: any;
      syncEnabled: boolean;
      lastInput: any;
      constructor(options) {
        this.leftInput = options.leftInput;
        this.rightInput = options.rightInput;
        this.synchronize = options.synchronize;

        this.syncEnabled = true;
        this.lastInput = this.leftInput;

        pskl.utils.Event.addEventListener(this.leftInput, 'input', this.onInput_, this);
        pskl.utils.Event.addEventListener(this.rightInput, 'input', this.onInput_, this);
      }

      destroy() {
        pskl.utils.Event.removeAllEventListeners(this);

        this.leftInput = null;
        this.rightInput = null;
        this.lastInput = null;
      }

      enableSync() {
        this.syncEnabled = true;
        this.synchronize(this.lastInput);
      }

      disableSync() {
        this.syncEnabled = false;
      }

      onInput_(evt) {
        var target = evt.target;
        if (this.syncEnabled) {
          this.synchronize(target);
        }
        this.lastInput = target;
      }
    }
  }
}