module pskl {
    export module utils {
        export module UserSettings {
            export const GRID_COLOR = 'GRID_COLOR';
            export const GRID_ENABLED = 'GRID_ENABLED';
            export const GRID_WIDTH = 'GRID_WIDTH'
            export const GRID_SPACING = 'GRID_SPACING'
            export const MAX_FPS = 'MAX_FPS'
            export const DEFAULT_SIZE = 'DEFAULT_SIZE'
            export const CANVAS_BACKGROUND = 'CANVAS_BACKGROUND'
            export const SELECTED_PALETTE = 'SELECTED_PALETTE'
            export const SEAMLESS_OPACITY = 'SEAMLESS_OPACITY'
            export const SEAMLESS_MODE = 'SEAMLESS_MODE'
            export const PREVIEW_SIZE = 'PREVIEW_SIZE'
            export const ONION_SKIN = 'ONION_SKIN'
            export const LAYER_PREVIEW = 'LAYER_PREVIEW'
            export const LAYER_OPACITY = 'LAYER_OPACITY'
            export const EXPORT_SCALE = 'EXPORT_SCALE'
            export const EXPORT_TAB = 'EXPORT_TAB'
            export const EXPORT_GIF_REPEAT = 'EXPORT_GIF_REPEAT'
            export const PEN_SIZE = 'PEN_SIZE'
            export const RESIZE_SETTINGS = 'RESIZE_SETTINGS'
            export const COLOR_FORMAT = 'COLOR_FORMAT'
            export const TRANSFORM_SHOW_MORE = 'TRANSFORM_SHOW_MORE'
            export const PREFERENCES_TAB = 'PREFERENCES_TAB'
            export const KEY_TO_DEFAULT_VALUE_MAP_ = {
                'GRID_COLOR': Constants.TRANSPARENT_COLOR,
                'GRID_ENABLED': false,
                'GRID_WIDTH': 1,
                'GRID_SPACING': 1,
                'MAX_FPS': 24,
                'DEFAULT_SIZE': {
                    width: Constants.DEFAULT.WIDTH,
                    height: Constants.DEFAULT.HEIGHT
                },
                'CANVAS_BACKGROUND': 'lowcont-dark-canvas-background',
                'SELECTED_PALETTE': Constants.CURRENT_COLORS_PALETTE_ID,
                'SEAMLESS_OPACITY': 0.30,
                'SEAMLESS_MODE': false,
                'PREVIEW_SIZE': 'original',
                'ONION_SKIN': false,
                'LAYER_OPACITY': 0.2,
                'LAYER_PREVIEW': true,
                'EXPORT_SCALE': 1,
                'EXPORT_TAB': 'gif',
                'EXPORT_GIF_REPEAT': true,
                'PEN_SIZE': 1,
                'RESIZE_SETTINGS': {
                    maintainRatio: true,
                    resizeContent: false,
                    origin: 'TOPLEFT'
                },
                COLOR_FORMAT: 'hex',
                TRANSFORM_SHOW_MORE: false,
                PREFERENCES_TAB: 'misc',
            }

            /**
             * @private
             */
            const cache_ = {}

            /**
             * Static method to access a user defined settings value ot its default
             * value if not defined yet.
             */
            export function get(key) {
                this.checkKeyValidity_(key);
                if (!(key in this.cache_)) {
                    var storedValue = this.readFromLocalStorage_(key);
                    if (typeof storedValue !== 'undefined' && storedValue !== null) {
                        this.cache_[key] = storedValue;
                    } else {
                        this.cache_[key] = this.readFromDefaults_(key);
                    }
                }
                return this.cache_[key];
            }

            export function set(key, value) {
                this.checkKeyValidity_(key);
                this.cache_[key] = value;
                this.writeToLocalStorage_(key, value);

                $.publish(Events.USER_SETTINGS_CHANGED, [key, value]);
            }

            /**
             * @private
             */
            export function readFromLocalStorage_(key) {
                var value = window.localStorage[key];
                if (typeof value != 'undefined') {
                    value = JSON.parse(value);
                }
                return value;
            }

            /**
             * @private
             */
            export function writeToLocalStorage_(key, value) {
                // TODO(grosbouddha): Catch storage exception here.
                window.localStorage[key] = JSON.stringify(value);
            }

            /**
             * @private
             */
            export function readFromDefaults_(key) {
                return this.KEY_TO_DEFAULT_VALUE_MAP_[key];
            }

            /**
             * @private
             */
            export function checkKeyValidity_(key) {
                if (key.indexOf(pskl.service.keyboard.Shortcut.USER_SETTINGS_PREFIX) === 0) {
                    return true;
                }

                var isValidKey = key in this.KEY_TO_DEFAULT_VALUE_MAP_;
                if (!isValidKey) {
                    console.error('UserSettings key <' + key + '> not found in supported keys.');
                }
            }
        }
    }
}