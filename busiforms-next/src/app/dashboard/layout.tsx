import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconLogout } from "@tabler/icons-react";
import { auth, signOut } from "@/auth";
import LayoutMenu from "./LayoutMenu";

const Layout: React.FC<{ children: ReactNode }> = async ({ children }) => {
  // 로그인 상태 체크
  const session = await auth();

  // 현재 페이지 이름 가져오기

  if (!session) return <p>로그인이 필요합니다.</p>;
  return (
    <div className="flex h-screen">
      <aside className="flex flex-col items-center h-screen sticky top-0 overflow-y-auto space-y-4 w-72 py-6 px-4 bg-base-200">
        {/* Logo */}
        <Link href="/" passHref>
          <div className="btn btn-ghost text-lg flex items-center">
            <Image alt="Logo" src="/images/mainlogo.svg" width={0} height={0} style={{ width: "100%", height: "auto" }} className="px-5" />
            {/* <span>Company Name</span> */}
          </div>
        </Link>
        {/* <Image alt="Profile" src={session.user?.image || } width={128} height={128} className="rounded-full" /> */}
        <div className="avatar">
          <div className="w-32 rounded-full">{session.user?.image ? <img src={session.user?.image} /> : <span className="text-3xl">D</span>}</div>
        </div>
        <h2 className="font-bold text-lg">User name</h2>
        <span className="text-sm text-accent">username@email.com</span>
        <LayoutMenu />
        {/* footer */}
        <div className="flex justify-center">
          {/* logout button */}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="btn btn-link btn-wide btn-sm text-red-500 hover:text-red-400">
              <IconLogout />
              로그아웃
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="pt-0">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
