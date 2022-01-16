module pskl {
    export module model {
        export class Palette {
            id: any;
            name: any;
            colors: any[];

            constructor(id, name, colors) {
                this.id = id;
                this.name = name;
                this.colors = colors;
            }

            static fromObject(paletteObj: Palette) {
                var colors = paletteObj.colors.slice(0, paletteObj.colors.length);
                return new Palette(paletteObj.id, paletteObj.name, colors);
            }


            getColors() {
                return this.colors;
            }

            setColors (colors) {
                this.colors = colors;
            }

            get(index) {
                return this.colors[index];
            }

            set(index, color) {
                this.colors[index] = color;
            }

            add(color) {
                this.colors.push(color);
            }

            size() {
                return this.colors.length;
            }

            removeAt(index) {
                this.colors.splice(index, 1);
            }

            move(oldIndex, newIndex) {
                this.colors.splice(newIndex, 0, this.colors.splice(oldIndex, 1)[0]);
            }

        }
    }
}