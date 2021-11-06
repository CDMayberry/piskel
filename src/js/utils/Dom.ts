module pskl {
    export module utils {
        export module Dom {
            /**
             * Check if a given HTML element is nested inside another
             * @param node  Element to test
             * @param parent Potential Ancestor for node
             * @param excludeParent set to true if the parent should be excluded from potential matches
             * @return true if parent was found amongst the parentNode chain of node
             */
            export function isParent(node: HTMLElement|ParentNode, parent: HTMLElement, excludeParent: boolean) {
                if (node && parent) {
                    if (excludeParent) {
                        node = node.parentNode;
                    }

                    while (node) {
                        if (node === parent) {
                            return true;
                        }
                        node = node.parentNode;
                    }
                }
                return false;
            }

            export function getParentWithData(node, dataName) {
                while (node) {
                    if (node.dataset && typeof node.dataset[dataName] !== 'undefined') {
                        return node;
                    }
                    node = node.parentNode;
                }
                return null;
            }

            export function getData(node, dataName) {
                var parent = getParentWithData(node, dataName);
                if (parent !== null) {
                    return parent.dataset[dataName];
                }
            }

            export function removeClass(className, container) {
                container = container || document;
                var elements = container.querySelectorAll('.' + className);
                for (var i = 0; i < elements.length; i++) {
                    elements[i].classList.remove(className);
                }
            }
        }
    }
}