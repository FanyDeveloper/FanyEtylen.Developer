import { useEffect, useRef } from "react";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    const image = imageRef.current;

    if (!section || !text || !image) return;

    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();

        // O efeito só deve ser calculado enquanto o elemento estiver "sticky"
        // Isso acontece quando rect.top <= 0
        const maxScroll = rect.height - window.innerHeight;
        
        if (maxScroll <= 0) return;

        let progress = -rect.top / maxScroll;
        progress = Math.min(Math.max(progress, 0), 1); // Clamp entre 0 e 1

        // Aplica o scale no texto
        // Aumenta exponencialmente: Começa lento em 0.5, e quando passa da metade o crescimento explode
        // O valor limite 60 é o suficiente para as "letras" ficarem gigantes e revelar 100% a tela
        const textScale = 0.5 + Math.pow(progress, 2) * 60; 
        text.style.transform = `scale(${textScale})`;

        // A imagem no fundo também acompanha relaxando do zoom
        const imageScale = 1.3 - progress * 0.3;
        image.style.transform = `scale(${imageScale})`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Força uma execução inicial para ajustar na primeira carga
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="about" id="about" ref={sectionRef}>
      {/* Wrapper sticky para manter a seção fixa enquanto o scroll ocorre na altura total */}
      <div className="about__sticky-wrapper">
        <img
          ref={imageRef}
          src="/assets/images/about-photo.webp"
          alt="Sobre mim"
          className="about__image"
        />

        {/* Máscara de texto (fundo branco + texto preto com blend-mode screen) */}
        <div className="about__mask" aria-hidden="true">
          <div className="about__mask-text" ref={textRef}>
            <span className="about__mask-line">Mais do que design.</span>
            <span className="about__mask-line">Intenção em cada detalhe.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
