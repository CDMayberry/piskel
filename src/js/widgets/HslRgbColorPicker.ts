module pskl {
  export module widget {

    export class HslRgbColorPicker {
      container: Node;
      colorUpdatedCallback: any;
      tinyColor: any;
      rgbColor: any;
      hsvColor: any;
      lastInputTimestamp_: number;
      unplugged: boolean;
      spectrumEl: any;
      constructor(container: Node, colorUpdatedCallback) {
        this.container = container;
        this.colorUpdatedCallback = colorUpdatedCallback;

        this.tinyColor = null;
        this.hsvColor = null;
        this.rgbColor = null;

        this.lastInputTimestamp_ = 0;

      }
      init() {
        var isFirefox = pskl.utils.UserAgent.isFirefox;
        var isChrome = pskl.utils.UserAgent.isChrome;

        var changeEvent = (isChrome || isFirefox) ? 'input' : 'change';
        pskl.utils.Event.addEventListener(this.container, changeEvent, this.onPickerChange_, this);
        pskl.utils.Event.addEventListener(this.container, 'keydown', this.onPickerChange_, this);

        // Cannot use pskl.utils.Event with useCapture for now ...
        this.onBlur_ = this.onBlur_.bind(this);
        this.container.addEventListener('blur', this.onBlur_, true);

          //@ts-ignore
        this.spectrumEl = this.container.querySelector('.color-picker-spectrum');

          //@ts-ignore
        $(this.spectrumEl).spectrum({
          flat: true,
          showButtons: false,
          move: this.setColor.bind(this),
          change: this.setColor.bind(this)
        });

        this.setColor('#000000');
      }
      destroy() {
        // Remove event listeners.
        pskl.utils.Event.removeAllEventListeners(this);
        this.container.removeEventListener('blur', this.onBlur_, true);

        // Destroy spectrum widget.
          //@ts-ignore
        $(this.spectrumEl).spectrum('destroy');

        this.container = null;
        this.spectrumEl = null;
      }
      onPickerChange_(evt) {
        var target = evt.target;
        if (target.dataset.dimension) {
          var model = target.dataset.model;
          var dimension = target.dataset.dimension;
          var value = target.value;

          this.updateColor_(value, model, dimension);
        }
      }
      onKeydown_(evt) {
        var target = evt.target;

        var isInputText = target.getAttribute('type').toLowerCase() === 'text';
        if (isInputText && target.dataset.dimension) {
          var model = target.dataset.model;

          if (model === 'rgb' || model === 'hsv') {
            var increment = this.getIncrement_(evt);
            if (increment) {
              var dimension = target.dataset.dimension;
              var value = parseInt(target.value, 10);
              this.updateColor_(value + increment, model, dimension);
            }
          }
        }
      }
      getIncrement_(evt) {
        var increment = 0;
        var key = pskl.service.keyboard.KeycodeTranslator.toChar(evt.keyCode);
        if (key === 'up') {
          increment = 1;
        } else if (key === 'down') {
          increment = -1;
        }

        if (evt.shiftKey) {
          increment = increment * 5;
        }

        return increment;
      }
      updateColor_(inputValue, model, dimension) {
        var value = this.toModelValue_(inputValue, model, dimension);
        if (model === 'hsv' || model === 'rgb') {
          if (!isNaN(value)) {
            var color = this.getColor_(model);
            color[dimension] = this.normalizeDimension_(value, dimension);
            this.setColor(color);
          }
        } else if (model === 'hex') {
          if (/^#([a-f0-9]{3}){1,2}$/i.test(value)) {
            this.setColor(value);
          }
        }
      }
      onBlur_(evt) {
        var target = evt.target;

        var isInputText = target.getAttribute('type').toLowerCase() === 'text';
        if (isInputText && target.dataset.dimension) {
          var model = target.dataset.model;
          var dimension = target.dataset.dimension;
          target.value = this.toInputValue_(model, dimension);
        }
      }
      setColor(inputColor) {
        if (!this.unplugged) {
          this.unplugged = true;

          this.hsvColor = this.toHsvColor_(inputColor);
          this.tinyColor = this.toTinyColor_(inputColor);
          this.rgbColor = this.tinyColor.toRgb();

          this.updateInputs();
          //@ts-ignore
          $('.color-picker-spectrum').spectrum('set', this.tinyColor);

          this.colorUpdatedCallback(this.tinyColor);

          this.unplugged = false;
        }
      }
      updateInputs() {
        //@ts-ignore
        var inputs = this.container.querySelectorAll('input');

        for (var i = 0; i < inputs.length; i++) {
          var input = inputs[i];
          var dimension = input.dataset.dimension;
          var model = input.dataset.model;

          var value = this.toInputValue_(model, dimension);
          if (input.value != value) {
            input.value = value;
          }
          if (input.getAttribute('type') === 'range') {
            this.updateSliderBackground(input);
          }
        }
      }
      toInputValue_(model, dimension) {
        var value;

        if (model === 'rgb' || model === 'hsv') {
          var color = this.getColor_(model);
          value = color[dimension];

          if (dimension === 'v' || dimension === 's') {
            value = 100 * value;
          }
          value = Math.round(value);
        } else if (model === 'hex') {
          value = this.tinyColor.toHexString(true);
        }

        return value;
      }
      toModelValue_(value, model, dimension) {
        var modelValue;

        if (model === 'rgb' || model === 'hsv') {
          modelValue = parseInt(value, 10);
          if (dimension === 'v' || dimension === 's') {
            modelValue = modelValue / 100;
          }
        } else if (model === 'hex') {
          modelValue = value;
        }

        return modelValue;
      }
      toTinyColor_(color) {
        var isTinyColor = typeof color == 'object' && color.hasOwnProperty('_tc_id');
        if (isTinyColor) {
          return color;
        } else {
          return window.tinycolor(pskl.utils.copy(color));
        }
      }
      toHsvColor_(color) {
        var isHsvColor = ['h', 's', 'v'].every(color.hasOwnProperty.bind(color));
        if (isHsvColor) {
          return {
            h: this.normalizeDimension_(color.h, 'h'),
            s: this.normalizeDimension_(color.s, 's'),
            v: this.normalizeDimension_(color.v, 'v')
          };
        } else {
          return this.toTinyColor_(color).toHsv();
        }
      }
      normalizeDimension_(value, dimension) {
        var range = this.getDimensionRange_(dimension);
        return Math.max(range[0], Math.min(range[1], value));
      }


      /**
       * Update background colors for range inputs
       */
      updateSliderBackground(slider) {
        var dimension = slider.dataset.dimension;
        var model = slider.dataset.model;

        var start;
        var end;
        var isHueSlider = dimension === 'h';
        if (!isHueSlider) {
          var colors = this.getSliderBackgroundColors_(model, dimension);
          slider.style.backgroundImage = 'linear-gradient(to right, ' + colors.start + ' 0, ' + colors.end + ' 100%)';
        }
      }
      getSliderBackgroundColors_(model, dimension) {
        var color = this.getColor_(model);
        var start = pskl.utils.copy(color);
        var end = pskl.utils.copy(color);

        var range = this.getDimensionRange_(dimension);
        start[dimension] = range[0];
        end[dimension] = range[1];

        return {
          start: window.tinycolor(start).toRgbString(),
          end: window.tinycolor(end).toRgbString()
        };
      }
      getDimensionRange_(d) {
        if (d === 'h') {
          return [0, 359];
        } else if (d === 's' || d === 'v') {
          return [0, 1];
        } else if (d === 'r' || d === 'g' || d === 'b') {
          return [0, 255];
        }
      }
      getColor_(model) {
        var color;
        if (model === 'hsv') {
          color = this.hsvColor;
        } else if (model === 'rgb') {
          color = this.rgbColor;
        }
        return color;
      }
    }
  }
}