module pskl {
    export module utils {
        export module PiskelFileUtils {
            // TODO: This is technically a enum, so let's convert it.
            export const FAILURE = {
                EMPTY: 'No data found in piskel file',
                INVALID: 'Invalid piskel file, contact us on twitter @piskelapp',
                DESERIALIZATION: 'Piskel data deserialization failed'
            }

            /**
             * Load a piskel from a piskel file.
             * After deserialization is successful, the provided success callback will be called.
             * Success callback is expected to receive a single Piskel object argument
             * @param  {File} file the .piskel file to load
             * @param  {Function} onSuccess Called if the deserialization of the piskel is successful
             * @param  {Function} onError NOT USED YET
             */
            export function loadFromFile(file, onSuccess, onError?) {
                pskl.utils.FileUtils.readFile(file, function (content) {
                    var rawPiskel = pskl.utils.Base64.toText(content);
                    decodePiskelFile(
                        rawPiskel,
                        function (piskel) {
                            // if using Node-Webkit, store the savePath on load
                            // Note: the 'path' property is unique to Node-Webkit, and holds the full path
                            if (pskl.utils.Environment.detectNodeWebkit()) {
                                piskel.savePath = file.path;
                            }
                            onSuccess(piskel);
                        },
                        onError
                    );
                });
            }

            // ISSUE: onError isn't passed by everyone who calls but it seems like it's required if there's an issue.
            export function decodePiskelFile(rawPiskel, onSuccess, onError?) {
                var serializedPiskel;
                if (rawPiskel.length === 0) {
                    onError(FAILURE.EMPTY);
                    return;
                }

                try {
                    serializedPiskel = JSON.parse(rawPiskel);
                } catch (e) {
                    onError(FAILURE.INVALID);
                    return;
                }

                var piskel = serializedPiskel.piskel;
                pskl.utils.serialization.Deserializer.deserialize(serializedPiskel, onSuccess, function () {
                    onError(FAILURE.DESERIALIZATION);
                });
            }
        }
    }
}