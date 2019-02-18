import Vue from 'vue'

import '..\\node_modules\\bootstrap\\dist\\css\\bootstrap.css'

import '..\\assets\\customize.scss'

import _77180f1e from '..\\layouts\\blank.vue'
import _6f6c098b from '..\\layouts\\default.vue'
import _ee708084 from '..\\layouts\\single.vue'

const layouts = { "_blank": _77180f1e,"_default": _6f6c098b,"_single": _ee708084 }

export default {
  head: {"title":"Management Console - Unfac.co","meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"property":"og:image","content":"\u002Fmeta-content.png"},{"hid":"description","name":"description","content":"Workforce management system for non-routine on Line Application."},{"hid":"mobile-web-app-capable","name":"mobile-web-app-capable","content":"yes"},{"hid":"apple-mobile-web-app-title","name":"apple-mobile-web-app-title","content":"Unfac"},{"hid":"author","name":"author","content":"K. Nattawut"},{"hid":"theme-color","name":"theme-color","content":"#56a7ff"},{"hid":"og:type","name":"og:type","property":"og:type","content":"website"},{"hid":"og:title","name":"og:title","property":"og:title","content":"Unfac"},{"hid":"og:site_name","name":"og:site_name","property":"og:site_name","content":"Unfac"},{"hid":"og:description","name":"og:description","property":"og:description","content":"Unfac built with Nuxt.js"}],"link":[{"rel":"icon","type":"image\u002Fx-icon","href":"\u002Ffavicon.ico"},{"rel":"stylesheet","href":"\u002F\u002Ffonts.googleapis.com\u002Fcss?family=Sarabun&subset=thai"},{"rel":"manifest","href":"\u002F_nuxt\u002Fmanifest.7df86511.json"}],"style":[],"script":[],"htmlAttrs":{"lang":"en"}},

  render(h, props) {
    const layoutEl = h(this.layout || 'nuxt')
    const templateEl = h('div', {
      domProps: {
        id: '__layout'
      },
      key: this.layoutName
    }, [ layoutEl ])

    const transitionEl = h('transition', {
      props: {
        name: 'layout',
        mode: 'out-in'
      },
      on: {
        beforeEnter(el) {
          // Ensure to trigger scroll event after calling scrollBehavior
          window.$nuxt.$nextTick(() => {
            window.$nuxt.$emit('triggerScroll')
          })
        }
      }
    }, [ templateEl ])

    return h('div', {
      domProps: {
        id: '__nuxt'
      }
    }, [

      transitionEl
    ])
  },
  data: () => ({
    isOnline: true,
    layout: null,
    layoutName: ''
  }),
  beforeCreate() {
    Vue.util.defineReactive(this, 'nuxt', this.$options.nuxt)
  },
  created() {
    // Add this.$nuxt in child instances
    Vue.prototype.$nuxt = this
    // add to window so we can listen when ready
    if (process.client) {
      window.$nuxt = this
      this.refreshOnlineStatus()
      // Setup the listeners
      window.addEventListener('online', this.refreshOnlineStatus)
      window.addEventListener('offline', this.refreshOnlineStatus)
    }
    // Add $nuxt.error()
    this.error = this.nuxt.error
  },

  computed: {
    isOffline() {
      return !this.isOnline
    }
  },
  methods: {
    refreshOnlineStatus() {
      if (process.client) {
        if (typeof window.navigator.onLine === 'undefined') {
          // If the browser doesn't support connection status reports
          // assume that we are online because most apps' only react
          // when they now that the connection has been interrupted
          this.isOnline = true
        } else {
          this.isOnline = window.navigator.onLine
        }
      }
    },

    setLayout(layout) {
      if(layout && typeof layout !== 'string') throw new Error('[nuxt] Avoid using non-string value as layout property.')

      if (!layout || !layouts['_' + layout]) {
        layout = 'default'
      }
      this.layoutName = layout
      this.layout = layouts['_' + layout]
      return this.layout
    },
    loadLayout(layout) {
      if (!layout || !layouts['_' + layout]) {
        layout = 'default'
      }
      return Promise.resolve(layouts['_' + layout])
    }
  },
  components: {
  }
}
