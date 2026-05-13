import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type TouchEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import ScrollLine from "./ScrollLine";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
interface Project {
  tag: string;
  title: string;
  icons: string[];
  problem: string;
  solution: string;
  result: string;
  before: string;
  after: string;
  image: string | null;
}

const PROJECTS: Project[] = [
  {
    tag: "Projeto 01",
    title: "Landing Page para Veículo Elétrico (Mini Electric)",
    icons: ["⚡", "🚗", "💡"],
    problem:
      "A comunicação do produto era pouco clara e não transmitia inovação. As informações estavam dispersas e não havia uma jornada definida para o usuário.",
    solution:
      "Criei uma landing page com foco em clareza e impacto visual, organizando as informações em blocos estratégicos. Destaquei os diferenciais do produto com elementos visuais e micro interações.",
    result:
      "Melhora na percepção de inovação da marca e uma experiência mais objetiva, facilitando o entendimento do produto e incentivando a ação.",
    before: "Conteúdo desorganizado e pouca conexão com o usuário",
    after: "Apresentação clara, moderna e orientada à tomada de decisão",
    image: "/assets/images/project-02-mini.jpg",
  },
  {
    tag: "Projeto 02",
    title: "E-commerce de Acessórios para Motociclistas",
    icons: ["🛒", "🏍️", "🎨"],
    problem:
      "O site apresentava um visual genérico e pouco envolvente, sem destacar os produtos ou criar conexão com o público. A navegação não incentivava a exploração nem a decisão de compra.",
    solution:
      "Desenvolvi uma experiência visual imersiva, com foco em identidade forte, uso estratégico de contraste e organização clara das categorias. Interações sutis foram aplicadas para guiar o usuário e valorizar os produtos.",
    result:
      "Um site mais envolvente e profissional, que valoriza os produtos e aumenta o interesse do usuário, elevando o potencial de conversão.",
    before: "Visual comum, pouca hierarquia e baixa atratividade",
    after: "Interface marcante, navegação fluida e foco total na experiência",
    image: "/assets/images/project-01-moto.jpg",
  },
  {
    tag: "Projeto 03",
    title: "Landing Page para Produto Premium (Sorvete Magnum)",
    icons: ["🍦", "✨", "🖤"],
    problem:
      "O site não transmitia o posicionamento premium do produto. Faltava apelo visual e uma experiência que despertasse desejo no usuário.",
    solution:
      "Desenvolvi uma interface minimalista e sofisticada, com foco em cores, tipografia e composição visual. O design foi pensado para destacar o produto e criar uma experiência sensorial.",
    result:
      "Fortalecimento da percepção de marca premium e aumento do engajamento, tornando o produto mais desejável e valorizado.",
    before: "Comunicação comum, sem diferenciação emocional",
    after: "Visual elegante, foco no produto e experiência envolvente",
    image: "/assets/images/project-03-magnum.jpg",
  },
];

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const FADE = `animationIn 0.75s ${EASE} both`;

/**
 * Stagger-animate all .iv elements inside a container.
 * Reads the delay from data-iv-delay attribute (ms).
 * Removes .is-visible first so re-animation works on slide change.
 */
function triggerSlideAnimations(container: HTMLElement) {
  // Select all .iv elements that have a data-iv-delay (direct or nested)
  const ivEls = Array.from(
    container.querySelectorAll<HTMLElement>(".iv[data-iv-delay]")
  );

  if (!ivEls.length) return;

  // Reset all
  ivEls.forEach((el) => el.classList.remove("is-visible"));

  // Schedule each one according to its own delay
  ivEls.forEach((el) => {
    const delay = parseInt(el.dataset.ivDelay ?? "0", 10);
    setTimeout(() => el.classList.add("is-visible"), delay);
  });
}

