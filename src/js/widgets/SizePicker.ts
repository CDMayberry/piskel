module pskl {
  export module widgets {
    export class SizePicker {
      onChange: Function;
      container: Node | any;
      constructor(onChange) {
        this.onChange = onChange;
      }
      init(container) {
        this.container = container;
        pskl.utils.Event.addEventListener(this.container, 'click', this.onSizeOptionClick_, this);
      }
      destroy() {
        pskl.utils.Event.removeAllEventListeners(this);
      }
      getSize() {
        var selectedOption = this.container.querySelector('.selected');
        return selectedOption ? selectedOption.dataset.size : null;
      }

      setSize(size) {
        if (this.getSize() === size) {
          return;
        }

        pskl.utils.Dom.removeClass('labeled', this.container);
        pskl.utils.Dom.removeClass('selected', this.container);
        var selectedOption;
        selectedOption = this.container.querySelector('[data-size="' + size + '"]');
        if (!selectedOption) {
          selectedOption = this.container.querySelector('[data-size]:last-child');
          selectedOption.classList.add('labeled');
          selectedOption.setAttribute('real-size', size);
        }
        if (selectedOption) {
          selectedOption.classList.add('selected');
        }
      }

      onSizeOptionClick_(e) {
        var size = e.target.dataset.size;
        if (!isNaN(size)) {
          size = parseInt(size, 10);
          this.onChange(size);
          this.setSize(size);
        }
      }
    }
  }
}