import { useEffect, useRef } from "react";

export default function ScrollLine() {
  const heroH = useRef(0);
  const projH = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const measureSections = () => {
      const hero = document.getElementById("inicio");
      const projects = document.getElementById("projects");
      
      cardsRef.current = Array.from(document.querySelectorAll(".projects__card")) as HTMLElement[];
      
      if (hero && projects) {
        const hh = hero.getBoundingClientRect().height;
        const ph = projects.getBoundingClientRect().height;
        
        heroH.current = hh;
        projH.current = ph;

        const EXTRA_LENGTH = 180; // Extend into the third section

        if (containerRef.current) {
          // Imperatively update container size/position
          containerRef.current.style.top = `-60px`;
          containerRef.current.style.height = `${ph + 60 + EXTRA_LENGTH}px`;
        }
      }
    };

    const update = () => {
      const hh = heroH.current;
      const ph = projH.current;
      
      if (hh === 0 || ph === 0) return;

      if (containerRef.current && lineRef.current && tipRef.current) {
        const scrollY = window.scrollY;
        const windowH = window.innerHeight;
        const EXTRA_LENGTH = 180;
        const totalH = hh + ph + EXTRA_LENGTH;
        
        const maxScroll = totalH - windowH;
        let progress = 0;
        
        if (cardsRef.current.length > 0) {
          const card = cardsRef.current[0];
          const cardRect = card.getBoundingClientRect();
          const absoluteCardTop = scrollY + cardRect.top;
          
          // Ponto de ativação: card 10% visível (surge um pouco antes)
          const startScroll = absoluteCardTop - windowH + (cardRect.height * 0.10);
          
          if (scrollY > startScroll) {
            const scrollRange = maxScroll - startScroll;
            progress = scrollRange > 0 ? (scrollY - startScroll) / scrollRange : 0;
          }
        } else {
          progress = maxScroll > 0 ? scrollY / maxScroll : 0;
        }

        progress = Math.max(0, Math.min(1, progress));
        
        // Imperative style updates for performance
        lineRef.current.style.transform = `scaleY(${progress})`;
        tipRef.current.style.opacity = progress > 0.02 ? "1" : "0";

        // Simple Card Interaction
        cardsRef.current.forEach((card) => {
          // Get card's absolute position relative to viewport
          const cardRect = card.getBoundingClientRect();
          
          // Get the line tip's absolute position relative to viewport
          const lineStartInViewport = hh - 60 - scrollY;
          const EXTRA_LENGTH = 180;
          const tipV = lineStartInViewport + progress * (ph + 60 + EXTRA_LENGTH);
          
          // Check if tip is within card's top and extended bottom bounds
          const GLOW_EXTENSION = 250; // Keeps the card lit as it scrolls out of view into the 3rd section
          if (tipV >= cardRect.top && tipV <= cardRect.bottom + GLOW_EXTENSION) {
              // Apply glow directly via inline style
              card.style.boxShadow = "0 0 20px rgba(255, 255, 255, 0.4), 0 0 40px rgba(255, 255, 255, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)";
              card.style.borderColor = "rgba(255, 255, 255, 0.8)";
          } else {
              // Remove inline style, falling back to CSS rules smoothly via CSS transition
              card.style.boxShadow = "";
              card.style.borderColor = "";
          }
        });
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measureSections);
    window.addEventListener("resize", update);
    
    measureSections();
    const timer = setTimeout(() => {
      measureSections();
      update();
    }, 100);
    
    // Observar mudanças de tamanho dinâmicas (ex: troca de slides do carrossel)
    const resizeObserver = new ResizeObserver(() => {
      measureSections();
      update();
    });
    
    const heroEl = document.getElementById("inicio");
    const projEl = document.getElementById("projects");
    if (heroEl) resizeObserver.observe(heroEl);
    if (projEl) resizeObserver.observe(projEl);
    
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measureSections);
      window.removeEventListener("resize", update);
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: -60,
        left: "50%",
        transform: "translateX(-50%)",
        width: "2px",
        height: `${projH.current + 60 + 180}px`,
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      <div
        ref={lineRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.65)",
          boxShadow: "0 0 10px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.15)",
          transformOrigin: "top",
          transform: "scaleY(0)",
          transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div 
          ref={tipRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100px",
            background: "linear-gradient(to top, rgba(255, 255, 255, 0.98), transparent)",
            boxShadow: "0 0 25px 3px rgba(255, 255, 255, 0.9), 0 0 45px 5px rgba(255, 255, 255, 0.4)",
            opacity: 0,
            transition: "opacity 0.3s ease",
          }} 
        />
      </div>
    </div>
  );
}
