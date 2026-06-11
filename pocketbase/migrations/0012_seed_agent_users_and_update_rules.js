migrate(
  (app) => {
    const usersToCreate = [
      { name: 'Kai', email: 'kai@desapego.app' },
      { name: 'Vera', email: 'vera@desapego.app' },
      { name: 'Leo', email: 'leo@desapego.app' },
      { name: 'Max', email: 'max@desapego.app' },
    ]

    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')

    for (const u of usersToCreate) {
      try {
        app.findAuthRecordByEmail('_pb_users_auth_', u.email)
      } catch (_) {
        const record = new Record(usersCol)
        record.set('name', u.name)
        record.setEmail(u.email)
        record.setPassword('DesapegoAgent@2026!')
        record.setVerified(true)
        app.save(record)
      }
    }

    const collectionsToUpdate = [
      'inventory_items',
      'recomendacoes',
      'prompts_venda',
      'dicas',
      'logs',
    ]

    for (const name of collectionsToUpdate) {
      try {
        const col = app.findCollectionByNameOrId(name)
        col.listRule = '@request.auth.id != null'
        col.viewRule = '@request.auth.id != null'
        col.createRule = '@request.auth.id != null'
        col.updateRule = '@request.auth.id != null'
        col.deleteRule = '@request.auth.id != null'
        app.save(col)
      } catch (e) {
        console.log('Failed to update collection ' + name, e)
      }
    }
  },
  (app) => {
    const usersToDelete = [
      'kai@desapego.app',
      'vera@desapego.app',
      'leo@desapego.app',
      'max@desapego.app',
    ]

    for (const email of usersToDelete) {
      try {
        const record = app.findAuthRecordByEmail('_pb_users_auth_', email)
        app.delete(record)
      } catch (_) {}
    }

    const collectionsToUpdate = [
      'inventory_items',
      'recomendacoes',
      'prompts_venda',
      'dicas',
      'logs',
    ]

    for (const name of collectionsToUpdate) {
      try {
        const col = app.findCollectionByNameOrId(name)
        col.listRule = '@request.auth.id != null || @request.auth.sub != null'
        col.viewRule = '@request.auth.id != null || @request.auth.sub != null'
        col.createRule = '@request.auth.id != null || @request.auth.sub != null'
        col.updateRule = '@request.auth.id != null || @request.auth.sub != null'
        col.deleteRule = '@request.auth.id != null || @request.auth.sub != null'
        app.save(col)
      } catch (e) {}
    }
  },
)
