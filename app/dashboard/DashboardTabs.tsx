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
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative pb-4 text-xs tracking-widest transition-all duration-500"
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                color: isActive
                  ? "rgba(212,175,55,0.9)"
                  : "rgba(232,224,208,0.3)",
                background: "none",
                cursor: "pointer",
                letterSpacing: "0.18em",
              }}
            >
              {tab.label}
              {/* 琥珀色激活底线 */}
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-500"
                style={{
                  background: isActive
                    ? "rgba(212,175,55,0.8)"
                    : "transparent",
                  transform: isActive ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left",
                }}
              />
            </button>
          );
        })}
      </div>

      {/* ── Tab 内容区 ── */}

      {/* 我的琥珀 */}
      {activeTab === "ambers" && (
        <div key="ambers" className="animate-fade-in">
          {/* 统计小标题 */}
          <div className="px-6 md:px-16 pt-10 pb-2">
            <p
              className="text-xs tracking-widest"
              style={{ color: "rgba(232,224,208,0.3)" }}
            >
              已收到{" "}
              <span style={{ color: "rgba(212,175,55,0.7)" }}>{totalCount}</span>{" "}
              枚琥珀
              {photosCount > 0 && (
                <>
                  ，其中{" "}
                  <span style={{ color: "rgba(212,175,55,0.5)" }}>
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

      {/* 定义自我 */}
      {activeTab === "identity" && (
        <div key="identity" className="animate-fade-in">
          <div className="max-w-xl mx-auto px-6 md:px-8 py-14">
            <div className="mb-10">
              <h2
                className="text-lg tracking-widest mb-3"
                style={{
                  fontFamily: "var(--font-lora), Georgia, serif",
                  color: "#e8e0d0",
                }}
              >
                定义自我
              </h2>
              <p
                className="text-xs leading-loose"
                style={{ color: "rgba(232,224,208,0.3)" }}
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

      {/* 获取信物 */}
      {activeTab === "share" && (
        <div key="share" className="animate-fade-in">
          <div className="max-w-lg mx-auto px-6 md:px-8 py-14">
            <div className="mb-12 text-center">
              <h2
                className="text-lg tracking-widest mb-3"
                style={{
                  fontFamily: "var(--font-lora), Georgia, serif",
                  color: "#e8e0d0",
                }}
              >
                获取信物
              </h2>
              <p
                className="text-xs leading-loose"
                style={{ color: "rgba(232,224,208,0.3)" }}
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
