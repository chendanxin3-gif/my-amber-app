"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import InkBackground from "@/app/components/InkBackground";
import BgmPlayer from "@/app/components/BgmPlayer";

type AuthMode = "login" | "register";
type AuthStatus = "idle" | "loading" | "error";

const GOLD = "#8b7355";
const GOLD_BORDER = "rgba(139,115,85,0.3)";

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
        borderBottom: `1px solid ${focused ? GOLD : "rgba(38,34,32,0.15)"}`,
        color: "#262220",
        fontFamily: "var(--font-noto-sans-sc), sans-serif",
        fontSize: "1.25rem",
        lineHeight: "1.9",
        padding: "8px 0",
        outline: "none",
        transition: "border-bottom-color 600ms ease-out",
        caretColor: GOLD,
      }}
      className="placeholder:text-black/35"
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
      style={{ background: "#F4F1EE" }}
      onClick={() => {
        if (!actTwo) setActTwo(true);
      }}
    >
      {/* 水墨晕染动态背景 */}
      <InkBackground />

      {/* 背景音乐控制器 */}
      <BgmPlayer />

      {/* ── 第一幕：平台理念 ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-8 md:px-16"
        style={{
          opacity: actTwo ? 0 : 1,
          transition: "opacity 1000ms ease-out",
          pointerEvents: actTwo ? "none" : "auto",
          zIndex: 1,
        }}
      >
        <div
          className="max-w-2xl w-full px-10 py-12 md:px-16 md:py-14"
          style={{
            background: "rgba(244,241,238,0.72)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {/* 主标题 */}
          <h1
            className="tracking-widest mb-10"
            style={{
              fontFamily: '"PingFangShiGuang", serif',
              fontWeight: 300,
              fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
              color: "rgba(38,34,32,0.85)",
              letterSpacing: "0.22em",
            }}
          >
            万物见我·一期一会
          </h1>

          <p
            className="leading-loose"
            style={{
              fontFamily: "var(--font-noto-serif-sc), serif",
              fontWeight: 300,
              fontSize: "clamp(0.82rem, 1.5vw, 0.95rem)",
              color: "rgba(38,34,32,0.55)",
              letterSpacing: "0.04em",
            }}
          >
            日本茶道讲「一期一会」——此刻的相遇、这杯茶、坐在这里的人，一生仅有一次，绝不重来。
          </p>

          <p
            className="mt-7 leading-loose"
            style={{
              fontFamily: "var(--font-noto-serif-sc), serif",
              fontWeight: 300,
              fontSize: "clamp(0.82rem, 1.5vw, 0.95rem)",
              color: "rgba(38,34,32,0.55)",
              letterSpacing: "0.04em",
            }}
          >
            告别社交场点赞式的寒暄，收集无可替代的关系印记。借他者的眼睛，凝固那个你未曾察觉的、真实的自己。
          </p>

          <p
            className="mt-7 leading-loose"
            style={{
              fontFamily: "var(--font-noto-serif-sc), serif",
              fontWeight: 300,
              fontSize: "clamp(0.82rem, 1.5vw, 0.95rem)",
              color: "rgba(38,34,32,0.55)",
              letterSpacing: "0.04em",
            }}
          >
            生成专属链接，邀一期一会之人，为你封存一枚关系琥珀。
          </p>
        </div>

        {/* 呼吸提示 */}
        <div
          className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-3 animate-pulse"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            style={{ color: "rgba(139,115,85,0.5)" }}
          >
            <path
              d="M10 3v14M10 17l-5-5M10 17l5-5"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-noto-sans-sc), sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "rgba(139,115,85,0.7)",
              letterSpacing: "0.22em",
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
          zIndex: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 主标题 */}
        <h1
          className="text-center tracking-widest mb-12"
          style={{
            fontFamily: '"PingFangShiGuang", serif',
            fontWeight: 300,
            fontSize: "clamp(1.5rem, 4vw, 2.8rem)",
            color: "rgba(38,34,32,0.82)",
            letterSpacing: "0.28em",
          }}
        >
          万物见我·一期一会
        </h1>

        {/* 登录注册卡片 */}
        <div
          style={{
            background: "rgba(255,255,255,0.60)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${GOLD_BORDER}`,
            borderRadius: "2px",
            padding: "44px 44px 40px",
            width: "100%",
            maxWidth: "400px",
            boxShadow:
              "0 4px 40px rgba(139,115,85,0.08), 0 1px 0 rgba(255,255,255,0.8) inset",
          }}
        >
          {/* 模式切换 */}
          <div className="flex gap-7 mb-10">
            {(["login", "register"] as AuthMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setAuthMode(mode);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="text-lg tracking-widest transition-all duration-500"
                style={{
                  fontFamily: "var(--font-noto-sans-sc), sans-serif",
                  fontWeight: 600,
                  color:
                    authMode === mode
                      ? "rgba(139,115,85,0.9)"
                      : "rgba(38,34,32,0.55)",
                  borderBottom:
                    authMode === mode
                      ? `1px solid rgba(139,115,85,0.5)`
                      : "1px solid transparent",
                  paddingBottom: "4px",
                  background: "none",
                  cursor: "pointer",
                  letterSpacing: "0.2em",
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
              className="mb-4 text-lg leading-relaxed"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                color: "rgba(180,60,50,0.8)",
              }}
            >
              {errorMsg}
            </p>
          )}
          {successMsg && (
            <p
              className="mb-4 text-lg leading-relaxed"
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                color: "rgba(139,115,85,0.9)",
              }}
            >
              {successMsg}
            </p>
          )}

          {/* 主按钮 */}
          <button
            onClick={handleAuth}
            disabled={authStatus === "loading"}
            className="w-full py-3 text-lg tracking-widest transition-all duration-700 ease-out flex items-center justify-center gap-2"
            style={{
              fontFamily: "var(--font-noto-sans-sc), sans-serif",
              fontWeight: 600,
              color: "rgba(139,115,85,0.9)",
              border: `1px solid ${GOLD_BORDER}`,
              borderRadius: "1px",
              background: "rgba(139,115,85,0.06)",
              cursor: authStatus === "loading" ? "not-allowed" : "pointer",
              letterSpacing: "0.18em",
            }}
          >
            {authStatus === "loading" ? (
              <>
                <span
                  className="inline-block w-3 h-3 rounded-full border-t border-r animate-spin"
                  style={{ borderColor: `${GOLD} transparent` }}
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
              style={{ background: "rgba(38,34,32,0.08)" }}
            />
            <span
              style={{
                fontFamily: "var(--font-noto-sans-sc), sans-serif",
                fontWeight: 300,
                fontSize: "1rem",
                color: "rgba(38,34,32,0.4)",
              }}
            >
              或
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(38,34,32,0.08)" }}
            />
          </div>

          {/* GitHub OAuth */}
          <button
            onClick={handleGithubLogin}
            className="w-full py-3 text-lg tracking-widest transition-all duration-700 ease-out flex items-center justify-center gap-2"
            style={{
              fontFamily: "var(--font-noto-sans-sc), sans-serif",
              fontWeight: 600,
              color: "rgba(38,34,32,0.6)",
              border: "1px solid rgba(38,34,32,0.1)",
              borderRadius: "1px",
              background: "transparent",
              cursor: "pointer",
              letterSpacing: "0.14em",
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
