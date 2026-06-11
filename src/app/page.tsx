"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { InventoryItem, ItemStatus } from "@/types/item";
import { MainLayout } from "@/components/layout/MainLayout";
import { KpiCards } from "@/components/KpiCards";
import FilterBar from "@/components/FilterBar";
import ItemCard from "@/components/ItemCard";
import { SoldModal, DonateModal } from "@/components/ActionModal";
import * as skipAPI from "@/lib/skip-browser";

interface PBResponse {
  items: InventoryItem[];
  totalItems: number;
}

type ModalState =
  | { type: "sold"; item: InventoryItem }
  | { type: "donated"; item: InventoryItem }
  | null;

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl ${className}`}
    />
  );
}

export default function Dashboard() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [modal, setModal] = useState<ModalState>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: string[] = ["deletado=false"];
      if (status !== "all") filters.push(`status="${status}"`);
      if (category !== "all") filters.push(`category="${category}"`);
      const data: PBResponse = await skipAPI.fetchItems(filters.join(" && "));
      setItems(data.items ?? []);
      setTotal(data.totalItems ?? 0);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao carregar itens");
    } finally {
      setLoading(false);
    }
  }, [status, category]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const counts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = (acc[item.status] ?? 0) + 1;
    acc["all"] = (acc["all"] ?? 0) + 1;
    return acc;
  }, {});

  async function handleMarkSold(valorFinal: number) {
    if (!modal || modal.type !== "sold") return;
    setActionLoading(true);
    try {
      await skipAPI.markSold(modal.item.id, valorFinal);
      setItems((prev) =>
        prev.map((i) =>
          i.id === modal.item.id ? { ...i, status: "vendido" as ItemStatus } : i
        )
      );
      setModal(null);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erro ao marcar vendido");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleMarkDonated(recipient: string) {
    if (!modal || modal.type !== "donated") return;
    setActionLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      await skipAPI.markDonated(modal.item.id, recipient, today);
      setItems((prev) =>
        prev.map((i) =>
          i.id === modal.item.id ? { ...i, status: "doado" as ItemStatus } : i
        )
      );
      setModal(null);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erro ao marcar doado");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
              Inventário
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              {loading
                ? "Carregando..."
                : `${total} itens cadastrados no Skip Cloud`}
            </p>
          </div>
          <button
            onClick={fetchItems}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </button>
        </div>

        {/* KPI cards */}
        <section>
          <KpiCards items={items} total={total} />
        </section>

        {/* Filters */}
        <section>
          <FilterBar
            status={status}
            category={category}
            onStatusChange={setStatus}
            onCategoryChange={setCategory}
            counts={counts}
          />
        </section>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 text-sm text-red-700 dark:text-red-400">
            {error}{" "}
            <button onClick={fetchItems} className="underline ml-1">
              Tentar novamente
            </button>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              Nenhum item encontrado
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Tente mudar o filtro
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onMarkSold={(i) => setModal({ type: "sold", item: i })}
                onMarkDonated={(i) => setModal({ type: "donated", item: i })}
              />
            ))}
          </div>
        )}
      </div>

      {modal?.type === "sold" && (
        <SoldModal
          item={modal.item}
          onConfirm={handleMarkSold}
          onCancel={() => setModal(null)}
          loading={actionLoading}
        />
      )}
      {modal?.type === "donated" && (
        <DonateModal
          item={modal.item}
          onConfirm={handleMarkDonated}
          onCancel={() => setModal(null)}
          loading={actionLoading}
        />
      )}
    </MainLayout>
  );
}
