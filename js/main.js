/* =============================================================================
 *  main.js — Interações da landing page
 *
 *  Conteúdo:
 *    1. Split de palavras para o headline (reveal animado via CSS)
 *    2. Canvas de partículas no fundo (inspirado no UnicornStudio da referência)
 * ========================================================================== */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------------------------
   * 1) SPLIT DE PALAVRAS DO HEADLINE
   * -------------------------------------------------------------------------
   *  Lê cada nó de texto dentro de [data-splitwords], separa em palavras
   *  e envolve cada palavra num <span class="word-mask"><span class="word-inner">…</span></span>.
   *  Cada word-inner recebe --word-delay incremental, usado pela animação CSS.
   * ------------------------------------------------------------------------ */
  function splitWords(root, options = {}) {
    const baseDelay = options.baseDelay ?? 300;   // atraso antes da 1ª palavra
    const stepDelay = options.stepDelay ?? 55;    // atraso entre palavras

    // Coleta todos os nós de texto sob o root (preservando <br/>)
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent.trim().length > 0) textNodes.push(node);
    }

    let wordIndex = 0;

    textNodes.forEach((textNode) => {
      const words = textNode.textContent.split(/\s+/).filter(Boolean);
      const fragment = document.createDocumentFragment();

      words.forEach((word, i) => {
        const mask = document.createElement("span");
        mask.className = "word-mask";

        const inner = document.createElement("span");
        inner.className = "word-inner";
        inner.textContent = word;
        inner.style.setProperty(
          "--word-delay",
          `${baseDelay + wordIndex * stepDelay}ms`
        );

        mask.appendChild(inner);
        fragment.appendChild(mask);

        // Espaço entre palavras (menos depois da última)
        if (i < words.length - 1) {
          fragment.appendChild(document.createTextNode(" "));
        }

        wordIndex++;
      });

      textNode.parentNode.replaceChild(fragment, textNode);
    });
  }

  /* ---------------------------------------------------------------------------
   * 2) CANVAS DE PARTÍCULAS
   * -------------------------------------------------------------------------
   *  Pontos brilhantes cyan à deriva, linhas de conexão, repulsão suave do
   *  mouse e spotlight radial cyan desenhado diretamente no canvas.
   * ------------------------------------------------------------------------ */
  function initParticles(canvas) {
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = { x: -9999, y: -9999, active: false };
    let particles = [];
    let rafId = null;

    // -- Tunables (calibrados para combinar com a referência) ----------------
    const DENSITY        = 0.00011;  // ~170 pts em 1920×800
    const MAX_PARTICLES  = 220;
    const MIN_PARTICLES  = 60;
    const LINK_DIST      = 150;      // px — distância máxima para traçar linha
    const MOUSE_RADIUS   = 160;      // px — raio da repulsão do mouse
    const MOUSE_STRENGTH = 0.9;      // força da repulsão (0–1)

    // Cores (sistema cyan da referência: --accent #22d3ee)
    const DOT_COLOR_R  = 34;   // rgb do cyan-400
    const DOT_COLOR_G  = 211;
    const DOT_COLOR_B  = 238;
    const LINE_R       = 34;
    const LINE_G       = 211;
    const LINE_B       = 238;
    // -----------------------------------------------------------------------

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    // Mix entre branco puro e cyan conforme posição aleatória (replica o look
    // da referência onde algumas partículas são mais quentes/frias)
    function createParticle() {
      const cyanBias = Math.random(); // 0 = branco, 1 = cyan puro
      return {
        x:           rand(0, width),
        y:           rand(0, height),
        vx:          rand(-0.18, 0.18),
        vy:          rand(-0.18, 0.18),
        r:           rand(0.7, 2.0),
        baseAlpha:   rand(0.30, 0.80),
        cyanBias,
        twinklePhase: rand(0, Math.PI * 2),
        twinkleSpeed: rand(0.003, 0.008),
      };
    }

    function buildParticleList(target) {
      if (particles.length === 0) {
        for (let i = 0; i < target; i++) particles.push(createParticle());
      } else if (particles.length < target) {
        for (let i = particles.length; i < target; i++) particles.push(createParticle());
      } else if (particles.length > target) {
        particles.length = target;
      }
    }

    function resize() {
      // clientWidth/clientHeight são read-only — nunca atribuir a elas.
      // Usar window.innerWidth/innerHeight diretamente é suficiente.
      width  = window.innerWidth;
      height = window.innerHeight;
      canvas.width  = Math.floor(width  * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.max(
        MIN_PARTICLES,
        Math.min(MAX_PARTICLES, Math.floor(width * height * DENSITY))
      );
      buildParticleList(target);
    }

    // Spotlight cyan pintado no canvas — gradiente radial elíptico simples no topo
    function drawSpotlight() {
      const cx = width * 0.5;
      // Gradiente radial circular grande; a máscara CSS do canvas (.particles)
      // cuida da suavização vertical inferior.
      const radius = Math.max(width * 0.6, 500);
      const grad = ctx.createRadialGradient(cx, 0, 0, cx, 0, radius);
      grad.addColorStop(0,    "rgba(34,211,238,0.07)");
      grad.addColorStop(0.35, "rgba(34,211,238,0.03)");
      grad.addColorStop(0.65, "rgba(34,211,238,0.008)");
      grad.addColorStop(1,    "rgba(34,211,238,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      // Spotlight radial no topo
      drawSpotlight();

      // ---------- Linhas entre vizinhos (antes dos pontos → ficam embaixo) ----------
      ctx.shadowBlur = 0;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b  = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          // Evita Math.hypot para performance em N²
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const dist  = Math.sqrt(d2);
            const t     = 1 - dist / LINK_DIST;
            const alpha = t * t * 0.18;  // cai quadrático — mais suave nas bordas
            ctx.strokeStyle = `rgba(${LINE_R},${LINE_G},${LINE_B},${alpha.toFixed(3)})`;
            ctx.lineWidth   = 0.55;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // ---------- Pontos brilhantes ----------
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Movimento + wrap nas bordas
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -12) p.x = width  + 12;
        else if (p.x > width  + 12) p.x = -12;
        if (p.y < -12) p.y = height + 12;
        else if (p.y > height + 12) p.y = -12;

        // Repulsão suave do mouse
        if (mouse.active) {
          const dx   = p.x - mouse.x;
          const dy   = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS && dist > 0.5) {
            const force = (1 - dist / MOUSE_RADIUS) * MOUSE_STRENGTH;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // Twinkle (piscar suave)
        p.twinklePhase += p.twinkleSpeed;
        const twinkle = 0.55 + 0.45 * Math.sin(p.twinklePhase);
        const alpha   = p.baseAlpha * twinkle;

        // Cor interpolada entre branco e cyan conforme cyanBias
        const cb = p.cyanBias;
        const r  = Math.round(255 + (DOT_COLOR_R - 255) * cb);
        const g  = Math.round(255 + (DOT_COLOR_G - 255) * cb);
        const b  = Math.round(255 + (DOT_COLOR_B - 255) * cb);

        // Camada de halo externo difuso (glow largo e suave)
        ctx.beginPath();
        ctx.shadowColor = `rgba(${DOT_COLOR_R},${DOT_COLOR_G},${DOT_COLOR_B},0.85)`;
        ctx.shadowBlur  = 14;
        ctx.fillStyle   = `rgba(${r},${g},${b},${(alpha * 0.55).toFixed(3)})`;
        ctx.arc(p.x, p.y, p.r * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Núcleo brilhante
        ctx.beginPath();
        ctx.shadowColor = `rgba(${DOT_COLOR_R},${DOT_COLOR_G},${DOT_COLOR_B},1)`;
        ctx.shadowBlur  = 6;
        ctx.fillStyle   = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Limpa shadow para não vazar
      ctx.shadowBlur = 0;

      rafId = requestAnimationFrame(step);
    }

    /* -------- Eventos -------- */
    function onMouseMove(e) {
      mouse.x      = e.clientX;
      mouse.y      = e.clientY;
      mouse.active = true;
    }
    function onMouseLeave() { mouse.active = false; }
    function onResize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      resize();
    }

    resize();
    rafId = requestAnimationFrame(step);

    window.addEventListener("resize",    onResize,     { passive: true });
    window.addEventListener("mousemove", onMouseMove,  { passive: true });
    window.addEventListener("mouseout",  onMouseLeave, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!rafId) {
        rafId = requestAnimationFrame(step);
      }
    });
  }

  /* ---------------------------------------------------------------------------
   * INIT
   * ------------------------------------------------------------------------ */
  function init() {
    // Headline: split em palavras para animação staggered
    const headline = document.querySelector("[data-splitwords]");
    if (headline) splitWords(headline, { baseDelay: 300, stepDelay: 55 });

    // Partículas (desativadas em reduced motion)
    const canvas = document.getElementById("particles");
    if (canvas && !prefersReducedMotion) initParticles(canvas);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
