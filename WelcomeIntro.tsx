import React, { useEffect, useState } from 'react';
import { Sparkles, Play, Volume2, X } from 'lucide-react';

interface WelcomeIntroProps {
  onClose: () => void;
}

export const WelcomeIntro: React.FC<WelcomeIntroProps> = ({ onClose }) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);

  const playWelcomeSpeechAndChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.3); // C6

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(659.25, now); // E5
        osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.4);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.8);
      }
    } catch (e) {
      console.warn('Audio Context Init Failed:', e);
    }

    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance('Welcome to PIPO');
        utterance.lang = 'en-US';
        utterance.rate = 0.95;
        utterance.pitch = 1.25;

        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(v => 
          (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Google US English') || v.name.includes('Samantha')) && 
          v.lang.startsWith('en')
        ) || voices.find(v => v.lang.startsWith('en'));

        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }

        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('Speech Synthesis Error:', e);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      playWelcomeSpeechAndChime();
      setAudioPlayed(true);
    }, 400);

    const autoClose = setTimeout(() => {
      onClose();
    }, 4200);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoClose);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleManualPlayAndClose = () => {
    setHasInteracted(true);
    playWelcomeSpeechAndChime();
    setTimeout(onClose, 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-500 selection:bg-transparent"
      onClick={handleManualPlayAndClose}
    >
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 p-3 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-500 transition-all cursor-pointer z-20"
        title="تخطي"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative text-center px-6 max-w-xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 text-xs sm:text-sm font-bold tracking-widest uppercase shadow-lg shadow-cyan-500/20">
          <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
          <span>AI NEURAL MEDIA ENGINE</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white font-['Outfit',sans-serif]">
            <span className="inline-block animate-bounce text-cyan-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.8)]">
              Welcome
            </span>{' '}
            <span className="text-slate-400 font-light">to</span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
              PIPO
            </span>
          </h1>
          <p className="text-sm sm:text-base text-cyan-200/80 font-medium tracking-wide">
            منصة تنزيل وتحسين فيديوهات تيك توك وإنستغرام بدقة فائقة
          </p>
        </div>

        <div className="pt-4 flex flex-col items-center gap-3">
          <button
            onClick={handleManualPlayAndClose}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>الدخول إلى المنصة</span>
          </button>
          <span className="text-[11px] text-slate-500">مطور النظام: @amirx_xpipo</span>
        </div>
      </div>
    </div>
  );
};
