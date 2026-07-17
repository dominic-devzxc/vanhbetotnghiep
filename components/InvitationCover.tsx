"use client";

import dynamic from "next/dynamic";
import { ArrowDown, GraduationCap, Sparkles } from "lucide-react";
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
  loading: () => <div className="h-full animate-pulse rounded-[1.5rem] bg-pastel-peach/70" />,
  ssr: false,
});

function StaticEnvelope({ armed, onSealClick }: { armed: boolean; onSealClick: () => void }) {
  return (
    <div className="flex h-full items-center justify-center" aria-hidden="true">
      <div className="relative aspect-[1.62] w-[92%] overflow-hidden rounded-xl border border-[#EBC5A5]/75 bg-pastel-purple shadow-pastel">
        <div className="absolute inset-0 bg-pastel-accent/35 [clip-path:polygon(0_100%,0_0,52%_57%)]" />
        <div className="absolute inset-0 bg-pastel-purple [clip-path:polygon(100%_100%,100%_0,48%_57%)]" />
        <div className="absolute inset-0 bg-pastel-purple/90 [clip-path:polygon(0_100%,100%_100%,50%_42%)]" />
        <div className="absolute inset-0 bg-pastel-purple [clip-path:polygon(0_0,100%_0,50%_61%)]" />
        <button
          aria-label={armed ? "Mở thư bằng con dấu sáp" : "Nhập tên trước để mở thư"}
          className={`absolute left-1/2 top-[57%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-[#F7C1B8] bg-[#D89491] shadow-lg ${armed ? "cursor-pointer" : "cursor-default opacity-60"}`}
          onClick={onSealClick}
          type="button"
        />
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
    <section aria-busy={opening} aria-labelledby="letter-title" className="relative w-full px-1 text-center sm:px-4">
      <div aria-hidden="true" className="absolute -left-3 top-6 text-5xl text-pastel-rose/70">❀</div>
      <div aria-hidden="true" className="absolute -right-2 top-20 text-4xl text-pastel-purple/75">✿</div>

      <header className="relative">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/90 bg-white/60 text-pastel-text shadow-soft backdrop-blur-sm">
          <GraduationCap aria-hidden="true" className="h-7 w-7" />
        </div>
        <h1 className="mx-auto mt-2 max-w-lg font-serif text-[2.65rem] font-semibold leading-[0.98] tracking-[-0.045em] text-pastel-text sm:text-6xl" id="letter-title">
          Thiệp mời tốt nghiệp
        </h1>
        <p className="mt-2 font-serif text-xl italic text-pastel-accent sm:text-2xl">Nhập tên để mở thư</p>
        <div aria-hidden="true" className="mx-auto mt-2 flex max-w-[13rem] items-center gap-3 text-pastel-rose">
          <span className="h-px flex-1 bg-current" />
          <span className="text-sm">♥</span>
          <span className="h-px flex-1 bg-current" />
        </div>
      </header>

      <form className="mx-auto mt-4 max-w-md text-left" onSubmit={activateName}>
        <label className="mb-1.5 block pl-3 text-sm font-semibold text-pastel-text" htmlFor="guest-name">Tên gọi thân mật của bạn</label>
        <motion.div
          animate={shakeInput ? { x: [0, -8, 7, -5, 2, 0] } : { x: 0 }}
          className="rounded-full border border-white/90 bg-white/55 p-1.5 shadow-pastel backdrop-blur-md focus-within:ring-4 focus-within:ring-pastel-purple/35"
          transition={{ duration: 0.42 }}
        >
          <input
            autoComplete="name"
            className="h-12 w-full min-w-0 rounded-full bg-white/75 px-4 text-base font-medium text-pastel-text outline-none placeholder:text-pastel-text/45"
            disabled={opening}
            id="guest-name"
            maxLength={80}
            onChange={(event) => {
              setName(event.target.value);
              if (armed) setArmed(false);
            }}
            placeholder="Ví dụ: Linh, chị Hương…"
            ref={inputRef}
            value={name}
          />
        </motion.div>
        <button className="sr-only" type="submit">Xác nhận tên để kích hoạt con dấu</button>
      </form>

      <p aria-live="polite" className="mt-2 min-h-5 text-sm font-medium text-[#9C3D6D]">{notice}</p>
      <div className="mt-1 flex items-center justify-center gap-2 font-serif text-sm italic text-pastel-text/75">
        <span>{armed ? "Bấm vào con dấu hoa để mở thư" : "Nhấn Enter để đánh thức con dấu"}</span>
        <ArrowDown aria-hidden="true" className="h-4 w-4" />
      </div>

      <div className="relative left-1/2 mt-1 h-[16.5rem] w-[92vw] max-w-[42rem] -translate-x-1/2 sm:h-[21rem] lg:h-[24rem]">
        {reduceMotion ? (
          <StaticEnvelope armed={armed} onSealClick={requestOpen} />
        ) : (
          <EnvelopeScene
            armed={armed}
            guestName={name.trim()}
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
          <div className="absolute inset-4 flex items-center justify-center rounded-[1.5rem] bg-pastel-pink/85">
            <p className="flex items-center gap-2 text-sm font-semibold text-pastel-text"><Sparkles aria-hidden="true" className="h-5 w-5 animate-pulse" /> Đang dựng phong thư…</p>
          </div>
        ) : null}
        {armed && !opening && !loading3d ? (
          <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[64%] z-10 -translate-x-1/2 rounded-full bg-pastel-text/90 px-3 py-1 text-xs font-semibold text-white shadow-soft">Bấm để mở thư</span>
        ) : null}
        {armed && !opening ? (
          <button className="sr-only" onClick={requestOpen} type="button">Mở thư bằng con dấu sáp</button>
        ) : null}
      </div>
    </section>
  );
}
