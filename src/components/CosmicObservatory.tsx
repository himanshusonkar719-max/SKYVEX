import React, { useState } from 'react';
import { Telescope, Compass, Sliders, Sparkles, Zap } from 'lucide-react';
import { cosmicAudio } from '../utils/cosmicAudio';

interface ObservatoryTarget {
  name: string;
  catalog: string;
  constellation: string;
  ra: string;
  dec: string;
  distanceLy: number;
  redshiftZ: number;
  spectralType: string;
  description: string;
}

const TARGETS: ObservatoryTarget[] = [
  {
    name: 'Pillars of Creation',
    catalog: 'M16 // NGC 6611',
    constellation: 'Serpens',
    ra: '18h 18m 48s',
    dec: '-13° 49′',
    distanceLy: 6500,
    redshiftZ: 0.00002,
    spectralType: 'Emission Nebula',
    description: 'Active star-forming columns of interstellar hydrogen gas and dust within the Eagle Nebula, sculpted by intense ultraviolet radiation from massive newborn stars.'
  },
  {
    name: 'Sagittarius A*',
    catalog: 'Galactic Center SMBH',
    constellation: 'Sagittarius',
    ra: '17h 45m 40s',
    dec: '-29° 00′ 28″',
    distanceLy: 26673,
    redshiftZ: 0.00008,
    spectralType: 'Radio / Relativistic Plasma',
    description: 'The supermassive black hole at the dynamical heart of our Milky Way Galaxy, with a mass equivalent to 4.15 million suns.'
  },
  {
    name: 'Crab Nebula Supernova Remnant',
    catalog: 'M1 // NGC 1952',
    constellation: 'Taurus',
    ra: '05h 34m 32s',
    dec: '+22° 00′ 52″',
    distanceLy: 6500,
    redshiftZ: 0.00002,
    spectralType: 'Pulsar Wind Nebula',
    description: 'The expanding remnant of a core-collapse supernova observed by astronomers on Earth in the year 1054 AD. Hosts an ultra-dense spinning pulsar rotating 30 times per second.'
  },
  {
    name: 'Webb Deep Field Galaxy Cluster',
    catalog: 'SMACS 0723',
    constellation: 'Volans',
    ra: '07h 23m 19s',
    dec: '-73° 27′ 15″',
    distanceLy: 4600000000,
    redshiftZ: 0.39,
    spectralType: 'Gravitationally Lensed Field',
    description: 'Vast cluster of thousands of galaxies whose collective gravity acts as a natural cosmic telescope, magnifying ancient background galaxies born just after the dawn of time.'
  }
];

