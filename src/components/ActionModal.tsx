"use client";

import { useState } from "react";
import { InventoryItem } from "@/types/item";

interface SoldModalProps {
  item: InventoryItem;
  onConfirm: (valorFinal: number) => void;
  onCancel: () => void;
  loading: boolean;
}

export function SoldModal({ item, onConfirm, onCancel, loading }: SoldModalProps) {
  const [valor, setValor] = useState(String(item.imagined_price || ""));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-1">Marcar como Vendido</h3>
        <p className="text-sm text-slate-500 mb-4 truncate">{item.name}</p>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Valor final (R$)
        </label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="0.00"
          min="0"
          step="0.01"
        />
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(Number(valor))}
            disabled={loading || !valor}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface DonateModalProps {
  item: InventoryItem;
  onConfirm: (recipient: string) => void;
  onCancel: () => void;
  loading: boolean;
}

export function DonateModal({ item, onConfirm, onCancel, loading }: DonateModalProps) {
  const [recipient, setRecipient] = useState("ONG Solidariedade");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-1">Marcar como Doado</h3>
        <p className="text-sm text-slate-500 mb-4 truncate">{item.name}</p>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Destinatário
        </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Nome da ONG ou pessoa"
        />
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(recipient)}
            disabled={loading || !recipient.trim()}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
