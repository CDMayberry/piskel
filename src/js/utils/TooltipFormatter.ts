module pskl {
    export module utils {
        export module TooltipFormatter {
            export function format(helpText, shortcut, descriptors) {
                var tpl = Template.get('tooltip-container-template');
                shortcut = shortcut ? '(' + shortcut.getDisplayKey() + ')' : '';
                return Template.replace(tpl, {
                    helptext: helpText,
                    shortcut: shortcut,
                    // Avoid sanitization for descriptors (markup)
                    '!descriptors!': this.formatDescriptors_(descriptors)
                });
            };

            export function formatDescriptors_(descriptors) {
                descriptors = descriptors || [];
                return descriptors.reduce(function (p, descriptor) {
                    return p += this.formatDescriptor_(descriptor);
                }.bind(this), '');
            };

            export function formatDescriptor_(descriptor) {
                var tpl;
                if (descriptor.key) {
                    tpl = Template.get('tooltip-modifier-descriptor-template');
                    descriptor.key = descriptor.key.toUpperCase();
                    if (UserAgent.isMac) {
                        descriptor.key = descriptor.key.replace('CTRL', 'CMD');
                        descriptor.key = descriptor.key.replace('ALT', 'OPTION');
                    }
                } else {
                    tpl = Template.get('tooltip-simple-descriptor-template');
                }
                return Template.replace(tpl, descriptor);
            };
        }
    }
}