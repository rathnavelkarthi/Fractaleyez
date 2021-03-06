import * as THREE from 'three'

/**
 * The Camera Manager class is responsible for creating and modifying the
 * user's point of view in relation to the scene
 */
export default class CameraManager {
  constructor() {
    this.camera = null
    this.cameraBound = 100
    this.mouseX = 0
    this.mouseY = 0
    this.deltaTime = 0
    this.elapsedTime = 0
    this.focusPoint = new THREE.Vector3(0,0,-5)
  }

  init() {
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3 * window.config.user.scaleFactor.value)
    this.camera.position.z = window.config.user.scaleFactor.value / 3
    this.cameraBound = window.config.user.cameraBound.value
  }

  getMouseX() {
    return this.mouseX
  }
  getMouseY() {
    return this.mouseY
  }
  getCamera() {
    return this.camera
  }

  // To be called in the render method
  manageCameraPosition() {
    this.camera.lookAt(this.focusPoint)

    if (this.camera.position.x >= - this.cameraBound && this.camera.position.x <=  this.cameraBound) {
      this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05
      if (this.camera.position.x < - this.cameraBound) this.camera.position.x = - this.cameraBound
      if (this.camera.position.x >  this.cameraBound) this.camera.position.x =  this.cameraBound
    }
    if (this.camera.position.y >= - this.cameraBound && this.camera.position.y <=  this.cameraBound) {
      this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05
      if (this.camera.position.y < - this.cameraBound) this.camera.position.y = - this.cameraBound
      if (this.camera.position.y >  this.cameraBound) this.camera.position.y =  this.cameraBound
    }

    if (this.cameraBound !== window.config.user.cameraBound.value) {
      this.camera.position.y = 0
      this.camera.position.x = 0
      this.cameraBound =  window.config.user.cameraBound.value
    }
  }

  // for moving the camera around
  updateMousePosition(event) {
    this.mouseX = event.clientX - (window.innerWidth / 2)
    this.mouseY = event.clientY - (window.innerHeight / 2)
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }
}
