/**
 *  detection method from:
 *  http://videlais.com/2014/08/23/lessons-learned-from-detecting-node-webkit/
 */

module pskl {
    export module utils {
        export module Environment {
            export function detectNodeWebkit() {
                var isNode = (typeof window.process !== 'undefined' && typeof window.require !== 'undefined');
                var isNodeWebkit = false;
                if (isNode) {
                    try {
                        isNodeWebkit = (typeof window.require('nw.gui') !== 'undefined');
                    } catch (e) {
                        isNodeWebkit = false;
                    }
                }
                return isNodeWebkit;
            }

            export function isIntegrationTest() {
                return window.location.href.indexOf('integration-test') !== -1;
            }

            export function isDebug() {
                return window.location.href.indexOf('debug') !== -1;
            }

            export function isHttps() {
                return window.location.href.indexOf('https://') === 0;
            }

        }
    }
}