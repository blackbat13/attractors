/**
 * Created by blackbat on 06.04.2017.
 */
class CliffordAttractor extends Attractor {
    constructor(canvasId) {
        super(canvasId, ["a", "b", "c", "d"]);
    }

    prepareBeginningValues() {
        this.values = [-1.4, 1.6, 1.0, 0.7];
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
            xn = Math.sin(this.values[0] * this.y) + this.values[2] * Math.cos(this.values[0] * this.x);
            yn = Math.sin(this.values[1] * this.x) + this.values[3] * Math.cos(this.values[1] * this.y);
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

            this.ctx.fillStyle = "rgba(" + rgb[0] * 255 + "," + rgb[1] * 255 + "," + rgb[2] * 255 + "," + this.opacity + ")";
            this.ctx.fillRect(cx, cy, 1, 1);

            this.pixels[cx][cy] = this.pixels[cx][cy] < 20 ? this.pixels[cx][cy] + 1 : 0;
        }
    }

    prepareExamples() {
        this.examples[0] = {
            name: "1",
            values: [-1.4, 1.6, 1.0, 0.7],
            opacity: 0.05
        };
        this.examples[1] = {
            name: "2",
            values: [1.6, -0.6, -1.2, 1.6],
            opacity: 0.05
        };
        this.examples[2] = {
            name: "3",
            values: [1.7, 1.7, 0.6, 1.2],
            opacity: 0.05
        };
        this.examples[3] = {
            name: "4",
            values: [1.5, -1.8, 1.6, 0.9],
            opacity: 0.05
        };
        this.examples[4] = {
            name: "5",
            values: [-1.7, 1.3, -0.1, -1.2],
            opacity: 0.05
        };
        this.examples[5] = {
            name: "6",
            values: [-1.7, 1.8, -1.9, -0.4],
            opacity: 0.05
        };
        this.examples[6] = {
            name: "7",
            values: [-1.8, -2.0, -0.5, -0.9],
            opacity: 0.05
        };
        this.examples[7] = {
            name: "8",
            values: [1.7, 1.2, -0.4, 1.3],
            opacity: 0.05
        };
        this.examples[8] = {
            name: "9",
            values: [1.5, -1.8, 1.6, 2],
            opacity: 0.05
        };
        this.examples[9] = {
            name: "10",
            values: [-2.0, -2.0, -0.7, -1.3],
            opacity: 0.05
        };
    }
}