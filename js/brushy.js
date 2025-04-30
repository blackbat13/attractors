/**
 * Created by blackbat on 24.11.2016.
 */
class Brushy {
    constructor(canvasId, width, height) {
        this.canvas = document.getElementById(canvasId);
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
        this.backgroundColor = "#fff";
        this.drawingColor = "#000";
        this._scene = [];
        this.animateFun = null;
        this._clear();
        this._history = [];
        this._maxHistoryLength = 10;
        this._historyClock = 0;
        this._historyTick = 1;
    }

    static checkColor(color) {
        //TODO implement
        return true;
    }

    /**
     * Check if x coordinate is within drawing bounds
     * @param {number} x
     * @returns {boolean}
     */
    checkXCoordinate(x) {
        return !(x < 0 || x > this.width);
    }

    /**
     * Check if y coordinate is within drawing bounds
     * @param {number} y
     * @returns {boolean}
     */
    checkYCoordinate(y) {
        return !(y < 0 || y > this.height);
    }

    /**
     * Check if coordinates are within drawing bounds
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    checkCoordinates(x, y) {
        return !(y < 0 || y > this.height || x < 0 || x > this.width);
    }

    /**
     * Convert rgb values into string color
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @returns {string}
     */
    static rgbToColor(r, g, b) {
        return `rgb(${r}, ${g}, ${b})`;
    }

    /**
     * Convert rgba values into string color
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @returns {string}
     */
    static rgbaToColor(r, g, b, a) {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    /**
     * Convert string color into rgb values
     * @param {string} color
     * @returns {{r: number | *, g: number | *, b: number | *}}
     */
    static colorToRgb(color) {
        let r, g, b;

        let colorArray = color.split("rgb(,)");

        r = parseInt(colorArray[0]);
        g = parseInt(colorArray[1]);
        b = parseInt(colorArray[2]);

        return {r: r, g: g, b: b};
    }

    /**
     * Convert string color int rgba values
     * @param {string} color
     * @returns {{r: number | *, g: number | *, b: number | *, a: number | *}}
     */
    static colorToRgba(color) {
        let r, g, b, a;

        let colorArray = color.split(",");

        r = parseInt(colorArray[0].replace('rgba(', ''));
        g = parseInt(colorArray[1]);
        b = parseInt(colorArray[2]);
        a = parseFloat(colorArray[3].replace(')', ''));

        return {r: r, g: g, b: b, a: a};
    }

    static setOpacity(color, opacity) {
        let rgba = Brushy.colorToRgba(color);
        return Brushy.rgbaToColor(rgba.r, rgba.g, rgba.b, opacity);
    }

    /**
     * Check if color rgb value is within bounds
     * @param {number} value
     * @returns {boolean}
     */
    static checkColorValue(value) {
        return !(value < 0 || value > 255);
    }

    /**
     * Check if color opacity is within bounds
     * @param {number} opacity
     * @returns {boolean}
     */
    static checkOpacityValue(opacity) {
        return !(opacity < 0 || opacity > 1);
    }

    /**
     * Check if rgb color is valid
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @returns {boolean}
     */
    static checkRgb(r, g, b) {
        return Brushy.checkColorValue(r) && Brushy.checkColorValue(g) && Brushy.checkColorValue(b);
    }

    /**
     * Check if rgba color is valid
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @returns {boolean}
     */
    static checkRgba(r, g, b, a) {
        return Brushy.checkColorValue(r) && Brushy.checkColorValue(g) && Brushy.checkColorValue(b) && Brushy.checkOpacityValue(a);
    }

    /**
     * Returns random color rgb value
     * @returns {number}
     */
    static randomColorValue() {
        return Math.round(Math.random() * 255);
    }

    /**
     * Return random string color
     * @returns {string}
     */
    static randomColor() {
        return Brushy.rgbToColor(Brushy.randomColorValue(), Brushy.randomColorValue(), Brushy.randomColorValue());
    }

    /**
     * Returns random string color with given opacity
     * @param {number} opacity
     * @returns {string}
     */
    static randomColorWithOpacity(opacity) {
        if (!Brushy.checkOpacityValue(opacity)) {
            return false;
        }

        return Brushy.rgbaToColor(Brushy.randomColorValue(), Brushy.randomColorValue(), Brushy.randomColorValue(), opacity);
    }

    static randomHexColor() {
        let colors = [];
        colors.push(0x69D2E7, 0xA7DBDB, 0xE0E4CC, 0xF38630, 0xFA6900, 0xE94C6F, 0xFDF200, 0x28ABE3, 0x1FDA9A, 0xE8B71A,
            0xDB3340, 0x008BBA, 0x00C8F8, 0xE1D041, 0x75EB00, 0x53BBF4, 0xFF85CB, 0xFF432E, 0x75EB00, 0x53BBF4,
            0xFF85CB, 0x3A9AD9, 0x5BB12F, 0xFFA200, 0x982395, 0xED1C24, 0xF2671F, 0xE74700, 0xFFD900);
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Public methods

    setDrawingColor(color) {
        if (!Brushy.checkColor(color)) {
            return false;
        }

        this.drawingColor = color;
        return true;
    }

    setDrawingColorRGB(r, g, b) {
        if(!Brushy.checkRgb(r, g, b)) {
            return false;
        }

        this.drawingColor = Brushy.rgbToColor(r, g, b);
        return true;
    }

    setBackgroundColor(color) {
        if (!Brushy.checkColor(color)) {
            return false;
        }

        this.backgroundColor = color;
        return true;
    }

    clean() {
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.width, this.height);
        return true;
    }

    cleanWithColor(color) {
        if (!Brushy.checkColor(color)) {
            return false;
        }

        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.width, this.height);
        return true;
    }

