if (Meteor.isServer) {
    var Canvas = Npm.require("canvas");

    // For now, save test images to rootdir.
    var rootDir = process.env.PWD;

    Tinytest.add("Code 128 Checksum(\"BarCode 1\") == 33", function(test) {
        var encoded = bardcode.encodeCode128("BarCode 1");
        test.equal(encoded.checksum, 33);
    });

    Tinytest.add("Code 128 Test 1", function(test) {
        var canvas = new Canvas(600, 100);
        var g = canvas.getContext("2d");
        g.fillStyle = "white";
        g.fillRect(0, 0, 600, 100);
        drawBarcode(g, "Bearded Barcode", {
            width: 600,
            height: 100,
            quietZoneSize: 10
        });
    });

    Tinytest.add("Code 128 Test 2", function(test) {
        var canvas = new Canvas(1000, 1000);
        var g = canvas.getContext("2d");

        g.fillStyle = "white";
        g.fillRect(0, 0, 1000, 1000);

        g.lineWidth = 1;
        for (var i = 0; i < 100; i++) {
            g.beginPath();
            if (i%10 === 0) {
                g.strokeStyle = "#444";
            } else {
                g.strokeStyle = "#888";
            }
            g.moveTo(10*i, 0);
            g.lineTo(10*i, 1000);
            g.moveTo(0, 10*i);
            g.lineTo(1000, 10*i);
            g.stroke();
        }

        drawBarcode(g, " ", {
            angle: 10*i,
            x: 100,
            y: 100,
            horizontalAlign: "left",
            verticalAlign: "top"
        });

        drawBarcode(g, " ", {
            angle: 10*i,
            text: " ",
            x: 900,
            y: 100,
            horizontalAlign: "right",
            verticalAlign: "top"
        });

        drawBarcode(g, " ", {
            angle: 10*i,
            x: 500,
            y: 500,
            horizontalAlign: "center",
            verticalAlign: "middle"
        });

        drawBarcode(g, " ", {
            angle: 10*i,
            x: 100,
            y: 900,
            horizontalAlign: "left",
            verticalAlign: "bottom"
        });

        drawBarcode(g, " ", {
            angle: 10*i,
            x: 900,
            y: 900,
            horizontalAlign: "right",
            verticalAlign: "bottom"
        });

        drawBarcode(g, "test", {
            x: 300,
            y: 300,
            width: 100,
            height: 100,
            quietZoneSize: 0
        });
    });

    Tinytest.add("Code 128 test 3 (with SHIFT A)", function(test) {
        var canvas = new Canvas(300, 100);
        var g = canvas.getContext("2d");
        g.fillStyle = "white";
        g.fillRect(0, 0, 300, 100);
        drawBarcode(g, "Test\nThree", {
            maxWidth: 300,
            height: 100,
            quietZoneSize: 10
        });
    });

    Tinytest.add("Test ITF", function(test) {
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
    });

    Tinytest.add("Test Code 39", function(test) {
        var canvas = new Canvas(1000, 1000);
        var g = canvas.getContext("2d");

        g.fillStyle = "white";
        g.fillRect(0, 0, 300, 550);

        drawBarcode(g, "0123456789", {
            x: 0,
            y: 0,
            maxWidth: 300,
            height: 100,
            quietZoneSize: 10
        });

        drawBarcode(g, "ABCDEFGHIJ", {
            x: 0,
            y: 150,
            maxWidth: 300,
            height: 100,
            quietZoneSize: 10
        });

        drawBarcode(g, "KLMNOPQRST", {
            x: 0,
            y: 300,
            maxWidth: 300,
            height: 100,
            quietZoneSize: 10
        });

        drawBarcode(g, "UVW -.XYZ", {
            x: 0,
            y: 450,
            maxWidth: 300,
            height: 100,
            quietZoneSize: 10
        });
    });

    Tinytest.add("EAN checksum(\"400638133393\") == 1", function(test) {
        var encodeData = bardcode.encodeEAN("400638133393");
        test.equal(encodeData.checksum, 1);
    });

    Tinytest.add("EAN checksum(\"9638507\") == 4", function(test) {
        var encodeData = bardcode.encodeEAN("9638507");
        test.equal(encodeData.checksum, 4);
    });

    Tinytest.add("Test EAN-13", function(test) {
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
    });

    Tinytest.add("Test EAN-8", function(test) {
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
    });

    Tinytest.add("Test FIM", function(test) {
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

    Tinytest.add("Test Codabar", function(test) {
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

    Tinytest.add("Test SVG", function(test) {
        var svg = drawBarcode("svg", "3117820", {
            maxWidth: 400,
            height: 100,
            quietZoneSize: 8
        });

        test.equal(svg.indexOf("<svg"), 0);
    });
}

