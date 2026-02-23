import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AmberLandingClient from "./AmberLandingClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AmberPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, custom_intro")
    .eq("id", id)
    .single();

  if (error || !profile) notFound();

  return (
    <AmberLandingClient
      profileId={id}
      fullName={profile.full_name ?? "你"}
      customIntro={profile.custom_intro ?? ""}
    />
  );
}
