import { redirect } from "next/navigation";

// 此路由无实际用途，统一重定向到首页
export default function SubmitRedirectPage() {
  redirect("/");
}
