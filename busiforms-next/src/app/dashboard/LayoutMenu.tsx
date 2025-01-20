"use client";

import { IconReportAnalytics, IconListDetails, IconUser, IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const LayoutMenu: React.FC = () => {
  const pathname = usePathname();

  const enabledClassesLi = (suffix: string) => {
    return pathname.endsWith(suffix) ? `` : "";
  };
  const enabledClassesLink = (suffix: string) => {
    return pathname.endsWith(suffix) ? `bg-primary/30 focus:bg-primary/30 font-bold` : "";
  };

  return (
    <>
      <ul className="menu menu-vertical menu-lg w-full grow gap-1">
        <li className={`${enabledClassesLi("summary")}`}>
          <Link href="/dashboard/summary" passHref className={`${enabledClassesLink("summary")}`}>
            <div className="flex items-center space-x-2">
              <IconReportAnalytics />
              <span>요약</span>
            </div>
          </Link>
        </li>
        <li className={`${enabledClassesLi("myForms")}`}>
          <Link href="/dashboard/myForms" passHref className={`${enabledClassesLink("myForms")}`}>
            <div className="flex items-center space-x-2">
              <IconListDetails />
              <span>나의 폼</span>
            </div>
          </Link>
        </li>
        <li className={`${enabledClassesLi("profile")}`}>
          <Link href="/dashboard/profile" passHref className={`${enabledClassesLink("profile")}`}>
            <div className="flex items-center space-x-2">
              <IconUser />
              <span>프로필</span>
            </div>
          </Link>
        </li>
        <li className={`${enabledClassesLi("settings")}`}>
          <Link href="/dashboard/settings" passHref className={`${enabledClassesLink("settings")}`}>
            <div className="flex items-center space-x-2">
              <IconSettings />
              <span>설정</span>
            </div>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default LayoutMenu;
