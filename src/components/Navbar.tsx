"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Menu, X, Home, TrendingUp, ShoppingCart, DollarSign, BarChart3, LogOut, LogIn } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Hide navbar on login page
  if (pathname === "/login") return null;

  const pages = [
    { name: "Home", path: "/", icon: Home },
    { name: "Stocks", path: "/stocks", icon: TrendingUp },
    { name: "Sales", path: "/sales", icon: ShoppingCart },
    { name: "Expenses", path: "/expenses", icon: DollarSign },
    { name: "Reports", path: "/reports", icon: BarChart3 },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    setMenuOpen(false);
    router.push("/login");
  };

  const handleLogin = () => {
    setMenuOpen(false);
    router.push("/login");
  };

  const navigateTo = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => router.push("/")}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all">
            BizAnalyzer
          </h1>
        </div>

        {/* Burger menu */}
        <button
          className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} className="text-gray-700" /> : <Menu size={22} className="text-gray-700" />}
        </button>
      </nav>

      {/* Sidebar Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 z-50
        transform transition-transform duration-300 ease-in-out
        ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">BizAnalyzer</h2>
                <p className="text-sm text-gray-500">Business Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">
                Welcome back!
              </p>
              <p className="text-xs text-blue-600 truncate">
                {user.email}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="p-4 space-y-2">
          {pages.map((page) => {
            const IconComponent = page.icon;
            const isActive = pathname === page.path;
            
            return (
              <button
                key={page.name}
                onClick={() => navigateTo(page.path)}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-sm' 
                    : 'hover:bg-gray-50 hover:shadow-sm'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                  ${isActive 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  <IconComponent size={20} />
                </div>
                <span className={`font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                  {page.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Auth Button */}
        <div className="absolute bottom-6 left-6 right-6">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium"
            >
              <LogOut size={20} />
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium"
            >
              <LogIn size={20} />
              Login
            </button>
          )}
        </div>
      </div>
    </>
  );
}