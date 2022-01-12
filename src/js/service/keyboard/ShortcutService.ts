module pskl {
    export module service {
        export module keyboard {
            export class ShortcutService {
                shortcuts_: any[];
                constructor() {
                    this.shortcuts_ = [];
                }

                /**
                 * @public
                 */
                init() {
                    document.body.addEventListener('keydown', this.onKeyDown_.bind(this));
                }

                /**
                 * Add a keyboard shortcut
                 * @param {pskl.service.keyboard.Shortcut} shortcut
                 * @param {Function} callback should return true to let the original event perform its default action
                 */
                registerShortcut(shortcut, callback) {
                    if (!(shortcut instanceof Shortcut)) {
                        throw 'Invalid shortcut argument, please use instances of pskl.service.keyboard.Shortcut';
                    }

                    if (typeof callback != 'function') {
                        throw 'Invalid callback argument, please provide a function';
                    }

                    this.shortcuts_.push({
                        shortcut: shortcut,
                        callback: callback
                    });
                }

                unregisterShortcut(shortcut) {
                    var index = -1;
                    this.shortcuts_.forEach(function (s, i) {
                        if (s.shortcut === shortcut) {
                            index = i;
                        }
                    });
                    if (index != -1) {
                        this.shortcuts_.splice(index, 1);
                    }
                }

                /**
                 * @private
                 */
                onKeyDown_(evt) {
                    var eventKey = KeyUtils.createKeyFromEvent(evt);
                    if (this.isInInput_(evt) || !eventKey) {
                        return;
                    }

                    this.shortcuts_.forEach(function (shortcutInfo) {
                        shortcutInfo.shortcut.getKeys().forEach(function (shortcutKey) {
                            if (!KeyUtils.equals(shortcutKey, eventKey)) {
                                return;
                            }

                            var bubble = shortcutInfo.callback(eventKey.key);
                            if (bubble !== true) {
                                evt.preventDefault();
                            }
                            $.publish(Events.KEYBOARD_EVENT, [evt]);
                        }.bind(this));
                    }.bind(this));
                }

                isInInput_(evt) {
                    var targetTagName = evt.target.nodeName.toUpperCase();
                    return targetTagName === 'INPUT' || targetTagName === 'TEXTAREA';
                }

                getShortcutById(id) {
                    return pskl.utils.Array.find(this.getShortcuts(), function (shortcut) {
                        return shortcut.getId() === id;
                    });
                }

                getShortcuts() {
                    var shortcuts = [];
                    Shortcuts.CATEGORIES.forEach(function (category) {
                        var shortcutMap = Shortcuts[category];
                        Object.keys(shortcutMap).forEach(function (shortcutKey) {
                            shortcuts.push(shortcutMap[shortcutKey]);
                        });
                    });
                    return shortcuts;
                }

                updateShortcut(shortcut, keyAsString) {
                    var key = keyAsString.replace(/\s/g, '');

                    var isForbiddenKey = Shortcuts.FORBIDDEN_KEYS.indexOf(key) != -1;
                    if (isForbiddenKey) {
                        $.publish(Events.SHOW_NOTIFICATION, [{
                            'content': 'Key cannot be remapped (' + keyAsString + ')',
                            'hideDelay': 5000
                        }]);
                    } else {
                        this.removeKeyFromAllShortcuts_(key);
                        shortcut.updateKeys([key]);
                        $.publish(Events.SHORTCUTS_CHANGED);
                    }
                }

                removeKeyFromAllShortcuts_(key) {
                    this.getShortcuts().forEach(function (s) {
                        if (s.removeKeys([key])) {
                            $.publish(Events.SHOW_NOTIFICATION, [{
                                'content': 'Shortcut key removed for ' + s.getId(),
                                'hideDelay': 5000
                            }]);
                        }
                    });
                }

                /**
                 * Restore the default piskel key for all shortcuts
                 */
                restoreDefaultShortcuts() {
                    this.getShortcuts().forEach(function (shortcut) {
                        shortcut.restoreDefault();
                    });
                    $.publish(Events.SHORTCUTS_CHANGED);
                }
            }

        }
    }
}