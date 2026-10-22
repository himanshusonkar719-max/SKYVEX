import React, { useState, useEffect } from 'react';
import { MISSIONS } from '../data/spaceData';
import type { MissionData } from '../data/spaceData';
import { Rocket, CheckCircle2, Calendar, X, ArrowRight, Cpu } from 'lucide-react';
import { cosmicAudio } from '../utils/cosmicAudio';

export const MissionsTimeline: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed' | 'In Transit'>('All');
  const [activeMission, setActiveMission] = useState<MissionData | null>(null);
  
  // Real-time ticking distance simulation for Voyager 1 (~17 km/s speed)
  const [voyagerKm, setVoyagerKm] = useState<number>(24428190450);

  useEffect(() => {
    const interval = setInterval(() => {
      setVoyagerKm(prev => prev + 17);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredMissions = MISSIONS.filter(m => {
    if (filter === 'All') return true;
    return m.status === filter;
  });

  const handleOpenMission = (m: MissionData) => {
    cosmicAudio.playFocusHum();
    setActiveMission(m);
  };

  const handleCloseModal = () => {
    cosmicAudio.playTelemetryClick();
    setActiveMission(null);
  };

  return (
    <section id="missions" className="relative w-full py-24 bg-[#080B1A] border-t border-[#42D9F5]/10 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[#42D9F5]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-[#7548D8]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10152E] border border-[#42D9F5]/30 text-xs font-mono tracking-widest text-[#42D9F5] uppercase mb-3">
              <Rocket className="w-3.5 h-3.5" />
              <span>Spaceflight Milestones</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-[#F5F4FF]">
              HUMANITY BEYOND EARTH
            </h2>
            <p className="mt-3 text-base text-[#A5ABC8] max-w-2xl leading-relaxed">
              From the sea of tranquility to the interstellar void. Chronicling humanity's greatest voyages, robotic pioneers, and active deep-space flagships.
            </p>
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#10152E] border border-[#42D9F5]/20">
            {(['All', 'Active', 'Completed', 'In Transit'] as const).map(st => (
              <button
                key={st}
                onClick={() => {
                  cosmicAudio.playTelemetryClick();
                  setFilter(st);
                }}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                  filter === st
                    ? 'bg-[#42D9F5] text-[#080B1A] font-bold shadow'
                    : 'text-[#A5ABC8] hover:text-[#F5F4FF]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Live Interstellar Voyager Ticker Panel */}
        <div className="mb-12 p-4 sm:p-5 rounded-2xl glass-panel-glow border border-[#42D9F5]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#42D9F5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#42D9F5]"></span>
            </span>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#42D9F5]">
                Active Deep Space Telemetry // VOYAGER 1
              </div>
              <div className="text-xs text-[#A5ABC8]">
                Real-time simulated distance from Earth (Velocity: ~17.0 km/s)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-[#F5F4FF] tracking-wider">
                {voyagerKm.toLocaleString()} <span className="text-xs text-[#42D9F5]">KM</span>
              </div>
              <div className="text-[11px] font-mono text-[#A5ABC8]">
                {(voyagerKm / 149597870.7).toFixed(4)} AU • Interstellar Medium
              </div>
            </div>
            <button
              onClick={() => handleOpenMission(MISSIONS[0])}
              className="px-3.5 py-1.5 rounded-lg bg-[#42D9F5]/10 hover:bg-[#42D9F5]/20 border border-[#42D9F5]/30 text-xs font-mono text-[#42D9F5] transition-colors"
            >
              DETAILS
            </button>
          </div>
        </div>

        {/* Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMissions.map((m) => (
            <div
              key={m.id}
              className="flex flex-col justify-between rounded-2xl glass-panel border border-[#42D9F5]/15 hover:border-[#42D9F5]/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div>
                {/* Header status line */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-[#42D9F5] uppercase tracking-wider">
                    {m.program}
                  </span>
                  <span 
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                      m.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : m.status === 'In Transit'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <h3 className="text-2xl font-bold font-heading text-[#F5F4FF] group-hover:text-[#42D9F5] transition-colors">
                  {m.name}
                </h3>
                
                <div className="flex items-center gap-3 text-xs font-mono text-[#A5ABC8] mt-1 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#42D9F5]" />
                    {m.year}
                  </span>
                  <span>•</span>
                  <span>{m.type}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#A5ABC8] leading-relaxed mb-6">
                  {m.description}
                </p>

                {/* Key specs badge */}
                <div className="p-3 rounded-xl bg-[#080B1A]/60 border border-white/5 space-y-1.5 mb-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#A5ABC8]">Current Reach:</span>
                    <span className="font-mono font-semibold text-[#F5F4FF]">{m.distance}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#A5ABC8]">Primary Goal:</span>
                    <span className="font-mono text-[#42D9F5] truncate max-w-[170px]" title={m.objective}>
                      {m.objective}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleOpenMission(m)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#10152E] hover:bg-[#151D42] border border-[#42D9F5]/30 text-xs font-mono text-[#42D9F5] hover:text-[#F5F4FF] transition-all group-hover:border-[#42D9F5]"
              >
                <span>MISSION DOSSIER</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* Mission Detail Modal */}
      {activeMission && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#080B1A]/85 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div 
            className="relative w-full max-w-2xl rounded-2xl glass-panel-glow border border-[#42D9F5]/40 p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#10152E] hover:bg-[#151D42] border border-white/20 text-[#A5ABC8] hover:text-[#F5F4FF] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-mono text-[#42D9F5] uppercase">
                <span>{activeMission.program}</span>
                <span>•</span>
                <span>{activeMission.year}</span>
              </div>
              <h3 className="text-3xl font-black font-heading text-[#F5F4FF] mt-1">
                {activeMission.name}
              </h3>
              <p className="text-xs font-mono text-[#A5ABC8] mt-1">
                {activeMission.type} // Status: {activeMission.status}
              </p>
            </div>

            <div className="space-y-6 text-sm">
              <div className="p-4 rounded-xl bg-[#080B1A]/70 border border-white/5">
                <div className="text-xs font-mono uppercase text-[#42D9F5] mb-1">
                  Primary Objective
                </div>
                <p className="text-[#F5F4FF] leading-relaxed">
                  {activeMission.objective}
                </p>
              </div>

              {/* Milestones */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#42D9F5] mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Historical & Operational Milestones</span>
                </h4>
                <div className="space-y-2">
                  {activeMission.keyMilestones.map((ms, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#10152E]/60 border border-white/5 text-xs sm:text-sm text-[#F5F4FF]">
                      <span className="font-mono text-[#42D9F5] font-bold">0{i + 1}.</span>
                      <span>{ms}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Specifications */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#42D9F5] mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  <span>Spacecraft & Telemetry Specifications</span>
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {activeMission.specs.map((sp, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#080B1A]/60 border border-white/5">
                      <div className="text-[10px] font-mono text-[#A5ABC8] uppercase">{sp.label}</div>
                      <div className="text-xs sm:text-sm font-mono font-semibold text-[#F5F4FF] mt-0.5">{sp.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-[#A5ABC8]">MISSION ID: {activeMission.id.toUpperCase()}</span>
              <button
                onClick={handleCloseModal}
                className="px-5 py-2 rounded-xl bg-[#42D9F5] hover:bg-[#6be0f7] text-[#080B1A] font-mono text-xs font-bold tracking-wider transition-colors"
              >
                RETURN TO MISSIONS
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
