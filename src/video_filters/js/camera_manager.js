'use strict';

var CameraManager = function CameraManager(params) {
  this.init(params);
};

CameraManager.prototype = {
  emitter: null,
  init: function init(params) {
    params = params || {};

    Object.keys(params).forEach(function (key) {
      this[key] = params[key];
    }, this);

    this.initUserMedia();
  },
  initUserMedia: function getUserMedia() {
    navigator.getUserMedia = (navigator.getUserMedia ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia ||
                              navigator.msGetUserMedia);
    if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true}, this.streamHandler.bind(this), function () {});
    }
  },
  streamHandler: function streamHandler(stream) {
    var url = window.URL || window.webkitURL;
    this.video.src = url ? url.createObjectURL(stream) : stream;
    this.video.play();
  }
};

CameraManager.prototype.constructor = CameraManager;

if (module && module.exports) {
  module.exports = CameraManager;
}