    setPixel(x, y) {
        if (!this.checkCoordinates(x, y)) {
            return false;
        }

        this.context.fillStyle = this.drawingColor;
        this.context.fillRect(x, y, 1, 1);
        return true;
    }

    setPixelWithColor(x, y, color) {
        if (!this.checkCoordinates(x, y)) {
            return false;
        }

        if (!Brushy.checkColor(color)) {
            return false;
        }

        this.context.fillStyle = color;
        this.context.fillRect(x, y, 1, 1);
        return true;
    }

    setPixelWithRgb(x, y, r, g, b) {
        if (!this.checkCoordinates(x, y)) {
            return false;
        }

        if (!Brushy.checkRgb(r, g, b)) {
            return false;
        }

        this.context.fillStyle = Brushy.rgbToColor(r, g, b);
        this.context.fillRect(x, y, 1, 1);
        return true;
    }

    setPixelWithRgba(x, y, r, g, b, a) {
        if (!this.checkCoordinates(x, y)) {
            return false;
        }

        if (!Brushy.checkRgba(r, g, b, a)) {
            return false;
        }

        this.context.fillStyle = Brushy.rgbaToColor(r, g, b, a);
        this.context.fillRect(x, y, 1, 1);
        return true;
    }

    setPixelWithRandomColor(x, y) {
        if (!this.checkCoordinates(x, y)) {
            return false;
        }

        this.context.fillStyle = Brushy.randomColor();
        this.context.fillRect(x, y, 1, 1);
        return true;
    }

    getPixelColor(x, y) {
        let imageData = this.context.getImageData(x, y, 1, 1);
        return Brushy.rgbaToColor(imageData[0], imageData[1], imageData[2], imageData[3]);
    }

    getPixelRgb(x, y) {
        let imageData = this.context.getImageData(x, y, 1, 1);
        return {r: imageData[0], g: imageData[1], b: imageData[2]};
    }

    getPixelRgba(x, y) {
        let imageData = this.context.getImageData(x, y, 1, 1);
        return {r: imageData[0], g: imageData[1], b: imageData[2], a: imageData[3]};
    }

    getRandomColor() {
        return Brushy.randomColor();
    }

    getRandomColorWithOpacity(opacity) {
        return Brushy.randomColorWithOpacity(opacity);
    }

    drawVerticalStripe(x, stripeWidth) {
        if (!this.checkXCoordinate(x)) {
            return false;
        }

        this.context.fillStyle = this.drawingColor;
        this.context.fillRect(x, 0, stripeWidth, this.height);
        return true;
    }

    drawVerticalStripeWithColor(x, stripeWidth, color) {
        if (!this.checkXCoordinate(x)) {
            return false;
        }

        if (!Brushy.checkColor(color)) {
            return false;
        }

        this.context.fillStyle = color;
        this.context.fillRect(x, 0, stripeWidth, this.height);
        return true;
    }

    drawVerticalStripeWithRgb(x, stripeWidth, r, g, b) {
        if (!this.checkXCoordinate(x)) {
            return false;
        }

        if (!Brushy.checkRgb(r, g, b)) {
            return false;
        }

        this.context.fillStyle = Brushy.rgbToColor(r, g, b);
        this.context.fillRect(x, 0, stripeWidth, this.height);
        return true;
    }

    drawVerticalStripeWithRgba(x, stripeWidth, r, g, b, a) {
        if (!this.checkXCoordinate(x)) {
            return false;
        }

        if (!Brushy.checkRgba(r, g, b, a)) {
            return false;
        }

        this.context.fillStyle = Brushy.rgbaToColor(r, g, b, a);
        this.context.fillRect(x, 0, stripeWidth, this.height);
        return true;
    }

    addToScene(object) {
        // TODO Check if object is compatible
        this._scene.push(object);
    }

    get scene() {
        return this._scene;
    }

    start(fun) {
        this.animateFun = fun;
        requestAnimationFrame(this._draw.bind(this));
    }

    _clear() {
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.width, this.height);
    }

    _draw() {
        requestAnimationFrame(this._draw.bind(this));
        this.animateFun();
        this._clear();

        // this._updateHistory();
        // TODO Remove old entries from history

        // this._drawHistory();

        for(let i = 0; i < this._scene.length; ++i) {
            let object = this._scene[i];
            object.update();
            if(object.shouldBounce) {
                object.bounce(new Rectangle(0, 0, this.width, this.height));
            }
            object.draw(this.context);
        }
    }

    _updateHistory() {
        this._historyClock++;
        this._historyClock %= this._historyTick;
        if(this._historyClock > 0) {
            return;
        }

        if(this._history.length < this._maxHistoryLength) {
            this._history.push(this._getSceneCopy());
            return;
        }

        for(let i = 0; i < this._history.length - 1; ++i) {
            this._history[i] = this._history[i+1];
        }

        this._history[this._history.length - 1] = this._getSceneCopy();
    }

    _getSceneCopy() {
        let copy = [];
        for(let i = 0; i < this._scene.length; ++i) {
            let object = this._scene[i];
            let clone = object.clone();
            // let clone = jQuery.extend(true, {}, this._scene[i]);
            copy.push(clone);

        }

        return copy;
    }

    _drawHistory() {
        for(let i = 0; i < this._history.length; ++i) {
            for(let j = 0; j < this._history[i].length; ++j) {
                let object = this._history[i][j];
                object.fillColor = Brushy.setOpacity(object.fillColor, 0.05);
                object.draw(this.context);
            }
        }
    }
}