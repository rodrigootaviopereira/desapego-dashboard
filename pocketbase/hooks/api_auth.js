routerAdd('POST', '/backend/v1/api/auth/token', (e) => {
  const body = e.requestInfo().body || {}
  const { client_id, client_secret } = body
  if (!client_id || !client_secret)
    return e.badRequestError('Missing credentials')
  try {
    const keyRecord = $app.findFirstRecordByData('api_keys', 'key', client_id)
    if (
      keyRecord.getString('secret') !== client_secret ||
      !keyRecord.getBool('is_active')
    ) {
      return e.unauthorizedError('Invalid credentials')
    }
    const token = $security.createJWT(
      { sub: keyRecord.getString('agent_name') },
      'SUPER_SECRET_KEY_123',
      86400,
    )
    return e.json(200, {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 86400,
    })
  } catch (err) {
    return e.unauthorizedError('Invalid credentials')
  }
})
