import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshStandardMaterial, SphereGeometry } from 'three';

let scene, camera, renderer, container, spheres = [];
let sphereCount = 56; // 4 circles of 14 spheres

let sphereRadius = 0.15; // Radius of each sphere
let swirlRadius = 1; // Radius of the swirl itself
let swirlSpeed = 0.0035; // Speed of the swirl
let swirlHeight = 0.8; // Adjust to the desired height


let light1 = new THREE.PointLight(0xff0000, 1, 100); // Initialize light1
let light2 = new THREE.PointLight(0x0000ff, 1, 100); // Initialize light2

function createScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
}

function createContainer() {
    container = document.createElement('div');
    container.id = 'loading-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    document.body.appendChild(container);
}

function createLoadingMessage(string) {
    let loadingMessage = document.createElement('div');
    loadingMessage.innerHTML = `${string}`;
    loadingMessage.style.position = 'absolute';
    loadingMessage.style.zIndex = '10000';
    loadingMessage.style.color = '#000';
    loadingMessage.style.fontFamily = 'Gilroy';
    loadingMessage.style.fontSize = '23px';
    loadingMessage.style.maxWidth = '500px';
    loadingMessage.style.fontWeight= 'bolder';
    loadingMessage.style.textAlign = 'center';
    // loadingMessage.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    loadingMessage.style.padding = '10px';
      loadingMessage.style.marginTop = '200px';
    loadingMessage.style.borderRadius = '5px';
    container.appendChild(loadingMessage);
}

function createSpheres() {
    const geometry = new SphereGeometry(sphereRadius, 32, 32);
    const material = new MeshStandardMaterial({ color: 0x00ff00, metalness: 0.5, roughness: 0.2 });
    for (let i = 0; i < sphereCount; i++) {
        let sphere = new THREE.Mesh(geometry, material);
        spheres.push(sphere);
        scene.add(sphere);
    }
}

function createLights() {
    light1.position.set(10, 0, 25);
    scene.add(light1);
    light2.position.set(-10, 0, -25);
    scene.add(light2);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(1, 1, 1);
    scene.add(dirLight);
}

function addEventListeners() {
    window.addEventListener('resize', onWindowResize, false);
}

function addControls() {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
}

function init(string) {
    createScene();
    createContainer();
    container.appendChild(renderer.domElement);
    createLoadingMessage(string);
    createSpheres();
    createLights();
    addEventListeners();
    addControls();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    let circles = 4; // Number of circles
     let spheresPerCircle = sphereCount / circles;

     // Move the spheres along a double helix path
     for (let i = 0; i < spheres.length; i++) {
         let circleIndex = Math.floor(i / spheresPerCircle); // Determine which circle the sphere is in
         let phase = (Date.now() * swirlSpeed + i * Math.PI * 2 / spheresPerCircle) % (Math.PI * 2);
         let spiralOffset = (i % 2 === 0) ? 0 : Math.PI; // Alternate between two spirals

         spheres[i].position.x = Math.cos(phase + spiralOffset) * swirlRadius;
         spheres[i].position.y = ((circleIndex / circles) * swirlHeight * 2 - swirlHeight) + 1; // Distribute spheres along the y-axis and move them upwards by 1
         spheres[i].position.z = Math.sin(phase + spiralOffset) * swirlRadius;
     }


    // Rotate the light sources
    light1.position.x = Math.cos(Date.now() * swirlSpeed) * swirlRadius;
    light1.position.z = Math.sin(Date.now() * swirlSpeed) * swirlRadius;
    light2.position.x = Math.cos(Date.now() * swirlSpeed + Math.PI) * swirlRadius;
    light2.position.z = Math.sin(Date.now() * swirlSpeed + Math.PI) * swirlRadius;

    // Change the light color over time
    light1.color.setHSL(Math.sin(Date.now() * 0.001), 0.5, 0.5);
    light2.color.setHSL(Math.sin(Date.now() * 0.001 + Math.PI), 0.5, 0.5);

    // Apply the color to the spheres
    for (let sphere of spheres) {
        sphere.material.color.copy(light1.color);
    }

    renderer.render(scene, camera);
}

export function startLoadingAnimation(string) {
    init(string);
    animate();
}

export function stopLoadingAnimation() {
https://www.sierrapodiatry.com/
    for (let sphere of spheres) {
        scene.remove(sphere);
    }
    spheres.length = 0; // Clear the spheres array
   container.remove();
   let reportElement = document.getElementById('report');
   if (reportElement) {
   reportElement.scrollIntoView({ behavior: 'smooth' });
  }
}
