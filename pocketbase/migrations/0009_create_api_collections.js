migrate(
  (app) => {
    const apiKeys = new Collection({
      name: 'api_keys',
      type: 'base',
      fields: [
        { name: 'agent_name', type: 'text', required: true },
        { name: 'key', type: 'text', required: true },
        { name: 'secret', type: 'text', required: true },
        { name: 'expires_at', type: 'date' },
        { name: 'is_active', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(apiKeys)

    const apiWebhooks = new Collection({
      name: 'api_webhooks',
      type: 'base',
      fields: [
        { name: 'url', type: 'url', required: true },
        { name: 'events', type: 'json' },
        { name: 'secret', type: 'text', required: true },
        { name: 'active', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(apiWebhooks)

    const apiLogs = new Collection({
      name: 'api_logs',
      type: 'base',
      fields: [
        { name: 'agent_name', type: 'text' },
        { name: 'endpoint', type: 'text' },
        { name: 'method', type: 'text' },
        { name: 'status_code', type: 'number' },
        { name: 'response_time_ms', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(apiLogs)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('api_keys'))
    app.delete(app.findCollectionByNameOrId('api_webhooks'))
    app.delete(app.findCollectionByNameOrId('api_logs'))
  },
)
