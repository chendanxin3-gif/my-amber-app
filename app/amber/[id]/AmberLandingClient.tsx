"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BgmPlayer from "@/app/components/BgmPlayer";
import InkBackground from "@/app/components/InkBackground";

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
    : "日本茶道讲「一期一会」，意味着此时此刻的相遇、这杯茶、坐在这里的人，一生仅有一次，绝不重来。";

  return (
    <main
      className="relative h-screen w-full overflow-hidden flex items-center justify-center cursor-pointer select-none"
      style={{ background: "#F4F1EE" }}
      onClick={() => {
        if (!actTwo) setActTwo(true);
      }}
    >
      {/* 水墨晕染动态背景 */}
      <InkBackground />

      {/* 背景音乐控制器 */}
      <BgmPlayer />

      {/* ── 第一幕：情绪铺陈 ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-16"
        style={{
          opacity: actTwo ? 0 : 1,
          transition: "opacity 1000ms ease-out",
          pointerEvents: actTwo ? "none" : "auto",
          zIndex: 1,
        }}
      >
        <div className="max-w-2xl w-full">
          <p
            className="leading-loose mb-8"
            style={{
              fontFamily: "var(--font-noto-serif-sc), serif",
              fontSize: "clamp(1.5rem, 3vw, 1.875rem)",
              fontWeight: 600,
              color: "rgba(38,34,32,0.82)",
              letterSpacing: "0.04em",
            }}
          >
            我是{" "}
            <span style={{ color: "#262220", fontWeight: 600 }}>{fullName}</span>。
          </p>
          <p
            className="leading-loose text-lg md:text-xl mb-8"
            style={{
              fontFamily: "var(--font-noto-serif-sc), serif",
              color: "rgba(38,34,32,0.82)",
              letterSpacing: "0.04em",
            }}
          >
            {intro}
          </p>
          <p
            className="leading-loose text-lg md:text-xl mb-8"
            style={{
              fontFamily: "var(--font-noto-serif-sc), serif",
              color: "rgba(38,34,32,0.82)",
              letterSpacing: "0.04em",
            }}
          >
            在巴厘岛这 8 天的日夜、屏幕前的 Bug 与岛屿的晚风里，我们共同构建了一个短暂却真实的场域。我知道，那些固有的人设和职业标签在这里是被消解的。
          </p>
          <p
            className="leading-loose text-lg md:text-xl"
            style={{
              fontFamily: "var(--font-noto-serif-sc), serif",
              color: "rgba(38,34,32,0.82)",
              letterSpacing: "0.04em",
            }}
          >
            在即将各自退回原有轨道、结束这场人生实验的前夕，我想请你一起封存属于我们的记忆：借你的眼睛，凝固那个我未曾察觉的自己……
          </p>
        </div>

        {/* 呼吸提示 */}
        <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-3 animate-pulse">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            style={{ color: "rgba(139,115,85,0.5)" }}
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
            className="tracking-widest"
            style={{
              fontFamily: "var(--font-noto-sans-sc), sans-serif",
              fontWeight: 700,
              fontSize: "1.15rem",
              color: "rgba(139,115,85,0.8)",
            }}
          >
            点击水面，继续
          </span>
        </div>
      </div>

      {/* ── 第二幕：规则说明 ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-16"
        style={{
          opacity: actTwo ? 1 : 0,
          transition: "opacity 1000ms ease-out",
          pointerEvents: actTwo ? "auto" : "none",
          zIndex: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-lg w-full text-center">
          <h1
            className="text-2xl md:text-4xl tracking-widest mb-10"
            style={{
              fontFamily: '"PingFangShiGuang", serif',
              color: "rgba(38,34,32,0.85)",
              letterSpacing: "0.28em",
            }}
          >
            万物见我·一期一会
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
                  className="shrink-0 text-lg mt-1"
                  style={{ color: "rgba(139,115,85,0.6)" }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p
                  className="text-lg leading-loose"
                  style={{
                    fontFamily: "var(--font-noto-sans-sc), sans-serif",
                    color: "rgba(38,34,32,0.75)",
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
            className="px-12 py-4 text-lg tracking-widest transition-all duration-700 ease-out"
            style={{
              fontFamily: "var(--font-noto-sans-sc), sans-serif",
              fontWeight: 600,
              color: "rgba(139,115,85,0.9)",
              border: "1px solid rgba(139,115,85,0.3)",
              borderRadius: "2px",
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              letterSpacing: "0.2em",
              boxShadow: "0 2px 24px rgba(139,115,85,0.06)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(139,115,85,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(139,115,85,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.55)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(139,115,85,0.3)";
            }}
          >
            封存这枚琥珀
          </button>
        </div>
      </div>
    </main>
  );
}
