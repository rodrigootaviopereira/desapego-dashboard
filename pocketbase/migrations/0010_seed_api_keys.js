migrate(
  (app) => {
    const inv = app.findCollectionByNameOrId('inventory_items')
    if (!inv.fields.getByName('deletado')) {
      inv.fields.add(new BoolField({ name: 'deletado' }))
      app.save(inv)
    }

    const agents = ['Kai', 'Vera', 'Leo', 'Max']
    const apiKeys = app.findCollectionByNameOrId('api_keys')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    for (const agent of agents) {
      try {
        app.findFirstRecordByData('api_keys', 'agent_name', agent)
      } catch (_) {
        const record = new Record(apiKeys)
        record.set('agent_name', agent)
        record.set('key', $security.randomString(16))
        record.set('secret', $security.randomString(32))
        record.set('expires_at', expiresAt.toISOString())
        record.set('is_active', true)
        app.save(record)
      }
    }
  },
  (app) => {
    // empty down
  },
)
