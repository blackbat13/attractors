/**
 * Created by blackbat on 06.04.2017.
 */
class SvenssonAttractor extends Attractor {
    constructor(canvasId) {
        super(canvasId, ['a', 'b', 'c', 'd']);
    }

    prepareBeginningValues() {
        this.values = [-2.538, 1.362, 1.315, 0.513];
    }

    prepareScale() {
        this.scale = this.sizeX / 6;
    }

    setBeginningCoordinates() {
        this.x = 0.1;
        this.y = 0.1;
    }

    draw() {
        requestAnimationFrame(this.draw.bind(this));
        if (this.stop) {
            return;
        }

        this.animationMode();
        let xn, yn;
        for (let i = 0; i < this.speed; ++i) {
            xn = this.values[3] * Math.sin(this.values[0] * this.y) - Math.cos(this.values[1] * this.x);
            yn = this.values[2] * Math.sin(this.values[0] * this.x) + Math.cos(this.values[1] * this.y);
            this.x = xn;
            this.y = yn;
            let cx = Math.round(this.centerX + this.x * this.scale),
                cy = Math.round(this.centerY + this.y * this.scale);
            if (cx < 0 || cy < 0 || cx > this.sizeX || cy > this.sizeY) {
                continue;
            }

            let val = this.pixels[cx][cy];
            let rgb = this.hex2rgb(this.color);
            rgb[0] -= rgb[0] * val * this.percent > 0 ? rgb[0] * val * this.percent : 0;
            rgb[1] -= rgb[1] * val * this.percent > 0 ? rgb[1] * val * this.percent : 0;
            rgb[2] -= rgb[2] * val * this.percent > 0 ? rgb[2] * val * this.percent : 0;

            this.ctx.fillStyle = 'rgba(' + rgb[0] * 255 + ',' + rgb[1] * 255 + ',' + rgb[2] * 255 + ',' + this.opacity + ')';
            this.ctx.fillRect(cx, cy, 1, 1);

            this.pixels[cx][cy] = this.pixels[cx][cy] < 20 ? this.pixels[cx][cy] + 1 : 0;
        }
    }

    prepareExamples() {
        let n = 0;
        this.examples[n++] = {
            name: n,
            values: [-2.538, 1.362, 1.315, 0.513],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [1.913, 2.796, 1.468, 1.01],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [-2.337, -2.337, 0.533, 1.378],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [-2.722, 2.574, 1.284, 1.043],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [1.40, 1.56, 1.40, -6.56],
            opacity: 0.15
        };
    }
}