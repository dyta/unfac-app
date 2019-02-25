<template>
  <div>
    <b-jumbotron
      fluid
      header="Dashboard"
      lead="Workforce management system for non-routine on Line Application."
      class="jumbotron-special m-0"
    ></b-jumbotron>
    <b-container class="p-0">
      <b-row>
        <b-col md="8">
          <b-card class="p-sicky no-radius-bt top">
            <b-row class="pb-2">
              <b-col cols="6" md="6" lg="3" class="list-statistic">
                <h6 class="m-0">อยู่ระหว่างการผลิต*</h6>
                <p class="m-0 statistics">
                  N/a
                  <small>/N/a</small>
                </p>
              </b-col>
              <b-col cols="6" md="6" lg="3" class="list-statistic">
                <h6 class="m-0">รอการตรวจสอบ*</h6>
                <p class="m-0 statistics">
                  N/a
                  <small>/N/a</small>
                </p>
              </b-col>
              <b-col cols="6" md="6" lg="3" class="list-statistic">
                <h6 class="m-0">งานที่เปิดรับปัจจุบัน*</h6>
                <p class="m-0 statistics">
                  N/a
                  <small>/N/a</small>
                </p>
              </b-col>
              <b-col cols="6" md="6" lg="3" class="list-statistic">
                <h6 class="m-0">รายการคำขอ*</h6>
                <p class="m-0 statistics">
                  N/a
                  <small>/N/a</small>
                </p>
              </b-col>
            </b-row>

            <small class="font-size-10">*หน่วย: รายการ</small>
          </b-card>
          <b-card class="no-radius no-bdt" bg-variant="light">
            <h5>
              <fa icon="calendar-alt" class="mr-2"/>ภาพรวมตารางงาน
            </h5>
            <small>คำอธิบายของสี:
              <b-badge variant="warning">Paused</b-badge>
              <b-badge variant="danger">Urgently</b-badge>
              <b-badge variant="primary">Enabled</b-badge>
              <b-badge variant="secondary">Disabled</b-badge>
              <b-badge variant="success">Completed</b-badge>
              <b-badge variant="light">Canceled</b-badge>
            </small>
            <hr>
            <no-ssr placeholder="กำลังโหลดตารางงาน...">
              <full-calendar :events="events" :config="config"/>
            </no-ssr>
          </b-card>
        </b-col>
        <b-col md="4">
          <b-card class="p-sicky no-radius-bt">
            <h6>กิจกรรมที่เกิดขึ้นล่าสุด</h6>
            <hr>
            <loading
              :active.sync="this.isActivity"
              :can-cancel="false"
              :is-full-page="false"
              :height="34"
            ></loading>
            <div v-if="activities.length > 0">
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
            </div>
            <div v-else class="text-center">
              <small>ไม่มีกิจกรรมที่เกิดขึ้นในช่วงเวลานี้</small>
            </div>
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
      isActivity: false,
      events: [],
      config: {
        droppable: false,
        editable: false,
        eventBorderColor: "rgba(0,0,0,0)",
        eventTextColor: "white",
        themeSystem: "bootstrap4",
        defaultView: "month",
        allDayText: "ทั้งวัน",
        aspectRatio: 1.5,
        header: {
          left: "title",
          center: "",
          right: "today month listMonth prev,next"
        },
        noEventsMessage: "ไม่มีงานในเดือนนี้",
        buttonText: {
          today: "วันนี้",
          week: "รูปแบบสัปดาห์",
          month: "รูปแบบเดือน",
          listMonth: "รายการ",
          prev: "ก่อนหน้า",
          next: "ถัดไป"
        },
        locale: "th",
        titleFormat: "MMMM Y"
      }
    };
  },
  created() {
    this.fetchEvent();
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
        .orderBy("time", "desc")
        .limit(14)
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
    },
    async fetchEvent() {
      let self = this;
      self.events = [];
      await this.$axios
        .$get(`/v2/work/${this.$store.state.user.entId}/events`)
        .then(function(res) {
          if (res.length > 0) {
            self.events = filter.events(res);
          }
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
