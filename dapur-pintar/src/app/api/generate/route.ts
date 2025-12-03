import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    // Verify authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as { userId: string };
    const userId = decoded.userId;

    // Parse request
    const { ingredients, mood, mealType, cookingTime, language } = await req.json();
    const cookingTimeInt = parseInt(cookingTime, 10);

    if (!ingredients || !mood || !mealType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Language instruction
    const   langInstruction = language === 'Bahasa' ? 'Please respond in Bahasa Indonesia (Indonesian language).' : 'Please respond in English.';

    // Construct prompt
    const prompt = `Generate a detailed recipe using the following:

Ingredients available: ${ingredients}
Mood/Style: ${mood}
Meal Type: ${mealType}
Preferred Cooking Time: ${cookingTimeInt} minutes

Start your response with the recipe name in the following format:
${language === 'Bahasa' ? '**Nama Resep: [Name]**' : '**Recipe Name: [Name]**'}

Then provide the detailed recipe including:
1. Preparation Time
2. Cooking Time
3. Servings
4. Ingredients List (with exact quantities)
5. Step-by-step Instructions
6. Serving Suggestions
7. End with nutritional notes in the following format:
${language === 'Bahasa' ? '**Catatan Nutrisi:** [Nutritional notes]' : '**Nutritional Notes:** [Nutritional notes]'}

Make it practical, delicious, and tailored to the mood and ingredients.

${langInstruction}`;

    // Call AI
    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const recipe = response.choices[0]?.message?.content || "No recipe generated";

    // Save to database
    await prisma.recipe.create({
      data: {
        userId,
        ingredients,
        mood,
        mealType,
        cookingTime: cookingTimeInt,
        language,
        recipe,
      },
    });

    return NextResponse.json({ recipe });
  } catch (e) {
    console.error("Generate error:", e);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
