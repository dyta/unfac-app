<template>
  <div v-if="user && user.entId" id="container">
    <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true" :height="34"></loading>
    <sidebar/>

    <div id="header">
      <b-navbar toggleable="md" type="light" fixed="top" class="navbar-light bg-light">
        <sidebar-toggle/>
        <b-container>
          <b-col sm="4" md="6" class="p-0 m-0">
            <b-navbar-brand tag="h1" @click="handleClick" class="logo-nav mb-0">UNFAC
              <div class="small-logo">
                <small>Management</small>
                <small>Console</small>
              </div>
            </b-navbar-brand>
          </b-col>
          <b-col sm="8" md="6" class="p-0 m-0" style="display: flex;">
            <b-navbar-nav class="nav-side ml-auto">
              <div class="scrolling-wrapper">
                <b-button
                  variant="link"
                  class="list"
                  @click="()=>{$router.push('/overview'), autoToggle()}"
                  v-if="user.entId"
                >แดชบอร์ด</b-button>
                <b-button variant="link" class="list" color="blue" @click="handleClick">คอลโซล</b-button>
                <b-button
                  variant="link"
                  class="list"
                  @click="()=>{$router.push('/account'), autoToggle()}"
                >บัญชี</b-button>
                <b-button
                  variant="link"
                  class="list"
                  @click="()=>{$router.push('/setting/application'), autoToggle()}"
                  v-if="user.entId"
                >ตั้งค่าแอปพลิเคชัน</b-button>
              </div>
            </b-navbar-nav>
          </b-col>
        </b-container>
      </b-navbar>
    </div>
    <div id="body">
      <div class="content-margin-top">
        <nuxt-child/>
      </div>
    </div>
    <div id="footer">
      <div class="container copy-right-ele border-top">
        <small>&copy; 2019 Unfac.co
          <b-link class="ml-2">หน้าหลัก</b-link>
          <b-link class="ml-2">ข้อกำหนดและเงื่อนไข</b-link>
          <b-link class="ml-2">ติดต่อเรา</b-link>
        </small>
      </div>
    </div>
  </div>
</template>

<script>
import Firebase from "./../configs/firebase.sdk.js";
import Sidebar from "./../components/AppSidebar/sidebar";
import SidebarToggle from "./../components/AppSidebar/sidebarToggle";
export default {
  transition: "bounce",
  components: {
    Sidebar,
    SidebarToggle
  },
  data() {
    return {};
  },
  created() {
    this.checkAuth();
  },
  computed: {
    auth() {
      return this.$store.state.auth;
    },

    user() {
      let user = this.$store.state.user;
      if (user && !user.entId) {
        this.$router.push("/join");
      } else {
        return this.$store.state.user;
      }
    },
    isLoading() {
      return this.$store.state.loading;
    },
    isLoadingSrc() {
      return this.$store.state.source;
    },
    open() {
      return this.$store.state.sidebarOpen;
    },
    homeDisabled() {
      return this.$nuxt.$route.name === "overview";
    }
  },
  methods: {
    checkAuth() {
      let self = this;
      Firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          self.$store.commit("setLoading", false);
        } else {
          self.$store.dispatch("signInWithToken", self.$store.state.token);
          self.$store.commit("setLoading", false);
        }
      });
    },

    handleClick() {
      this.$store.dispatch("toggleSidebar");
    },
    autoToggle() {
      if (this.open) {
        this.$store.dispatch("toggleSidebar");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.nav-side {
  width: 100%;
  transition: 300ms ease-in-out;
}
.scrolling-wrapper {
  -webkit-overflow-scrolling: touch;
}
.scrolling-wrapper {
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  text-align: center;
  .list {
    display: inline-block;
    padding: 1rem;
    padding-bottom: 1.3rem;
    transition: 300ms ease-in-out;
  }
}
</style>

