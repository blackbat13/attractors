/**
 * Created by blackbat on 06.04.2017.
 */
class Attractor {

    constructor(canvasId, valuesNames) {
        this.$canvas = $('#' + canvasId);
        this.canvasId = canvasId;
        this.valuesNames = valuesNames;
    }

    init() {
        this.prepareVariables();
        this.setSliders();
        this.prepareEvents();
        this.clearPixelsArray();
        requestAnimationFrame(this.draw.bind(this));
    }

    prepareVariables() {
        this.sizeX = this.$canvas.width();
        this.sizeX -= $('form').width();
        this.$canvas.width(this.sizeX);
        this.sizeY = this.$canvas.height();
        this.centerX = this.sizeX / 2;
        this.centerY = this.sizeY / 2;
        this.speed = 2000;
        $('#speedInput').val(this.speed);
        this.stop = false;
        this.pixels = [];
        this.percent = 5 / 100;
        this.values = [];
        this.examples = [];
        this.opacity = 0.05;
        this.randomColor = false;
        this.animationModeTime = 0;
        this.animationModeChangeTime = 1000;
        this.setBeginningCoordinates();
        this.prepareColors();
        this.prepareScale();
        this.prepareBeginningValues();
        this.prepareExamples();
        this.populateExamples();
        this.prepareCanvas();
        this.prepareNeonColors();
    }

    prepareColors() {
        this.color = 0xff0000;
        this.backgroundColor = '#ffffff';
        $('#backgroundColorInput').val(this.backgroundColor);
    }

    prepareScale() {
        console.log('Not implemented');
    }

    prepareBeginningValues() {
        console.log('Not implemented');
    }

    setSliders() {
        this.setSlidersValues();
        this.setSlidersLabelsValues();
        this.setFormulaVariables();
    }

    prepareEvents() {
        $('#speedInput').change($.proxy(function () {
            this.speed = $('#speedInput').val();
        }, this));

        $('#colorInput').change($.proxy(function () {
            let tmp = $('#colorInput').val();
            tmp = tmp.replace('#', '');
            tmp = parseInt(tmp, 16);
            this.color = tmp;
            this.animationModeTime = 0;
        }, this));

        $('#backgroundColorInput').change($.proxy(function () {
            this.backgroundColor = $('#backgroundColorInput').val();
            this.clearPixelsArray();
            this.ctx.fillStyle = this.backgroundColor;
            this.ctx.fillRect(0, 0, this.sizeX, this.sizeY);
            this.animationModeTime = 0;
        }, this));

        for (let i = 0; i < this.valuesNames.length; ++i) {
            let valueName = this.valuesNames[i];
            $('#' + valueName + 'Input').bind('input', $.proxy(function () {
                this.values[i] = parseFloat($('#' + valueName + 'Input').val());
                $('#' + valueName + 'Value').html(this.values[i]);
                $('.' + valueName + 'Var').html(this.values[i]);
                console.log(this.values[i]);
                this.setBeginningCoordinates();
                this.animationModeTime = 0;
            }, this));
        }

        $('#opacityInput').bind('input', $.proxy(function () {
            this.opacity = $("#opacityInput").val();
            $("#opacityValue").html(this.opacity);
            this.animationModeTime = 0;
        }, this));

        $('#randomColorInput').change($.proxy(function () {
            this.randomColor = !this.randomColor;
        }, this));

        $('#clearButton').click($.proxy(function () {
            this.clearPixelsArray();
            this.clearCanvas();
            this.setBeginningCoordinates();
            this.animationModeTime = 0;
            return false;
        }, this));

        $('#stopButton').click($.proxy(function () {
            this.stop = !this.stop;

            if (this.stop) {
                $('#stopButton').html('Start');
            } else {
                $('#stopButton').html('Stop');
            }

            return false;
        }, this));

        $('#examples').change($.proxy(function () {
            let selectedIndex = $('select[name=examples]').val();
            if (selectedIndex === -1) {
                return;
            }

            this.loadExample(selectedIndex);
            this.animationModeTime = 0;
        }, this));
    }

