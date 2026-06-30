"use client";

import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  // STATES
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // REGISTER HANDLER
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
    } else {
      alert("Akun berhasil dibuat!");
      router.push("/login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-gray-900 px-4 relative">
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition font-medium px-4 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-2xl shadow-slate-200 dark:shadow-gray-900/50 sm:rounded-2xl sm:px-10 border border-slate-100 dark:border-gray-700 w-full max-w-md">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Buat Akun Baru</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Mulai perjalanan kulinermu bersama DapurPintar.
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-5" onSubmit={handleRegister}>

          {/* Nama */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Nama Lengkap
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 py-3 sm:text-sm border-slate-300 dark:border-gray-600 rounded-xl text-black dark:text-white dark:bg-gray-700"
                placeholder="Juru Masak Handal"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Alamat Email
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 py-3 sm:text-sm border-slate-300 dark:border-gray-600 rounded-xl text-black dark:text-white dark:bg-gray-700"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Kata Sandi
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 pr-10 py-3 sm:text-sm border-slate-300 dark:border-gray-600 rounded-xl text-black dark:text-white dark:bg-gray-700"
                placeholder="••••••••"
              />

              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                )}
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Minimal 8 karakter dengan kombinasi huruf dan angka.
            </p>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-800 transition-all transform active:scale-95"
            >
              Daftar
            </button>
          </div>

        </form>

        {/* Switch to login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-slate-500 dark:text-slate-400">
                Sudah punya akun?
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => router.push("/login")}
              className="w-full flex justify-center py-3 px-4 border border-slate-200 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors"
            >
              Masuk
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
