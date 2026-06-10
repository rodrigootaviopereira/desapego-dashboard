migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('logs')
    const records = [
      {
        timestamp: '2024-01-01 10:00:00.000Z',
        agente: 'Sistema',
        acao: 'Criou',
        item_nome: 'Gibi Batman #1',
        detalhes: 'Item catalogado via sistema.',
        usuario: 'Admin',
      },
      {
        timestamp: '2024-01-02 11:30:00.000Z',
        agente: 'Vera',
        acao: 'Precificou',
        item_nome: 'Nintendo Switch',
        detalhes: 'Avaliou preço baseado no mercado.',
        usuario: 'Sistema',
      },
      {
        timestamp: '2024-01-03 14:15:00.000Z',
        agente: 'Leo',
        acao: 'Escreveu',
        item_nome: 'Guitarra Fender',
        detalhes: 'Gerou cópia para anúncio OLX.',
        usuario: 'Sistema',
      },
      {
        timestamp: '2024-01-04 09:20:00.000Z',
        agente: 'Kai',
        acao: 'Avaliou',
        item_nome: 'Câmera Canon',
        detalhes: 'Avaliou estado de conservação.',
        usuario: 'Sistema',
      },
      {
        timestamp: '2024-01-05 16:45:00.000Z',
        agente: 'Admin',
        acao: 'Editou',
        item_nome: 'Livro O Hobbit',
        detalhes: 'Atualizou o preço.',
        usuario: 'Admin',
        campo_alterado: 'imagined_price',
        valor_antes: '50',
        valor_depois: '45',
      },
      {
        timestamp: '2024-01-06 10:10:00.000Z',
        agente: 'Admin',
        acao: 'Vendeu',
        item_nome: 'Gibi Batman #1',
        detalhes: 'Venda concluída.',
        usuario: 'Admin',
        campo_alterado: 'status',
        valor_antes: 'disponivel',
        valor_depois: 'vendido',
      },
      {
        timestamp: '2024-01-07 11:00:00.000Z',
        agente: 'Admin',
        acao: 'Doou',
        item_nome: 'Roupas Antigas',
        detalhes: 'Doação para ONG local.',
        usuario: 'Admin',
        campo_alterado: 'status',
        valor_antes: 'disponivel',
        valor_depois: 'doado',
      },
      {
        timestamp: '2024-01-08 13:25:00.000Z',
        agente: 'Max',
        acao: 'Recomendou',
        item_nome: 'Monitor Dell',
        detalhes: 'Recomendou estratégia de venda na OLX.',
        usuario: 'Sistema',
      },
      {
        timestamp: '2024-01-09 15:40:00.000Z',
        agente: 'Admin',
        acao: 'Deletou',
        item_nome: 'Item Duplicado',
        detalhes: 'Removido por duplicação.',
        usuario: 'Admin',
      },
      {
        timestamp: '2024-01-10 12:00:00.000Z',
        agente: 'Sistema',
        acao: 'Importou',
        item_nome: 'Lote de Livros',
        detalhes: 'Importação via CSV.',
        usuario: 'Admin',
      },
    ]
    for (const r of records) {
      const rec = new Record(col)
      for (const [k, v] of Object.entries(r)) rec.set(k, v)
      app.save(rec)
    }
  },
  (app) => {
    app
      .db()
      .newQuery(
        "DELETE FROM logs WHERE acao IN ('Criou', 'Precificou', 'Escreveu', 'Avaliou', 'Editou', 'Vendeu', 'Doou', 'Recomendou', 'Deletou', 'Importou')",
      )
      .execute()
  },
)
