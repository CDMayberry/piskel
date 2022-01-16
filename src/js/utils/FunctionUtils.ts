module pskl {
    export module utils {
        export module FunctionUtils {
            export function memo(fn, cache, scope?) {
                var memoized = function () {
                    var key = window.Array.prototype.join.call(arguments, '-');
                    if (!cache[key]) {
                        cache[key] = fn.apply(scope, arguments);
                    }
                    return cache[key];
                };
                return memoized;
            }

            /**
             * Returns a throttled version of the provided method, that will be called at most
             * every X milliseconds, where X is the provided interval.
             */
            export function throttle(fn: () => void, interval: number) {
                var last;
                var timer;
                return function () {
                    var now = Date.now();
                    if (last && now < last + interval) {
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            last = now;
                            fn();
                        }, interval);
                    } else {
                        last = now;
                        fn();
                    }
                };
            }
        }
    }
}