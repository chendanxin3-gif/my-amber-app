"use client";

import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { createClient } from "@/lib/supabase/client";

const AMBER = "#D4AF37";
const AMBER_BORDER = "rgba(212,175,55,0.35)";

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
        width: "100%",
        background: "transparent",
        border: "none",
        borderBottom: `1px solid ${focused ? AMBER : "rgba(255,255,255,0.1)"}`,
        color: "#e8e0d0",
        fontFamily: "var(--font-geist-sans), sans-serif",
        fontSize: "0.9rem",
        lineHeight: "1.9",
        padding: "8px 0",
        resize: "none",
        outline: "none",
        transition: "border-bottom-color 600ms ease-out",
        caretColor: AMBER,
      }}
      className="placeholder:text-white/20 w-full"
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
        width: "100%",
        background: "transparent",
        border: "none",
        borderBottom: `1px solid ${focused ? AMBER : "rgba(255,255,255,0.1)"}`,
        color: "#e8e0d0",
        fontFamily: "var(--font-geist-sans), sans-serif",
        fontSize: "0.9rem",
        lineHeight: "1.9",
        padding: "8px 0",
        outline: "none",
        transition: "border-bottom-color 600ms ease-out",
        caretColor: AMBER,
      }}
      className="placeholder:text-white/20 w-full"
    />
  );
}

interface ProfilePanelProps {
  userId: string;
  initialFullName: string;
  initialCustomIntro: string;
  shareUrl: string;
}

export default function ProfilePanel({
  userId,
  initialFullName,
  initialCustomIntro,
  shareUrl,
}: ProfilePanelProps) {
  const supabase = createClient();
  const [fullName, setFullName] = useState(initialFullName);
  const [customIntro, setCustomIntro] = useState(initialCustomIntro);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [copied, setCopied] = useState(false);
  const linkRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setSaveStatus("saving");
    // 仅 upsert schema 中定义的字段，不包含 updated_at
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        full_name: fullName.trim(),
        custom_intro: customIntro.trim(),
      });
    setSaveStatus(error ? "error" : "saved");
    if (!error) {
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div
      className="px-6 md:px-16 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      {/* 左侧：Profile 配置 */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <p
            className="text-xs tracking-widest"
            style={{ color: "rgba(212,175,55,0.5)" }}
          >
            创作者设置
          </p>
          <button
            onClick={handleLogout}
            className="text-xs tracking-widest transition-all duration-300"
            style={{
              color: "rgba(232,224,208,0.2)",
              background: "none",
              cursor: "pointer",
            }}
          >
            退出登录
          </button>
        </div>

        <div className="flex flex-col gap-8 mb-8">
          <div>
            <label
              className="block text-xs tracking-widest mb-4"
              style={{ color: "rgba(232,224,208,0.35)" }}
            >
              你的名字 / 昵称
            </label>
            <AmberInput
              placeholder="你希望别人如何称呼你"
              value={fullName}
              onChange={setFullName}
            />
          </div>
          <div>
            <label
              className="block text-xs tracking-widest mb-4"
              style={{ color: "rgba(232,224,208,0.35)" }}
            >
              背景引言
            </label>
            <AmberTextarea
              placeholder="例如：在巴厘岛这 8 天的日夜里，我们共同构建了一个短暂却真实的场域..."
              value={customIntro}
              onChange={setCustomIntro}
              rows={4}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className="px-8 py-3 text-xs tracking-widest transition-all duration-700 ease-out flex items-center gap-2"
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            color:
              saveStatus === "saved"
                ? "rgba(212,175,55,0.9)"
                : "rgba(212,175,55,0.7)",
            border: `1px solid ${
              saveStatus === "saved" ? AMBER_BORDER : "rgba(212,175,55,0.2)"
            }`,
            borderRadius: "2px",
            background: "rgba(255,255,255,0.02)",
            cursor: saveStatus === "saving" ? "not-allowed" : "pointer",
            letterSpacing: "0.15em",
          }}
        >
          {saveStatus === "saving" && (
            <span
              className="inline-block w-3 h-3 rounded-full border-t border-r animate-spin"
              style={{ borderColor: `${AMBER} transparent` }}
            />
          )}
          {saveStatus === "saved"
            ? "已保存"
            : saveStatus === "error"
            ? "保存失败，重试"
            : "保存设置"}
        </button>
      </div>

      {/* 右侧：分享链接 + QR 码 */}
      <div>
        <p
          className="text-xs tracking-widest mb-8"
          style={{ color: "rgba(212,175,55,0.5)" }}
        >
          你的专属分享入口
        </p>

        <div className="flex flex-col items-start gap-6">
          {/* QR 码 */}
          <div
            className="p-5 rounded"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(212,175,55,0.15)",
            }}
          >
            <QRCodeSVG
              value={shareUrl}
              size={140}
              bgColor="transparent"
              fgColor="rgba(212,175,55,0.85)"
              level="M"
            />
          </div>

          {/* 链接复制 */}
          <div className="w-full">
            <div
              className="flex items-center gap-3 px-4 py-3 rounded"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <input
                ref={linkRef}
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-xs outline-none"
                style={{
                  color: "rgba(232,224,208,0.45)",
                  fontFamily: "var(--font-geist-mono), monospace",
                  cursor: "text",
                }}
              />
              <button
                onClick={handleCopy}
                className="text-xs tracking-widest transition-all duration-500 shrink-0"
                style={{
                  color: copied
                    ? "rgba(212,175,55,0.9)"
                    : "rgba(212,175,55,0.5)",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                {copied ? "已复制" : "复制"}
              </button>
            </div>
            <p
              className="mt-3 text-xs leading-relaxed"
              style={{ color: "rgba(232,224,208,0.25)" }}
            >
              将此链接发送给你的朋友，或让他们扫描二维码，即可为你封存一枚专属琥珀。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
