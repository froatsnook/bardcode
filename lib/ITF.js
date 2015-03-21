"use strict";

var ITFData = [
    [0, 0, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 0, 1],
    [1, 1, 0, 0, 0],
    [0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1],
    [1, 0, 0, 1, 0],
    [0, 1, 0, 1, 0]
];

bardcode.encodeITF = function(text) {
    if (text.length % 2 === 1) {
        text = "0" + text;
    }

    for (var n = 0, len = text.length; n < len; n++) {
        var ch = text[n];
        if (ch < "0" || ch > "9") {
            throw new Error("ITF can only encode numbers.");
        }
    }

    var outlist = [];

    outlist.push({
        char: "START",
        bits: "1010",
        humanReadable: false
    });

    for (var i = 0; i < text.length; i += 2) {
        var c1 = text[i];
        var c2 = text[i + 1];

        var n1 = c1 - "0";
        var n2 = c2 - "0";

        var bits = "";

        for (var j = 0; j < 5; j++) {
            bits += ITFData[n1][j] === 0 ? "1" : "11";
            bits += ITFData[n2][j] === 0 ? "0" : "00";
        }

        outlist.push({
            char: c1 + c2,
            bits: bits,
            humanReadable: true
        });
    }

    outlist.push({
        char: "STOP",
        bits: "1101",
        humanReadable: false
    });

    return {
        type: "bits",
        data: outlist
    };
};

