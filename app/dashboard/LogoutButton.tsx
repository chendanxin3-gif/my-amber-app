"use client";

import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-1 text-xs tracking-widest transition-all duration-300"
      style={{
        fontFamily: "var(--font-noto-sans-sc), sans-serif",
        fontWeight: 300,
        color: "rgba(26,20,16,0.22)",
        background: "none",
        cursor: "pointer",
        letterSpacing: "0.18em",
      }}
    >
      退出登录
    </button>
  );
}
