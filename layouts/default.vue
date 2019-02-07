<template>
  <div v-if="user && user.entId">
    <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true" :height="34"></loading>
    <sidebar/>

    <sidebar-toggle/>

    <b-navbar toggleable="md" type="light" fixed="top" class="navbar-light bg-light">
      <!-- Right aligned nav items -->
      <b-navbar-nav class="nav-side ml-auto">
        <div class="scrolling-wrapper">
          <b-button
            variant="link"
            class="list"
            @click="()=>$router.push('/overview')"
            v-if="user.entId"
          >Dashboard</b-button>
          <b-button variant="link" class="list" @click="handleClick" v-if="user.entId">Management</b-button>
          <b-button variant="link" class="list" @click="()=>$router.push('/account')">Account</b-button>
          <b-button
            variant="link"
            class="list"
            @click="()=>$router.push('/setting/application')"
            v-if="user.entId"
          >Application</b-button>
          <b-button variant="link" class="list signout" @click="onClickSignOut">Sign out</b-button>
        </div>
      </b-navbar-nav>
    </b-navbar>
    <div class="content-margin-top">
      <nuxt-child/>
    </div>
  </div>
</template>

<script>
import Sidebar from "./../components/AppSidebar/sidebar";
import SidebarToggle from "./../components/AppSidebar/sidebarToggle";
export default {
  components: {
    Sidebar,
    SidebarToggle
  },
  computed: {
    auth() {
      let auth = this.$store.state.auth;
      return auth;
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
    open() {
      return this.$store.state.sidebarOpen;
    }
  },
  methods: {
    handleClick() {
      this.$store.dispatch("toggleSidebar");
    },
    onClickSignOut() {
      this.$store.dispatch("loaded");
      setTimeout(() => {
        this.$store.dispatch("signOut");
        this.$router.go({ path: "/" });
      }, 1000);
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

  .list {
    display: inline-block;
    padding: 1rem;
    padding-bottom: 1.3rem;
    transition: 300ms ease-in-out;
  }
}
</style>

