import React, { useState, useEffect } from 'react';
import { Visualizer3D } from './components/Visualizer3D';
import { TextInterface } from './components/TextInterface';
import { STORY_DATA } from './constants';
import { audioManager } from './utils/audioEngine';

const App = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStoryId, setCurrentStoryId] = useState(0);

  const currentStoryNode = STORY_DATA.find(n => n.id === currentStoryId) || STORY_DATA[0];

  useEffect(() => {
    if (hasStarted) {
      audioManager.setMood(currentStoryNode.mood);
    }
  }, [currentStoryNode, hasStarted]);

  const handleStart = async () => {
    await audioManager.start();
    setHasStarted(true);
  };

  const handleChoice = (nextId) => {
    setCurrentStoryId(nextId);
  };

  // Intro / Start Screen
  if (!hasStarted) {
    return (
      <div 
        onClick={handleStart}
        className="w-full h-screen bg-black flex flex-col items-center justify-center cursor-pointer font-mono-tech text-white overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,50,255,0.1)_0%,_transparent_70%)] opacity-50 animate-pulse" />
        <div className="z-10 text-center space-y-4 p-8 border border-white/20 bg-black/50 backdrop-blur-md">
          <div className="text-4xl md:text-6xl tracking-[0.2em] font-bold">TERRA</div>
          <div className="h-px w-full bg-white/30" />
          <div className="text-sm md:text-base opacity-70 animate-bounce pt-4">&gt;&gt; CLICK TO INITIALIZE NEURAL LINK &lt;&lt;</div>
          <div className="text-[10px] opacity-40 pt-12">AUDIO OUTPUT REQUIRED</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white selection:bg-cyan-500 selection:text-black">
      
      {/* 3D Background Layer */}
      <Visualizer3D mood={currentStoryNode.mood} />

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-[5] pointer-events-none scanline opacity-20" />
      
      <div className="absolute inset-0 z-[5] pointer-events-none opacity-[0.08] mix-blend-overlay"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
           }}
      />

      <div className="absolute inset-0 z-[5] pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.9)_100%)]" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-[4] pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* UI Layer */}
      <TextInterface 
        data={currentStoryNode} 
        onChoice={handleChoice} 
      />

    </div>
  );
};

export default App;