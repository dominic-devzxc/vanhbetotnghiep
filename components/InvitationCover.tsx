"use client";

import dynamic from "next/dynamic";
import { ArrowDown, Flower2, GraduationCap, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

interface InvitationCoverProps {
  initialName?: string;
  onOpen: (name: string) => void;
  onOpeningComplete?: () => void;
  onSceneReady?: () => void;
  opening?: boolean;
}

const EnvelopeScene = dynamic(() => import("@/components/EnvelopeScene"), {
  loading: () => <div className="h-full animate-pulse rounded-[1.5rem] bg-[#F8E8EC]/80" />,
  ssr: false,
});

function StaticEnvelope({ armed, onSealClick }: { armed: boolean; onSealClick: () => void }) {
  return (
    <div className="flex h-full items-center justify-center" aria-hidden="true">
      <div className="relative aspect-[1.62] w-[92%] overflow-hidden rounded-xl border border-[#E0B77F]/55 bg-[#D7C0DE] shadow-pastel">
        <div className="absolute inset-0 bg-[#B89CC2] [clip-path:polygon(0_100%,0_0,52%_57%)]" />
        <div className="absolute inset-0 bg-[#D8C2DF] [clip-path:polygon(100%_100%,100%_0,48%_57%)]" />
        <div className="absolute inset-0 bg-[#C9ADD1] [clip-path:polygon(0_100%,100%_100%,50%_42%)]" />
        <div className="absolute inset-0 bg-[#E5D3EA] [clip-path:polygon(0_0,100%_0,50%_61%)]" />
        <button
          aria-label={armed ? "Mở thư bằng con dấu sáp" : "Nhập tên trước để mở thư"}
          className={`absolute left-1/2 top-[57%] grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[48%_52%_45%_55%/52%_46%_54%_48%] border-2 border-[#F4BEC0] bg-[#E9959F] text-[#FFE3D2] shadow-lg transition-transform active:scale-[0.98] ${armed ? "cursor-pointer ring-8 ring-[#FFE2B8]/40" : "cursor-default opacity-60"}`}
          onClick={onSealClick}
          type="button"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full border border-current text-xl leading-none">❧</span>
        </button>
      </div>
    </div>
  );
}

export default function InvitationCover({
  initialName = "",
  onOpen,
  onOpeningComplete,
  onSceneReady,
  opening = false,
}: InvitationCoverProps) {
  const [name, setName] = useState(initialName);
  const [armed, setArmed] = useState(false);
  const [loading3d, setLoading3d] = useState(true);
  const [notice, setNotice] = useState("");
  const [shakeInput, setShakeInput] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();

  const handleSceneReady = useCallback(() => {
    setLoading3d(false);
    onSceneReady?.();
  }, [onSceneReady]);

  useEffect(() => {
    if (reduceMotion) onSceneReady?.();
  }, [onSceneReady, reduceMotion]);

  useEffect(() => {
    const guestName = initialName.trim().slice(0, 80);
    if (!guestName) return;
    setName(guestName);
    setArmed(true);
    setNotice("Con dấu đã sáng lên. Bấm vào con dấu để mở thư nhé!");
  }, [initialName]);

  function activateName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const guestName = name.trim().slice(0, 80);
    if (!guestName) {
      setShakeInput((value) => value + 1);
      setNotice("Bạn hãy nhập tên trước nhé!");
      inputRef.current?.focus();
      return;
    }

    setName(guestName);
    setArmed(true);
    setNotice("Con dấu đã sáng lên. Bấm vào con dấu để mở thư nhé!");
  }

  function requestOpen() {
    if (!armed || !name.trim()) {
      setShakeInput((value) => value + 1);
      setNotice("Bạn hãy nhập tên trước nhé!");
      inputRef.current?.focus();
      return;
    }
    onOpen(name.trim());
  }

  return (
    <section aria-busy={opening} aria-labelledby="letter-title" className="relative mx-auto w-full max-w-[58rem] px-1 text-center sm:px-4">
      <header className="relative">
        <div className="mx-auto flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-full border-[3px] border-white bg-white/70 text-pastel-text shadow-[0_0_0_4px_rgba(247,196,218,0.45),0_10px_34px_rgba(193,132,164,0.2)] backdrop-blur-sm sm:h-24 sm:w-24">
          <GraduationCap aria-hidden="true" className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.8} />
        </div>
        <div aria-hidden="true" className="mx-auto mt-3 flex max-w-sm items-center gap-3 text-[#EBA9C6]">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-current" />
          <span className="text-xs">♡ · ✦ · ♡</span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-current" />
        </div>
        <h1 className="mx-auto mt-2 max-w-3xl font-serif text-[3.15rem] font-semibold leading-[0.95] tracking-[-0.045em] text-pastel-text drop-shadow-[0_3px_8px_rgba(124,91,139,0.12)] sm:text-7xl" id="letter-title">
          Thiệp mời tốt nghiệp
        </h1>
        <p className="mt-3 font-serif text-2xl italic text-pastel-accent sm:text-3xl">Nhập tên để mở thư</p>
        <div aria-hidden="true" className="mx-auto mt-4 flex max-w-[19rem] items-center gap-3 text-[#ED96BB]">
          <span className="h-px flex-1 bg-current" />
          <span className="text-xl drop-shadow-sm">♥</span>
          <span className="h-px flex-1 bg-current" />
        </div>
      </header>

      <form className="mx-auto mt-7 max-w-2xl text-left" onSubmit={activateName}>
        <label className="mb-2 block pl-3 text-base font-bold text-pastel-text sm:text-lg" htmlFor="guest-name">Tên gọi thân mật của bạn</label>
        <motion.div
          animate={shakeInput ? { x: [0, -8, 7, -5, 2, 0] } : { x: 0 }}
          className="rounded-full border-2 border-[#F0B8D1] bg-white/55 p-1.5 shadow-[0_10px_34px_rgba(210,140,174,0.2),inset_0_0_0_2px_rgba(255,255,255,0.9)] backdrop-blur-md focus-within:ring-4 focus-within:ring-[#E9BBD6]/40"
          transition={{ duration: 0.42 }}
        >
          <div className="flex h-16 items-center rounded-full bg-white/80 px-5">
            <Flower2 aria-hidden="true" className="mr-3 h-6 w-6 shrink-0 text-[#E59ABF]" strokeWidth={1.8} />
            <input
              aria-describedby="guest-notice"
              autoComplete="name"
              className="h-full w-full min-w-0 bg-transparent text-lg font-semibold text-pastel-text outline-none placeholder:text-pastel-text/40"
              disabled={opening}
              id="guest-name"
              maxLength={80}
              onChange={(event) => {
                const val = event.target.value;
                setName(val);
                const hasText = val.trim().length > 0;
                setArmed(hasText);
                if (hasText) {
                  setNotice("Con dấu đã sáng lên. Bấm vào con dấu để mở thư nhé!");
                } else {
                  setNotice("");
                }
              }}
              placeholder="Ví dụ: Linh, chị Hương…"
              ref={inputRef}
              value={name}
            />
          </div>
        </motion.div>
        <button className="sr-only" type="submit">Xác nhận tên để kích hoạt con dấu</button>
      </form>

      <p aria-live="polite" className="mt-4 min-h-6 text-base font-bold text-[#B34F79] sm:text-lg" id="guest-notice">{notice}</p>
      <div className="mt-1 flex items-center justify-center gap-2 font-serif text-lg italic text-pastel-text/75">
        <span>{armed ? "Bấm vào con dấu hoa để mở thư" : "Nhập tên để đánh thức con dấu"}</span>
        <ArrowDown aria-hidden="true" className="h-5 w-5" />
      </div>

      <div className="relative left-1/2 mt-2 h-[22rem] w-[100vw] max-w-[50rem] -translate-x-1/2 sm:h-[28rem] lg:h-[31rem]">
        {reduceMotion ? (
          <StaticEnvelope armed={armed} onSealClick={requestOpen} />
        ) : (
          <EnvelopeScene
            armed={armed}
            onInvalidSealClick={() => {
              setShakeInput((value) => value + 1);
              setNotice("Bạn hãy nhập tên trước nhé!");
              inputRef.current?.focus();
            }}
            onOpenComplete={() => onOpeningComplete?.()}
            onReady={handleSceneReady}
            onSealClick={requestOpen}
            opening={opening}
            reducedMotion={Boolean(reduceMotion)}
          />
        )}
        {loading3d && !reduceMotion ? (
          <div className="absolute inset-4 flex items-center justify-center rounded-[1.5rem] bg-[#F7E7E5]/90">
            <p className="flex items-center gap-2 text-sm font-semibold text-pastel-text"><Sparkles aria-hidden="true" className="h-5 w-5 animate-pulse" /> Đang dựng phong thư…</p>
          </div>
        ) : null}
        {armed && !opening ? (
          <button className="sr-only" onClick={requestOpen} type="button">Mở thư bằng con dấu sáp</button>
        ) : null}
      </div>
    </section>
  );
}
