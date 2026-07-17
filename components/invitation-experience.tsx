"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";

import { invitation } from "@/content/invitation";

type Attendance = "yes" | "no";
type RsvpStatus = "idle" | "submitting" | "success" | "error";

const sparkleCount = [0, 1, 2, 3, 4, 5];
const EnvelopeScene = dynamic(
  () => import("@/components/envelope-scene").then((module) => module.EnvelopeScene),
  {
    ssr: false,
    loading: () => <div className="h-52 w-full animate-pulse rounded-3xl bg-peach/70 sm:h-60" />,
  },
);

export function InvitationExperience({ initialGuestName }: { initialGuestName: string }) {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<"intro" | "invitation">("intro");
  const [guestName, setGuestName] = useState(initialGuestName);
  const [nameError, setNameError] = useState("");
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>("idle");

  const cleanName = guestName.trim().slice(0, 80);

  function openInvitation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!cleanName) {
      setNameError(invitation.intro.invalidName);
      return;
    }

    setNameError("");
    setGuestName(cleanName);
    window.history.replaceState(null, "", `?to=${encodeURIComponent(cleanName)}`);
    setStage("invitation");
  }

  async function submitRsvp(choice: Attendance) {
    setAttendance(choice);
    setRsvpStatus("submitting");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestName: cleanName, attendance: choice }),
      });

      if (!response.ok) {
        throw new Error("Unable to save RSVP");
      }

      setRsvpStatus("success");

      if (choice === "yes" && !reduceMotion) {
        const { default: confetti } = await import("canvas-confetti");
        confetti({
          particleCount: 70,
          spread: 62,
          origin: { y: 0.76 },
          colors: ["#F5CBCB", "#C5B3D3", "#FFE2E2", "#5B4868"],
        });
      }
    } catch {
      setRsvpStatus("error");
    }
  }

  const revealTransition = reduceMotion
    ? { duration: 0.01 }
    : { type: "spring" as const, stiffness: 90, damping: 16 };

  return (
    <main className="invitation-backdrop relative min-h-dvh overflow-hidden px-4 py-5 sm:px-6 sm:py-8">
      <div className="sparkle-field" aria-hidden="true">
        {sparkleCount.map((sparkle) => (
          <span className="sparkle" key={sparkle} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {stage === "intro" ? (
          <motion.section
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            className="relative z-10 mx-auto flex min-h-[calc(100dvh-40px)] max-w-md items-center"
            exit={{ opacity: 0, rotateY: -22, scale: 0.94 }}
            initial={{ opacity: 0, rotateY: 18, scale: 0.92 }}
            key="intro"
            style={{ perspective: 1200 }}
            transition={revealTransition}
          >
            <div className="envelope-shell paper-surface w-full px-6 py-10 sm:px-10 sm:py-12">
              {!reduceMotion ? <EnvelopeScene /> : null}
              <div className="mb-8 flex items-center justify-between">
                <p className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                  {invitation.intro.eyebrow}
                </p>
                <span className="wax-seal" aria-hidden="true">VA</span>
              </div>

              <h1 className="max-w-sm text-4xl leading-[1.04] font-semibold tracking-[-0.045em] text-ink sm:text-5xl">
                {invitation.intro.heading} {cleanName || "bạn"}
              </h1>
              <p className="mt-4 max-w-xs text-base leading-7 text-muted">
                Có một bức thư nhỏ dành riêng cho bạn.
              </p>

              <form className="mt-9 space-y-3" onSubmit={openInvitation}>
                <label className="block text-sm font-semibold text-ink" htmlFor="guest-name">
                  {invitation.intro.label}
                </label>
                <input
                  aria-describedby={nameError ? "name-error" : undefined}
                  aria-invalid={Boolean(nameError)}
                  autoComplete="name"
                  className="h-12 w-full rounded-2xl border border-blush bg-white/70 px-4 text-base text-ink outline-none transition focus:border-plum focus:ring-4 focus:ring-lavender/35"
                  id="guest-name"
                  maxLength={80}
                  onChange={(event) => {
                    setGuestName(event.target.value);
                    if (nameError) setNameError("");
                  }}
                  placeholder={invitation.intro.placeholder}
                  value={guestName}
                />
                {nameError ? (
                  <p className="text-sm font-medium text-plum" id="name-error" role="alert">
                    {nameError}
                  </p>
                ) : null}
                <button
                  className="mt-2 h-12 w-full rounded-2xl bg-plum px-5 text-base font-semibold text-paper transition hover:bg-ink active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-lavender/70 focus-visible:outline-none"
                  type="submit"
                >
                  {invitation.intro.submit}
                </button>
              </form>
            </div>
          </motion.section>
        ) : (
          <motion.section
            animate={{ opacity: 1, rotateY: 0, y: 0 }}
            className="relative z-10 mx-auto max-w-5xl py-4 sm:py-10"
            initial={{ opacity: 0, rotateY: 14, y: 24 }}
            key="invitation"
            style={{ perspective: 1500 }}
            transition={revealTransition}
          >
            <div className="mb-4 flex items-center justify-between px-1 text-sm font-semibold text-muted">
              <span>{invitation.message.eyebrow}</span>
              <span>{invitation.host}</span>
            </div>

            <div className="paper-surface overflow-hidden rounded-[30px] border border-white/80 shadow-[0_26px_80px_rgba(91,72,104,0.16)]">
              <div className="grid lg:grid-cols-[0.86fr_1.14fr]">
                <motion.aside
                  animate={{ rotateY: 0, x: 0 }}
                  className="relative overflow-hidden bg-peach px-6 py-9 sm:px-10 sm:py-12"
                  initial={{ rotateY: -68, x: -32 }}
                  style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
                  transition={revealTransition}
                >
                  <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-lavender/45 blur-2xl" aria-hidden="true" />
                  <div className="relative">
                    <span className="wax-seal mb-8">21</span>
                    <p className="text-sm font-semibold tracking-[0.16em] text-muted uppercase">Lễ tốt nghiệp</p>
                    <time className="mt-3 block text-3xl leading-tight font-semibold tracking-[-0.04em] text-ink" dateTime={invitation.event.dateTime}>
                      {invitation.event.date}
                    </time>
                    <div className="mt-8 border-t border-plum/15 pt-6">
                      <p className="text-sm font-semibold text-muted">Thời gian</p>
                      <p className="mt-1 text-xl font-semibold text-ink">{invitation.event.time}</p>
                    </div>
                    <div className="mt-6 border-t border-plum/15 pt-6">
                      <p className="text-sm font-semibold text-muted">Địa điểm</p>
                      <address className="mt-1 not-italic text-xl leading-8 font-semibold text-ink">
                        {invitation.event.location}
                      </address>
                    </div>
                  </div>
                </motion.aside>

                <motion.div
                  animate={{ rotateY: 0, x: 0 }}
                  className="px-6 py-9 sm:px-10 sm:py-12"
                  initial={{ rotateY: 56, x: 24 }}
                  style={{ transformOrigin: "right center", transformStyle: "preserve-3d" }}
                  transition={{ ...revealTransition, delay: reduceMotion ? 0 : 0.1 }}
                >
                  <p className="text-sm font-semibold tracking-[0.16em] text-muted uppercase">Thân mời</p>
                  <h1 className="mt-3 max-w-xl text-4xl leading-[1.05] font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
                    {invitation.message.heading}
                  </h1>
                  <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
                    {invitation.message.invitationPrefix} <strong className="font-semibold text-ink">{cleanName}</strong>{" "}
                    {invitation.message.invitationSuffix}
                  </p>

                  <section className="mt-10 border-t border-blush pt-8" aria-labelledby="rsvp-heading">
                    <h2 className="text-2xl font-semibold tracking-[-0.035em] text-ink" id="rsvp-heading">
                      {invitation.rsvp.heading}
                    </h2>
                    <p className="mt-2 text-base leading-7 text-muted">{invitation.rsvp.note}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">{invitation.rsvp.privacyNote}</p>

                    {rsvpStatus === "success" && attendance ? (
                      <div className="mt-6 rounded-2xl border border-lavender bg-lavender/20 p-5" role="status">
                        <p className="text-lg font-semibold text-ink">
                          {attendance === "yes" ? invitation.rsvp.yesTitle : invitation.rsvp.noTitle}
                        </p>
                        <p className="mt-1 leading-7 text-muted">
                          {attendance === "yes" ? invitation.rsvp.yesMessage : invitation.rsvp.noMessage}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button
                          className="h-12 rounded-2xl bg-plum px-5 text-base font-semibold text-paper transition hover:bg-ink active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 sm:min-w-40"
                          disabled={rsvpStatus === "submitting"}
                          onClick={() => submitRsvp("yes")}
                          type="button"
                        >
                          {rsvpStatus === "submitting" && attendance === "yes" ? invitation.rsvp.sending : invitation.rsvp.yes}
                        </button>
                        <button
                          className="h-12 rounded-2xl border border-plum/30 bg-white/55 px-5 text-base font-semibold text-ink transition hover:border-plum hover:bg-peach active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 sm:min-w-40"
                          disabled={rsvpStatus === "submitting"}
                          onClick={() => submitRsvp("no")}
                          type="button"
                        >
                          {rsvpStatus === "submitting" && attendance === "no" ? invitation.rsvp.sending : invitation.rsvp.no}
                        </button>
                      </div>
                    )}

                    {rsvpStatus === "error" ? (
                      <p className="mt-4 text-sm font-medium text-plum" role="alert">
                        {invitation.rsvp.error}
                      </p>
                    ) : null}
                  </section>

                  <p className="mt-10 text-base font-semibold text-ink">{invitation.signature}</p>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
