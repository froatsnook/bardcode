var optionDefaults = {
    type: "Code 128",
    x: 0,
    y: 0,
    moduleWidth: 2.892,
    height: 90.72,
    horizontalAlign: "left",
    verticalAlign: "top",
    quietZoneSize: 10,
    angle: 0,
    maxWidth: Infinity,
    width: NaN
};

// Copy default values from source to target if they don't exist.
var copyDefaults = function(target, source) {
    for (var key in source) {
        if (typeof target[key] === "undefined") {
            target[key] = source[key];
        }
    }
};

/**
 * @summary Draw a barcode to a canvas graphics context.
 * @todo IMB, Pharmacode, PostBar, POSTNET, Telepen
 * @param {Context2D} g An HTML5 or node-canvas graphics context.
 * @param {String} text Barcode text (without start, end, or check characters).
 * @param {Object} options Controls what barcode is drawn, where, and how.
 * @param {String} options.type Barcode type.  Defaults to Code 128.  Other valid options are "Codabar", "Code 39", "EAN-8", "EAN-13", "FIM", "ITF" (interleaved 2 of 5), and "UPC-A".
 * @param {Number} options.x Where to draw barcode.  Defaults to 0.
 * @param {Number} options.y Where to draw the barcode.  Defaults to 0.
 * @param {String} options.horizontalAlign How to align the barcode.  Defaults to "left".  Other options are "center" and "right".
 * @param {String} options.verticalAlign How to align the barcode.  Defaults to "top".  Other options are "middle" and "bottom".
 * @param {Number} options.height Barcode height.  Defaults to 90.72.
 * @param {Number} options.moduleWidth Width of thinnest bar.  Defaults to 2.892.
 * @param {Number} options.quietZoneSize Number of moduleWidths in quiet zone on either side.  Defaults to 10.
 * @param {Number} options.angle Rotate barcode this many degrees clockwise.  Defaults to 0.
 * @param {Number} options.maxWidth Maximum barcode width (including quiet zones).  If specified, then the moduleWidth will be adjusted if necessary to make the entire barcode fit in the given width.
 * @param {Number} options.width If given, then ignore moduleWidth and maxWidth and set the moduleWidth so that the barcode will have the given width.
 */
drawBarcode = bardcode.drawBarcode = function(g, text, options) {
    // Validate input.
    if (typeof g !== "object") {
        throw new Error("drawBarcode: expected `g' to be an object.");
    }

    if (!text || typeof text !== "string") {
        throw new Error("drawBarcode: expected `text' to be a non-empty string.");
    }

    if (typeof options !== "object") {
        options = { };
    }

    copyDefaults(options, optionDefaults);
    bardcode.validateDrawBarcodeOptions(options);

    var encodeData;
    switch (options.type) {
        case "Codabar":
            encodeData = bardcode.encodeCodabar(text);
            break;
        case "Code 128":
            encodeData = bardcode.encodeCode128(text);
            break;
        case "Code 39":
            encodeData = bardcode.encodeCode39(text);
            break;
        case "ITF":
            encodeData = bardcode.encodeITF(text);
            break;
        case "EAN-8":
            encodeData = bardcode.encodeEAN(text);
            break;
        case "EAN-13":
            encodeData = bardcode.encodeEAN(text);
            break;
        case "FIM":
            encodeData = bardcode.encodeFIM(text);
            break;
        case "UPC-A":
            encodeData = bardcode.encodeEAN(text);
            break;
    }

    switch (encodeData.type) {
        case "bits":
            return bardcode.drawBitsBarcode(g, options, encodeData);
        default:
            throw new Error("Unrecognized encoded barcode type: " + encodeData.type);
    }
};

bardcode.validateDrawBarcodeOptions = function validateDrawBarcodeOptions(options) {
    bardcode.AssertIsNumber(options.x, "options.x");
    bardcode.AssertIsNumber(options.y, "options.y");
    bardcode.AssertIsValidHorizontalAlign(options.horizontalAlign);
    bardcode.AssertIsValidVerticalAlign(options.verticalAlign);
    bardcode.AssertIsPositiveNumber(options.height, "options.height");
    bardcode.AssertIsPositiveNumber(options.moduleWidth, "options.moduleWidth");
    bardcode.AssertIsNonNegativeNumber(options.quietZoneSize, "options.quietZoneSize");
    bardcode.AssertIsNumber(options.angle, "options.angle");
    bardcode.AssertIsPositiveNumber(options.maxWidth, "options.maxWidth");

    // width can either be NaN or a positive number.
    if (!isNaN(options.width)) {
        bardcode.AssertIsPositiveNumber(options.width, "options.width");
    }
};

