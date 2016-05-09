Render 1-D barcodes to canvas or svg.  Supports Code 128, 3 of 9, 2 of 5, EAN, and more.

## Why?
This barcode library specializes in its use of the canvas API.  You provide a canvas (be it in a browser or with [node-canvas](https://github.com/Automattic/node-canvas)), and then specify where the barcode should be drawn, how large it should be, and at what angle.

Other barcode libraries that I found created pngs or svgs directly and were not very flexible in the output size (i.e. no `maxWidth` option).  Rendering directly to a canvas allows for a flexible API if that's your target anyway.

## Demos/Playground
First of all, check out the [demos](https://froatsnook.github.io/bardcode/).

## Barcode Generator

Did you ever want to paste a list of strings and download a zip file of corresponding images?  Well I did once and made this [barcode-generator](https://froatsnook.github.io/barcode-generator).  See demos for the source.

## How?
```js
// In the browser
var canvas = document.getElementById("barcode-canvas");
var g = canvas.getContext("2d");
drawBarcode(g, "Test barcode", options);
```

```js
// On the server
var bardcode = require("bardcode");
var Canvas = require("canvas");
var canvas = new Canvas(595, 842, "pdf");
var g = canvas.getContext("2d");
bardcode.drawBarcode(g, "Test barcode", options);
```

```js
// Meteor server
var Canvas = Meteor.npmRequire("canvas");
var canvas = new Canvas(595, 842, "pdf");
var g = canvas.getContext("2d");
drawBarcode(g, "Test barcode", options);
```

## Symbology
The following barcode formats are supported:

* Codabar
* Code 128
* Code 39
* EAN-8
* EAN-13
* FIM
* ITF (interleaved 2 of 5)
* UPC-A

## API
```js
// browser+meteor
drawBarcode(g, barcodeText, options);

// node
var bardcode = require("bardcode");
bardcode.drawBarcode(g, barcodeText, options);
```

* `g` is a Canvas' 2-D graphics context or the output format.  The only supported non-canvas output format is `"svg"`.
* `barcodeText` is a string.  Allowed characters depend on the chosen symbology.
* `options` is an optional object with the following properties:
    * `options.type` Barcode type.  Defaults to Code 128.  Other valid options are "Codabar", "Code 39", "EAN-8", "EAN-13", "FIM", "ITF" (interleaved 2 of 5), and "UPC-A".
    * `options.hasChecksum` If true, the barcode already has a checksum (which will be validated); if false, calculate and add a checksum. Defaults to false. **Currently works only for EAN-type barcodes (EAN-8, EAN-13, UPC-A).** 
    * `options.x` Where to draw barcode.  Defaults to 0.
    * `options.y` Where to draw the barcode.  Defaults to 0.
    * `options.horizontalAlign` How to align the barcode.  Defaults to "left".  Other options are "center" and "right".
    * `options.verticalAlign` How to align the barcode.  Defaults to "top".  Other options are "middle" and "bottom".
    * `options.height` Barcode height.  Defaults to 90.72.
    * `options.moduleWidth` Width of thinnest bar.  Defaults to 2.892.
    * `options.quietZoneSize` Number of moduleWidths in quiet zone on either side.  Defaults to 10.
    * `options.angle` Rotate barcode this many degrees clockwise.  Defaults to 0.
    * `options.maxWidth` Maximum barcode width (including quiet zones).  If specified, then the moduleWidth will be adjusted if necessary to make the entire barcode fit in the given width.
    * `options.width` If given, then ignore moduleWidth and maxWidth and set the moduleWidth so that the barcode will have the given width (including quiet zones).

Note: `width` and `maxWidth` refer to the unrotated barcode width.

## SVG
If the first parameter to `bardcode.drawBarcode`, `g`, is `"svg"`, then an SVG string is returned.

For the moment, the only supported options when using SVG are:
* `options.type`
* `options.height`
* `options.moduleWidth`
* `options.quietZoneSize`
* `options.maxWidth`
* `options.width`

## Errors
Errors are thrown on invalid input, for example when including letters in EAN barcodes.

## Installation
`node-canvas` installation causes issues for a lot of users.  So it's an optional dependency (i.e. you should Bring Your Own Canvas).  It's also not a node dependency because it's not the only output format.

For the browser:
* Include `dist/bardcode.js` or `dist/bardcode.min.js`

For node:
* `npm install canvas` (requires cairo)
* `npm install bardcode`

For meteor:
* (optional) `meteor add meteorhacks:npm` and add `"canvas": "1.1.6"` to `packages.json`
* `meteor add froatsnook:bardcode`

## Testing
Tests require meteor and zbar.

* Download zbar: http://zbar.sourceforge.net/
* `./configure --disable-video --without-qt --without-gtk --without-python`
* `make`
* Copy `zbarimg/zbarimg` and `zbar/.libs/libzbar.so*` to a new directory called `zbar` in `bardcode`'s project directory
* `meteor test-packages ./` in `bardcode`'s project directory
* Open `localhost:3000` in a browser

## Contributors
Thank you:

* [wolfgang42](https://github.com/wolfgang42)

## License
MIT

