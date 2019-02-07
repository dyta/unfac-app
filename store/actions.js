import {
  auth
} from '../configs/firebase.sdk'
import axios from 'axios'
import convert from "./../scripts/ConvertText";
export default {
  async nuxtServerInit({
    commit,
    dispatch
  }, {
    req,
    $axios
  }) {
    // ค่าจาก line
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
        await $axios.$post(`${process.env.API_SERVICE}/v2/account/token`, req.session.auth).then(r => {
          if (r) auth.signInWithCustomToken(r)
        })
      }
      const packageUser = await $axios.$get(`${process.env.API_SERVICE}/v2/account/package/${req.session.user.entId}`)

      commit("setPackage", {
        name: convert.package(packageUser),
        key: packageUser
      })

      dispatch("userListener");
    }
  },
  async signInWithToken({
      commit,
      state,
      dispatch
    },
    payload) {
    return new Promise(async (resolve, reject) => {
      commit("setLoading")
      auth.signInWithCustomToken(payload);

      resolve()
    })

  },
  userListener({
    commit
  }) {
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged(auth => {
        if (auth) {
          commit('setLoading')
          return resolve(commit('setAuth', auth))
        }
        return resolve()
      })
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
    try {
      auth.signOut().then(function (e) {
        console.log('e: ', e);
        // Sign-out successful.
      }).catch(function (error) {
        console.log('error: ', error);
        // An error happened.
      });
      await axios.post('/user/logout')
      commit('setUser', null)
      commit('setAuth', null)
      commit('setLine', null)

    } catch (error) {
      console.log('error: ', error);

    }
  }
};