    loadExample(index) {
        let selectedExample = this.examples[index];
        this.values = selectedExample.values;
        this.opacity = selectedExample.opacity;
        this.setSlidersValues();
        this.setSlidersLabelsValues();
        this.setFormulaVariables();
    }

    setBeginningCoordinates() {
        this.x = 0;
        this.y = 0;
    }

    setFormulaVariables() {
        for (let i = 0; i < this.valuesNames.length; ++i) {
            $('.' + this.valuesNames[i] + 'Var').html(this.values[i]);
        }
    }

    setSlidersLabelsValues() {
        for (let i = 0; i < this.valuesNames.length; ++i) {
            $('#' + this.valuesNames[i] + 'Value').html(this.values[i]);
        }
        $('#opacityValue').html(this.opacity);
    }

    setSlidersValues() {
        for (let i = 0; i < this.valuesNames.length; ++i) {
            $('#' + this.valuesNames[i] + 'Input').val(this.values[i]);
        }
        $('#opacityInput').val(this.opacity);
    }

    clearPixelsArray() {
        for (let i = 0; i <= this.sizeX; ++i) {
            this.pixels[i] = [];
            for (let j = 0; j <= this.sizeY; ++j) {
                this.pixels[i][j] = 0;
            }
        }
    }

    prepareCanvas() {
        this.canvas = document.getElementById(this.canvasId);
        this.canvas.width = this.sizeX;
        this.canvas.height = this.sizeY;
        this.ctx = this.canvas.getContext('2d');
        this.clearCanvas();
    }

    prepareNeonColors() {
        this.neonColors = [0xFF355E, 0xFD5B78, 0xFF6037, 0xFF9966, 0xFF9933, 0xFFCC33, 0xFFFF66, 0xFFFF66, 0xCCFF00, 0x66FF66, 0xAAF0D1, 0x50BFE6, 0xFF6EFF, 0xEE34D2, 0xFF00CC, 0xFF00CC];
        this.neonColorIndex = 0;
    }

    changeNeonColor() {
        this.neonColorIndex += 1;
        this.neonColorIndex %= this.neonColors.length;
        this.color = this.neonColors[this.neonColorIndex];
    }

    clearCanvas() {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.sizeX, this.sizeY);
        this.image = this.ctx.getImageData(0, 0, this.sizeX, this.sizeY);
    }

    animationMode() {
        this.animationModeTime += 1;
        if (this.animationModeTime < this.animationModeChangeTime) {
            return;
        }

        this.animationModeTime = 0;
        this.color = this.neonColors[Math.round(Math.random() * this.neonColors.length)];
        $('#colorInput').val(this.hex2str(this.color));
        this.loadExample(Math.round(Math.random() * this.examples.length));
        this.clearPixelsArray();
        this.clearCanvas();
        this.setBeginningCoordinates();
    }

    draw() {
        requestAnimationFrame(this.draw);
    }

    fillPixel(x, y, r, g, b, a) {
        let index = (y * this.sizeX + x) * 4;
        this.image.data[index] = r;
        this.image.data[index + 1] = g;
        this.image.data[index + 2] = b;
        this.image.data[index + 3] = a;
    }

    hex2str(color) {
        if (typeof color === 'number') {
            color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
        }

        return color;
    }

    hex2rgb(hex) {
        let rgb = [];
        rgb[0] = (hex >> 16 & 255) / 255;
        rgb[1] = (hex >> 8 & 255) / 255;
        rgb[2] = (255 & hex) / 255;
        return rgb;
    }

    sgn(a) {
        if (a < 0) {
            return -1;
        } else if (a > 0) {
            return 1;
        } else {
            return 0;
        }
    }

    prepareExamples() {
        console.log('Not implemented');
    }

    populateExamples() {
        for (let i = 0; i < this.examples.length; ++i) {
            $('#examples').append('<option value="' + i + '">' + this.examples[i].name + '</option>');
        }
    }
}