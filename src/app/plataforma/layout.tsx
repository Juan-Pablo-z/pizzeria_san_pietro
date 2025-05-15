import { Sidebar } from "@/components";

import { NavBar } from "@/components";
import { WebSocketProvider } from "@/components/WebSocketContext";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import "../../css/platform/main.css";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <WebSocketProvider session={session}>
      <div className="relative">
        <Sidebar user={session.user} />
        <NavBar />
        <main>{children}</main>
      </div>
    </WebSocketProvider>
  );
}
