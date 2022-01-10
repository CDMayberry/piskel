module pskl {
  export module widget {
    const DEFAULT_COLOR = '#000000';

    export class ColorsList {
      selectedIndex: number;
      palette: model.Palette;
      container: any;
      colorsList: any;
      colorPreviewEl: any;
      hslRgbColorPicker: any;
      constructor(container) {
        this.selectedIndex = -1;
        this.palette = new pskl.model.Palette('tmp', 'tmp', []);
        this.container = container;

        this.colorsList = this.container.querySelector('.colors-list');
        this.colorPreviewEl = this.container.querySelector('.color-preview');

        //@ts-ignore
        $(container).sortable({
          placeholder: 'colors-list-drop-proxy',
          update: this.onColorDrop_.bind(this),
          items: '.create-palette-color'
        });

        pskl.utils.Event.addEventListener(this.colorsList, 'click', this.onColorContainerClick_, this);

        var colorPickerContainer = container.querySelector('.color-picker-container');
        this.hslRgbColorPicker = new pskl.widgets.HslRgbColorPicker(colorPickerContainer, this.onColorUpdated_.bind(this));
        this.hslRgbColorPicker.init();
      }
      setColors(colors) {
        if (colors.length === 0) {
          colors.push(DEFAULT_COLOR);
        }

        this.palette.setColors(colors);

        this.selectColor_(0);
        this.refresh_();
      }
      getColors() {
        return this.palette.getColors();
      }
      destroy() {
        pskl.utils.Event.removeAllEventListeners(this);

        //@ts-ignore
        $(this.container).sortable('destroy');

        this.hslRgbColorPicker.destroy();
        this.container = null;
        this.colorsList = null;
        this.colorPreviewEl = null;
      }


      /**
       * Lightweight refresh only changing the color of one element of the palette color list
       */
      refreshColorElement_(index) {
        var color = this.palette.get(this.selectedIndex);
        var element = document.querySelector('[data-palette-index="' + index + '"]');
        if (element) {
          //@ts-ignore, hm not sure about this one.
          element.style.background = color;
          element.classList.toggle('light-color', this.isLight_(color));
        }
      }
      onColorContainerClick_(evt) {
        var target = evt.target;
        if (target.classList.contains('create-palette-color')) {
          this.onPaletteColorClick_(evt, target);
        } else if (target.classList.contains('create-palette-new-color')) {
          this.onNewColorClick_(evt, target);
        } else if (target.classList.contains('create-palette-remove-color')) {
          this.onRemoveColorClick_(evt, target);
        }
        this.refresh_();
      }
      onColorUpdated_(color) {
        var strColor = color.toHexString();
        this.colorPreviewEl.style.background = strColor;
        if (this.palette) {
          this.palette.set(this.selectedIndex, strColor);
          this.refreshColorElement_(this.selectedIndex);
        }
      }
      onPaletteColorClick_(evt, target) {
        var index = parseInt(target.dataset.paletteIndex, 10);
        this.selectColor_(index);
      }
      onRemoveColorClick_(evt, target) {
        var colorElement = target.parentNode;
        var index = parseInt(colorElement.dataset.paletteIndex, 10);
        this.removeColor_(index);
      }
      onNewColorClick_(evt, target) {
        var newColor = this.palette.get(this.selectedIndex) || '#000000';
        this.palette.add(newColor);
        this.selectColor_(this.palette.size() - 1);
      }
      refresh_() {
        var html = '';
        var tpl = pskl.utils.Template.get('create-palette-color-template');
        var colors = this.palette.getColors();

        colors.forEach(function (color, index) {
          var isSelected = (index === this.selectedIndex);

          html += pskl.utils.Template.replace(tpl, {
            'color': color, index: index,
            ':selected': isSelected,
            ':light-color': this.isLight_(color)
          });
        }.bind(this));

        html += '<li class="create-palette-new-color">+</li>';

        this.colorsList.innerHTML = html;
      }
      selectColor_(index) {
        this.selectedIndex = index;
        this.hslRgbColorPicker.setColor(this.palette.get(index));
      }

      removeColor_(index) {
        this.palette.removeAt(index);
        this.refresh_();
      }

      isLight_(color) {
        var rgb = window.tinycolor(color).toRgb();
        return rgb.r + rgb.b + rgb.g > 128 * 3;
      }

      onColorDrop_(evt, drop) {
        var colorElement = drop.item.get(0);

        var oldIndex = parseInt(colorElement.dataset.paletteIndex, 10);
        var colors = document.querySelectorAll('.create-palette-color');
        var newIndex = Array.prototype.indexOf.call(colors, colorElement);
        this.palette.move(oldIndex, newIndex);

        this.selectedIndex = newIndex;

        this.refresh_();
      }
    }
  }
}