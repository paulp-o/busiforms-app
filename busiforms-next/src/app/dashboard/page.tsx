import { redirect } from "next/navigation";

export default function DashboardPageRedirected() {
  redirect("/dashboard/summary");
}