bardcode.drawBitsBarcode = function(g, options, encodeData) {
    var bits = encodeData.data.map(function(d) {
        return d.bits;
    }).join("");

    g.save();

    // First transform so that no matter the x, y, horizontalAlign and
    // verticalAlign, we draw from the left at 0,0.

    var fixedWidth;
    var bw;
    var width;

    var multiplier = (bits.length + 2*options.quietZoneSize);

    if (!isNaN(options.width)) {
        // options.width takes precedence... if given, then it overrides
        // moduleWidth and maxWidth
        fixedWidth = true;
        width = options.width;
        bw = width/multiplier;
    } else {
        // Try to use the given moduleWidth
        fixedWidth = false;
        bw = options.moduleWidth;
        width = multiplier*bw;

        // But adjust if it doesn't fit in maxWidth (if given)
        if (width > options.maxWidth) {
            width = options.maxWidth;
            bw = width/multiplier;
        }
    }

    var height = options.height;

    // Translate to barcode start.
    g.translate(options.x, options.y);

    var rad = options.angle*Math.PI/180;
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);

    // Compute all positions relative to the point (x, y) in the unrotated
    // coordinate system.  Using min and max values, we can figure out how much
    // we need to translate to make the desired alignment.
    //
    //     0,0  __________  w,0
    //         |          |
    //         |__________|
    //     0,h              w,h
    //
    // To compute the new positions, multiply by the 2d multiplication matrix:
    //
    //     [cos(a)  -sin(a)] * [0] = [0]
    //     [sin(a)   cos(a)]   [0]   [0]
    //
    //     [cos(a)  -sin(a)] * [w] = [w*cos(a)]
    //     [sin(a)   cos(a)]   [0]   [w*sin(a)]
    //
    //     [cos(a)  -sin(a)] * [w] = [w*cos(a)-h*sin(a)]
    //     [sin(a)   cos(a)]   [h]   [w*sin(a)+h*cos(a)]
    //
    //     [cos(a)  -sin(a)] * [0] = [-h*sin(a)]
    //     [sin(a)   cos(a)]   [h]   [ h*cos(a)]
    //
    // For centering, compute the rectangle's center's position in the same
    // way:
    //
    //     [cos(a)  -sin(a)] * [w/2] = [w/2*cos(a)-h/2*sin(a)]
    //     [sin(a)   cos(a)]   [h/2]   [w/2*sin(a)+h/2*cos(a)]
    var xs = [0, width*cos, width*cos - height*sin, -height*sin];
    var ys = [0, width*sin, width*sin + height*cos, height*cos];

    var xmin = Math.min.apply(this, xs);
    var ymin = Math.min.apply(this, ys);
    var xmax = Math.max.apply(this, xs);
    var ymax = Math.max.apply(this, ys);

    switch (options.horizontalAlign) {
        case "left":
            g.translate(-xmin, 0);
            break;
        case "center":
            g.translate(-(width/2*cos - height/2*sin), 0);
            break;
        case "right":
            g.translate(-xmax, 0);
            break;
    }

    switch (options.verticalAlign) {
        case "top":
            g.translate(0, -ymin);
            break;
        case "middle":
            g.translate(0, -(width/2*sin + height/2*cos));
            break;
        case "bottom":
            g.translate(0, -ymax);
            break;
    }

    // Rotate.
    g.rotate(rad);

    // Skip quiet zone...
    g.translate(options.quietZoneSize*bw, 0);

    g.fillStyle = "black";

    var n = 0;
    while (n < bits.length) {
        // We are at the start of a bar or a space.
        var bit = bits[n];
        if (bit === "1") {
            // We are at a bar.
            var width = 1;
            while (n < bits.length && bits[++n] === "1") {
                width++;
            }

            var barWidth = width*bw;
            g.fillRect(0, 0, barWidth, height);
            g.translate(barWidth, 0);
        } else {
            // We are at a space.
            var width = 1;
            while (n < bits.length && bits[++n] === "0") {
                width++;
            }

            var spaceWidth = width*bw;
            g.translate(spaceWidth, 0);
        }
    }

    g.restore();

    return {
        barcodeWidth: width,
        barcodeHeight: height,
        bbox: {
            x: xmin,
            y: ymin,
            width: xmax - xmin,
            height: ymax - ymin
        }
    };
};

