import React from "react";
import Link from "next/link";
import { IconSearch, IconLogin2, IconMenu2, IconRefresh, IconPlus } from "@tabler/icons-react";
import RefreshMyFormsButtonComponent from "./RefreshMyFormsButtonComponent";

const MyFormsNavigationBar = ({ userId }: { userId: string }) => {
  return (
    <div className="flex flex-col">
      {/* Top navbar (always visible) */}
      <nav className="navbar justify-between gap-4 bg-base-100 shadow-sm px-5">
        {/* Logo */}
        {/* <img alt="Logo" src="/logo.svg" className="w-4" /> */}
        {/* <h1 className=" text-gray-900 text-xl font-bold tracking-tight">나의 폼</h1> */}
        {/* 새 폼 버튼 */}
        <Link href="/forms/create" className="btn btn-primary btn-sm">
          <IconPlus />새 폼 만들기
        </Link>
        {/* Search */}
        <div className="join w-full max-w-xl hidden sm:inline-flex">
          {/* Search options */}
          {/* <select className="select select-sm select-bordered join-item">
            <option selected>Good potions</option>
            <option>Bad potions</option>
            <option>Illegal potions</option>
          </select> */}

          {/* Search input */}
          <input className="join-item input input-sm input-bordered w-full" type="text" placeholder="Search" />

          {/* Search button */}
          <button className="join-item btn btn-sm btn-primary text-success-content">
            <IconSearch />
          </button>
        </div>
        {/* Menu (Desktop) */}
        <div className="shrink-0 hidden md:flex gap-2">
          <RefreshMyFormsButtonComponent userId={userId} />
        </div>

        {/* Menu (Mobile) */}
        <div className="dropdown dropdown-end md:hidden">
          <button className="btn btn-ghost">
            <IconMenu2 />
          </button>

          <ul tabIndex={0} className="dropdown-content menu z-[1] bg-base-200 p-4 rounded-box shadow w-56 gap-2">
            <li>
              <a>Create Account</a>
            </li>
            <a className="btn btn-primary btn-sm">
              Log in
              <IconLogin2 />
            </a>
          </ul>
        </div>
      </nav>

      {/* <nav className="navbar sm:hidden bg-base-200 border-neutral">

        <div className="join w-full">
    
          <select className="select select-sm select-bordered join-item">
            <option selected>Good potions</option>
            <option>Bad potions</option>
            <option>Illegal potions</option>
          </select>

          <input className="join-item input input-sm input-bordered w-full" type="text" placeholder="Search" />

          <button className="join-item btn btn-sm btn-primary text-success-content">
            <IconSearch />
          </button>
        </div>
      </nav> */}
    </div>
  );
};

export default MyFormsNavigationBar;
