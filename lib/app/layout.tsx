import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NEBULA — Beyond the Known | Portfolio de Nicolás Luciuk',
  description: 'Explorá tres mundos interactivos: ORIGIN, NEXUS e INFERNO. Portfolio Full Stack con 14 proyectos reales, museo 3D, NOVA y tres mundos explorables.',
  openGraph: {
    title: 'NEBULA — Beyond the Known',
    description: 'Tres mundos. Una experiencia. Portfolio 3D interactivo de Nicolás Luciuk.',
    type: 'website',
    locale: 'es_AR',
    images: [{ url: '/social/nebula-v10-cover.jpg', width: 1200, height: 630, alt: 'NEBULA: tres planetas espaciales de un portfolio interactivo' }],
  },
  twitter: { card: 'summary_large_image', title: 'NEBULA — Beyond the Known', images: ['/social/nebula-v10-cover.jpg'] },
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="es"><body>{children}</body></html>;
}
