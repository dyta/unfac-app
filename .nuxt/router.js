import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _480946d5 = () => interopDefault(import('..\\pages\\account.vue' /* webpackChunkName: "pages_account" */))
const _4a934c32 = () => interopDefault(import('..\\pages\\join.vue' /* webpackChunkName: "pages_join" */))
const _20dd6501 = () => interopDefault(import('..\\pages\\overview.vue' /* webpackChunkName: "pages_overview" */))
const _0cc4eb2a = () => interopDefault(import('..\\pages\\request\\index.vue' /* webpackChunkName: "pages_request_index" */))
const _212bb326 = () => interopDefault(import('..\\pages\\request\\approve.vue' /* webpackChunkName: "pages_request_approve" */))
const _2224f188 = () => interopDefault(import('..\\pages\\setting\\application.vue' /* webpackChunkName: "pages_setting_application" */))
const _f0da0cfc = () => interopDefault(import('..\\pages\\user\\employees.vue' /* webpackChunkName: "pages_user_employees" */))
const _caec778a = () => interopDefault(import('..\\pages\\user\\request-join.vue' /* webpackChunkName: "pages_user_request-join" */))
const _997441ae = () => interopDefault(import('..\\pages\\work-offer\\add.vue' /* webpackChunkName: "pages_work-offer_add" */))
const _249f9521 = () => interopDefault(import('..\\pages\\work-offer\\overview.vue' /* webpackChunkName: "pages_work-offer_overview" */))
const _1070220c = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

Vue.use(Router)

if (process.client) {
  window.history.scrollRestoration = 'manual'
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected and scrollToTop is not explicitly disabled
  if (
    to.matched.length < 2 &&
    to.matched.every(r => r.components.default.options.scrollToTop !== false)
  ) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise((resolve) => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}

export function createRouter() {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,

    routes: [{
      path: "/account",
      component: _480946d5,
      name: "account"
    }, {
      path: "/join",
      component: _4a934c32,
      name: "join"
    }, {
      path: "/overview",
      component: _20dd6501,
      name: "overview"
    }, {
      path: "/request",
      component: _0cc4eb2a,
      name: "request"
    }, {
      path: "/request/approve",
      component: _212bb326,
      name: "request-approve"
    }, {
      path: "/setting/application",
      component: _2224f188,
      name: "setting-application"
    }, {
      path: "/user/employees",
      component: _f0da0cfc,
      name: "user-employees"
    }, {
      path: "/user/request-join",
      component: _caec778a,
      name: "user-request-join"
    }, {
      path: "/work-offer/add",
      component: _997441ae,
      name: "work-offer-add"
    }, {
      path: "/work-offer/overview",
      component: _249f9521,
      name: "work-offer-overview"
    }, {
      path: "/",
      component: _1070220c,
      name: "index"
    }],

    fallback: false
  })
}
