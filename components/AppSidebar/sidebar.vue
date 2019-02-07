<template>
  <div :class="$style.sidebar" v-if="auth">
    <b-card class="text-left profile">
      <div class="info">
        <b-img rounded="circle" :src="auth.photoURL" width="60"/>
      </div>

      <div class="info text">
        <p>{{user.empFullname}}</p>
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
          name: "Orders",
          img:
            "https://firebasestorage.googleapis.com/v0/b/auntie-and-me.appspot.com/o/images%2Ficons%2Fbasket.png?alt=media&token=0087794c-7703-44b1-90c0-b4ca7f2c541f",
          path: "/Shop/OrderLists"
        },
        {
          name: "Payment",
          icon: "dollar-sign",
          color: "orange",
          path: "/Shop/PaymentLists"
        },
        {
          name: "Shipping",
          img:
            "https://firebasestorage.googleapis.com/v0/b/auntie-and-me.appspot.com/o/images%2Ficons%2Fbox.png?alt=media&token=5adfa62c-70ca-434b-bba7-7f5fb6623927",
          path: "/Shop/Shipping"
        }
      ],
      accountList: [
        {
          name: "Employees",
          img:
            "https://firebasestorage.googleapis.com/v0/b/auntie-and-me.appspot.com/o/images%2Ficons%2Fbox.png?alt=media&token=5adfa62c-70ca-434b-bba7-7f5fb6623927",
          path: "/employees"
        }
      ],
      manufacItems: [
        {
          name: "Work Offer",
          img:
            "https://firebasestorage.googleapis.com/v0/b/auntie-and-me.appspot.com/o/images%2Ficons%2Fdoc.png?alt=media&token=5a4fde8a-b8a4-41cb-abb2-10afb3f38ee4",
          path: "/work-offer/overview"
        },
        {
          name: "Approve",
          icon: "check",
          color: "teal",
          path: "/Manufacture/Work/Request"
        },
        {
          name: "Manufacture",
          img:
            "https://firebasestorage.googleapis.com/v0/b/auntie-and-me.appspot.com/o/images%2Ficons%2Fprojector.png?alt=media&token=aae71cbe-4de4-41b0-9ac0-e2005f871416",
          path: "#"
        },

        {
          name: "Receive",
          icon: "hand-holding-heart",
          color: "green",
          path: "#"
        },

        {
          name: "Assign Work",
          icon: "hands-helping",
          path: "#"
        },
        {
          name: "Calendar",
          img:
            "https://firebasestorage.googleapis.com/v0/b/auntie-and-me.appspot.com/o/images%2Ficons%2Fcalendar.png?alt=media&token=8f135a27-7ddb-4b0b-8b34-b5742493d7fd",
          path: "#"
        },
        {
          name: "Material",
          img:
            "https://firebasestorage.googleapis.com/v0/b/auntie-and-me.appspot.com/o/images%2Ficons%2Fdiamond.png?alt=media&token=6ef0e104-5262-41ff-93cb-f674f57ae2eb",
          path: "#"
        }
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
  margin-bottom: 8rem;
}
</style>

<style module>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  max-width: 100vw;
  z-index: 1031;
  background-color: var(--light);
}

@media (min-width: 640px) {
  .sidebar {
    width: 360px;
    max-width: 90vw;
    border-right: 1px solid var(--border);
  }
}
</style>