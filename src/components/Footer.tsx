import React, { useState, useEffect } from 'react';
import { Orbit, Send } from 'lucide-react';
import { cosmicAudio } from '../utils/cosmicAudio';

export const Footer: React.FC = () => {
  const [utcTime, setUtcTime] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    cosmicAudio.playDeepImpact();
    setSubscribed(true);
  };

  return (
    <footer className="relative w-full bg-[#050711] border-t border-[#42D9F5]/15 pt-16 pb-12 overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#7548D8]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#10152E] border border-[#42D9F5]/40 flex items-center justify-center">
                <Orbit className="w-4 h-4 text-[#42D9F5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black font-heading tracking-wider text-[#F5F4FF]">
                  SKYVEX
                </span>
                <span className="text-[9px] font-mono tracking-widest text-[#A5ABC8] -mt-1 uppercase">
                  COSMIC ODYSSEY
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#A5ABC8] max-w-sm leading-relaxed">
              An interactive 3D universe bridging astrophysics, scientific telemetry, and futuristic digital design. Exploring the cosmos from the quantum horizon to the edge of the observable web.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-[#A5ABC8]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>SYSTEM CLOCK:</span>
              <span className="text-[#42D9F5] font-semibold">{utcTime || 'SYNCHRONIZING...'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#42D9F5]">
              Expedition
            </h4>
            <ul className="space-y-2 text-xs font-mono text-[#A5ABC8]">
              <li>
                <a href="#hero" className="hover:text-[#42D9F5] transition-colors">Surface Horizon</a>
              </li>
              <li>
                <a href="#solar-system" className="hover:text-[#42D9F5] transition-colors">Our Solar System</a>
              </li>
              <li>
                <a href="#cosmos" className="hover:text-[#42D9F5] transition-colors">Deep Cosmos</a>
              </li>
              <li>
                <a href="#missions" className="hover:text-[#42D9F5] transition-colors">Human Missions</a>
              </li>
              <li>
                <a href="#observatory" className="hover:text-[#42D9F5] transition-colors">Celestial Observatory</a>
              </li>
            </ul>
          </div>

          {/* Scientific Sources & Credits */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#42D9F5]">
              Scientific Data
            </h4>
            <ul className="space-y-2 text-xs font-mono text-[#A5ABC8]">
              <li className="flex items-center gap-1.5 hover:text-[#F5F4FF]">
                <span>NASA JPL & Exoplanet Archive</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#F5F4FF]">
                <span>ESA / Webb Science Institute</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#F5F4FF]">
                <span>Event Horizon Telescope (EHT)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#F5F4FF]">
                <span>IAU Minor Planet Center</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#F5F4FF]">
                <span>Deep Space Network (DSN)</span>
              </li>
            </ul>
          </div>

          {/* Deep Space Dispatch Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#42D9F5]">
              Deep Space Dispatch
            </h4>
            <p className="text-xs text-[#A5ABC8]">
              Receive urgent celestial alerts, planetary occultations, and deep-space telemetry dispatches.
            </p>
            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
                Frequency locked. You are on the deep-space transmission roster.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="explorer@earth.net"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#10152E] border border-white/10 text-xs text-[#F5F4FF] placeholder-[#A5ABC8]/50 focus:outline-none focus:border-[#42D9F5]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 rounded-lg bg-[#42D9F5] text-[#080B1A] hover:bg-[#6ee2f8] transition-colors flex items-center justify-center"
                    aria-label="Subscribe to dispatch"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Bottom credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#A5ABC8]/70">
          <div>
            © {new Date().getFullYear()} SKYVEX // COSMIC ODYSSEY. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span>EPOCH: J2000.0</span>
            <span>•</span>
            <span className="text-[#42D9F5]">BEYOND THE BOUNDARIES OF EARTH</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
