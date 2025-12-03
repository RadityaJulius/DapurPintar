import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { verifyPassword, generateToken } from "../../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Email tidak ditemukan." },
        { status: 404 }
      );
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Password salah." },
        { status: 400 }
      );
    }

    const token = generateToken(user.id);

    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
