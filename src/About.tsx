import { useEffect, useRef } from "react";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    const image = imageRef.current;
    const mask = maskRef.current;
    const bio = bioRef.current;

    if (!section || !text || !image || !mask || !bio) return;

    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const maxScroll = rect.height - window.innerHeight;
        
        if (maxScroll <= 0) return;

        let progress = -rect.top / maxScroll;
        progress = Math.min(Math.max(progress, 0), 1); // Clamp entre 0 e 1

        // Aplica o scale no texto
        const textScale = 0.5 + Math.pow(progress, 2) * 60; 
        text.style.transform = `scale(${textScale})`;

        // Efeito sutil na imagem: começa com um leve zoom-in
        const imageScale = 1.3 - progress * 0.3;
        image.style.transform = `scale(${imageScale})`;

        // Na fase final (últimos 25% do scroll)
        let endProgress = (progress - 0.75) / 0.25;
        endProgress = Math.min(Math.max(endProgress, 0), 1);

        // A máscara desaparece para impedir que a tela fique toda "branca" e revelar a foto
        mask.style.opacity = (1 - endProgress).toString();

        // A biografia aparece suavemente
        bio.style.opacity = endProgress.toString();
        bio.style.transform = `translateY(${(1 - endProgress) * 30}px)`;
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
      <div className="about__sticky-wrapper">
        <img
          ref={imageRef}
          src="/assets/images/about-photo.webp"
          alt="Sobre mim"
          className="about__image"
        />

        {/* Cobertura escura na imagem durante a revelação gradual */}
        <div className="about__image-overlay" />

        {/* Máscara de texto (fundo branco + texto preto com blend-mode screen) */}
        <div className="about__mask" aria-hidden="true" ref={maskRef}>
          <div className="about__mask-text" ref={textRef}>
            <span className="about__mask-line">Mais do que design.</span>
            <span className="about__mask-line">Intenção em cada detalhe.</span>
          </div>
        </div>

        {/* Texto da biografia revelado no final */}
        <div className="about__bio" ref={bioRef}>
          <p>
            Minha trajetória no desenvolvimento web começou pela base: lógica, estrutura e código. 
            Foi nesse processo que desenvolvi a capacidade de transformar ideias em produtos digitais funcionais, 
            sólidos e bem construídos.
          </p>
          <p>
            Com o tempo, percebi que um produto eficiente vai além do funcionamento. O design deixou de ser apenas 
            estética e passou a ser parte essencial da estratégia. Aprofundei meus estudos em UI/UX, direção visual 
            e experiência do usuário, elevando a forma como construo interfaces.
          </p>
        </div>
      </div>
    </section>
  );
}
