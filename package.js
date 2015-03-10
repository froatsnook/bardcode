Package.describe({
    name: "froatsnook:bardcode",
    version: "1.0.0",
    summary: "Draw 1-D barcodes to Canvases (client and server)",
    git: "https://github.com/froatsnook/bardcode"
});

Package.onUse(function(api) {
    api.versionsFrom("1.0.3.1");
    api.addFiles("lib/01-bardcode.js");
    api.addFiles("lib/canvas.js");
    api.addFiles("lib/Codabar.js");
    api.addFiles("lib/Code128.js");
    api.addFiles("lib/Code39.js");
    api.addFiles("lib/drawBarcode.js");
    api.addFiles("lib/EAN.js");
    api.addFiles("lib/FIM.js");
    api.addFiles("lib/ITF.js");
    api.addFiles("lib/validations.js");

    api.export("drawBarcode");
    api.export("bardcode");
});

Package.onTest(function(api) {
    Npm.depends({
        "canvas": "1.1.6"
    });

    api.use("tinytest");
    api.use("froatsnook:bardcode");

    api.addFiles("test/tests.js");
});

