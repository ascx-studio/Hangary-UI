const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
    <svg className="w-full h-full opacity-[0.12]">
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-50 bg-size-[100%_4px,3px_100%] pointer-events-none opacity-20"></div>
  </div>
);

const LightLeaks = () => (
  <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
    <div className="absolute top-0 -right-[20%] w-[80%] h-[100%] bg-blue-500/5 blur-[140px] rounded-full rotate-12 animate-pulse"></div>
    <div className="absolute bottom-0 -left-[10%] w-[60%] h-[60%] bg-blue-900/10 blur-[120px] rounded-full"></div>
  </div>
);

export { NoiseOverlay, LightLeaks };
