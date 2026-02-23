"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "register";
type AuthStatus = "idle" | "loading" | "error";

const AMBER = "#D4AF37";
const AMBER_BORDER = "rgba(212,175,55,0.35)";

function AmberInput({
  type,
  placeholder,
  value,
  onChange,
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        background: "transparent",
        border: "none",
        borderBottom: `1px solid ${focused ? AMBER : "rgba(255,255,255,0.12)"}`,
        color: "#e8e0d0",
        fontFamily: "var(--font-geist-sans), sans-serif",
        fontSize: "0.9rem",
        lineHeight: "1.9",
        padding: "8px 0",
        outline: "none",
        transition: "border-bottom-color 600ms ease-out",
        caretColor: AMBER,
      }}
      className="placeholder:text-white/20"
    />
  );
}

export default function LandingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [actTwo, setActTwo] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authStatus, setAuthStatus] = useState<AuthStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) return;
    setAuthStatus("loading");
    setErrorMsg("");
    setSuccessMsg("");

    if (authMode === "register") {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setErrorMsg(error.message);
        setAuthStatus("error");
      } else {
        setSuccessMsg("注册成功！请检查邮箱完成验证，验证后即可登录。");
        setAuthStatus("idle");
      }
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setErrorMsg("邮箱或密码错误，请重试。");
      setAuthStatus("error");
    } else {
      router.push("/dashboard");
    }
  };

  const handleGithubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAuth();
  };

  return (
    <main
      className="relative h-screen w-full overflow-hidden flex items-center justify-center cursor-pointer select-none"
      style={{ background: "#0a0a0a" }}
      onClick={() => {
        if (!actTwo) setActTwo(true);
      }}
    >
      {/* 背景琥珀渐晕 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(212,175,55,0.04) 0%, transparent 70%)",
        }}
      />

      {/* ── 第一幕：平台理念 ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12"
        style={{
          opacity: actTwo ? 0 : 1,
          transition: "opacity 1000ms ease-out",
          pointerEvents: actTwo ? "none" : "auto",
        }}
      >
        <div className="max-w-3xl w-full">
          <h1
            className="text-2xl md:text-3xl tracking-widest mb-10"
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              color: "rgba(232, 224, 208, 0.9)",
              letterSpacing: "0.18em",
            }}
          >
            万物见我 · 一期一会
          </h1>

          <p
            className="leading-loose text-sm md:text-base"
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              color: "rgba(232, 224, 208, 0.65)",
              letterSpacing: "0.02em",
            }}
          >
            日本茶道里讲「一期一会」——此刻的相遇，一生仅有一次，绝不重来。
          </p>

          <p
            className="mt-7 leading-loose text-sm md:text-base"
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              color: "rgba(232, 224, 208, 0.65)",
              letterSpacing: "0.02em",
            }}
          >
            告别人情世故的点赞，收集只属于你的关系琥珀。生成你的专属链接，邀请真正了解你的人，用他们最真实的目光，为你凝固一枚永恒的关系印记。
          </p>

          <p
            className="mt-7 leading-loose text-sm md:text-base"
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              color: "rgba(232, 224, 208, 0.65)",
              letterSpacing: "0.02em",
            }}
          >
            人无法真正看清自己。请借他者的眼睛，凝固那个你未曾察觉的自己。
          </p>
        </div>

        {/* 呼吸提示 */}
        <div
          className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-3 animate-pulse"
        >
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

      {/* ── 第二幕：登录注册 ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12"
        style={{
          opacity: actTwo ? 1 : 0,
          transition: "opacity 1000ms ease-out",
          pointerEvents: actTwo ? "auto" : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h1
          className="text-3xl md:text-5xl lg:text-6xl tracking-widest text-center mb-14"
          style={{
            fontFamily: "var(--font-lora), Georgia, serif",
            color: "#e8e0d0",
            letterSpacing: "0.18em",
          }}
        >
          万物见我 · 一期一会
        </h1>

        {/* 登录注册卡片 */}
        <div
          style={{
            background: "rgba(255,255,255,0.025)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${AMBER_BORDER}`,
            borderRadius: "4px",
            padding: "40px 40px 36px",
            width: "100%",
            maxWidth: "400px",
            boxShadow:
              "0 0 60px rgba(212,175,55,0.05), inset 0 0 20px rgba(212,175,55,0.02)",
          }}
        >
          {/* 模式切换 */}
          <div className="flex gap-6 mb-10">
            {(["login", "register"] as AuthMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setAuthMode(mode);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="text-xs tracking-widest transition-all duration-500"
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  color:
                    authMode === mode
                      ? "rgba(212,175,55,0.9)"
                      : "rgba(232,224,208,0.25)",
                  borderBottom:
                    authMode === mode
                      ? `1px solid rgba(212,175,55,0.5)`
                      : "1px solid transparent",
                  paddingBottom: "4px",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                {mode === "login" ? "登录" : "注册"}
              </button>
            ))}
          </div>

          {/* 输入区 */}
          <div className="flex flex-col gap-6 mb-8" onKeyDown={handleKeyDown}>
            <AmberInput
              type="email"
              placeholder="邮箱地址"
              value={email}
              onChange={setEmail}
            />
            <AmberInput
              type="password"
              placeholder="密码（至少 6 位）"
              value={password}
              onChange={setPassword}
            />
          </div>

          {/* 错误 / 成功提示 */}
          {errorMsg && (
            <p
              className="mb-4 text-xs leading-relaxed"
              style={{ color: "rgba(239,68,68,0.8)" }}
            >
              {errorMsg}
            </p>
          )}
          {successMsg && (
            <p
              className="mb-4 text-xs leading-relaxed"
              style={{ color: "rgba(212,175,55,0.8)" }}
            >
              {successMsg}
            </p>
          )}

          {/* 主按钮 */}
          <button
            onClick={handleAuth}
            disabled={authStatus === "loading"}
            className="w-full py-3 text-xs tracking-widest transition-all duration-700 ease-out flex items-center justify-center gap-2"
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              color: "rgba(212,175,55,0.9)",
              border: `1px solid ${AMBER_BORDER}`,
              borderRadius: "2px",
              background: "rgba(212,175,55,0.05)",
              cursor: authStatus === "loading" ? "not-allowed" : "pointer",
              letterSpacing: "0.15em",
            }}
          >
            {authStatus === "loading" ? (
              <>
                <span
                  className="inline-block w-3 h-3 rounded-full border-t border-r animate-spin"
                  style={{ borderColor: `${AMBER} transparent` }}
                />
                <span>处理中…</span>
              </>
            ) : authMode === "login" ? (
              "进入我的琥珀库"
            ) : (
              "创建我的专属琥珀"
            )}
          </button>

          {/* 分割线 */}
          <div className="flex items-center gap-4 my-5">
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
            <span
              className="text-xs"
              style={{ color: "rgba(232,224,208,0.2)" }}
            >
              或
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
          </div>

          {/* GitHub OAuth */}
          <button
            onClick={handleGithubLogin}
            className="w-full py-3 text-xs tracking-widest transition-all duration-700 ease-out flex items-center justify-center gap-2"
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              color: "rgba(232,224,208,0.4)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "2px",
              background: "transparent",
              cursor: "pointer",
              letterSpacing: "0.12em",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            使用 GitHub 登录
          </button>
        </div>
      </div>
    </main>
  );
}
