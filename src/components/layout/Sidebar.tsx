"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Package, BookOpen, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Inventário", path: "/", icon: Package },
  { name: "Referência", path: "/referencia", icon: BookOpen },
];

type ApiStatus = "ok" | "error" | "checking";

export function Sidebar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [status, setStatus] = useState<ApiStatus>("checking");

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    let active = true;
    async function check() {
      try {
        const r = await fetch("https://pixel-implementation-clone-3c137.shrd00.internal.goskip.dev/api/collections/inventory_items/records?perPage=1");
        if (active) setStatus(r.ok ? "ok" : "error");
      } catch {
        if (active) setStatus("error");
      }
    }
    check();
    return () => { active = false; };
  }, []);

  function toggleTheme() {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  }

  const dotColor =
    status === "ok" ? "bg-emerald-500" : status === "error" ? "bg-red-500" : "bg-amber-500";
  const statusText =
    status === "ok" ? "API conectada" : status === "error" ? "Sem conexão" : "Verificando...";

  return (
    <aside className="w-[220px] shrink-0 flex flex-col h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Desapego Squad
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-tight">
              Inventário
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${dotColor} ${
              status === "ok" ? "animate-pulse" : ""
            }`}
          />
          {statusText}
        </div>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          {dark ? (
            <Sun className="w-4 h-4 shrink-0" />
          ) : (
            <Moon className="w-4 h-4 shrink-0" />
          )}
          {dark ? "Modo Claro" : "Modo Escuro"}
        </button>
      </div>
    </aside>
  );
}
