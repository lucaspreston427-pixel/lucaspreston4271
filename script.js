document.getElementById("ding").play();
// THREE.js setup
document.getElementById("loading").style.display = "block";
generateFromWord(w, d);
document.getElementById("loading").style.display = "none";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

const light = new THREE.PointLight(0xffffff, 2);
light.position.set(10, 10, 10);
scene.add(light);

// Random helper
function rand(min, max) {
    return Math.random() * (max - min) + min;
}

// MAIN procedural generator
function generateFromWord(word) {
    // Clear scene (keep light)
    while (scene.children.length > 1) {
        scene.remove(scene.children[1]);
    }

    const lower = word.toLowerCase();

    // Create a base body shape
    let body;
    if (lower.includes("cat") || lower.includes("tiger") || lower.includes("wolf")) {
        body = new THREE.SphereGeometry(1.2, 32, 32); // animal-type round body
    } 
    else if (lower.includes("castle")) {
        body = new THREE.BoxGeometry(2, 1.5, 2); // blocky castle base
    }
    else if (lower.includes("robot") || lower.includes("mech")) {
        body = new THREE.BoxGeometry(1.4, 1.8, 1.4); // robot torso
    }
    else if (lower.includes("spaceship") || lower.includes("ship")) {
        body = new THREE.ConeGeometry(1.2, 3, 24); // spaceship body
    }
    else {
        body = new THREE.IcosahedronGeometry(1.3, 1); // default
    }

    const mat = new THREE.MeshStandardMaterial({
        color: word.length * 123456 % 0xffffff
    });
    const main = new THREE.Mesh(body, mat);
    scene.add(main);

    // Add spikes, towers, legs, wings based on word
    let spikes = 20;

    if (lower.includes("tiger")) spikes = 10;            // less spikes, smoother
    if (lower.includes("dragon")) spikes = 40;           // more spikes
    if (lower.includes("castle")) spikes = 8;            // towers
    if (lower.includes("robot")) spikes = 6;             // limbs
    if (lower.includes("spaceship")) spikes = 12;        // wings

    for (let i = 0; i < spikes; i++) {
        const spikeGeo = new THREE.ConeGeometry(rand(0.1, 0.3), rand(0.5, 1.5), 8);
        const spikeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

        const spike = new THREE.Mesh(spikeGeo, spikeMat);

        // random direction around body
        let x = rand(-1, 1);
        let y = rand(-1, 1);
        let z = rand(-1, 1);
        const len = Math.sqrt(x*x + y*y + z*z);

        x /= len; y /= len; z /= len;

        spike.position.set(x * 1.8, y * 1.8, z * 1.8);
        spike.lookAt(0, 0, 0);

        scene.add(spike);
    }
}

document.getElementById("generate").onclick = () => {
    const word = document.getElementById("prompt").value;
    generateFromWord(word);
};

function animate() {
    requestAnimationFrame(animate);
    scene.rotation.y += 0.004;
    renderer.render(scene, camera);
}
animate();
