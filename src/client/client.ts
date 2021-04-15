// Multiple Controls Example - https://sbcode.net/threejs/multi-controls-example/

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import Stats from 'three/examples/jsm/libs/stats.module'

const scene: THREE.Scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

renderer.domElement.ondragstart = (event) => { event.preventDefault(); return false; };

const geometry: THREE.BoxGeometry = new THREE.BoxGeometry()
const material: THREE.MeshNormalMaterial = new THREE.MeshNormalMaterial({ transparent: true })

const cube: THREE.Mesh = new THREE.Mesh(geometry, material)
scene.add(cube)

const orbitControls = new OrbitControls(camera, renderer.domElement)

const dragControls = new DragControls([cube], camera, renderer.domElement)
dragControls.addEventListener("hoveron", (event) => {
  orbitControls.enabled = false;
});
dragControls.addEventListener("hoveroff", (event) => {
  orbitControls.enabled = true;
});
dragControls.addEventListener('dragstart', (event) => {
  event.object.material.opacity = 0.33
})
dragControls.addEventListener('dragend', (event) => {
  event.object.material.opacity = 1
})

const transformControls = new TransformControls(camera, renderer.domElement);
transformControls.attach(cube);
transformControls.setMode("rotate")
scene.add(transformControls);

transformControls.addEventListener('dragging-changed', (event) => {
  orbitControls.enabled = !event.value
  dragControls.enabled = !event.value
})

const backGroundTexture = new THREE.CubeTextureLoader().load(["img/px_eso0932a.jpg", "img/nx_eso0932a.jpg", "img/py_eso0932a.jpg", "img/ny_eso0932a.jpg", "img/pz_eso0932a.jpg", "img/nz_eso0932a.jpg"]);
scene.background = backGroundTexture;

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case "g":
      transformControls.setMode("translate")
      break
    case "r":
      transformControls.setMode("rotate")
      break
    case "s":
      transformControls.setMode("scale")
      break
  }
})

camera.position.z = 2

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

var animate = function () {
  requestAnimationFrame(animate)

  render()

  stats.update()
};

function render() {
  renderer.render(scene, camera)
}

animate();
