import React, { useEffect, useState } from 'react';
import { Sparkles, Zap, Volume2 } from 'lucide-react';

interface Props {
  onClose?: () => void;
}

export const WelcomeIntro: React.FC<Props> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [hasSpoken, setHasSpoken] = useState(false);

  const playAiVoice = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1600, now);
        filter.connect(ctx.destination);

        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(440, now);
        osc1.frequency.exponentialRampToValueAtTime(880, now + 0.5);
        gain1.gain.setValueAtTime(0.01, now);
        gain1.gain.linearRampToValueAtTime(0.18, now + 0.15);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc1.connect(gain1);
        gain1.connect(filter);
        osc1.start(now);
        osc1.stop(now + 1.2);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(554.37, now + 0.15);
        osc2.frequency.exponentialRampToValueAtTime(1108.73, now + 0.6);
        gain2.gain.setValueAtTime(0.01, now + 0.15);
        gain2.gain.linearRampToValueAtTime(0.14, now + 0.3);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
        osc2.connect(gain2);
        gain2.connect(filter);
        osc2.start(now + 0.15);
        osc2.stop(now + 1.4);
      }
    } catch (e) {
      console.warn('AudioContext chime not available', e);
    }

    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance('Welcome, to PIPO.');
        utterance.lang = 'en-US';
        utterance.rate = 0.78;
        utterance.pitch = 1.02;
        utterance.volume = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const warmFemaleVoice = voices.find(v => 
          v.name.includes('Natural') ||
          v.name.includes('Samantha') || 
          v.name.includes('Google US English') ||
          v.name.includes('Victoria') ||
          v.name.includes('Karen') ||
          v.name.includes('Zira') ||
          (v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Woman')))
        ) || voices.find(v => v.lang.startsWith('en'));

        if (warmFemaleVoice) {
          utterance.voice = warmFemaleVoice;
        }

        window.speechSynthesis.speak(utterance);
        setHasSpoken(true);
      }
    } catch (e) {
      console.warn('Speech synthesis error', e);
    }
  };

  useEffect(() => {
    const audioTimer = setTimeout(() => {
      playAiVoice();
    }, 250);

    if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        if (!hasSpoken) playAiVoice();
      };
    }

    const timer = setTimeout(() => {
      handleDismiss();
    }, 4000);

    return () => {
      clearTimeout(audioTimer);
      clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div 
      onClick={() => {
        playAiVoice();
        setTimeout(handleDismiss, 1000);
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-xl cursor-pointer select-none transition-all duration-700 animate-in fade-in"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[100px] animate-pulse"></div>
        <div className="w-[350px] h-[350px] rounded-full bg-orange-500/15 blur-[80px] animate-pulse delay-300"></div>
        <div className="absolute w-[600px] h-[600px] border border-cyan-500/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
        <div className="absolute w-[450px] h-[450px] border border-dashed border-orange-500/25 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
      </div>

      <div className="relative text-center px-6 py-10 max-w-lg mx-auto z-10 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-orange-500 p-1 cyber-glow-cyan shadow-[0_0_50px_rgba(0,242,254,0.6)] animate-bounce duration-1000">
            <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center">
              <Zap className="w-10 h-10 text-cyan-400 fill-cyan-400 animate-pulse" />
            </div>
          </div>
          <span className="absolute -bottom-2 -right-2 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-85"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-orange-500 border-2 border-black"></span>
          </span>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-950/90 border border-cyan-400/50 text-cyan-300 text-xs font-mono tracking-widest uppercase shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>AI Voice & Neural Core Active</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-wider font-['Outfit',sans-serif] uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-orange-400 drop-shadow-[0_0_35px_rgba(0,242,254,0.8)] animate-pulse">
            Welcome to PIPO
          </h1>

          <p className="text-sm sm:text-base text-cyan-200/90 font-medium tracking-wide font-['Cairo',sans-serif]">
            منصة التحميل الذكي والفائق بدون علامة مائية • استوديو ترقية 4K AI
          </p>
        </div>

        <div className="mt-8 flex items-center gap-3 bg-slate-900/80 border border-cyan-500/30 px-5 py-2.5 rounded-full shadow-md">
          <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs text-slate-300 font-mono">
            {hasSpoken ? 'AI Voice Activated' : 'Click anywhere to play sound'}
          </span>
          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-md">
            Skip ✕
          </span>
        </div>
      </div>
    </div>
  );
};
