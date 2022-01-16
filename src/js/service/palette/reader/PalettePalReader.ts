module pskl {
    export module service {
        export module palette {
            export module reader {
                const RE_COLOR_LINE = /^(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})/;

                export class PalettePalReader extends AbstractPaletteFileReader {
                    constructor(file, onSuccess, onError) {
                        super(file, onSuccess, onError, RE_COLOR_LINE);
                    }

                    extractColorFromLine(line) {
                        var matches = line.match(RE_COLOR_LINE);
                        var rgbColor = 'rgb(' + matches[1] + ',' + matches[2] + ',' + matches[3] + ')';
                        var color = window.tinycolor(rgbColor);

                        return color.toHexString();
                    }
                }
            }
        }
    }
}