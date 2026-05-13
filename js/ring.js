/* =============================================================================
 *  ring.js — Torus atmosférico em Three.js
 *
 *  Cena:
 *    • WebGLRenderer com fundo transparente (alpha: true)
 *    • Três tori concêntricos simulando glow por camadas:
 *        1. Halo externo  — tubo largo, opacidade muito baixa
 *        2. Meia-luz      — tubo médio, opacidade média
 *        3. Núcleo        — tubo fino, mais brilhante / levemente branco
 *    • AdditiveBlending em todas as camadas → luz se soma ao fundo escuro
 *    • Rotação lenta em Y e Z, com inclinação inicial em X para 3D
 *    • Pausa automática quando a aba fica em segundo plano
 * ============================================================================= */

import * as THREE from 'three';

// ─── Guarda de reduced-motion ────────────────────────────────────────────────
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Renderer ────────────────────────────────────────────────────────────────
const canvas = document.getElementById('ring-canvas');
if (!canvas) throw new Error('ring.js: canvas#ring-canvas não encontrado.');

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha:     true,   // fundo transparente
  antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0); // completamente transparente

// ─── Cena & Câmera ───────────────────────────────────────────────────────────
const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
camera.position.z = 6;

// ─── Geometria em camadas (fake glow sem pós-processamento) ──────────────────
/*
 * TorusGeometry(radius, tube, radialSegments, tubularSegments)
 *   radius          – raio do anel (distância do centro ao centro do tubo)
 *   tube            – raio do tubo (espessura da seção transversal)
 *   radialSegments  – segmentos ao redor do tubo (3 = triângulo, leve)
 *   tubularSegments – segmentos ao redor do anel (quanto maior, mais suave)
 */
const RING_RADIUS = 2.4;
const SEGMENTS    = 280;   // suavidade do círculo principal

function makeTorus(tubeRadius, hexColor, opacity) {
  const geo = new THREE.TorusGeometry(RING_RADIUS, tubeRadius, 3, SEGMENTS);
  const mat = new THREE.MeshBasicMaterial({
    color:       hexColor,
    transparent: true,
    opacity,
    blending:    THREE.AdditiveBlending, // soma com o fundo → efeito glow
    depthWrite:  false,                  // evita z-fighting entre as camadas
    side:        THREE.DoubleSide,
  });
  return new THREE.Mesh(geo, mat);
}

const ringGroup = new THREE.Group();

// Camada 1 — Halo externo: tubo largo, quase invisível
ringGroup.add(makeTorus(0.14,  0x22d3ee, 0.035));

// Camada 2 — Brilho médio: tubo intermediário
ringGroup.add(makeTorus(0.055, 0x22d3ee, 0.085));

// Camada 3 — Núcleo: tubo fino, branco-ciano, mais luminoso
ringGroup.add(makeTorus(0.016, 0xadf5ff, 0.20));

// Inclinação inicial em X → perspectiva 3D (não fica como círculo flat)
ringGroup.rotation.x = Math.PI * 0.28;

scene.add(ringGroup);

// ─── Tamanho responsivo ──────────────────────────────────────────────────────
function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resize();

// ─── Loop de animação ────────────────────────────────────────────────────────
let rafId = null;

function tick() {
  // Rotação Y: giro principal lento
  ringGroup.rotation.y += 0.0013;
  // Rotação Z: deriva suave, adiciona organicidade
  ringGroup.rotation.z += 0.00045;

  renderer.render(scene, camera);
  rafId = requestAnimationFrame(tick);
}

if (reducedMotion) {
  // Sem animação: renderiza uma vez estático
  resize();
  renderer.render(scene, camera);
} else {
  tick();
}

// ─── Eventos ────────────────────────────────────────────────────────────────
window.addEventListener('resize', resize, { passive: true });

// Pausa quando aba fica em segundo plano (economiza GPU/bateria)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  } else if (!rafId && !reducedMotion) {
    tick();
  }
});
