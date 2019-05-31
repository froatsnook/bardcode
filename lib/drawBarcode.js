import * as validations from "./validations";

import encodeCodabar from "./Codabar";
import encodeCode128 from "./Code128";
import encodeCode39 from "./Code39";
import encodeEAN from "./EAN";
import encodeFIM from "./FIM";
import encodeITF from "./ITF";

import drawBitsBarcodeToCanvas from "./canvas";
import drawBitsBarcodeToPath from "./path";
import drawBitsBarcodeToSVG from "./svg";

const optionDefaults = {
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
  width: NaN,
};

// Copy default values from source to target if they don't exist.
const copyDefaults = function(target, source) {
  for (const key in source) {
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
export function drawBarcode(g, text, options) {
  // Validate input.
  if (typeof g !== "object" && g !== "path" && g !== "svg") {
    throw new Error("drawBarcode: expected `g' to be an object or 'path' or 'svg'.");
  }

  if (!text) {
    throw new Error("drawBarcode: missing required parameter `text'.");
  }

  if (typeof options !== "object") {
    options = { };
  }

  copyDefaults(options, optionDefaults);
  validateDrawBarcodeOptions(options);

  let encodeData;
  switch (options.type) {
  case "Codabar":
    encodeData = encodeCodabar(text);
    break;
  case "Code 128":
    encodeData = encodeCode128(text);
    break;
  case "GS1 128":
    // GS1 128 is a Code 128 barcode with an FNC 1 at the begining.
    const textArray = [];
    textArray.push("FNC 1");
    for (let n = 0; n < text.length; n++) {
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
    let expectedLength;
    if (options.type === "EAN-8") { expectedLength = 7; }
    if (options.type === "EAN-13") { expectedLength = 12; }
    if (options.type === "UPC-A") { expectedLength = 11; }
    if (options.hasChecksum) { expectedLength += 1; }
    if (expectedLength !== text.length) {
      throw new Error(`${options.type} must be of length ${expectedLength}`);
    }
    encodeData = encodeEAN(text, options.hasChecksum);
    break;
  default:
    throw new Error(`Unrecognized barcode type: ${options.type}`);
  }

  switch (encodeData.type) {
  case "bits":
    return drawBitsBarcode(g, options, encodeData);
  default:
    throw new Error(`Unrecognized encoded barcode type: ${encodeData.type}`);
  }
}

function validateDrawBarcodeOptions(options) {
  validations.assertIsBoolean(options.hasChecksum, "options.hasChecksum");
  validations.assertIsNumber(options.x, "options.x");
  validations.assertIsNumber(options.y, "options.y");
  validations.assertIsValidHorizontalAlign(options.horizontalAlign);
  validations.assertIsValidVerticalAlign(options.verticalAlign);
  validations.assertIsPositiveNumber(options.height, "options.height");
  validations.assertIsPositiveNumber(options.moduleWidth, "options.moduleWidth");
  validations.assertIsNonNegativeNumber(options.quietZoneSize, "options.quietZoneSize");
  validations.assertIsNumber(options.angle, "options.angle");
  validations.assertIsPositiveNumber(options.maxWidth, "options.maxWidth");

  // width can either be NaN or a positive number.
  if (!isNaN(options.width)) {
    validations.assertIsPositiveNumber(options.width, "options.width");
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

