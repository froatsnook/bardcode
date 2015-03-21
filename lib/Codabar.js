"use strict";

var codabarData = {
    "0": "1010100110",
    "1": "1010110010",
    "2": "1010010110",
    "3": "1100101010",
    "4": "1011010010",
    "5": "1101010010",
    "6": "1001010110",
    "7": "1001011010",
    "8": "1001101010",
    "9": "1101001010",
    "-": "1010011010",
    "$": "1011001010",
    ".": "11011011010",
    "/": "11011010110",
    ":": "11010110110",
    "+": "10110110110"
};

var codabarStartsAndStops = {
    "C": "10100100110",
    "*": "10100100110",
    "B": "10010010110",
    "N": "10010010110",
    "D": "10100110010",
    "E": "10100110010",
    "A": "10110010010",
    "T": "10110010010"
};

bardcode.encodeCodabar = function(text) {
    if (!/^[C\*BNDEAT]?[-:0-9\$\.\/\+]*[C\*BNDEAT]?$/.test(text)) {
        throw new Error("Cannot encode \"" + text + "\" in codabar.");
    }

    if (text.length === 0) {
        text = "AA";
    }

    var firstIsStart = !!codabarStartsAndStops[text[0]];
    var lastIsStop = !!codabarStartsAndStops[text[text.length - 1]];

    if (text.length === 1 && firstIsStart) {
        throw new Error("Cannot encode \"" + text + "\" as codabar: it's just a start/stop character");
    }

    if (firstIsStart ^ lastIsStop) {
        throw new Error("Cannot encode \"" + text + "\" as codabar: must give both start and stop characters or neither start nor stop");
    }

    var outlist = [];

    // If it doesn't have start and stop symbols, just use "A".
    if (!firstIsStart) {
        text = "A" + text + "A";
    }

    for (var i = 0; i < text.length; i++) {
        var ch = text[i];

        if (i === 0 || i === text.length - 1) {
            outlist.push({
                char: ch,
                humanReadable: false,
                bits: codabarStartsAndStops[ch]
            });
            continue;
        }

        outlist.push({
            char: ch,
            humanReadable: true,
            bits: codabarData[ch]
        });
    }

    return {
        type: "bits",
        data: outlist
    };
};

