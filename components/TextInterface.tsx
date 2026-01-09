
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mood } from '../types';
import { THEMES } from '../constants';

// Scramble/Decode Effect Component
const DecodingText = ({ text, delay = 0 }) => {
    const [display, setDisplay] = useState('');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*†‡§¶';
    const intervalRef = useRef(null);
    const finishedRef = useRef(false);

    useEffect(() => {
        let iteration = 0;
        setDisplay(''); // Reset
        finishedRef.current = false;

        const startTimeout = setTimeout(() => {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setDisplay(prev => {
                    return text
                        .split("")
                        .map((letter, index) => {
                            if (index < iteration) {
                                return text[index];
                            }
                            if (letter === ' ' || letter === '\n') return letter;
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join("");
                });

                if (iteration >= text.length) {
                    clearInterval(intervalRef.current);
                    finishedRef.current = true;
                }
                
                iteration += 1 / 2; 
            }, 30);
        }, delay * 1000);

        return () => {
            clearTimeout(startTimeout);
            clearInterval(intervalRef.current);
        };
    }, [text, delay]);

    return <span>{display}</span>;
}

export const TextInterface = ({ data, onChoice }) => {
  const theme = THEMES[data.mood];
  const [showChoices, setShowChoices] = useState(false);

  useEffect(() => {
    setShowChoices(false);
    const timer = setTimeout(() => {
        setShowChoices(true);
    }, 2000 + data.text.length * 30); 
    return () => clearTimeout(timer);
  }, [data]);

  const isReligious = data.mood === Mood.SANCTUARY || data.mood === Mood.PHILOSOPHY;

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-16 pointer-events-none">
      
      {/* Decorative Lines / Borders - Lain Style */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* HUD Elements */}
      <div className="w-full flex justify-between items-start font-mono-tech text-[10px] md:text-xs tracking-[0.2em] opacity-80 text-white/90 drop-shadow-md">
        <div className="flex flex-col gap-2 border-l-2 pl-4" style={{ borderColor: theme.primary }}>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-current animate-pulse"/>
                <span>STATUS: {data.mood}</span>
            </div>
            <span>MEM_ADDR: 0x{data.id.toString(16).padStart(4, '0').toUpperCase()}</span>
            <span className="opacity-50">{isReligious ? 'LATERAL_HYPER_SYNC' : 'NEURAL_STABLE'}</span>
        </div>
        <div className="text-right border-r-2 pr-4" style={{ borderColor: theme.accent }}>
            <div className="font-bold">PRTS_V4.0</div>
            <div>LAYER: {data.id}</div>
            <div className="mt-2 font-bold animate-pulse" style={{ color: theme.primary }}>
                {data.mood === Mood.CONFLICT ? '!!! ALERT !!!' : 'MONITORING'}
            </div>
        </div>
      </div>

      {/* Main Content Area - Added Background for Readability */}
      <div className="flex-1 flex flex-col justify-center items-start max-w-5xl mx-auto w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={data.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-auto relative p-8 md:p-12"
          >
             {/* Readability Backdrop */}
             <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent blur-xl -z-10" />

             {/* Decoration line */}
             <div className="absolute -left-0 top-10 bottom-10 w-1 bg-gradient-to-b from-transparent via-white to-transparent opacity-40" />

             {/* Main Text */}
             <div 
                className="font-serif-sc text-2xl md:text-4xl lg:text-5xl leading-relaxed md:leading-tight font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
                style={{ textShadow: '0 0 20px rgba(0,0,0,0.8)' }}
             >
                <DecodingText text={data.text} delay={0.5} />
             </div>

             {/* Source Quote - BACKGROUND REMOVED */}
             <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 0.9, x: 0 }}
                transition={{ delay: 2, duration: 1 }}
                className="mt-12 font-mono-tech text-xs md:text-sm uppercase tracking-widest flex items-center gap-4 p-2 inline-block border-l-2"
                style={{ color: theme.accent, borderColor: theme.accent }}
             >
                <span>{data.source}</span>
             </motion.div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer / Choices */}
      <div className="w-full min-h-[150px] flex flex-col items-end justify-end pointer-events-auto pb-12">
        <AnimatePresence>
            {showChoices && (
                <motion.div 
                    className="flex flex-col items-end gap-3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="text-xs font-mono-tech mb-2 text-white/70 tracking-widest bg-black/50 px-2">AWAITING INPUT...</div>
                    {data.choices.map((choice, idx) => (
                        <button
                            key={idx}
                            onClick={() => onChoice(choice.nextId)}
                            className="group relative px-12 py-4 bg-black/60 border border-white/20 hover:border-white text-white font-mono-tech text-lg uppercase tracking-widest transition-all duration-200 overflow-hidden backdrop-blur-md shadow-lg"
                        >
                            <span className="relative z-10 flex items-center gap-4 group-hover:gap-6 transition-all drop-shadow-md">
                                <span className="text-xs opacity-50">0{idx+1}</span>
                                {choice.label}
                            </span>
                            
                            {/* Hover Fill Effect */}
                            <div 
                                className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-in-out z-0 mix-blend-overlay"
                                style={{ backgroundColor: theme.primary }}
                            />
                            {/* Corner Decos */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
        
        {/* Decorative Progress Lines */}
        <div className="w-full h-px bg-white/10 mt-8 relative flex items-center">
            <div className="absolute left-0 -top-4 font-mono-tech text-[9px] text-white/50 bg-black/50 px-1">TIMELINE_OFFSET</div>
            <motion.div 
                className="h-[2px] shadow-[0_0_10px_rgba(255,255,255,0.8)]" 
                style={{ backgroundColor: theme.primary }}
                initial={{ width: '0%' }}
                animate={{ width: `${((data.id + 1) / 13) * 100}%` }}
                transition={{ duration: 1 }}
            />
        </div>
      </div>
    </div>
  );
};
