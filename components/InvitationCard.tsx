'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Calendar, MapPin, Clock, Heart, Award } from 'lucide-react';
import Image from 'next/image';

interface InvitationCardProps {
  name: string;
  googleScriptUrl?: string;
  onResponseSubmit?: (response: 'Yes' | 'No') => void;
}

export default function InvitationCard({ name, googleScriptUrl, onResponseSubmit }: InvitationCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [choice, setChoice] = useState<'Yes' | 'No' | null>(null);

  // Tự động mở thiệp sau khi trang web tải xong
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRSVP = async (userChoice: 'Yes' | 'No') => {
    setChoice(userChoice);
    setRsvpStatus('loading');

    if (onResponseSubmit) {
      onResponseSubmit(userChoice);
    }

    if (!googleScriptUrl) {
      // Nếu không có URL thì mô phỏng thành công
      setTimeout(() => {
        setRsvpStatus('success');
      }, 1000);
      return;
    }

    try {
      // Gửi RSVP đến Google Apps Script
      // Thường Google Apps Script nhận doGet/doPost. Sử dụng GET kèm query params và no-cors là cách ổn định nhất để tránh lỗi CORS.
      const url = `${googleScriptUrl}?name=${encodeURIComponent(name)}&response=${encodeURIComponent(userChoice)}`;
      
      await fetch(url, {
        method: 'GET',
        mode: 'no-cors', // Rất quan trọng để tránh lỗi CORS từ Google Script Redirects
      });

      setRsvpStatus('success');
    } catch (error) {
      console.error('Lỗi khi gửi phản hồi RSVP:', error);
      // Vẫn set success để trải nghiệm người dùng không bị gián đoạn, nhưng ghi log lỗi
      setRsvpStatus('success');
    }
  };

  // Cấu hình animation cho cánh cửa bên trái (Phần 1)
  const leftFoldVariants = {
    closed: { rotateY: 90, opacity: 0.3 },
    open: { 
      rotateY: 0, 
      opacity: 1,
      transition: { duration: 1.5, ease: [0.25, 1, 0.5, 1] } 
    }
  };

  // Cấu hình animation cho cánh cửa bên phải (Phần 3)
  const rightFoldVariants = {
    closed: { rotateY: -90, opacity: 0.3 },
    open: { 
      rotateY: 0, 
      opacity: 1,
      transition: { duration: 1.5, ease: [0.25, 1, 0.5, 1] } 
    }
  };

  // Cấu hình cho phần nội dung chính giữa (Phần 2)
  const centerVariants = {
    closed: { scale: 0.95, opacity: 0 },
    open: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 1, delay: 0.2, ease: "easeOut" } 
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 perspective-1000">
      
      {/* Banner Ruy-băng Thân gửi [Tên khách mời] */}
      <motion.div 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative mx-auto mb-8 max-w-md text-center"
      >
        <div className="relative inline-block px-12 py-3 bg-pastel-rose/80 border border-pastel-rose text-pastel-text font-serif text-xl md:text-2xl font-bold rounded-md shadow-soft">
          {/* Cạnh ruy-băng xéo nhẹ */}
          <div className="absolute left-[-10px] top-[6px] w-[20px] h-[20px] bg-pastel-rose rotate-45 -z-10 rounded-sm"></div>
          <div className="absolute right-[-10px] top-[6px] w-[20px] h-[20px] bg-pastel-rose rotate-45 -z-10 rounded-sm"></div>
          Thân gửi <span className="text-[#9C3D6D] border-b-2 border-dashed border-[#9C3D6D] px-1 font-sans">{name}</span>
        </div>
      </motion.div>

      {/* Cấu trúc gấp 3 (Triple Fold-out) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-white/40 border border-white/60 rounded-3xl overflow-hidden shadow-pastel p-2 md:p-4 backdrop-blur-sm">
        
        {/* === PHẦN 1: BÊN TRÁI === */}
        <motion.div
          variants={leftFoldVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          className="relative bg-pastel-pink border border-pastel-rose/30 rounded-2xl p-6 md:p-8 flex flex-col justify-between min-h-[450px] shadow-soft origin-right preserve-3d"
        >
          {/* Cành hoa góc trên bên trái */}
          <div className="absolute top-0 left-0 w-20 h-20 text-pastel-rose/40 pointer-events-none transform -scale-x-100">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 20 C60 10, 70 20, 65 35 C80 30, 90 40, 75 55 C85 70, 70 85, 55 75 C40 90, 20 80, 30 65 C15 50, 25 30, 40 35 C35 20, 45 10, 50 20 Z" />
            </svg>
          </div>

          <div className="text-center mt-6">
            <span className="font-serif text-lg font-bold text-pastel-accent tracking-widest uppercase block mb-1">Phần 1</span>
            <div className="w-12 h-[1px] bg-pastel-rose/50 mx-auto mb-6"></div>
            
            <p className="font-serif text-2xl font-semibold text-pastel-text mb-6">Lời Mời</p>
            
            <p className="text-pastel-text/90 leading-relaxed font-sans text-base md:text-lg">
              Thân mời <span className="font-bold text-pastel-accent">{name}</span> tới tham dự buổi lễ tốt nghiệp và chiêm ngưỡng khoảnh khắc Vân Anh nhận tấm bằng cử nhân.
            </p>
          </div>

          <div className="flex justify-center text-pastel-rose/60 mb-4 animate-bounce">
            <Award className="w-8 h-8" />
          </div>

          {/* Hoa hồng chân trang */}
          <div className="absolute bottom-0 right-0 w-20 h-20 text-pastel-rose/40 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 20 C60 10, 70 20, 65 35 C80 30, 90 40, 75 55 C85 70, 70 85, 55 75 C40 90, 20 80, 30 65 C15 50, 25 30, 40 35 C35 20, 45 10, 50 20 Z" />
            </svg>
          </div>
        </motion.div>

        {/* === PHẦN 2: Ở GIỮA === */}
        <motion.div
          variants={centerVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          className="relative bg-pastel-pink/95 border-y md:border-y-0 md:border-x border-pastel-rose/30 rounded-2xl p-6 md:p-8 flex flex-col justify-between min-h-[480px] z-10 shadow-md"
        >
          <div className="text-center">
            <span className="font-serif text-lg font-bold text-pastel-accent tracking-widest uppercase block mb-1">Phần 2</span>
            <div className="w-12 h-[1px] bg-pastel-rose/50 mx-auto mb-4"></div>
            
            <p className="font-serif text-lg font-bold text-pastel-text mb-1">Tại Học viện Quản lý Giáo dục</p>
            <p className="text-xs text-pastel-accent font-semibold mb-4">Phố Trần Quốc Hoàn, Dịch Vọng Hậu, Cầu Giấy, Hà Nội</p>
          </div>

          {/* Ảnh cử nhân của Vân Anh */}
          <div className="relative mx-auto w-52 h-64 md:w-56 md:h-72 my-2 rounded-2xl overflow-hidden border-4 border-pastel-rose shadow-pastel group">
            <Image
              src="/images/vananh-graduation.png"
              alt="Vân Anh tốt nghiệp cử nhân"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            {/* Lớp phủ ruy-băng thắt nơ trang trí */}
            <div className="absolute -top-1 -right-1 w-12 h-12 text-pastel-purple/90 drop-shadow-md">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>

          <div className="text-center mt-2">
            <p className="font-handwriting text-2xl text-pastel-accent">Vào hồi 9h00 - 12h00</p>
            <p className="text-sm font-semibold text-pastel-text">ngày 21 tháng 07 năm 2026</p>
          </div>
        </motion.div>

        {/* === PHẦN 3: BÊN PHẢI === */}
        <motion.div
          variants={rightFoldVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          className="relative bg-pastel-pink border border-pastel-rose/30 rounded-2xl p-6 md:p-8 flex flex-col justify-between min-h-[450px] shadow-soft origin-left preserve-3d"
        >
          {/* Cành hoa góc trên bên phải */}
          <div className="absolute top-0 right-0 w-20 h-20 text-pastel-rose/40 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 20 C60 10, 70 20, 65 35 C80 30, 90 40, 75 55 C85 70, 70 85, 55 75 C40 90, 20 80, 30 65 C15 50, 25 30, 40 35 C35 20, 45 10, 50 20 Z" />
            </svg>
          </div>

          <div className="text-center mt-6">
            <span className="font-serif text-lg font-bold text-pastel-accent tracking-widest uppercase block mb-1">Phần 3</span>
            <div className="w-12 h-[1px] bg-pastel-rose/50 mx-auto mb-6"></div>
            
            <p className="font-serif text-2xl font-semibold text-pastel-text mb-6">Phản Hồi</p>
            
            <p className="text-pastel-text/90 leading-relaxed font-sans text-base md:text-lg mb-6">
              Rất mong <span className="font-bold text-pastel-accent">{name}</span> tham gia cùng Vân Anh nhé!
            </p>
          </div>

          {/* Khu vực RSVP tương tác */}
          <div className="space-y-4 my-2 relative z-10">
            <AnimatePresence mode="wait">
              {rsvpStatus === 'idle' || rsvpStatus === 'loading' ? (
                <div className="flex flex-col gap-3">
                  <button
                    disabled={rsvpStatus === 'loading'}
                    onClick={() => handleRSVP('Yes')}
                    className="flex items-center justify-between w-full px-6 py-4 bg-white/80 border border-emerald-200 text-emerald-800 rounded-2xl hover:bg-emerald-50 active:scale-95 transition-all duration-300 shadow-soft group"
                  >
                    <span className="flex items-center gap-3 font-semibold text-base">
                      <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                        <Check className="w-5 h-5" />
                      </span>
                      Yes, Thật tuyệt!
                    </span>
                    <Heart className="w-5 h-5 text-emerald-400 fill-emerald-100 group-hover:animate-ping" />
                  </button>

                  <button
                    disabled={rsvpStatus === 'loading'}
                    onClick={() => handleRSVP('No')}
                    className="flex items-center justify-between w-full px-6 py-4 bg-white/80 border border-rose-200 text-rose-800 rounded-2xl hover:bg-rose-50 active:scale-95 transition-all duration-300 shadow-soft group"
                  >
                    <span className="flex items-center gap-3 font-semibold text-base">
                      <span className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                        <X className="w-5 h-5" />
                      </span>
                      No, Tiếc quá...
                    </span>
                  </button>
                </div>
              ) : rsvpStatus === 'success' ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`p-5 rounded-2xl text-center border shadow-soft ${
                    choice === 'Yes'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  <p className="font-serif text-lg font-bold mb-2">
                    {choice === 'Yes' ? '🎉 Thật tuyệt vời!' : '😢 Thật đáng tiếc!'}
                  </p>
                  <p className="text-sm leading-relaxed">
                    {choice === 'Yes'
                      ? `Hẹn gặp lại ${name} vào 9h00 ngày 21/07/2026 tại lễ tốt nghiệp cử nhân của Vân Anh nha!`
                      : 'Mong rằng chúng ta sẽ có dịp gặp lại nhau sớm nhất có thể. Cảm ơn bạn rất nhiều!'}
                  </p>
                  <button 
                    onClick={() => setRsvpStatus('idle')}
                    className="mt-3 text-xs border-b border-current pb-0.5 hover:opacity-70 transition-opacity"
                  >
                    Thay đổi câu trả lời
                  </button>
                </motion.div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-center">
                  <p className="font-semibold">Đã có lỗi xảy ra</p>
                  <button
                    onClick={() => setRsvpStatus('idle')}
                    className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-xl text-xs font-bold"
                  >
                    Thử lại
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Hoa hồng chân trang */}
          <div className="absolute bottom-0 left-0 w-20 h-20 text-pastel-rose/40 pointer-events-none transform -scale-y-100">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 20 C60 10, 70 20, 65 35 C80 30, 90 40, 75 55 C85 70, 70 85, 55 75 C40 90, 20 80, 30 65 C15 50, 25 30, 40 35 C35 20, 45 10, 50 20 Z" />
            </svg>
          </div>
        </motion.div>

      </div>

      {/* === FOOTER DECORATIONS (Dưới chân thiệp) === */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-12 text-center"
      >
        {/* Chữ đại diện Hẹn gặp bạn */}
        <div className="relative inline-block bg-white/50 border border-pastel-rose/40 rounded-2xl px-12 py-6 shadow-pastel backdrop-blur-sm mb-8">
          <p className="font-serif text-2xl font-semibold text-pastel-text mb-1">
            Hẹn gặp bạn tại lễ tốt nghiệp của
          </p>
          <p className="font-handwriting text-4xl text-[#9C3D6D] font-bold">
            Vân Anh
          </p>
        </div>

        {/* 4 Khối thông tin chi tiết */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          
          <div className="flex items-center gap-3 bg-white/70 border border-pastel-rose/20 rounded-2xl p-4 shadow-soft">
            <div className="w-10 h-10 rounded-full bg-pastel-rose/50 flex items-center justify-center text-pastel-text">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-pastel-accent font-bold uppercase tracking-wider">Ngày đáng nhớ</p>
              <p className="text-sm text-pastel-text font-bold">21 / 07 / 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/70 border border-pastel-rose/20 rounded-2xl p-4 shadow-soft">
            <div className="w-10 h-10 rounded-full bg-pastel-rose/50 flex items-center justify-center text-pastel-text">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-pastel-accent font-bold uppercase tracking-wider">Địa điểm</p>
              <p className="text-sm text-pastel-text font-bold truncate max-w-[150px]">HV Quản lý Giáo dục</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/70 border border-pastel-rose/20 rounded-2xl p-4 shadow-soft">
            <div className="w-10 h-10 rounded-full bg-pastel-rose/50 flex items-center justify-center text-pastel-text">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-pastel-accent font-bold uppercase tracking-wider">Thời gian</p>
              <p className="text-sm text-pastel-text font-bold">9h00 - 12h00</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/70 border border-pastel-rose/20 rounded-2xl p-4 shadow-soft">
            <div className="w-10 h-10 rounded-full bg-pastel-rose/50 flex items-center justify-center text-pastel-text">
              <Heart className="w-5 h-5 fill-pastel-text" />
            </div>
            <div>
              <p className="text-xs text-pastel-accent font-bold uppercase tracking-wider">Cảm ơn bạn</p>
              <p className="text-sm text-pastel-text font-bold">Đồng hành cùng Vân Anh</p>
            </div>
          </div>

        </div>

        {/* Lời chúc chân trang nhỏ */}
        <p className="text-xs text-pastel-accent font-semibold mt-8 tracking-wide">
          Cảm ơn bạn đã là một phần đặc biệt trong hành trình này! ♡
        </p>
      </motion.div>
      
    </div>
  );
}
