// At the moment Code 128 supports 128-B well, with basic support for 128-A
// (shifting for each character which lives in A but not B).  Most of the
// building blocks for 128-C are included, but it's not implemented yet.
//
// There is also no ISO-8859-1 support (which would use FNC4).

const CODE_128_VAL = 0;
const CODE_128_CHAR_A = 1;
const CODE_128_CHAR_B = 2;
const CODE_128_CHAR_C = 3;
const CODE_128_BITS = 4;

// VALUE, CODE A CHAR, CODE B CHAR, CODE C CHARS, BITS
const code128 = [
  [0, " ", " ", "00", "11011001100"],
  [1, "!", "!", "01", "11001101100"],
  [2, "\"", "\"", "02", "11001100110"],
  [3, "#", "#", "03", "10010011000"],
  [4, "$", "$", "04", "10010001100"],
  [5, " %", " %", "05", "10001001100"],
  [6, "&", "&", "06", "10011001000"],
  [7, "'", "'", "07", "10011000100"],
  [8, "(", "(", "08", "10001100100"],
  [9, ")", ")", "09", "11001001000"],
  [10, "*", "*", "10", "11001000100"],
  [11, "+", "+", "11", "11000100100"],
  [12, ", ", ", ", "12", "10110011100"],
  [13, "-", "-", "13", "10011011100"],
  [14, ".", ".", "14", "10011001110"],
  [15, "/", "/", "15", "10111001100"],
  [16, "0", "0", "16", "10011101100"],
  [17, "1", "1", "17", "10011100110"],
  [18, "2", "2", "18", "11001110010"],
  [19, "3", "3", "19", "11001011100"],
  [20, "4", "4", "20", "11001001110"],
  [21, "5", "5", "21", "11011100100"],
  [22, "6", "6", "22", "11001110100"],
  [23, "7", "7", "23", "11101101110"],
  [24, "8", "8", "24", "11101001100"],
  [25, "9", "9", "25", "11100101100"],
  [26, ":", ":", "26", "11100100110"],
  [27, ";", ";", "27", "11101100100"],
  [28, "<", "<", "28", "11100110100"],
  [29, "=", "=", "29", "11100110010"],
  [30, ">", ">", "30", "11011011000"],
  [31, "?", "?", "31", "11011000110"],
  [32, "@", "@", "32", "11000110110"],
  [33, "A", "A", "33", "10100011000"],
  [34, "B", "B", "34", "10001011000"],
  [35, "C", "C", "35", "10001000110"],
  [36, "D", "D", "36", "10110001000"],
  [37, "E", "E", "37", "10001101000"],
  [38, "F", "F", "38", "10001100010"],
  [39, "G", "G", "39", "11010001000"],
  [40, "H", "H", "40", "11000101000"],
  [41, "I", "I", "41", "11000100010"],
  [42, "J", "J", "42", "10110111000"],
  [43, "K", "K", "43", "10110001110"],
  [44, "L", "L", "44", "10001101110"],
  [45, "M", "M", "45", "10111011000"],
  [46, "N", "N", "46", "10111000110"],
  [47, "O", "O", "47", "10001110110"],
  [48, "P", "P", "48", "11101110110"],
  [49, "Q", "Q", "49", "11010001110"],
  [50, "R", "R", "50", "11000101110"],
  [51, "S", "S", "51", "11011101000"],
  [52, "T", "T", "52", "11011100010"],
  [53, "U", "U", "53", "11011101110"],
  [54, "V", "V", "54", "11101011000"],
  [55, "W", "W", "55", "11101000110"],
  [56, "X", "X", "56", "11100010110"],
  [57, "Y", "Y", "57", "11101101000"],
  [58, "Z", "Z", "58", "11101100010"],
  [59, "[", "[", "59", "11100011010"],
  [60, "\\", "\\", "60", "11101111010"],
  [61, "]", "]", "61", "11001000010"],
  [62, "^", "^", "62", "11110001010"],
  [63, "_", "_", "63", "10100110000"],
  [64, "\0", "`", "64", "10100001100"],
  [65, "\x01", "a", "65", "10010110000"],
  [66, "\x02", "b", "66", "10010000110"],
  [67, "\x03", "c", "67", "10000101100"],
  [68, "\x04", "d", "68", "10000100110"],
  [69, "\x05", "e", "69", "10110010000"],
  [70, "\x06", "f", "70", "10110000100"],
  [71, "\x07", "g", "71", "10011010000"],
  [72, "\b", "h", "72", "10011000010"],
  [73, "\x01", "i", "73", "10000110100"],
  [74, "\n", "j", "74", "10000110010"],
  [75, "\v", "k", "75", "11000010010"],
  [76, "\f", "l", "76", "11001010000"],
  [77, "\r", "m", "77", "11110111010"],
  [78, "\x08", "n", "78", "11000010100"],
  [79, "\x09", "o", "79", "10001111010"],
  [80, "\x10", "p", "80", "10100111100"],
  [81, "\x11", "q", "81", "10010111100"],
  [82, "\x12", "r", "82", "10010011110"],
  [83, "\x13", "s", "83", "10111100100"],
  [84, "\x14", "t", "84", "10011110100"],
  [85, "\x15", "u", "85", "10011110010"],
  [86, "\x16", "v", "86", "11110100100"],
  [87, "\x17", "w", "87", "11110010100"],
  [88, "\x18", "x", "88", "11110010010"],
  [89, "\x19", "y", "89", "11011011110"],
  [90, "\x1a", "z", "90", "11011110110"],
  [91, "\x1b", "{", "91", "11110110110"],
  [92, "\x1c", "|", "92", "10101111000"],
  [93, "\x1d", "}", "93", "10100011110"],
  [94, "\x1e", "~", "94", "10001011110"],
  [95, "\x1f", "\x7f", "95", "10111101000"],
  [96, "FNC 3", "FNC 3", "96", "10111100010"],
  [97, "FNC 2", "FNC 2", "97", "11110101000"],
  [98, "SHIFT B", "SHIFT A", "98", "11110100010"],
  [99, "CODE C", "CODE C", "99", "10111011110"],
  [100, "CODE B", "FNC 4", "CODE B", "10111101110"],
  [101, "FNC 4", "CODE A", "CODE A", "11101011110"],
  [102, "FNC 1", "FNC 1", "FNC 1", "11110101110"],
  [103, "A0", "A0", "A0", "11010000100"],
  [104, "B0", "B0", "B0", "11010010000"],
  [105, "C0", "C0", "C0", "11010011100"],
  [106, "STOP", "STOP", "STOP", "1100011101011"],
];

