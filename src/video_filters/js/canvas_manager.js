'use strict';

var CanvasManager = function CanvasManager(params) {
  this.init(params);
};

CanvasManager.prototype = {
  canvas: null,
  width: 1000,
  height: 800,
  activeFilter: null,
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
  changeCanvasSize: function changeCanvasSize(w, h) {
    this.canvas.setAttribute('width', w);
    this.canvas.setAttribute('height', h);

    // Reverse the canvas image
    this.context.translate(w, 0);
    this.context.scale(-1, 1);
  },
  // Taken from http://html5hub.com/using-the-getusermedia-api-with-the-html5-video-and-canvas-elements/
  loadVideo: function loadStream(video) {
    var h, w, manager;

    manager = this;

    if (video.videoWidth > 0) {
      h = video.videoHeight;
      w = video.videoWidth;
    }

    this.canvas.setAttribute('width', w);
    this.canvas.setAttribute('height', h);

    // Reverse the canvas image
    this.context.translate(w, 0);
    this.context.scale(-1, 1);

    setInterval(function() {
      var imageData;

      if (video.paused || video.ended) {
        return;
      }

      manager.context.fillRect(0, 0, manager.canvas.width, manager.canvas.height);
      manager.context.drawImage(video, 0, 0, manager.canvas.width, manager.canvas.height);

      if (manager.activeFilter) {
        imageData = manager.activeFilter(manager._getImageData());
        manager._drawImageData(imageData);
      }
    }, 33);
  },
  clear: function clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  applyFilter: function applyFilter(filter, args) {
    var imageData;
    args || (args = {});
    args.canvasManager = this;

    if (!filter) {
      return;
    }

    this.activeFilter = function (imageData) {
      return filter(imageData, args);
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
