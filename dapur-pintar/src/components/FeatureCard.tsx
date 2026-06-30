"use client";

import React from "react";

export default function FeatureCard({
  icon,
  title,
  desc,
  underDevelopment = false,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  underDevelopment?: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-2xl bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 hover:shadow-xl hover:shadow-emerald-600/5 transition duration-300 ${
        underDevelopment ? "opacity-60" : ""
      }`}
    >
      <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center shadow-sm mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
        {title}
        {underDevelopment && (
          <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-1 rounded-full font-medium">
            Sedang Dikerjakan
          </span>
        )}
      </h3>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{desc}</p>
    </div>
  );
}
