# Dokumentasi Perubahan Dark Mode - DapurPintar

Tanggal: 5 Mei 2026

## Ringkasan Perubahan

Fitur Dark Mode telah ditambahkan ke seluruh halaman aplikasi DapurPintar menggunakan `next-themes` dan Tailwind CSS v4.

---

## 1. Package Baru

### Installasi
```bash
npm install next-themes
```

---

## 2. Konfigurasi CSS (`src/app/globals.css`)

### SEBELUM
```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}
```

### SESUDAH
```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --background: #ffffff;
  --foreground: #171717;
  --card: #ffffff;
  --card-foreground: #171717;
  --muted: #f5f5f5;
  --muted-foreground: #737373;
  --border: #e5e5e5;
  --primary: #009966;
  --primary-foreground: #ffffff;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
  --card: #171717;
  --card-foreground: #ededed;
  --muted: #262626;
  --muted-foreground: #a3a3a3;
  --border: #262626;
  --primary: #00cc88;
  --primary-foreground: #0a0a0a;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}
```

**Perubahan:**
- Menambahkan `@custom-variant dark` untuk mendukung Tailwind v4 dark mode
- Menambahkan variabel CSS untuk dark mode (`.dark` class)
- Menambahkan warna tambahan: `--card`, `--muted`, `--border`, `--primary`

---

## 3. Theme Provider (`src/app/ThemeProvider.tsx`) - FILE BARU

### SESUDAH (File Baru)
```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

---

## 4. Root Layout (`src/app/layout.tsx`)

### SEBELUM
```tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

