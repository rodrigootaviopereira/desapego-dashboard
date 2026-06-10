migrate(
  (app) => {
    const collection = new Collection({
      name: 'agentes',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'slug', type: 'text', required: true },
        { name: 'nome', type: 'text', required: true },
        { name: 'persona', type: 'text' },
        { name: 'role_description', type: 'text' },
        { name: 'comportamentos', type: 'json' },
        { name: 'vocabulario', type: 'text' },
        { name: 'tom', type: 'text' },
        { name: 'status', type: 'bool' },
        { name: 'instrucoes_especiais', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_agentes_slug ON agentes (slug)'],
    })
    app.save(collection)

    const col = app.findCollectionByNameOrId('agentes')
    const defaults = [
      {
        slug: 'kai',
        nome: 'Kai',
        persona: 'Avaliador Crítico',
        role_description: 'Avalia condição e funcionalidade com precisão',
        comportamentos: JSON.stringify(['Objetivo', 'Detalalhista']),
        vocabulario: 'Técnico',
        tom: 'Sério',
        status: true,
        instrucoes_especiais: '',
      },
      {
        slug: 'vera',
        nome: 'Vera',
        persona: 'Precificadora',
        role_description: 'Define preços baseados no mercado e demanda',
        comportamentos: JSON.stringify(['Analítica', 'Focada em valor']),
        vocabulario: 'Econômico',
        tom: 'Profissional',
        status: true,
        instrucoes_especiais: '',
      },
      {
        slug: 'leo',
        nome: 'Leo',
        persona: 'Copywriter',
        role_description: 'Escreve anúncios atrativos e persuasivos',
        comportamentos: JSON.stringify(['Criativo', 'Persuasivo']),
        vocabulario: 'Vendas',
        tom: 'Entusiasmado',
        status: true,
        instrucoes_especiais: '',
      },
      {
        slug: 'max',
        nome: 'Max',
        persona: 'Estrategista',
        role_description: 'Recomenda as melhores plataformas e prazos',
        comportamentos: JSON.stringify(['Estratégico', 'Prático']),
        vocabulario: 'Mercado',
        tom: 'Direto',
        status: true,
        instrucoes_especiais: '',
      },
    ]
    for (const d of defaults) {
      const rec = new Record(col)
      for (const [k, v] of Object.entries(d)) rec.set(k, v)
      app.save(rec)
    }
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('agentes')
    app.delete(collection)
  },
)
