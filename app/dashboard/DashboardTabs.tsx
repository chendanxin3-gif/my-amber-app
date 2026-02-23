"use client";

import { useState } from "react";
import { ProfileForm, SharePanel } from "./ProfilePanel";
import AmberGrid from "./AmberGrid";

type TabId = "identity" | "share" | "ambers";

interface AmberEntry {
  id: string;
  author_name: string;
  created_at: string;
  q1_three_words: string;
  q2_impression_change: string;
  q3_talent: string;
  q4_blind_spot?: string | null;
  q5_influence?: string | null;
  q6_message?: string | null;
  image_url?: string | null;
}

interface DashboardTabsProps {
  userId: string;
  initialFullName: string;
  initialCustomIntro: string;
  shareUrl: string;
  ambers: AmberEntry[];
}

const TABS: { id: TabId; label: string }[] = [
  { id: "ambers", label: "我的琥珀" },
  { id: "identity", label: "定义自我" },
  { id: "share", label: "获取信物" },
];

export default function DashboardTabs({
  userId,
  initialFullName,
  initialCustomIntro,
  shareUrl,
  ambers,
}: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("ambers");

  const totalCount = ambers.length;
  const photosCount = ambers.filter((a) => a.image_url).length;

  return (
    <div className="w-full">
      {/* ── Tab 导航栏 ── */}
      <div
        className="flex items-end gap-8 px-6 md:px-16 pt-2"
        style={{ borderBottom: "1px solid rgba(38,34,32,0.08)" }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative pb-4 text-lg tracking-widest transition-all duration-500"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                fontWeight: 600,
                color: isActive
                  ? "rgba(139,115,85,0.95)"
                  : "rgba(38,34,32,0.5)",
                background: "none",
                cursor: "pointer",
                letterSpacing: "0.2em",
              }}
            >
              {tab.label}
              <span
                className="absolute bottom-0 left-0 right-0 h-px transition-all duration-500"
                style={{
                  background: isActive ? "rgba(139,115,85,0.7)" : "transparent",
                  transform: isActive ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left",
                }}
              />
            </button>
          );
        })}
      </div>

      {/* ── Tab 内容区 ── */}

      {activeTab === "ambers" && (
        <div key="ambers" className="animate-fade-in">
          <div className="px-6 md:px-16 pt-10 pb-2">
            <p
              className="text-lg tracking-widest"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                fontWeight: 400,
                color: "rgba(38,34,32,0.55)",
                letterSpacing: "0.18em",
              }}
            >
              已收到{" "}
              <span style={{ color: "rgba(139,115,85,0.8)" }}>{totalCount}</span>{" "}
              枚琥珀
              {photosCount > 0 && (
                <>
                  ，其中{" "}
                  <span style={{ color: "rgba(139,115,85,0.6)" }}>
                    {photosCount}
                  </span>{" "}
                  枚含有照片
                </>
              )}
            </p>
          </div>
          <AmberGrid ambers={ambers} />
        </div>
      )}

      {activeTab === "identity" && (
        <div key="identity" className="animate-fade-in">
          <div className="max-w-xl mx-auto px-6 md:px-8 py-14">
            <div className="mb-10">
              <h2
                className="tracking-widest mb-3"
                style={{
                  fontFamily: "var(--font-noto-serif-sc), serif",
                  fontWeight: 300,
                  fontSize: "1.1rem",
                  color: "rgba(38,34,32,0.75)",
                  letterSpacing: "0.18em",
                }}
              >
                定义自我
              </h2>
              <p
                className="text-lg leading-loose"
                style={{
                  fontFamily: "var(--font-noto-sans-sc), sans-serif",
                  fontWeight: 400,
                  color: "rgba(38,34,32,0.55)",
                  letterSpacing: "0.06em",
                }}
              >
                这里的设置将影响你的专属填写页面所呈现的面貌。
              </p>
            </div>
            <ProfileForm
              userId={userId}
              initialFullName={initialFullName}
              initialCustomIntro={initialCustomIntro}
            />
          </div>
        </div>
      )}

      {activeTab === "share" && (
        <div key="share" className="animate-fade-in">
          <div className="max-w-lg mx-auto px-6 md:px-8 py-14">
            <div className="mb-12 text-center">
              <h2
                className="tracking-widest mb-3"
                style={{
                  fontFamily: "var(--font-noto-serif-sc), serif",
                  fontWeight: 300,
                  fontSize: "1.1rem",
                  color: "rgba(38,34,32,0.75)",
                  letterSpacing: "0.18em",
                }}
              >
                获取信物
              </h2>
              <p
                className="text-lg leading-loose"
                style={{
                  fontFamily: "var(--font-noto-sans-sc), sans-serif",
                  fontWeight: 400,
                  color: "rgba(38,34,32,0.55)",
                  letterSpacing: "0.06em",
                }}
              >
                将你的专属入口分享出去，邀请见证者为你凝固琥珀。
              </p>
            </div>
            <SharePanel shareUrl={shareUrl} />
          </div>
        </div>
      )}
    </div>
  );
}
