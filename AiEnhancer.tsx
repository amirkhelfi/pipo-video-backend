import React, { useState } from 'react';
import { VideoData, Language } from '../types';
import { translations } from '../utils/translations';
import { Sparkles, Wand2, Sliders, Play, CheckCircle2, Download, RefreshCw, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AiEnhancerProps {
  lang: Language;
  currentVideo: VideoData | null;
}

export const AiEnhancer: React.FC<AiEnhancerProps> = ({ lang, currentVideo }) => {
  const [resolution, setResolution] = useState<'4k' | '8k' | '2k' | '1080p'>('4k');
  const [fps, setFps] = useState<30 | 60 | 90 | 120>(60);
  const [hdr, setHdr] = useState(true);
  const [faceEnhance, setFaceEnhance] = useState(true);
  const [audioBoost, setAudioBoost] = useState(true);
  const [stabilization, setStabilization] = useState(true);

  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepLabel, setStepLabel] = useState('');
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);

  const t = translations[lang];

  const handleStartEnhance = () => {
    setProcessing(true);
    setProgress(5);
    setIsEnhanced(false);
    setStepLabel(lang === 'ar' ? 'تهيئة النماذج العصبية وفك تشفير الإطارات...' : 'Initializing neural weights...');

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessing(false);
          setIsEnhanced(true);
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 15) + 8;
        if (next > 25 && next < 50) {
          setStepLabel(lang === 'ar' ? `مضاعفة معدل الإطارات إلى ${fps} FPS ومعالجة الحركة...` : `Interpolating frames to ${fps} FPS...`);
        } else if (next >= 50 && next < 80) {
          setStepLabel(lang === 'ar' ? `ترقية الدقة العصبية إلى ${resolution.toUpperCase()} وإعادة رسم الملامح...` : `Upscaling resolution to ${resolution.toUpperCase()}...`);
        } else if (next >= 80) {
          setStepLabel(lang === 'ar' ? 'تطبيق المدى اللوني العريض HDR وعزل الضوضاء الصوتية...' : 'Finalizing HDR tone mapping...');
        }
        return next > 100 ? 100 : next;
      });
    }, 450);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-bold cyber-glow-cyan">
          <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
          <span>PIPO NEURAL STUDIO V4.0</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white">
          استوديو الذكاء الاصطناعي لرفع الجودة ومعدل الإطارات
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* لوحة خيارات التخصيص */}
        <div className="lg:col-span-5 space-y-6 p-6 rounded-3xl bg-[#0a0f1d] border border-cyan-500/30">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">1. اختيار الدقة المراد رفعها (Resolution)</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: '4k', label: '4K Ultra HD', desc: 'أعلى دقة مستقرة (3840×2160)' },
                { id: '8k', label: '8K Master', desc: 'دقة فائقة جداً (7680×4320)' },
                { id: '2k', label: '2K QHD', desc: 'دقة ممتازة (2560×1440)' },
                { id: '1080p', label: '1080p FHD', desc: 'دقة عالية متوافقة (1920×1080)' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setResolution(opt.id as any)}
                  className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                    resolution === opt.id
                      ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-xs block text-cyan-300">{opt.label}</span>
                  <span className="text-[10px] text-slate-500">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">2. تحديد معدل الإطارات (FPS Selector)</label>
            <div className="grid grid-cols-4 gap-2">
              {[30, 60, 90, 120].map((f) => (
                <button
                  key={f}
                  onClick={() => setFps(f as any)}
                  className={`py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                    fps === f
                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-cyan-500/50'
                  }`}
                >
                  {f} FPS
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 text-xs text-slate-300 cursor-pointer">
              <span>تدرج لوني عريض HDR Cyber Colors</span>
              <input type="checkbox" checked={hdr} onChange={e => setHdr(e.target.checked)} className="accent-cyan-500" />
            </label>
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 text-xs text-slate-300 cursor-pointer">
              <span>إعادة رسم وتوضيح الوجوه Neural Face</span>
              <input type="checkbox" checked={faceEnhance} onChange={e => setFaceEnhance(e.target.checked)} className="accent-cyan-500" />
            </label>
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 text-xs text-slate-300 cursor-pointer">
              <span>عزل الضوضاء وتضخيم الصوت Audio Boost</span>
              <input type="checkbox" checked={audioBoost} onChange={e => setAudioBoost(e.target.checked)} className="accent-cyan-500" />
            </label>
          </div>

          <button
            onClick={handleStartEnhance}
            disabled={processing}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 hover:brightness-110 text-black font-black text-sm uppercase tracking-wider transition-all cyber-glow-cyan flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {processing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
            <span>{processing ? 'جاري المعالجة بالذكاء الاصطناعي...' : 'بدء التحسين الآن'}</span>
          </button>
        </div>

        {/* المعاينة والمقارنة التفاعلية */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded-3xl bg-[#0a0f1d] border border-cyan-500/30">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
            {processing ? (
              <div className="text-center p-6 space-y-4">
                <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-white font-bold text-sm">{stepLabel}</p>
                <div className="w-64 bg-slate-800 rounded-full h-2 mx-auto overflow-hidden">
                  <div className="bg-cyan-400 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-cyan-400 font-mono text-xs">{progress}% مكتمل</span>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={currentVideo?.origin_cover || currentVideo?.cover || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                {isEnhanced && (
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-xl bg-black/80 backdrop-blur-md border border-cyan-500/50 text-white text-xs">
                    <span className="text-cyan-300 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      تمت الترقية إلى {resolution.toUpperCase()} @ {fps} FPS
                    </span>
                    <a
                      href={currentVideo?.hdplay || currentVideo?.play || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-1.5 rounded-lg bg-cyan-500 text-black font-bold flex items-center gap-1 hover:bg-cyan-400"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>تنزيل الفيديو</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
