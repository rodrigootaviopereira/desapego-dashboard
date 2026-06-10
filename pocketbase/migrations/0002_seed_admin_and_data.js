migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      app.findAuthRecordByEmail(
        '_pb_users_auth_',
        'rodrigootaviopereira@gmail.com',
      )
    } catch (_) {
      const record = new Record(users)
      record.setEmail('rodrigootaviopereira@gmail.com')
      record.set('username', 'admin')
      record.setPassword('desapego')
      record.setVerified(true)
      record.set('name', 'Admin Squad')
      app.save(record)
    }

    const inventory = app.findCollectionByNameOrId('inventory_items')

    const baseGibis = [
      'Sandman Edição Definitiva Vol I',
      'Sandman Edição Definitiva Vol II',
      'Sandman Edição Definitiva Vol III',
      'Sandman Edição Definitiva Vol IV',
      'Sandman Edição Definitiva Vol V',
      'Habibi',
      'Saga Vol 1',
      'Saga Vol 2',
      'Saga Vol 3',
      'Saga Vol 4',
      'Saga Vol 5',
      'Batman: O Cavaleiro das Trevas',
      'Batman: A Piada Mortal',
      'Loki: Jornada ao Mistério 1',
      'Loki: Jornada ao Mistério 2',
      'V de Vingança',
      'Watchmen',
      'Maus',
      'Retalhos',
      'O Incal',
      'Akira Vol 1',
      'Akira Vol 2',
      'Akira Vol 3',
      'Akira Vol 4',
      'Akira Vol 5',
      'Akira Vol 6',
      'Preacher Vol 1',
      'Preacher Vol 2',
      'Y: O Último Homem Vol 1',
      'Y: O Último Homem Vol 2',
      'Homem-Aranha: A Última Caçada de Kraven',
      'Demolidor: A Queda de Murdock',
    ]

    const itemsToSeed = [
      {
        name: 'Purificador Blue OXI HE',
        category: 'Eletrônicos',
        brand: 'TopLyfe',
        model: 'Blue OXI HE',
        condition: 'Novo',
        functional_status: 'Sim',
        defects: 'Nenhum',
        accessories: 'Garantia 2 anos',
        city: 'Maringá-PR',
        accepts_shipping: 'Sim',
        imagined_price: 600,
        urgency: 'Alta',
        observations: '',
        status: 'disponivel',
        priority_score: 7,
      },
      {
        name: 'PS Vita',
        category: 'Eletrônicos',
        brand: 'Sony',
        model: 'PCH-2001 Slim 8GB',
        condition: 'Como novo',
        functional_status: 'Sim',
        defects: 'Nenhum',
        accessories: 'Carregador case PS All-Stars',
        city: 'Maringá-PR',
        accepts_shipping: 'Sim',
        imagined_price: 1650,
        urgency: 'Alta',
        observations: '',
        status: 'disponivel',
        priority_score: 10,
      },
    ]

    baseGibis.forEach((nome, index) => {
      let preco = 0
      if (index >= 5 && index < 13) preco = 30
      if (index >= 13 && index < 17) preco = 20
      if (index === 17) preco = 24

      itemsToSeed.push({
        name: nome,
        category: 'Gibis',
        brand: 'Várias',
        model: '',
        condition: 'Como novo',
        functional_status: 'N/A',
        defects: 'Nenhum',
        accessories: 'Nenhum',
        city: 'Maringá-PR',
        accepts_shipping: 'Sim',
        imagined_price: preco,
        urgency: index < 27 ? 'Alta' : 'Baixa',
        observations: '',
        status: 'disponivel',
        priority_score: index < 5 ? 10 : Math.floor(Math.random() * 5) + 4,
      })
    })

    for (const itemData of itemsToSeed) {
      try {
        app.findFirstRecordByData('inventory_items', 'name', itemData.name)
      } catch (_) {
        const record = new Record(inventory)
        record.set('name', itemData.name)
        record.set('category', itemData.category)
        record.set('brand', itemData.brand)
        record.set('model', itemData.model)
        record.set('condition', itemData.condition)
        record.set('functional_status', itemData.functional_status)
        record.set('defects', itemData.defects)
        record.set('accessories', itemData.accessories)
        record.set('city', itemData.city)
        record.set('accepts_shipping', itemData.accepts_shipping)
        record.set('imagined_price', itemData.imagined_price)
        record.set('urgency', itemData.urgency)
        record.set('observations', itemData.observations)
        record.set(
          'priority_score',
          itemData.priority_score > 10 ? 10 : itemData.priority_score,
        )
        record.set('status', itemData.status)
        app.save(record)
      }
    }
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail(
        '_pb_users_auth_',
        'rodrigootaviopereira@gmail.com',
      )
      app.delete(record)
    } catch (_) {}

    const inventory = app.findCollectionByNameOrId('inventory_items')
    app.truncateCollection(inventory)
  },
)
