onmessage = (image) => {
  const graph = depixel(image.data, image.width, image.height);
}

function lerp(v0, v1, t) {
  return (1 - t) * v0 + t * v1;
}

class Color {
  constructor(y, u, v) {
    this.y = y;
    this.u = u;
    this.v = v;
  }

  static RGB(r, g, b) {
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    return new Color(Math.round(y), Math.round(0.492 * (b - y)), Math.round(0.877 * (r - y)));
  }

  static YUV(y, u, v) {
    return new Color(y, u, v);
  }

  Clone() {
    return new Color(this.y, this.u, this.v);
  }

  get rgb() {
    var {y, u, v} = this;
    var r = y + 1.140 * v;
    var g = y - 0.394 * u - 0.581 * v;
    var b = y + 2.032 * u;
    return [r, g, b].map(Math.round);
  }

  dissimilar(color) {
    return Math.abs(this.y - color.y) > 48
        || Math.abs(this.u - color.u) > 7
        || Math.abs(this.v - color.v) > 6;
  }

  unequal(color) {
    return (this.y - color.y) || (this.u - color.u) || (this.v - color.v);
  }

  static lerp(color0, color1, amount) {
    const y = lerp(color0.y, color1.y, amount);
    const u = lerp(color0.u, color1.u, amount);
    const v = lerp(color0.v, color1.v, amount);
    return new Color(y, u, v);
  }

  toString() {
    return 'rgb(' + this.rgb.join() + ')';
  }
}

class Pixel {
  constructor(color, x, y) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.edges = new Array(8);
    this.degree = 0;
  }

  position(pixel) {
    return (8 + (pixel.x - this.x) + (pixel.y - this.y) * 3) % 9;
  }

  add(pixel) {
    const position = this.position(pixel);
    this.edges[position] = pixel;
    pixel.edges[Math.abs(position - 7)] = this;
    this.degree++;
    pixel.degree++;
  }

  contour(pixel) {
    for (let e of this.edges.filter(v => v)) {

    }
  }

  similar(pixel) {
    return !this.color.dissimilar(pixel.color);
  }

  edge(pixel) {
    return this.edges[this.position(pixel)];
  }

  resolve(context) {
    if (this.similar(context[1])) {
      this.add(context[1]);
    } else {
      this.contour(context[1]);
    }

    if (this.similar(context[2])) {
      this.add(context[2]);
    } else {
      this.contour(context[2]);
    }

    if (this.degree == 2 &&
        context[0].edge(context[1]) &&
        context[0].edge(context[2])) {
      return true;
    }

    const slant = this.similar(context[0]);
    const rise = context[1].similar(context[2]);

    if (slant) {
      this.add(context[0]);
    } else {
      this.contour(context[0]);
    }

    if (rise) {
      context[1].add(context[2]);
    } else {
      context[1].contour(context[1]);
    }

    return !slant || !rise;
  }
}

Object.defineProperty(Pixel, 'UNDEFINED', {
  value: Object.assign(new Pixel(Color.YUV(Infinity, Infinity, Infinity)),
                       { similar: () => false
                       , add: () => {}
                       , contour: () => {}
                       })
});

function depixel(pixels, width, height) {
  const dissimilar = Pixel.UNDEFINED;
  const conflicts = [];
  const context = new Array(3);
  const line = new Array(width + 1);
  line.fill(dissimilar);

  for (let y = 0; y < height; ++y) {
    context[0] = context[2] = dissimilar;
    context[1] = line[0];

    for (let x = 0; x < width; ++x) {
      const i = (y * height + x) * 4
      const color = Color.RGB.apply(Color, pixels.subarray(i, i + 3));
      const pixel = line[x] = new Pixel(color, x, y);

      if (!pixel.resolve(context)) {
        conflicts.push(context.concat(pixel));
      }

      context[0] = context[1];
      context[1] = line[x + 1];
      context[2] = pixel;
    }
  }

  for (let conflict = conflicts.pop(); conflict; conflict = conflicts.pop()) {
    console.log('foo')
  }
}
