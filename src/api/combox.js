import { get } from './method.js'

export function getClassCombo(type, keynum) {
  // 获取代维公司信息
  type = type || 'name'
  const data = {}
  data['keyWord'] = keynum
  return get('/class/combox/' + type + '/', data)
}

export function getGroupCombo(type, code, keynum) {
  // 获取代维班组信息
  const data = {}
  data['keynum'] = keynum
  data['Code'] = code
  return get('/class/group/combox/' + type + '/', data)
}

export function getCommunityCombo(keyWord, num) {
  // 获取小区信息
  const data = {}
  data['keyWord'] = keyWord
  num = num || 0
  return get('/area/community/combox/' + num + '/', data)
}

export function getCommunityDetail(code) {
  // 获取小区信息
  const data = {}
  return get('/area/community/' + code + '/', data)
}
