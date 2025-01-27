module pskl {
    export module utils {
        var BASE64_REGEX = /\s*;\s*base64\s*(?:;|$)/i;
        export module BlobUtils {
            export function dataToBlob(dataURI, type, callback) {
                var headerEnd = dataURI.indexOf(',');
                var data = dataURI.substring(headerEnd + 1);
                var isBase64 = BASE64_REGEX.test(dataURI.substring(0, headerEnd));
                var blob;

                //@ts-ignore
                if (Blob.fake) {
                    // no reason to decode a data: URI that's just going to become a data URI again
                    blob = new Blob();
                    blob.encoding = isBase64 ? 'base64' : 'URI';
                    blob.data = data;
                    blob.size = data.length;
                } else if (Uint8Array) {
                    var blobData = isBase64 ? pskl.utils.Base64.decode(data) : decodeURIComponent(data);
                    blob = new Blob([blobData], { type: type });
                }
                callback(blob);
            }

            export function canvasToBlob(canvas, callback, type /*, ...args*/) {
                type = type || 'image/png';

                if (canvas.mozGetAsFile) {
                    callback(canvas.mozGetAsFile('canvas', type));
                } else {
                    var args = window.Array.prototype.slice.call(arguments, 2);
                    var dataURI = canvas.toDataURL.apply(canvas, args);
                    pskl.utils.BlobUtils.dataToBlob(dataURI, type, callback);
                }
            }

            export function stringToBlob(string, callback, type) {
                type = type || 'text/plain';
                pskl.utils.BlobUtils.dataToBlob('data:' + type + ',' + string, type, callback);
            }
        }
    }
}
