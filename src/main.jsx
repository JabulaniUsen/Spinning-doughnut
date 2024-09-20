import * as THREE from 'three';
import './App.css';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

// Create a sphere
const geometry = new THREE.TorusGeometry( 6, 3, 30, 200 ); 
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.5,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
light.intensity = 30.25;
scene.add(light);

// camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 45;
scene.add(camera);

// render
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 10;

// resize
window.addEventListener('resize', () => {
  // Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

// Animation loop
const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

// Timeline magic
const tl = gsap.timeline({ default: { duraion: 1 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo('nav', { y: '-100%' }, { y: '0%' });
tl.fromTo('.title', { opacity: 0 }, { opacity: 1 });

// Mouse and Touch Animation Color
let isInteracting = false;
let rgb = [];

const handleColorChange = (x, y) => {
  rgb = [
    Math.round((x / sizes.width) * 255),
    Math.round((y / sizes.height) * 255),
    150,
  ];
  const newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
  gsap.to(mesh.material.color, {
    r: newColor.r,
    g: newColor.g,
    b: newColor.b,
  });
};

// Mouse events
window.addEventListener('mousedown', () => (isInteracting = true));
window.addEventListener('mouseup', () => (isInteracting = false));
window.addEventListener('mousemove', (e) => {
  if (isInteracting) {
    handleColorChange(e.pageX, e.pageY);
  }
});

// Touch events for mobile
window.addEventListener('touchstart', () => (isInteracting = true));
window.addEventListener('touchend', () => (isInteracting = false));
window.addEventListener('touchmove', (e) => {
  if (isInteracting) {
    const touch = e.touches[0];
    handleColorChange(touch.pageX, touch.pageY);
  }
});
