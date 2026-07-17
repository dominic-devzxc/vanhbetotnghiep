"use client";

import Image from "next/image";
import { CalendarDays, Check, Clock3, MapPin, Send, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";

type Attendance = "yes" | "no";
type RsvpStage = "choice" | "message" | "sending" | "success" | "error";

interface InvitationCardProps {
  name: string;
  onResponseSubmit?: (response: "Yes" | "No") => void;
}

const invitationArtwork = "/images/3a683aea-88a7-43e7-86fc-8019469ecb0a%20(1).png";

const responseCopy = {
  yes: {
    title: "Thật tuyệt!",
    text: "Vân Anh sẽ hạnh phúc lắm khi có bạn ở đó. Cảm ơn bạn đã dành thời gian chung vui trong khoảnh khắc này.",
  },
  no: {
    title: "Thật đáng tiếc!",
    text: "Vân Anh vẫn rất trân trọng lời chúc của bạn và mong chúng ta sẽ sớm gặp nhau vào một dịp thật gần.",
  },
} as const;

export default function InvitationCard({ name, onResponseSubmit }: InvitationCardProps) {
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [message, setMessage] = useState("");
  const [stage, setStage] = useState<RsvpStage>("choice");
  const reduceMotion = useReducedMotion();

  function chooseAttendance(choice: Attendance) {
    setAttendance(choice);
    
    if (choice === "yes") {
      // Bắn pháo hoa giấy chúc mừng khi click chọn Tham dự
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#FBEFEF', '#FFE2E2', '#F5CBCB', '#C5B3D3', '#A594C1']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#FBEFEF', '#FFE2E2', '#F5CBCB', '#C5B3D3', '#A594C1']
      });
    }

    setStage("message");
  }

  async function sendResponse() {
    if (!attendance) return;
    setStage("sending");

    try {
      const response = await fetch("/api/rsvp", {
        body: JSON.stringify({ attendance, guestName: name, message: message.trim() }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) throw new Error("Unable to save RSVP");

      if (attendance === "yes") onResponseSubmit?.("Yes");
      setStage("success");
    } catch {
      setStage("error");
    }
  }

  const copy = attendance ? responseCopy[attendance] : null;

  return (
    <section className="mx-auto w-full max-w-md px-1 py-3 sm:px-4" aria-labelledby="invitation-title">
      <motion.article animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[2rem] border border-white/80 bg-pastel-pink shadow-pastel" initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }} transition={{ duration: reduceMotion ? 0.01 : 0.45 }}>
        <div className="relative bg-pastel-peach">
          <img alt="Thiệp mời tham dự lễ tốt nghiệp của Đào Vân Anh" className="w-full h-auto block" src={invitationArtwork} />
          <p aria-hidden="true" className="absolute inset-x-[17%] bottom-[18.5%] truncate text-center font-handwriting text-2xl font-semibold leading-none text-pastel-accent drop-shadow-sm sm:text-3xl">
            {name}
          </p>
        </div>

        <div className="px-6 pb-7 pt-6 sm:px-8">
          <p className="text-center text-xs font-bold tracking-[0.18em] text-pastel-accent uppercase">Thiệp mời tốt nghiệp</p>
          <h1 className="mt-3 text-center font-serif text-3xl leading-tight font-semibold text-pastel-text" id="invitation-title">Thân mời <span className="text-[#9C3D6D]">{name}</span></h1>
          <p className="mt-3 text-center text-base leading-7 text-pastel-text/85">Đến chung vui và chứng kiến khoảnh khắc Vân Anh nhận bằng cử nhân.</p>

          <dl className="mt-6 divide-y divide-pastel-rose/50 rounded-2xl border border-pastel-rose/50 bg-white/55 px-4">
            <div className="flex gap-3 py-4"><MapPin aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-pastel-accent" /><div><dt className="text-xs font-bold tracking-wide text-pastel-accent uppercase">Địa điểm</dt><dd className="mt-1 font-semibold text-pastel-text">Học viện Quản lý Giáo dục</dd></div></div>
            <div className="flex gap-3 py-4"><Clock3 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-pastel-accent" /><div><dt className="text-xs font-bold tracking-wide text-pastel-accent uppercase">Thời gian</dt><dd className="mt-1 font-semibold text-pastel-text">09:00 – 12:00</dd></div></div>
            <div className="flex gap-3 py-4"><CalendarDays aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-pastel-accent" /><div><dt className="text-xs font-bold tracking-wide text-pastel-accent uppercase">Ngày lễ</dt><dd className="mt-1 font-semibold text-pastel-text">Thứ Ba, 21 tháng 07 năm 2026</dd></div></div>
          </dl>

          <div className="mt-7" aria-live="polite">
            <AnimatePresence mode="wait">
              {stage === "choice" ? (
                <motion.div
                  key="choice"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <p className="mb-3 text-center text-sm font-semibold text-pastel-text">Bạn có thể đến chung vui không?</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="group flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#F5CBCB] to-[#C5B3D3] px-3 text-sm font-bold text-[#7C5B8B] shadow-soft transition-all duration-300 ease-out hover:from-[#FFE2E2] hover:to-[#D4C5E2] hover:shadow-[0_8px_25px_-5px_rgba(245,203,203,0.5)] hover:scale-[1.03] active:scale-[0.97]" onClick={() => chooseAttendance("yes")} type="button">
                      <Check aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:scale-125" />
                      Tham dự
                    </button>
                    <button className="group flex h-14 items-center justify-center gap-2 rounded-2xl border border-[#7C5B8B]/25 bg-white/60 px-3 text-sm font-semibold text-pastel-text shadow-soft transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-[#FBEFEF] hover:to-[#FFE2E2] hover:text-[#9C3D6D] hover:border-[#9C3D6D]/45 hover:shadow-[0_8px_25px_-5px_rgba(124,91,139,0.15)] hover:scale-[1.03] active:scale-[0.97]" onClick={() => chooseAttendance("no")} type="button">
                      <X aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                      Không tham dự
                    </button>
                  </div>
                </motion.div>
              ) : stage === "success" && copy ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="rounded-2xl border border-pastel-purple/50 bg-pastel-purple/20 p-5 text-center"
                >
                  <p className="font-serif text-xl font-semibold text-pastel-text">{copy.title}</p>
                  <p className="mt-2 text-sm leading-6 text-pastel-text/80">{copy.text}</p>
                  <p className="mt-3 text-xs font-semibold text-pastel-accent">Vân Anh đã nhận được phản hồi của bạn.</p>
                </motion.div>
              ) : copy ? (
                <motion.div
                  key="message"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="rounded-2xl border border-pastel-purple/40 bg-white/60 p-5"
                >
                  <p className="text-center font-serif text-xl font-semibold text-pastel-text">{copy.title}</p>
                  <p className="mt-2 text-center text-sm leading-6 text-pastel-text/80">{copy.text}</p>
                  <label className="mt-5 block text-sm font-semibold text-pastel-text" htmlFor="guest-message">Đôi lời gửi Vân Anh <span className="font-normal text-pastel-text/60">(không bắt buộc)</span></label>
                  <textarea className="mt-2 min-h-28 w-full resize-y rounded-2xl border border-pastel-rose/70 bg-white/80 px-4 py-3 text-sm leading-6 text-pastel-text outline-none placeholder:text-pastel-text/45 focus:border-pastel-accent focus:ring-4 focus:ring-pastel-purple/35" id="guest-message" maxLength={500} onChange={(event) => setMessage(event.target.value)} placeholder="Viết một lời chúc thật ấm áp…" value={message} />
                  <button className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-pastel-text px-4 text-sm font-semibold text-white transition hover:bg-[#65466F] active:scale-[0.98] disabled:opacity-60" disabled={stage === "sending"} onClick={sendResponse} type="button"><Send aria-hidden="true" className="h-4 w-4" /> {stage === "sending" ? "Đang gửi" : "Gửi phản hồi"}</button>
                  {stage === "error" ? <p className="mt-3 text-center text-sm font-medium text-[#9C3D6D]" role="alert">Chưa gửi được phản hồi. Bạn thử lại nhé.</p> : null}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <p className="mt-7 text-center font-handwriting text-3xl text-pastel-accent">Đào Vân Anh</p>
        </div>
      </motion.article>
    </section>
  );
}
