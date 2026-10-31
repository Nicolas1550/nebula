'use client';

type Props={onSkip:()=>void};

/** Intro lightweight: SVG vectorial + transform CSS, sin video ni motor 3D extra. */
export default function LaunchSequence({onSkip}:Props){
  return <div className="launch-screen" role="dialog" aria-label="Introducción a NEBULA">
    <div className="launch-stars" aria-hidden="true"/>
    <div className="launch-scanline" aria-hidden="true"/>
    <div className="launch-top"><span>NEBULA / EXPEDITION 010</span><span>ESTABLECIENDO CONEXIÓN</span></div>
    <div className="launch-route" aria-hidden="true"><span/></div>
    <div className="launch-rocket" aria-hidden="true">
      <div className="launch-trail"/>
      <svg viewBox="0 0 470 190" xmlns="http://www.w3.org/2000/svg" role="presentation">
        <defs>
          <linearGradient id="rocketHull" x1="0" x2="1" y1="0" y2=".8">
            <stop offset="0" stopColor="#e6f5ff"/><stop offset=".45" stopColor="#748eae"/><stop offset="1" stopColor="#132840"/>
          </linearGradient>
          <linearGradient id="rocketFlame" x1="0" x2="1"><stop stopColor="#593aff"/><stop offset=".35" stopColor="#66b9ff"/><stop offset=".75" stopColor="#b9faff"/><stop offset="1" stopColor="#fff"/></linearGradient>
          <filter id="flameBlur"><feGaussianBlur stdDeviation="8"/></filter>
        </defs>
        <g className="launch-rocket-flame"><path d="M127 95 Q44 53 0 93 Q48 138 127 103" fill="#4975ff" opacity=".57" filter="url(#flameBlur)"/><path d="M140 94 Q60 72 22 94 Q67 119 140 104" fill="url(#rocketFlame)" opacity=".94"/></g>
        <path d="M155 91 L116 44 L169 60 L222 84 L222 110 L169 129 L115 148 Z" fill="#38547a" stroke="#a5d7ff" strokeWidth="2"/>
        <path d="M152 97 L168 66 C212 49 317 61 401 87 L444 99 L400 112 C316 138 211 143 168 126 Z" fill="url(#rocketHull)" stroke="#b9e8ff" strokeWidth="3"/>
        <path d="M311 71 Q373 80 444 99 Q371 106 311 126" fill="#e9f8ff" opacity=".75"/>
        <path d="M191 74 L155 20 L227 60 L256 80" fill="#7293be" stroke="#b7d6fa" strokeWidth="2"/>
        <path d="M192 121 L157 169 L229 137 L256 117" fill="#395c80" stroke="#b7d6fa" strokeWidth="2"/>
        <path d="M174 91 L241 91" stroke="#78c8ff" strokeWidth="3"/>
        <ellipse cx="289" cy="96" rx="20" ry="17" fill="#11223b" stroke="#81ddff" strokeWidth="4"/>
        <ellipse cx="289" cy="96" rx="11" ry="9" fill="#6ed9ff" opacity=".6"/>
        <path d="M190 120 Q263 151 382 116" fill="none" stroke="#293f5f" strokeWidth="5" opacity=".75"/>
        <path d="M161 84 L133 84 M161 107 L133 107" stroke="#8fcbff" strokeWidth="5"/>
        <text x="223" y="109" fill="#d5edff" fontSize="15" fontWeight="900" letterSpacing="4">N  /  07</text>
      </svg>
    </div>
    <div className="launch-center"><span className="launch-eyebrow">INICIANDO TRAVESÍA INTERESTELAR</span><h2>BEYOND<br/><em>THE KNOWN.</em></h2><p>Tres mundos. Una experiencia.</p></div>
    <div className="launch-bottom"><span>ORIGIN / NEXUS / INFERNO</span><button type="button" onClick={onSkip}>SALTAR INTRO <span aria-hidden="true">↗</span></button></div>
    <div className="launch-progress"><span/></div>
  </div>;
}
