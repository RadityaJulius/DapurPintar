"use client";

import { useState } from "react";
import {
  ChefHat,
  Camera,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Leaf,
  Smartphone
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PricingCard from "@/components/PricingCard";
import FeatureCard from "@/components/FeatureCard";

export default function DapurPintarApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleMulaiMemasakNavbar = () => {
    const token = localStorage.getItem('token');
    router.push(token ? '/u' : '/login');
  };

  const handleMulaiMemasakRegister = () => {
    const token = localStorage.getItem('token');
    router.push(token ? '/u' : '/register');
  };

  // --- LANDING PAGE VIEW ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <div className="bg-emerald-600 p-2 rounded-lg">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                DapurPintar
              </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-slate-600 hover:text-emerald-600 transition"
              >
                Fitur
              </a>
              <a
                href="#pricing"
                className="text-slate-600 hover:text-emerald-600 transition"
              >
                Pricing
              </a>

              <div className="flex items-center gap-4 border-l border-slate-200 pl-8">
                <button
                  onClick={handleMulaiMemasakNavbar}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full font-medium transition shadow-lg shadow-emerald-600/20"
                >
                  Mulai Memasak
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-700"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-4 shadow-xl">
            <a href="#features" className="block text-slate-600 py-2">
              Fitur
            </a>
            <a href="#how-it-works" className="block text-slate-600 py-2">
              Bagaimana cara bekerja?
            </a>
            <hr className="border-slate-100" />
            <button
              onClick={() => router.push("/login")}
              className="block w-full text-left text-slate-600 py-2 font-medium"
            >
              Masuk
            </button>
            <button
              onClick={handleMulaiMemasakRegister}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium"
            >
              Mulai Memasak
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Powered by Advanced AI</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Ubah sisa makanan Anda menjadi{" "}
              <span className="text-emerald-600">Hidangan Lezat.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-lg">
              Bingung mau masak apa? Foto kulkasmu atau daftarkan bahan-bahannya, dan DapurPintar akan langsung menghasilkan resep yang sempurna.
            </p>

            <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100 max-w-md flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. Eggs, Rice, Soy Sauce..."
                className="flex-1 px-4 py-3 outline-none text-slate-700 placeholder:text-slate-400 bg-transparent"
              />
              <button
                onClick={handleMulaiMemasakRegister}
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                      alt="User"
                    />
                  </div>
                ))}
              </div>
              <p>Trusted by 10,000+ Indonesian Home Cooks</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-linear-to-r from-emerald-100 to-orange-100 rounded-full blur-3xl opacity-50 -z-10"></div>
            <div className="bg-slate-100 rounded-3xl overflow-hidden aspect-square shadow-2xl relative flex items-center justify-center group">
              <div className="absolute inset-0 bg-emerald-50 opacity-50"></div>
              <div className="text-center z-10 p-8">
                <Image
                  src="/images/licensed-image.jpeg"
                  alt="A hero image"
                  width={800}
                  height={500}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">
              Mengapa Memilih DapurPintar?
            </h2>
            <p className="mt-4 text-slate-600">
              Kurangi sisa makanan dan masak makanan lezat tanpa stres.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Camera className="w-6 h-6 text-emerald-600" />}
              title="Bahan-bahan & Masak"
              desc="Cukup berikan bahan bahan yang tersedia di dapur Anda. AI kami yang visioner akan langsung memberikan resep sesuai dengan bahan yang ada."
            />
            <FeatureCard
              icon={<Leaf className="w-6 h-6 text-slate-400" />}
              title="Zero Waste"
              desc="Kami memprioritaskan resep yang menggunakan bahan-bahan yang mendekati tanggal kedaluwarsa."
              underDevelopment={true}
            />
            <FeatureCard
              icon={<Smartphone className="w-6 h-6 text-slate-400" />}
              title="Mode Langkah demi Langkah"
              desc="Mode memasak dengan perintah suara sehingga Anda tidak perlu menyentuh ponsel dengan tangan kotor."
              underDevelopment={true}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">
              Pilih Paket yang Tepat untuk Anda
            </h2>
            <p className="mt-4 text-slate-600">
              Mulai dari gratis hingga fitur premium untuk pengalaman memasak terbaik.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              title="Gratis"
              price="IDR 0"
              period="/bulan"
              features={[
                "Generasi resep dasar",
                "5 resep per bulan"
              ]}
              buttonText="Mulai Gratis"
            />
            <PricingCard
              title="Premium"
              price="IDR 49.000"
              period="/bulan"
              features={[
                "Resep tak terbatas",
                "Mode suara",
                "Prioritas zero waste"
              ]}
              buttonText="Pilih Premium"
              popular={true}
            />
            <PricingCard
              title="Pro"
              price="IDR 99.000"
              period="/bulan"
              features={[
                "Semua fitur Premium",
                "Dukungan prioritas",
                "Resep kustom"
              ]}
              buttonText="Pilih Pro"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <ChefHat className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold text-slate-900">
              DapurPintar
            </span>
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} DapurPintar. Made with ❤️ in Indonesia.
          </div>
        </div>
      </footer>
    </div>
  );
}
