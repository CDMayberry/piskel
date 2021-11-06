module pskl {
    export module utils {
        export module Event {
            export function addEventListener(el, type, callback, scope, args) {
                if (typeof el === 'string') {
                    el = document.querySelector(el);
                }

                var listener = {
                    el: el,
                    type: type,
                    callback: callback,
                    handler: args ? callback.bind(scope, args) : callback.bind(scope)
                };

                scope.__pskl_listeners = scope.__pskl_listeners || [];
                scope.__pskl_listeners.push(listener);
                el.addEventListener(type, listener.handler);
            };

            export function removeEventListener(el, type, callback, scope) {
                if (scope && scope.__pskl_listeners) {
                    var listeners = scope.__pskl_listeners;
                    for (var i = 0; i < listeners.length; i++) {
                        var listener = listeners[i];
                        if (listener.callback === callback && listener.el === el && listener.type === type) {
                            el.removeEventListener(type, listeners[i].handler);
                            listeners.splice(i, 1);
                            break;
                        }
                    }
                }
            };

            export function removeAllEventListeners(scope) {
                if (scope && scope.__pskl_listeners) {
                    var listeners = scope.__pskl_listeners;
                    for (var i = 0; i < listeners.length; i++) {
                        var listener = listeners[i];
                        listener.el.removeEventListener(listener.type, listener.handler);
                    }
                    scope.__pskl_listeners = [];
                }
            };
        }
    }
}