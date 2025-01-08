import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  // NextAuth 세션 가져오기
  const session = await auth();

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Prisma를 통해 사용자의 상세 프로필 가져오기
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    // if no user, register a new user
    const newUser = await prisma.user.create({
      data: {
        email: session.user.email,
        name: session.user.name,
      },
    });

    return NextResponse.json(newUser);
  }

  // write in the server side log that the user was found

  console.log("User found");

  // if user exists, return the user
  return NextResponse.json(user);
}
