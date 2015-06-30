'use strict';

var EventEmitter, emitter, FilterStore, CanvasManager, canvasManager, filters, cameraManager, CameraManager, video;
EventEmitter = require('events').EventEmitter;
emitter = new EventEmitter;
FilterStore = require('./filter_store');

/*
 * CANVAS
 */

CanvasManager = require('./canvas_manager');
canvasManager = new CanvasManager({
  canvas: document.getElementById('canvas'),
  emitter: emitter
});

emitter.on('video:play', function (data) {
  var video = data.video;
  canvasManager.loadVideo(video);
});

/*
 * VIDEO
 */

video = document.getElementById('video');
video.addEventListener('play', function (event) {
  emitter.emit('video:play', {video: video});
});

video.addEventListener('canplay', function (event) {
  var h, w;

  if (this.videoWidth > 0) {
    h = this.videoHeight;
    w = this.videoWidth;
  }

  canvasManager.changeCanvasSize(w, h);
});

/*
 * CAMERA
 */

CameraManager = require('./camera_manager');
cameraManager = new CameraManager({
  video: video,
  emitter: emitter
});

/*
 * FILTERS
 */

filters = document.getElementById('filters');
filters.addEventListener('click', function (event) {
  if (event.target.dataset.filter) {
    emitter.emit('filters:apply', {name: event.target.dataset.filter});
  }
});

emitter.on('filters:apply', function (data) {
  var filter;
  filter = FilterStore.getFilter(data.name);
  canvasManager.applyFilter(filter);
});
