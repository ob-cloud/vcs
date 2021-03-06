/*
 * @Author: eamiear
 * @Date: 2019-02-06 21:24:22
 * @Last Modified by: eamiear
 * @Last Modified time: 2020-05-21 15:55:10
 */

export default [
  {
    name: '/system/room.html',
    path: '/system/room.html',
    desc: '房间管理',
    meta: {title: 'room'},
    component: () => import('views/system/roomlist.vue')
  }, {
    name: '/system/switcher.html',
    path: '/system/switcher.html',
    desc: '开关管理',
    meta: {title: 'switcher'},
    component: () => import('views/system/switcher.vue')
  }
]
