import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Orbit } from 'lucide-react';
import { cosmicAudio } from '../utils/cosmicAudio';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleAudio = () => {
    const active = cosmicAudio.toggleSound();
    setIsMuted(!active);
  };

  const navLinks = [
    { label: 'Explore', href: '#hero' },
    { label: 'Solar System', href: '#solar-system' },
    { label: 'Cosmos', href: '#cosmos' },
    { label: 'Missions', href: '#missions' },
    { label: 'Observatory', href: '#observatory' },
  ];

  const handleLinkClick = () => {
    cosmicAudio.playTelemetryClick();
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3.5 bg-[#080B1A]/85 backdrop-blur-md border-b border-[#42D9F5]/15 shadow-xl'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <a 
          href="#hero" 
          onClick={handleLinkClick}
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          {/* Orbital SVG Icon */}
          <div className="relative w-9 h-9 rounded-xl bg-[#10152E] border border-[#42D9F5]/40 flex items-center justify-center group-hover:border-[#42D9F5] transition-colors shadow-[0_0_15px_-3px_rgba(66,217,245,0.3)]">
            <Orbit className="w-5 h-5 text-[#42D9F5] transition-transform duration-500 group-hover:rotate-45" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-[#42D9F5] animate-ping" />
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-black font-heading tracking-wider text-[#F5F4FF] group-hover:text-[#42D9F5] transition-colors">
              SKYVEX
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#A5ABC8] -mt-1 uppercase">
              COSMIC ODYSSEY
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={handleLinkClick}
              className="text-xs font-mono tracking-wider uppercase text-[#A5ABC8] hover:text-[#42D9F5] transition-colors relative group py-1"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#42D9F5] transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Telemetry pill & Audio toggle */}
        <div className="hidden sm:flex items-center gap-3">
          
          {/* Live telemetry pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10152E]/80 border border-[#42D9F5]/20 text-[11px] font-mono text-[#A5ABC8]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden lg:inline text-[#F5F4FF]">DSN LINK:</span>
            <span className="text-[#42D9F5]">ONLINE</span>
          </div>

          {/* Web Audio Synthesizer Toggle */}
          <button
            onClick={handleToggleAudio}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              !isMuted
                ? 'bg-[#42D9F5]/20 border-[#42D9F5] text-[#42D9F5] shadow-[0_0_15px_-3px_rgba(66,217,245,0.4)]'
                : 'bg-[#10152E]/70 border-white/10 text-[#A5ABC8] hover:text-[#F5F4FF] hover:border-white/30'
            }`}
            title={isMuted ? "Activate ambient cosmic audio" : "Mute ambient cosmic audio"}
            aria-label="Toggle Cosmic Soundscape"
          >
            {!isMuted ? (
              <>
                <Volume2 className="w-4 h-4 text-[#42D9F5]" />
                <span className="text-[11px] uppercase tracking-wider hidden lg:inline">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wider hidden lg:inline">AUDIO MUTED</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={handleToggleAudio}
            className={`p-2 rounded-lg border text-xs font-mono ${
              !isMuted ? 'bg-[#42D9F5]/20 border-[#42D9F5] text-[#42D9F5]' : 'bg-[#10152E] border-white/10 text-[#A5ABC8]'
            }`}
            aria-label="Toggle Sound"
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#10152E] border border-white/15 text-[#F5F4FF]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 bg-[#080B1A]/95 border-b border-[#42D9F5]/20 backdrop-blur-xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={handleLinkClick}
                className="px-3 py-2 text-sm font-mono tracking-wider uppercase text-[#F5F4FF] hover:text-[#42D9F5] hover:bg-[#10152E] rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#A5ABC8]">
              <span>DSN LINK: ONLINE</span>
              <span className="text-[#42D9F5]">SOLAR WIND: 418 KM/S</span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
