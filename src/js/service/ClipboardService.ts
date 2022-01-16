module pskl {
    export module service {
        export class ClipboardService {
            piskelController: any;
            constructor(piskelController) {
                this.piskelController = piskelController;
            }

            init() {
                window.addEventListener('copy', this._onCopy.bind(this), true);
                window.addEventListener('cut', this._onCut.bind(this), true);
                window.addEventListener('paste', this._onPaste.bind(this), true);
            }

            _onCut(event) {
                $.publish(Events.CLIPBOARD_CUT, event);
            }

            _onCopy(event) {
                $.publish(Events.CLIPBOARD_COPY, event);
            }

            _onPaste(event) {
                $.publish(Events.CLIPBOARD_PASTE, event);
            }
        }
    }
}