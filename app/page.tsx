'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import InvitationCover from '@/components/InvitationCover';
import InvitationCard from '@/components/InvitationCard';

// Tạo hiệu ứng cánh hoa hồng rơi
function RosePetals() {
  const [petals, setPetals] = useState<Array<{ id: number; left: string; delay: string; duration: string; size: string }>>([]);

  useEffect(() => {
    // Chỉ tạo cánh hoa ở phía Client
    const generatedPetals = Array.from({ length: 15 }).map((_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${10 + Math.random() * 15}s`,
      size: `${12 + Math.random() * 16}px`,
    }));
    setPetals(generatedPetals);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="absolute block text-pastel-rose/30 opacity-70 pointer-events-none"
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
          ❀
        </span>
      ))}
    </div>
  );
}

// Component xử lý chính bao bọc trong Suspense để đọc URL SearchParams
function InvitationMain() {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL || 
    'https://script.google.com/macros/s/AKfycbxEaNELLVcf6o3ZSjN4LEyBUpj_QTn-KOCIVOB6j_FtqFUQVFp2PrJ6G3WohQYjpUSZ/exec';

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

  const handleOpenInvitation = (enteredName: string) => {
    setName(enteredName);
    setStep(2);
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
    <main className="relative min-h-screen flex items-center justify-center py-12 px-4 md:px-8 bg-pastel-pink/40 z-10 overflow-hidden">
      {/* Hiệu ứng cánh hoa rơi lung linh ở nền */}
      <RosePetals />

      <div className="relative w-full z-10">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="cover"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="flex justify-center items-center w-full"
            >
              <InvitationCover onOpen={handleOpenInvitation} initialName={name} />
            </motion.div>
          ) : (
            <motion.div
              key="card"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-full"
            >
              <InvitationCard 
                name={name} 
                googleScriptUrl={googleScriptUrl} 
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
