"use strict";

var EAN_L = 0;
var EAN_G = 1;
var EAN_R = 2;

var eanData = [
    ["0001101", "0100111", "1110010"],
    ["0011001", "0110011", "1100110"],
    ["0010011", "0011011", "1101100"],
    ["0111101", "0100001", "1000010"],
    ["0100011", "0011101", "1011100"],
    ["0110001", "0111001", "1001110"],
    ["0101111", "0000101", "1010000"],
    ["0111011", "0010001", "1000100"],
    ["0110111", "0001001", "1001000"],
    ["0001011", "0010111", "1110100"]
];

bardcode.encodeEAN = function(text) {
    if (!/^\d+$/.test(text)) {
        throw new Error("EAN can only encode numbers.");
    }

    var len = text.length;
    var sum = 0;
    for (var i = 0; i < len; i++) {
        var ch = text[i];
        var n = ch - "0";
        var weight = (len - i) % 2 === 1 ? 3 : 1;
        sum += weight * n;
    }

    var checksum = 10 - sum % 10;
    text += checksum;

    var outlist = [];

    var encoding;
    switch (text.length) {
        case 8:
            encoding = "LLLLRRRR";
            break;
        case 12:
            // UPC-A is just like EAN-13 with first digit 0.
            encoding = "LLLLLLRRRRRR";
            break;
        case 13:
            switch (text[0]) {
                case "0": encoding = "LLLLLLRRRRRR"; break;
                case "1": encoding = "LLGLGGRRRRRR"; break;
                case "2": encoding = "LLGGLGRRRRRR"; break;
                case "3": encoding = "LLGGGLRRRRRR"; break;
                case "4": encoding = "LGLLGGRRRRRR"; break;
                case "5": encoding = "LGGLLGRRRRRR"; break;
                case "6": encoding = "LGGGLLRRRRRR"; break;
                case "7": encoding = "LGLGLGRRRRRR"; break;
                case "8": encoding = "LGLGGLRRRRRR"; break;
                case "9": encoding = "LGGLGLRRRRRR"; break;
            }

            outlist.push({
                char: text[0],
                humanReadable: true,
                bits: ""
            });

            text = text.slice(1);
            break;
        default:
             throw new Error("Don't know how to make EAN with that length.");
    }

    outlist.push({
        char: "START",
        humanReadable: false,
        bits: "101"
    });

    for (var i = 0; i < text.length; i++) {
        if (i === text.length / 2) {
            outlist.push({
                char: "CENTER",
                humanReadable: false,
                bits: "01010"
            });
        }

        var digit = text[i] - "0";
        var type = encoding[i];

        var index = type === "L" ? EAN_L : type === "G" ? EAN_G : EAN_R;
        var bitpattern = eanData[digit][index];
        outlist.push({
            char: text[i],
            humanReadable: true,
            bits: bitpattern
        });
    }

    outlist.push({
        char: "END",
        humanReadable: false,
        bits: "101"
    });

    return {
        type: "bits",
        checksum: checksum,
        data: outlist
    };
};

