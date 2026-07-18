'use client';

import React, { useCallback, useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import InvitationCover from '@/components/InvitationCover';
import InvitationCard from '@/components/InvitationCard';

// Tạo hiệu ứng hoa anh đào rơi nhẹ
function RosePetals({ count = 9 }: { count?: number }) {
  const [petals, setPetals] = useState<Array<{ id: number; left: string; delay: string; duration: string; size: string; glyph: string }>>([]);

  useEffect(() => {
    // Chỉ tạo cánh hoa ở phía Client
    const generatedPetals = Array.from({ length: count }).map((_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${10 + Math.random() * 15}s`,
      size: `${12 + Math.random() * 10}px`,
      glyph: index % 3 === 0 ? '🌸' : '❀',
    }));
    setPetals(generatedPetals);
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="pointer-events-none absolute block text-pastel-rose/35 opacity-45 will-change-transform"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            fontSize: petal.size,
            animationName: 'leaf-fall',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            top: '-5%',
          }}
        >
          {petal.glyph}
        </span>
      ))}
    </div>
  );
}

// Component xử lý chính bao bọc trong Suspense để đọc URL SearchParams
function InvitationMain() {
  const [stage, setStage] = useState<'cover' | 'opening' | 'invitation'>('cover');
  const [name, setName] = useState('');
  const [minimumLoadingDone, setMinimumLoadingDone] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneOpeningComplete, setSceneOpeningComplete] = useState(false);
  const [clickRipples, setClickRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const clickSequence = useRef(0);
  const reduceMotion = useReducedMotion();
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  useEffect(() => {
    // Khởi tạo nhạc nền
    const audio = new Audio('/sound/Graduation Song.mp3');
    audio.loop = true;
    audio.volume = 0.45;
    bgAudioRef.current = audio;

    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!bgAudioRef.current) return;
    if (musicPlaying) {
      bgAudioRef.current.pause();
      setMusicPlaying(false);
    } else {
      bgAudioRef.current.play()
        .then(() => setMusicPlaying(true))
        .catch((err) => console.log('Music play blocked:', err));
    }
  };


  const markSceneReady = useCallback(() => setSceneReady(true), []);

  useEffect(() => {
    // Đọc tên từ URL Query (?to=Văn Anh)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const toName = params.get('to');
      if (toName) {
        setName(toName);
      }
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setMinimumLoadingDone(true), 1100);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (stage !== 'opening' || !reduceMotion) return;

    const timer = window.setTimeout(
      () => setStage('invitation'),
      reduceMotion ? 250 : 2750,
    );
    return () => window.clearTimeout(timer);
  }, [reduceMotion, stage]);

  const showLoading = !minimumLoadingDone || !sceneReady;

  const handleOpenInvitation = (enteredName: string) => {
    setName(enteredName);
    setSceneOpeningComplete(false);
    setStage('opening');

    // Phát âm thanh mở thư
    try {
      const audio = new Audio('/sound/open-letter.mp3');
      audio.volume = 0.8;
      audio.play().catch((err) => console.log('Audio playback failed or blocked:', err));
    } catch (error) {
      console.log('Audio playback initialization failed:', error);
    }
  };

  const handleSceneOpeningComplete = useCallback(() => {
    setSceneOpeningComplete(true);
  }, []);

  useEffect(() => {
    if (!sceneOpeningComplete || stage !== 'opening') return;
    const timer = window.setTimeout(() => setStage('invitation'), 220);
    return () => window.clearTimeout(timer);
  }, [sceneOpeningComplete, stage]);

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    // Tự động phát nhạc nền ở tương tác đầu tiên
    if (bgAudioRef.current && !musicPlaying) {
      bgAudioRef.current.play()
        .then(() => setMusicPlaying(true))
        .catch((err) => console.log('Auto music play blocked:', err));
    }

    if (reduceMotion) return;

    const id = clickSequence.current++;
    setClickRipples((current) => [...current, { id, x: event.clientX, y: event.clientY }]);
    window.setTimeout(() => {
      setClickRipples((current) => current.filter((ripple) => ripple.id !== id));
    }, 650);
  };

  const triggerConfetti = (choice: 'Yes' | 'No') => {
    if (choice !== 'Yes') return;

    // Định nghĩa màu sắc pháo hoa pastel
    const colors = ['#FBEFEF', '#FFE2E2', '#F5CBCB', '#C5B3D3', '#A594C1'];

    // Bắn từ bên trái
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.8 },
      colors: colors,
    });

    // Bắn từ bên phải
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.8 },
      colors: colors,
    });

    // Bắn loạt trung tâm sau đó 200ms
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
        colors: colors,
      });
    }, 200);
  };

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#FFF6F8] px-4 py-8 md:px-8 md:py-12" onPointerDown={handlePointerDown}>
      {stage !== 'invitation' ? (
        <Image
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 h-dvh w-dvw object-cover opacity-90"
          height={1536}
          priority
          sizes="100vw"
          src="/images/pastel-floral-frame.png"
          width={1024}
        />
      ) : null}

      {/* Nút điều khiển nhạc nền quay tròn dễ thương */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Ngăn kích hoạt click ripple
          toggleMusic();
        }}
        className={`fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/60 text-pastel-text shadow-soft backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 ${musicPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}
        aria-label={musicPlaying ? "Tắt nhạc nền" : "Bật nhạc nền"}
        type="button"
      >
        <span className="text-lg leading-none" style={{ marginTop: '-1px' }}>{musicPlaying ? "🎵" : "🔇"}</span>
      </button>


      <AnimatePresence>
        {clickRipples.map((ripple) => (
          <motion.span
            animate={{ opacity: 0, scale: 2.6 }}
            aria-hidden="true"
            className="pointer-events-none fixed z-[60] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-pastel-purple/60 bg-pastel-rose/25"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0.9, scale: 0.25 }}
            key={ripple.id}
            style={{ left: ripple.x, top: ripple.y }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {showLoading ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-pastel-pink px-6"
            exit={{ opacity: 0, scale: 1.03 }}
            initial={{ opacity: 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <RosePetals count={12} />
            <div className="relative z-10 w-full max-w-xs text-center">
              <motion.div
                animate={{ rotate: [0, 8, -6, 0], scale: [0.92, 1.08, 0.98, 0.92], y: [0, -7, 0] }}
                className="relative mx-auto flex h-28 w-28 items-center justify-center"
                transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity }}
              >
                <span className="text-7xl text-[#B89CC2] drop-shadow-sm" aria-hidden="true">✿</span>
                <motion.span animate={{ rotate: 360, x: [0, 8, 0] }} className="absolute -right-2 top-1 text-2xl text-[#C9ADD1]" transition={{ duration: 3.2, ease: 'linear', repeat: Infinity }} aria-hidden="true">❀</motion.span>
                <motion.span animate={{ rotate: -360, x: [0, -6, 0] }} className="absolute -left-1 bottom-2 text-xl text-[#E5D3EA]" transition={{ duration: 3.8, ease: 'linear', repeat: Infinity }} aria-hidden="true">❁</motion.span>
              </motion.div>
              <p className="mt-5 font-serif text-2xl font-semibold text-pastel-text">Hoa đang nở, thư sắp mở…</p>
              <p className="mt-2 text-sm leading-6 text-pastel-text/65">Vân Anh đang chuẩn bị lời mời dành riêng cho bạn.</p>
              <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-pastel-rose/40">
                <motion.div
                  animate={{ scaleX: [0.15, 1, 0.15], x: ['-45%', '45%', '-45%'] }}
                  className="h-full origin-left rounded-full bg-pastel-accent"
                  transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {stage === 'opening' && !reduceMotion ? (
          <motion.div
            animate={{ opacity: [0, 0.05, 0.95, 0.18, 0] }}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-40 bg-[radial-gradient(circle_at_center,_#FFFFFF_0%,_#FBEFEF_42%,_#FFE2E2_100%)]"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 2.75, ease: 'easeInOut', times: [0, 0.32, 0.55, 0.72, 1] }}
          />
        ) : null}
      </AnimatePresence>

      <p aria-live="polite" className="sr-only">
        {stage === 'opening' ? 'Phong thư đang mở. Thiệp mời sắp xuất hiện.' : ''}
      </p>

      <div className="relative w-full z-10">
        <AnimatePresence mode="wait">
          {stage !== 'invitation' ? (
            <motion.div
              key="cover"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={stage === 'opening' && !reduceMotion
                ? { opacity: [1, 1, 0], rotateX: [0, 0, 3], rotateY: [0, 0, -8], scale: [1, 1.03, 0.94], y: [0, -8, -18] }
                : { opacity: 1, rotateX: 0, rotateY: 0, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={stage === 'opening'
                ? { duration: reduceMotion ? 0.2 : 2.25, ease: 'easeInOut', times: [0, 0.7, 1] }
                : { duration: 0.6, ease: 'easeInOut' }}
              className={`flex w-full items-center justify-center ${stage === 'opening' ? 'pointer-events-none' : ''}`}
              style={{ perspective: 1200 }}
            >
              <InvitationCover
                initialName={name}
                onOpen={handleOpenInvitation}
                onOpeningComplete={handleSceneOpeningComplete}
                onSceneReady={markSceneReady}
                opening={stage === 'opening'}
              />
            </motion.div>
          ) : (
            <motion.div
              key="card"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1.15, ease: 'easeOut' }}
              className="w-full"
            >
              <InvitationCard 
                name={name} 
                onResponseSubmit={triggerConfetti} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-pastel-pink text-pastel-text font-serif text-xl">
        Đang mở thiệp hồng...
      </div>
    }>
      <InvitationMain />
    </Suspense>
  );
}
