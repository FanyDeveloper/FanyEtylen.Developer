import { useEffect, useRef } from "react";

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized?: boolean;
      init?: () => void;
    };
  }
}

// Fixed headline content as structured data to avoid DOM re-split issues
const HEADLINE_PARTS = [
  { text: "Seu site pode ser bonito.", br: true },
  { text: "Ou gerar resultado.", br: false },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  /* ------------------------------------------------------------------ */
  /*  Unicorn Studio — NOT touched                                        */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const u = window.UnicornStudio;
    if (u && u.init) {
      u.init();
    } else {
      window.UnicornStudio = { isInitialized: false };
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.9/dist/unicornStudio.umd.js";
      script.onload = () => window.UnicornStudio?.init?.();
      (document.head || document.body).appendChild(script);
    }
  }, []);

  /* ------------------------------------------------------------------ */
  /*  Animate when in view — Hero                                         */
  /*  Sequence: badge (0ms) → words (100+80n ms) → subtitle → CTA        */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";
    const WORD_BASE = 100;
    const WORD_STEP = 80;

    /* --- 1. Build headline with word-by-word .iv spans --- */
    const headline = section.querySelector<HTMLElement>(".hero__headline");
    let wordCount = 0;

    if (headline) {
      headline.innerHTML = "";

      HEADLINE_PARTS.forEach(({ text, br }) => {
        // Split text into words
        text.split(" ").forEach((word, i, arr) => {
          const delay = WORD_BASE + wordCount * WORD_STEP;
          wordCount++;

          const mask = document.createElement("span");
          mask.className = "word-mask";

          const inner = document.createElement("span");
          inner.className = "iv";
          inner.style.cssText = `display:inline-block;animation:wordReveal 0.75s ${EASE} ${delay}ms both`;
          inner.textContent = i < arr.length - 1 ? word + "\u00A0" : word;

          mask.appendChild(inner);
          headline.appendChild(mask);
        });

        // Add line break after each part (except last)
        if (br) headline.appendChild(document.createElement("br"));
      });
    }

    /* --- 2. Compute and apply delays for subtitle + CTA --- */
    const subtitleDelay = WORD_BASE + wordCount * WORD_STEP + 80;
    const ctaDelay = subtitleDelay + 140;

    const subtitle = section.querySelector<HTMLElement>(".hero__subtitle");
    const cta = section.querySelector<HTMLElement>(".hero__cta");

    if (subtitle) {
      subtitle.style.animation = `auraReveal 0.9s ${EASE} ${subtitleDelay}ms both`;
      subtitle.classList.add("iv");
    }
    if (cta) {
      cta.style.animation = `auraReveal 0.9s ${EASE} ${ctaDelay}ms both`;
      cta.classList.add("iv");
    }

    /* --- 3. Activate visible elements immediately, IO for off-screen --- */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px" }
    );

    // setTimeout(0) runs after the browser has painted — subtitle/CTA classes
    // are already set. The 'cancelled' flag handles StrictMode double-invoke:
    // first mount sets timer → cleanup sets cancelled=true + clears timer
    // second mount sets a new timer → runs cleanly
    let cancelled = false;
    const timerId = setTimeout(() => {
      if (cancelled) return;

      const ivEls = Array.from(section.querySelectorAll<HTMLElement>(".iv"));
      ivEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        const inViewport =
          r.bottom > 0 && r.top < window.innerHeight &&
          r.right > 0 && r.left < window.innerWidth;

        if (inViewport) {
          el.classList.add("is-visible");
        } else {
          io.observe(el);
        }
      });
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timerId);
      io.disconnect();
    };
  }, []);

  return (
    <section className="hero" id="inicio" ref={sectionRef}>
      {/* ---- Unicorn Studio background — NOT modified ---- */}
      <div
        className="us-bg"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          transform: "translateY(-60px)",
          maskImage: "linear-gradient(to bottom, black 80%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent)",
        }}
      >
        <div
          data-us-project="5mFqhNAzdUTLRcrOHfd1"
          style={{ position: "absolute", inset: 0 }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "180px",
            background:
              "linear-gradient(to top, #020202 0%, #020202 30%, transparent 100%)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />
      </div>

      <div className="hero__frame" style={{ position: "relative", zIndex: 60 }}>
        {/* Badge — delay 0ms, set as static inline style */}
        <span
          className="hero__badge iv"
          style={{
            animation:
              "auraReveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0ms both",
          }}
        >
          <svg
            className="hero__badge-icon"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Disponível para novos projetos
        </span>

        {/* Headline — populated by useEffect with word spans */}
        <h1 className="hero__headline" aria-label="Seu site pode ser bonito. Ou gerar resultado." />

        {/* Subtitle — .iv class + animation delay added by useEffect */}
        <p className="hero__subtitle">
          Eu desenvolvo experiências digitais que fazem os dois — com design de alto<br />
          nível, interações modernas e estratégia por trás de cada detalhe.
        </p>

        {/* CTA — .iv class + animation delay added by useEffect */}
        <a className="hero__cta" href="#projetos">
          <span className="hero__cta-shimmer" aria-hidden="true">
            <span className="hero__cta-shimmer-ring" />
          </span>
          <span className="hero__cta-mask" aria-hidden="true" />
          <span className="hero__cta-inner">
            <span className="hero__cta-text">Ver projetos</span>
            <span className="hero__cta-arrow" aria-hidden="true">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}
