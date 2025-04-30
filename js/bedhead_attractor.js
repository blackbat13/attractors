/**
 * Created by blackbat on 06.04.2017.
 */
class BedheadAttractor extends Attractor {
    constructor(canvasId) {
        super(canvasId, ['a', 'b']);
    }

    prepareBeginningValues() {
        this.values = [0.65343, 0.7345345];
    }

    prepareScale() {
        this.scale = this.sizeX / 6;
    }

    draw() {
        requestAnimationFrame(this.draw.bind(this));
        if (this.stop) {
            return;
        }

        this.animationMode();
        let xn, yn;
        for (let i = 0; i < this.speed; ++i) {
            xn = Math.sin(this.y * this.x / this.values[1]) * this.y + Math.cos(this.values[0] * this.x - this.y);
            yn = this.x + Math.sin(this.y) / this.values[1];
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
            values: [0.65343, 0.7345345],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [-0.81, -0.92],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [-0.64, 0.76],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [0.06, 0.98],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [-0.67, 0.83],
            opacity: 0.05
        };
    }
}