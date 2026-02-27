"use client";

import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { createClient } from "@/lib/supabase/client";

const GOLD = "#8b7355";
const GOLD_BORDER = "rgba(139,115,85,0.3)";

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
        borderBottom: `1px solid ${focused ? GOLD : "rgba(38,34,32,0.12)"}`,
        color: "#262220",
        fontFamily: '"PingFangShiGuang", serif',
        fontWeight: 300,
        fontSize: "1.125rem",
        lineHeight: "1.9",
        padding: "8px 0",
        resize: "none",
        outline: "none",
        transition: "border-bottom-color 600ms ease-out",
        caretColor: GOLD,
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
        width: "100%",
        background: "transparent",
        border: "none",
        borderBottom: `1px solid ${focused ? GOLD : "rgba(38,34,32,0.12)"}`,
        color: "#262220",
        fontFamily: '"PingFangShiGuang", serif',
        fontWeight: 300,
        fontSize: "1.125rem",
        lineHeight: "1.9",
        padding: "8px 0",
        outline: "none",
        transition: "border-bottom-color 600ms ease-out",
        caretColor: GOLD,
      }}
      className="placeholder:text-black/35 w-full"
    />
  );
}

// ── ProfileForm：定义自我 Tab ──────────────────────────────────────────────

interface ProfileFormProps {
  userId: string;
  initialFullName: string;
  initialCustomIntro: string;
  initialCustomContext: string;
  initialCustomScene: string;
}

export function ProfileForm({
  userId,
  initialFullName,
  initialCustomIntro,
  initialCustomContext,
  initialCustomScene,
}: ProfileFormProps) {
  const supabase = createClient();
  const [fullName, setFullName] = useState(initialFullName);
  const [customIntro, setCustomIntro] = useState(initialCustomIntro);
  const [customContext, setCustomContext] = useState(initialCustomContext);
  const [customScene, setCustomScene] = useState(initialCustomScene);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleSave = async () => {
    setSaveStatus("saving");
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        full_name: fullName.trim(),
        custom_intro: customIntro.trim(),
        custom_context: customContext.trim(),
        custom_scene: customScene.trim(),
      });
    setSaveStatus(error ? "error" : "saved");
    if (!error) {
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-8">
        <div>
          <label
            className="block text-lg tracking-widest mb-4"
            style={{
              fontFamily: '"PingFangShiGuang", serif',
              fontWeight: 400,
              color: "rgba(38,34,32,0.65)",
              letterSpacing: "0.18em",
            }}
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
            className="block text-lg tracking-widest mb-4"
            style={{
              fontFamily: '"PingFangShiGuang", serif',
              fontWeight: 400,
              color: "rgba(38,34,32,0.65)",
              letterSpacing: "0.18em",
            }}
          >
            背景引言
          </label>
          <AmberTextarea
            placeholder="例如：在巴厘岛这 8 天的日夜里，我们共同构建了一个短暂却真实的场域..."
            value={customIntro}
            onChange={setCustomIntro}
            rows={5}
          />
          <p
            className="mt-3 text-lg leading-relaxed"
            style={{
              fontFamily: '"PingFangShiGuang", serif',
              fontWeight: 400,
              color: "rgba(38,34,32,0.45)",
            }}
          >
            这段引言将展示在你的专属填写页，为受邀者营造情绪氛围。
          </p>
        </div>
        <div>
          <label
            className="block text-lg tracking-widest mb-4"
            style={{
              fontFamily: '"PingFangShiGuang", serif',
              fontWeight: 400,
              color: "rgba(38,34,32,0.65)",
              letterSpacing: "0.18em",
            }}
          >
            场域描述
          </label>
          <AmberTextarea
            placeholder="在巴厘岛这 8 天的日夜、屏幕前的 Bug 与岛屿的晚风里，我们共同构建了一个短暂却真实的场域。我知道，那些固有的人设和职业标签在这里是被消解的。"
            value={customContext}
            onChange={setCustomContext}
            rows={4}
          />
          <p
            className="mt-3 text-lg leading-relaxed"
            style={{
              fontFamily: '"PingFangShiGuang", serif',
              fontWeight: 400,
              color: "rgba(38,34,32,0.45)",
            }}
          >
            描述你们共同经历的场域背景，为空时将展示浅色提示文案。
          </p>
        </div>
        <div>
          <label
            className="block text-lg tracking-widest mb-4"
            style={{
              fontFamily: '"PingFangShiGuang", serif',
              fontWeight: 400,
              color: "rgba(38,34,32,0.65)",
              letterSpacing: "0.18em",
            }}
          >
            这场______的前夕
          </label>
          <AmberInput
            placeholder="人生实验"
            value={customScene}
            onChange={setCustomScene}
          />
          <p
            className="mt-3 text-lg leading-relaxed"
            style={{
              fontFamily: '"PingFangShiGuang", serif',
              fontWeight: 400,
              color: "rgba(38,34,32,0.45)",
            }}
          >
            将出现在「在即将各自退回原有轨道、结束这场____的前夕…」中，为空时默认显示「人生实验」。
          </p>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saveStatus === "saving"}
        className="self-start px-8 py-3 text-lg tracking-widest transition-all duration-700 ease-out flex items-center gap-2"
        style={{
          fontFamily: '"PingFangShiGuang", serif',
          fontWeight: 600,
          color:
            saveStatus === "saved"
              ? "rgba(139,115,85,0.9)"
              : "rgba(139,115,85,0.75)",
          border: `1px solid ${
            saveStatus === "saved" ? GOLD_BORDER : "rgba(139,115,85,0.2)"
          }`,
          borderRadius: "1px",
          background: "rgba(139,115,85,0.04)",
          cursor: saveStatus === "saving" ? "not-allowed" : "pointer",
          letterSpacing: "0.18em",
        }}
      >
        {saveStatus === "saving" && (
          <span
            className="inline-block w-3 h-3 rounded-full border-t border-r animate-spin"
            style={{ borderColor: `${GOLD} transparent` }}
          />
        )}
        {saveStatus === "saved"
          ? "已保存"
          : saveStatus === "error"
          ? "保存失败，重试"
          : "保存设置"}
      </button>
    </div>
  );
}

