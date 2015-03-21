"use strict";

bardcode.drawBitsBarcodeToSVG = function(options, encodeData) {
    var bits = encodeData.data.map(function(d) {
        return d.bits;
    }).join("");

    var bw;
    var width;

    var multiplier = (bits.length + 2 * options.quietZoneSize);

    if (!isNaN(options.width)) {
        // options.width takes precedence... if given, then it overrides
        // moduleWidth and maxWidth
        width = options.width;
        bw = width / multiplier;
    } else {
        // Try to use the given moduleWidth
        bw = options.moduleWidth;
        width = multiplier * bw;

        // But adjust if it doesn't fit in maxWidth (if given)
        if (width > options.maxWidth) {
            width = options.maxWidth;
            bw = width / multiplier;
        }
    }

    var height = options.height;

    var svgLines = [];
    svgLines.push("<svg " + [
        "xmlns='http://www.w3.org/2000/svg'",
        "width='" + width.toFixed(3) + "'",
        "height='" + height + "'",
        "fill='black'"
    ].join(" ") + ">");

    // Walk xpos from left to right side.
    var xpos = options.quietZoneSize * bw;

    var n = 0;
    while (n < bits.length) {
        // We are at the start of a bar or a space.
        var bit = bits[n];
        if (bit === "1") {
            // We are at a bar.
            var barCount = 1;
            while (n < bits.length && bits[++n] === "1") {
                barCount++;
            }

            var barWidth = barCount * bw;
            svgLines.push("<rect " + [
                "width='" + barWidth + "'",
                "height='" + height + "'",
                "x='" + xpos.toFixed(3) + "'",
                "y='0'"
            ].join(" ") + " />");
            xpos += barWidth;
        } else {
            // We are at a space.
            var spaceCount = 1;
            while (n < bits.length && bits[++n] === "0") {
                spaceCount++;
            }

            var spaceWidth = spaceCount * bw;
            xpos += spaceWidth;
        }
    }

    svgLines.push("</svg>");
    return svgLines.join("\n");
};


