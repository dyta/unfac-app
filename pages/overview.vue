<template>
  <div>
    <b-jumbotron
      fluid
      header="Dashboard"
      lead="Workforce management system for non-routine on Line Application."
      class="jumbotron-special"
    ></b-jumbotron>
    <b-container class="p-0">
      <b-row>
        <b-col md="8">
          <div class="p-sicky no-radius-bt">
            <b-card>
              <b-row class="pb-2">
                <b-col md="6" lg="3" class="list-statistic">
                  <h6 class="m-0">อยู่ระหว่างการผลิต*</h6>
                  <p class="m-0 statistics">
                    20
                    <small>/20</small>
                  </p>
                </b-col>
                <b-col md="6" lg="3" class="list-statistic">
                  <h6 class="m-0">รอการตรวจสอบ*</h6>
                  <p class="m-0 statistics">
                    20
                    <small>/20</small>
                  </p>
                </b-col>
                <b-col md="6" lg="3" class="list-statistic">
                  <h6 class="m-0">งานที่เปิดรับปัจจุบัน*</h6>
                  <p class="m-0 statistics">
                    20
                    <small>/20</small>
                  </p>
                </b-col>
                <b-col md="6" lg="3" class="list-statistic">
                  <h6 class="m-0">รายการคำขอ*</h6>
                  <p class="m-0 statistics">
                    20
                    <small>/20</small>
                  </p>
                </b-col>
              </b-row>

              <small class="font-size-10">*หน่วย: รายการ</small>
            </b-card>
            <b-card class="no-radius no-bdt" bg-variant="light">
              <menu-list header="เมนูลัด: Retail" :list="shopItems"/>
              <menu-list header="เมนูลัด: Manufacture" :list="manufacItems"/>
              <menu-list header="เมนูลัด: Account" :list="accountList"/>
            </b-card>
          </div>
        </b-col>
        <b-col md="4">
          <b-card>
            <h6>กิจกรรมที่เกิดขึ้นล่าสุด</h6>
            <hr>
            <loading
              :active.sync="this.isActivity"
              :can-cancel="false"
              :is-full-page="false"
              :height="34"
            ></loading>
            <b-media
              v-for="(item, index) in activities"
              :key="index"
              left-align
              vertical-align="top"
              style="line-height: 14px;"
              class="pb-2"
            >
              <b-img
                slot="aside"
                :blank="item.image ? false : true"
                :blank-color="item.image ? null : item.color"
                width="40"
                height="40"
                rounded="circle"
                :src="item.image"
                alt="placeholder"
              />
              <h6 class="m-0 font-size-12 h6-normal">{{item.title}}</h6>
              <small class="mb-0 sm-normal">เมื่อ {{$moment(item.time).fromNow()}}</small>
            </b-media>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { activity } from "./../configs/firebase.sdk.js";
import MenuList from "./../components/AppSidebar/MenuListInDashboard";
import filter from "./../scripts/Filters.js";
export default {
  layout: "default",
  components: {
    MenuList
  },
  head() {
    return {
      title: "Dashboard"
    };
  },
  data() {
    return {
      items: [],
      activities: [],
      isActivity: false
    };
  },
  created() {
    setInterval(() => {}, 15000);
    this.activity();
  },
  computed: {
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
    }
  },
  methods: {
    async activity() {
      let self = this;
      activity
        .collection(`${this.user.entId}`)
        .onSnapshot(function(querySnapshot) {
          self.isActivity = true;
          self.activities, (self.items = []);
          querySnapshot.forEach(function(doc) {
            self.items.push(doc.data());
          });
          self.activities = filter.sortByActivity(self.items);
          setTimeout(() => {
            self.isActivity = false;
          }, 1000);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.display-3 {
  font-size: 2rem !important;
}
</style>
