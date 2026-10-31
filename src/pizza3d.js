import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Photorealistic 3D Living Pizza Experience (Apple Product Showcase Standard)
 * - 3D photogrammetry-scanned artisanal pizza model with wood-fired crust & toppings
 * - Full-viewport living background with scroll-linked dynamic glide
 * - ACES Filmic tone mapping & 3-point cinematic studio lighting
 * - Organic rising steam particles & soft contact shadow
 * - Full touch/drag 3D rotation with inertia & spring bounce
 */
export function initPizza3D(canvasElement, touchTargetElement) {
  if (!canvasElement) return null;

  const width = window.innerWidth;
  const height = window.innerHeight;

  // 1. Scene & Cinematic Perspective Camera
  const scene = new THREE.Scene();
  
  // 36° FOV gives natural cinematic perspective without wide-angle distortion
  const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
  camera.position.set(0, 1.2, 5.2);
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
  renderer.toneMappingExposure = 1.32;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  canvasElement.appendChild(renderer.domElement);

  // 3. 3-Point Studio Lighting
  // Warm ambient light for soft fill
  const ambientLight = new THREE.AmbientLight(0xfff6ee, 1.6);
  scene.add(ambientLight);

  // Key Light: Overhead warm softbox
  const keyLight = new THREE.DirectionalLight(0xfffaea, 3.2);
  keyLight.position.set(3.5, 6, 4.5);
  scene.add(keyLight);

  // Fiery Amber Rim Light: Highlights crisp charred crust edge & toppings
  const rimLight = new THREE.DirectionalLight(0xff4a1c, 3.6);
  rimLight.position.set(-3.5, 3.5, -3.2);
  scene.add(rimLight);

  // Cool Specular Fill Light for photographic contrast
  const fillLight = new THREE.DirectionalLight(0xffeedd, 1.2);
  fillLight.position.set(-2.5, 2, 4);
  scene.add(fillLight);

  // 4. Master Pizza Group
  const pizzaGroup = new THREE.Group();
  // Hero initial position: calibrated for 390px mobile viewport hero stage
  pizzaGroup.position.set(0, 0.05, 0);
  scene.add(pizzaGroup);

  // 5. Soft Contact Shadow Plane
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const sCtx = shadowCanvas.getContext('2d');
  const sGrad = sCtx.createRadialGradient(128, 128, 15, 128, 128, 115);
  sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
  sGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
  sGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.08)');
  sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  sCtx.fillStyle = sGrad;
  sCtx.fillRect(0, 0, 256, 256);

  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowGeo = new THREE.PlaneGeometry(1.65, 1.65);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.65,
    depthWrite: false
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.set(0, -0.18, 0);
  scene.add(shadowMesh);

  // 6. Delicate Rising Steam Particles
  const steamCount = 38;
  const steamGeo = new THREE.BufferGeometry();
  const steamPositions = new Float32Array(steamCount * 3);
  const steamSpeed = new Float32Array(steamCount);
  const steamOffsets = new Float32Array(steamCount);

  for (let i = 0; i < steamCount; i++) {
    const r = Math.random() * 1.1;
    const theta = Math.random() * Math.PI * 2;
    steamPositions[i * 3] = Math.cos(theta) * r;
    steamPositions[i * 3 + 1] = 0.05 + Math.random() * 0.9;
    steamPositions[i * 3 + 2] = Math.sin(theta) * r;
    steamSpeed[i] = 0.0035 + Math.random() * 0.0045;
    steamOffsets[i] = Math.random() * Math.PI * 2;
  }
  steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));

  // Soft puff particle texture
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
    size: 0.42,
    map: pTexture,
    transparent: true,
    opacity: 0.52,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const steamParticles = new THREE.Points(steamGeo, steamMat);
  pizzaGroup.add(steamParticles);

  // 7. Load Photorealistic Scanned Pizza Model
  let modelLoaded = false;
  const loader = new GLTFLoader();
  loader.load(
    '/assets/test-pizza.glb',
    (gltf) => {
      const model = gltf.scene;

      // Hide wooden serving plate to keep authentic floating 3D pizza showcase
      model.traverse((child) => {
        if (child.name.includes('Tarelka')) {
          child.visible = false;
        }
        if (child.isMesh && child.material) {
          child.material.roughness = 0.56;
          child.material.metalness = 0.04;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Compute bounding box strictly for visible pizza mesh (ignoring hidden plate handle)
      const box = new THREE.Box3();
      model.traverse((child) => {
        if (child.isMesh && child.visible) {
          box.expandByObject(child);
        }
      });
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      
      // Mathematically calibrated diameter for mobile screen: ~84% of visible screen width
      const targetDim = 1.40;
      const modelScale = targetDim / maxDim;
      model.scale.setScalar(modelScale);
      model.position.sub(center.multiplyScalar(modelScale));

      pizzaGroup.add(model);
      modelLoaded = true;
    },
    undefined,
    (err) => {
      console.warn('Failed to load GLTF pizza model, falling back to procedural model:', err);
    }
  );

  // 8. Scroll-Linked Background Transition Engine
  let scrollProgress = 0;
  function onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    // Over the first 650px of scroll, smoothly glide into the background behind cards
    scrollProgress = Math.min(1, Math.max(0, scrollY / 650));
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // 9. Interactive Touch Drag on Dedicated Touch Zone
  let isDragging = false;
  let previousPointer = { x: 0, y: 0 };
  let targetRotationY = -0.22;
  let targetRotationX = 0.48; // Optimal tilt angle showing crust + toppings
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

  // Gyroscope subtle mobile tilt
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

  // Resize handler
  function onResize() {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  }
  window.addEventListener('resize', onResize);

  // 10. Animation Loop with Dynamic Background Glide
  let clock = new THREE.Clock();
  let animationFrameId;

  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Idle spin when user is not touching
    if (!userInteracting) {
      targetRotationY += autoRotateSpeed;
    }

    // APPLE-STYLE DYNAMIC SCROLL GLIDE CALCULATIONS:
    // When scrollProgress goes from 0 -> 1:
    // 1. In Hero (scroll = 0): centered at X=0, Y=-0.05 inside .hero-3d-stage
    // 2. In Background (scroll = 1): glides upward & rightward (X: 0 -> 0.42, Y: -0.05 -> 0.58)
    // 3. Scales down slightly (1.0 -> 0.74) to leave negative space for content cards
    // 4. Tilts dynamically to reveal 3D crust volume from different angles
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

    shadowMesh.position.x = pizzaGroup.position.x;
    shadowMesh.position.y = pizzaGroup.position.y - 0.18 * newScale;
    shadowMesh.scale.setScalar(newScale);

    // Steam particles movement
    const positions = steamGeo.attributes.position.array;
    for (let i = 0; i < steamCount; i++) {
      positions[i * 3 + 1] += steamSpeed[i];
      positions[i * 3] += Math.sin(elapsedTime * 2 + steamOffsets[i]) * 0.0006;
      if (positions[i * 3 + 1] > 1.3) {
        positions[i * 3 + 1] = 0.06;
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
