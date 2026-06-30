"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  FileText,
  Bookmark,
  TrendingUp,
  Clock,
  UserPlus,
  BarChart3,
  Activity,
} from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";

interface AdminStats {
  totalUsers: number;
  totalRecipes: number;
  totalSavedRecipes: number;
  recipesThisWeek: number;
  usersThisWeek: number;
  recipesByMood: Array<{ mood: string; count: number }>;
  recipesByMealType: Array<{ mealType: string; count: number }>;
  recipesByLanguage: Array<{ language: string; count: number }>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
  recentRecipes: Array<{
    id: string;
    userId: string;
    mood: string;
    mealType: string;
    createdAt: string;
  }>;
  userGrowth: Array<{ month: string; count: number }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#009966] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  const maxMoodCount = Math.max(
    ...(stats?.recipesByMood.map((item) => item.count) || [1])
  );
  const maxMealCount = Math.max(
    ...(stats?.recipesByMealType.map((item) => item.count) || [1])
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Kelola dan pantau aktivitas DapurPintar
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={<Users className="w-5 h-5" />}
          description="Semua user terdaftar"
        />
        <StatsCard
          title="Total Recipes"
          value={stats?.totalRecipes || 0}
          icon={<FileText className="w-5 h-5" />}
          description="Semua resep dihasilkan"
        />
        <StatsCard
          title="Saved Recipes"
          value={stats?.totalSavedRecipes || 0}
          icon={<Bookmark className="w-5 h-5" />}
          description="Semua resep tersimpan"
        />
        <StatsCard
          title="New This Week"
          value={`+${(stats?.usersThisWeek || 0) + (stats?.recipesThisWeek || 0)}`}
          icon={<TrendingUp className="w-5 h-5" />}
          description={`${stats?.usersThisWeek || 0} users, ${stats?.recipesThisWeek || 0} recipes`}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatsCard
          title="New Users This Week"
          value={stats?.usersThisWeek || 0}
          icon={<UserPlus className="w-5 h-5" />}
        />
        <StatsCard
          title="New Recipes This Week"
          value={stats?.recipesThisWeek || 0}
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recipes by Mood */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            Recipes by Mood
          </h3>
          <div className="space-y-3">
            {stats?.recipesByMood.map((item) => (
              <div key={item.mood}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">{item.mood}</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {item.count}
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${maxMoodCount > 0 ? (item.count / maxMoodCount) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recipes by Meal Type */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            Recipes by Meal Type
          </h3>
          <div className="space-y-3">
            {stats?.recipesByMealType.map((item) => (
              <div key={item.mealType}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">
                    {item.mealType}
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {item.count}
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${maxMealCount > 0 ? (item.count / maxMealCount) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      {stats?.userGrowth && stats.userGrowth.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            User Growth (6 Months)
          </h3>
          <div className="flex items-end gap-2 h-32">
            {stats.userGrowth.map((item) => {
              const maxCount = Math.max(
                ...stats.userGrowth.map((g) => g.count)
              );
              const height =
                maxCount > 0 ? (item.count / maxCount) * 100 : 0;
              return (
                <div
                  key={item.month}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full bg-emerald-600 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Users */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Recent Users
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {stats?.recentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Recipes */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Recent Recipes
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Mood
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Meal Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {stats?.recentRecipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-mono">
                    {recipe.userId.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {recipe.mood}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {recipe.mealType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(recipe.createdAt).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
