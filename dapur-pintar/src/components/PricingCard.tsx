"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function PricingCard({
  title,
  price,
  period,
  features,
  buttonText,
  popular = false,
}: {
  title: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
}) {
  const router = useRouter();
  return (
    <div
      className={`p-8 rounded-2xl bg-white dark:bg-gray-800 border ${
        popular
          ? "border-emerald-300 dark:border-emerald-700 shadow-xl shadow-emerald-600/10"
          : "border-slate-100 dark:border-gray-700"
      } hover:shadow-xl hover:shadow-emerald-600/5 transition duration-300 relative`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-medium">
          Paling Populer
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <div className="text-4xl font-extrabold text-emerald-600 mb-1">
          {price}
        </div>
        <div className="text-slate-500 dark:text-slate-400">{period}</div>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center shrink-0">
              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            </div>
            <span className="text-slate-600 dark:text-slate-300">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => router.push("/register")}
        className={`w-full py-3 px-6 rounded-xl font-medium transition ${
          popular
            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
            : "bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-900 dark:text-white"
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
}
