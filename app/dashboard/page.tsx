import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import ProfilePanel from "./ProfilePanel";
import AmberGrid from "./AmberGrid";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  // 读取 profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, custom_intro")
    .eq("id", user.id)
    .single();

  // 读取该用户收到的所有 ambers
  const { data: ambers } = await supabase
    .from("ambers")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  // 动态获取域名，不依赖环境变量
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const origin = `${protocol}://${host}`;
  const shareUrl = `${origin}/amber/${user.id}`;

  const totalCount = ambers?.length ?? 0;
  const photosCount = ambers?.filter((a) => a.image_url).length ?? 0;

  return (
    <main className="min-h-screen w-full" style={{ background: "#0a0a0a" }}>
      {/* 背景光晕 */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(212,175,55,0.03) 0%, transparent 60%)",
        }}
      />

      {/* 顶部标题区 */}
      <header
        className="relative px-6 md:px-16 pt-14 pb-12"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <p
          className="text-xs tracking-widest mb-4"
          style={{ color: "rgba(212,175,55,0.4)" }}
        >
          私人视角 · 他者之镜
        </p>
        <h1
          className="text-2xl md:text-4xl tracking-widest"
          style={{
            fontFamily: "var(--font-lora), Georgia, serif",
            color: "#e8e0d0",
          }}
        >
          万物见我
        </h1>
        <p className="mt-3 text-sm" style={{ color: "rgba(232,224,208,0.35)" }}>
          此页面仅你可见。以下是凝固于时光中的{" "}
          <span style={{ color: "rgba(212,175,55,0.7)" }}>{totalCount}</span>{" "}
          枚琥珀
          {photosCount > 0 && (
            <span style={{ color: "rgba(232,224,208,0.25)" }}>
              ，其中{" "}
              <span style={{ color: "rgba(212,175,55,0.5)" }}>
                {photosCount}
              </span>{" "}
              枚含有照片
            </span>
          )}
          。
        </p>
      </header>

      {/* Profile 配置 + 分享区 */}
      <ProfilePanel
        userId={user.id}
        initialFullName={profile?.full_name ?? ""}
        initialCustomIntro={profile?.custom_intro ?? ""}
        shareUrl={shareUrl}
      />

      {/* 琥珀卡片瀑布流 */}
      <AmberGrid ambers={ambers ?? []} />

      {/* 底部水印 */}
      <footer className="px-6 md:px-16 pb-10 text-center">
        <p
          className="text-xs tracking-widest"
          style={{ color: "rgba(212,175,55,0.15)" }}
        >
          万物见我 · 一期一会 · Amber of Relationships
        </p>
      </footer>
    </main>
  );
}
