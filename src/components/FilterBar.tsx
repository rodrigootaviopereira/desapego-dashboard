"use client";

import { ItemStatus } from "@/types/item";

const STATUSES: { value: ItemStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "disponivel", label: "Disponível" },
  { value: "reservado", label: "Reservado" },
  { value: "vendido", label: "Vendido" },
  { value: "doado", label: "Doado" },
];

const CATEGORIES = ["all", "Eletrônicos", "Gibis", "Livros", "Instrumentos", "Outros"];

interface Props {
  status: string;
  category: string;
  onStatusChange: (s: string) => void;
  onCategoryChange: (c: string) => void;
  counts: Record<string, number>;
}

export default function FilterBar({
  status,
  category,
  onStatusChange,
  onCategoryChange,
  counts,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => onStatusChange(s.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              status === s.value
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
            }`}
          >
            {s.label}
            {counts[s.value] !== undefined && (
              <span className="ml-1.5 text-xs opacity-70">
                {counts[s.value]}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => onCategoryChange(c)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              category === c
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-300"
            }`}
          >
            {c === "all" ? "Todas categorias" : c}
          </button>
        ))}
      </div>
    </div>
  );
}
