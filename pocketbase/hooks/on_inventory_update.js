onRecordAfterUpdateSuccess((e) => {
  const isDeleted =
    e.record.getBool('deletado') && !e.record.original().getBool('deletado')
  let event = 'item_updated'
  if (isDeleted) event = 'item_deleted'
  else if (
    e.record.getString('status') === 'vendido' &&
    e.record.original().getString('status') !== 'vendido'
  )
    event = 'item_sold'
  else if (
    e.record.getString('status') === 'doado' &&
    e.record.original().getString('status') !== 'doado'
  )
    event = 'item_donated'

  try {
    const webhooks = $app.findRecordsByFilter(
      'api_webhooks',
      'active = true',
      '',
      100,
      0,
    )
    for (const wh of webhooks) {
      const events = wh.get('events') || []
      if (events.includes(event)) {
        const payload = {
          event,
          timestamp: new Date().toISOString(),
          data: e.record.publicExport(),
        }
        const signature =
          'sha256=' +
          $security.hs256(JSON.stringify(payload), wh.getString('secret'))
        try {
          $http.send({
            url: wh.getString('url'),
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Signature': signature,
            },
            body: JSON.stringify(payload),
            timeout: 5,
          })
        } catch (err) {
          $app.logger().error('Webhook failed', 'url', wh.getString('url'))
        }
      }
    }
  } catch (_) {}

  e.next()
}, 'inventory_items')
