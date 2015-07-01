'use strict';

var EventEmitter, emitter, CanvasManager, canvasManager, Terrain, terrain;
EventEmitter = require('events').EventEmitter;
emitter = new EventEmitter();

/*
 * CANVAS
 */

CanvasManager = require('./canvas_manager');
canvasManager = new CanvasManager({
  canvas: document.getElementById('canvas'),
  emitter: emitter
});

/*
 * TERRAIN
 */

Terrain = require('./terrain');
terrain = new Terrain(9);
terrain.generate(0.7);
terrain.draw(canvasManager.getContext(), canvasManager.width, canvasManager.height);
