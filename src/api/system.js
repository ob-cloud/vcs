/*
 * @Author: eamiear
 * @Date: 2019-02-06 21:34:24
 * @Last Modified by: eamiear
 * @Last Modified time: 2020-05-26 10:24:19
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
  getHotelName (accessToken) {
    return request.get('/consumer/PmsForDur/getHotelName', {
      'access_token': accessToken
    })
  },
  editHotelName (hotelName) {
    return request.put('/consumer/PmsForDur/editHotelName', {
      hotelName
    })
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
  getSceneByRoom (location) {
    return request.get('/consumer/PmsForDur/location/getScene', {
      location
    })
  },
  getSceneByUser (word) {
    return request.get('/consumer/PmsForDur/getScene', {
      word,
      pageNo: 1,
      pageSize: 10000
    })
  },
  bindScene (location, sceneNumbers) {
    return request.post('/consumer/PmsForDur/bindScene', {
      location,
      sceneNumbers
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
  getSwitchSerialsTree () {
    return request.get('/consumer/PmsForDur/location/getSocket')
  },
  getSwitchSerials (pageNo = 1, pageSize = 10) {
    return request.get('/consumer/PmsForDur/getSocketDevice', {
      pageNo,
      pageSize
    })
  },
  getSubSwitch (serialId) {
    return request.get('/consumer/PmsForDur/getSocket', {
      serialId
    })
  },
  editSubSwitch (id, serialId, name) {
    return request.put('/consumer/PmsForDur/editSocket', {
      id,
      serialId,
      name
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
