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
            <b-row class="pb-2" v-if="statistics">
              <b-col cols="6" md="6" lg="3" class="list-statistic">
                <h6 class="m-0">งานที่เปิดรับปัจจุบัน*</h6>
                <p class="m-0 statistics">
                  {{statistics.unit_enabled ? statistics.unit_enabled : 0}}
                  <small
                    :class="statistics.unit_enabled-statistics.unit_approved !==0 ? 'text-danger' : 'text-success'"
                  >
                    :: {{statistics.unit_enabled-statistics.unit_approved !==0 ? 'เหลือ '+ (statistics.unit_enabled-statistics.unit_approved) : 'อนุมัติครบ'}}
                    <span
                      v-if="statistics.unit_enabled-statistics.unit_approved !==0"
                      style="vertical-align: super;"
                      class="font-size-10"
                    >ชื้น</span>
                  </small>
                </p>
                <div class="text-right border-top">
                  <b-link to="/request" class="font-size-10 text-secondary">ดูทั้งหมด &rarr;</b-link>
                </div>
              </b-col>
              <b-col cols="6" md="6" lg="3" class="list-statistic">
                <h6 class="m-0">รายการคำขอ</h6>
                <p class="m-0 statistics">
                  {{statistics.w_request ? statistics.w_request :0}}
                  <small>
                    :: รวม {{statistics.unit_request ? statistics.unit_request : 0}}
                    <span
                      style="vertical-align: super;"
                      class="font-size-10"
                    >ชื้น</span>
                  </small>
                </p>
                <div class="text-right border-top">
                  <b-link to="/request" class="font-size-10 text-secondary">ดูทั้งหมด &rarr;</b-link>
                </div>
              </b-col>
              <b-col cols="6" md="6" lg="3" class="list-statistic">
                <h6 class="m-0">อยู่ระหว่างการผลิต*</h6>
                <p class="m-0 statistics">{{statistics.unit_process ? statistics.unit_process : 0}}</p>
                <div class="text-right border-top">
                  <b-link to="/manufacture" class="font-size-10 text-secondary">ดูทั้งหมด &rarr;</b-link>
                </div>
              </b-col>
              <b-col cols="6" md="6" lg="3" class="list-statistic">
                <h6 class="m-0">รอการตรวจสอบ*</h6>
                <p class="m-0 statistics">{{statistics.unit_check ? statistics.unit_check : 0}}</p>
                <div class="text-right border-top">
                  <b-link to="/manufacture" class="font-size-10 text-secondary">ดูทั้งหมด &rarr;</b-link>
                </div>
              </b-col>
            </b-row>

            <small class="font-size-10">
              *หน่วย: ชิ้น | จำนวนงานทั้งหมด
              <b>{{statistics.w_all ? statistics.w_all : 0}}</b> งาน | จำนวนงานที่เปิดรับ
              <b>{{statistics.w_enabled ? statistics.w_enabled : 0}}</b> งาน
            </small>
          </b-card>

          <b-row class="no-gutters">
            <b-col class="padded" lg="6" cols="12">
              <b-card
                class="no-radius no-bdt"
                style="height: 100%"
                bg-variant="secondary"
                text-variant="light"
              >
                <h5 class="text-warning">
                  <fa icon="clock" class="mr-2"/>กำหนดส่งในสัปดาห์นี้
                </h5>
                <hr>
                <div v-if="recentEndAtNum > 0">
                  <div v-if="recentEndAt.length > 0">
                    <b-link
                      class="text-light"
                      v-for="(item, index) in recentEndAt"
                      :key="index"
                      :to="`/request/approve?wid=${item.workId}&eid=${item.entId}`"
                    >
                      <b-media class="mb-3">
                        <b-img-lazy
                          slot="aside"
                          height="64"
                          width="64"
                          blank-color="#ddd"
                          blank-width="64"
                          blank-height="64"
                          rounded
                          :src="item.workImages ? item.workImages : 'https://i.gifer.com/RVtZ.gif'"
                          :alt="`recentEndAt-${index}`"
                        />
                        <h6 class="m-0 text-light font-size-14">#{{item.workId}} - {{item.workName}}</h6>
                        <ul class="m-0 pl-3 font-size-10">
                          <li>สั่งทำทั้งหมด {{item.workVolume}} รายการ - รวม {{item.workEarnType === 1 ? formatPrice(item.workEarn*item.workVolume) : formatPrice(item.workEarn)}} บาท</li>
                          <li>ลูกค้า: คุณ{{item.customerName}}</li>
                          <li>กำหนดส่ง: {{$moment(item.workEndAt).format("ddd MMM YYYY")}} - {{new Date(item.workEndAt).getTime() > new Date().getTime() ? $moment(item.workEndAt).fromNow(): 'ล่าช้า'}}</li>
                        </ul>
                      </b-media>
                    </b-link>
                    <b-link class="font-size-12 text-light right" to="/work-offer">ดูทั้งหมด &rarr;</b-link>
                  </div>
                  <div v-else>
                    <content-loader
                      v-for="(item, index) in recentEndAtNum"
                      :key="index"
                      primaryColor="#6c757d"
                      secondaryColor="#343a40"
                      :height="64"
                      class="pb-3"
                    >
                      <rect rx="5" ry="5" width="64" height="64"/>
                      <rect x="75" y="5" rx="5" ry="5" width="320" height="10"/>
                      <rect x="75" y="25" rx="3" ry="3" width="260" height="6"/>
                      <rect x="75" y="40" rx="3" ry="3" width="160" height="6"/>
                    </content-loader>
                  </div>
                </div>
                <div v-else>
                  <b-card class="text-center" bg-variant="dark">
                    <small>ไม่พบรายการ</small>
                  </b-card>
                </div>
              </b-card>
            </b-col>
            <b-col>
              <b-card class="no-radius no-bdt" style="height: 100%" bg-variant="white">
                <h5 class="text-success">
                  <fa icon="check-circle" class="mr-2"/>รายการคำขออนุมัติล่าสุด
                </h5>
                <hr>
                <div v-if="recentApproveNum > 0">
                  <div v-if="recentApprove.length > 0">
                    <b-link
                      class="text-dark"
                      v-for="(item, index) in recentApprove"
                      :key="index"
                      :to="`/request/approve?wid=${item.workId}&eid=${user.entId}`"
                    >
                      <b-media class="mb-3">
                        <b-img
                          slot="aside"
                          :src="item.empPictureUrl ? item.empPictureUrl : 'https://i.gifer.com/RVtZ.gif'"
                          width="45"
                          height="45"
                          rounded="circle"
                          :alt="`recentApprove-${index}`"
                        />
                        <b-img
                          slot="aside"
                          :src="item.workImages  ? item.workImages : 'https://i.gifer.com/RVtZ.gif'"
                          width="45"
                          height="45"
                          class="ml-2"
                          rounded
                          alt="placeholder"
                        />
                        <h6
                          class="text-dark m-0 font-size-14"
                        >#{{item.workId}} จำนวน {{item.rwVolume}} รายการ</h6>
                        <small
                          class="m-0 font-size-10"
                        >โดยคุณ {{item.empFullname}} เมื่อ {{$moment(item.rwCreateAt).fromNow()}}</small>
                      </b-media>
                    </b-link>
                    <b-link class="font-size-12 text-dark right" to="/request">ดูทั้งหมด &rarr;</b-link>
                  </div>
                  <div v-else>
                    <content-loader
                      v-for="(item, index) in recentApproveNum"
                      :key="index"
                      primaryColor="#f4f5f6"
                      secondaryColor="#fff"
                      :height="64"
                      :speed=".6"
                      class="pb-3"
                    >
                      <circle
                        cx="29.700000000000003"
                        cy="30.700000000000003"
                        r="23.700000000000003"
                      />
                      <rect x="60.5" y="8.27" rx="5" ry="5" width="45" height="45"/>
                      <rect x="120" y="10" rx="5" ry="5" width="260" height="10"/>
                      <rect x="120" y="28" rx="5" ry="5" width="180" height="8"/>
                    </content-loader>
                  </div>
                </div>

                <div v-else>
                  <b-card class="text-center">
                    <small>ไม่พบรายการ</small>
                  </b-card>
                </div>
              </b-card>
            </b-col>
          </b-row>

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
          <div class="p-sicky">
            <b-card class="no-radius-bt no-radius mb-3">
              <menu-list header="เมนู" :list="[...manufacItems , ...accountList[0]]"/>
            </b-card>
            <b-card class="no-radius-bt">
              <h6>กิจกรรมที่เกิดขึ้นล่าสุด</h6>
              <hr>
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
                    :blank="item.image && item.image != 'undefined' ? false : true"
                    :blank-color="item.image && item.image != 'undefined' ? null : item.color"
                    width="40"
                    height="40"
                    rounded
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
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { activity } from "./../configs/firebase.sdk.js";
import { ContentLoader } from "vue-content-loader";
import MenuList from "./../components/AppSidebar/MenuListInDashboard";
import filter from "./../scripts/Filters.js";
export default {
  layout: "default",
  components: {
    MenuList,
    ContentLoader
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
      statistics: [],
      recentEndAt: [],
      recentEndAtNum: 0,
      recentApprove: [],
      recentApproveNum: 0,
      events: [],
      lazy: {
        center: true,
        fluidGrow: true,
        blank: true,
        blankColor: "#bbb",
        class: "img-recent"
      },
      config: {
        droppable: false,
        editable: false,
        eventBorderColor: "rgba(0,0,0,0)",
        eventTextColor: "white",
        themeSystem: "bootstrap4",
        defaultView: "month",
        allDayText: "",
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
    this.fetchStatistic();
    this.activity();
    this.fetchRecentEnd();
    this.fetchRequestRecent();
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
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(",", ".");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    async activity() {
      let self = this;
      let f = 0;
      activity
        .collection(`${this.user.entId}`)
        .orderBy("time", "desc")
        .limit(8)
        .onSnapshot(function(querySnapshot) {
          self.activities = [];
          self.items = [];
          self.recentApprove = [];
          querySnapshot.forEach(function(doc) {
            self.items.push(doc.data());
          });
          self.activities = filter.sortByActivity(self.items);

          self.fetchRequestRecent();
          self.fetchEvent();
          self.fetchStatistic();
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
    },
    async fetchStatistic() {
      let self = this;
      await this.$axios
        .$get(`/v2/statistic/${this.$store.state.user.entId}`)
        .then(function(res) {
          if (res.length > 0) {
            self.statistics = res[0];
          }
        });
    },
    async fetchRequestRecent() {
      let self = this;
      await this.$axios
        .$get(`/v2/request/recent/${this.$store.state.user.entId}`)
        .then(function(res) {
          if (res.length > 0) {
            self.recentApproveNum = res.length;
            setTimeout(() => {
              self.recentApprove = res;
            }, 1000);
          } else {
            self.recentApprove = [];
            self.recentApproveNum = 0;
          }
        });
    },
    async fetchRecentEnd() {
      let self = this;
      let d = new Date();
      function endOfWeek(date) {
        var lastday = date.getDate() - (date.getDay() - 1) + 6;
        return new Date(date.setDate(lastday));
      }
      function startOfWeek(date) {
        var lastday = date.getDate() - (date.getDay() - 1);
        return new Date(date.setDate(lastday));
      }
      let start = self.$moment(startOfWeek(d)).format("YYYY-MM-DD");
      let end = self.$moment(endOfWeek(d)).format("YYYY-MM-DD");
      await this.$axios
        .$get(`/v2/work/${this.$store.state.user.entId}/${start}/${end}`)
        .then(function(res) {
          if (res.length > 0) {
            self.recentEndAtNum = res.length;
            setTimeout(() => {
              self.recentEndAt = res;
            }, 2000);
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
img.img-recent {
  width: 64px !important;
  height: 64px !important;
}
</style>