// Reverse lookups from first 4 columns.  Created on first use.
let code128ValLookup = null;
let code128ALookup = null;
let code128BLookup = null;
let code128CLookup = null;

const makeCode128Lookups = function() {
  if (code128ValLookup) {
    return;
  }

  code128ValLookup = { };
  code128ALookup = { };
  code128BLookup = { };
  code128CLookup = { };

  for (let i = 0; i < code128.length; i++) {
    const data = code128[i];

    const val = data[CODE_128_VAL];
    const charA = data[CODE_128_CHAR_A];
    const charB = data[CODE_128_CHAR_B];
    const charC = data[CODE_128_CHAR_C];

    code128ValLookup[val] = data;
    code128ALookup[charA] = data;
    code128BLookup[charB] = data;
    code128CLookup[charC] = data;
  }
};

export default function encodeCode128(text) {
  makeCode128Lookups();

  const chars = new Array(1 + text.length);
  chars[0] = "B0";
  for (let i = 0, len = text.length; i < len; i++) {
    chars[1 + i] = text[i];
  }

  // Basic support for Code 128-A: do shift A before characters which live in
  // A but not in B.
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (code128ALookup[ch] && !code128BLookup[ch]) {
      chars.splice(i, 0, "SHIFT A");
      i++;
    }
  }

  // Main thing we return is a list of characters.
  // [{ bits: "1011011", mode: "A", value: 44, char: "L", humanReadable: true }, ...]
  const outlist = [];

  let mode;
  switch (chars[0]) {
  case "A0": mode = "A"; break;
  case "B0": mode = "B"; break;
  case "C0": mode = "C"; break;
  default: throw new Error("Expected a starting character");
  }

  // If "SHIFT A" is a character in chars, then shift to mode A for one
  // character, and then switch back to returnMode.
  let returnMode;

  let sum = 0;
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];

    // The weight value depends on what mode we're in.
    let data;
    switch (mode) {
    case "A":
      data = code128ALookup[ch];
      break;
    case "B":
      data = code128BLookup[ch];
      break;
    case "C":
      data = code128CLookup[ch];
      break;
    }

    // Throw an error if the character does not exist in this mode.
    if (!data) {
      throw new Error(`Invalid input (no such char '${ch}' in mode ${mode})`);
    }

    const val = data[CODE_128_VAL];
    const bits = data[CODE_128_BITS];

    // Contribute to sum.
    const n = i || 1; // both start code and first text char have position 1.
    sum += n * val;

    outlist.push({
      bits: bits,
      char: ch,
      humanReadable: null,
      _mode: mode,
      _val: val,
    });

    // Return to previous mode after a shift.
    if (returnMode) {
      mode = returnMode;
      returnMode = null;
    }

    // Handle mode switches.
    switch (ch) {
    case "CODE A": mode = "A"; break;
    case "CODE B": mode = "B"; break;
    case "CODE C": mode = "C"; break;
    case "SHIFT A": returnMode = mode; mode = "A"; break;
    case "SHIFT B": returnMode = mode; mode = "B"; break;

    default:
      // Do nothing for non-mode switching characters.
      break;
    }
  }

  const checksum = sum % 103;

  // Append the checksum.
  const checksumData = code128ValLookup[checksum];
  outlist.push({
    bits: checksumData[CODE_128_BITS],
    char: "CHECKSUM",
    humanReadable: false,
    _val: checksum,
  });

  // Append the stop char.
  const stopData = code128ALookup.STOP;
  outlist.push({
    bits: stopData[CODE_128_BITS],
    char: "STOP",
    humanReadable: false,
    _val: stopData[CODE_128_VAL],
  });

  return {
    type: "bits",
    checksum: checksum,
    data: outlist,
  };
}