export const CosmicObservatory: React.FC = () => {
  const [selectedTarget, setSelectedTarget] = useState<ObservatoryTarget>(TARGETS[0]);
  const [customDistance, setCustomDistance] = useState<number>(2500000); // 2.5M ly (Andromeda)

  // Cosmological calculations
  const lookbackYears = customDistance;
  const estimatedRedshift = (customDistance / 14000000000) * 1.8;

  const handleSelect = (target: ObservatoryTarget) => {
    cosmicAudio.playFocusHum();
    setSelectedTarget(target);
    setCustomDistance(target.distanceLy);
  };

  return (
    <section id="observatory" className="relative w-full py-24 bg-[#080B1A] border-t border-[#42D9F5]/10 overflow-hidden">
      
      {/* Background glow ambiance */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#42D9F5]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10152E] border border-[#42D9F5]/30 text-xs font-mono tracking-widest text-[#42D9F5] uppercase mb-3">
            <Telescope className="w-3.5 h-3.5" />
            <span>Interactive Deep-Sky Scanner</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-[#F5F4FF]">
            CELESTIAL OBSERVATORY
          </h2>
          <p className="mt-3 text-base text-[#A5ABC8] max-w-2xl leading-relaxed">
            Lock onto deep-sky coordinates, calculate cosmic lookback time, and simulate relativistic redshifts across the observable cosmological horizon.
          </p>
        </div>

        {/* Observatory Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Target Selection & Sky Coordinates Panel */}
          <div className="lg:col-span-7 rounded-2xl glass-panel-glow p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-wider text-[#42D9F5] flex items-center gap-2">
                <Compass className="w-4 h-4" />
                <span>Observatory Target Matrix</span>
              </span>
              <span className="text-xs font-mono text-[#A5ABC8]">COORDINATE SYSTEM: J2000.0</span>
            </div>

            {/* Target Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TARGETS.map((tgt) => {
                const isSelected = selectedTarget.name === tgt.name;
                return (
                  <button
                    key={tgt.name}
                    onClick={() => handleSelect(tgt)}
                    className={`p-3.5 rounded-xl text-left transition-all border ${
                      isSelected
                        ? 'bg-[#10152E] border-[#42D9F5] shadow-[0_0_15px_-3px_rgba(66,217,245,0.3)]'
                        : 'bg-[#080B1A]/60 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#42D9F5]">{tgt.catalog}</span>
                      <span className="text-[10px] font-mono text-[#A5ABC8]">{tgt.constellation}</span>
                    </div>
                    <div className="text-sm font-bold font-heading text-[#F5F4FF] mt-1">
                      {tgt.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Target HUD Display */}
            <div className="p-5 rounded-xl bg-[#080B1A]/80 border border-[#42D9F5]/20 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold font-heading text-[#F5F4FF]">{selectedTarget.name}</h3>
                  <div className="text-xs font-mono text-[#42D9F5]">{selectedTarget.catalog} • {selectedTarget.spectralType}</div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#42D9F5]/10 border border-[#42D9F5]/30 text-xs font-mono text-[#42D9F5]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>TARGET LOCKED</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#A5ABC8] leading-relaxed">
                {selectedTarget.description}
              </p>

              {/* Coordinates Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="p-2.5 rounded-lg bg-[#10152E]/60 border border-white/5">
                  <div className="text-[10px] font-mono uppercase text-[#A5ABC8]">Right Ascension</div>
                  <div className="text-xs font-mono font-semibold text-[#F5F4FF] mt-0.5">{selectedTarget.ra}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#10152E]/60 border border-white/5">
                  <div className="text-[10px] font-mono uppercase text-[#A5ABC8]">Declination</div>
                  <div className="text-xs font-mono font-semibold text-[#F5F4FF] mt-0.5">{selectedTarget.dec}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#10152E]/60 border border-white/5">
                  <div className="text-[10px] font-mono uppercase text-[#A5ABC8]">Distance</div>
                  <div className="text-xs font-mono font-semibold text-[#F5F4FF] mt-0.5">{selectedTarget.distanceLy.toLocaleString()} ly</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#10152E]/60 border border-white/5">
                  <div className="text-[10px] font-mono uppercase text-[#A5ABC8]">Cosmic Redshift</div>
                  <div className="text-xs font-mono font-semibold text-[#F5F4FF] mt-0.5">z = {selectedTarget.redshiftZ}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Lookback Time & Redshift Calculator */}
          <div className="lg:col-span-5 rounded-2xl glass-panel-glow p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-wider text-[#42D9F5] flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>Lookback & Redshift Computer</span>
              </span>
              <Zap className="w-4 h-4 text-[#42D9F5]" />
            </div>

            <p className="text-xs text-[#A5ABC8]">
              Adjust target cosmological distance to calculate light lookback epoch and the expansion stretching of light waves:
            </p>

            {/* Distance Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#A5ABC8]">Distance from Earth:</span>
                <span className="text-[#42D9F5] font-bold text-sm">
                  {customDistance.toLocaleString()} Light-Years
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={13000000000}
                step={100000}
                value={customDistance}
                onChange={(e) => setCustomDistance(Number(e.target.value))}
                className="w-full accent-[#42D9F5] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#A5ABC8]/60">
                <span>Near Stars (100 ly)</span>
                <span>Andromeda (2.5M ly)</span>
                <span>Observable Horizon (13B ly)</span>
              </div>
            </div>

            {/* Calculated Results */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-[#080B1A]/80 border border-white/5 space-y-1">
                <div className="text-[11px] font-mono uppercase text-[#A5ABC8]">Photon Lookback Age</div>
                <div className="text-xl font-bold font-mono text-[#F5F4FF]">
                  {lookbackYears.toLocaleString()} <span className="text-xs font-normal text-[#42D9F5]">Years Ago</span>
                </div>
                <div className="text-[11px] text-[#A5ABC8]">
                  Light hitting your eyes right now departed during this epoch.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#080B1A]/80 border border-white/5 space-y-1">
                <div className="text-[11px] font-mono uppercase text-[#A5ABC8]">Calculated Redshift (z)</div>
                <div className="text-xl font-bold font-mono text-[#42D9F5]">
                  z ≈ {estimatedRedshift < 0.0001 ? '< 0.0001' : estimatedRedshift.toFixed(4)}
                </div>
                <div className="text-[11px] text-[#A5ABC8]">
                  {estimatedRedshift > 1 
                    ? 'Cosmological light stretched deep into the infrared spectrum (requires JWST).' 
                    : 'Relatively nearby celestial frame with negligible metric expansion.'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#7548D8]/10 border border-[#7548D8]/30 text-xs font-mono text-[#F5F4FF]">
                <span className="text-[#42D9F5]">c = 299,792.458 km/s</span> • Invariant speed of causality in vacuum spacetime.
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