/* ------------------------------------------------------------------ */
/*  Slide Component                                                    */
/* ------------------------------------------------------------------ */
function ProjectSlide({
  project,
  isActive,
  direction,
  cardInView,
}: {
  project: Project;
  isActive: boolean;
  direction: "left" | "right";
  cardInView: boolean;
}) {
  const slideRef = useRef<HTMLDivElement>(null);

  const translateX = isActive
    ? "translateX(0)"
    : direction === "right"
      ? "translateX(60px)"
      : "translateX(-60px)";

  /* When this slide becomes active AND the card is already visible,
     trigger the element-by-element entrance. */
  useEffect(() => {
    if (!isActive || !cardInView || !slideRef.current) return;
    triggerSlideAnimations(slideRef.current);
  }, [isActive, cardInView]);

  /* Delays for the sequence:
     0   — image
     100 — tag
     180 + 70*n — title words (split below)
     computed dynamically for blocks/badges */
  const TITLE_BASE = 180;
  const TITLE_STEP = 70;
  const titleWords = project.title.split(" ");
  const afterTitle = TITLE_BASE + titleWords.length * TITLE_STEP;
  const D_PROBLEM = afterTitle + 80;
  const D_SOLUTION = D_PROBLEM + 130;
  const D_RESULT = D_SOLUTION + 130;
  const D_BADGES = D_RESULT + 130;

  return (
    <div
      ref={slideRef}
      className="projects__slide"
      style={{
        opacity: isActive ? 1 : 0,
        transform: translateX,
        pointerEvents: isActive ? "auto" : "none",
        transition:
          "opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        position: isActive ? "relative" : "absolute",
        top: 0,
        left: 0,
        width: "100%",
      }}
    >
      <div className="projects__card-inner">
        {/* ---- Left: Image ---- */}
        <div className="projects__image-col">
          {/* 1. Image — delay 0ms */}
          <div
            className="projects__image-wrapper iv"
            data-iv-delay="0"
            style={{ animation: `${FADE}` }}
          >
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="projects__image"
              />
            ) : (
              <div className="projects__image-placeholder">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ opacity: 0.25 }}
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* ---- Right: Text ---- */}
        <div className="projects__text-col">
          {/* 2. Tag — delay 100ms */}
          <span
            className="projects__tag iv"
            data-iv-delay="100"
            style={{ animation: `${FADE}` }}
          >
            {project.tag}
          </span>

          {/* 3. Title — word by word */}
          <h3 className="projects__title" aria-label={project.title}>
            {titleWords.map((word, i) => {
              const delay = TITLE_BASE + i * TITLE_STEP;
              return (
                <span key={i} className="word-mask">
                  <span
                    className="iv"
                    data-iv-delay={delay}
                    style={{
                      display: "inline-block",
                      animation: `wordReveal 0.75s ${EASE} both`,
                    }}
                  >
                    {word}
                    {i < titleWords.length - 1 ? "\u00A0" : ""}
                  </span>
                </span>
              );
            })}
          </h3>

          {/* 4. Problem block */}
          <div
            className="projects__detail iv"
            data-iv-delay={D_PROBLEM}
            style={{ animation: `${FADE}` }}
          >
            <div className="projects__detail-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>Problema</span>
            </div>
            <p>{project.problem}</p>
          </div>

          {/* 5. Solution block */}
          <div
            className="projects__detail iv"
            data-iv-delay={D_SOLUTION}
            style={{ animation: `${FADE}` }}
          >
            <div className="projects__detail-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span>Solução</span>
            </div>
            <p>{project.solution}</p>
          </div>

          {/* 6. Result block */}
          <div
            className="projects__detail iv"
            data-iv-delay={D_RESULT}
            style={{ animation: `${FADE}` }}
          >
            <div className="projects__detail-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Resultado</span>
            </div>
            <p>{project.result}</p>
          </div>

          {/* 7. Before / After badges */}
          <div
            className="projects__badges iv"
            data-iv-delay={D_BADGES}
            style={{ animation: `${FADE}` }}
          >
            <span className="projects__badge projects__badge--before">
              <span className="projects__badge-label">Antes</span>
              {project.before}
            </span>
            <span className="projects__badge projects__badge--after">
              <span className="projects__badge-label">Depois</span>
              {project.after}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function Projects() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [cardInView, setCardInView] = useState(false);

  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const isSwiping = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardPerspectiveRef = useRef<HTMLDivElement>(null);
  const isMobile = useRef(false);

  /* Detect mobile once on mount */
  useEffect(() => {
    isMobile.current = window.matchMedia("(max-width: 768px)").matches;
  }, []);

  const total = PROJECTS.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir === 1 ? "right" : "left");
      setActive((prev) => (prev + dir + total) % total);
      /* pause float during slide transition */
      setIsTransitioning(true);
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
      transitionTimer.current = setTimeout(() => setIsTransitioning(false), 300);
    },
    [total],
  );

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go]);

  /* Touch handlers */
  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
    touchDeltaX.current = 0;
    isSwiping.current = true;
  };
  const onTouchMove = (e: TouchEvent) => {
    if (!isSwiping.current) return;
    touchDeltaX.current = touchStartX.current - e.changedTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    if (Math.abs(touchDeltaX.current) > 50) {
      go(touchDeltaX.current > 0 ? 1 : -1);
    }
  };

  /* Mouse-reactive 3D tilt */
  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (isMobile.current || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / rect.height) * -6;
    const rotateY = ((e.clientX - centerX) / rect.width) * 6;
    cardRef.current.style.transform =
      `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    const glowX = ((e.clientX - rect.left) / rect.width) * 100;
    const glowY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPos({ x: glowX, y: glowY });
  };
  const handleMouseEnter = () => {
    if (isMobile.current) return;
    setIsHovered(true);
    if (cardRef.current) cardRef.current.style.transition = "transform 0.15s ease-out";
  };
  const handleMouseLeave = () => {
    if (isMobile.current) return;
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.6s ease, border-color 0.4s ease, box-shadow 0.4s ease";
      cardRef.current.style.transform = "rotateX(0deg) rotateY(-3deg) translateY(0px)";
    }
  };

  /* Mobile: scroll-entrance animation */
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!isMobile.current || !sectionRef.current) return;
    const el = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("projects--visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Card viewport detection — gates slide element animations */
  useEffect(() => {
    const el = cardPerspectiveRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const animPlayState = isTransitioning || isHovered ? "paused" : "running";

  return (
    <section
      ref={sectionRef}
      className="projects"
      id="projects"
      style={{ position: "relative" }}
    >
      {/* Extension of the vertical lines from Hero */}
      <div
        className="projects__lines-extension"
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

      {/* Dark fade from above */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "120px",
          background: "linear-gradient(to bottom, #020202 0%, transparent 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Section Title */}
      <div className="projects__title-wrapper">
        <h2 className="projects__section-title">
          Portfólio<br />Desenvolvimento
        </h2>
      </div>

      <ScrollLine />

      <div className="projects__container" style={{ position: "relative", zIndex: 60 }}>
        {/* Card perspective wrapper — tracked by IO */}
        <div className="projects__card-perspective" ref={cardPerspectiveRef}>
          {/* Nav arrows (outside card so they don't get clipped) */}
          <button
            className="projects__arrow projects__arrow--left"
            onClick={() => go(-1)}
            aria-label="Previous project"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            className="projects__arrow projects__arrow--right"
            onClick={() => go(1)}
            aria-label="Next project"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Carousel card */}
          <div
            ref={cardRef}
            className="projects__card"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ animationPlayState: animPlayState }}
          >
            {/* Mouse glow overlay */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "inherit",
                pointerEvents: "none",
                zIndex: 0,
                background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(180, 100, 220, 0.12) 0%, transparent 60%)`,
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            />

            {/* Slides */}
            <div className="projects__slides">
              {PROJECTS.map((project, i) => (
                <ProjectSlide
                  key={i}
                  project={project}
                  isActive={i === active}
                  direction={direction}
                  cardInView={cardInView}
                />
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="projects__dots">
        {PROJECTS.map((_, i) => (
          <button
            key={i}
            className={`projects__dot${i === active ? " projects__dot--active" : ""}`}
            onClick={() => {
              setDirection(i > active ? "right" : "left");
              setActive(i);
            }}
            aria-label={`Go to project ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
