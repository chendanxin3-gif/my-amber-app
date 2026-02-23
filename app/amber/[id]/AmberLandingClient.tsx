"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BgmPlayer from "@/app/components/BgmPlayer";

interface Props {
  profileId: string;
  fullName: string;
  customIntro: string;
}

export default function AmberLandingClient({
  profileId,
  fullName,
  customIntro,
}: Props) {
  const router = useRouter();
  const [actTwo, setActTwo] = useState(false);

  const intro = customIntro.trim()
    ? customIntro
    : "在这段相遇的时光里，我们共同构建了一个短暂却真实的场域。";

  return (
    <main
      className="relative h-screen w-full overflow-hidden flex items-center justify-center cursor-pointer select-none"
      style={{ background: "#0a0a0a" }}
      onClick={() => {
        if (!actTwo) setActTwo(true);
      }}
    >
      {/* 背景微光 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(212,175,55,0.05) 0%, transparent 70%)",
        }}
      />

      {/* ── 第一幕：情绪铺陈 ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-16"
        style={{
          opacity: actTwo ? 0 : 1,
          transition: "opacity 1000ms ease-out",
          pointerEvents: actTwo ? "none" : "auto",
        }}
      >
        <div className="max-w-2xl w-full">
          <p
            className="leading-loose text-base md:text-lg mb-8"
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              color: "rgba(232,224,208,0.75)",
              letterSpacing: "0.02em",
            }}
          >
            我是{" "}
            <span style={{ color: "#e8e0d0" }}>{fullName}</span>。
          </p>
          <p
            className="leading-loose text-base md:text-lg mb-8"
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              color: "rgba(232,224,208,0.75)",
              letterSpacing: "0.02em",
            }}
          >
            {intro}
          </p>
          <p
            className="leading-loose text-base md:text-lg"
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              color: "rgba(232,224,208,0.75)",
              letterSpacing: "0.02em",
            }}
          >
            人是无法真正看清自己的。我想借你的眼睛，凝固那个我未曾察觉的自己……
          </p>
        </div>

        {/* 呼吸提示 */}
        <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-3 animate-pulse">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            style={{ color: "rgba(212,175,55,0.5)" }}
          >
            <path
              d="M10 3v14M10 17l-5-5M10 17l5-5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className="text-xs tracking-widest"
            style={{
              color: "rgba(212,175,55,0.45)",
              fontFamily: "var(--font-geist-sans), sans-serif",
            }}
          >
            点击水面，继续
          </span>
        </div>
      </div>

      {/* 背景音乐控制器 */}
      <BgmPlayer />

      {/* ── 第二幕：规则说明 ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-16"
        style={{
          opacity: actTwo ? 1 : 0,
          transition: "opacity 1000ms ease-out",
          pointerEvents: actTwo ? "auto" : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-lg w-full text-center">
          <h1
            className="text-2xl md:text-4xl tracking-widest mb-10"
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              color: "#e8e0d0",
              letterSpacing: "0.15em",
            }}
          >
            万物见我 · 一期一会
          </h1>

          {/* 规则说明列表 */}
          <div className="mb-12 flex flex-col gap-5">
            {[
              `这枚专属琥珀仅对 ${fullName} 可见，不会公开展示。`,
              "无需完美，只需真实。你的第一直觉，往往是最清澈的。",
              "你可以匿名，也可以署名——由你决定。",
            ].map((text, index) => (
              <div key={index} className="flex items-start gap-4 text-left">
                <span
                  className="shrink-0 text-xs mt-1"
                  style={{ color: "rgba(212,175,55,0.4)" }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p
                  className="text-sm leading-loose"
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    color: "rgba(232,224,208,0.6)",
                  }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>

          {/* CTA 按钮：跳转填写页 */}
          <button
            onClick={() => router.push(`/amber/${profileId}/submit`)}
            className="px-12 py-4 text-sm tracking-widest transition-all duration-700 ease-out"
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              color: "rgba(212,175,55,0.9)",
              border: "1px solid rgba(212,175,55,0.35)",
              borderRadius: "2px",
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              letterSpacing: "0.2em",
              boxShadow:
                "0 0 24px rgba(212,175,55,0.06) inset, 0 0 40px rgba(212,175,55,0.04)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(212,175,55,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(212,175,55,0.6)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.03)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(212,175,55,0.35)";
            }}
          >
            封存这枚琥珀
          </button>
        </div>
      </div>
    </main>
  );
}
