migrate(
  (app) => {
    const collections = [
      'inventory_items',
      'recomendacoes',
      'prompts_venda',
      'dicas',
      'logs',
    ]
    const rule = '@request.auth.id != null || @request.auth.sub != null'

    for (const name of collections) {
      try {
        const col = app.findCollectionByNameOrId(name)
        col.listRule = rule
        col.viewRule = rule
        col.createRule = rule
        col.updateRule = rule
        col.deleteRule = rule
        app.save(col)
      } catch (e) {
        console.log('Failed to update collection ' + name, e.message)
      }
    }
  },
  (app) => {
    const collections = [
      'inventory_items',
      'recomendacoes',
      'prompts_venda',
      'dicas',
      'logs',
    ]
    const rule = "@request.auth.id != ''"

    for (const name of collections) {
      try {
        const col = app.findCollectionByNameOrId(name)
        col.listRule = rule
        col.viewRule = rule
        col.createRule = rule
        col.updateRule = rule
        col.deleteRule = rule
        app.save(col)
      } catch (e) {
        console.log('Failed to update collection ' + name, e.message)
      }
    }
  },
)
