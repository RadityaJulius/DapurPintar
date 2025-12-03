'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChefHat, Sparkles, Clock, Utensils, Flame, Search, ArrowRight, Globe, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DapurPintarHome() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // State for form inputs
  const [ingredients, setIngredients] = useState('');
  const [mood, setMood] = useState('Comfort');
  const [mealType, setMealType] = useState('Dinner');
  const [cookingTime, setCookingTime] = useState(30);
  const [language, setLanguage] = useState('English');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipe, setRecipe] = useState('');

  // Configuration arrays
  const moods = [
    { name: 'Comfort', icon: '🍵' },
    { name: 'Healthy', icon: '🥗' },
    { name: 'Quick', icon: '⚡' },
    { name: 'Fancy', icon: '✨' },
    { name: 'Spicy', icon: '🌶️' },
  ];

  const languages = [
    { name: 'English', icon: '🇺🇸' },
    { name: 'Bahasa', icon: '🇮🇩' },
  ];

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

  const handleGenerate = async () => {
    setIsGenerating(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ingredients,
          mood,
          mealType,
          cookingTime,
          language
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setRecipe(data.recipe);
      } else {
        alert('Failed to generate recipe: ' + data.error);
      }
    } catch (err) {
      alert('Error generating recipe');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setLoading(false);
        } else {
          localStorage.removeItem('token');
          router.push('/login');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/login');
      });
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#009966] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-[#009966] selection:text-white">
      {/* --- Navbar --- */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#009966] font-bold text-xl">
            <ChefHat className="w-8 h-8" />
            <span>DapurPintar</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
            <a href="/u/history" className="hover:text-[#009966] transition-colors">History</a>
            <a href="/u/saved" className="hover:text-[#009966] transition-colors">Saved Recipes</a>
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
                      localStorage.removeItem('token');
                      router.push('/');
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

      {/* --- Main Content --- */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Apa yang kita masak <br />
            <span className="text-[#009966]">hari ini?</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Biarkan AI kami mengubah sisa makanan Anda menjadi sebuah mahakarya.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          
          {/* Section 1: Ingredients */}
          <div className="p-8 border-b border-gray-100">
            <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
              <Search className="w-4 h-4" />
              Apa yang ada di dapur Anda?
            </label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g., 2 eggs, leftover rice, soy sauce, and a lonely carrot..."
              className="w-full h-32 p-4 text-lg rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#009966] focus:bg-white focus:ring-0 transition-all resize-none placeholder:text-gray-300 outline-none"
            />
          </div>

          <div className="p-8 space-y-8">
            {/* Section 2: Mood Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                <Flame className="w-4 h-4" />
                Pilih Suasana Hati Anda
              </label>
              <div className="flex flex-wrap gap-3">
                {moods.map((m) => (
                  <button
                    key={m.name}
                    onClick={() => setMood(m.name)}
                    className={`
                      px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border
                      ${mood === m.name 
                        ? 'bg-[#009966] text-white border-[#009966] shadow-lg shadow-[#009966]/20 transform scale-105' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#009966] hover:text-[#009966]'}
                    `}
                  >
                    <span className="mr-2">{m.icon}</span>
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 2.5: Language Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                🗣️ Bahasa
              </label>
              <div className="flex flex-wrap gap-3">
                {languages.map((l) => (
                  <button
                    key={l.name}
                    onClick={() => setLanguage(l.name)}
                    className={`
                      px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border
                      ${language === l.name
                        ? 'bg-[#009966] text-white border-[#009966] shadow-lg shadow-[#009966]/20 transform scale-105'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#009966] hover:text-[#009966]'}
                    `}
                  >
                    <span className="mr-2">{l.icon}</span>
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: Meal Type & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                  <Utensils className="w-4 h-4" />
                  Jenis Makanan
                </label>
                <div className="flex flex-wrap gap-2">
                  {mealTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setMealType(type)}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-all
                        ${mealType === type 
                          ? 'bg-[#009966]/10 text-[#009966] border border-[#009966]' 
                          : 'bg-gray-50 text-gray-600 border border-transparent hover:bg-gray-100'}
                      `}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                  <Clock className="w-4 h-4" />
                  Waktu Memasak
                </label>
                <div className="relative pt-1">
                    <input
                        type="range"
                        min="15"
                        max="120"
                        step="15"
                        value={cookingTime}
                        onChange={(e) => setCookingTime(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#009966]"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                        <span>15m</span>
                        <span>30m</span>
                        <span>1h</span>
                        <span>2h+</span>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <button
              onClick={handleGenerate}
              disabled={!ingredients || isGenerating}
              className={`
                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all
                ${!ingredients 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-[#009966] text-white hover:bg-[#008055] shadow-xl shadow-[#009966]/30 hover:shadow-[#009966]/50 transform hover:-translate-y-0.5'}
              `}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Creating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Recipe
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recipe Result */}
        {recipe && (
          <div className="mt-8 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Recipe</h2>
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {recipe}
              </div>
            </div>
          </div>
        )}

        {/* Footer/Trust */}
        <div className="mt-8 text-center text-gray-400 text-sm">
            Powered by AI • 10,000+ Recipes Generated
        </div>
      </main>
    </div>
  );
}
