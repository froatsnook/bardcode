/*
 * bardcode (c) 2016-2017 froatsnook
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.bardcode = {})));
}(this, (function (exports) { 'use strict';

function assertIsValidHorizontalAlign(x) {
  switch (x) {
    case "left":
      return;
    case "center":
      return;
    case "right":
      return;
    default:
      throw new Error("Unexpected horizontalAlign (acceptable values are \"left\", \"center\", and \"right\"); got " + x);
  }
}

function assertIsValidVerticalAlign(x) {
  switch (x) {
    case "top":
      return;
    case "middle":
      return;
    case "bottom":
      return;
    default:
      throw new Error("Unexpected verticalAlign (acceptable values are \"top\", \"middle\", and \"bottom\"); got " + x);
  }
}

function assertIsNumber(x, name) {
  if (typeof x !== "number") {
    throw new Error("Expected " + name + " to be a number, got " + x);
  }
}

function assertIsBoolean(x, name) {
  if (typeof x !== "boolean") {
    throw new Error("Expected " + name + " to be a boolean, got " + x);
  }
}

function assertIsPositiveNumber(x, name) {
  if (typeof x !== "number") {
    throw new Error("Expected " + name + " to be a number, got " + x);
  }

  if (x <= 0) {
    throw new Error("Expected " + name + " to be positive, got " + x);
  }
}

function assertIsNonNegativeNumber(x, name) {
  if (typeof x !== "number") {
    throw new Error("Expected " + name + " to be a number, got " + x);
  }

  if (x < 0) {
    throw new Error("Expected " + name + " to be non-negative, got " + x);
  }
}

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

function encodeCodabar(text) {
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
}

// At the moment Code 128 supports 128-B well, with basic support for 128-A
// (shifting for each character which lives in A but not B).  Most of the
// building blocks for 128-C are included, but it's not implemented yet.
//
// There is also no ISO-8859-1 support (which would use FNC4).

var CODE_128_VAL = 0;
var CODE_128_CHAR_A = 1;
var CODE_128_CHAR_B = 2;
var CODE_128_CHAR_C = 3;
var CODE_128_BITS = 4;

// VALUE, CODE A CHAR, CODE B CHAR, CODE C CHARS, BITS
var code128 = [[0, " ", " ", "00", "11011001100"], [1, "!", "!", "01", "11001101100"], [2, "\"", "\"", "02", "11001100110"], [3, "#", "#", "03", "10010011000"], [4, "$", "$", "04", "10010001100"], [5, " %", " %", "05", "10001001100"], [6, "&", "&", "06", "10011001000"], [7, "'", "'", "07", "10011000100"], [8, "(", "(", "08", "10001100100"], [9, ")", ")", "09", "11001001000"], [10, "*", "*", "10", "11001000100"], [11, "+", "+", "11", "11000100100"], [12, ", ", ", ", "12", "10110011100"], [13, "-", "-", "13", "10011011100"], [14, ".", ".", "14", "10011001110"], [15, "/", "/", "15", "10111001100"], [16, "0", "0", "16", "10011101100"], [17, "1", "1", "17", "10011100110"], [18, "2", "2", "18", "11001110010"], [19, "3", "3", "19", "11001011100"], [20, "4", "4", "20", "11001001110"], [21, "5", "5", "21", "11011100100"], [22, "6", "6", "22", "11001110100"], [23, "7", "7", "23", "11101101110"], [24, "8", "8", "24", "11101001100"], [25, "9", "9", "25", "11100101100"], [26, ":", ":", "26", "11100100110"], [27, ";", ";", "27", "11101100100"], [28, "<", "<", "28", "11100110100"], [29, "=", "=", "29", "11100110010"], [30, ">", ">", "30", "11011011000"], [31, "?", "?", "31", "11011000110"], [32, "@", "@", "32", "11000110110"], [33, "A", "A", "33", "10100011000"], [34, "B", "B", "34", "10001011000"], [35, "C", "C", "35", "10001000110"], [36, "D", "D", "36", "10110001000"], [37, "E", "E", "37", "10001101000"], [38, "F", "F", "38", "10001100010"], [39, "G", "G", "39", "11010001000"], [40, "H", "H", "40", "11000101000"], [41, "I", "I", "41", "11000100010"], [42, "J", "J", "42", "10110111000"], [43, "K", "K", "43", "10110001110"], [44, "L", "L", "44", "10001101110"], [45, "M", "M", "45", "10111011000"], [46, "N", "N", "46", "10111000110"], [47, "O", "O", "47", "10001110110"], [48, "P", "P", "48", "11101110110"], [49, "Q", "Q", "49", "11010001110"], [50, "R", "R", "50", "11000101110"], [51, "S", "S", "51", "11011101000"], [52, "T", "T", "52", "11011100010"], [53, "U", "U", "53", "11011101110"], [54, "V", "V", "54", "11101011000"], [55, "W", "W", "55", "11101000110"], [56, "X", "X", "56", "11100010110"], [57, "Y", "Y", "57", "11101101000"], [58, "Z", "Z", "58", "11101100010"], [59, "[", "[", "59", "11100011010"], [60, "\\", "\\", "60", "11101111010"], [61, "]", "]", "61", "11001000010"], [62, "^", "^", "62", "11110001010"], [63, "_", "_", "63", "10100110000"], [64, "\0", "`", "64", "10100001100"], [65, "\x01", "a", "65", "10010110000"], [66, "\x02", "b", "66", "10010000110"], [67, "\x03", "c", "67", "10000101100"], [68, "\x04", "d", "68", "10000100110"], [69, "\x05", "e", "69", "10110010000"], [70, "\x06", "f", "70", "10110000100"], [71, "\x07", "g", "71", "10011010000"], [72, "\b", "h", "72", "10011000010"], [73, "\x01", "i", "73", "10000110100"], [74, "\n", "j", "74", "10000110010"], [75, "\v", "k", "75", "11000010010"], [76, "\f", "l", "76", "11001010000"], [77, "\r", "m", "77", "11110111010"], [78, "\x08", "n", "78", "11000010100"], [79, "\x09", "o", "79", "10001111010"], [80, "\x10", "p", "80", "10100111100"], [81, "\x11", "q", "81", "10010111100"], [82, "\x12", "r", "82", "10010011110"], [83, "\x13", "s", "83", "10111100100"], [84, "\x14", "t", "84", "10011110100"], [85, "\x15", "u", "85", "10011110010"], [86, "\x16", "v", "86", "11110100100"], [87, "\x17", "w", "87", "11110010100"], [88, "\x18", "x", "88", "11110010010"], [89, "\x19", "y", "89", "11011011110"], [90, "\x1a", "z", "90", "11011110110"], [91, "\x1b", "{", "91", "11110110110"], [92, "\x1c", "|", "92", "10101111000"], [93, "\x1d", "}", "93", "10100011110"], [94, "\x1e", "~", "94", "10001011110"], [95, "\x1f", "\x7f", "95", "10111101000"], [96, "FNC 3", "FNC 3", "96", "10111100010"], [97, "FNC 2", "FNC 2", "97", "11110101000"], [98, "SHIFT B", "SHIFT A", "98", "11110100010"], [99, "CODE C", "CODE C", "99", "10111011110"], [100, "CODE B", "FNC 4", "CODE B", "10111101110"], [101, "FNC 4", "CODE A", "CODE A", "11101011110"], [102, "FNC 1", "FNC 1", "FNC 1", "11110101110"], [103, "A0", "A0", "A0", "11010000100"], [104, "B0", "B0", "B0", "11010010000"], [105, "C0", "C0", "C0", "11010011100"], [106, "STOP", "STOP", "STOP", "1100011101011"]];

// Reverse lookups from first 4 columns.  Created on first use.
var code128ValLookup = null;
var code128ALookup = null;
var code128BLookup = null;
var code128CLookup = null;

var makeCode128Lookups = function makeCode128Lookups() {
  if (code128ValLookup) {
    return;
  }

  code128ValLookup = {};
  code128ALookup = {};
  code128BLookup = {};
  code128CLookup = {};

  for (var i = 0; i < code128.length; i++) {
    var data = code128[i];

    var val = data[CODE_128_VAL];
    var charA = data[CODE_128_CHAR_A];
    var charB = data[CODE_128_CHAR_B];
    var charC = data[CODE_128_CHAR_C];

    code128ValLookup[val] = data;
    code128ALookup[charA] = data;
    code128BLookup[charB] = data;
    code128CLookup[charC] = data;
  }
};

function encodeCode128(text) {
  makeCode128Lookups();

  var chars = new Array(1 + text.length);
  chars[0] = "B0";
  for (var i = 0, len = text.length; i < len; i++) {
    chars[1 + i] = text[i];
  }

  // Basic support for Code 128-A: do shift A before characters which live in
  // A but not in B.
  for (var _i = 0; _i < chars.length; _i++) {
    var ch = chars[_i];
    if (code128ALookup[ch] && !code128BLookup[ch]) {
      chars.splice(_i, 0, "SHIFT A");
      _i++;
    }
  }

  // Main thing we return is a list of characters.
  // [{ bits: "1011011", mode: "A", value: 44, char: "L", humanReadable: true }, ...]
  var outlist = [];

  var mode = void 0;
  switch (chars[0]) {
    case "A0":
      mode = "A";break;
    case "B0":
      mode = "B";break;
    case "C0":
      mode = "C";break;
    default:
      throw new Error("Expected a starting character");
  }

  // If "SHIFT A" is a character in chars, then shift to mode A for one
  // character, and then switch back to returnMode.
  var returnMode = void 0;

  var sum = 0;
  for (var _i2 = 0; _i2 < chars.length; _i2++) {
    var _ch = chars[_i2];

    // The weight value depends on what mode we're in.
    var data = void 0;
    switch (mode) {
      case "A":
        data = code128ALookup[_ch];
        break;
      case "B":
        data = code128BLookup[_ch];
        break;
      case "C":
        data = code128CLookup[_ch];
        break;
    }

    // Throw an error if the character does not exist in this mode.
    if (!data) {
      throw new Error("Invalid input (no such char '" + _ch + "' in mode " + mode + ")");
    }

    var val = data[CODE_128_VAL];
    var bits = data[CODE_128_BITS];

    // Contribute to sum.
    var n = _i2 || 1; // both start code and first text char have position 1.
    sum += n * val;

    outlist.push({
      bits: bits,
      char: _ch,
      humanReadable: null,
      _mode: mode,
      _val: val
    });

    // Return to previous mode after a shift.
    if (returnMode) {
      mode = returnMode;
      returnMode = null;
    }

    // Handle mode switches.
    switch (_ch) {
      case "CODE A":
        mode = "A";break;
      case "CODE B":
        mode = "B";break;
      case "CODE C":
        mode = "C";break;
      case "SHIFT A":
        returnMode = mode;mode = "A";break;
      case "SHIFT B":
        returnMode = mode;mode = "B";break;

      default:
        // Do nothing for non-mode switching characters.
        break;
    }
  }

  var checksum = sum % 103;

  // Append the checksum.
  var checksumData = code128ValLookup[checksum];
  outlist.push({
    bits: checksumData[CODE_128_BITS],
    char: "CHECKSUM",
    humanReadable: false,
    _val: checksum
  });

  // Append the stop char.
  var stopData = code128ALookup.STOP;
  outlist.push({
    bits: stopData[CODE_128_BITS],
    char: "STOP",
    humanReadable: false,
    _val: stopData[CODE_128_VAL]
  });

  return {
    type: "bits",
    checksum: checksum,
    data: outlist
  };
}

var CODE_39_CHAR = 0;
var CODE_39_BITS = 2;

var code39Data = [["1", 1, "110100101011"], ["2", 2, "101100101011"], ["3", 3, "110110010101"], ["4", 4, "101001101011"], ["5", 5, "110100110101"], ["6", 6, "101100110101"], ["7", 7, "101001011011"], ["8", 8, "110100101101"], ["9", 9, "101100101101"], ["0", 0, "101001101101"], ["A", 10, "110101001011"], ["B", 11, "101101001011"], ["C", 12, "110110100101"], ["D", 13, "101011001011"], ["E", 14, "110101100101"], ["F", 15, "101101100101"], ["G", 16, "101010011011"], ["H", 17, "110101001101"], ["I", 18, "101101001101"], ["J", 19, "101011001101"], ["K", 20, "110101010011"], ["L", 21, "101101010011"], ["M", 22, "110110101001"], ["N", 23, "101011010011"], ["O", 24, "110101101001"], ["P", 25, "101101101001"], ["Q", 26, "101010110011"], ["R", 27, "110101011001"], ["S", 28, "101101011001"], ["T", 29, "101011011001"], ["U", 30, "110010101011"], ["V", 31, "100110101011"], ["W", 32, "110011010101"], ["X", 33, "100101101011"], ["Y", 34, "110010110101"], ["Z", 35, "100110110101"], ["-", 36, "100101011011"], [".", 37, "110010101101"], [" ", 38, "100110101101"], ["*", NaN, "100101101101"]];

var code39Lookup = null;

var makeCode39Lookups = function makeCode39Lookups() {
  if (code39Lookup) {
    return;
  }

  code39Lookup = {};

  code39Data.forEach(function (row) {
    var ch = row[CODE_39_CHAR];
    code39Lookup[ch] = row;
  });
};

// @param [withChecksum] {Boolean} If true, then add the mod 43 checksum.  Defaults to false.
function encodeCode39(text, withChecksum) {
  makeCode39Lookups();

  // @todo implement
  withChecksum = withChecksum || false;

  if (!text) {
    text = "";
  }

  text = "*" + text + "*";

  var outlist = [];

  for (var i = 0; i < text.length; i++) {
    if (i !== 0) {
      outlist.push({
        char: "",
        bits: "0",
        humanReadable: false
      });
    }

    var ch = text[i];
    var row = code39Lookup[ch];
    if (!row) {
      throw new Error("Cannot encode code 39 barcode: invalid char: " + ch);
    }

    var bits = row[CODE_39_BITS];
    outlist.push({
      char: ch,
      bits: bits,
      humanReadable: true
    });
  }

  return {
    type: "bits",
    data: outlist
  };
}

var EAN_L = 0;
var EAN_G = 1;
var EAN_R = 2;

var eanData = [["0001101", "0100111", "1110010"], ["0011001", "0110011", "1100110"], ["0010011", "0011011", "1101100"], ["0111101", "0100001", "1000010"], ["0100011", "0011101", "1011100"], ["0110001", "0111001", "1001110"], ["0101111", "0000101", "1010000"], ["0111011", "0010001", "1000100"], ["0110111", "0001001", "1001000"], ["0001011", "0010111", "1110100"]];

function encodeEAN(text, hasChecksum) {
  if (!/^\d+$/.test(text)) {
    throw new Error("EAN can only encode numbers.");
  }

  var origChecksum = void 0;
  if (hasChecksum) {
    origChecksum = parseInt(text.substr(text.length - 1, 1), 10);
    text = text.substr(0, text.length - 1);
  }

  var len = text.length;
  var sum = 0;
  for (var i = 0; i < len; i++) {
    var ch = text[i];
    var n = ch - "0";
    var weight = (len - i) % 2 === 1 ? 3 : 1;
    sum += weight * n;
  }

  // This could probably be achieved with a modulo and a check for 10 to wrap.
  // However this implementation was lifted from the GS1 website:
  // http://www.gs1.org/check-digit-calculator and is therefore guaranteed correct.
  var closest = Math.round(sum / 10) * 10;
  var checksum = closest - sum;
  if (checksum < 0) {
    checksum = closest + 10 - sum;
  }
  if (hasChecksum && checksum !== origChecksum) {
    throw new Error("Invalid checksum.");
  }
  text += checksum;

  var outlist = [];

  var encoding = void 0;
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
        case "0":
          encoding = "LLLLLLRRRRRR";break;
        case "1":
          encoding = "LLGLGGRRRRRR";break;
        case "2":
          encoding = "LLGGLGRRRRRR";break;
        case "3":
          encoding = "LLGGGLRRRRRR";break;
        case "4":
          encoding = "LGLLGGRRRRRR";break;
        case "5":
          encoding = "LGGLLGRRRRRR";break;
        case "6":
          encoding = "LGGGLLRRRRRR";break;
        case "7":
          encoding = "LGLGLGRRRRRR";break;
        case "8":
          encoding = "LGLGGLRRRRRR";break;
        case "9":
          encoding = "LGGLGLRRRRRR";break;
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

  for (var _i = 0; _i < text.length; _i++) {
    if (_i === text.length / 2) {
      outlist.push({
        char: "CENTER",
        humanReadable: false,
        bits: "01010"
      });
    }

    var digit = text[_i] - "0";
    var type = encoding[_i];

    var index = type === "L" ? EAN_L : type === "G" ? EAN_G : EAN_R;
    var bitpattern = eanData[digit][index];
    outlist.push({
      char: text[_i],
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
}

function encodeFIM(text) {
  if (!/^[ABCD]$/.test(text)) {
    throw new Error("FIM can only encode 'A', 'B', 'C', or 'D'");
  }

  var bits = void 0;
  switch (text) {
    case "A":
      bits = "110010011";break;
    case "B":
      bits = "101101101";break;
    case "C":
      bits = "110101011";break;
    case "D":
      bits = "111010111";break;
  }

  return {
    type: "bits",
    data: [{ char: text, humanReadable: false, bits: bits }]
  };
}

var ITFData = [[0, 0, 1, 1, 0], [1, 0, 0, 0, 1], [0, 1, 0, 0, 1], [1, 1, 0, 0, 0], [0, 0, 1, 0, 1], [1, 0, 1, 0, 0], [0, 1, 1, 0, 0], [0, 0, 0, 1, 1], [1, 0, 0, 1, 0], [0, 1, 0, 1, 0]];

function encodeITF(text) {
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
}

function drawBitsBarcodeToCanvas(g, options, encodeData) {
  var bits = encodeData.data.map(function (d) {
    return d.bits;
  }).join("");

  g.save();

  // First transform so that no matter the x, y, horizontalAlign and
  // verticalAlign, we draw from the left at 0,0.

  var multiplier = bits.length + 2 * options.quietZoneSize;

  var bw = void 0;
  var width = void 0;
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

  // Translate to barcode start.
  g.translate(options.x, options.y);

  var rad = options.angle * Math.PI / 180;
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
  var xs = [0, width * cos, width * cos - height * sin, -height * sin];
  var ys = [0, width * sin, width * sin + height * cos, height * cos];

  var xmin = Math.min.apply(this, xs);
  var ymin = Math.min.apply(this, ys);
  var xmax = Math.max.apply(this, xs);
  var ymax = Math.max.apply(this, ys);

  switch (options.horizontalAlign) {
    case "left":
      g.translate(-xmin, 0);
      break;
    case "center":
      g.translate(-(width / 2 * cos - height / 2 * sin), 0);
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
      g.translate(0, -(width / 2 * sin + height / 2 * cos));
      break;
    case "bottom":
      g.translate(0, -ymax);
      break;
  }

  // Rotate.
  g.rotate(rad);

  // Skip quiet zone...
  g.translate(options.quietZoneSize * bw, 0);

  g.fillStyle = "black";

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
      g.fillRect(0, 0, barWidth, height);
      g.translate(barWidth, 0);
    } else {
      // We are at a space.
      var spaceCount = 1;
      while (n < bits.length && bits[++n] === "0") {
        spaceCount++;
      }

      var spaceWidth = spaceCount * bw;
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
}

function drawBitsBarcodeToPath(options, encodeData) {
  var bits = encodeData.data.map(function (d) {
    return d.bits;
  }).join("");

  var multiplier = bits.length + 2 * options.quietZoneSize;

  var bw = void 0;
  var width = void 0;
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

  var rects = [];

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

      rects.push("M " + xpos.toFixed(3) + ",0");
      rects.push("l " + barWidth + ",0");
      rects.push("l 0," + height);
      rects.push("l " + (-barWidth).toFixed(3) + ",0");
      rects.push("Z");

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

  return rects.join(" ");
}

function drawBitsBarcodeToSVG(options, encodeData) {
  var bits = encodeData.data.map(function (d) {
    return d.bits;
  }).join("");

  var multiplier = bits.length + 2 * options.quietZoneSize;

  var bw = void 0;
  var width = void 0;
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
  var attr = ["xmlns='http://www.w3.org/2000/svg'", "width='" + width.toFixed(3) + "'", "height='" + height + "'", "fill='black'"].join(" ");

  svgLines.push("<svg " + attr + ">");

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
      var props = ["width='" + barWidth + "'", "height='" + height + "'", "x='" + xpos.toFixed(3) + "'", "y='0'"].join(" ");
      svgLines.push("<rect " + props + " />");
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
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

var optionDefaults = {
  type: "Code 128",
  hasChecksum: false,
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
var copyDefaults = function copyDefaults(target, source) {
  for (var key in source) {
    if (typeof target[key] === "undefined") {
      target[key] = source[key];
    }
  }
};

/**
 * @summary Draw a barcode to a canvas graphics context.
 * @todo IMB, Pharmacode, PostBar, POSTNET, Telepen
 * @param {Context2D|String} g An HTML5 or node-canvas graphics context or the output format.  The only supported non-canvas output formats are "path" and "svg".
 * @param {String|String[]} text Barcode text (without start, end, or check characters).  It can also be an array of characters, in case you want to include a command character, like "FNC 1".
 * @param {Object} options Controls what barcode is drawn, where, and how.
 * @param {String} options.type Barcode type.  Defaults to Code 128.  Other valid options are "GS1 128", "Codabar", "Code 39", "EAN-8", "EAN-13", "FIM", "ITF" (interleaved 2 of 5), and "UPC-A".
 * @param {Boolean} options.hasChecksum If true, the barcode already has a checksum (which will be validated); if false, calculate and add a checksum. Defaults to false. **Currently works only for EAN-type barcodes (EAN-8, EAN-13, UPC-A).**
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
function drawBarcode(g, text, options) {
  // Validate input.
  if ((typeof g === "undefined" ? "undefined" : _typeof(g)) !== "object" && g !== "path" && g !== "svg") {
    throw new Error("drawBarcode: expected `g' to be an object or 'path' or 'svg'.");
  }

  if (!text) {
    throw new Error("drawBarcode: missing required parameter `text'.");
  }

  if ((typeof options === "undefined" ? "undefined" : _typeof(options)) !== "object") {
    options = {};
  }

  copyDefaults(options, optionDefaults);
  validateDrawBarcodeOptions(options);

  var encodeData = void 0;
  switch (options.type) {
    case "Codabar":
      encodeData = encodeCodabar(text);
      break;
    case "Code 128":
      encodeData = encodeCode128(text);
      break;
    case "GS1 128":
      // GS1 128 is a Code 128 barcode with an FNC 1 at the begining.
      var textArray = [];
      textArray.push("FNC 1");
      for (var n = 0; n < text.length; n++) {
        textArray.push(text[n]);
      }
      encodeData = encodeCode128(textArray);
      break;
    case "Code 39":
      encodeData = encodeCode39(text);
      break;
    case "ITF":
      encodeData = encodeITF(text);
      break;
    case "FIM":
      encodeData = encodeFIM(text);
      break;
    case "EAN-8":
    case "EAN-13":
    case "UPC-A":
      var expectedLength = void 0;
      if (options.type === "EAN-8") {
        expectedLength = 7;
      }
      if (options.type === "EAN-13") {
        expectedLength = 12;
      }
      if (options.type === "UPC-A") {
        expectedLength = 11;
      }
      if (options.hasChecksum) {
        expectedLength += 1;
      }
      if (expectedLength !== text.length) {
        throw new Error(options.type + " must be of length " + expectedLength);
      }
      encodeData = encodeEAN(text, options.hasChecksum);
      break;
    default:
      throw new Error("Unrecognized barcode type: " + options.type);
  }

  switch (encodeData.type) {
    case "bits":
      return drawBitsBarcode(g, options, encodeData);
    default:
      throw new Error("Unrecognized encoded barcode type: " + encodeData.type);
  }
}

function validateDrawBarcodeOptions(options) {
  assertIsBoolean(options.hasChecksum, "options.hasChecksum");
  assertIsNumber(options.x, "options.x");
  assertIsNumber(options.y, "options.y");
  assertIsValidHorizontalAlign(options.horizontalAlign);
  assertIsValidVerticalAlign(options.verticalAlign);
  assertIsPositiveNumber(options.height, "options.height");
  assertIsPositiveNumber(options.moduleWidth, "options.moduleWidth");
  assertIsNonNegativeNumber(options.quietZoneSize, "options.quietZoneSize");
  assertIsNumber(options.angle, "options.angle");
  assertIsPositiveNumber(options.maxWidth, "options.maxWidth");

  // width can either be NaN or a positive number.
  if (!isNaN(options.width)) {
    assertIsPositiveNumber(options.width, "options.width");
  }
}

function drawBitsBarcode(g, options, encodeData) {
  if (g === "path") {
    return drawBitsBarcodeToPath(options, encodeData);
  }

  if (g === "svg") {
    return drawBitsBarcodeToSVG(options, encodeData);
  }

  return drawBitsBarcodeToCanvas(g, options, encodeData);
}

var version = "2.1.0";

exports.drawBarcode = drawBarcode;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
