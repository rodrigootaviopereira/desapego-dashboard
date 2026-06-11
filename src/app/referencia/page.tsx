import { MainLayout } from "@/components/layout/MainLayout";
import plataformas from "@/data/plataformas.json";
import dicas from "@/data/dicas.json";

const AGENTE_COLOR: Record<string, string> = {
  "organizer": "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  "copy-chief": "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  "market-strategist": "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  "desapego-chief": "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
};

const AGENTE_NOME: Record<string, string> = {
  "organizer": "Vera",
  "copy-chief": "Leo",
  "market-strategist": "Max",
  "desapego-chief": "Kai",
};

const TIPO_LABEL: Record<string, string> = {
  catalogacao: "Catalogação",
  foto: "Foto",
  descricao: "Descrição",
  preço: "Preço",
  logistica: "Logística",
  plataforma: "Plataforma",
  geral: "Geral",
};

export default function Referencia() {
  const plataformasArr = Object.values(plataformas.plataformas);

  return (
    <MainLayout>
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
            Referência
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Plataformas, categorias recomendadas e dicas dos agentes
          </p>
        </div>

        {/* Plataformas */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Plataformas de Venda
          </h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <table className="w-full text-sm bg-white dark:bg-slate-900">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-left">
                  <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Plataforma</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Taxa</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Alcance</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Frete</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Observação</th>
                </tr>
              </thead>
              <tbody>
                {plataformasArr.map((p, i) => {
                  const taxa =
                    p.taxa_percentual === 0 && p.taxa_fixa === 0
                      ? "Grátis"
                      : p.taxa_percentual > 0
                      ? `${p.taxa_percentual}%${p.taxa_fixa > 0 ? ` + R$${p.taxa_fixa}` : ""}`
                      : `R$ ${p.taxa_fixa}`;
                  return (
                    <tr
                      key={i}
                      className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          {p.nome}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-semibold ${
                            taxa === "Grátis"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {taxa}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{p.alcance}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{p.frete}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-500 text-xs max-w-xs">
                        {p.nota}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Por categoria */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Plataformas por Categoria
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(plataformas.categorias_por_plataforma).map(([cat, platforms]) => (
              <div
                key={cat}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm"
              >
                <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{cat}</p>
                <div className="flex flex-wrap gap-1.5">
                  {platforms.map((pl) => (
                    <span
                      key={pl}
                      className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-medium"
                    >
                      {pl}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Doação */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Opções de Doação
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
            {plataformas.doacao.map((d, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {d.nome}
                </span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {d.aceita.map((a) => (
                    <span
                      key={a}
                      className="text-xs px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dicas dos agentes */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Dicas dos Agentes
          </h2>
          <div className="space-y-3">
            {dicas.map((dica) => (
              <div
                key={dica.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex gap-3 items-start"
              >
                <div className="flex flex-col gap-1 shrink-0 text-center">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      AGENTE_COLOR[dica.agente] ?? "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {AGENTE_NOME[dica.agente] ?? dica.agente}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {TIPO_LABEL[dica.tipo] ?? dica.tipo}
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {dica.texto}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
