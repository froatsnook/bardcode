export default function drawBitsBarcodeToPath(options, encodeData) {
  const bits = encodeData.data.map(function(d) {
    return d.bits;
  }).join("");

  const multiplier = (bits.length + 2 * options.quietZoneSize);

  let bw;
  let width;
  if (!isNaN(options.width)) {
    // options.width takes precedence... if given, then it overrides
    // moduleWidth and maxWidth
    width = options.width;
    bw = width / multiplier;
  } else {
    // Try to use the given moduleWidth
    bw = options.moduleWidth;
    width = multiplier * bw;

    // But adjust if it doesn't fit in maxWidth (if given)
    if (width > options.maxWidth) {
      width = options.maxWidth;
      bw = width / multiplier;
    }
  }

  const height = options.height;

  const rects = [];

  // Walk xpos from left to right side.
  let xpos = options.quietZoneSize * bw;

  let n = 0;
  while (n < bits.length) {
    // We are at the start of a bar or a space.
    const bit = bits[n];
    if (bit === "1") {
      // We are at a bar.
      let barCount = 1;
      while (n < bits.length && bits[++n] === "1") {
        barCount++;
      }

      const barWidth = barCount * bw;

      rects.push(`M ${xpos.toFixed(3)},0`);
      rects.push(`l ${barWidth},0`);
      rects.push(`l 0,${height}`);
      rects.push(`l ${(-barWidth).toFixed(3)},0`);
      rects.push("Z");

      xpos += barWidth;
    } else {
      // We are at a space.
      let spaceCount = 1;
      while (n < bits.length && bits[++n] === "0") {
        spaceCount++;
      }

      const spaceWidth = spaceCount * bw;
      xpos += spaceWidth;
    }
  }

  return rects.join(" ");
}

