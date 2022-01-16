module pskl {
    export module service {
        export module palette {
            export module reader {
                const RE_COLOR_LINE = /^(\s*\d{1,3})(\s*\d{1,3})(\s*\d{1,3})/;
                const RE_EXTRACT_NAME = /^name\s*\:\s*(.*)$/i;

                export class PaletteGplReader extends AbstractPaletteFileReader {
                    constructor(file, onSuccess, onError) {
                        super(file, onSuccess, onError, RE_COLOR_LINE)
                    }

                    extractColorFromLine(line) {
                        var matches = line.match(RE_COLOR_LINE);
                        var color = window.tinycolor({
                            r: parseInt(matches[1], 10),
                            g: parseInt(matches[2], 10),
                            b: parseInt(matches[3], 10)
                        });

                        return color.toHexString();
                    }
                }
            }
        }
    }
}