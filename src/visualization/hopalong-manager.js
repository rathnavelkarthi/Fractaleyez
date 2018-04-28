import * as THREE from 'three';

import { HopalongVisualizer } from './hopalong-visualizer.js'
import { CameraManager } from './camera-manager';

export class HopalongManager {
  constructor() {
    this.startTimer = null;
    this.deltaTime = 0;
    this.elapsedTime = 0;
    this.cameraManager = null;
    this.hopalongVisualizer = null;
    this.renderer = null;
    this.$container = null;
  }


  /**
   *
   * @param {Date} startTimer
   */
  init( startTimer )
  {
    console.log("Hopalong Manager Initialized\n------------");
    this.hopalongVisualizer = new HopalongVisualizer();

    this.$container = $('<div></div>');
    $( document.body ).append(this.$container);

    this.cameraManager = new CameraManager();
    this.cameraManager.init(1500);

    //pass the visualizer the camera manager so the camera can get the SCALE_FACTOR
    this.hopalongVisualizer.init(this.cameraManager);

    this.startTimer = startTimer;
    this.clock = new THREE.Clock();

    // Setup renderer and effects
    this.renderer = new THREE.WebGLRenderer({
      clearColor: 0x000000,
      clearAlpha: 1,
      antialias: false,
      gammeInput: true,
      gammaOutput: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    $( document.body ).append(this.renderer.domElement);

    // Setup listeners
    $( document ).mousemove(this.onDocumentMouseMove.bind(this));
    $( document ).keydown(this.onKeyDown.bind(this));
    $( window ).resize(this.onWindowResize.bind(this));
  }


  /**
   *
   * @param {number} deltaTime
   * @param {AudioAnalysedDataForVisualization} audioData
   */
  update( deltaTime, audioData )
  {
      this.cameraManager.manageCameraPosition();

      this.deltaTime = deltaTime;
      this.elapsedTime += deltaTime;

      this.hopalongVisualizer.update( deltaTime, audioData, this.renderer, this.cameraManager );
  }

  ///////////////////////////////////////////////
  // Event listeners
  ///////////////////////////////////////////////
  onDocumentMouseMove(event) {
    this.cameraManager.updateMousePosition(event);
  }

  onWindowResize(event) {
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.cameraManager.onResize();
  }

  onKeyDown(event) {
    if (event.keyCode == 38 && this.hopalongVisualizer.getSpeed() < 20) this.hopalongVisualizer.updateSpeed(0.5);
    else if (event.keyCode == 40 && this.hopalongVisualizer.getSpeed() > 0) this.hopalongVisualizer.updateSpeed(-0.5);
    else if (event.keyCode == 37) this.hopalongVisualizer.updateRotationSpeed(0.001);
    else if (event.keyCode == 39) this.hopalongVisualizer.updateRotationSpeed(-0.001);
    else if (event.keyCode == 72 || event.keyCode == 104) toggleVisuals();
  }
};
