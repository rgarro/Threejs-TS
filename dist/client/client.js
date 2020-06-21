//http://tdc-www.harvard.edu/catalogs/bsc5.readme
import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls';
import Stats from '/jsm/libs/stats.module';
import { GUI } from '/jsm/libs/dat.gui.module';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 2;
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}
const stats = Stats();
document.body.appendChild(stats.dom);
const gui = new GUI();
const cubeFolder = gui.addFolder("Cube");
cubeFolder.add(cube.rotation, "x", 0, Math.PI * 2, 0.01);
cubeFolder.add(cube.rotation, "y", 0, Math.PI * 2, 0.01);
cubeFolder.add(cube.rotation, "z", 0, Math.PI * 2, 0.01);
cubeFolder.open();
const stars = {};
const constellations = {};
var bsc5dat = new XMLHttpRequest();
bsc5dat.open('GET', '/data/bsc5.dat');
bsc5dat.onreadystatechange = function () {
    if (bsc5dat.readyState === 4) {
        const starData = bsc5dat.responseText.split("\n");
        const positions = [];
        const colors = [];
        const color = new THREE.Color();
        starData.forEach(row => {
            let star = {
                id: Number(row.slice(0, 4)),
                name: row.slice(4, 14).trim(),
                gLon: Number(row.slice(90, 96)),
                gLat: Number(row.slice(96, 102)),
                mag: Number(row.slice(102, 107)),
                spectralClass: row.slice(129, 130)
            };
            //console.log(star.spectralClass)
            stars[star.id] = star;
            let v = new THREE.Vector3().setFromSphericalCoords(100, (90 - star.gLat) / 180 * Math.PI, (star.gLon) / 180 * Math.PI);
            positions.push(v.x);
            positions.push(v.y);
            positions.push(v.z);
            //var g = ((star.mag + 1.46) * 32.03) / 255
            switch (star.spectralClass) {
                case "O":
                    color.setHex(0x91b5ff);
                    break;
                case "B":
                    color.setHex(0xa7c3ff);
                    break;
                case "A":
                    color.setHex(0xd0ddff);
                    break;
                case "F":
                    color.setHex(0xf1f1fd);
                    break;
                case "G":
                    color.setHex(0xfdefe7);
                    break;
                case "K":
                    color.setHex(0xffddbb);
                    break;
                case "M":
                    color.setHex(0xffb466);
                    break;
                case "L":
                    color.setHex(0xff820e);
                    break;
                case "T":
                    color.setHex(0xff3a00);
                    break;
                default:
                    color.setHex(0xffffff);
                //console.log(star.spectralClass)
            }
            colors.push(color.r, color.g, color.b);
            if (star.name.length >= 3) {
                let abv = star.name.substr(star.name.length - 3);
                //console.log(abv)
                if (!(abv in constellations)) {
                    constellations[abv] = [];
                }
                constellations[abv].push(v);
            }
        });
        //console.log(constellations)
        //console.log(minMag + " " + maxMag)
        const starsGeometry = new THREE.BufferGeometry();
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        console.log(starsGeometry);
        const starsMaterial = new THREE.PointsMaterial({ size: 1, vertexColors: true, sizeAttenuation: false });
        const points = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(points);
        // Object.keys(constellations).forEach((c) => {
        //     console.log(c)
        //     var points = [];
        //     const constellationGeometry = new THREE.BufferGeometry().setFromPoints(constellations[c]);
        //     const constellationMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
        //     const constellationLine = new THREE.Line(constellationGeometry, constellationMaterial);
        //     scene.add(constellationLine);
        // })
    }
};
bsc5dat.send();
var animate = function () {
    requestAnimationFrame(animate);
    controls.update();
    render();
    stats.update();
};
function render() {
    renderer.render(scene, camera);
}
animate();
