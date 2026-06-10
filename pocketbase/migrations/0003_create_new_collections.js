migrate(
  (app) => {
    const invCol = app.findCollectionByNameOrId('inventory_items')

    const recomendacoes = new Collection({
      name: 'recomendacoes',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'item_id',
          type: 'relation',
          required: false,
          collectionId: invCol.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'item_nome', type: 'text' },
        { name: 'plataforma', type: 'text' },
        { name: 'ancora', type: 'number' },
        { name: 'alvo', type: 'number' },
        { name: 'piso', type: 'number' },
        { name: 'justificativa_max', type: 'text' },
        { name: 'notas_estrategista', type: 'text' },
        { name: 'data', type: 'date' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(recomendacoes)

    const promptsVenda = new Collection({
      name: 'prompts_venda',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'item_id',
          type: 'relation',
          required: false,
          collectionId: invCol.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'item_nome', type: 'text' },
        { name: 'titulo', type: 'text' },
        { name: 'descricao', type: 'text' },
        {
          name: 'fotos',
          type: 'file',
          maxSelect: 10,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        },
        {
          name: 'status',
          type: 'select',
          values: ['rascunho', 'publicado', 'arquivado'],
          maxSelect: 1,
        },
        { name: 'agente_leo', type: 'text' },
        { name: 'notas_copywriter', type: 'text' },
        { name: 'data', type: 'date' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(promptsVenda)

    const dicas = new Collection({
      name: 'dicas',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'agente',
          type: 'select',
          values: ['Vera', 'Leo', 'Max', 'Kai'],
          maxSelect: 1,
          required: true,
        },
        { name: 'tipo', type: 'text' },
        { name: 'texto', type: 'text' },
        { name: 'resultado', type: 'text' },
        {
          name: 'item_id',
          type: 'relation',
          required: false,
          collectionId: invCol.id,
          cascadeDelete: false,
          maxSelect: 1,
        },
        { name: 'data', type: 'date' },
        { name: 'aplicada', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(dicas)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('dicas'))
    app.delete(app.findCollectionByNameOrId('prompts_venda'))
    app.delete(app.findCollectionByNameOrId('recomendacoes'))
  },
)