### SESUDAH
```tsx
import ThemeProvider from "./ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

**Perubahan:**
- Import `ThemeProvider`
- Membungkus `{children}` dengan `<ThemeProvider>`
- Menambahkan `suppressHydrationWarning` pada `<html>`

---

## 5. Navbar (`src/components/Navbar.tsx`)

### SEBELUM
```tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChefHat, ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar({ links }: { links: NavLink[] }) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  // ... useEffect untuk click outside

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Brand */}

      {/* Links */}
      <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
        {links.map((link) => (
          <a key={link.href} href={link.href}
            className={`hover:text-[#009966] transition-colors ${
              pathname === link.href ? "text-[#009966] font-semibold" : ""
            }`}>
            {link.label}
          </a>
        ))}

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="hover:text-[#009966] transition-colors flex items-center gap-1">
            Profile <ChevronDown className="w-4 h-4" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <button onClick={() => {
                localStorage.removeItem("token");
                router.push("/");
                setIsDropdownOpen(false);
              }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
```

### SESUDAH
```tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChefHat, ChevronDown, Sun, Moon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";

export default function Navbar({ links }: { links: NavLink[] }) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // ... useEffect untuk click outside

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
      {/* Brand */}

      {/* Links */}
      <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500 items-center">
        {links.map((link) => (
          <a key={link.href} href={link.href}
            className={`hover:text-[#009966] dark:hover:text-[#00cc88] transition-colors ${
              pathname === link.href ? "text-[#009966] font-semibold dark:text-[#00cc88]" : ""
            }`}>
            {link.label}
          </a>
        ))}

        {/* Theme Toggle */}
        {mounted && (
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hover:text-[#009966] dark:hover:text-[#00cc88] transition-colors"
            aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="hover:text-[#009966] dark:hover:text-[#00cc88] transition-colors flex items-center gap-1">
            Profile <ChevronDown className="w-4 h-4" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
              <button onClick={() => {
                localStorage.removeItem("token");
                router.push("/");
                setIsDropdownOpen(false);
              }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
```

**Perubahan:**
- Import `Sun`, `Moon` dari `lucide-react` dan `useTheme` dari `next-themes`
- Menambahkan state `theme`, `setTheme`, dan `mounted`
- Menambahkan tombol toggle dark mode dengan ikon Sun/Moon
- Mengupdate semua styling dengan `dark:` variants
- Dropdown menu menggunakan `dark:bg-gray-800` dan `dark:text-gray-300`

---

## 6. Landing Page (`src/app/page.tsx`)

### SEBELUM
```tsx
"use client";

import { useState } from "react";
import { ChefHat, Camera, Sparkles, ArrowRight, Menu, X, Leaf, Smartphone } from "lucide-react";
// ...

export default function DapurPintarApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-slate-600 hover:text-emerald-600 transition">Fitur</a>
          <a href="#pricing" className="text-slate-600 hover:text-emerald-600 transition">Pricing</a>
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-700">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
          Ubah sisa makanan Anda menjadi{" "}
          <span className="text-emerald-600">Hidangan Lezat.</span>
        </h1>
        <p className="text-lg text-slate-600">...</p>
        <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100">
          <input className="flex-1 px-4 py-3 outline-none text-slate-700 placeholder:text-slate-400 bg-transparent" />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <h2 className="text-3xl font-bold text-slate-900">Mengapa Memilih DapurPintar?</h2>
        <p className="mt-4 text-slate-600">...</p>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50">
        <h2 className="text-3xl font-bold text-slate-900">Pilih Paket yang Tepat</h2>
        <p className="mt-4 text-slate-600">...</p>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <span className="text-xl font-bold text-slate-900">DapurPintar</span>
        <div className="text-slate-500 text-sm">© 2026 DapurPintar...</div>
      </footer>
    </div>
  );
}
```

### SESUDAH
```tsx
"use client";

import { useState, useEffect } from "react";
import { ChefHat, Camera, Sparkles, ArrowRight, Menu, X, Leaf, Smartphone, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
// ...

export default function DapurPintarApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans text-slate-800 dark:text-slate-200">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-slate-200 dark:border-gray-700">
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">Fitur</a>
          <a href="#pricing" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">Pricing</a>

          {/* Theme Toggle Desktop */}
          {mounted && (
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
              aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Mobile Menu Button dengan Theme Toggle */}
        <div className="md:hidden flex items-center gap-4">
          {mounted && (
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-slate-700 dark:text-slate-300" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-700 dark:text-slate-300">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Ubah sisa makanan Anda menjadi{" "}
          <span className="text-emerald-600 dark:text-emerald-400">Hidangan Lezat.</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">...</p>
        <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-xl border border-slate-100 dark:border-gray-700">
          <input className="flex-1 px-4 py-3 outline-none text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent" />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Mengapa Memilih DapurPintar?</h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">...</p>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50 dark:bg-gray-900">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Pilih Paket yang Tepat</h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">...</p>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-gray-900 py-12 border-t border-slate-200 dark:border-gray-700">
        <span className="text-xl font-bold text-slate-900 dark:text-white">DapurPintar</span>
        <div className="text-slate-500 dark:text-slate-400 text-sm">© 2026 DapurPintar...</div>
      </footer>
    </div>
  );
}
```

---

## 7. Login Page (`src/app/login/page.tsx`)

### Perubahan Utama:
- Background: `bg-slate-100` → `bg-slate-100 dark:bg-gray-900`
- Card: `bg-white` → `bg-white dark:bg-gray-800`
- Text colors: `text-slate-900` → `text-slate-900 dark:text-white`
- Input: `bg-white` → `dark:bg-gray-700` dan `text-black` → `dark:text-white`
- Border: `border-slate-200` → `border-slate-200 dark:border-gray-700`
- Icons: `text-slate-400` → `text-slate-400 dark:text-slate-500`

---

## 8. Register Page (`src/app/register/page.tsx`)

### Perubahan Utama:
- Sama dengan login page - menambahkan `dark:` variants untuk semua elemen
- Form inputs menggunakan `dark:bg-gray-700` dan `dark:border-gray-600`
- Text colors disesuaikan untuk dark mode

---

## 9. User Layout (`src/app/u/layout.tsx`)

### SEBELUM
```tsx
<div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
```

### SESUDAH
```tsx
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
```

---

## 10. Dashboard (`src/app/u/page.tsx`)

### Perubahan Utama:
- Loading spinner: `bg-gray-50` → `bg-gray-50 dark:bg-gray-900`
- Input Card: `bg-white` → `bg-white dark:bg-gray-800`
- Text colors: `text-gray-900` → `text-gray-900 dark:text-white`
- Buttons: `border-gray-200` → `dark:border-gray-600`
- Recipe result: `bg-gray-50` → `bg-gray-50 dark:bg-gray-700`

---

## 11. History Page (`src/app/u/history/page.tsx`)

### Perubahan Utama:
- Loading/Error states: `bg-gray-50` → `bg-gray-50 dark:bg-gray-900`
- Recipe cards: `bg-white` → `bg-white dark:bg-gray-800`
- Text: `text-gray-700` → `text-gray-700 dark:text-gray-200`
- Icons: `text-[#009966]` → `text-[#009966] dark:text-[#00cc88]`
- Heart icon: `text-gray-400` → `text-gray-400 dark:text-gray-500`

---

## 12. Saved Recipes (`src/app/u/saved/page.tsx`)

### Perubahan Utama:
- Loading/Error states: `bg-gray-50` → `bg-gray-50 dark:bg-gray-900`
- Recipe cards: `bg-white` → `bg-white dark:bg-gray-800`
- Modals: `bg-white` → `bg-white dark:bg-gray-800`
- Form inputs: `dark:bg-gray-700` dan `dark:border-gray-600`
- Text colors disesuaikan untuk dark mode

---

## 13. FeatureCard (`src/components/FeatureCard.tsx`)

### SEBELUM
```tsx
<div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 ...">
  <div className="w-12 h-12 bg-white rounded-xl ...">
  <h3 className="text-xl font-bold text-slate-900 ...">
  <p className="text-slate-600 ...">
```

### SESUDAH
```tsx
<div className="p-6 rounded-2xl bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 ...">
  <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl ...">
  <h3 className="text-xl font-bold text-slate-900 dark:text-white ...">
  <p className="text-slate-600 dark:text-slate-300 ...">
```

---

## 14. PricingCard (`src/components/PricingCard.tsx`)

### SEBELUM
```tsx
<div className="p-8 rounded-2xl bg-white border border-slate-100 ...">
  <h3 className="text-2xl font-bold text-slate-900 ...">
  <div className="text-slate-500">...</div>
  <span className="text-slate-600">...</span>
  <button className="bg-slate-100 hover:bg-slate-200 text-slate-900">...</button>
```

### SESUDAH
```tsx
<div className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 ...">
  <h3 className="text-2xl font-bold text-slate-900 dark:text-white ...">
  <div className="text-slate-500 dark:text-slate-400">...</div>
  <span className="text-slate-600 dark:text-slate-300">...</span>
  <button className="bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-900 dark:text-white">...</button>
```

---

## Daftar File yang Diubah

| No | File | Perubahan |
|----|------|-------------|
| 1 | `src/app/globals.css` | Konfigurasi variabel CSS & dark mode |
| 2 | `src/app/layout.tsx` | Menambahkan ThemeProvider |
| 3 | `src/app/ThemeProvider.tsx` | **FILE BARU** - Theme wrapper |
| 4 | `src/app/page.tsx` | Landing page + tombol dark mode |
| 5 | `src/app/login/page.tsx` | Login page dark mode |
| 6 | `src/app/register/page.tsx` | Register page dark mode |
| 7 | `src/app/u/layout.tsx` | User layout dark mode |
| 8 | `src/app/u/page.tsx` | Dashboard dark mode |
| 9 | `src/app/u/history/page.tsx` | History page dark mode |
| 10 | `src/app/u/saved/page.tsx` | Saved recipes + modal dark mode |
| 11 | `src/components/Navbar.tsx` | Navbar + tombol toggle dark mode |
| 12 | `src/components/FeatureCard.tsx` | Component dark mode |
| 13 | `src/components/PricingCard.tsx` | Component dark mode |

---

## Cara Kerja Dark Mode

1. **ThemeProvider** membungkus seluruh aplikasi dan mengelola state tema
2. Tema disimpan di `localStorage` dengan key `theme`
3. Default menggunakan `system` (mengikuti preferensi OS)
4. Tombol toggle tersedia di **Navbar** (halaman user) dan **Landing Page** (desktop & mobile)
5. Menggunakan class `dark` pada `<html>` untuk mengaktifkan dark mode
6. Tailwind CSS v4 menggunakan `@custom-variant dark` untuk mendukung `dark:` variants

---

## Testing

Build test berhasil:
```bash
npm run build
# ✓ Compiled successfully
# ✓ Generating static pages (15/15)
# Build sukses tanpa error
```
