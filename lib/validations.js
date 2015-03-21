"use strict";

bardcode.assertIsString = function(x, name) {
    if (typeof x !== "string") {
        throw new Error("Expected " + name + " to be a string, got " + x);
    }
};

bardcode.assertIsNonEmptyString = function(x) {
    if (typeof x !== "string" || x.length === 0) {
        throw new Error("Expected a non-empty string, got " + x);
    }
};

bardcode.assertIsValidHorizontalAlign = function(x) {
    switch (x) {
        case "left": return;
        case "center": return;
        case "right": return;
        default: throw new Error("Unexpected horizontalAlign (acceptable values are \"left\", \"center\", and \"right\"); got " + x);
    }
};

bardcode.assertIsValidVerticalAlign = function(x) {
    switch (x) {
        case "top": return;
        case "middle": return;
        case "bottom": return;
        default: throw new Error("Unexpected verticalAlign (acceptable values are \"top\", \"middle\", and \"bottom\"); got " + x);
    }
};

bardcode.assertIsNumber = function(x, name) {
    if (typeof x !== "number") {
        throw new Error("Expected " + name + " to be a number, got " + x);
    }
};

bardcode.assertIsPositiveNumber = function(x, name) {
    if (typeof x !== "number") {
        throw new Error("Expected " + name + " to be a number, got " + x);
    }

    if (x <= 0) {
        throw new Error("Expected " + name + " to be positive, got " + x);
    }
};

bardcode.assertIsNonNegativeNumber = function(x, name) {
    if (typeof x !== "number") {
        throw new Error("Expected " + name + " to be a number, got " + x);
    }

    if (x < 0) {
        throw new Error("Expected " + name + " to be positive, got " + x);
    }
};

