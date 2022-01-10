module pskl {
  export module widgets {

    /**
     * Synchronize two "number" inputs to stick to their initial ratio.
     * The synchronization can be disabled/enabled on the fly.
     *
     * @param {Object} options
     *        - {Element} widthInput
     *        - {Element} heightInput
     *        - {Number} initWidth
     *        - {Number} initHeight
     *        - {Function} onChange
     */
    export class SizeInput {
      widthInput: Element;
      heightInput: Element;
      initWidth: number;
      initHeight: number;
      onChange: Function;
      synchronizedInputs: SynchronizedInputs;
      disableSync: any;
      enableSync: any;
      constructor(options) {
        this.widthInput = options.widthInput;
        this.heightInput = options.heightInput;
        this.initWidth = options.initWidth;
        this.initHeight = options.initHeight;
        this.onChange = options.onChange;

        this.synchronizedInputs = new SynchronizedInputs({
          leftInput: this.widthInput,
          rightInput: this.heightInput,
          synchronize: this.synchronize_.bind(this)
        });

        this.disableSync = this.synchronizedInputs.disableSync.bind(this.synchronizedInputs);
        this.enableSync = this.synchronizedInputs.enableSync.bind(this.synchronizedInputs);

        //@ts-ignore
        this.widthInput.value = this.initWidth;
        //@ts-ignore
        this.heightInput.value = this.initHeight;
      }
      destroy() {
        this.synchronizedInputs.destroy();

        this.widthInput = null;
        this.heightInput = null;
      }
      setWidth(width) {
        //@ts-ignore
        this.widthInput.value = width;
        this.synchronize_(this.widthInput);
      }

      setHeight(height) {
        //@ts-ignore
        this.heightInput.value = height;
        this.synchronize_(this.heightInput);
      }

      /**
       * Based on the value of the provided sizeInput (considered as emitter)
       * update the value of the other sizeInput to match the current width/height ratio
       * @param  {HTMLElement} origin either widthInput or heightInput
       */
      synchronize_(sizeInput) {
        var value = parseInt(sizeInput.value, 10);
        if (isNaN(value)) {
          value = 0;
        }

        if (sizeInput === this.widthInput) {
          //@ts-ignore
          this.heightInput.value = Math.round(value * this.initHeight / this.initWidth);
        } else if (sizeInput === this.heightInput) {
          //@ts-ignore
          this.widthInput.value = Math.round(value * this.initWidth / this.initHeight);
        }

        if (this.onChange) {
          this.onChange();
        }
      }
    }
  }
}