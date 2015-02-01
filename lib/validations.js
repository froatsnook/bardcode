bardcode.AssertIsString = function(x, name) {
    if (typeof x !== "string") {
        throw new Error("Expected " + name + " to be a string, got " + x);
    }
};

bardcode.AssertIsNonEmptyString = function(x) {
    if (typeof x !== "string" || x.length === 0) {
        throw new Error("Expected " + name + " to be a non-empty string, got " + x);
    }
};

bardcode.AssertIsValidHorizontalAlign = function(x) {
    switch (x) {
        case "left": return;
        case "center": return;
        case "right": return;
        default: throw new Error("Unexpected horizontalAlign (acceptable values are \"left\", \"center\", and \"right\"); got " + x);
    }
};

bardcode.AssertIsValidVerticalAlign = function(x) {
    switch (x) {
        case "top": return;
        case "middle": return;
        case "bottom": return;
        default: throw new Error("Unexpected verticalAlign (acceptable values are \"top\", \"middle\", and \"bottom\"); got " + x);
    }
};

bardcode.AssertIsNumber = function(x, name) {
    if (typeof x !== "number") {
        throw new Error("Expected " + name + " to be a number, got " + x);
    }
};

bardcode.AssertIsPositiveNumber = function(x, name) {
    if (typeof x !== "number") {
        throw new Error("Expected " + name + " to be a number, got " + x);
    }

    if (x <= 0) {
        throw new Error("Expected " + name + " to be positive, got " + x);
    }
};

bardcode.AssertIsNonNegativeNumber = function(x, name) {
    if (typeof x !== "number") {
        throw new Error("Expected " + name + " to be a number, got " + x);
    }

    if (x < 0) {
        throw new Error("Expected " + name + " to be positive, got " + x);
    }
};

