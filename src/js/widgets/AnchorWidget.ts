module pskl {
  export module widgets {
    const OPTION_CLASSNAME = 'anchor-option';
    // Maybe move to HTML ...
    const WIDGET_TEMPLATE =
      '<div class="anchor-option"  title="top left"      data-origin="TOPLEFT"></div>' +
      '<div class="anchor-option"  title="top"           data-origin="TOP"></div>' +
      '<div class="anchor-option"  title="top right"     data-origin="TOPRIGHT"></div>' +
      '<div class="anchor-option"  title="middle left"   data-origin="MIDDLELEFT"></div>' +
      '<div class="anchor-option"  title="middle"        data-origin="MIDDLE"></div>' +
      '<div class="anchor-option"  title="middle right"  data-origin="MIDDLERIGHT"></div>' +
      '<div class="anchor-option"  title="bottom left"   data-origin="BOTTOMLEFT"></div>' +
      '<div class="anchor-option"  title="bottom"        data-origin="BOTTOM"></div>' +
      '<div class="anchor-option"  title="bottom right"  data-origin="BOTTOMRIGHT"></div>';

    export class AnchorWidget {
      onChangeCallback: Function;
      wrapper: HTMLDivElement;
      disabled: boolean;
      origin: any;

      constructor(container, onChangeCallback: Function) {
        this.onChangeCallback = onChangeCallback;

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('anchor-wrapper');
        this.wrapper.innerHTML = WIDGET_TEMPLATE;

        container.innerHTML = '';
        container.appendChild(this.wrapper);

        this.disabled = false;

        pskl.utils.Event.addEventListener(this.wrapper, 'click', this.onResizeOriginClick_, this);
      }

      static ORIGIN = {
        TOPLEFT: 'TOPLEFT',
        TOP: 'TOP',
        TOPRIGHT: 'TOPRIGHT',
        MIDDLELEFT: 'MIDDLELEFT',
        MIDDLE: 'MIDDLE',
        MIDDLERIGHT: 'MIDDLERIGHT',
        BOTTOMLEFT: 'BOTTOMLEFT',
        BOTTOM: 'BOTTOM',
        BOTTOMRIGHT: 'BOTTOMRIGHT'
      };

      destroy(evt) {
        pskl.utils.Event.removeAllEventListeners(this);
        this.wrapper = null;
      }
      onResizeOriginClick_(evt) {
        var origin = evt.target.dataset.origin;
        if (origin && AnchorWidget.ORIGIN[origin] && !this.disabled) {
          this.setOrigin(origin);
        }
      }

      setOrigin(origin) {
        this.origin = origin;
        var previous = this.wrapper.querySelector('.' + OPTION_CLASSNAME + '.selected');
        if (previous) {
          previous.classList.remove('selected');
        }

        var selected = this.wrapper.querySelector('.' + OPTION_CLASSNAME + '[data-origin="' + origin + '"]');
        if (selected) {
          selected.classList.add('selected');
          this.refreshNeighbors_(selected);
        }

        if (typeof this.onChangeCallback === 'function') {
          this.onChangeCallback(origin);
        }
      };

      getOrigin() {
        return this.origin;
      };

      disable() {
        this.disabled = true;
        this.wrapper.classList.add('transition');
        this.wrapper.classList.add('disabled');
      }
      enable() {
        this.disabled = false;
        this.wrapper.classList.remove('disabled');
        window.setTimeout(this.wrapper.classList.remove.bind(this.wrapper.classList, 'transition'), 250);
      }

      refreshNeighbors_(selected) {
        var options = this.wrapper.querySelectorAll('.' + OPTION_CLASSNAME);
        for (var i = 0; i < options.length; i++) {
          options[i].removeAttribute('data-neighbor');
        }

        var selectedIndex = Array.prototype.indexOf.call(options, selected);

        this.setNeighborhood_(options[selectedIndex - 1], 'left');
        this.setNeighborhood_(options[selectedIndex + 1], 'right');
        this.setNeighborhood_(options[selectedIndex - 3], 'top');
        this.setNeighborhood_(options[selectedIndex + 3], 'bottom');
      }
      setNeighborhood_(el, neighborhood) {
        var origin = this.origin.toLowerCase();
        var isNeighborhoodValid = origin.indexOf(neighborhood) === -1;
        if (isNeighborhoodValid) {
          el.setAttribute('data-neighbor', neighborhood);
        }
      }
    }
  }
}