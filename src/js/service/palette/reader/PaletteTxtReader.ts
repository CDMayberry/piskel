module pskl {
    export module service {
        export module palette {
            export module reader {
                const RE_COLOR_LINE = /^[A-F0-9]{2}([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})/;

                export class PaletteTxtReader extends AbstractPaletteFileReader {
                    constructor(file, onSuccess, onError) {
                        super(file, onSuccess, onError, RE_COLOR_LINE);
                    }

                    extractColorFromLine(line) {
                        var matches = line.match(RE_COLOR_LINE);
                        var color = '#' + matches[1] + matches[2] + matches[3];
                        return color.toLowerCase();
                    }
                }
            }
        }
    }
}