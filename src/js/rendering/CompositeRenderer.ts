module pskl {
    export module rendering {

        export class CompositeRenderer extends AbstractRenderer {
            renderers: any[];

            constructor() {
                super();
                this.renderers = [];
            }

            add(renderer) {
                this.renderers.push(renderer);
                return this;
            }

            clear() {
                this.renderers.forEach(function (renderer) {
                    renderer.clear();
                });
            }

            setZoom(zoom) {
                this.renderers.forEach(function (renderer) {
                    renderer.setZoom(zoom);
                });
            }

            getZoom() {
                return this.getSampleRenderer_().getZoom();
            }

            setDisplaySize(w, h) {
                this.renderers.forEach(function (renderer) {
                    renderer.setDisplaySize(w, h);
                });
            }

            getDisplaySize() {
                return this.getSampleRenderer_().getDisplaySize();
            }

            setOffset(x, y) {
                this.renderers.forEach(function (renderer) {
                    renderer.setOffset(x, y);
                });
            }

            getOffset() {
                return this.getSampleRenderer_().getOffset();
            }

            setGridWidth(b) {
                this.renderers.forEach(function (renderer) {
                    renderer.setGridWidth(b);
                });
            }

            getGridWidth () {
                return this.getSampleRenderer_().getGridWidth();
            }

            getSampleRenderer_ () {
                if (this.renderers.length > 0) {
                    return this.renderers[0];
                } else {
                    throw 'Renderer manager is empty';
                }
            }
        }
    }
}