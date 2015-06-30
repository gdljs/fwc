'use strict';

var EventEmitter, emitter, FilterStore, $, fileInput, CanvasManager, canvasManager, filters;
EventEmitter = require('events').EventEmitter;
emitter = new EventEmitter;
FilterStore = require('./filter_store');
CanvasManager = require('./canvas_manager');
canvasManager = new CanvasManager({
  canvas: document.getElementById('canvas')
});

/*
 * FILE INPUT
 */

fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', function (event) {
  if (this.files.length) {
    emitter.emit('file-input:change', this.files[0]);
  }
});

emitter.on('file-input:change', function (file) {
  canvasManager.clear();
  canvasManager.loadImageFile(file);
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
