import bodyParser from "body-parser";
import session from "express-session";
require("dotenv").config();

const pkg = require('./package')


module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
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
      href: "//fonts.googleapis.com/css?family=Open+Sans|Sarabun&amp;subset=thai"
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

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["~/plugins/vue-font-awesome", "~/plugins/vue-kanban", "~/plugins/loading-overlay", {
    src: "~/plugins/vue-th-postal",
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
    ['@nuxtjs/moment', ['th']],
    [
      "vue-sweetalert2/nuxt",
      {
        confirmButtonColor: "#20c997",
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
    /*
     ** Run ESLint on save
     */
    vendor: ["axios"],
    extend(config, {
      isDev,
      isClient
    }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          // loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
  }
}
