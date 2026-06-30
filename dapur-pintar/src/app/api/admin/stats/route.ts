import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import jwt from "jsonwebtoken";

// Helper: verify admin token
function getAdminFromToken(req: Request): string | null {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as { userId: string; isAdmin: boolean };

    if (!decoded.isAdmin) {
      return null;
    }

    return decoded.userId;
  } catch (e) {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const adminId = getAdminFromToken(req);
    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get counts
    const [
      totalUsers,
      totalRecipes,
      totalSavedRecipes,
      recipesThisWeek,
      usersThisWeek,
      recipesByMood,
      recipesByMealType,
      recipesByLanguage,
      recentUsers,
      recentRecipes,
      userGrowthRaw,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.recipe.count(),
      prisma.savedRecipe.count(),
      prisma.recipe.count({
        where: { createdAt: { gte: oneWeekAgo } },
      }),
      prisma.user.count({
        where: { createdAt: { gte: oneWeekAgo } },
      }),
      prisma.recipe.groupBy({
        by: ["mood"],
        _count: { mood: true },
      }),
      prisma.recipe.groupBy({
        by: ["mealType"],
        _count: { mealType: true },
      }),
      prisma.recipe.groupBy({
        by: ["language"],
        _count: { language: true },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, createdAt: true },
      }),
      prisma.recipe.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, userId: true, mood: true, mealType: true, createdAt: true },
      }),
      // User growth: count per month for last 6 months
      prisma.$queryRaw<Array<{ month: string; count: bigint }>>`
        SELECT DATE_TRUNC('month', "createdAt") as month, COUNT(*) as count
        FROM "User"
        WHERE "createdAt" >= ${new Date(now.getFullYear(), now.getMonth() - 5, 1)}
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month ASC
      `,
    ]);

    // Format user growth data
    const userGrowth = userGrowthRaw.map((item) => ({
      month: new Date(item.month).toLocaleString("id-ID", {
        month: "short",
        year: "2-digit",
      }),
      count: Number(item.count),
    }));

    return NextResponse.json({
      totalUsers,
      totalRecipes,
      totalSavedRecipes,
      recipesThisWeek,
      usersThisWeek,
      recipesByMood: recipesByMood.map((item) => ({
        mood: item.mood,
        count: item._count.mood,
      })),
      recipesByMealType: recipesByMealType.map((item) => ({
        mealType: item.mealType,
        count: item._count.mealType,
      })),
      recipesByLanguage: recipesByLanguage.map((item) => ({
        language: item.language,
        count: item._count.language,
      })),
      recentUsers,
      recentRecipes,
      userGrowth,
    });
  } catch (e) {
    console.error("Admin stats error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
