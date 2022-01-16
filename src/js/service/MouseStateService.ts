module pskl {
    export module service {
        var BUTTON_UNSET = null;

        export class MouseStateService {
            lastButtonPressed_: any;
            constructor() {
                this.lastButtonPressed_ = BUTTON_UNSET;
            }

            init() {
                $.subscribe(Events.MOUSE_EVENT, this.onMouseEvent_.bind(this));
            };

            isLeftButtonPressed() {
                return this.isMouseButtonPressed_(Constants.LEFT_BUTTON);
            };

            isRightButtonPressed() {
                return this.isMouseButtonPressed_(Constants.RIGHT_BUTTON);
            };

            isMiddleButtonPressed() {
                return this.isMouseButtonPressed_(Constants.MIDDLE_BUTTON);
            };

            isMouseButtonPressed_(mouseButton) {
                return this.lastButtonPressed_ != BUTTON_UNSET && this.lastButtonPressed_ == mouseButton;
            };

            onMouseEvent_(evt, mouseEvent) {
                if (mouseEvent.type == 'mousedown') {
                    this.lastButtonPressed_ = mouseEvent.button;
                } else if (mouseEvent.type == 'mouseup') {
                    this.lastButtonPressed_ = BUTTON_UNSET;
                }
            };
        }
    }
}