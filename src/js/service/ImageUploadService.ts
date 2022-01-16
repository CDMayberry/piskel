module pskl {
    export module service {
        export class ImageUploadService {
            init() { };

            /**
             * Upload a base64 image data to distant service.
             * If successful, will call provided callback with the image URL as first argument;
             * @param imageData base64 image data (such as the return value of canvas.toDataUrl())
             * @param success success callback. 1st argument will be the uploaded image URL
             * @param error error callback
             */
            upload(imageData: string, success: Function, error: Function) {
                var data = {
                    data: imageData
                };

                var protocol = pskl.utils.Environment.isHttps() ? 'https' : 'http';
                var wrappedSuccess = function (response) {
                    var getUrl = pskl.utils.Template.replace(Constants.IMAGE_SERVICE_GET_URL, {
                        protocol: protocol
                    });
                    success(getUrl + response.responseText);
                };

                var uploadUrl = pskl.utils.Template.replace(Constants.IMAGE_SERVICE_UPLOAD_URL, {
                    protocol: protocol
                });
                pskl.utils.Xhr.post(uploadUrl, data, wrappedSuccess, error);
            }
        }
    }
}