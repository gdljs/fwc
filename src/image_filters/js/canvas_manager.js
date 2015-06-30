'use strict';

var CanvasManager = function CanvasManager(params) {
  this.init(params);
};

CanvasManager.prototype = {
  canvas: null,
  width: 1000,
  height: 800,
  init: function init(params) {
    params = params || {};

    Object.keys(params).forEach(function (key) {
      this[key] = params[key];
    }, this);

    this.context = this.canvas.getContext('2d');

    this.canvas.height = this.height;
    this.canvas.width = this.width;
  },
  loadImageFile: function loadImage(file) {
    var fileReader, manager;

    manager = this;
    fileReader = new FileReader();

    fileReader.onload = function (event) {
      var image = new Image();
      manager.currentFile = image;

      image.onload = function () {
        manager.context.drawImage(image, 0, 0);
      };

      image.src = event.target.result;
    };

    fileReader.readAsDataURL(file);
  },
  clear: function clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  applyFilter: function applyFilter(filter, args) {
    var imageData;
    args || (args = {});
    args.canvasManager = this;

    if (!this.currentFile || !filter) {
      return;
    }

    imageData = filter(this._getImageData(), args);
    this._drawImageData(imageData);
  },
  _drawImageData: function _drawImageData(imageData) {
    this.context.putImageData(imageData, 0, 0);
  },
  _getImageData: function _getImageData() {
    return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
  },
};

CanvasManager.prototype.constructor = CanvasManager;

if (module && module.exports) {
  module.exports = CanvasManager;
}
