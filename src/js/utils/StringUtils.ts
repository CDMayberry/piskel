module pskl {
    export module utils {
        export module StringUtils {
            export function leftPad(input, length, pad) {
                var padding = new window.Array(length).join(pad);
                return (padding + input).slice(-length);
            }

            export function formatSize(width, height) {
                return width + '\u00D7' + height;
            }
        }
    }
}