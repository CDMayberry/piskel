
module pskl {
    export module utils {
        export module UserAgent {            
            const ua = navigator.userAgent;

            export const isIE = /MSIE/i.test(ua);
            export const isIE11 = /trident/i.test(ua);
            export const isEdge = /edge\//i.test(ua);
            export const isFirefox = /Firefox/i.test(ua);
            export const isMac = /Mac/.test(ua);
            export const isOpera = /OPR\//.test(ua);
            export const hasChrome = /Chrome/i.test(ua);
            export const hasSafari = /Safari\//.test(ua);

            export const isChrome = hasChrome && !isOpera && !isEdge;
            export const isSafari = hasSafari && !isOpera && !isEdge;

            export const supportedUserAgents = [
                'isIE11',
                'isEdge',
                'isChrome',
                'isFirefox'
            ];            

            export const version = (function () {
                if (pskl.utils.UserAgent.isIE) {
                    return parseInt(/MSIE\s?(\d+)/i.exec(ua)[1], 10);
                } else if (pskl.utils.UserAgent.isChrome) {
                    return parseInt(/Chrome\/(\d+)/i.exec(ua)[1], 10);
                } else if (pskl.utils.UserAgent.isFirefox) {
                    return parseInt(/Firefox\/(\d+)/i.exec(ua)[1], 10);
                }
            })();

            export function isUnsupported() {
                // Check that none of the supported UAs are set to true.
                return supportedUserAgents.every(function (uaTest) {
                    return !UserAgent[uaTest];
                });
            };
        
            export function getDisplayName() {
                if (isIE) {
                    return 'Internet Explorer';
                } else if (isChrome) {
                    return 'Chrome';
                } else if (isFirefox) {
                    return 'Firefox';
                } else if (isSafari) {
                    return 'Safari';
                } else if (isOpera) {
                    return 'Opera';
                } else {
                    return ua;
                }
            };
        }

    }
}