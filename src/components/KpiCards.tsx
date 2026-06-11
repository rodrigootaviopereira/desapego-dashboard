"use client";

import { Package, Tag, DollarSign, Heart } from "lucide-react";
import { InventoryItem } from "@/types/item";

interface Props {
  items: InventoryItem[];
  total: number;
}

export function KpiCards({ items, total }: Props) {
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = (acc[item.status] ?? 0) + 1;
    return acc;
  }, {});

  const kpis = [
    {
      icon: Package,
      label: "Total de Itens",
      value: total,
      suffix: "",
      strip: "bg-violet-500",
      iconBg: "bg-violet-50 dark:bg-violet-500/10",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      icon: Tag,
      label: "Disponíveis",
      value: counts["disponivel"] ?? 0,
      suffix: "",
      strip: "bg-emerald-500",
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: DollarSign,
      label: "Vendidos",
      value: counts["vendido"] ?? 0,
      suffix: "",
      strip: "bg-blue-500",
      iconBg: "bg-blue-50 dark:bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Heart,
      label: "Doados",
      value: counts["doado"] ?? 0,
      suffix: "",
      strip: "bg-pink-500",
      iconBg: "bg-pink-50 dark:bg-pink-500/10",
      iconColor: "text-pink-600 dark:text-pink-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon;
        return (
          <div
            key={i}
            className="relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
          >
            <div className={`absolute top-0 inset-x-0 h-0.5 ${kpi.strip}`} />
            <div className="p-5 pt-6">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {kpi.label}
                </p>
                <div className={`p-1.5 rounded-lg ${kpi.iconBg}`}>
                  <Icon className={`w-4 h-4 ${kpi.iconColor}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums leading-none">
                {kpi.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
