import {
  auth,
  firebase
} from '../configs/firebase.sdk'
import axios from 'axios'
import convert from "./../scripts/ConvertText";
export default {
  async nuxtServerInit({
    commit,
    state,
    dispatch
  }, {
    req,
    $axios
  }) {

    commit('setLine', req.session.auth)
    if (!req.session.user && (req.session && req.session.auth)) {
      const exist = await $axios.$get(`${process.env.API_SERVICE}/v2/account/_/${req.session.auth.uid}`)
      if (exist.exists) {
        // ถ้ามี user ในระบบ
        const response = await $axios.$get(`${process.env.API_SERVICE}/v2/account/${req.session.auth.uid}`)
        commit('setUser', response[0])
        req.session.user = response[0]
      }
    }

    if (req.session.user && req.session && req.session.auth) {

      const response = await $axios.$get(`${process.env.API_SERVICE}/v2/account/${req.session.auth.uid}`)
      commit('setUser', response[0])
      req.session.user = response[0]

      const newObj = Object.assign({}, req.session.auth);
      const merge = Object.assign(newObj, new Object(req.session.user))
      // create to auth
      const createUser = await $axios.$post(`${process.env.API_SERVICE}/v2/account/auth`, merge)
      if (createUser) {
        await auth.onAuthStateChanged(async user => {
          if (user) {
            commit('setLoading', false)
            commit('setAuth', user)
          } else {
            const token = await $axios.$post(`${process.env.API_SERVICE}/v2/account/token`, req.session.auth)
            await auth.signInWithCustomToken(token)
            commit('setLoading', false)
          }
        })
      }
      const packageUser = await $axios.$get(`${process.env.API_SERVICE}/v2/account/package/${req.session.user.entId}`)

      commit("setPackage", {
        name: convert.package(packageUser),
        key: packageUser
      })

    }

  },
  async signInWithToken({
      commit,
      state,
      dispatch
    },
    payload) {
    return new Promise(async (resolve, reject) => {
      auth.signInWithCustomToken(payload);
      auth.onAuthStateChanged(user => {
        if (user) {
          commit('setLoading', false)
          commit('setAuth', user)
        }
      })
      resolve()
    })

  },
  toggleSidebar({
    commit,
    state
  }) {
    commit('TOGGLE_SIDEBAR')
  },
  loaded({
    commit,
    state
  }) {
    commit('setLoading')
  },
  sourceLoaded({
      commit,
      state
    },
    payload
  ) {
    if (payload) {
      commit('setSource', payload)
    } else {
      setTimeout(() => {
        commit('setSource', payload)
      }, 1000);
    }
  },
  async signOut({
    commit
  }) {
    auth.signOut()
    axios.post('/user/logout')
    commit('setUser', null)
    commit('setAuth', null)
    commit('setLine', null)
  }
};
