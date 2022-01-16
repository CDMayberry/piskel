module pskl {
    export module service {
        export module palette {
            export class PaletteService {
                dynamicPalettes: any[];
                localStorageGlobal: Storage;

                constructor() {
                    this.dynamicPalettes = [];
                    // Exposed for tests.
                    this.localStorageGlobal = window.localStorage;
                }

                getPalettes() {
                    var palettesString = this.localStorageGlobal.getItem('piskel.palettes');
                    var palettes = JSON.parse(palettesString) || [];
                    palettes = palettes.map(function (palette) {
                        return pskl.model.Palette.fromObject(palette);
                    });

                    return this.dynamicPalettes.concat(palettes);
                }

                getPaletteById(paletteId) {
                    var palettes = this.getPalettes();
                    return this.findPaletteInArray_(paletteId, palettes);
                }

                savePalette(palette) {
                    var palettes = this.getPalettes();
                    var existingPalette = this.findPaletteInArray_(palette.id, palettes);
                    if (existingPalette) {
                        var currentIndex = palettes.indexOf(existingPalette);
                        palettes.splice(currentIndex, 1, palette);
                    } else {
                        palettes.push(palette);
                    }

                    this.savePalettes_(palettes);

                    $.publish(Events.SHOW_NOTIFICATION, [{ 'content': 'Palette ' + palette.name + ' successfully saved !' }]);
                    window.setTimeout($.publish.bind($, Events.HIDE_NOTIFICATION), 2000);
                }

                addDynamicPalette(palette) {
                    this.dynamicPalettes.push(palette);
                }

                deletePaletteById(id) {
                    var palettes = this.getPalettes();
                    var filteredPalettes = palettes.filter(function (palette) {
                        return palette.id !== id;
                    });

                    this.savePalettes_(filteredPalettes);
                }

                private savePalettes_(palettes) {
                    palettes = palettes.filter(function (palette) {
                        return this.dynamicPalettes.indexOf(palette) === -1;
                    }.bind(this));
                    this.localStorageGlobal.setItem('piskel.palettes', JSON.stringify(palettes));
                    $.publish(Events.PALETTE_LIST_UPDATED);
                }

                private findPaletteInArray_(paletteId, palettes) {
                    var match = null;

                    palettes.forEach(function (palette) {
                        if (palette.id === paletteId) {
                            match = palette;
                        }
                    });

                    return match;
                }

            }
        }
    }
}