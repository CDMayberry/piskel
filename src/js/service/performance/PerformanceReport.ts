module pskl {
    export module service {
        export module performance {
            export class PerformanceReport {
                resolution: boolean;
                layers: boolean;
                frames: boolean;
                colors: boolean;
                overall: boolean;

                constructor(piskel, colorsCount) {
                    var pixels = piskel.getWidth() * piskel.getHeight();
                    this.resolution = pixels > (512 * 512);

                    var layersCount = piskel.getLayers().length;
                    this.layers = layersCount > 25;

                    var framesCount = piskel.getLayerAt(0).size();
                    this.frames = framesCount > 100;

                    this.colors = colorsCount >= 256;

                    var overallScore = (pixels / 2620) + (layersCount * 4) + framesCount + (colorsCount * 100 / 256);
                    this.overall = overallScore > 200;
                }


                equals(report) {
                    return (report instanceof PerformanceReport &&
                        this.resolution == report.resolution &&
                        this.layers == report.layers &&
                        this.frames == report.frames &&
                        this.colors == report.colors &&
                        this.overall == report.overall);
                }

                hasProblem() {
                    return this.resolution || this.layers || this.frames || this.colors || this.overall;
                }
            }
        }
    }
}