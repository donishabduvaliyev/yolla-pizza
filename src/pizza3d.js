import * as THREE from 'three';

/**
 * Photorealistic 3D Living Pizza Experience (Apple Product Showcase Standard)
 * - Pure Round New York Style Pepperoni Pizza (authentic beef pepperoni discs, golden bubbling mozzarella, charred wood-fired cornicione crust, zero basil/greens)
 * - Full-viewport living background with scroll-linked dynamic glide
 * - ACES Filmic tone mapping & 3-point cinematic studio lighting
 * - Organic rising steam particles & soft ground contact shadow
 * - Full touch/drag 3D rotation with inertia, spring squish & gyro tilt
 */
export function initPizza3D(canvasElement, touchTargetElement) {
  if (!canvasElement) return null;

  const width = window.innerWidth;
  const height = window.innerHeight;

  // 1. Scene & Cinematic Perspective Camera
  const scene = new THREE.Scene();
  
  // 36° FOV gives natural product showcase perspective without wide-angle distortion
  const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
  camera.position.set(0, 1.35, 5.2);
  camera.lookAt(0, 0, 0);

  // 2. High-Performance WebGL Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.34;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  canvasElement.appendChild(renderer.domElement);

  // 3. Warm Studio 3-Point Lighting
  const ambientLight = new THREE.AmbientLight(0xfff6ec, 1.8);
  scene.add(ambientLight);

  // Key Light: Overhead softbox highlighting glistening cheese and pepperoni cups
  const keyLight = new THREE.DirectionalLight(0xfffaee, 3.4);
  keyLight.position.set(3.5, 6.0, 4.5);
  scene.add(keyLight);

  // Fiery Amber Rim Light: Accentuates crisp blistered cornicione crust
  const rimLight = new THREE.DirectionalLight(0xff4a1c, 4.2);
  rimLight.position.set(-3.5, 3.8, -3.2);
  scene.add(rimLight);

  // Cool Specular Fill Light: Provides studio definition and reflections
  const fillLight = new THREE.DirectionalLight(0xffeedd, 1.4);
  fillLight.position.set(-2.8, 2.2, 4.0);
  scene.add(fillLight);

  // 4. Master Pizza Group
  const pizzaGroup = new THREE.Group();
  pizzaGroup.position.set(0, 0.05, 0);
  scene.add(pizzaGroup);

  // 5. Load High-Resolution PBR Textures
  const texLoader = new THREE.TextureLoader();
  const diffuseMap = texLoader.load('/assets/pepperoni-perfect-1024.png');
  diffuseMap.colorSpace = THREE.SRGBColorSpace;
  diffuseMap.generateMipmaps = true;
  diffuseMap.minFilter = THREE.LinearMipmapLinearFilter;

  const normalMap = texLoader.load('/assets/pepperoni-normal.png');
  const roughnessMap = texLoader.load('/assets/pepperoni-roughness.png');

  // 6. Seamless Solid 3D Pizza Geometry (Calibrated for Mobile Hero Viewport)
  const R = 0.65; // ~83% of mobile screen width at camera distance 5.2
  const rings = 64;
  const segments = 128;

  const positions = [];
  const uvs = [];
  const indices = [];

  // Top center vertex
  const topCenterIdx = 0;
  positions.push(0, -0.008, 0);
  uvs.push(0.5, 0.5);

  // Top rings (Cheese bed + Cornicione Crust)
  for (let r = 1; r <= rings; r++) {
    const frac = r / rings;
    const rad = frac * R;

    let y = -0.008;
    if (frac < 0.72) {
      // Concave melted mozzarella bed
      y = -0.008 + (frac / 0.72) * 0.005;
    } else if (frac < 0.90) {
      // Puffy cornicione crust arching up
      const t = (frac - 0.72) / (0.90 - 0.72);
      const st = t * t * (3 - 2 * t);
      y = -0.003 + st * 0.058; // peaks at +0.055
    } else {
      // Outer crust crest rolling over edge
      const t = (frac - 0.90) / 0.10;
      const st = t * t * (3 - 2 * t);
      y = 0.055 - st * 0.040;
    }

    for (let s = 0; s < segments; s++) {
      const theta = (s / segments) * Math.PI * 2;
      const x = Math.cos(theta) * rad;
      const z = Math.sin(theta) * rad;

      positions.push(x, y, z);
      uvs.push(0.5 + (x / (R * 2.02)), 0.5 - (z / (R * 2.02)));
    }
  }

  // Top faces: Counter-clockwise winding for upward normals
  for (let s = 0; s < segments; s++) {
    const nextS = (s + 1) % segments;
    indices.push(topCenterIdx, 1 + nextS, 1 + s);
  }
  for (let r = 1; r < rings; r++) {
    const rowA = 1 + (r - 1) * segments;
    const rowB = 1 + r * segments;
    for (let s = 0; s < segments; s++) {
      const nextS = (s + 1) % segments;
      const a = rowA + s;
      const b = rowA + nextS;
      const c = rowB + s;
      const d = rowB + nextS;
      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }

  const topRimRow = 1 + (rings - 1) * segments;

  // Bottom surface (Dough base)
  const bottomRings = 16;
  const bottomStartIdx = positions.length / 3;
  const bottomCenterIdx = bottomStartIdx;
  positions.push(0, -0.035, 0);
  uvs.push(0.5, 0.5);

  for (let r = 1; r <= bottomRings; r++) {
    const frac = r / bottomRings;
    const rad = frac * R;
    let y = -0.035;
    if (frac > 0.85) {
      const t = (frac - 0.85) / 0.15;
      y = -0.035 + t * 0.022;
    }
    for (let s = 0; s < segments; s++) {
      const theta = (s / segments) * Math.PI * 2;
      const x = Math.cos(theta) * rad;
      const z = Math.sin(theta) * rad;
      positions.push(x, y, z);
      uvs.push(0.5 + (x / (R * 2.1)), 0.5 - (z / (R * 2.1)));
    }
  }

  // Bottom faces: Facing downwards
  for (let s = 0; s < segments; s++) {
    const nextS = (s + 1) % segments;
    indices.push(bottomCenterIdx, bottomStartIdx + 1 + s, bottomStartIdx + 1 + nextS);
  }
  for (let r = 1; r < bottomRings; r++) {
    const rowA = bottomStartIdx + 1 + (r - 1) * segments;
    const rowB = bottomStartIdx + 1 + r * segments;
    for (let s = 0; s < segments; s++) {
      const nextS = (s + 1) % segments;
      const a = rowA + s;
      const b = rowA + nextS;
      const c = rowB + s;
      const d = rowB + nextS;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  const bottomRimRow = bottomStartIdx + 1 + (bottomRings - 1) * segments;

  // Connect top rim to bottom rim
  for (let s = 0; s < segments; s++) {
    const nextS = (s + 1) % segments;
    const topA = topRimRow + s;
    const topB = topRimRow + nextS;
    const botA = bottomRimRow + s;
    const botB = bottomRimRow + nextS;

    indices.push(topA, topB, botA);
    indices.push(topB, botB, botA);
  }

  const pizzaGeometry = new THREE.BufferGeometry();
  pizzaGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  pizzaGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  pizzaGeometry.setIndex(indices);
  pizzaGeometry.computeVertexNormals();

  const pizzaMaterial = new THREE.MeshPhysicalMaterial({
    map: diffuseMap,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(1.2, 1.2),
    roughnessMap: roughnessMap,
    roughness: 0.52,
    metalness: 0.02,
    clearcoat: 0.85,
    clearcoatRoughness: 0.20
  });

  const pizzaMesh = new THREE.Mesh(pizzaGeometry, pizzaMaterial);
  pizzaGroup.add(pizzaMesh);

  // 7. Ground Contact Shadow
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const sCtx = shadowCanvas.getContext('2d');
  const sGrad = sCtx.createRadialGradient(128, 128, 15, 128, 128, 115);
  sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.78)');
  sGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.38)');
  sGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.08)');
  sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  sCtx.fillStyle = sGrad;
  sCtx.fillRect(0, 0, 256, 256);

  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowGeo = new THREE.PlaneGeometry(1.8, 1.8);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.72,
    depthWrite: false
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.set(0, -0.42, 0);
  scene.add(shadowMesh);

  // 8. Delicate Rising Steam Particles
  const steamCount = 38;
  const steamGeo = new THREE.BufferGeometry();
  const steamPositions = new Float32Array(steamCount * 3);
  const steamSpeed = new Float32Array(steamCount);
  const steamOffsets = new Float32Array(steamCount);

  for (let i = 0; i < steamCount; i++) {
    const r = Math.random() * 0.55;
    const theta = Math.random() * Math.PI * 2;
    steamPositions[i * 3] = Math.cos(theta) * r;
    steamPositions[i * 3 + 1] = 0.03 + Math.random() * 0.55;
    steamPositions[i * 3 + 2] = Math.sin(theta) * r;
    steamSpeed[i] = 0.0035 + Math.random() * 0.0045;
    steamOffsets[i] = Math.random() * Math.PI * 2;
  }
  steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));

  const pCanvas = document.createElement('canvas');
  pCanvas.width = 64;
  pCanvas.height = 64;
  const pCtx = pCanvas.getContext('2d');
  const pGrad = pCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
  pGrad.addColorStop(0, 'rgba(255, 250, 240, 0.38)');
  pGrad.addColorStop(0.5, 'rgba(255, 245, 230, 0.14)');
  pGrad.addColorStop(1, 'rgba(255, 245, 230, 0)');
  pCtx.fillStyle = pGrad;
  pCtx.fillRect(0, 0, 64, 64);
  const pTexture = new THREE.CanvasTexture(pCanvas);

  const steamMat = new THREE.PointsMaterial({
    size: 0.28,
    map: pTexture,
    transparent: true,
    opacity: 0.52,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const steamParticles = new THREE.Points(steamGeo, steamMat);
  pizzaGroup.add(steamParticles);

  // 9. Scroll-Linked Background Transition Engine
  let scrollProgress = 0;
  function onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    scrollProgress = Math.min(1, Math.max(0, scrollY / 650));
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // 10. Interactive Touch Drag on Dedicated Zone
  let isDragging = false;
  let previousPointer = { x: 0, y: 0 };
  let targetRotationY = -0.22;
  let targetRotationX = 0.48; // Optimal tilt showcasing crust volume & toppings
  let autoRotateSpeed = 0.0035;
  let userInteracting = false;
  let userTimer = null;

  function onPointerDown(e) {
    isDragging = true;
    userInteracting = true;
    clearTimeout(userTimer);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    previousPointer = { x: clientX, y: clientY };
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - previousPointer.x;
    const deltaY = clientY - previousPointer.y;

    targetRotationY += deltaX * 0.008;
    targetRotationX = Math.max(0.15, Math.min(0.85, targetRotationX + deltaY * 0.006));

    previousPointer = { x: clientX, y: clientY };
  }

  function onPointerUp() {
    isDragging = false;
    userTimer = setTimeout(() => {
      userInteracting = false;
    }, 2800);
  }

  const dragTarget = touchTargetElement || renderer.domElement;
  dragTarget.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  dragTarget.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // Gyroscope mobile subtle tilt
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      if (userInteracting || isDragging) return;
      if (e.gamma !== null && e.beta !== null) {
        const tiltY = (e.gamma / 45) * 0.12;
        const tiltX = ((e.beta - 45) / 45) * 0.1;
        targetRotationY += tiltY * 0.01;
        targetRotationX = Math.max(0.2, Math.min(0.7, 0.48 + tiltX));
      }
    });
  }

  // Squish and Spring Bounce on Tap
  let bounceProgress = 1;
  function triggerBounce() {
    bounceProgress = 0;
    if (navigator.vibrate) navigator.vibrate(25);
  }
  dragTarget.addEventListener('click', triggerBounce);

  // Window resize handler
  function onResize() {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  }
  window.addEventListener('resize', onResize);

  // 11. Animation Loop with Dynamic Background Glide
  let clock = new THREE.Clock();
  let animationFrameId;

  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    if (!userInteracting) {
      targetRotationY += autoRotateSpeed;
    }

    // APPLE-STYLE DYNAMIC SCROLL GLIDE:
    // 1. In Hero (scroll = 0): centered at X=0, Y=0.05 inside .hero-3d-stage
    // 2. In Background (scroll = 1): glides smoothly to upper right background behind frosted glass cards
    // 3. Tilts dynamically to reveal 3D crust volume
    const scrollTargetX = scrollProgress * 0.38;
    const scrollTargetY = 0.05 + scrollProgress * 0.70;
    const scrollTargetScale = 1.0 - scrollProgress * 0.18;
    const scrollTiltX = scrollProgress * 0.22;
    const scrollSpinY = scrollProgress * 0.75;

    // Smooth inertia interpolation
    pizzaGroup.position.x += (scrollTargetX - pizzaGroup.position.x) * 0.08;
    pizzaGroup.position.y += (scrollTargetY + Math.sin(elapsedTime * 1.8) * 0.02 - pizzaGroup.position.y) * 0.08;
    
    const curScale = pizzaGroup.scale.x;
    const targetScale = scrollTargetScale;
    const newScale = curScale + (targetScale - curScale) * 0.08;

    // Bounce spring effect
    if (bounceProgress < 1) {
      bounceProgress += 0.06;
      const bSin = Math.sin(bounceProgress * Math.PI);
      pizzaGroup.scale.set(
        newScale * (1 + bSin * 0.05),
        newScale * (1 - bSin * 0.06),
        newScale * (1 + bSin * 0.05)
      );
    } else {
      pizzaGroup.scale.set(newScale, newScale, newScale);
    }

    pizzaGroup.rotation.y += (targetRotationY + scrollSpinY - pizzaGroup.rotation.y) * 0.08;
    pizzaGroup.rotation.x += (targetRotationX + scrollTiltX - pizzaGroup.rotation.x) * 0.08;

    // Shadow moves with the pizza on the ground plane below it
    shadowMesh.position.x = pizzaGroup.position.x;
    shadowMesh.position.y = pizzaGroup.position.y - 0.42 * newScale;
    shadowMesh.scale.setScalar(newScale);

    // Steam particles movement
    const pPositions = steamGeo.attributes.position.array;
    for (let i = 0; i < steamCount; i++) {
      pPositions[i * 3 + 1] += steamSpeed[i];
      pPositions[i * 3] += Math.sin(elapsedTime * 2 + steamOffsets[i]) * 0.0006;
      if (pPositions[i * 3 + 1] > 0.8) {
        pPositions[i * 3 + 1] = 0.04;
      }
    }
    steamGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();

  return {
    destroy: () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      dragTarget.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dragTarget.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    },
    spin360: () => {
      targetRotationY += Math.PI * 2;
      triggerBounce();
    },
    toggleSteam: (active) => {
      steamParticles.visible = active;
    },
    setTopAngle: () => {
      targetRotationX = 0.78;
      triggerBounce();
    }
  };
}
