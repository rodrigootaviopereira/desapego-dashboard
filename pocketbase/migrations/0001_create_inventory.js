migrate(
  (app) => {
    const collection = new Collection({
      name: 'inventory_items',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'category',
          type: 'select',
          values: ['Gibis', 'Eletrônicos', 'Instrumentos', 'Livros', 'Outros'],
          maxSelect: 1,
        },
        { name: 'brand', type: 'text' },
        { name: 'model', type: 'text' },
        {
          name: 'condition',
          type: 'select',
          values: ['Novo', 'Como novo', 'Bom', 'Regular', 'Ruim'],
          maxSelect: 1,
        },
        {
          name: 'functional_status',
          type: 'select',
          values: ['Sim', 'Não', 'Parcialmente', 'N/A'],
          maxSelect: 1,
        },
        { name: 'defects', type: 'text' },
        { name: 'accessories', type: 'text' },
        { name: 'city', type: 'text' },
        {
          name: 'accepts_shipping',
          type: 'select',
          values: ['Sim', 'Não', 'Só local'],
          maxSelect: 1,
        },
        { name: 'imagined_price', type: 'number' },
        {
          name: 'urgency',
          type: 'select',
          values: ['Baixa', 'Média', 'Alta'],
          maxSelect: 1,
        },
        { name: 'observations', type: 'text' },
        { name: 'priority_score', type: 'number', min: 1, max: 10 },
        {
          name: 'status',
          type: 'select',
          values: ['disponivel', 'reservado', 'vendido', 'doado'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('inventory_items')
    app.delete(collection)
  },
)