// ── SharePanel：获取信物 Tab ───────────────────────────────────────────────

interface SharePanelProps {
  shareUrl: string;
}

export function SharePanel({ shareUrl }: SharePanelProps) {
  const [copied, setCopied] = useState(false);
  const linkRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col items-center gap-10">
      {/* QR 码居中 */}
      <div
        className="p-7 rounded"
        style={{
          background: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(139,115,85,0.18)",
          boxShadow: "0 2px 24px rgba(139,115,85,0.06)",
        }}
      >
        <QRCodeSVG
          value={shareUrl}
          size={180}
          bgColor="transparent"
          fgColor="rgba(100,80,55,0.85)"
          level="M"
        />
      </div>

      <p
        className="text-lg leading-loose text-center max-w-sm"
        style={{
          fontFamily: '"PingFangShiGuang", serif',
          fontWeight: 400,
              color: "rgba(38,34,32,0.65)",
              letterSpacing: "0.04em",
        }}
      >
        让朋友扫描二维码，或将链接发送给他们，
        <br />即可为你封存一枚专属琥珀。
      </p>

      {/* 链接复制 */}
      <div className="w-full max-w-md">
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{
          background: "rgba(255,255,255,0.55)",
          border: "1px solid rgba(38,34,32,0.08)",
            borderRadius: "1px",
          }}
        >
          <input
            ref={linkRef}
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent text-xs outline-none"
            style={{
              color: "rgba(38,34,32,0.6)",
              fontFamily: '"PingFangShiGuang", monospace',
              cursor: "text",
            }}
          />
          <button
            onClick={handleCopy}
            className="text-lg tracking-widest transition-all duration-500 shrink-0"
            style={{
              fontFamily: '"PingFangShiGuang", serif',
              fontWeight: 600,
              color: copied
                ? "rgba(139,115,85,0.9)"
                : "rgba(139,115,85,0.75)",
              background: "none",
              cursor: "pointer",
              letterSpacing: "0.12em",
            }}
          >
            {copied ? "已复制" : "复制"}
          </button>
        </div>
      </div>
    </div>
  );
}
