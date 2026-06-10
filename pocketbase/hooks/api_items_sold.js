routerAdd('POST', '/backend/v1/api/items/{id}/mark-sold', (e) => {
  e.response.header().set('X-RateLimit-Limit', '100')
  e.response.header().set('X-RateLimit-Remaining', '99')

  const id = e.request.pathValue('id')
  const body = e.requestInfo().body || {}
  if (!body.valor_final || body.valor_final <= 0)
    return e.badRequestError('Invalid valor_final')
  try {
    const record = $app.findRecordById('inventory_items', id)
    record.set('status', 'vendido')
    record.set('venda_valor', body.valor_final)
    record.set('venda_plataforma', body.plataforma || '')
    record.set('comprador_nome', body.comprador || '')
    record.set('observations', body.observacoes || '')
    record.set('venda_data', new Date().toISOString())
    $app.save(record)

    const logRecord = new Record($app.findCollectionByNameOrId('logs'))
    logRecord.set('timestamp', new Date().toISOString())
    logRecord.set('acao', 'Marcou como vendido (API)')
    logRecord.set('item_id', id)
    logRecord.set('item_nome', record.getString('name'))
    logRecord.set('detalhes', `Vendido por ${body.valor_final} via API`)
    $app.save(logRecord)

    return e.json(200, {
      status: 'success',
      item_id: id,
      valor_final: body.valor_final,
    })
  } catch (err) {
    return e.notFoundError('Item not found')
  }
})
