routerAdd('POST', '/backend/v1/api/webhooks/register', (e) => {
  const body = e.requestInfo().body || {}
  if (!body.url) return e.badRequestError('Missing URL')

  const col = $app.findCollectionByNameOrId('api_webhooks')
  const rec = new Record(col)
  rec.set('url', body.url)
  rec.set('events', body.events || ['item_sold'])
  const secret = $security.randomString(32)
  rec.set('secret', secret)
  rec.set('active', true)

  $app.save(rec)

  return e.json(200, { webhook_id: rec.id, secret })
})
