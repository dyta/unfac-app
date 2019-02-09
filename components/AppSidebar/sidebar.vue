<template>
  <div :class="[$style.sidebar]" v-if="auth">
    <b-card class="text-left profile">
      <div class="info">
        <b-img rounded="circle" :src="auth.photoURL" width="60"/>
      </div>

      <div class="info text">
        <p>{{user.userFullname}}</p>
        <small>{{auth.email}}</small>
        <div>
          <small>
            <fa icon="trophy"/>
            {{currentPackage ? currentPackage.name : 'Member'}}
          </small>
        </div>
      </div>
    </b-card>
    <div class="menu">
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
export default {
  name: "sidebar",
  components: {
    MenuList
  },
  data() {
    return {
      shopItems: [
        {
          name: "คำสั่งซื้อ",
          img:
            "https://firebasestorage.googleapis.com/v0/b/auntie-and-me.appspot.com/o/images%2Ficons%2Fbasket.png?alt=media&token=0087794c-7703-44b1-90c0-b4ca7f2c541f",
          path: "#"
        },
        {
          name: "การชำระเงิน",
          icon: "dollar-sign",
          color: "orange",
          path: "#"
        },
        {
          name: "การจัดส่ง",
          img:
            "https://firebasestorage.googleapis.com/v0/b/auntie-and-me.appspot.com/o/images%2Ficons%2Fbox.png?alt=media&token=5adfa62c-70ca-434b-bba7-7f5fb6623927",
          path: "#"
        }
      ],
      accountList: [
        {
          name: "พนักงาน",
          img:
            "https://firebasestorage.googleapis.com/v0/b/auntie-and-me.appspot.com/o/images%2Ficons%2Fgirl2.png?alt=media&token=0f2c2b73-5f70-4376-8367-24e20655a97f",
          path: "/employees"
        },
        {
          name: "คำขอเข้าร่วม",
          icon: "comment-medical",
          color: "orange",
          path: "#"
        }
      ],
      manufacItems: [
        {
          name: "งาน",
          img:
            "https://firebasestorage.googleapis.com/v0/b/auntie-and-me.appspot.com/o/images%2Ficons%2Fdoc.png?alt=media&token=5a4fde8a-b8a4-41cb-abb2-10afb3f38ee4",
          path: "/work-offer/overview"
        },
        {
          name: "อนุมัติคำขอ",
          icon: "check",
          color: "teal",
          path: "#"
        },
        {
          name: "เสนองาน",
          icon: "hands-helping",
          path: "#"
        },
        {
          name: "การผลิต",
          img:
            "https://firebasestorage.googleapis.com/v0/b/auntie-and-me.appspot.com/o/images%2Ficons%2Fprojector.png?alt=media&token=aae71cbe-4de4-41b0-9ac0-e2005f871416",
          path: "#"
        },
        {
          name: "รับสินค้า",
          icon: "hand-holding-heart",
          color: "green",
          path: "#"
        }

        // {
        //   name: "วัตถุดิบ",
        //   img:
        //     "https://firebasestorage.googleapis.com/v0/b/auntie-and-me.appspot.com/o/images%2Ficons%2Fdiamond.png?alt=media&token=6ef0e104-5262-41ff-93cb-f674f57ae2eb",
        //   path: "#"
        // },
        // {
        //   name: "รูปแบบปฏิทิน",
        //   img:
        //     "https://firebasestorage.googleapis.com/v0/b/auntie-and-me.appspot.com/o/images%2Ficons%2Fcalendar.png?alt=media&token=8f135a27-7ddb-4b0b-8b34-b5742493d7fd",
        //   path: "#"
        // }
      ]
    };
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
    isLoaded() {
      return this.$store.state.loading;
    },
    currentPackage() {
      return this.$store.state.package;
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

      setTimeout(async () => {
        await this.$store.dispatch("signOut");
        this.$router.go({ path: "/" });
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  border-radius: 0;
  border-width: 0 0 1px 0;
  background-color: var(--dark);
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
  border-right: 1px solid var(--border);
  background-color: var(--light);
}

@media (min-width: 854px) {
  .sidebar {
    width: 360px;
    max-width: 90vw;
    border-right: 1px solid var(--border);
  }
}
</style>