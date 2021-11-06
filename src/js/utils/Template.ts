module pskl {
    export module utils {
        export module Template {
            var templates = {};
            export function get(templateId) {
                if (!templates[templateId]) {
                    var template = document.getElementById(templateId);
                    if (template) {
                        templates[templateId] = template.innerHTML;
                    } else {
                        console.error('Could not find template for id :', templateId);
                    }
                }
                return templates[templateId];
            }

            export function getAsHTML(templateId) {
                var template = get(templateId);
                if (!template) {
                    return;
                }

                return createFromHTML(template);
            }

            export function createFromHTML(html) {
                var dummyEl = _getDummyEl();
                dummyEl.innerHTML = html;
                var element = dummyEl.children[0];

                if (!pskl.utils.UserAgent.isIE11) {
                    dummyEl.innerHTML = '';
                }

                return element;
            }

            export function replace(template, dict) {
                for (var key in dict) {
                    if (dict.hasOwnProperty(key)) {
                        var value = dict[key];

                        // special boolean keys keys key:default
                        // if the value is a boolean, use default as value
                        if (key.indexOf(':') !== -1) {
                            if (value === true) {
                                value = key.split(':')[1];
                            } else if (value === false) {
                                value = '';
                            }
                        }

                        // Sanitize all values expect if the key is surrounded by `!`
                        if (!/^!.*!$/.test(key)) {
                            value = sanitize(value);
                        }

                        template = template.replace(new RegExp('\\{\\{' + key + '\\}\\}', 'g'), value);
                    }
                }
                return template;
            }

            export function getAndReplace(templateId, dict) {
                var result = '';
                var tpl = pskl.utils.Template.get(templateId);
                if (tpl) {
                    result = pskl.utils.Template.replace(tpl, dict);
                }
                return result;
            }

            /**
             * Sanitize the provided string to make it safer for using in templates.
             */
            export function sanitize(string) {
                var dummyEl = _getDummyEl();

                // Apply the unsafe string as text content and
                dummyEl.textContent = string;
                var sanitizedString = dummyEl.innerHTML;

                if (!pskl.utils.UserAgent.isIE11) {
                    dummyEl.innerHTML = '';
                }

                return sanitizedString;
            }

            var _dummyEl;
            export var _getDummyEl = pskl.utils.UserAgent.isIE11 ?
                // IE11 specific implementation
                function () {
                    return document.createElement('div');
                } :
                // Normal, sane browsers implementation.
                function () {
                    if (!_dummyEl) {
                        _dummyEl = document.createElement('div');
                    }
                    return _dummyEl;
                }
        }
    }
}