"use client";

import { useState, useRef, use } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import InkBackground from "@/app/components/InkBackground";

const AMBER = "#8b7355";
const AMBER_BORDER = "rgba(139,115,85,0.3)";

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  color: "#262220",
  fontFamily: "var(--font-noto-sans-sc), sans-serif",
  fontSize: "0.95rem",
  lineHeight: "1.9",
  padding: "8px 0",
  outline: "none",
  caretColor: AMBER,
};

function AmberTextarea({
  placeholder,
  value,
  onChange,
  rows = 3,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputBase,
        borderBottom: `1px solid ${focused ? AMBER : "rgba(38,34,32,0.12)"}`,
        resize: "none",
        transition: "border-bottom-color 600ms ease-out",
      }}
      className="placeholder:text-black/35 w-full"
    />
  );
}

function AmberInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputBase,
        fontSize: "0.9rem",
        borderBottom: `1px solid ${focused ? AMBER : "rgba(38,34,32,0.12)"}`,
        transition: "border-bottom-color 600ms ease-out",
      }}
      className="placeholder:text-black/35 w-full"
    />
  );
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SubmitPage({ params }: PageProps) {
  const { id: profileId } = use(params);
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [q4, setQ4] = useState("");
  const [q5, setQ5] = useState("");
  const [q6, setQ6] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isReady = q1.trim() && q2.trim() && q3.trim() && authorName.trim();

  const handleSubmit = async () => {
    if (!isReady) return;
    setStatus("loading");
    setErrorMsg("");

    let imageUrl: string | null = null;

    if (photoFile) {
      const ext = photoFile.name.split(".").pop() ?? "jpg";
      const fileName = `${profileId}/${Date.now()}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("amber-images")
        .upload(fileName, photoFile, { upsert: false });

      if (uploadError) {
        setErrorMsg("图片上传失败，请重试或跳过图片。");
        setStatus("error");
        return;
      }

      const { data: urlData } = supabase.storage
        .from("amber-images")
        .getPublicUrl(uploadData.path);
      imageUrl = urlData.publicUrl;
    }

    const { error: insertError } = await supabase.from("ambers").insert({
      profile_id: profileId,
      q1_three_words: q1.trim(),
      q2_impression_change: q2.trim(),
      q3_talent: q3.trim(),
      q4_blind_spot: q4.trim() || null,
      q5_influence: q5.trim() || null,
      q6_message: q6.trim() || null,
      image_url: imageUrl,
      author_name: authorName.trim(),
    });

    if (insertError) {
      setErrorMsg("提交失败，请稍后重试。");
      setStatus("error");
      return;
    }

    setStatus("success");
  };

  // ── 成功页 ──
  if (status === "success") {
    return (
      <main
        className="relative min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: "#F4F1EE" }}
      >
        <InkBackground />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            background: "rgba(255,255,255,0.60)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${AMBER_BORDER}`,
            borderRadius: "4px",
            padding: "56px 48px",
            maxWidth: "480px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 2px 40px rgba(139,115,85,0.08)",
          }}
        >
          {/* 琥珀印记 */}
          <div
            className="mx-auto mb-8 w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              border: `1px solid ${AMBER_BORDER}`,
              background: "rgba(139,115,85,0.06)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10l4 4 8-8"
                stroke={AMBER}
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2
            className="text-xl tracking-widest mb-4"
            style={{
              fontFamily: '"PingFangShiGuang", serif',
              color: "rgba(38,34,32,0.85)",
              letterSpacing: "0.22em",
            }}
          >
            琥珀已凝固
          </h2>

          <p
            className="text-sm leading-loose mb-10"
            style={{
              fontFamily: "var(--font-noto-sans-sc), sans-serif",
              color: "rgba(38,34,32,0.7)",
            }}
          >
            感谢你在这一期一会里，留下了你的目光。
            <br />
            它将永远封存在时光之中。
          </p>

          {/* 分割线 */}
          <div
            className="h-px mb-10"
            style={{ background: "rgba(38,34,32,0.06)" }}
          />

          {/* 病毒裂变区 */}
          <p
            className="text-sm leading-relaxed mb-6"
            style={{
              fontFamily: "var(--font-noto-sans-sc), sans-serif",
              color: "rgba(38,34,32,0.55)",
            }}
          >
            你想知道别人眼中的你吗？
          </p>

          <Link
            href="/"
            className="inline-block px-8 py-3 text-sm tracking-widest transition-all duration-700 ease-out"
            style={{
              fontFamily: "var(--font-noto-sans-sc), sans-serif",
              fontWeight: 400,
              color: "rgba(139,115,85,0.9)",
              border: `1px solid ${AMBER_BORDER}`,
              borderRadius: "2px",
              background: "rgba(139,115,85,0.05)",
              letterSpacing: "0.15em",
            }}
          >
            生成你的专属关系琥珀
          </Link>
        </div>
      </main>
    );
  }

  // ── 填写页 ──
  return (
    <main className="relative min-h-screen w-full" style={{ background: "#F4F1EE" }}>
      <InkBackground />

      {/* 顶部导航 */}
      <header className="relative px-6 md:px-16 pt-10 pb-2" style={{ zIndex: 1 }}>
        <Link
          href={`/amber/${profileId}`}
          className="text-sm tracking-widest"
          style={{
            color: "rgba(139,115,85,0.65)",
            fontFamily: "var(--font-noto-sans-sc), sans-serif",
          }}
        >
          ← 返回
        </Link>
      </header>

      <div className="relative max-w-2xl mx-auto px-6 md:px-8 pt-10 pb-24" style={{ zIndex: 1 }}>
        {/* 页面标题 */}
        <div className="mb-16">
          <h1
            className="text-2xl md:text-3xl tracking-widest mb-4"
            style={{
              fontFamily: '"PingFangShiGuang", serif',
              color: "rgba(38,34,32,0.85)",
              letterSpacing: "0.18em",
            }}
          >
            封存你的记忆琥珀
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{
              fontFamily: "var(--font-noto-sans-sc), sans-serif",
              color: "rgba(38,34,32,0.6)",
            }}
          >
            无需完美，只需真实。你的第一直觉，往往是最清澈的。
          </p>
        </div>

        {/* ── 必填区 ── */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-10">
            <span
              className="text-sm tracking-widest"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                fontWeight: 500,
                color: "rgba(139,115,85,0.75)",
              }}
            >
              必填
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(139,115,85,0.12)" }}
            />
          </div>

          {/* Q1 三个词 */}
          <div className="mb-12">
            <label
              className="block text-sm tracking-widest mb-5"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                fontWeight: 500,
                color: "rgba(38,34,32,0.65)",
              }}
            >
              01 &nbsp;·&nbsp; 你眼中的 TA
            </label>
            <p
              className="text-sm mb-4"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                color: "rgba(38,34,32,0.82)",
              }}
            >
              用三个词形容 TA。
            </p>
            <AmberTextarea
              placeholder="第一个词 / 第二个词 / 第三个词"
              value={q1}
              onChange={setQ1}
              rows={2}
            />
          </div>

          {/* Q2 印象变迁 */}
          <div className="mb-12">
            <label
              className="block text-sm tracking-widest mb-5"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                fontWeight: 500,
                color: "rgba(38,34,32,0.65)",
              }}
            >
              02 &nbsp;·&nbsp; 印象变迁
            </label>
            <p
              className="text-sm mb-4"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                color: "rgba(38,34,32,0.82)",
              }}
            >
              你第一次见到 TA，和现在对 TA 的印象，有什么变化？
            </p>
            <AmberTextarea
              placeholder="起初我以为…而现在…"
              value={q2}
              onChange={setQ2}
              rows={4}
            />
          </div>

          {/* Q3 天赋感知 */}
          <div className="mb-2">
            <label
              className="block text-sm tracking-widest mb-5"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                fontWeight: 500,
                color: "rgba(38,34,32,0.65)",
              }}
            >
              03 &nbsp;·&nbsp; 天赋感知
            </label>
            <p
              className="text-sm mb-4"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                color: "rgba(38,34,32,0.82)",
              }}
            >
              你觉得 TA 在什么事情上，比大多数人更有天赋或者更让你印象深刻？
            </p>
            <AmberTextarea
              placeholder="你擅长的，可能是你最习以为常的…"
              value={q3}
              onChange={setQ3}
              rows={4}
            />
          </div>
        </section>

        {/* ── 选填区 · 深度探索 ── */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-10">
            <span
              className="text-sm tracking-widest"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                fontWeight: 400,
                color: "rgba(38,34,32,0.5)",
              }}
            >
              选填 · 深度探索
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(38,34,32,0.06)" }}
            />
          </div>

          {/* Q4 盲点 */}
          <div className="mb-12">
            <label
              className="block text-sm tracking-widest mb-5"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                fontWeight: 400,
                color: "rgba(38,34,32,0.5)",
              }}
            >
              04 &nbsp;·&nbsp; 我的盲点
            </label>
            <p
              className="text-sm mb-4"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                color: "rgba(38,34,32,0.72)",
              }}
            >
              你有没有观察到，TA 在某些时候会有什么习惯性的反应，可能连 TA 自己都没意识到？
            </p>
            <AmberTextarea
              placeholder="这只是一个观察，无需评判…"
              value={q4}
              onChange={setQ4}
              rows={4}
            />
          </div>

          {/* Q5 影响力 */}
          <div className="mb-12">
            <label
              className="block text-sm tracking-widest mb-5"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                fontWeight: 400,
                color: "rgba(38,34,32,0.5)",
              }}
            >
              05 &nbsp;·&nbsp; 你不知道的影响力
            </label>
            <p
              className="text-sm mb-4"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                color: "rgba(38,34,32,0.72)",
              }}
            >
              认识 TA 之后，有没有什么事是你开始做或者停止做的？哪怕很小的事。
            </p>
            <AmberTextarea
              placeholder="有时候影响力悄无声息地发生…"
              value={q5}
              onChange={setQ5}
              rows={4}
            />
          </div>

          {/* Q6 留言 */}
          <div className="mb-2">
            <label
              className="block text-sm tracking-widest mb-5"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                fontWeight: 400,
                color: "rgba(38,34,32,0.5)",
              }}
            >
              06 &nbsp;·&nbsp; 一句话留言
            </label>
            <p
              className="text-sm mb-4"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                color: "rgba(38,34,32,0.72)",
              }}
            >
              有没有什么你一直想对 TA 说，但没有合适机会说的话？
            </p>
            <AmberTextarea
              placeholder="此刻是最合适的时机…"
              value={q6}
              onChange={setQ6}
              rows={3}
            />
          </div>
        </section>

        {/* ── 选填区 · 视觉记忆 ── */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-10">
            <span
              className="text-sm tracking-widest"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                fontWeight: 400,
                color: "rgba(38,34,32,0.5)",
              }}
            >
              选填 · 视觉记忆
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(38,34,32,0.06)" }}
            />
          </div>

          <p
            className="text-sm mb-6"
            style={{
              fontFamily: "var(--font-noto-sans-sc), sans-serif",
              color: "rgba(38,34,32,0.65)",
            }}
          >
            如果你们有一张照片代表你们的关系，可以上传在这里。
          </p>

          <div
            className="relative flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-700"
            style={{
              height: "140px",
              border: "1px dashed rgba(139,115,85,0.25)",
              borderRadius: "4px",
              background: "rgba(255,255,255,0.50)",
              backdropFilter: "blur(8px)",
            }}
            onClick={() => fileInputRef.current?.click()}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor =
                "rgba(139,115,85,0.45)";
              (e.currentTarget as HTMLDivElement).style.background =
                "rgba(139,115,85,0.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor =
                "rgba(139,115,85,0.25)";
              (e.currentTarget as HTMLDivElement).style.background =
                "rgba(255,255,255,0.50)";
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPhotoFile(file);
                  setPhotoName(file.name);
                }
              }}
            />
            {photoName ? (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M4 10l4 4 8-8"
                    stroke={AMBER}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className="text-xs"
                  style={{ color: "rgba(139,115,85,0.7)" }}
                >
                  {photoName}
                </span>
                <button
                  className="text-xs"
                  style={{ color: "rgba(38,34,32,0.25)" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoFile(null);
                    setPhotoName(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  移除
                </button>
              </>
            ) : (
              <>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect
                    x="3"
                    y="5"
                    width="16"
                    height="12"
                    rx="1.5"
                    stroke="rgba(139,115,85,0.35)"
                    strokeWidth="1.2"
                  />
                  <circle
                    cx="8"
                    cy="9"
                    r="1.5"
                    stroke="rgba(139,115,85,0.35)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M3 14l4-3 3 3 3-4 4 4"
                    stroke="rgba(139,115,85,0.35)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className="text-xs tracking-wider"
                  style={{
                    fontFamily: "var(--font-noto-sans-sc), sans-serif",
                    color: "rgba(38,34,32,0.45)",
                  }}
                >
                  点击上传照片
                </span>
              </>
            )}
          </div>
        </section>

        {/* ── 署名与提交 ── */}
        <section>
          <div
            className="h-px mb-10"
            style={{ background: "rgba(38,34,32,0.06)" }}
          />

          <div className="mb-8">
            <label
              className="block text-sm tracking-widest mb-4"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                fontWeight: 500,
                color: "rgba(38,34,32,0.65)",
              }}
            >
              你的署名{" "}
              <span style={{ color: AMBER }}>*</span>
            </label>
            <AmberInput
              placeholder="你希望 TA 如何称呼你"
              value={authorName}
              onChange={setAuthorName}
            />
          </div>

          {/* 错误提示 */}
          {status === "error" && errorMsg && (
            <p
              className="mb-4 text-sm leading-relaxed"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                color: "rgba(180,60,50,0.8)",
              }}
            >
              {errorMsg}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isReady || status === "loading"}
            className="w-full py-4 text-base tracking-widest transition-all duration-700 ease-out flex items-center justify-center gap-3"
            style={{
              fontFamily: "var(--font-noto-sans-sc), sans-serif",
              color: isReady
                ? "rgba(139,115,85,0.9)"
                : "rgba(139,115,85,0.3)",
              border: `1px solid ${
                isReady ? AMBER_BORDER : "rgba(38,34,32,0.08)"
              }`,
              borderRadius: "2px",
              background: isReady
                ? "rgba(255,255,255,0.55)"
                : "transparent",
              backdropFilter: "blur(12px)",
              cursor: isReady ? "pointer" : "not-allowed",
              letterSpacing: "0.2em",
            }}
          >
            {status === "loading" ? (
              <>
                <span
                  className="inline-block w-4 h-4 rounded-full border-t border-r animate-spin"
                  style={{ borderColor: `${AMBER} transparent` }}
                />
                <span>凝固中…</span>
              </>
            ) : (
              "凝固记忆"
            )}
          </button>

          {!isReady && (
            <p
              className="mt-4 text-center text-xs"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                color: "rgba(38,34,32,0.45)",
              }}
            >
              请完成必填项后方可提交
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
