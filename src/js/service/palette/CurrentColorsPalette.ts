(function () {
    var ns = $.namespace('pskl.service.palette');

    ns.CurrentColorsPalette = function () {
        this.name = 'Current colors';
        this.id = Constants.CURRENT_COLORS_PALETTE_ID;
        this.colorSorter = new pskl.service.color.ColorSorter();
    };

    ns.CurrentColorsPalette.prototype.getColors = function () {
        var currentColors = pskl.app.currentColorsService.getCurrentColors();
        currentColors = currentColors.slice(0, Constants.MAX_PALETTE_COLORS);
        return this.colorSorter.sort(currentColors);
    };
})();

module pskl {
    export module service {
        export module palette {
            export class CurrentColorsPalette {
                name: string;
                id: string;
                colorSorter: color.ColorSorter;

                constructor() {
                    this.name = 'Current colors';
                    this.id = Constants.CURRENT_COLORS_PALETTE_ID;
                    this.colorSorter = new pskl.service.color.ColorSorter();
                }

                getColors() {
                    var currentColors = pskl.app.currentColorsService.getCurrentColors();
                    currentColors = currentColors.slice(0, Constants.MAX_PALETTE_COLORS);
                    return this.colorSorter.sort(currentColors);
                }
            }
        }
    }
}