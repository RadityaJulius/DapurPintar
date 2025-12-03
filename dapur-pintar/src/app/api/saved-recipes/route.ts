import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";


function getUserIdFromToken(req: Request): string | null {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as { userId: string };
    return decoded.userId;
  } catch (e) {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const savedRecipes = await prisma.savedRecipe.findMany({
      where: { userId },
      include: {
        recipe: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ savedRecipes });
  } catch (e) {
    console.error("Error fetching saved recipes:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, notes, recipeText } = body;

    if (!id || !name) {
      return NextResponse.json({ error: "ID and name are required" }, { status: 400 });
    }

    const existing = await prisma.savedRecipe.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Saved recipe not found" }, { status: 404 });
    }

    const updatedRecipe = await prisma.savedRecipe.update({
      where: { id },
      data: {
        name,
        notes,
        recipeText,
      },
      include: {
        recipe: true,
      },
    });

    return NextResponse.json({ savedRecipe: updatedRecipe });
  } catch (e) {
    console.error("Error updating saved recipe:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { recipeId, name, notes, recipeText } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (recipeId) {
      // Saving an existing recipe
      const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
      });

      if (!recipe) {
        return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
      }

      // Check if already saved
      const existing = await prisma.savedRecipe.findFirst({
        where: {
          userId,
          recipeId,
        },
      });

      if (existing) {
        return NextResponse.json({ error: "Recipe already saved" }, { status: 409 });
      }

      const savedRecipe = await prisma.savedRecipe.create({
        data: {
          userId,
          recipeId,
          name,
          notes,
          recipeText,
        },
        include: {
          recipe: true,
        },
      });

      return NextResponse.json({ savedRecipe }, { status: 201 });
    } else {
      // Creating a custom saved recipe
      if (!recipeText) {
        return NextResponse.json({ error: "Recipe text is required for custom recipes" }, { status: 400 });
      }

      const savedRecipe = await prisma.savedRecipe.create({
        data: {
          userId,
          name,
          notes,
          recipeText,
        },
      });

      return NextResponse.json({ savedRecipe }, { status: 201 });
    }
  } catch (e) {
    console.error("Error saving recipe:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      body = null;
    }

    if (body && body.id) {
      // Delete single recipe
      const deleted = await prisma.savedRecipe.delete({
        where: {
          id: body.id,
          userId,
        },
      });

      return NextResponse.json({ message: "Recipe deleted successfully" });
    } else {
      // Delete all saved recipes for the user
      await prisma.savedRecipe.deleteMany({
        where: { userId },
      });

      return NextResponse.json({ message: "All saved recipes deleted successfully" });
    }
  } catch (e) {
    console.error("Error deleting saved recipe:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}