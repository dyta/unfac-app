import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _69b72088 = () => interopDefault(import('..\\pages\\account.vue' /* webpackChunkName: "pages_account" */))
const _f607f142 = () => interopDefault(import('..\\pages\\join.vue' /* webpackChunkName: "pages_join" */))
const _45cff534 = () => interopDefault(import('..\\pages\\manufacture\\index.vue' /* webpackChunkName: "pages_manufacture_index" */))
const _68b2fda0 = () => interopDefault(import('..\\pages\\notification.vue' /* webpackChunkName: "pages_notification" */))
const _34eac1ae = () => interopDefault(import('..\\pages\\overview.vue' /* webpackChunkName: "pages_overview" */))
const _e4da91ae = () => interopDefault(import('..\\pages\\report.vue' /* webpackChunkName: "pages_report" */))
const _e6681d50 = () => interopDefault(import('..\\pages\\request\\index.vue' /* webpackChunkName: "pages_request_index" */))
const _a6276e66 = () => interopDefault(import('..\\pages\\work-offer\\index.vue' /* webpackChunkName: "pages_work-offer_index" */))
const _30ab9201 = () => interopDefault(import('..\\pages\\manufacture\\manage.vue' /* webpackChunkName: "pages_manufacture_manage" */))
const _bb47da5a = () => interopDefault(import('..\\pages\\request\\approve.vue' /* webpackChunkName: "pages_request_approve" */))
const _60d89a96 = () => interopDefault(import('..\\pages\\setting\\application.vue' /* webpackChunkName: "pages_setting_application" */))
const _7bf71c46 = () => interopDefault(import('..\\pages\\user\\collaborators.vue' /* webpackChunkName: "pages_user_collaborators" */))
const _5a317035 = () => interopDefault(import('..\\pages\\user\\employees.vue' /* webpackChunkName: "pages_user_employees" */))
const _f4375448 = () => interopDefault(import('..\\pages\\work-offer\\add.vue' /* webpackChunkName: "pages_work-offer_add" */))
const _03d4ca04 = () => interopDefault(import('..\\pages\\work-offer\\assign.vue' /* webpackChunkName: "pages_work-offer_assign" */))
const _0a76996d = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

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
      component: _69b72088,
      name: "account"
    }, {
      path: "/join",
      component: _f607f142,
      name: "join"
    }, {
      path: "/manufacture",
      component: _45cff534,
      name: "manufacture"
    }, {
      path: "/notification",
      component: _68b2fda0,
      name: "notification"
    }, {
      path: "/overview",
      component: _34eac1ae,
      name: "overview"
    }, {
      path: "/report",
      component: _e4da91ae,
      name: "report"
    }, {
      path: "/request",
      component: _e6681d50,
      name: "request"
    }, {
      path: "/work-offer",
      component: _a6276e66,
      name: "work-offer"
    }, {
      path: "/manufacture/manage",
      component: _30ab9201,
      name: "manufacture-manage"
    }, {
      path: "/request/approve",
      component: _bb47da5a,
      name: "request-approve"
    }, {
      path: "/setting/application",
      component: _60d89a96,
      name: "setting-application"
    }, {
      path: "/user/collaborators",
      component: _7bf71c46,
      name: "user-collaborators"
    }, {
      path: "/user/employees",
      component: _5a317035,
      name: "user-employees"
    }, {
      path: "/work-offer/add",
      component: _f4375448,
      name: "work-offer-add"
    }, {
      path: "/work-offer/assign",
      component: _03d4ca04,
      name: "work-offer-assign"
    }, {
      path: "/",
      component: _0a76996d,
      name: "index"
    }],

    fallback: false
  })
}
