module pskl {
    export module utils {
        export module Xhr {
            export function get(url, success, error) {
                var xhr = xhr_(url, 'GET', success, error);
                xhr.send();
            }

            export function post(url, data, success, error) {
                var xhr = xhr_(url, 'POST', success, error);
                var formData = new FormData();

                if (typeof data == 'object') {
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            formData.append(key, data[key]);
                        }
                    }
                }

                xhr.send(formData);
            }

            export function xhr_(url, method, success, error) {
                success = success || function () { };
                error = error || function () { };

                var xhr = new XMLHttpRequest();
                xhr.open(method, url, true);

                xhr.onload = function (e) {
                    if (this.status == 200) {
                        success(this);
                    } else {
                        //@ts-ignore
                        this.onerror(this, e);
                    }
                };

                xhr.onerror = function (e) {
                    error(e, this);
                };

                return xhr;
            }
        }
    }
}