"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChefHat,
  Clock,
  Utensils,
  Flame,
  Globe,
  Calendar,
  ChevronDown,
  Heart,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Recipe {
  id: string;
  ingredients: string;
  mood: string;
  mealType: string;
  cookingTime: number;
  language: string;
  recipe: string;
  createdAt: string;
}

export default function RecipeHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [savedRecipeIds, setSavedRecipeIds] = useState<Map<string, string>>(new Map());
  const [saveLoading, setSaveLoading] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchRecipes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/recipes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setRecipes(data.recipes);

          // Fetch saved recipes
          const savedRes = await fetch("/api/saved-recipes", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const savedData = await savedRes.json();
          if (savedRes.ok) {
            const map = new Map<string, string>();
            savedData.savedRecipes.forEach((sr: { id: string; recipeId?: string }) => {
              if (sr.recipeId) {
                map.set(sr.recipeId, sr.id);
              }
            });
            setSavedRecipeIds(map);
          }
        } else {
          if (res.status === 401) {
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }
          setError(data.error || "Gagal mengambil resep");
        }
      } catch (err) {
        setError("Kesalahan mengambil resep");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [router]);

  const handleSaveToggle = async (recipeId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setSaveLoading(prev => new Set(prev).add(recipeId));

    try {
      const isSaved = savedRecipeIds.has(recipeId);
      const method = isSaved ? 'DELETE' : 'POST';

      let body: any = {};

      if (isSaved) {
        body = { id: savedRecipeIds.get(recipeId) };
      } else {
        // Extract name and notes from recipe text
        const recipe = recipes.find(r => r.id === recipeId);
        if (!recipe) return;

        let name = '';
        let notes = '';

        // Extract Recipe Name
        const nameRegex = /\*\*Recipe Name:\s*(.+?)\*\*/;
        let match = recipe.recipe.match(nameRegex);
        if (match) {
          name = match[1].trim();
        } else {
          const indonesianNameRegex = /\*\*Nama Resep:\s*(.+?)\*\*/;
          match = recipe.recipe.match(indonesianNameRegex);
          if (match) {
            name = match[1].trim();
          } 
        }

        notes = "[Tambahkan Notes]"

        body = { recipeId, name, notes, recipeText: recipe.recipe };
      }

      const res = await fetch("/api/saved-recipes", {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        if (isSaved) {
          setSavedRecipeIds(prev => {
            const newMap = new Map(prev);
            newMap.delete(recipeId);
            return newMap;
          });
        } else {
          const data = await res.json();
          setSavedRecipeIds(prev => new Map(prev).set(recipeId, data.savedRecipe.id));
        }
      } else {
        alert('Gagal menyimpan resep');
      }
    } catch (err) {
      alert('Kesalahan menyimpan resep');
    } finally {
      setSaveLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(recipeId);
        return newSet;
      });
    }
  };

  const handleDeleteAllHistory = async () => {
    if (!window.confirm("Are you sure you want to delete all history?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res1 = await fetch("/api/recipes", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res1.ok) {
        alert("Failed to delete recipes");
        return;
      }

      const res2 = await fetch("/api/saved-recipes", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res2.ok) {
        alert("Failed to delete saved recipes");
        return;
      }

      setRecipes([]);
      setSavedRecipeIds(new Map());
    } catch (err) {
      alert("Error deleting history");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#009966] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.push("/u")}
            className="bg-[#009966] text-white px-6 py-2 rounded-lg hover:bg-[#008055] transition"
          >
            Kembali ke Dasbor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Riwayat Resep <span className="text-[#009966]">Anda</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Semua resep lezat yang telah Anda buat.
          </p>
          <button
            onClick={handleDeleteAllHistory}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete All History
          </button>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-16">
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Belum ada resep
            </h2>
            <p className="text-gray-500 mb-6">
              Mulai buat resep luar biasa dengan bahan Anda!
            </p>
            <button
              onClick={() => router.push("/u")}
              className="bg-[#009966] text-white px-6 py-3 rounded-lg hover:bg-[#008055] transition font-medium"
            >
              Buat Resep Pertama Anda
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
              >
                <div className="p-8">
                  {/* Recipe Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-[#009966]" />
                      <span className="text-sm text-gray-600">
                        Jenis Makanan:
                      </span>
                      <span className="font-medium">{recipe.mealType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#009966]" />
                      <span className="text-sm text-gray-600">Suasana:</span>
                      <span className="font-medium">{recipe.mood}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#009966]" />
                      <span className="text-sm text-gray-600">Waktu:</span>
                      <span className="font-medium">
                        {recipe.cookingTime} min
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#009966]" />
                      <span className="text-sm text-gray-600">Bahasa:</span>
                      <span className="font-medium">{recipe.language}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-sm text-gray-600">Bahan:</span>
                    <p className="font-medium text-gray-800 mt-1">
                      {recipe.ingredients}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <Calendar className="w-4 h-4 text-[#009966]" />
                    <span className="text-sm text-gray-600">Dibuat:</span>
                    <span className="font-medium">
                      {new Date(recipe.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => handleSaveToggle(recipe.id)}
                      disabled={saveLoading.has(recipe.id)}
                      className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
                    >
                      <Heart
                        className={`w-6 h-6 ${savedRecipeIds.has(recipe.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                      />
                    </button>
                  </div>

                  {/* Recipe Text */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Resep
                    </h3>
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
                      {recipe.recipe}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
