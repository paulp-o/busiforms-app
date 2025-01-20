// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { useState } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { getCookie } from "cookies-next";
// import LoginButton from "./LoginButton";

// export default function Header() {
//   const router = useRouter();
//   const [showDropdown, setShowDropdown] = useState(false);
//   const { logout } = useAuth();

//   // try to get user email from cookie
//   const userEmail = getCookie("email");

//   const handleSignOut = async () => {
//     await logout();
//     router.push("/");
//   };

//   return (
//     <header className="bg-white shadow">
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex">
//             <Link href="/" className="flex items-center">
//               <Image src="/images/mainlogo.svg" alt="BusiForm" width={120} height={32} priority />
//             </Link>
//           </div>
//           <div className="flex items-center space-x-4">
//             {userEmail ? (
//               <div className="flex items-center space-x-4 relative">
//                 <span className="text-gray-700 text-sm">{userEmail}</span>
//                 <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center">
//                   <Image src="/images/logoutbutton.png" alt="메뉴" width={24} height={24} className="cursor-pointer" />
//                 </button>

//                 {/* 드롭다운 메뉴 */}
//                 {showDropdown && (
//                   <div className="absolute right-0 top-12 w-48 py-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
//                     <Link
//                       href="/dashboard"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       onClick={() => setShowDropdown(false)}
//                     >
//                       대시보드
//                     </Link>
//                     <Link
//                       href="/dashboard"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       onClick={() => setShowDropdown(false)}
//                     >
//                       나의 설문지
//                     </Link>
//                     <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
//                       로그아웃
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <LoginButton />
//             )}
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// }
