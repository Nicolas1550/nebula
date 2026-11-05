// Catálogo único de NEBULA V12: 22 trabajos. Los 14 originales y sus enlaces se conservaron.
// Las portadas están en public/portfolio/thumbs y se usan en museo 3D, cards y NOVA.
export type ProjectCategory = 'fullstack' | 'creative' | 'product' | 'leadership' | 'web';
export type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  summary: string;
  category: ProjectCategory;
  technologies: string[];
  image: string;
  links: { label: string; href: string }[];
  featured: boolean;
  demoNotice?: string;
};

export const portfolioProjects: PortfolioProject[] = [
  {
    "id": "p21",
    "title": "SENTINEL",
    "description": "Plataforma Full Stack de telemetría y monitoreo de seguridad. Permite registrar aplicaciones, emitir claves de integración y recibir eventos para mostrar actividad, incidentes y señales sospechosas. Incluye detección configurable de accesos fallidos y correlación de incidentes, con almacenamiento en PostgreSQL (Neon) e integración con ATLAS.",
    "summary": "Monitoreo de eventos de seguridad, incidentes y aplicaciones conectadas",
    "category": "fullstack",
    "technologies": [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Neon",
      "API Keys",
      "Security Events"
    ],
    "image": "/portfolio/thumbs/p21.webp",
    "links": [
      {
        "label": "VER DEMO",
        "href": "https://sentinel-sooty-two.vercel.app/"
      },
      {
        "label": "GITHUB",
        "href": "https://github.com/Nicolas1550/sentinel"
      }
    ],
    "featured": true
  },
  {
    "id": "p22",
    "title": "QUANTUM — Trading Terminal",
    "description": "Terminal financiera Full Stack para investigación y operaciones simuladas (paper trading). Incluye gráficos interactivos, indicadores técnicos, watchlists, búsqueda de activos, análisis de carteras y gestión de posiciones demo. Integra datos de proveedores externos según disponibilidad, autenticación y persistencia PostgreSQL (Neon). No ejecuta operaciones bursátiles reales.",
    "summary": "Terminal de análisis de mercados con gráficos, indicadores y paper trading",
    "category": "fullstack",
    "technologies": [
      "Next.js",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Neon",
      "Market APIs"
    ],
    "image": "/portfolio/thumbs/p22.webp",
    "links": [
      {
        "label": "VER DEMO",
        "href": "https://trading-indol-tau.vercel.app/"
      },
      {
        "label": "GITHUB",
        "href": "https://github.com/Nicolas1550/trading"
      }
    ],
    "featured": true
  },
  {
    "id": "p15",
    "title": "ATLAS",
    "description": "Plataforma Full Stack para explorar actividad sísmica mundial. Integra información de USGS, visualización geoespacial sobre un globo 3D y herramientas de consulta histórica. Incorpora autenticación, registros en PostgreSQL (Neon), alertas y una integración de eventos de seguridad con SENTINEL.",
    "summary": "Inteligencia sísmica global con globo 3D, datos USGS y persistencia",
    "category": "fullstack",
    "technologies": [
      "Next.js",
      "TypeScript",
      "React",
      "Three.js",
      "PostgreSQL",
      "USGS API"
    ],
    "image": "/portfolio/thumbs/p15.webp",
    "links": [
      {
        "label": "VER DEMO",
        "href": "https://atlas-gamma-blue.vercel.app/"
      },
      {
        "label": "GITHUB",
        "href": "https://github.com/Nicolas1550/atlas"
      }
    ],
    "featured": true
  },
  {
    "id": "p20",
    "title": "FRAME Studio",
    "description": "Editor audiovisual experimental de enfoque local-first, con edición multipista de video, texto y audio, transiciones, keyframes, subtítulos SRT, presets para redes, comentarios de revisión y proyectos guardados en IndexedDB. La demo pública en Vercel funciona como aplicación estática: la edición ocurre en el navegador, sin colaboración remota ni renderizado en servidor.",
    "summary": "Editor audiovisual en navegador con timeline multipista, efectos y exportación",
    "category": "fullstack",
    "technologies": [
      "JavaScript",
      "Node.js",
      "Canvas API",
      "MediaRecorder",
      "IndexedDB"
    ],
    "image": "/portfolio/thumbs/p20.webp",
    "links": [
      {
        "label": "VER DEMO",
        "href": "https://frame-sandy-nine.vercel.app/"
      },
      {
        "label": "GITHUB",
        "href": "https://github.com/Nicolas1550/frame"
      }
    ],
    "featured": true
  },
  {
    "id": "p18",
    "title": "NEBULA",
    "description": "Universo interactivo desarrollado con Next.js y Three.js. ORIGIN presenta proyectos mediante un museo espacial; NEXUS ofrece experimentos visuales de plasma, gravedad y ondas; INFERNO suma una experiencia jugable. La navegación incluye transiciones cinematográficas y un recorrido pensado para reclutadores.",
    "summary": "Explorá tres mundos 3D con museo, laboratorio y juego interactivo",
    "category": "creative",
    "technologies": [
      "Next.js",
      "React",
      "Three.js",
      "React Three Fiber",
      "WebGL"
    ],
    "image": "/portfolio/thumbs/p18.webp",
    "links": [
      {
        "label": "VER DEMO",
        "href": "https://nebula-chi-two.vercel.app/"
      },
      {
        "label": "GITHUB",
        "href": "https://github.com/Nicolas1550/nebula"
      }
    ],
    "featured": true
  },
  {
    "id": "p17",
    "title": "EON — The Living City",
    "description": "Experiencia Full Stack de exploración urbana con Next.js, Three.js, vehículos, peatones, árboles y escenarios 3D. Incluye funcionalidades de autenticación y gestión de ciudades mediante APIs y persistencia PostgreSQL. Proyecto experimental centrado en combinar simulación visual y arquitectura web.",
    "summary": "Una ciudad 3D viva con tráfico, vegetación y experiencias interactivas",
    "category": "creative",
    "technologies": [
      "Next.js",
      "React",
      "Three.js",
      "TypeScript",
      "PostgreSQL"
    ],
    "image": "/portfolio/thumbs/p17.webp",
    "links": [
      {
        "label": "VER DEMO",
        "href": "https://eon-three-henna.vercel.app/"
      },
      {
        "label": "GITHUB",
        "href": "https://github.com/Nicolas1550/eon"
      }
    ],
    "featured": true
  },
  {
    "id": "p16",
    "title": "SYNAPSE",
    "description": "Experiencia interactiva con redes neuronales, nodos manipulables y animaciones 3D. Incluye demo pública y repositorio del proyecto.",
    "summary": "Interfaz neuronal 3D interactiva con nodos y animaciones",
    "category": "creative",
    "technologies": [
      "Next.js",
      "React",
      "Three.js",
      "WebGL"
    ],
    "image": "/portfolio/thumbs/p16.webp",
    "links": [
      {
        "label": "VER DEMO",
        "href": "https://synapse-le8l.vercel.app/"
      },
      {
        "label": "GITHUB",
        "href": "https://github.com/Nicolas1550/synapse"
      }
    ],
    "featured": true
  },
  {
    "id": "p19",
    "title": "SPEED Unlimited",
    "description": "Concepto creativo independiente de una landing de bebida energética, con animaciones reactivas al desplazamiento, narrativa de producto, efectos de condensación y composición 2.5D/3D. Experimento visual no oficial, sin afiliación con la marca representada.",
    "summary": "Landing de producto con narrativa visual, scroll y animaciones 3D",
    "category": "creative",
    "technologies": [
      "Next.js",
      "React",
      "GSAP",
      "Three.js",
      "Animaciones"
    ],
    "image": "/portfolio/thumbs/p19.webp",
    "links": [
      {
        "label": "VER DEMO",
        "href": "https://speedv2-7rrl.vercel.app/"
      },
      {
        "label": "GITHUB",
        "href": "https://github.com/Nicolas1550/speedv2"
      }
    ],
    "featured": true
  },
  {
    "id": "p01",
    "title": "Peluquería The Best - Plataforma E-commerce",
    "description": "Plataforma Full Stack para la gestión de salones de belleza con un sistema de e-commerce integrado. Incluye pagos con Mercado Pago, administración de empleados y ventas en tiempo real con Websockets.",
    "summary": "Plataforma Full Stack para la gestión de salones de belleza con un sistema de e-commerce integrado.",
    "category": "fullstack",
    "technologies": [
      "Next.js",
      "React",
      "Redux Toolkit",
      "MySQL",
      "Tailwind CSS",
      "Mercado Pago"
    ],
    "image": "/portfolio/thumbs/p01.webp",
    "links": [
      {
        "label": "VER PROYECTO",
        "href": "https://peluqueria-the-best.vercel.app/"
      },
      {
        "label": "FRONTEND",
        "href": "https://github.com/Nicolas1550/PeluqueriaTheBest"
      },
      {
        "label": "BACKEND",
        "href": "https://github.com/Nicolas1550/backendIAEcommerce"
      },
      {
        "label": "VIDEO DEMO",
        "href": "https://www.linkedin.com/feed/update/urn:li:activity:7238672562367414273/"
      }
    ],
    "demoNotice": "La versión pública funciona como presentación del proyecto. Los productos, servicios y funciones que dependen del backend pueden no estar disponibles porque mantener el servidor activo tiene un costo. Mirá la video demo para conocer el funcionamiento completo de la plataforma.",
    "featured": true
  },
  {
    "id": "p02",
    "title": "MakeUp - Plataforma de Belleza",
    "description": "Plataforma full stack para el sector belleza con login seguro, panel administrativo y mensajería automatizada. Diseño responsive con Tailwind CSS.",
    "summary": "Plataforma full stack para el sector belleza con login seguro, panel administrativo y mensajería automatizada.",
    "category": "fullstack",
    "technologies": [
      "Next.js",
      "Node.js",
      "Express.js",
      "MySQL",
      "React",
      "Tailwind CSS"
    ],
    "image": "/portfolio/thumbs/p02.webp",
    "links": [
      {
        "label": "VER PROYECTO",
        "href": "https://make-up2-0.vercel.app/"
      },
      {
        "label": "FRONTEND",
        "href": "https://github.com/Nicolas1550/makeUp2.0"
      },
      {
        "label": "BACKEND",
        "href": "https://github.com/Nicolas1550/makeUpBackend2.0"
      },
      {
        "label": "VIDEO DEMO",
        "href": "https://www.linkedin.com/feed/update/urn:li:activity:7245273655893520386/"
      }
    ],
    "demoNotice": "La versión pública funciona como presentación del proyecto. Los productos, servicios y funciones que dependen del backend pueden no estar disponibles porque mantener el servidor activo tiene un costo. Mirá la video demo para conocer el funcionamiento completo de la plataforma.",
    "featured": true
  },
  {
    "id": "p03",
    "title": "ChicksX - Plataforma Digital",
    "description": "Participación como E2E Engineer y Product Engineer en una plataforma de alto tráfico. Diseñé y mantuve pruebas automatizadas para flujos web críticos (compra/venta, medios de pago), reduciendo regresiones y mejorando la estabilidad de los releases. Además, implementé nuevas páginas, cards, carruseles y skeletons, ajustando la UI sobre React/Aurelia para ofrecer una experiencia más fluida y consistente.",
    "summary": "Participación como E2E Engineer y Product Engineer en una plataforma de alto tráfico.",
    "category": "product",
    "technologies": [
      "Cypress (E2E)",
      "React/Aurelia (según módulo)",
      ".NET APIs"
    ],
    "image": "/portfolio/thumbs/p03.webp",
    "links": [
      {
        "label": "VER PROYECTO",
        "href": "https://chicksx.com/"
      }
    ],
    "featured": true
  },
  {
    "id": "p04",
    "title": "ChicksGold - Sitio y Secciones",
    "description": "Rol de Product Engineer enfocado en la evolución del sitio principal y sus secciones clave. Implementé nuevos sitios y páginas internas, componentes reutilizables (cards, secciones informativas) y trabajé en el footer, incluyendo su skeleton y la lógica que consume recursos externos para mostrar información dinámica. También colaboré en mejoras de performance y UX para optimizar tiempos de carga y percepción de calidad.",
    "summary": "Rol de Product Engineer enfocado en la evolución del sitio principal y sus secciones clave.",
    "category": "product",
    "technologies": [
      "React",
      "Next.js",
      "SEO/Performance",
      "Componentización"
    ],
    "image": "/portfolio/thumbs/p04.webp",
    "links": [
      {
        "label": "VER PROYECTO",
        "href": "https://chicksgold.com/"
      }
    ],
    "featured": false
  },
  {
    "id": "p05",
    "title": "Ø UnderTango Club – Plataforma & Comunidad",
    "description": "Portal principal de Ø UnderTango Club donde lidero la parte tecnológica desde el rol de Project Manager, QA y Tech Lead. Definí objetivos de producto, stack tecnológico y criterios de calidad, organizando dailies con los desarrolladores, priorizando tareas y alineando el trabajo al presupuesto y a las metas de la empresa. Superviso entregas, experiencia de usuario y calidad del producto de punta a punta.",
    "summary": "Portal principal de Ø UnderTango Club donde lidero la parte tecnológica desde el rol de Project Manager, QA y Tech Lead.",
    "category": "leadership",
    "technologies": [
      "Project Management",
      "Tech Lead",
      "QA",
      "Roadmap de producto"
    ],
    "image": "/portfolio/thumbs/p05.webp",
    "links": [
      {
        "label": "VER PROYECTO",
        "href": "https://undertangoclub.com"
      }
    ],
    "featured": false
  },
  {
    "id": "p06",
    "title": "FDI UnderTango – Portal Institucional",
    "description": "Sitio institucional de FDI UnderTango donde trabajo como QA y Project Manager, asegurando que la comunicación y la imagen digital estén alineadas con la estrategia de la organización. Coordino al equipo de desarrollo, defino prioridades, realizo seguimiento diario de tareas y verifico calidad funcional y visual antes de cada entrega, cuidando alcances, tiempos y presupuesto.",
    "summary": "Sitio institucional de FDI UnderTango donde trabajo como QA y Project Manager, asegurando que la comunicación y la imagen digital estén alineadas con la estrategia de la organización.",
    "category": "leadership",
    "technologies": [
      "Project Management",
      "Definición de stack",
      "QA",
      "Coordinación técnica"
    ],
    "image": "/portfolio/thumbs/p06.webp",
    "links": [
      {
        "label": "VER PROYECTO",
        "href": "https://fdiundertango.com"
      }
    ],
    "featured": false
  },
  {
    "id": "p07",
    "title": "La BiciPosta - Plataforma para Ciclistas",
    "description": "Landing page moderna para una empresa de ciclismo, diseñada para transmitir marca, dinamismo y claridad en la oferta de servicios. Implementé una UI con animaciones fluidas, secciones destacadas y carruseles, cuidando la estructura responsive y la experiencia en dispositivos móviles. El foco estuvo en presentación visual, navegabilidad y preparación para futuras funcionalidades.",
    "summary": "Landing page moderna para una empresa de ciclismo, diseñada para transmitir marca, dinamismo y claridad en la oferta de servicios.",
    "category": "web",
    "technologies": [
      "Next.js",
      "React",
      "Framer Motion",
      "Swiper.js"
    ],
    "image": "/portfolio/thumbs/p07.webp",
    "links": [
      {
        "label": "VER PROYECTO",
        "href": "https://la-bici-posta.vercel.app/"
      },
      {
        "label": "GITHUB",
        "href": "https://github.com/Nicolas1550/LaBiciPosta"
      }
    ],
    "featured": true
  },
  {
    "id": "p08",
    "title": "CEA - Plataforma Educativa",
    "description": "Landing/plataforma educativa orientada a la gestión de contenido y acceso de estudiantes. Implementé autenticación, manejo de estados y una UI adaptable, cuidando la experiencia en distintos dispositivos. El objetivo fue ofrecer una base sólida para escalar funcionalidades educativas y comunicación institucional.",
    "summary": "Landing/plataforma educativa orientada a la gestión de contenido y acceso de estudiantes.",
    "category": "web",
    "technologies": [
      "React Native",
      "Firebase",
      "Redux"
    ],
    "image": "/portfolio/thumbs/p08.webp",
    "links": [
      {
        "label": "VER PROYECTO",
        "href": "https://cea.vercel.app/"
      }
    ],
    "featured": true
  },
  {
    "id": "p09",
    "title": "Fundamentals – CEO de tu Vida",
    "description": "Rol de Product Engineer en una landing orientada a la captación de alumnos para un programa de transformación personal. Ordené la estructura de contenido, jerarquía visual y llamados a la acción para mejorar la conversión, cuidando tiempos de carga y SEO técnico. La página está pensada para explicar con claridad la propuesta y facilitar el contacto.",
    "summary": "Rol de Product Engineer en una landing orientada a la captación de alumnos para un programa de transformación personal.",
    "category": "product",
    "technologies": [
      "Next.js/React",
      "Product Engineering",
      "Optimización de contenido",
      "SEO"
    ],
    "image": "/portfolio/thumbs/p09.webp",
    "links": [
      {
        "label": "VER PROYECTO",
        "href": "https://www.ceodetuvida.com/fundamentals"
      }
    ],
    "featured": false
  },
  {
    "id": "p10",
    "title": "CEO Training Mentorship",
    "description": "Landing dinámica para un programa de mentoría premium, donde también actué como Product Engineer. Trabajé la estructura de secciones, el storytelling y los elementos visuales para transmitir autoridad y confianza, optimizando la velocidad percibida y la preparación para SEO. El objetivo fue combinar diseño, claridad y performance en una sola experiencia.",
    "summary": "Landing dinámica para un programa de mentoría premium, donde también actué como Product Engineer.",
    "category": "product",
    "technologies": [
      "Next.js",
      "Product Engineering",
      "Render prefetch",
      "SEO"
    ],
    "image": "/portfolio/thumbs/p10.webp",
    "links": [
      {
        "label": "VER PROYECTO",
        "href": "https://ceotrainingmentorship.vercel.app/"
      }
    ],
    "featured": false
  },
  {
    "id": "p11",
    "title": "Canal del Congreso – Portal Oficial del Congreso de México",
    "description": "Trabajo como Product Engineer en el portal oficial de difusión del Congreso de la Unión de México (Cámara de Diputados y Senadores). Colaboré en la definición de estructura de contenido, navegación y componentes reutilizables, cuidando accesibilidad, performance y cumplimiento de lineamientos institucionales. El enfoque estuvo en hacer la información legislativa más clara, ordenada y fácil de consultar para la ciudadanía.",
    "summary": "Trabajo como Product Engineer en el portal oficial de difusión del Congreso de la Unión de México (Cámara de Diputados y Senadores).",
    "category": "product",
    "technologies": [
      "Next.js",
      "Product Engineering",
      "Accesibilidad",
      "Performance"
    ],
    "image": "/portfolio/thumbs/p11.webp",
    "links": [
      {
        "label": "VER PROYECTO",
        "href": "https://dev2025.canaldelcongreso.gob.mx/"
      }
    ],
    "featured": false
  },
  {
    "id": "p12",
    "title": "Equilibrio AI",
    "description": "Implementación full stack con foco en escalabilidad, arquitectura limpia y medición de resultados. Desarrollé el frontend en Next.js y el backend con FastAPI, definiendo endpoints claros, manejo de estados y flujos de datos seguros para funcionalidades ligadas a IA. También participé en la priorización de features junto a diseño y producto, midiendo impacto y performance.",
    "summary": "Implementación full stack con foco en escalabilidad, arquitectura limpia y medición de resultados.",
    "category": "fullstack",
    "technologies": [
      "Next.js",
      "FastAPI",
      "Arquitectura limpia",
      "Optimización de performance"
    ],
    "image": "/portfolio/thumbs/p12.webp",
    "links": [
      {
        "label": "VER PROYECTO",
        "href": "https://equilibrio-ai.com"
      }
    ],
    "featured": true
  },
  {
    "id": "p13",
    "title": "Botic Partners",
    "description": "Desarrollo y mantenimiento del sitio corporativo utilizando Next.js integrado a Payload CMS, con un enfoque fuerte en escalabilidad y trabajo en equipo. Modelé colecciones de contenido, creé componentes reutilizables y flujos para que el equipo pueda gestionar páginas y secciones sin depender de desarrollo. Además, trabajé en SEO técnico, mejora de performance y buenas prácticas de colaboración con diseño y stakeholders.",
    "summary": "Desarrollo y mantenimiento del sitio corporativo utilizando Next.js integrado a Payload CMS, con un enfoque fuerte en escalabilidad y trabajo en equipo.",
    "category": "product",
    "technologies": [
      "Next.js",
      "Payload CMS",
      "SEO",
      "Mejora de performance",
      "Trabajo en equipo"
    ],
    "image": "/portfolio/thumbs/p13.webp",
    "links": [
      {
        "label": "VER PROYECTO",
        "href": "https://boticpartners.com"
      }
    ],
    "featured": false
  },
  {
    "id": "p14",
    "title": "Capacitación Bursátil – Landing Educativa",
    "description": "Landing page creada en Wix para ofrecer formación bursátil, enfocada en captar alumnos interesados en inversiones. Trabajé la estructura de secciones, el diseño y el copy persuasivo para transmitir claridad, confianza profesional y guiar al usuario hacia el contacto/inscripción. Incluye formularios de contacto, bloques de contenido educativo y llamados a la acción claros.",
    "summary": "Landing page creada en Wix para ofrecer formación bursátil, enfocada en captar alumnos interesados en inversiones.",
    "category": "web",
    "technologies": [
      "Wix",
      "Diseño orientado a conversión",
      "Copywriting",
      "UX"
    ],
    "image": "/portfolio/thumbs/p14.webp",
    "links": [
      {
        "label": "VER PROYECTO",
        "href": "https://lnicolas62.wixsite.com/capacitacionbursatil"
      }
    ],
    "featured": false
  }
];
