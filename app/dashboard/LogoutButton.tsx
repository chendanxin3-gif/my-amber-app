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
        color: "rgba(232,224,208,0.2)",
        background: "none",
        cursor: "pointer",
      }}
    >
      退出登录
    </button>
  );
}
