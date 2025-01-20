import { auth } from "@/auth";
import React from "react";
import { SessionProvider } from "next-auth/react";

import { ReactNode } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  const session = await auth();
  const userId = session?.user?.id as string;
  return (
    <div>
      <SessionProvider>
        {/* <Header /> */}
        {/* back button with NextJS back function */}
        <Link href="/dashboard" className="btn btn-outline btn-sm m-3">
          <IconArrowLeft />
          뒤로 가기
        </Link>
        {children}
      </SessionProvider>
    </div>
  );
};

export default Layout;
