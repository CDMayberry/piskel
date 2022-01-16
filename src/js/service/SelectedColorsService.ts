module pskl {
    export module service {
        export class SelectedColorsService {
            primaryColor_: string;
            secondaryColor_: string;
            constructor() {
                this.primaryColor_ = Constants.DEFAULT_PEN_COLOR;
                this.secondaryColor_ = Constants.TRANSPARENT_COLOR;
            }

            init() {
                $.subscribe(Events.PRIMARY_COLOR_SELECTED, this.onPrimaryColorUpdate_.bind(this));
                $.subscribe(Events.SECONDARY_COLOR_SELECTED, this.onSecondaryColorUpdate_.bind(this));
            }

            getPrimaryColor() {
                return this.primaryColor_;
            }

            getSecondaryColor() {
                return this.secondaryColor_;
            }

            onPrimaryColorUpdate_(evt, color) {
                this.primaryColor_ = color;
            }

            onSecondaryColorUpdate_(evt, color) {
                this.secondaryColor_ = color;
            }
        }
    }
}