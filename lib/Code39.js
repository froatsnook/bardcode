const CODE_39_CHAR = 0;
const CODE_39_CHECKSUM_VAL = 1;
const CODE_39_BITS = 2;

const code39Data = [
  ["1", 1, "110100101011"],
  ["2", 2, "101100101011"],
  ["3", 3, "110110010101"],
  ["4", 4, "101001101011"],
  ["5", 5, "110100110101"],
  ["6", 6, "101100110101"],
  ["7", 7, "101001011011"],
  ["8", 8, "110100101101"],
  ["9", 9, "101100101101"],
  ["0", 0, "101001101101"],
  ["A", 10, "110101001011"],
  ["B", 11, "101101001011"],
  ["C", 12, "110110100101"],
  ["D", 13, "101011001011"],
  ["E", 14, "110101100101"],
  ["F", 15, "101101100101"],
  ["G", 16, "101010011011"],
  ["H", 17, "110101001101"],
  ["I", 18, "101101001101"],
  ["J", 19, "101011001101"],
  ["K", 20, "110101010011"],
  ["L", 21, "101101010011"],
  ["M", 22, "110110101001"],
  ["N", 23, "101011010011"],
  ["O", 24, "110101101001"],
  ["P", 25, "101101101001"],
  ["Q", 26, "101010110011"],
  ["R", 27, "110101011001"],
  ["S", 28, "101101011001"],
  ["T", 29, "101011011001"],
  ["U", 30, "110010101011"],
  ["V", 31, "100110101011"],
  ["W", 32, "110011010101"],
  ["X", 33, "100101101011"],
  ["Y", 34, "110010110101"],
  ["Z", 35, "100110110101"],
  ["-", 36, "100101011011"],
  [".", 37, "110010101101"],
  [" ", 38, "100110101101"],
  ["*", NaN, "100101101101"],
];

let code39Lookup = null;

const makeCode39Lookups = function() {
  if (code39Lookup) {
    return;
  }

  code39Lookup = { };

  code39Data.forEach(function(row) {
    const ch = row[CODE_39_CHAR];
    code39Lookup[ch] = row;
  });
};

// @param [withChecksum] {Boolean} If true, then add the mod 43 checksum.  Defaults to false.
export default function encodeCode39(text, withChecksum) {
  makeCode39Lookups();

  // @todo implement
  withChecksum = withChecksum || false;

  if (!text) {
    text = "";
  }

  text = `*${text}*`;

  const outlist = [];

  for (let i = 0; i < text.length; i++) {
    if (i !== 0) {
      outlist.push({
        char: "",
        bits: "0",
        humanReadable: false,
      });
    }

    const ch = text[i];
    const row = code39Lookup[ch];
    if (!row) {
      throw new Error(`Cannot encode code 39 barcode: invalid char: ${ch}`);
    }

    const bits = row[CODE_39_BITS];
    outlist.push({
      char: ch,
      bits: bits,
      humanReadable: true,
    });
  }

  return {
    type: "bits",
    data: outlist,
  };
}

