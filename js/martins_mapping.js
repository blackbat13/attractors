/**
 * Created by blackbat on 07.04.2017.
 */

class MartinsMapping extends Attractor {
    constructor(canvasId) {
        super(canvasId, ["a", "b", "c", "d", "p"]);
    }

    prepareBeginningValues() {
        this.values = [-2.7, 0.6, -1.0, 1.0, 0.5];
    }

    prepareScale() {
        this.scale = 5;
    }

    draw() {
        requestAnimationFrame(this.draw.bind(this));
        if (this.stop) {
            return;
        }

        this.animationMode();
        let xn, yn;
        let color = Brushy.randomHexColor();

        for (let i = 0; i < this.speed; ++i) {
            xn = this.y - this.sgn(this.x) * Math.pow((Math.abs(this.values[1]*this.x-this.values[2])), this.values[4]/this.values[3]);
            yn = this.values[0] - this.x;
            this.x = xn;
            this.y = yn;
            let cx = Math.round(this.centerX + this.x * this.scale),
                cy = Math.round(this.centerY + this.y * this.scale);
            if (cx < 0 || cy < 0 || cx > this.sizeX || cy > this.sizeY) {
                continue;
            }

            let val = this.pixels[cx][cy];
            let rgb = this.hex2rgb(this.color);

            if(this.randomColor) {
                rgb = this.hex2rgb(color);
            }

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
            values: [-2.7, 0.6, -1.0, 1.0, 0.5],
            opacity: 0.05
        };
        this.examples[1] = {
            name: "2",
            values: [-2.6,0.6,-1.0,1.0,0.5],
            opacity: 0.05
        };
        this.examples[2] = {
            name: "3",
            values: [-2.75,0.6,-1.0,1.0,0.5],
            opacity: 0.05
        };
        this.examples[3] = {
            name: "4",
            values: [-2.62,0.6,-1.0,1.0,0.5],
            opacity: 0.05
        };
        this.examples[4] = {
            name: "5",
            values: [-2.751,0.6,-1.0,1.0,0.5],
            opacity: 0.05
        };
        this.examples[5] = {
            name: "6",
            values: [-2.6,0.7,-1.0,1.0,0.5],
            opacity: 0.05
        };
        this.examples[6] = {
            name: "7",
            values: [-2.6,0.75,-1.0,1.0,0.5],
            opacity: 0.05
        };
        this.examples[7] = {
            name: "8",
            values: [-2.6,0.76,-1.0,1.0,0.5],
            opacity: 0.05
        };
        this.examples[8] = {
            name: "9",
            values: [-2.6,0.761,-1.0,1.0,0.5],
            opacity: 0.05
        };
        this.examples[9] = {
            name: "10",
            values: [-2.6,0.6,-1.0,1.2,0.5],
            opacity: 0.05
        };
        this.examples[10] = {
            name: "11",
            values: [-2.6,0.6,-1.0,1.22,0.5],
            opacity: 0.05
        };
        this.examples[11] = {
            name: "12",
            values: [-2.6,0.6,-0.9,1.0,0.5],
            opacity: 0.05
        };
        this.examples[12] = {
            name: "13",
            values: [-2.6,0.6,-0.85,1.0,0.5],
            opacity: 0.05
        };
        this.examples[13] = {
            name: "14",
            values: [-2.6,0.6,0.84,1.0,0.5],
            opacity: 0.05
        };
        this.examples[14] = {
            name: "15",
            values: [-2.6,0.6,-1.0,1.0,0.6],
            opacity: 0.05
        };
        this.examples[15] = {
            name: "16",
            values: [-2.6,0.6,-1.0,1.0,0.65],
            opacity: 0.05
        };
        this.examples[16] = {
            name: "17",
            values: [-2.6,0.6,-1.0,1.0,0.651],
            opacity: 0.05
        };
        this.examples[17] = {
            name: "18",
            values: [-1.796,1.204,-0.785,1.225,1],
            opacity: 0.05
        };
        this.examples[18] = {
            name: "19",
            values: [-2.372,0.901,1.518,1.812,1],
            opacity: 0.05
        };
    }
}