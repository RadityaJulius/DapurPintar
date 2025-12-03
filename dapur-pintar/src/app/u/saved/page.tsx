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
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SavedRecipe {
  id: string;
  name: string;
  notes?: string;
  recipeText?: string;
  recipeId?: string;
  createdAt: string;
  recipe?: {
    id: string;
    ingredients: string;
    mood: string;
    mealType: string;
    cookingTime: number;
    language: string;
    recipe: string;
    createdAt: string;
  };
}

export default function SavedRecipesPage() {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<SavedRecipe | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form states
  const [formName, setFormName] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formRecipeText, setFormRecipeText] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/saved-recipes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setRecipes(data.savedRecipes);
        } else {
          if (res.status === 401) {
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }
          setError(data.error || "Gagal mengambil resep tersimpan");
        }
      } catch (err) {
        setError("Kesalahan mengambil resep tersimpan");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [router]);

  const handleCreateRecipe = async () => {
    if (!formName.trim() || !formRecipeText.trim()) return;

    setModalLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/saved-recipes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formName.trim(),
          notes: formNotes.trim() || undefined,
          recipeText: formRecipeText.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setRecipes(prev => [data.savedRecipe, ...prev]);
        setIsCreateModalOpen(false);
        resetForm();
      } else {
        alert("Gagal membuat resep: " + data.error);
      }
    } catch (err) {
      alert("Kesalahan membuat resep");
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditRecipe = async () => {
    if (!editingRecipe || !formName.trim() || !formRecipeText.trim()) return;

    setModalLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/saved-recipes", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingRecipe.id,
          name: formName.trim(),
          notes: formNotes.trim() || undefined,
          recipeText: formRecipeText.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setRecipes(prev =>
          prev.map(r => r.id === editingRecipe.id ? data.savedRecipe : r)
        );
        setIsEditModalOpen(false);
        setEditingRecipe(null);
        resetForm();
      } else {
        alert("Gagal mengedit resep: " + data.error);
      }
    } catch (err) {
      alert("Kesalahan mengedit resep");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus resep ini?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/saved-recipes", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setRecipes(prev => prev.filter(r => r.id !== id));
      } else {
        const data = await res.json();
        alert("Gagal menghapus resep: " + data.error);
      }
    } catch (err) {
      alert("Kesalahan menghapus resep");
    }
  };

  const openEditModal = (recipe: SavedRecipe) => {
    setEditingRecipe(recipe);
    setFormName(recipe.name);
    setFormNotes(recipe.notes || "");
    setFormRecipeText(recipe.recipeText || "");
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormName("");
    setFormNotes("");
    setFormRecipeText("");
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setEditingRecipe(null);
    resetForm();
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
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#009966] font-bold text-xl">
            <ChefHat className="w-8 h-8" />
            <span>DapurPintar</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
            <a href="/u" className="hover:text-[#009966] transition-colors">
              Dashboard
            </a>
            <a href="/u/history" className="hover:text-[#009966] transition-colors">
              History
            </a>
            <a href="/u/saved" className="text-[#009966] font-semibold">
              Saved Recipes
            </a>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="hover:text-[#009966] transition-colors flex items-center gap-1"
              >
                Profile <ChevronDown className="w-4 h-4" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      router.push("/");
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Resep <span className="text-[#009966]">Tersimpan</span>
            </h1>
            <p className="text-gray-500 text-lg">
              Koleksi resep favorit Anda.
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#009966] text-white px-6 py-3 rounded-lg hover:bg-[#008055] transition font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tambah Resep
          </button>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-16">
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Belum ada resep tersimpan
            </h2>
            <p className="text-gray-500 mb-6">
              Mulai tambahkan resep favorit Anda!
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#009966] text-white px-6 py-3 rounded-lg hover:bg-[#008055] transition font-medium"
            >
              Tambah Resep Pertama
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
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {recipe.name}
                      </h3>
                      {recipe.notes && (
                        <p className="text-gray-600 mb-3">{recipe.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(recipe)}
                        className="p-2 text-gray-400 hover:text-[#009966] hover:bg-gray-100 rounded-lg transition"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRecipe(recipe.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <Calendar className="w-4 h-4 text-[#009966]" />
                    <span className="text-sm text-gray-600">Disimpan:</span>
                    <span className="font-medium">
                      {new Date(recipe.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3">
                      Resep
                    </h4>
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
                      {recipe.recipeText || recipe.recipe?.recipe}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tambah Resep Baru</h2>
                <button
                  onClick={closeModals}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nama Resep *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#009966] focus:ring-0 outline-none"
                    placeholder="Masukkan nama resep"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:border-[#009966] focus:ring-0 outline-none resize-none"
                    placeholder="Tambahkan catatan atau tips"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Teks Resep *
                  </label>
                  <textarea
                    value={formRecipeText}
                    onChange={(e) => setFormRecipeText(e.target.value)}
                    className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:border-[#009966] focus:ring-0 outline-none resize-none"
                    placeholder="Tulis resep lengkap di sini..."
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={closeModals}
                    className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleCreateRecipe}
                    disabled={!formName.trim() || !formRecipeText.trim() || modalLoading}
                    className="px-6 py-2 bg-[#009966] text-white rounded-lg hover:bg-[#008055] disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {modalLoading ? "Menyimpan..." : "Simpan Resep"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Resep</h2>
                <button
                  onClick={closeModals}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nama Resep *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#009966] focus:ring-0 outline-none"
                    placeholder="Masukkan nama resep"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:border-[#009966] focus:ring-0 outline-none resize-none"
                    placeholder="Tambahkan catatan atau tips"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Teks Resep *
                  </label>
                  <textarea
                    value={formRecipeText}
                    onChange={(e) => setFormRecipeText(e.target.value)}
                    className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:border-[#009966] focus:ring-0 outline-none resize-none"
                    placeholder="Tulis resep lengkap di sini..."
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={closeModals}
                    className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleEditRecipe}
                    disabled={!formName.trim() || !formRecipeText.trim() || modalLoading}
                    className="px-6 py-2 bg-[#009966] text-white rounded-lg hover:bg-[#008055] disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {modalLoading ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}