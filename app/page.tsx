import ParticleBackground from "@/src/components/ParticleBackground";

const GlitchTitle = () => {
  return (
    <div className="group relative inline-block w-full max-w-5xl overflow-hidden">
      <h1 className="relative z-10 text-6xl font-black tracking-tighter text-white mix-blend-difference md:text-8xl lg:text-9xl">
        M\u00dcHEND\u0130SLER
        <br />
        <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
          LABORATUVARI
        </span>
      </h1>

      <div className="pointer-events-none absolute left-1 top-0 h-full w-full select-none text-6xl font-black text-red-500 opacity-0 mix-blend-difference transition-opacity duration-150 group-hover:animate-pulse group-hover:opacity-30 md:text-8xl lg:text-9xl">
        M\u00dcHEND\u0130SLER
        <br />
        LABORATUVARI
      </div>
      <div className="pointer-events-none absolute -left-1 top-0 h-full w-full select-none text-6xl font-black text-blue-500 opacity-0 mix-blend-difference transition-opacity duration-150 group-hover:animate-bounce group-hover:opacity-30 md:text-8xl lg:text-9xl">
        M\u00dcHEND\u0130SLER
        <br />
        LABORATUVARI
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <ParticleBackground />

      <nav className="fixed top-0 z-50 flex w-full items-center justify-between p-6 font-mono text-sm mix-blend-difference">
        <div className="font-bold">AI_LAB_V1.0</div>
        <div className="flex gap-6">
          <button type="button" className="hover:underline">
            /PROJELER
          </button>
          <button type="button" className="hover:underline">
            /\u0130LET\u0130\u015e\u0130M
          </button>
        </div>
      </nav>

      <section className="relative flex min-h-screen flex-col justify-center px-4 pb-20 pt-28 md:px-10 lg:px-16">
        <GlitchTitle />

        <div className="relative z-10 -mt-12 ml-auto mr-0 w-full max-w-xl md:-mt-20 md:mr-8 lg:-mt-28 lg:mr-16">
          <div className="border-2 border-white bg-neutral-900/90 p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] backdrop-blur-sm">
            <div className="mb-4 flex justify-between border-b border-neutral-700 pb-2 font-mono text-xs text-cyan-400">
              <span>SYS_STATUS: ONLINE</span>
              <span className="animate-pulse">\u25cf</span>
            </div>

            <p className="mb-8 font-mono text-lg leading-relaxed text-neutral-300">
              &gt; Standartlar\u0131 reddediyoruz. <br />
              Kaos ve d\u00fczen aras\u0131ndaki ince \u00e7izgide, n\u00f6ral a\u011flar\u0131n s\u0131n\u0131rlar\u0131n\u0131 zorlayan algoritmalar geli\u015ftiriyoruz.
            </p>

            <button className="group relative overflow-hidden border border-green-500/50 bg-transparent px-8 py-4 transition-all duration-300 hover:border-green-400">
              <div className="absolute inset-0 w-0 bg-green-500 opacity-10 transition-all duration-[250ms] ease-out group-hover:w-full" />
              <div className="absolute left-0 top-0 h-2 w-2 border-l-2 border-t-2 border-green-500" />
              <div className="absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-green-500" />

              <span className="relative font-mono text-sm uppercase tracking-widest text-green-400 group-hover:text-green-300">
                {`> SISTEME_GIRIS()`}
                <span className="absolute -right-2 top-0 h-1 w-1 animate-ping rounded-full bg-green-500 opacity-75" />
              </span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
