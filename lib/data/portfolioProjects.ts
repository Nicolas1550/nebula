// Catálogo extraído del archivo original portafolioWeb-main/src/app/components/projects/projects.tsx.
// No se inventan proyectos ni enlaces; se omite un enlace GitHub de ejemplo del proyecto CEA.
export type ProjectCategory = 'fullstack' | 'product' | 'leadership' | 'web';
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
    "id": "p15",
    "title": "ATLAS",
    "description": "Proyecto web ATLAS, disponible para explorar en su versión publicada.",
    "summary": "Proyecto web ATLAS, disponible para explorar en su versión publicada.",
    "category": "web",
    "technologies": [
      "Web",
      "Frontend"
    ],
    "image": "atlas.svg",
    "links": [
      {
        "label": "VER PROYECTO",
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
    "id": "p16",
    "title": "SYNAPSE",
    "description": "Experiencia interactiva SYNAPSE con visualización neuronal 3D.",
    "summary": "Experiencia interactiva SYNAPSE con visualización neuronal 3D.",
    "category": "web",
    "technologies": [
      "Next.js",
      "React",
      "Three.js",
      "React Three Fiber"
    ],
    "image": "synapse.svg",
    "links": [
      {
        "label": "VER PROYECTO",
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
    "id": "p17",
    "title": "EON — The Living City",
    "description": "Simulación interactiva de una ciudad 3D con entornos y elementos urbanos.",
    "summary": "Simulación interactiva de una ciudad 3D con entornos y elementos urbanos.",
    "category": "web",
    "technologies": [
      "Next.js",
      "React",
      "Three.js",
      "Simulación 3D"
    ],
    "image": "eon.svg",
    "links": [
      {
        "label": "VER PROYECTO",
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
    "image": "peluqueria.webp",
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
    "image": "makeup.webp",
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
    "image": "chicksx.png",
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
    "image": "chicksgold.png",
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
    "image": "tangoWeb.png",
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
    "image": "tangoFondo.png",
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
    "image": "bici.webp",
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
    "image": "ciencia.webp",
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
    "image": "fundamentals.png",
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
    "image": "ceo-training.png",
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
    "image": "congreso.png",
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
    "image": "equilibrio.png",
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
    "image": "boticpartners.png",
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
    "image": "capacitacionbursatil.png",
    "links": [
      {
        "label": "VER PROYECTO",
        "href": "https://lnicolas62.wixsite.com/capacitacionbursatil"
      }
    ],
    "featured": false
  }
];
