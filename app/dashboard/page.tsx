import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import DashboardTabs from "./DashboardTabs";
import LogoutButton from "./LogoutButton";
import InkBackground from "@/app/components/InkBackground";
import BgmPlayer from "@/app/components/BgmPlayer";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, custom_intro")
    .eq("id", user.id)
    .single();

  const { data: ambers } = await supabase
    .from("ambers")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const origin = `${protocol}://${host}`;
  const shareUrl = `${origin}/amber/${user.id}`;

  return (
    <main className="relative min-h-screen w-full" style={{ background: "#F4F1EE" }}>
      {/* 水墨晕染背景 */}
      <InkBackground />

      {/* 背景音乐控制器 */}
      <BgmPlayer />

      {/* 内容层，relative z-1 覆盖背景 */}
      <div className="relative" style={{ zIndex: 1 }}>
        {/* 顶部标题区 */}
        <header className="px-6 md:px-16 pt-14 pb-8">
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs tracking-widest mb-4"
                style={{
                  fontFamily: "var(--font-noto-sans-sc), sans-serif",
                  fontWeight: 300,
                  color: "rgba(139,115,85,0.6)",
                  letterSpacing: "0.2em",
                }}
              >
                私人视角 · 他者之镜
              </p>
              <h1
                className="tracking-widest"
                style={{
                  fontFamily: "var(--font-noto-serif-sc), serif",
                  fontWeight: 300,
                  fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)",
                  color: "rgba(38,34,32,0.82)",
                  letterSpacing: "0.2em",
                }}
              >
                萬物見我
              </h1>
            </div>
            <LogoutButton />
          </div>
        </header>

        {/* Tab 区域 */}
        <DashboardTabs
          userId={user.id}
          initialFullName={profile?.full_name ?? ""}
          initialCustomIntro={profile?.custom_intro ?? ""}
          shareUrl={shareUrl}
          ambers={ambers ?? []}
        />

        {/* 底部水印 */}
        <footer className="px-6 md:px-16 pb-12 pt-6 text-center">
          <p
            className="text-xs tracking-widest"
            style={{
              fontFamily: "var(--font-noto-sans-sc), sans-serif",
              fontWeight: 300,
              color: "rgba(139,115,85,0.25)",
              letterSpacing: "0.2em",
            }}
          >
            萬物見我 · 一期一會 · Amber of Relationships
          </p>
        </footer>
      </div>
    </main>
  );
}
