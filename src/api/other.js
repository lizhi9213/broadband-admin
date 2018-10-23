import { get, post, wssget, wsspost } from './method.js'

export function getCust(keynum) {
  const data = {}
  data['keynum'] = keynum
  return get('/other/getCust/', data)
}

export function saveCust(data) {
  return post('/other/saveCust/', data)
}

export function readCust(workid) {
  const data = {}
  data['workid'] = workid
  return get('/other/readCust/', data)
}

export function callOut(phone, userid, workId) {
  const data = {}
  data['phone'] = phone
  data['userid'] = userid
  data['workId'] = workId || ''
  return wssget('/system/call/', data)
}

export function hangUp(id, comId) {
  const data = {}
  data['id'] = id
  data['comId'] = comId
  return wsspost('/system/hangUp/', data)
}
