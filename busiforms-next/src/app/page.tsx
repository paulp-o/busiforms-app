import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="max-w-7xl w-full mx-auto px-4 text-center relative flex flex-row items-center justify-center gap-8">
          <div className="absolute bg-gradient-to-b from-transparent to-white/20 rounded-full blur-3xl" />

          <div className="flex flex-col items-start">
            <div className="mb-4">
              <Image src="/images/mainlogo.svg" alt="BusiForm Logo" width={300} height={75} priority className="mx-auto" />
            </div>

            <div className="mb-4 space-y-2">
              <p className="text-xl text-gray-700">test catchphrase</p>
              <p className="text-2xl font-bold text-gray-900">row 2!</p>
            </div>

            <Link href="/dashboard">
              <button className="btn btn-primary px-6 py-3">시작하기!</button>
            </Link>
          </div>

          <div className="mt-4">
            <Image src="/images/ch-with-form.png" alt="Character with form" width={800} height={800} priority className="mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
