module pskl {
    export module utils {
        export module FileUtils {
            const stopPropagation = function (e) {
                e.stopPropagation();
            };

            export function readFile(file, callback) {
                var reader = new FileReader();
                reader.addEventListener('loadend', function () {
                    callback(reader.result);
                });
                reader.readAsDataURL(file);
            }

            export function readFileAsArrayBuffer(file, callback) {
                var reader = new FileReader();
                reader.addEventListener('loadend', function () {
                    callback(reader.result);
                });
                reader.readAsArrayBuffer(file);
            }

            export function readImageFile(file, callback) {
                readFile(file, function (content) {
                    var image = new Image();
                    image.onload = callback.bind(null, image);
                    image.src = content;
                });
            }

            export function downloadAsFile(content, filename) {
                //@ts-ignore
                var saveAs = window.saveAs || (navigator.msSaveBlob && navigator.msSaveBlob.bind(navigator));
                if (saveAs) {
                    saveAs(content, filename);
                } else {
                    var downloadLink = document.createElement('a');
                    content = window.URL.createObjectURL(content);
                    downloadLink.setAttribute('href', content);
                    downloadLink.setAttribute('download', filename);
                    document.body.appendChild(downloadLink);
                    downloadLink.addEventListener('click', stopPropagation);
                    downloadLink.click();
                    downloadLink.removeEventListener('click', stopPropagation);
                    document.body.removeChild(downloadLink);
                }
            }

        }
    }
}