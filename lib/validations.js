export function assertIsString(x, name) {
  if (typeof x !== "string") {
    throw new Error(`Expected ${name} to be a string, got ${x}.`);
  }
}

export function assertIsNonEmptyString(x) {
  if (typeof x !== "string" || x.length === 0) {
    throw new Error(`Expected a non-empty string, got ${x}`);
  }
}

export function assertIsValidHorizontalAlign(x) {
  switch (x) {
  case "left": return;
  case "center": return;
  case "right": return;
  default: throw new Error(`Unexpected horizontalAlign (acceptable values are "left", "center", and "right"); got ${x}`);
  }
}

export function assertIsValidVerticalAlign(x) {
  switch (x) {
  case "top": return;
  case "middle": return;
  case "bottom": return;
  default: throw new Error(`Unexpected verticalAlign (acceptable values are "top", "middle", and "bottom"); got ${x}`);
  }
}

export function assertIsNumber(x, name) {
  if (typeof x !== "number") {
    throw new Error(`Expected ${name} to be a number, got ${x}`);
  }
}

export function assertIsBoolean(x, name) {
  if (typeof x !== "boolean") {
    throw new Error(`Expected ${name} to be a boolean, got ${x}`);
  }
}

export function assertIsPositiveNumber(x, name) {
  if (typeof x !== "number") {
    throw new Error(`Expected ${name} to be a number, got ${x}`);
  }

  if (x <= 0) {
    throw new Error(`Expected ${name} to be positive, got ${x}`);
  }
}

export function assertIsNonNegativeNumber(x, name) {
  if (typeof x !== "number") {
    throw new Error(`Expected ${name} to be a number, got ${x}`);
  }

  if (x < 0) {
    throw new Error(`Expected ${name} to be non-negative, got ${x}`);
  }
}

