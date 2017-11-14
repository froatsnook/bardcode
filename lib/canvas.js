export default function drawBitsBarcodeToCanvas(g, options, encodeData) {
  const bits = encodeData.data.map(function(d) {
    return d.bits;
  }).join("");

  g.save();

  // First transform so that no matter the x, y, horizontalAlign and
  // verticalAlign, we draw from the left at 0,0.

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

  // Translate to barcode start.
  g.translate(options.x, options.y);

  const rad = options.angle * Math.PI / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // Compute all positions relative to the point (x, y) in the unrotated
  // coordinate system.  Using min and max values, we can figure out how much
  // we need to translate to make the desired alignment.
  //
  //     0,0  __________  w,0
  //         |          |
  //         |__________|
  //     0,h              w,h
  //
  // To compute the new positions, multiply by the 2d multiplication matrix:
  //
  //     [cos(a)  -sin(a)] * [0] = [0]
  //     [sin(a)   cos(a)]   [0]   [0]
  //
  //     [cos(a)  -sin(a)] * [w] = [w*cos(a)]
  //     [sin(a)   cos(a)]   [0]   [w*sin(a)]
  //
  //     [cos(a)  -sin(a)] * [w] = [w*cos(a)-h*sin(a)]
  //     [sin(a)   cos(a)]   [h]   [w*sin(a)+h*cos(a)]
  //
  //     [cos(a)  -sin(a)] * [0] = [-h*sin(a)]
  //     [sin(a)   cos(a)]   [h]   [ h*cos(a)]
  //
  // For centering, compute the rectangle's center's position in the same
  // way:
  //
  //     [cos(a)  -sin(a)] * [w/2] = [w/2*cos(a)-h/2*sin(a)]
  //     [sin(a)   cos(a)]   [h/2]   [w/2*sin(a)+h/2*cos(a)]
  const xs = [0, width * cos, width * cos - height * sin, -height * sin];
  const ys = [0, width * sin, width * sin + height * cos, height * cos];

  const xmin = Math.min.apply(this, xs);
  const ymin = Math.min.apply(this, ys);
  const xmax = Math.max.apply(this, xs);
  const ymax = Math.max.apply(this, ys);

  switch (options.horizontalAlign) {
  case "left":
    g.translate(-xmin, 0);
    break;
  case "center":
    g.translate(-(width / 2 * cos - height / 2 * sin), 0);
    break;
  case "right":
    g.translate(-xmax, 0);
    break;
  }

  switch (options.verticalAlign) {
  case "top":
    g.translate(0, -ymin);
    break;
  case "middle":
    g.translate(0, -(width / 2 * sin + height / 2 * cos));
    break;
  case "bottom":
    g.translate(0, -ymax);
    break;
  }

  // Rotate.
  g.rotate(rad);

  // Skip quiet zone...
  g.translate(options.quietZoneSize * bw, 0);

  g.fillStyle = "black";

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
      g.fillRect(0, 0, barWidth, height);
      g.translate(barWidth, 0);
    } else {
      // We are at a space.
      let spaceCount = 1;
      while (n < bits.length && bits[++n] === "0") {
        spaceCount++;
      }

      const spaceWidth = spaceCount * bw;
      g.translate(spaceWidth, 0);
    }
  }

  g.restore();

  return {
    barcodeWidth: width,
    barcodeHeight: height,
    bbox: {
      x: xmin,
      y: ymin,
      width: xmax - xmin,
      height: ymax - ymin,
    },
  };
}

