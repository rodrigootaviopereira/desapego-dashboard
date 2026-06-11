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
    const agentName = keyRecord.getString('agent_name').toLowerCase()
    const email = `${agentName}@desapego.app`
    let userRecord
    try {
      userRecord = $app.findAuthRecordByEmail('_pb_users_auth_', email)
    } catch (err) {
      return e.unauthorizedError('Agent user not found')
    }
    return $apis.recordAuthResponse(e, userRecord)
  } catch (err) {
    return e.unauthorizedError('Invalid credentials')
  }
})
