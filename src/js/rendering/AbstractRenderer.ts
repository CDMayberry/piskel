module pskl {
    export module rendering {
        export abstract class AbstractRenderer {
            
            protected clear?(): void;
            protected render?(frame): void;
            protected getCoordinates?(x, y): void;

            protected setGridWidth?(width): void;
            protected getGridWidth?(): void;

            protected setZoom?(zoom): void;
            protected getZoom?(): void;

            protected setOffset?(x, y): void;
            protected getOffset?(): void;

            protected setDisplaySize?(width, height): void;
            protected getDisplaySize?(): void;
        }
    }
}