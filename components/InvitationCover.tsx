"use client";

import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState, type FormEvent } from "react";

interface InvitationCoverProps {
  initialName?: string;
  onOpen: (name: string) => void;
}

const invitationArtwork = "/images/3a683aea-88a7-43e7-86fc-8019469ecb0a (1).png";

export default function InvitationCover({ onOpen, initialName = "" }: InvitationCoverProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");
  const reduceMotion = useReducedMotion();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const guestName = name.trim().slice(0, 80);

    if (!guestName) {
      setError("Bạn nhập tên để Vân Anh gửi lời mời nhé.");
      return;
    }

    onOpen(guestName);
  }

  return (
    <section className="w-full max-w-sm perspective-1000 sm:max-w-md" aria-labelledby="letter-title">
      <motion.div
        animate={reduceMotion ? { rotateX: 0, rotateY: 0, y: 0 } : { rotateX: [3, -2, 3], rotateY: [-3, 3, -3], y: [0, -5, 0] }}
        className="preserve-3d relative overflow-hidden rounded-[2rem] border border-white/80 bg-pastel-pink p-3 shadow-pastel sm:p-4"
        initial={{ opacity: 0, rotateX: 12, rotateY: -12, scale: 0.94 }}
        transition={{ duration: 7, ease: "easeInOut", repeat: reduceMotion ? 0 : Infinity }}
      >
        <div className="pointer-events-none absolute -left-16 top-1/4 h-40 w-40 rounded-full bg-pastel-purple/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-8 h-36 w-36 rounded-full bg-pastel-rose/40 blur-3xl" />

        <div className="relative overflow-hidden rounded-[1.45rem] border border-pastel-rose/40 bg-pastel-peach p-2 shadow-soft">
          <div className="relative aspect-[1.04] overflow-hidden rounded-[1.05rem]">
            <Image
              alt="Bức thư thiệp mời tốt nghiệp 3D của Đào Vân Anh"
              className="object-cover object-top"
              fill
              priority
              sizes="(max-width: 480px) calc(100vw - 48px), 420px"
              src={invitationArtwork}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-pastel-text/40 to-transparent" />
            <p className="absolute bottom-4 left-0 right-0 text-center font-handwriting text-3xl text-white drop-shadow-sm">Gửi đến một người đặc biệt</p>
          </div>
        </div>

        <div className="relative px-2 pb-3 pt-6 text-center">
          <p className="flex items-center justify-center gap-2 text-xs font-bold tracking-[0.18em] text-pastel-accent uppercase">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" /> Một bức thư nhỏ
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-none font-semibold tracking-[-0.05em] text-pastel-text sm:text-5xl" id="letter-title">
            Thân gửi
          </h1>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-pastel-text/75">
            Vân Anh có một lời mời dành riêng cho bạn.
          </p>

          <form className="mt-6 text-left" onSubmit={handleSubmit}>
            <label className="mb-2 block text-sm font-semibold text-pastel-text" htmlFor="guest-name">
              Vân Anh thường gọi bạn là gì?
            </label>
            <input
              aria-describedby={error ? "guest-name-error" : undefined}
              aria-invalid={Boolean(error)}
              autoComplete="name"
              className="h-14 w-full rounded-2xl border border-pastel-rose/70 bg-white/80 px-4 text-base font-medium text-pastel-text outline-none placeholder:text-pastel-text/45 focus:border-pastel-accent focus:ring-4 focus:ring-pastel-purple/35"
              id="guest-name"
              maxLength={80}
              onChange={(event) => {
                setName(event.target.value);
                if (error) setError("");
              }}
              placeholder="Ví dụ: Linh, chị Hương…"
              value={name}
            />
            {error ? <p className="mt-2 text-sm font-medium text-[#9C3D6D]" id="guest-name-error" role="alert">{error}</p> : null}

            <button className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-pastel-text px-5 text-base font-semibold text-white shadow-soft transition hover:bg-[#65466F] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pastel-purple/70" type="submit">
              Mở thư <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </button>
            <p className="mt-3 text-center text-xs text-pastel-text/60">Nhấn Enter hoặc chạm để mở thiệp</p>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
