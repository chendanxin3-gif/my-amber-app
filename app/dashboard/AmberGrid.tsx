"use client";

import { useState, useCallback, useEffect } from "react";

const GOLD_BORDER = "rgba(139,115,85,0.2)";

function ImageLightbox({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(244,241,238,0.92)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300"
        style={{
          border: "1px solid rgba(139,115,85,0.3)",
          background: "rgba(255,255,255,0.7)",
          color: "rgba(139,115,85,0.7)",
          cursor: "pointer",
        }}
        onClick={onClose}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M1 1l12 12M13 1L1 13"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="关系照片（放大）"
        className="block"
        style={{
          maxWidth: "90vw",
          maxHeight: "88vh",
          width: "auto",
          height: "auto",
          objectFit: "contain",
          borderRadius: "2px",
          boxShadow: "0 8px 60px rgba(38,34,32,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

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

function QuoteBlock({
  label,
  content,
  muted = false,
}: {
  label: string;
  content: string;
  muted?: boolean;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <p
        className="text-xs tracking-widest mb-2"
        style={{
          fontFamily: "var(--font-noto-sans-sc), sans-serif",
          fontWeight: 300,
          color: "rgba(139,115,85,0.6)",
          letterSpacing: "0.18em",
        }}
      >
        {label}
      </p>
      <p
        className="text-sm leading-loose"
        style={{
          fontFamily: "var(--font-noto-sans-sc), sans-serif",
          fontWeight: 300,
          color: muted ? "rgba(38,34,32,0.45)" : "rgba(38,34,32,0.7)",
          letterSpacing: "0.03em",
        }}
      >
        {content}
      </p>
    </div>
  );
}

function AmberCard({ entry }: { entry: AmberEntry }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const handleOpenLightbox = useCallback(() => setLightboxOpen(true), []);
  const handleCloseLightbox = useCallback(() => setLightboxOpen(false), []);

  const dateStr = new Date(entry.created_at).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="relative flex flex-col break-inside-avoid mb-6"
      style={{
        background: "rgba(255,255,255,0.60)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${GOLD_BORDER}`,
        borderRadius: "2px",
        padding: "28px 28px 24px",
        boxShadow:
          "0 2px 24px rgba(139,115,85,0.06), 0 1px 0 rgba(255,255,255,0.8) inset",
      }}
    >
      {/* 右上角装饰角标 */}
      <div
        className="absolute top-0 right-0 w-5 h-5"
        style={{
          borderTop: "1px solid rgba(139,115,85,0.25)",
          borderRight: "1px solid rgba(139,115,85,0.25)",
          borderTopRightRadius: "2px",
        }}
      />

      {/* 卡片头 */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p
            className="text-base tracking-wider mb-1"
            style={{
              fontFamily: "var(--font-noto-serif-sc), serif",
              fontWeight: 400,
              color: "rgba(38,34,32,0.82)",
            }}
          >
            {entry.author_name}
          </p>
          <p
            className="text-xs tracking-widest"
            style={{
              fontFamily: "var(--font-noto-sans-sc), sans-serif",
              fontWeight: 300,
              color: "rgba(139,115,85,0.55)",
              letterSpacing: "0.14em",
            }}
          >
            {dateStr}
          </p>
        </div>
        {entry.image_url && (
          <div
            className="flex items-center justify-center w-7 h-7 rounded-full shrink-0"
            style={{ border: `1px solid ${GOLD_BORDER}` }}
            title="含有照片"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <rect
                x="2"
                y="3"
                width="12"
                height="10"
                rx="1"
          stroke="rgba(139,115,85,0.5)"
          strokeWidth="1"
          />
          <circle
            cx="5.5"
            cy="6.5"
            r="1.2"
            stroke="rgba(139,115,85,0.5)"
            strokeWidth="1"
          />
          <path
            d="M2 11l3.5-3 2.5 2.5 2-2.5 4 3.5"
            stroke="rgba(139,115,85,0.5)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* 照片缩略图 */}
      {entry.image_url && (
        <>
          <div
            className="mb-6 rounded overflow-hidden cursor-zoom-in"
            style={{ maxHeight: "180px" }}
            onClick={handleOpenLightbox}
            title="点击查看完整照片"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.image_url}
              alt="关系照片"
              className="w-full h-auto block"
              style={{
                opacity: 0.8,
                objectFit: "contain",
                maxHeight: "180px",
                transition: "opacity 300ms ease-out",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = "0.8";
              }}
            />
          </div>
          {lightboxOpen && (
            <ImageLightbox src={entry.image_url} onClose={handleCloseLightbox} />
          )}
        </>
      )}

      {/* 三个词 */}
      <div className="mb-6">
        <p
          className="text-lg tracking-widest"
          style={{
            fontFamily: "var(--font-noto-serif-sc), serif",
            fontWeight: 400,
              color: "rgba(139,115,85,0.85)",
            letterSpacing: "0.2em",
          }}
        >
          {entry.q1_three_words}
        </p>
      </div>

      {/* 分割线 */}
      <div
        className="mb-6 h-px"
          style={{ background: "rgba(38,34,32,0.06)" }}
      />

      {/* 必填内容 */}
      <QuoteBlock label="印象变迁" content={entry.q2_impression_change} />
      <QuoteBlock label="天赋感知" content={entry.q3_talent} />

      {/* 选填内容 */}
      {(entry.q4_blind_spot || entry.q5_influence || entry.q6_message) && (
        <>
          <div
            className="mt-5 mb-5 h-px"
            style={{ background: "rgba(38,34,32,0.05)" }}
          />
          {entry.q4_blind_spot && (
            <QuoteBlock label="我的盲点" content={entry.q4_blind_spot} muted />
          )}
          {entry.q5_influence && (
            <QuoteBlock label="悄然的影响" content={entry.q5_influence} muted />
          )}
          {entry.q6_message && (
            <div
              className="mt-5 pt-5"
              style={{ borderTop: "1px solid rgba(139,115,85,0.12)" }}
            >
              <p
                className="text-sm leading-loose italic"
                style={{
                  fontFamily: "var(--font-noto-serif-sc), serif",
                  fontWeight: 300,
                  color: "rgba(139,115,85,0.75)",
                }}
              >
                「{entry.q6_message}」
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function AmberGrid({ ambers }: { ambers: AmberEntry[] }) {
  if (ambers.length === 0) {
    return (
      <div className="px-6 md:px-16 pt-16 pb-24 text-center">
        <p
          className="text-sm tracking-widest"
          style={{
            fontFamily: "var(--font-noto-sans-sc), sans-serif",
            fontWeight: 300,
              color: "rgba(38,34,32,0.2)",
            letterSpacing: "0.18em",
          }}
        >
          还没有琥珀。分享你的专属链接，邀请第一位见证者。
        </p>
      </div>
    );
  }

  return (
    <div className="relative px-6 md:px-16 pt-10 pb-24">
      <p
        className="text-xs tracking-widest mb-8"
        style={{
          fontFamily: "var(--font-noto-sans-sc), sans-serif",
          fontWeight: 300,
          color: "rgba(139,115,85,0.5)",
          letterSpacing: "0.2em",
        }}
      >
        琥珀收集箱
      </p>
      <div
        style={{ columns: "1", columnGap: "24px" }}
        className="md:[columns:2] xl:[columns:3]"
      >
        {ambers.map((entry) => (
          <AmberCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
