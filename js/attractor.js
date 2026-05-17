/**
 * Created by blackbat on 06.04.2017.
 */
class Attractor {

    constructor(canvasId, valuesNames) {
        this.$canvas = $('#' + canvasId);
        this.canvasId = canvasId;
        this.valuesNames = valuesNames;
        this.printInProgress = false;
        this.minPrintButtonLockMs = 3000;
    }

    init() {
        this.prepareVariables();
        this.setSliders();
        this.prepareEvents();
        this.clearPixelsArray();
        this.setStatus(this.getDefaultHelpMessage(), 'info');
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
        this.prepareRenderHealth();
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
        this.prepareGuidanceControls();
        // this.preparePrintControls();

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
            this.scheduleRestart('Background updated. The attractor will redraw with the new background.');
            this.applyPendingRestart();
            this.animationModeTime = 0;
        }, this));

        for (let i = 0; i < this.valuesNames.length; ++i) {
            let valueName = this.valuesNames[i];
            $('#' + valueName + 'Input').bind('input', $.proxy(function () {
                this.values[i] = parseFloat($('#' + valueName + 'Input').val());
                $('#' + valueName + 'Value').html(this.values[i]);
                $('.' + valueName + 'Var').html(this.values[i]);
                this.scheduleRestart('Trying new parameters. Some combinations do not produce a visible attractor.');
                this.animationModeTime = 0;
            }, this));
        }

        $('#opacityInput').bind('input', $.proxy(function () {
            this.opacity = parseFloat($('#opacityInput').val());
            $('#opacityValue').html(this.opacity);
            this.scheduleRestart('Updated intensity. The attractor will redraw from the beginning.');
            this.animationModeTime = 0;
        }, this));

        $('#randomColorInput').change($.proxy(function () {
            this.randomColor = !this.randomColor;
        }, this));

        $('#clearButton').click($.proxy(function () {
            this.scheduleRestart('Canvas cleared. Choose an example or move one slider at a time to explore.');
            this.applyPendingRestart();
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
            let selectedIndex = parseInt($('select[name=examples]').val(), 10);
            if (Number.isNaN(selectedIndex)) {
                return;
            }

            this.loadExample(selectedIndex, 'Loaded an example. Move one slider at a time from here.');
            this.animationModeTime = 0;
        }, this));

        $('#randomExampleButton').click($.proxy(function () {
            this.loadRandomExample('Loaded a random example. Move one slider at a time from here.');
            return false;
        }, this));

        $('#printButton').click($.proxy(async function () {
            if (this.printInProgress) {
                return false;
            }

            if (!window.desktopPrinter || !window.desktopPrinter.printCanvas) {
                alert('Printing is available only in the desktop app.');
                return false;
            }

            this.printInProgress = true;
            let startTime = Date.now();
            let $printButton = $('#printButton');
            $printButton.prop('disabled', true);
            $printButton.text('Please wait...');

            try {
                let dataUrl = this.canvas.toDataURL('image/png');
                let result = await window.desktopPrinter.printCanvas(dataUrl);
                if (!result.ok) {
                    alert(result.message || 'Printing failed.');
                } else {
                    alert('Image saved and sent to printer tool:\n' + result.filePath);
                }
            } catch (error) {
                alert('Printing failed: ' + error.message);
            } finally {
                let elapsedMs = Date.now() - startTime;
                let waitMs = Math.max(0, this.minPrintButtonLockMs - elapsedMs);
                setTimeout($.proxy(function () {
                    this.printInProgress = false;
                    $printButton.prop('disabled', false);
                    $printButton.text('Print');
                }, this), waitMs);
            }

            return false;
        }, this));

        $("body").on("mousemove", $.proxy(function () {
            this.animationModeTime = 0;
        }, this));
    }

    prepareRenderHealth() {
        this.renderHealth = {
            visiblePointsThisFrame: 0,
            offscreenPointsThisFrame: 0,
            nonFinitePointsThisFrame: 0,
            totalIterationsThisFrame: 0,
            consecutiveInvisibleFrames: 0,
            invisibleFrameThreshold: 30
        };
        this.pendingRestart = false;
        this.awaitingVisibleFrame = false;
        this.currentStatusTone = 'info';
    }

    prepareGuidanceControls() {
        if ($('#renderStatus').length) {
            return;
        }

        let guidanceControls = '' +
            '<div class="render-status render-status--info" id="renderStatus">' +
            '    <strong class="render-status__title">Exploration help</strong>' +
            '    <p class="render-status__message" id="renderStatusMessage"></p>' +
            '    <div class="render-status__actions">' +
            '        <button class="btn btn-outline-primary" id="randomExampleButton" type="button">Load Random Example</button>' +
            '    </div>' +
            '</div>';

        $('#examples').closest('div').after(guidanceControls);
    }

    preparePrintControls() {
        if (!$('#printButton').length) {
            let printControls = '' +
                '<div>' +
                '    <button class="btn btn-lg btn-success" id="printButton">Print</button>' +
                '</div>';
            $('form').append(printControls);
        }
    }

    loadExample(index, statusMessage) {
        let selectedExample = this.examples[index];
        if (!selectedExample) {
            return;
        }

        this.values = selectedExample.values.slice();
        this.opacity = selectedExample.opacity;
        this.setSlidersValues();
        this.setSlidersLabelsValues();
        this.setFormulaVariables();
        this.scheduleRestart(statusMessage || 'Loaded an example.');
    }

    loadRandomExample(statusMessage) {
        if (!this.examples.length) {
            return;
        }

        let selectedIndex = Math.floor(Math.random() * this.examples.length);
        $('#examples').val(selectedIndex);
        this.loadExample(selectedIndex, statusMessage || 'Loaded a random example.');
    }

    getDefaultHelpMessage() {
        return 'Start from an example, then move one slider at a time. Some parameter combinations do not produce a visible attractor.';
    }

    setStatus(message, tone) {
        let statusTone = tone || 'info';
        this.currentStatusTone = statusTone;
        if (!$('#renderStatus').length) {
            return;
        }

        $('#renderStatus')
            .removeClass('render-status--info render-status--success render-status--warning')
            .addClass('render-status--' + statusTone);
        $('#renderStatusMessage').text(message);
    }

    scheduleRestart(statusMessage) {
        this.pendingRestart = true;
        this.awaitingVisibleFrame = true;
        this.setStatus(statusMessage || this.getDefaultHelpMessage(), 'info');
    }

    applyPendingRestart() {
        if (!this.pendingRestart) {
            return;
        }

        this.pendingRestart = false;
        this.resetRenderHealth();
        this.clearPixelsArray();
        this.clearCanvas();
        this.setBeginningCoordinates();
    }

    resetRenderHealth() {
        this.renderHealth.visiblePointsThisFrame = 0;
        this.renderHealth.offscreenPointsThisFrame = 0;
        this.renderHealth.nonFinitePointsThisFrame = 0;
        this.renderHealth.totalIterationsThisFrame = 0;
        this.renderHealth.consecutiveInvisibleFrames = 0;
    }

    beginRenderFrame() {
        this.renderHealth.visiblePointsThisFrame = 0;
        this.renderHealth.offscreenPointsThisFrame = 0;
        this.renderHealth.nonFinitePointsThisFrame = 0;
        this.renderHealth.totalIterationsThisFrame = 0;
    }

    trackPoint(x, y, cx, cy) {
        this.renderHealth.totalIterationsThisFrame += 1;

        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(cx) || !Number.isFinite(cy)) {
            this.renderHealth.nonFinitePointsThisFrame += 1;
            return false;
        }

        if (cx < 0 || cy < 0 || cx > this.sizeX || cy > this.sizeY) {
            this.renderHealth.offscreenPointsThisFrame += 1;
            return false;
        }

        this.renderHealth.visiblePointsThisFrame += 1;
        return true;
    }

    finishRenderFrame() {
        if (this.renderHealth.visiblePointsThisFrame > 0) {
            this.renderHealth.consecutiveInvisibleFrames = 0;

            if (this.awaitingVisibleFrame || this.currentStatusTone === 'warning') {
                this.awaitingVisibleFrame = false;
                this.setStatus('Drawing again. Keep exploring one slider at a time.', 'success');
            }
            return;
        }

        this.renderHealth.consecutiveInvisibleFrames += 1;
        if (this.renderHealth.consecutiveInvisibleFrames < this.renderHealth.invisibleFrameThreshold) {
            return;
        }

        this.awaitingVisibleFrame = false;
        this.setStatus(this.buildInvisibleStateMessage(), 'warning');
    }

    buildInvisibleStateMessage() {
        if (this.renderHealth.nonFinitePointsThisFrame > 0) {
            return 'These parameters blow up numerically, so the formula is not producing drawable points. Load a random example or move back toward a simpler setting.';
        }

        if (this.renderHealth.offscreenPointsThisFrame === this.renderHealth.totalIterationsThisFrame && this.renderHealth.totalIterationsThisFrame > 0) {
            return 'These parameters send the orbit off the canvas, so nothing visible is being plotted. Load a random example or move back toward a simpler setting.';
        }

        return 'These parameters are not producing a visible attractor right now. Load a random example or move back toward a simpler setting.';
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
        this.loadRandomExample();
        this.applyPendingRestart();
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

    getExampleLabel(example, index) {
        if (!example) {
            return 'Example ' + (index + 1);
        }

        let hasNumericName = typeof example.name === 'number' || /^\d+$/.test(String(example.name || ''));
        if (!hasNumericName && example.name) {
            return example.name;
        }

        if (!Array.isArray(example.values) || !example.values.length) {
            return 'Example ' + (index + 1);
        }

        return this.valuesNames.map(function (valueName, valueIndex) {
            let value = example.values[valueIndex];
            return valueName.toUpperCase() + '=' + value;
        }).join(', ');
    }

    populateExamples() {
        for (let i = 0; i < this.examples.length; ++i) {
            $('#examples').append('<option value="' + i + '">' + this.getExampleLabel(this.examples[i], i) + '</option>');
        }
    }
}