import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IdeaForge — Trade Sparks, Not Templates",
  description: "Creative spark exchange: Seekers post app concepts, Builders claim & build original works."
};

export default function Layout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <body className="min-h-screen paper-texture">
        <svg width="0" height="0" style={{position:'absolute'}}>
          <filter id="rough-edge">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/>
          </filter>
        </svg>

        <nav className="sticky top-0 z-50 nav-bar">
          <div className="max-w-6xl mx-auto px-6 lg:px-[60px] h-14 flex items-center justify-between">
            <a href="/" className="no-underline">
              <span className="serif text-lg font-semibold text-[#1a1a1a] tracking-[1px]">IdeaForge</span>
            </a>
            <span className="text-[11px] lg:text-[12px] text-[#665c56] tracking-wide font-light italic">Trade sparks, not templates</span>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
