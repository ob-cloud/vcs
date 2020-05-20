/*
 * @Author: eamiear
 * @Date: 2019-02-06 21:34:24
 * @Last Modified by: eamiear
 * @Last Modified time: 2020-05-20 16:24:48
 */

import {request} from '@/common/request'
import qs from 'qs'

const SystemAPI = {
  login (username, password) {
    return request.post('/oauth/token', qs.stringify({password, username, grant_type: 'password'}), {
      Authorization: 'Basic d2ViQXBwOndlYkFwcA==',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'cache-control': 'no-cache'
    })
  },
  logout (accessToken) {
    return request.delete('/oauth/token/' + accessToken)
  },
  addRoom (roomList) {
    return request.post('/consumer/PmsForDur/addLocation', {
      roomList
    })
  },
  delRoom (location) {
    return request.delete('/consumer/PmsForDur/delLocation', {
      location
    })
  },
  getRoomList (params) {
    return request.get('/consumer/PmsForDur/getLocation', params)
  },
  getOboxByRoom (location) {
    return request.get('/consumer/PmsForDur/location/getObox', {
      location
    })
  },
  getOboxByUser () {
    return request.get('/consumer/PmsForDur/getObox', {
      pageNo: 1,
      pageSize: 10000
    })
  },
  bindObox (location, serialIds) {
    return request.post('/consumer/PmsForDur/bindObox', {
      location,
      serialIds
    })
  },
  unbindObox (serialId) {
    return request.delete('/consumer/PmsForDur/unLinkObox', {
      serialId
    })
  },
  getWifiByRoom (location) {
    return request.get('/consumer/PmsForDur/location/getWifi', {
      location
    })
  },
  getWifiByUser () {
    return request.get('/consumer/PmsForDur/getWifi', {
      pageNo: 1,
      pageSize: 10000
    })
  },
  bindWifi (location, serialIds) {
    return request.post('/consumer/PmsForDur/bindWifi', {
      location,
      serialIds
    })
  },
  unbindWifi (serialId) {
    return request.delete('/consumer/PmsForDur/unLinkWifi', {
      serialId
    })
  },
  getSceneByRoom () {
    return request.get('/consumer/PmsForDur/location/getScene', {
      pageNo: 1,
      pageSize: 10000
    })
  },
  getSceneByUser (word) {
    return request.get('/consumer/PmsForDur/getScene', {
      word,
      pageNo: 1,
      pageSize: 10000
    })
  },
  bindScene (location, serialIds) {
    return request.post('/consumer/PmsForDur/bindScene', {
      location,
      serialIds
    })
  },
  unbindScene (sceneNumber) {
    return request.delete('/consumer/PmsForDur/unLinkScene', {
      sceneNumber
    })
  },
  bindXiaodu (location, serialIds) {
    return request.post('/consumer/PmsForDur/bindDure', {
      location,
      serialIds
    })
  },
  unbindXiaodu (serialId) {
    return request.delete('/consumer/PmsForDur/unLinkDure', {
      serialId
    })
  },
  getVersionList (firmware = {}) {
    return request.post('/consumer/image/getFirmWare', {
      ...firmware
    })
  },
  deleteVersion (id) {
    return request.post('/consumer/image/deleteFirmWare', {
      id
    })
  }
}
export default SystemAPI
