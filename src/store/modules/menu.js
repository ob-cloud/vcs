import {
  SET_MENU_NAV_LIST,
  SET_SYS_MENU_LIST,
  UPDATE_MENU_NAV_ACTIVE_NAME,
  SET_SIDEBAR_MENU_LIST,
  UPDATE_SIDEBAR_MENU_ACTIVE_NAME
} from '../mutation-types'

import { navMenuList } from '@/router/menu'
// import routeMenuList from '@/router/modules/navlist'
// import SystemAPI from '@/api/system'
// import {cacher} from '@/common/cache'

// const mixinMenu = () => {
//   navMenuList.forEach(element => {
//     const cur = routeMenuList.find(item => item.path === element.path)
//     if (cur) element.meta = cur.meta
//   })
// }
// const getBtnPrivilege = privilege => {
//   if (privilege && privilege.length === 1) return privilege[0].privilege
//   return Array.from(privilege).reduce((item, next, index) => {
//     if (index === 1) {
//       item = item.privilege
//     }
//     return item.concat(next.privilege)
//   })
// }

const menu = {
  state: {
    menuNavActiveName: '',
    navbarMenus: [],
    sysMenuList: [],
    sidebarMenuActiveName: '',
    sidebarMenuList: []
  },
  mutations: {
    [SET_MENU_NAV_LIST] (state, navbarMenus) {
      state.navbarMenus = navbarMenus
    },
    [SET_SYS_MENU_LIST] (state, sysMenuList) {
      state.sysMenuList = sysMenuList
    },
    [UPDATE_MENU_NAV_ACTIVE_NAME] (state, menuNavActiveName) {
      state.menuNavActiveName = menuNavActiveName
    },
    [SET_SIDEBAR_MENU_LIST] (state, sidebarMenuList) {
      state.sidebarMenuList = sidebarMenuList
    },
    [UPDATE_SIDEBAR_MENU_ACTIVE_NAME] (state, sidebarMenuActiveName) {
      state.sidebarMenuActiveName = sidebarMenuActiveName
    }
  },
  actions: {
    generateNavibarMenu ({ commit }) {
      return new Promise(resolve => {
        commit('SET_MENU_NAV_LIST', navMenuList)
        resolve(navMenuList)
      })
      // return new Promise((resolve, reject) => {
      //   SystemAPI.getUserPrivilege().then(res => {
      //     if (res.status !== 0) return reject()
      //     const privileges = res.data.records.privilege
      //     const buttonPrivileges = getBtnPrivilege(privileges)

      //     mixinMenu()
      //     const priMenuList = navMenuList.filter(item => {
      //       return privileges.find(pri => pri.id === item.id)
      //     })
      //     const allBtnPrivileges = buttonPrivileges
      //     commit('SET_MENU_NAV_LIST', priMenuList)
      //     const path = location.href.slice(location.href.indexOf('#') + 1, location.href.lastIndexOf('?'))
      //     const defaultMenu = priMenuList.find(item => item.path === path) || priMenuList[0]
      //     commit('UPDATE_MENU_NAV_ACTIVE_NAME', defaultMenu.path)
      //     cacher.setStrategy('localStorage').set('permission', JSON.stringify(allBtnPrivileges))
      //     resolve(priMenuList)
      //   }).catch(err => {
      //     console.log(err)
      //     reject()
      //   })
      // })
    },
    // generatesystemMenu ({ commit }) {
    //   return new Promise(resolve => {
    //     commit('SET_SYS_MENU_LIST', systemtMenus)
    //     resolve(systemtMenus)
    //   })
    // },
    updateMenuNavActiveName ({ commit }, activeName) {
      commit('UPDATE_MENU_NAV_ACTIVE_NAME', activeName)
    }
  }
}

export default menu
