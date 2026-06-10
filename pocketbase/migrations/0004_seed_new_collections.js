migrate(
  (app) => {
    const invCol = app.findCollectionByNameOrId('inventory_items')

    let item1, item2
    try {
      item1 = app.findFirstRecordByData(
        'inventory_items',
        'name',
        'Câmera Canon T7i',
      )
    } catch (_) {
      item1 = new Record(invCol)
      item1.set('name', 'Câmera Canon T7i')
      item1.set('category', 'Eletrônicos')
      item1.set('status', 'disponivel')
      item1.set('imagined_price', 3500)
      app.save(item1)
    }

    try {
      item2 = app.findFirstRecordByData(
        'inventory_items',
        'name',
        'Violão Fender',
      )
    } catch (_) {
      item2 = new Record(invCol)
      item2.set('name', 'Violão Fender')
      item2.set('category', 'Instrumentos')
      item2.set('status', 'disponivel')
      item2.set('imagined_price', 1200)
      app.save(item2)
    }

    const recCol = app.findCollectionByNameOrId('recomendacoes')
    const r1 = new Record(recCol)
    r1.set('item_id', item1.id)
    r1.set('item_nome', item1.get('name'))
    r1.set('plataforma', 'Mercado Livre')
    r1.set('ancora', 3500)
    r1.set('alvo', 3200)
    r1.set('piso', 3000)
    r1.set(
      'justificativa_max',
      'Equipamento fotográfico costuma ter alta liquidez em datas sazonais. Mercado Livre aceita prêmios maiores.',
    )
    r1.set(
      'notas_estrategista',
      'Se houver muita objeção, oferecer a bolsa de brinde e manter o preço alvo.',
    )
    r1.set('data', new Date().toISOString())
    app.save(r1)

    const r2 = new Record(recCol)
    r2.set('item_id', item2.id)
    r2.set('item_nome', item2.get('name'))
    r2.set('plataforma', 'OLX')
    r2.set('ancora', 1200)
    r2.set('alvo', 1000)
    r2.set('piso', 850)
    r2.set(
      'justificativa_max',
      'OLX é terreno de negociação agressiva. Âncora alta é obrigatória para ter gordura na contraproposta.',
    )
    r2.set(
      'notas_estrategista',
      'Aceitar trocas apenas por equipamentos menores mais volta em dinheiro.',
    )
    r2.set('data', new Date().toISOString())
    app.save(r2)

    const r3 = new Record(recCol)
    r3.set('item_nome', 'Lote Livros RPG')
    r3.set('plataforma', 'Shopee')
    r3.set('ancora', 400)
    r3.set('alvo', 350)
    r3.set('piso', 300)
    r3.set(
      'justificativa_max',
      'Colecionadores pagam caro por lotes bem conservados. Foco em frete grátis.',
    )
    r3.set('notas_estrategista', 'Não quebrar o lote.')
    r3.set('data', new Date().toISOString())
    app.save(r3)

    const pvCol = app.findCollectionByNameOrId('prompts_venda')
    const pv1 = new Record(pvCol)
    pv1.set('item_id', item1.id)
    pv1.set('item_nome', item1.get('name'))
    pv1.set(
      'titulo',
      'Câmera Canon T7i Impecável + Lente do Kit - Ideal para Criadores',
    )
    pv1.set(
      'descricao',
      'Câmera em estado de nova. Poucos cliques. Ideal para quem quer começar no YouTube ou fotografia profissional. Motivo da venda: Upgrade de equipamento.\n\nAcompanha bateria, carregador e alça original.',
    )
    pv1.set('status', 'rascunho')
    pv1.set(
      'agente_leo',
      'Foquei nos benefícios para o comprador (criadores de conteúdo). A descrição gera desejo e urgência.',
    )
    pv1.set(
      'notas_copywriter',
      'Adicionar os specs técnicos detalhados antes de publicar.',
    )
    pv1.set('data', new Date().toISOString())
    app.save(pv1)

    const pv2 = new Record(pvCol)
    pv2.set('item_id', item2.id)
    pv2.set('item_nome', item2.get('name'))
    pv2.set(
      'titulo',
      'Violão Fender Eletroacústico Clássico - Timbre Maravilhoso',
    )
    pv2.set(
      'descricao',
      'Oportunidade única para músicos exigentes. O violão possui captação ativa e afinador embutido. Cordas elixir recém trocadas.',
    )
    pv2.set('status', 'publicado')
    pv2.set(
      'agente_leo',
      'Título direto ao ponto e focado na qualidade do produto (timbre).',
    )
    pv2.set('notas_copywriter', 'Monitorar as visitas do anúncio por 3 dias.')
    pv2.set('data', new Date().toISOString())
    app.save(pv2)

    const dicasCol = app.findCollectionByNameOrId('dicas')
    const baseDicas = [
      {
        agente: 'Vera',
        tipo: 'Organização',
        texto:
          'Agrupe itens pequenos em lotes. É mais fácil vender 5 gibis juntos do que 1 por vez.',
        aplicada: true,
        resultado: 'Vendi o lote do Aranha em 2 dias.',
      },
      {
        agente: 'Max',
        tipo: 'Precificação',
        texto:
          "Sempre deixe 15% de margem no preço do OLX para o 'choro'. É psicológico.",
        aplicada: false,
        resultado: '',
      },
      {
        agente: 'Kai',
        tipo: 'Tendência',
        texto:
          'Equipamentos vintage estão em alta nesta época do ano, reajuste o valor do piso.',
        aplicada: false,
        resultado: '',
      },
      {
        agente: 'Leo',
        tipo: 'Copy',
        texto:
          'Use bullet points na descrição, os compradores não leem blocos densos de texto.',
        aplicada: true,
        resultado: 'Aumentou as perguntas no chat.',
      },
      {
        agente: 'Vera',
        tipo: 'Fotografia',
        texto:
          'Limpe bem o item e tire fotos com luz natural. Fotos escuras matam o anúncio.',
        aplicada: true,
        resultado: 'As fotos ficaram perfeitas.',
      },
      {
        agente: 'Max',
        tipo: 'Estratégia',
        texto:
          'Se não tiver perguntas em 7 dias, reduza o valor âncora em 5% e reative o anúncio.',
        aplicada: false,
        resultado: '',
      },
      {
        agente: 'Kai',
        tipo: 'Mercado',
        texto:
          'Itens de escritório disparam no começo do ano. Segure as cadeiras para vender em Janeiro.',
        aplicada: false,
        resultado: '',
      },
      {
        agente: 'Leo',
        tipo: 'Engajamento',
        texto:
          'Responda o chat em menos de 10 minutos. OLX pune quem demora a responder.',
        aplicada: true,
        resultado: 'Venda rápida alcançada!',
      },
      {
        agente: 'Vera',
        tipo: 'Processo',
        texto:
          'Guarde as caixas originais sempre que possível, agrega 10% de valor no mercado de usados.',
        aplicada: false,
        resultado: '',
      },
      {
        agente: 'Max',
        tipo: 'Estratégia',
        texto:
          'Ofereça frete grátis na Shopee embutindo o custo no preço alvo. A taxa de conversão dobra.',
        aplicada: true,
        resultado: 'Vendemos dois livros assim.',
      },
    ]

    baseDicas.forEach((d) => {
      const rec = new Record(dicasCol)
      rec.set('agente', d.agente)
      rec.set('tipo', d.tipo)
      rec.set('texto', d.texto)
      rec.set('aplicada', d.aplicada)
      rec.set('resultado', d.resultado)
      rec.set('data', new Date().toISOString())
      app.save(rec)
    })
  },
  (app) => {
    // handled by down migration of schema
  },
)
