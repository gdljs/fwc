'use strict';

var FilterStore;

FilterStore = {
  filters: {},
  addFilter: function createFilter(name, func) {
    this.filters[name] = func;
  },
  getFilter: function getFilter(name) {
    return this.filters[name];
  },
  // Taken from https://github.com/alexmic/filtrr/blob/master/filtrr2/src/util.js
  _clamp: function _clamp(val, min, max) {
    min = min || 0;
    max = max || 255;
    return Math.min(max, Math.max(min, val));
  },
  // Taken from https://github.com/alexmic/filtrr/blob/master/filtrr2/src/effects.js
  _convolve: function _convolve(kernel, pixels, canvasManager) {
    var temp  = canvasManager.context.createImageData(pixels.width, pixels.height),
        tempd = temp.data,
        bufferData = pixels.data,
        kh = parseInt(kernel.length / 2),
        kw = parseInt(kernel[0].length / 2),
        h = pixels.height,
        w = pixels.width,
        i = 0, j = 0, n = 0, m = 0;

    for (i = 0; i < h; i++) {
      for (j = 0; j < w; j++) {
        var outIndex = (i*w*4) + (j*4);
        var r = 0, g = 0, b = 0;
        for (n = -kh; n <= kh; n++) {
          for (m = -kw; m <= kw; m++) {
            if (i + n >= 0 && i + n < h) {
              if (j + m >= 0 && j + m < w) {
                var f = kernel[n + kh][m + kw];
                if (f === 0) {continue;}
                var inIndex = ((i+n)*w*4) + ((j+m)*4);
                r += bufferData[inIndex] * f;
                g += bufferData[inIndex + 1] * f;
                b += bufferData[inIndex + 2] * f;
              }
            }
          }
        }
        tempd[outIndex]     = this._clamp(r);
        tempd[outIndex + 1] = this._clamp(g);
        tempd[outIndex + 2] = this._clamp(b);
        tempd[outIndex + 3] = 255;
      }
    }

    return temp;
  }
};

FilterStore.addFilter('sepia', function sepia(pixels) {
  var r, g, b, newR, newG, newB, data;
  data = pixels.data;

  for (var i=0; i < data.length; i = i + 4) {
    r = data[i];
    g = data[i+1];
    b = data[i+2];
    newR = Math.min((r * 0.393) + (g * 0.769) + (b * 0.189), 255);
    newG = Math.min((r * 0.349) + (g * 0.686) + (b * 0.168), 255);
    newB = Math.min((r * 0.272) + (g * 0.534) + (b * 0.131), 255);
    data[i] = newR;
    data[i+1] = newG;
    data[i+2] = newB;
  }

  return pixels;
});

FilterStore.addFilter('grayscale', function grayscale(pixels) {
  var r, g, b, data, value;
  data = pixels.data;

  for (var i=0; i < data.length; i = i + 4) {
    r = data[i];
    g = data[i+1];
    b = data[i+2];
    value = (r + g + b) / 3;
    data[i] = data[i+1] = data[i+2] = value;
  }

  return pixels;
});

FilterStore.addFilter('posterize', function posterize(pixels, args) {
  var r, g, b, step, data;
  data = pixels.data;
  args = args || {};
  step = args.step || 5;
  step = Math.floor(255 / step);

  for (var i=0; i < data.length; i = i + 4) {
    r = data[i];
    g = data[i+1];
    b = data[i+2];
    data[i] = Math.floor(r / step) * step;
    data[i+1] = Math.floor(g / step) * step;
    data[i+2] = Math.floor(b / step) * step;
  }

  return pixels;
});

FilterStore.addFilter('blur', function blur(pixels, args) {
  var kernel;
  kernel = [
    [1/9, 1/9, 1/9],
    [1/9, 1/9, 1/9],
    [1/9, 1/9, 1/9]
  ];

  return FilterStore._convolve(kernel, pixels, args.canvasManager);
});

FilterStore.addFilter('invert', function invert(pixels) {
  var r, g, b, data;
  data = pixels.data;

  for (var i=0; i < data.length; i = i + 4) {
    r = 255 - data[i];
    g = 255 - data[i+1];
    b = 255 -data[i+2];
    data[i] = r;
    data[i+1] = g;
    data[i+2] = b;
  }

  return pixels;
});

FilterStore.addFilter('sharpen', function sharpen(pixels, args) {
  var kernel;
  kernel = [
    [0, -1, 0 ],
    [-1, 5, -1],
    [0, -1, 0 ]
  ];

  return FilterStore._convolve(kernel, pixels, args.canvasManager);
});

if (module && module.exports) {
  module.exports = FilterStore;
}
