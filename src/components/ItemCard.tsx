"use client";

import { useState } from "react";
import { InventoryItem } from "@/types/item";

const STATUS_STYLE: Record<string, string> = {
  disponivel: "bg-green-100 text-green-800",
  reservado: "bg-amber-100 text-amber-800",
  vendido: "bg-blue-100 text-blue-800",
  doado: "bg-purple-100 text-purple-800",
};

const STATUS_LABEL: Record<string, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
  doado: "Doado",
};

const URGENCY_STYLE: Record<string, string> = {
  Alta: "bg-red-100 text-red-700",
  Média: "bg-orange-100 text-orange-700",
  Baixa: "bg-slate-100 text-slate-500",
};

interface Props {
  item: InventoryItem;
  onMarkSold: (item: InventoryItem) => void;
  onMarkDonated: (item: InventoryItem) => void;
}

export default function ItemCard({ item, onMarkSold, onMarkDonated }: Props) {
  const [adExpanded, setAdExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isActive = item.status === "disponivel" || item.status === "reservado";
  const hasAd = !!item.observations?.trim();

  async function copyAd() {
    await navigator.clipboard.writeText(item.observations);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
      {/* Header row */}
      <div className="p-4 flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {item.category && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700">
              {item.category}
            </span>
          )}
          {item.condition && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
              {item.condition}
            </span>
          )}
          {item.urgency && URGENCY_STYLE[item.urgency] && (
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${URGENCY_STYLE[item.urgency]}`}>
              {item.urgency}
            </span>
          )}
        </div>
        <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[item.status] ?? "bg-slate-100 text-slate-600"}`}>
          {STATUS_LABEL[item.status] ?? item.status}
        </span>
      </div>

      {/* Name & price */}
      <div className="px-4 pb-2 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-800 leading-tight">{item.name}</h3>
          {(item.brand || item.model) && (
            <p className="text-xs text-slate-400 mt-0.5">
              {[item.brand, item.model].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        {item.imagined_price > 0 && (
          <span className="text-sm font-bold text-slate-700 shrink-0">
            R$ {item.imagined_price.toLocaleString("pt-BR")}
          </span>
        )}
      </div>

      {/* Ad text (Leo) */}
      {hasAd && (
        <div className="mx-4 mb-3 rounded-lg bg-amber-50 border border-amber-100">
          <div className="flex items-center justify-between px-3 pt-2 pb-1">
            <span className="text-xs font-semibold text-amber-700">Anuncio Leo</span>
            <div className="flex gap-1">
              <button
                onClick={copyAd}
                className="text-xs px-2 py-0.5 rounded bg-amber-200 hover:bg-amber-300 text-amber-800 font-medium transition-colors"
              >
                {copied ? "Copiado!" : "Copiar"}
              </button>
              <button
                onClick={() => setAdExpanded(!adExpanded)}
                className="text-xs px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors"
              >
                {adExpanded ? "Menos" : "Ver"}
              </button>
            </div>
          </div>
          <p
            className={`px-3 pb-3 text-xs text-amber-900 whitespace-pre-line leading-relaxed ${
              adExpanded ? "" : "line-clamp-2"
            }`}
          >
            {item.observations}
          </p>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      {isActive && (
        <div className="px-4 pb-4 flex gap-2 pt-2 border-t border-slate-100 mt-2">
          <button
            onClick={() => onMarkSold(item)}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors"
          >
            Vendido
          </button>
          <button
            onClick={() => onMarkDonated(item)}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-purple-500 hover:bg-purple-600 text-white transition-colors"
          >
            Doado
          </button>
        </div>
      )}
    </div>
  );
}
