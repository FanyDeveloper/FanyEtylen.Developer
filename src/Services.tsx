import { useEffect, useRef } from "react";

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("srv-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );

    if (sectionRef.current) {
      const animEls = sectionRef.current.querySelectorAll(".srv-anim");
      animEls.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="srv" id="servicos">
      {/* Section Header */}
      <div className="srv__header">
        <div className="srv__header-left">
          {/* Eyebrow */}
          <div className="srv__eyebrow srv-anim">
            <span className="srv__eyebrow-text">03. Serviços</span>
          </div>
          {/* Title + Description */}
          <div className="srv__title-block srv-anim">
            <h2 className="srv__title">
              Expertise{" "}
              <span className="srv__title-accent">Digital</span>
            </h2>
            <p className="srv__desc">
              Um conjunto completo de serviços de design e desenvolvimento.
              Construo produtos digitais escaláveis para marcas ambiciosas.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button className="srv__cta-btn group srv-anim" type="button">
          <div className="srv__cta-glow" />
          <div className="srv__cta-glow-hover" />
          <div className="srv__cta-stroke" />
          <div className="srv__cta-stroke-hover" />
          <div className="srv__cta-beam-wrap">
            <div className="srv__cta-beam" />
          </div>
          <div className="srv__cta-fill" />
          <div className="srv__cta-content">
            <span>Ver Serviços</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Bottom separator */}
        <div className="srv__header-line" />
        <div className="srv__header-line-glow" />
      </div>

      {/* Bento Grid */}
      <div className="srv__grid">
        {/* Card 1: Brand Identity */}
        <div className="srv__card srv__card--sm srv-anim" style={{ animationDelay: "0.3s" }}>
          <div className="srv__card-inner">
            <div className="srv__card-text">
              <h3 className="srv__card-title">Identidade Visual</h3>
              <p className="srv__card-desc">
                Sistemas visuais que contam sua história. Logos, paletas de cores e tipografia.
              </p>
            </div>
            <div className="srv__card-visual srv__card-visual--brand">
              <div className="srv__brand-content">
                <div className="srv__brand-top">
                  <div className="srv__brand-type">
                    <span className="srv__brand-type-letter">Aa</span>
                    <span className="srv__brand-type-name">Plus Jakarta Sans</span>
                  </div>
                  <div className="srv__brand-colors">
                    <div className="srv__brand-dot" style={{ background: "var(--accent)" }} />
                    <div className="srv__brand-dot" style={{ background: "#d4d4d8" }} />
                    <div className="srv__brand-dot" style={{ background: "#27272a" }} />
                  </div>
                </div>
                <div className="srv__brand-shapes">
                  <div className="srv__brand-shape">
                    <div className="srv__brand-shape-diamond" />
                  </div>
                  <div className="srv__brand-shape">
                    <div className="srv__brand-shape-circle" />
                  </div>
                  <div className="srv__brand-shape">
                    <div className="srv__brand-shape-square" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Web Design */}
        <div className="srv__card srv__card--sm srv-anim" style={{ animationDelay: "0.4s" }}>
          <div className="srv__card-inner">
            <div className="srv__card-text">
              <h3 className="srv__card-title">Web Design</h3>
              <p className="srv__card-desc">
                Experiências web imersivas projetadas para converter visitantes em clientes fiéis.
              </p>
            </div>
            <div className="srv__card-visual srv__card-visual--web">
              <div className="srv__web-frame">
                <div className="srv__web-header">
                  <div className="srv__web-dot srv__web-dot--red" />
                  <div className="srv__web-dot srv__web-dot--yellow" />
                  <div className="srv__web-dot srv__web-dot--green" />
                  <div className="srv__web-url" />
                </div>
                <div className="srv__web-body">
                  <div className="srv__web-cols">
                    <div className="srv__web-col-left">
                      <div className="srv__web-block srv__web-block--lg" />
                      <div className="srv__web-block srv__web-block--md" />
                      <div className="srv__web-block srv__web-block--sm" />
                    </div>
                    <div className="srv__web-col-right">
                      <div className="srv__web-shimmer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: UI/UX Design */}
        <div className="srv__card srv__card--sm srv-anim" style={{ animationDelay: "0.5s" }}>
          <div className="srv__card-inner">
            <div className="srv__card-text">
              <h3 className="srv__card-title">UI/UX Design</h3>
              <p className="srv__card-desc">
                Definindo a linguagem visual e o tom ideal para sua marca digital.
              </p>
            </div>
            <div className="srv__card-visual srv__card-visual--uiux">
              <div className="srv__uiux-component">
                <div className="srv__uiux-top">
                  <span className="srv__uiux-label">Component</span>
                  <div className="srv__uiux-toggle">
                    <div className="srv__uiux-toggle-knob" />
                  </div>
                </div>
                <div className="srv__uiux-fields">
                  <div className="srv__uiux-row">
                    <div className="srv__uiux-bar" style={{ width: "4rem" }} />
                    <div className="srv__uiux-bar" style={{ width: "3rem" }} />
                  </div>
                  <div className="srv__uiux-buttons">
                    <button className="srv__uiux-btn srv__uiux-btn--confirm">Confirm</button>
                    <button className="srv__uiux-btn srv__uiux-btn--cancel">Cancel</button>
                  </div>
                </div>
                {/* Cursor */}
                <div className="srv__uiux-cursor">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.5 19.5L5.5 5.5L19.5 11.5L12.5 13.5L8.5 19.5Z" stroke="black" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Strategy */}
        <div className="srv__card srv__card--lg srv-anim" style={{ animationDelay: "0.6s" }}>
          <div className="srv__card-inner">
            <div className="srv__card-text" style={{ maxWidth: "24rem" }}>
              <h3 className="srv__card-title">Estratégia</h3>
              <p className="srv__card-desc">
                Insights baseados em dados para posicionar sua marca como líder de mercado.
              </p>
            </div>
            <div className="srv__card-visual srv__card-visual--strategy">
              {/* Metric Overlay */}
              <div className="srv__strategy-metric">
                <div className="srv__strategy-label">
                  <span>Growth Rate</span>
                  <div className="srv__strategy-pulse" />
                </div>
                <div className="srv__strategy-counter" />
              </div>
              {/* Grid lines */}
              <div className="srv__strategy-gridlines">
                <div /><div /><div /><div />
              </div>
              {/* Bars */}
              <div className="srv__strategy-bars">
                <div className="srv__strategy-bar-col">
                  <div className="srv__strategy-bar" style={{ height: "35%", animationDelay: "0.1s" }} />
                  <span className="srv__strategy-bar-label">Q1</span>
                </div>
                <div className="srv__strategy-bar-col">
                  <div className="srv__strategy-bar" style={{ height: "52%", animationDelay: "0.2s" }} />
                  <span className="srv__strategy-bar-label">Q2</span>
                </div>
                <div className="srv__strategy-bar-col">
                  <div className="srv__strategy-bar" style={{ height: "68%", animationDelay: "0.3s" }} />
                  <span className="srv__strategy-bar-label">Q3</span>
                </div>
                <div className="srv__strategy-bar-col">
                  <div className="srv__strategy-bar srv__strategy-bar--accent" style={{ height: "88%", animationDelay: "0.4s" }} />
                  <span className="srv__strategy-bar-label srv__strategy-bar-label--accent">Q4</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Content/Motion */}
        <div className="srv__card srv__card--lg srv-anim" style={{ animationDelay: "0.7s" }}>
          <div className="srv__card-inner">
            <div className="srv__card-text" style={{ maxWidth: "24rem" }}>
              <h3 className="srv__card-title">Desenvolvimento</h3>
              <p className="srv__card-desc">
                Código limpo e performático. De front-end interativo a back-end robusto.
              </p>
            </div>
            <div className="srv__card-visual srv__card-visual--dev">
              <div className="srv__dev-bg" />
              <div className="srv__dev-scene">
                <div className="srv__dev-3d">
                  <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Base Platform */}
                    <path d="M100 160 L30 125 L100 90 L170 125 Z" fill="#18181b" stroke="#27272a" strokeWidth="1" />
                    <path d="M30 125 V140 L100 175 L170 140 V125" fill="#18181b" fillOpacity="0.6" />
                    {/* Connection Beam */}
                    <path d="M100 90 V160" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" className="srv__dev-pulse" />
                    <circle cx="100" cy="125" r="30" stroke="#3f3f46" strokeWidth="1" opacity="0.3" transform="scale(1 0.5)" />
                    {/* Floating Cube */}
                    <g className="srv__dev-cube">
                      <animateTransform attributeName="transform" type="translate" values="0 0; 0 -8; 0 0" dur="4s" repeatCount="indefinite" />
                      <path d="M100 80 L60 60 L100 40 L140 60 Z" fill="var(--accent)" />
                      <path d="M60 60 V90 L100 110 V80 L60 60 Z" fill="rgba(34,211,238,0.7)" />
                      <path d="M140 60 V90 L100 110 V80 L140 60 Z" fill="rgba(34,211,238,0.5)" />
                      <path d="M100 40 L140 60 L100 80 L60 60 Z" fill="url(#cyan-gradient-3d)" opacity="0.6" />
                    </g>
                    {/* Floating Particles */}
                    <circle cx="150" cy="50" r="4" fill="var(--accent)" opacity="0.8">
                      <animate attributeName="cy" values="50;40;50" dur="5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0.4;0.8" dur="5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="50" cy="100" r="3" fill="rgba(34,211,238,0.7)" opacity="0.6">
                      <animate attributeName="cy" values="100;110;100" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="170" cy="140" r="2" fill="var(--accent)" opacity="0.5">
                      <animate attributeName="cy" values="140;135;140" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <defs>
                      <linearGradient id="cyan-gradient-3d" x1="100" y1="40" x2="100" y2="80" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#fff" stopOpacity="0.6" />
                        <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
