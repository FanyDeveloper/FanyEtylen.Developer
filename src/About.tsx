import { useEffect, useRef } from "react";

const WordReveal = ({ text }: { text: string }) => {
  const words = text.split(" ");
  return (
    <p className="word-reveal-p">
      {words.map((word, i) => (
        <span key={i} className="word-reveal-span" style={{ opacity: 0.15 }}>
          {word}{" "}
        </span>
      ))}
    </p>
  );
};

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("about--visible");

          // Trigger stagger animations for children
          if (contentRef.current) {
            const ivEls = Array.from(contentRef.current.querySelectorAll(".iv"));
            ivEls.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("is-visible");
              }, index * 200); // 200ms stagger
            });
          }

          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    const handleScroll = () => {
      if (!bodyRef.current || !sectionRef.current) return;
      const paragraphs = bodyRef.current.querySelectorAll("p.word-reveal-p");
      const windowHeight = window.innerHeight;
      const rect = sectionRef.current.getBoundingClientRect();
      const totalScrollable = sectionRef.current.offsetHeight - windowHeight;
      if (totalScrollable <= 0) return;
      const scrolled = -rect.top;
      let progress = scrolled / totalScrollable;
      progress = Math.max(0, Math.min(1, progress));
      paragraphs.forEach((p, pIndex) => {
        const spans = p.querySelectorAll("span.word-reveal-span");
        const total = spans.length;
        const startProgress = pIndex === 0 ? 0 : 0.5;
        const endProgress = pIndex === 0 ? 0.45 : 0.95;
        let pProgress = (progress - startProgress) / (endProgress - startProgress);
        pProgress = Math.max(0, Math.min(1, pProgress));
        spans.forEach((span, i) => {
          const wordStart = i / total;
          const wordEnd = (i + 1) / total;
          let wordProgress = (pProgress - wordStart) / (wordEnd - wordStart);
          wordProgress = Math.max(0, Math.min(1, wordProgress));
          const opacity = 0.15 + 0.85 * wordProgress;
          (span as HTMLElement).style.opacity = opacity.toString();
        });
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="about" id="about">
      {/* Extension of the vertical lines */}
      <div
        className="about__lines-extension"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "1rem",
          right: "1rem",
          margin: "0 auto",
          maxWidth: "var(--container-max)",
          borderLeft: "1px solid var(--border-subtle)",
          borderRight: "1px solid var(--border-subtle)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Decorative Grid Pattern Background */}
      <div className="about__bg-grid" aria-hidden="true" />

      {/* Abstract Glow */}
      <div className="about__bg-glow" aria-hidden="true" />

      <div className="about__container" ref={contentRef}>

        <div className="about__content">
          {/* Main Heading Text */}
          <h2 className="about__title iv">
            Mais do que design. <br className="about__br" />
            <span className="about__highlight">Intenção em cada detalhe.</span>
          </h2>

          {/* Body Paragraphs */}
          <div className="about__body iv" ref={bodyRef}>
            <WordReveal text="Minha trajetória no desenvolvimento web começou pela base: lógica, estrutura e código. Foi nesse processo que desenvolvi a capacidade de transformar ideias em produtos digitais funcionais, sólidos e bem construídos." />
            <WordReveal text="Com o tempo, percebi que um produto eficiente vai além do funcionamento. O design deixou de ser apenas estética e passou a ser parte essencial da estratégia. Aprofundei meus estudos em UI/UX, direção visual e experiência do usuário, elevando a forma como construo interfaces." />
          </div>
        </div>

        {/* Absolute Background Photo */}
        <div className="about__photo-bg iv">
          <img
            src="/assets/images/about-photo.webp"
            alt="Sobre Mim"
          />
        </div>

      </div>

      {/* Bottom fade transition */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "150px",
          background: "linear-gradient(to top, #020202 0%, transparent 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
