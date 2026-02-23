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
      className="mt-1 text-sm tracking-widest transition-all duration-300"
      style={{
        fontFamily: "var(--font-noto-sans-sc), sans-serif",
        fontWeight: 400,
        color: "rgba(38,34,32,0.45)",
        background: "none",
        cursor: "pointer",
        letterSpacing: "0.18em",
      }}
    >
      退出登录
    </button>
  );
}
