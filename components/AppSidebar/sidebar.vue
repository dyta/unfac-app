<template>
  <div :class="[$style.sidebar]" v-if="user || !homeDisabled">
    <b-card class="text-left profile">
      <div class="info">
        <b-img rounded="circle" :src="user.userPictureUrl" width="60" :alt="user.displayName"/>
      </div>

      <div class="info text">
        <p>{{user.userFullname}}</p>
        <small>{{user.userEmail}}</small>
        <div>
          <small>
            <fa icon="trophy"/>
            {{currentPackage ? currentPackage.name : 'Member'}}
          </small>
        </div>
      </div>
    </b-card>
    <div class="menu" v-if="user.entId">
      <menu-list header="Retail" :list="shopItems"/>
      <menu-list header="Manufacture" :list="manufacItems"/>
      <menu-list header="Account" :list="accountList"/>
      <b-row class="pl-4 pt-2 mr-0 title-menu-list">
        <h6 class="sidebar-header ml-2">General</h6>
      </b-row>
      <b-row class="mx-4">
        <b-col cols="4" class="small-device pt-3 pb-2">
          <div class="menu-list" @click="onClickSignOut">
            <div>
              <fa icon="power-off" size="2x" color="grey"/>
            </div>
            <div class="mt-2">
              <small>ออกจากระบบ</small>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { TweenMax, Power4 } from "gsap";
import MenuList from "./MenuList";
import firebase from "./../../configs/firebase.sdk.js";
export default {
  name: "sidebar",
  components: {
    MenuList
  },
  data() {
    return {};
  },
  mounted() {
    TweenMax.set(this.$el, {
      x: -this.$el.offsetWidth
    });
  },
  computed: {
    open() {
      return this.$store.state.sidebarOpen;
    },
    auth() {
      return this.$store.state.auth;
    },
    user() {
      return this.$store.state.user;
    },
    shopItems() {
      return this.$store.state.shopItems;
    },
    accountList() {
      return this.$store.state.accountList;
    },
    manufacItems() {
      return this.$store.state.manufacItems;
    },
    isLoaded() {
      return this.$store.state.loading;
    },
    currentPackage() {
      return this.$store.state.package;
    },
    homeDisabled() {
      return this.$nuxt.$route.name === "overview";
    }
  },
  watch: {
    open: function(open) {
      const dX = open ? 0 : -this.$el.offsetWidth;
      TweenMax.to(this.$el, 1, {
        x: dX,
        ease: Power4.easeOut
      });
    }
  },
  methods: {
    async onClickSignOut() {
      this.$store.commit("setLoading", true);
      firebase.auth().signOut();
      this.$store.dispatch("signOut");
      setTimeout(() => {
        this.$router.go({ path: "/" });
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  border-radius: 0;
  background-color: var(--bg-3-color);
  border: 0;
}

.menu {
  height: 100%;
  max-height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.menu div:last-child {
  margin-bottom: 2rem;
}
</style>

<style module>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  max-width: 78vw;
  z-index: 1031;
  border-right: 1px solid var(--gray-light);
  background-color: var(--light);
}

@media (min-width: 854px) {
  .sidebar {
    width: 360px;
    max-width: 90vw;
    border-right: 1px solid var(--gray-light);
  }
}
</style>