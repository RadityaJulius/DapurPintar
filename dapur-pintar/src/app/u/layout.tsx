import Navbar from "@/components/Navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Navbar
        links={[
          { label: "Dashboard", href: "/u" },
          { label: "History", href: "/u/history" },
          { label: "Saved Recipes", href: "/u/saved" },
        ]}
      />

      <main className="max-w-4xl mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  );
}
