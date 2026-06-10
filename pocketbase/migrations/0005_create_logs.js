migrate(
  (app) => {
    const collection = new Collection({
      name: 'logs',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'timestamp', type: 'date', required: true },
        { name: 'agente', type: 'text' },
        { name: 'acao', type: 'text', required: true },
        {
          name: 'item_id',
          type: 'relation',
          collectionId: app.findCollectionByNameOrId('inventory_items').id,
          maxSelect: 1,
        },
        { name: 'item_nome', type: 'text' },
        { name: 'detalhes', type: 'text' },
        { name: 'usuario', type: 'text' },
        { name: 'campo_alterado', type: 'text' },
        { name: 'valor_antes', type: 'text' },
        { name: 'valor_depois', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('logs')
    app.delete(collection)
  },
)
