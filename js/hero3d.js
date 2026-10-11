/* =========================================================
   RoLab Academy — Hero 3D robot (lazy-loaded, desktop only)
   Built from primitives: no external model files required.
   ========================================================= */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const C = {
    blue: 0x159bff,
    violet: 0x8b35ff,
    cyan: 0x22d3ee,
    dark: 0x07111f,
    shell: 0xf4f7fb,
};

export async function initHero3D(mount) {
    const width = () => mount.clientWidth;
    const height = () => mount.clientHeight;

    /* ---------- Renderer / scene / camera ---------- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width(), height());
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(32, width() / height(), 0.1, 100);
    camera.position.set(0, 0.4, 9.2);
    camera.lookAt(0, 0.25, 0);

    /* ---------- Lights ---------- */
    scene.add(new THREE.HemisphereLight(0xbfdcff, 0x0b1a2e, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(3, 5, 6);
    scene.add(key);
    const rimBlue = new THREE.PointLight(C.blue, 40, 20);
    rimBlue.position.set(-4, 2, -2);
    scene.add(rimBlue);
    const rimViolet = new THREE.PointLight(C.violet, 40, 20);
    rimViolet.position.set(4, -1, -2);
    scene.add(rimViolet);

    /* ---------- Materials ---------- */
    const shell = new THREE.MeshPhysicalMaterial({ color: C.shell, roughness: 0.25, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.15 });
    const darkGlass = new THREE.MeshPhysicalMaterial({ color: 0x0a1424, roughness: 0.1, metalness: 0.3, clearcoat: 1 });
    const joint = new THREE.MeshStandardMaterial({ color: 0x1b2a44, roughness: 0.35, metalness: 0.8 });
    const glowCyan = new THREE.MeshStandardMaterial({ color: C.cyan, emissive: C.cyan, emissiveIntensity: 2.4 });
    const glowBlue = new THREE.MeshStandardMaterial({ color: C.blue, emissive: C.blue, emissiveIntensity: 1.8 });
    const glowViolet = new THREE.MeshStandardMaterial({ color: C.violet, emissive: C.violet, emissiveIntensity: 1.8 });

    /* ---------- Robot ---------- */
    const robot = new THREE.Group();
    scene.add(robot);

    // Head
    const head = new THREE.Group();
    head.position.y = 1.15;
    robot.add(head);
    head.add(new THREE.Mesh(new RoundedBoxGeometry(2.2, 1.65, 1.6, 6, 0.45), shell));

    const face = new THREE.Mesh(new RoundedBoxGeometry(1.8, 1.15, 0.2, 5, 0.1), darkGlass);
    face.position.z = 0.75;
    head.add(face);

    const eyes = new THREE.Group();
    eyes.position.z = 0.87;
    head.add(eyes);
    const eyeGeo = new THREE.CapsuleGeometry(0.11, 0.22, 6, 16);
    const eyeL = new THREE.Mesh(eyeGeo, glowCyan);
    const eyeR = new THREE.Mesh(eyeGeo, glowCyan);
    eyeL.position.set(-0.38, 0.1, 0);
    eyeR.position.set(0.38, 0.1, 0);
    eyes.add(eyeL, eyeR);

    const smile = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 8, 32, Math.PI), glowCyan);
    smile.rotation.z = Math.PI;
    smile.position.set(0, -0.2, 0);
    eyes.add(smile);

    // Cheeks
    const cheekGeo = new THREE.CircleGeometry(0.09, 20);
    const cheekMat = new THREE.MeshBasicMaterial({ color: C.violet, transparent: true, opacity: 0.55 });
    const cheekL = new THREE.Mesh(cheekGeo, cheekMat);
    const cheekR = cheekL.clone();
    cheekL.position.set(-0.65, -0.2, 0.01);
    cheekR.position.set(0.65, -0.2, 0.01);
    eyes.add(cheekL, cheekR);

    // Ears
    const earGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.18, 24);
    [-1, 1].forEach((s) => {
        const ear = new THREE.Mesh(earGeo, joint);
        ear.rotation.z = Math.PI / 2;
        ear.position.x = s * 1.15;
        head.add(ear);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.03, 8, 24), s < 0 ? glowBlue : glowViolet);
        ring.rotation.y = Math.PI / 2;
        ring.position.x = s * 1.25;
        head.add(ring);
    });

    // Antenna
    const antenna = new THREE.Group();
    antenna.position.y = 0.82;
    head.add(antenna);
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 12), joint);
    stick.position.y = 0.25;
    antenna.add(stick);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 24), glowCyan);
    bulb.position.y = 0.55;
    antenna.add(bulb);
    const bulbLight = new THREE.PointLight(C.cyan, 3, 3);
    bulbLight.position.y = 0.55;
    antenna.add(bulbLight);

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.25, 24), joint);
    neck.position.y = 0.2;
    robot.add(neck);

    // Body
    const body = new THREE.Group();
    body.position.y = -0.65;
    robot.add(body);
    body.add(new THREE.Mesh(new RoundedBoxGeometry(1.7, 1.45, 1.2, 6, 0.4), shell));
    const chest = new THREE.Mesh(new RoundedBoxGeometry(0.95, 0.6, 0.12, 4, 0.06), darkGlass);
    chest.position.set(0, 0.1, 0.58);
    body.add(chest);
    const heart = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.04, 12, 40), glowBlue);
    heart.position.set(-0.18, 0.1, 0.66);
    body.add(heart);
    const bars = [];
    for (let i = 0; i < 3; i++) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.24, 0.03), i === 1 ? glowViolet : glowCyan);
        bar.position.set(0.1 + i * 0.12, 0.1, 0.66);
        body.add(bar);
        bars.push(bar);
    }

    // Arms
    const makeArm = (side) => {
        const shoulder = new THREE.Group();
        shoulder.position.set(side * 1.0, -0.35, 0);
        robot.add(shoulder);
        shoulder.add(new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), joint));
        const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.45, 6, 16), shell);
        upper.position.y = -0.38;
        shoulder.add(upper);
        const elbow = new THREE.Group();
        elbow.position.y = -0.72;
        shoulder.add(elbow);
        elbow.add(new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 20), joint));
        const fore = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.35, 6, 16), shell);
        fore.position.y = -0.3;
        elbow.add(fore);
        // Claw
        const hand = new THREE.Group();
        hand.position.y = -0.62;
        elbow.add(hand);
        const fingerGeo = new THREE.BoxGeometry(0.06, 0.2, 0.1);
        const f1 = new THREE.Mesh(fingerGeo, joint);
        const f2 = f1.clone();
        f1.position.x = -0.07; f1.rotation.z = 0.25;
        f2.position.x = 0.07; f2.rotation.z = -0.25;
        hand.add(f1, f2);
        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), side < 0 ? glowBlue : glowViolet);
        hand.add(tip);
        shoulder.rotation.z = side * 0.18;
        return { shoulder, elbow };
    };
    const armL = makeArm(-1);
    const armR = makeArm(1);

    // Hover base
    const base = new THREE.Group();
    base.position.y = -1.65;
    robot.add(base);
    const hover = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 0.25, 32), joint);
    base.add(hover);
    const hoverRing = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.035, 12, 48), glowCyan);
    hoverRing.rotation.x = Math.PI / 2;
    hoverRing.position.y = -0.13;
    base.add(hoverRing);

    // Ground glow
    const glowTex = (() => {
        const c = document.createElement('canvas');
        c.width = c.height = 128;
        const g = c.getContext('2d');
        const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        grd.addColorStop(0, 'rgba(34,211,238,0.9)');
        grd.addColorStop(0.4, 'rgba(21,155,255,0.35)');
        grd.addColorStop(1, 'rgba(139,53,255,0)');
        g.fillStyle = grd;
        g.fillRect(0, 0, 128, 128);
        return new THREE.CanvasTexture(c);
    })();
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(3.4, 3.4),
        new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.25;
    scene.add(ground);

    // Orbiting data particles
    const orbit = new THREE.Group();
    scene.add(orbit);
    const pGeo = new THREE.BufferGeometry();
    const N = 140;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 2.4 + Math.random() * 0.9;
        pos[i * 3] = Math.cos(a) * r;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 3.2;
        pos[i * 3 + 2] = Math.sin(a) * r;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    orbit.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: C.cyan, size: 0.045, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })));
    const orbitRing = new THREE.Mesh(
        new THREE.TorusGeometry(2.7, 0.008, 6, 160),
        new THREE.MeshBasicMaterial({ color: C.blue, transparent: true, opacity: 0.45 })
    );
    orbitRing.rotation.x = Math.PI / 2.2;
    orbit.add(orbitRing);

    robot.scale.setScalar(0.92);

    /* ---------- Interaction ---------- */
    const pointer = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);
    let dragging = false, dragX = 0, spin = 0, spinVel = 0;

    const onMove = (e) => {
        const r = mount.getBoundingClientRect();
        pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
        pointer.clampScalar(-1.5, 1.5);
        if (dragging) {
            spinVel = (e.clientX - dragX) * 0.008;
            spin += spinVel;
            dragX = e.clientX;
        }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    renderer.domElement.addEventListener('pointerdown', (e) => { dragging = true; dragX = e.clientX; });
    window.addEventListener('pointerup', () => { dragging = false; });

    let waveBoost = 0;
    renderer.domElement.addEventListener('click', () => { waveBoost = 1; });

    const onResize = () => {
        camera.aspect = width() / height();
        camera.updateProjectionMatrix();
        renderer.setSize(width(), height());
    };
    new ResizeObserver(onResize).observe(mount);

    /* ---------- Loop (paused off-screen / hidden tab) ---------- */
    const clock = new THREE.Clock();
    let running = true, raf = 0, nextBlink = 2.5;

    const tick = () => {
        const t = clock.getElapsedTime();
        target.lerp(pointer, 0.06);

        // Float
        robot.position.y = Math.sin(t * 1.4) * 0.12;
        ground.material.opacity = 0.75 - Math.sin(t * 1.4) * 0.15;

        // Body follows cursor + drag spin with inertia
        if (!dragging) { spinVel *= 0.94; spin += spinVel; spin *= 0.985; }
        robot.rotation.y = target.x * 0.35 + spin;
        robot.rotation.x = -target.y * 0.08;

        // Head looks at cursor
        head.rotation.y = target.x * 0.45;
        head.rotation.x = -target.y * 0.3;
        head.rotation.z = Math.sin(t * 0.8) * 0.04;
        eyes.position.x = target.x * 0.06;
        eyes.position.y = target.y * 0.05;

        // Blink
        if (t > nextBlink) {
            const k = Math.min((t - nextBlink) / 0.16, 1);
            const s = k < 0.5 ? 1 - k * 1.8 : 0.1 + (k - 0.5) * 1.8;
            eyeL.scale.y = eyeR.scale.y = s;
            if (k >= 1) { eyeL.scale.y = eyeR.scale.y = 1; nextBlink = t + 2 + Math.random() * 3; }
        }

        // Waving arm (+ excited wave on click)
        waveBoost *= 0.985;
        const wave = 0.35 + waveBoost * 0.6;
        armR.shoulder.rotation.z = 2.3 + Math.sin(t * (3 + waveBoost * 4)) * wave;
        armR.elbow.rotation.z = 0.5 + Math.sin(t * (3 + waveBoost * 4) + 1) * 0.35;
        armL.shoulder.rotation.z = -0.2 + Math.sin(t * 1.4) * 0.06;
        armL.shoulder.rotation.x = Math.sin(t * 1.1) * 0.1;

        // Lights & details
        bulb.scale.setScalar(1 + Math.sin(t * 4) * 0.12);
        bulbLight.intensity = 2.5 + Math.sin(t * 4) * 1;
        antenna.rotation.z = Math.sin(t * 2.2) * 0.12;
        heart.rotation.z = t * 1.5;
        bars.forEach((b, i) => { b.scale.y = 0.6 + Math.abs(Math.sin(t * 3 + i * 1.3)) * 0.8; });
        hoverRing.scale.setScalar(1 + Math.sin(t * 3) * 0.04);
        orbit.rotation.y = t * 0.15;

        renderer.render(scene, camera);
        if (running) raf = requestAnimationFrame(tick);
    };

    const start = () => { if (!running) { running = true; tick(); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop())).observe(mount);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    // Compile shaders before revealing to avoid a visible hitch
    renderer.compile(scene, camera);
    tick();
}
