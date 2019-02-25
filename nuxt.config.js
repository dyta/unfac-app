import bodyParser from "body-parser";
import session from "express-session";
require("dotenv").config();

const pkg = require('./package')


module.exports = {
  mode: 'universal',

  head: {
    title: 'Management Console - Unfac.co',

    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        property: "og:image",
        content: "/meta-content.png"
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }, {
      rel: "stylesheet",
      href: "//fonts.googleapis.com/css?family=Sarabun&subset=thai"
    }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: false,

  /*
   ** Global CSS
   */
  css: [{
    src: "~/assets/customize.scss",
    lang: "scss"
  }],

  // PWA -- Workbox Module
  manifest: {
    name: "Unfac",
    short_name: "Unfac",
    description: "Unfac built with Nuxt.js",
    theme_color: "#56a7ff"
  },
  workbox: {
    runtimeCaching: [{
        urlPattern: 'https://fonts.googleapis.com/.*',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: {
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: 'https://fonts.gstatic.com/.*',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: {
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }
    ]
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["~/plugins/vue-font-awesome", "~/plugins/vue-kanban", "~/plugins/loading-overlay", {
    src: "~/plugins/vue-th-postal",
    ssr: false
  }, {
    src: '~/plugins/vue-date-picker',
    ssr: false
  }, {
    src: '~/plugins/jquery',
    ssr: false
  }],

  router: {
    middleware: 'router-auth'
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    "@nuxtjs/dotenv",
    '@nuxtjs/pwa',
    '@nuxtjs/toast',
    ['@nuxtjs/moment', {
      locales: ['th'],
      defaultLocale: 'th'
    }],
    [
      "vue-sweetalert2/nuxt",
      {
        confirmButtonColor: "#70b5ff",
        cancelButtonColor: "#dc3545",
        cancelButtonText: 'ยกเลิก'
      }
    ]
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    baseURL: process.env.API_SERVICE
  },

  serverMiddleware: [
    // body-parser middleware
    bodyParser.json(),
    // Api middleware
    session({
      secret: process.env.LINE_LOGIN_CHANNEL_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 3
      }
    }),
    // We add /api/login & /api/logout routes
    "~/api"
  ],

  /*
   ** Build configuration
   */
  build: {

  }
}
