if (Meteor.isServer) {
    var child_process = Npm.require("child_process");
    var fs = Npm.require("fs");
    var path = Npm.require("path");

    var Canvas = Npm.require("canvas");

    // Await a program to close, returning its exit code.
    var awaitCloseAsync = function(x, callback) {
        x.on("close", function(code) { callback(null, code); });
    };

    // Make it synchronous.
    var awaitClose = Meteor.wrapAsync(awaitCloseAsync);

    var zbar = path.join(process.env.PWD, "zbar");
    var zbarimg = path.join(zbar, "zbarimg");
    if (!fs.existsSync(zbarimg)) {
        throw new Error("Tests require zbarimg at '" + zbarimg + "'");
    }

    // Run zbar, looking for a barcode.
    //
    // @param file {String} File name.  Must be an absolute path.
    // @return { stdout, stderr, code }
    var runZbar = function(file) {
        // Run zbar on the given file
        var child = child_process.execFile(zbarimg, [file], {
            env: {
                "LD_LIBRARY_PATH": zbar
            }
        });

        // Read stdout and stderr
        var stdout = streamToBuffer(child.stdout);
        var stderr = streamToBuffer(child.stderr);

        // Get the exit code
        var code = awaitClose(child);

        return {
            stdout: stdout,
            stderr: stderr,
            code: code
        };
    };

    // Temporarily write an image to file, run zbar on it, and then delete it.
    //
    // @param buffer {Buffer} PNG data buffer.
    // @return { stdout, stderr, code }
    var getBarcodes = function(buffer, options) {
        if (!options) {
            options = { };
        }

        var name = options.name || "test-" + Random.id(8) + ".png";
        var save = options.save || false;

        var file = path.join(process.env.PWD, name);
        fs.writeFileSync(file, buffer);

        var info = runZbar(file);

        if (!save) {
            fs.unlinkSync(file);
        }

        return info;
    };

    // For now, save test images to rootdir.
    var rootDir = process.env.PWD;

    Tinytest.add("Code 128 - Checksum(\"BarCode 1\") == 33", function(test) {
        var encoded = bardcode.encodeCode128("BarCode 1");
        test.equal(encoded.checksum, 33);
    });

    Tinytest.add("Code 128 - Test 1", function(test) {
        var canvas = new Canvas(600, 100);
        var g = canvas.getContext("2d");
        g.fillStyle = "white";
        g.fillRect(0, 0, 600, 100);
        drawBarcode(g, "Code 128 test 1", {
            width: 600,
            height: 100,
            quietZoneSize: 10
        });

        var zbarOutput = getBarcodes(canvas.toBuffer());
        test.equal(zbarOutput.code, 0);
        var output = zbarOutput.stdout.trim();
        var lines = output.split("\n");
        test.equal(lines.length, 1);
        test.isTrue(/^CODE-128:(.*)$/.test(lines[0]));
        test.equal(RegExp.$1, "Code 128 test 1");
    });

    Tinytest.add("Code 128 - at angles", function(test) {
        var canvas = new Canvas(1000, 1000);
        var g = canvas.getContext("2d");

        g.fillStyle = "white";
        g.fillRect(0, 0, 1000, 1000);

        g.lineWidth = 1;
        var i = 100;

        drawBarcode(g, "a", {
            angle: 10*i,
            x: 100,
            y: 100,
            horizontalAlign: "left",
            verticalAlign: "top"
        });

        drawBarcode(g, "b", {
            angle: 10*i,
            text: " ",
            x: 900,
            y: 100,
            horizontalAlign: "right",
            verticalAlign: "top"
        });

        drawBarcode(g, "c", {
            angle: 10*i,
            x: 500,
            y: 500,
            horizontalAlign: "center",
            verticalAlign: "middle"
        });

        drawBarcode(g, "d", {
            angle: 10*i,
            x: 100,
            y: 900,
            horizontalAlign: "left",
            verticalAlign: "bottom"
        });

        drawBarcode(g, "e", {
            angle: 10*i,
            x: 900,
            y: 900,
            horizontalAlign: "right",
            verticalAlign: "bottom"
        });

        drawBarcode(g, "test", {
            x: 300,
            y: 300,
            width: 140,
            height: 100,
            quietZoneSize: 0
        });

        var zbarOutput = getBarcodes(canvas.toBuffer());
        test.equal(zbarOutput.code, 0);
        var output = zbarOutput.stdout.trim();
        var lines = output.split("\n");
        test.equal(lines.length, 6);

        test.isTrue(lines.indexOf("CODE-128:a") >= 0);
        test.isTrue(lines.indexOf("CODE-128:b") >= 0);
        test.isTrue(lines.indexOf("CODE-128:c") >= 0);
        test.isTrue(lines.indexOf("CODE-128:d") >= 0);
        test.isTrue(lines.indexOf("CODE-128:e") >= 0);
        test.isTrue(lines.indexOf("CODE-128:test") >= 0);
    });

    Tinytest.add("Code 128 - test SHIFT A", function(test) {
        var canvas = new Canvas(300, 100);
        var g = canvas.getContext("2d");
        g.fillStyle = "white";
        g.fillRect(0, 0, 300, 100);
        drawBarcode(g, "Test\nThree", {
            maxWidth: 300,
            height: 100,
            quietZoneSize: 10
        });

        var zbarOutput = getBarcodes(canvas.toBuffer());
        test.equal(zbarOutput.code, 0);
        var output = zbarOutput.stdout.trim();
        var lines = output.split("\n");
        test.equal(lines.length, 2);
        test.equal(lines[0], "CODE-128:Test");
        test.equal(lines[1], "Three");
    });

    Tinytest.add("ITF - Odd Char Count", function(test) {
        var canvas = new Canvas(300, 100);
        var g = canvas.getContext("2d");
        g.fillStyle = "white";
        g.fillRect(0, 0, 300, 100);
        drawBarcode(g, "04004", {
            type: "ITF",
            maxWidth: 300,
            height: 100,
            quietZoneSize: 10
        });

        var zbarOutput = getBarcodes(canvas.toBuffer());
        test.equal(zbarOutput.code, 0);
        var output = zbarOutput.stdout.trim();
        var lines = output.split("\n");
        test.equal(lines.length, 1);
        test.equal(lines[0], "I2/5:004004");
    });

    Tinytest.add("ITF - Even Char Count", function(test) {
        var canvas = new Canvas(300, 100);
        var g = canvas.getContext("2d");
        g.fillStyle = "white";
        g.fillRect(0, 0, 300, 100);
        drawBarcode(g, "11223344", {
            type: "ITF",
            maxWidth: 300,
            height: 100,
            quietZoneSize: 10
        });

        var zbarOutput = getBarcodes(canvas.toBuffer());
        test.equal(zbarOutput.code, 0);
        var output = zbarOutput.stdout.trim();
        var lines = output.split("\n");
        test.equal(lines.length, 1);
        test.equal(lines[0], "I2/5:11223344");
    });

    Tinytest.add("Code 39 - Characters", function(test) {
        var canvas = new Canvas(1000, 1000);
        var g = canvas.getContext("2d");

        g.fillStyle = "white";
        g.fillRect(0, 0, 400, 550);

        drawBarcode(g, "0123456789", {
            type: "Code 39",
            x: 0,
            y: 0,
            maxWidth: 400,
            height: 100,
            quietZoneSize: 10
        });

        drawBarcode(g, "ABCDEFGHIJ", {
            type: "Code 39",
            x: 0,
            y: 150,
            maxWidth: 400,
            height: 100,
            quietZoneSize: 10
        });

        drawBarcode(g, "KLMNOPQRST", {
            type: "Code 39",
            x: 0,
            y: 300,
            maxWidth: 400,
            height: 100,
            quietZoneSize: 10
        });

        drawBarcode(g, "UVW -.XYZ", {
            type: "Code 39",
            x: 0,
            y: 450,
            maxWidth: 400,
            height: 100,
            quietZoneSize: 10
        });

        var zbarOutput = getBarcodes(canvas.toBuffer());
        test.equal(zbarOutput.code, 0);
        var output = zbarOutput.stdout.trim();
        var lines = output.split("\n");
        test.equal(lines.length, 4);

        test.isTrue(lines.indexOf("CODE-39:0123456789") >= 0);
        test.isTrue(lines.indexOf("CODE-39:ABCDEFGHIJ") >= 0);
        test.isTrue(lines.indexOf("CODE-39:KLMNOPQRST") >= 0);
        test.isTrue(lines.indexOf("CODE-39:UVW -.XYZ") >= 0);
    });

    Tinytest.add("Code 39 - WIKIPEDIA", function(test) {
        var canvas = new Canvas(1000, 1000);
        var g = canvas.getContext("2d");

        g.fillStyle = "white";
        g.fillRect(0, 0, 800, 300);

        drawBarcode(g, "WIKIPEDIA", {
            type: "Code 39",
            x: 0,
            y: 0,
            width: 800,
            height: 300,
            quietZoneSize: 10
        });

        var zbarOutput = getBarcodes(canvas.toBuffer());
        test.equal(zbarOutput.code, 0);
        var output = zbarOutput.stdout.trim();
        var lines = output.split("\n");
        test.equal(lines.length, 1);

        test.isTrue(lines.indexOf("CODE-39:WIKIPEDIA") >= 0);
    });

    Tinytest.add("EAN - checksum(\"400638133393\") == 1", function(test) {
        var encodeData = bardcode.encodeEAN("400638133393");
        test.equal(encodeData.checksum, 1);
    });

    Tinytest.add("EAN - checksum(\"846823000342\") == 0", function(test) {
        var encodeData = bardcode.encodeEAN("846823000342");
        test.equal(encodeData.checksum, 0);
    });

    Tinytest.add("EAN - checksum(\"9638507\") == 4", function(test) {
        var encodeData = bardcode.encodeEAN("9638507");
        test.equal(encodeData.checksum, 4);
    });

    Tinytest.add("EAN - EAN-13", function(test) {
        var canvas = new Canvas(400, 100);
        var g = canvas.getContext("2d");
        g.fillStyle = "white";
        g.fillRect(0, 0, 400, 100);
        drawBarcode(g, "590123412345", {
            type: "EAN-13",
            maxWidth: 400,
            height: 100,
            quietZoneSize: 10
        });

        var zbarOutput = getBarcodes(canvas.toBuffer());
        test.equal(zbarOutput.code, 0);
        var output = zbarOutput.stdout.trim();
        var lines = output.split("\n");
        test.equal(lines.length, 1);
        test.equal(lines[0], "EAN-13:5901234123457");
    });

    Tinytest.add("EAN - EAN-8", function(test) {
        var canvas = new Canvas(400, 100);
        var g = canvas.getContext("2d");
        g.fillStyle = "white";
        g.fillRect(0, 0, 400, 100);
        drawBarcode(g, "9638507", {
            type: "EAN-8",
            maxWidth: 400,
            height: 100,
            quietZoneSize: 10
        });

        var zbarOutput = getBarcodes(canvas.toBuffer());
        test.equal(zbarOutput.code, 0);
        var output = zbarOutput.stdout.trim();
        var lines = output.split("\n");
        test.equal(lines.length, 1);
        test.equal(lines[0], "EAN-8:96385074");
    });

    Tinytest.add("FIM - test no crash", function(test) {
        var canvas = new Canvas(400, 100);
        var g = canvas.getContext("2d");
        g.fillStyle = "white";
        g.fillRect(0, 0, 400, 100);
        drawBarcode(g, "C", {
            type: "FIM",
            maxWidth: 400,
            height: 100,
            moduleWidth: 2,
            quietZoneSize: 10
        });
    });

    Tinytest.add("Codabar - test no crash", function(test) {
        var canvas = new Canvas(400, 100);
        var g = canvas.getContext("2d");
        g.fillStyle = "white";
        g.fillRect(0, 0, 400, 100);
        drawBarcode(g, "31117013206375", {
            type: "Codabar",
            maxWidth: 400,
            height: 100,
            quietZoneSize: 10
        });
    });

    Tinytest.add("SVG - test", function(test) {
        var svg = drawBarcode("svg", "3117820", {
            maxWidth: 400,
            height: 100,
            quietZoneSize: 8
        });

        test.equal(svg.indexOf("<svg"), 0);

        var zbarOutput = getBarcodes(svg, {
            name: "test-" + Random.id(8) + ".svg"
        });

        test.equal(zbarOutput.code, 0);
        var output = zbarOutput.stdout.trim();
        var lines = output.split("\n");
        test.equal(lines.length, 1);
        test.equal(lines[0], "CODE-128:3117820");
    });
}

