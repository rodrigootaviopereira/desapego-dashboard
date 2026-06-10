routerAdd('POST', '/backend/v1/api/items/{id}/mark-donated', (e) => {
  e.response.header().set('X-RateLimit-Limit', '100')
  e.response.header().set('X-RateLimit-Remaining', '99')

  const id = e.request.pathValue('id')
  const body = e.requestInfo().body || {}
  try {
    const record = $app.findRecordById('inventory_items', id)
    record.set('status', 'doado')
    record.set('donatario_nome', body.recebedor || '')
    record.set('local_doacao', body.local || '')
    record.set('observations', body.observacoes || '')
    record.set('doacao_data', new Date().toISOString())
    $app.save(record)

    return e.json(200, { status: 'success', item_id: id })
  } catch (err) {
    return e.notFoundError('Item not found')
  }
})
