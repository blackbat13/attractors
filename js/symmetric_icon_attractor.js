/**
 * Created by blackbat on 06.04.2017.
 */
class SymmetricIconAttractor extends Attractor {
    constructor(canvasId) {
        super(canvasId, ['l', 'a', 'b', 'g', 'o', 'd']);
    }

    prepareBeginningValues() {
        this.values = [-2.5, 5.0, -1.9, 1.0, 0.188, 5.0];
    }

    prepareScale() {
        this.scale = this.sizeX / 3;
    }

    setBeginningCoordinates() {
        this.x = 0.01;
        this.y = 0.01;
    }

    draw() {
        requestAnimationFrame(this.draw.bind(this));
        if (this.stop) {
            return;
        }

        this.animationMode();
        let xn, yn;
        for (let i = 0; i < this.speed; ++i) {
            let zzbar = this.x * this.x + this.y * this.y;
            let p = this.values[1] * zzbar + this.values[0];
            let zreal = this.x;
            let zimag = this.y;
            for (let j = 1; j <= this.values[5] - 2; j++) {
                let za = zreal * this.x - zimag * this.y;
                let zb = zimag * this.x + zreal * this.y;
                zreal = za;
                zimag = zb;
            }

            let zn = this.x * zreal - this.y * zimag;
            p = p + this.values[2] * zn;
            xn = p * this.x + this.values[3] * zreal - this.values[4] * this.y;
            yn = p * this.y - this.values[3] * zimag + this.values[4] * this.x;
            this.x = xn;
            this.y = yn;

            let cx = Math.round(this.centerX + this.x * this.scale),
                cy = Math.round(this.centerY + this.y * this.scale);
            if (cx < 0 || cy < 0 || cx > this.sizeX || cy > this.sizeY) {
                continue;
            }

            let rgb = this.hex2rgb(this.color);

            this.ctx.fillStyle = 'rgba(' + rgb[0] * 255 + ',' + rgb[1] * 255 + ',' + rgb[2] * 255 + ',' + this.opacity + ')';
            this.ctx.fillRect(cx, cy, 1, 1);
        }
    }

    prepareExamples() {
        let n = 0;
        this.examples[n++] = {
            name: n,
            values: [-2.5, 5, -1.9, 1, 0.188, 5],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [1.56, -1, 0.1, -0.82, 0.12, 3],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [-1.806, 1.806, 0, 1, 0, 5],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [-2.195, 10, -12, 1, 0, 3],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [2.5, -2.5, 0, 0.9, 0, 3],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [-2.05, 3, -16.79, 1, 0, 9],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [-2.7, 5, 1.5, 1, 0, 6],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [2.409, -2.5, 0, 0.9, 0, 23],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [-2.08, 1, -0.1, 0.167, 0, 7],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [-2.32, 2.32, 0, 0.75, 0, 5],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [2.6, -2, 0, -0.5, 0, 5],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [-2.34, 2, 0.2, 0.1, 0, 5],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [-1.86, 2, 0, 1, 0.1, 4],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [1.56, -1, 0.1, -0.82, 0, 3],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [1.5, -1, 0.1, -0.805, 0, 3],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [1.455, -1, 0.03, -0.8, 0, 3],
            opacity: 0.05
        };
        this.examples[n++] = {
            name: n,
            values: [2.39, -2.5, -0.1, 0.9, -0.15, 16],
            opacity: 0.05
        };
    }
}