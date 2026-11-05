import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import puzzleSvg from './learningPuzzle.svg?raw';

export function createLearningScene(host, onFailure) {
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, .1, 30);
    camera.position.set(0, .15, 7.8);
    const sculpture = new THREE.Group();
    sculpture.rotation.set(.18, -.25, -.22);
    scene.add(sculpture, new THREE.HemisphereLight(0xe7f3ff, 0x253869, 3));
    const light = new THREE.DirectionalLight(0xffffff, 4);
    light.position.set(3, 4, 5);
    scene.add(light);
    const fill = new THREE.DirectionalLight(0x9cbfff, 2.5);
    fill.position.set(-4, -1, 3);
    scene.add(fill);

    const pieces = new SVGLoader().parse(puzzleSvg).paths.map(path => {
        const geometry = new THREE.ExtrudeGeometry(SVGLoader.createShapes(path), {
            depth: 2.4, bevelEnabled: true, bevelThickness: .4, bevelSize: .25,
            bevelSegments: 4, curveSegments: 20, steps: 1,
        });
        geometry.translate(-19.4, -19.4, -1.2);
        geometry.rotateX(Math.PI);
        geometry.scale(.1, .1, .1);
        const material = new THREE.MeshStandardMaterial({ color: path.color, metalness: .22, roughness: .28 });
        const piece = new THREE.Mesh(geometry, material);
        sculpture.add(piece);
        return piece;
    });
    host.appendChild(renderer.domElement);
    let frame = 0;
    let last = 0;
    let elapsed = 0;
    let paused = false;
    let visible = true;
    let disposed = false;
    let lost = false;
    let pointerX = 0;
    let pointerY = 0;
    const isRunning = () => !disposed && !lost && !paused && visible && !document.hidden;
    const draw = () => { if (!disposed && !lost) renderer.render(scene, camera); };
    function animate(time) {
        frame = 0;
        if (!isRunning()) return;
        const delta = last ? Math.min((time - last) / 1000, .05) : 0;
        last = time;
        elapsed += delta;
        sculpture.rotation.y += (-.25 + Math.sin(elapsed * .35) * .1 + pointerX * .16 - sculpture.rotation.y) * .04;
        sculpture.rotation.x += (.18 + pointerY * .1 - sculpture.rotation.x) * .04;
        sculpture.position.y = Math.sin(elapsed * .65) * .08;
        const separation = .02 + (1 - Math.cos(elapsed * .65)) * .08;
        pieces.forEach((piece, index) => {
            piece.position.x = (index % 2 === 0 ? -1 : 1) * separation;
            piece.position.y = (index < 2 ? 1 : -1) * separation;
            piece.position.z = Math.sin(elapsed * .65 + index * .7) * .04;
        });
        draw();
        frame = requestAnimationFrame(animate);
    }
    function update() {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
        if (isRunning()) frame = requestAnimationFrame(animate);
    }
    function resize() {
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height || disposed || lost) return;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.position.z = Math.max(7.8, 7.4 / camera.aspect);
        camera.updateProjectionMatrix();
        draw();
    }
    function move(event) {
        if (!isRunning() || event.pointerType === 'touch') return;
        const bounds = host.getBoundingClientRect();
        pointerX = (event.clientX - bounds.left) / bounds.width - .5;
        pointerY = (event.clientY - bounds.top) / bounds.height - .5;
    }
    function leave() { pointerX = 0; pointerY = 0; }
    function contextLost(event) {
        event.preventDefault();
        lost = true;
        update();
        onFailure();
    }
    let resizeObserver;
    let visibilityObserver;
    function dispose() {
        if (disposed) return;
        disposed = true;
        update();
        resizeObserver?.disconnect();
        visibilityObserver?.disconnect();
        document.removeEventListener('visibilitychange', update);
        host.removeEventListener('pointermove', move);
        host.removeEventListener('pointerleave', leave);
        renderer.domElement.removeEventListener('webglcontextlost', contextLost);
        const geometries = new Set();
        scene.traverse(object => {
            if (object.geometry) geometries.add(object.geometry);
            if (object.material) object.material.dispose();
        });
        geometries.forEach(item => item.dispose());
        renderer.dispose();
        renderer.domElement.remove();
    }
    try {
        resizeObserver = new ResizeObserver(resize);
        visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
        resizeObserver.observe(host);
        visibilityObserver.observe(host);
        document.addEventListener('visibilitychange', update);
        host.addEventListener('pointermove', move, { passive: true });
        host.addEventListener('pointerleave', leave);
        renderer.domElement.addEventListener('webglcontextlost', contextLost);
        resize();
        update();
    } catch (error) {
        dispose();
        throw error;
    }
    return { setPaused(value) { paused = value; update(); }, dispose };
}
