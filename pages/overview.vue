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
                  >/{{statistics.unit_enabled-statistics.unit_approved !==0 ? 'เหลือ '+ (statistics.unit_enabled-statistics.unit_approved) : 'อนุมัติครบ'}}</small>
                </p>
                <div class="text-right border-top">
                  <b-link class="font-size-10 text-secondary">ดูทั้งหมด &rarr;</b-link>
                </div>
              </b-col>
              <b-col cols="6" md="6" lg="3" class="list-statistic">
                <h6 class="m-0">รายการคำขอ*</h6>
                <p class="m-0 statistics">{{statistics.unit_request ? statistics.unit_request : 0}}</p>
                <div class="text-right border-top">
                  <b-link class="font-size-10 text-secondary">ดูทั้งหมด &rarr;</b-link>
                </div>
              </b-col>
              <b-col cols="6" md="6" lg="3" class="list-statistic">
                <h6 class="m-0">อยู่ระหว่างการผลิต*</h6>
                <p class="m-0 statistics">{{statistics.unit_process ? statistics.unit_process : 0}}</p>
                <div class="text-right border-top">
                  <b-link class="font-size-10 text-secondary">ดูทั้งหมด &rarr;</b-link>
                </div>
              </b-col>
              <b-col cols="6" md="6" lg="3" class="list-statistic">
                <h6 class="m-0">รอการตรวจสอบ*</h6>
                <p class="m-0 statistics">{{statistics.unit_check ? statistics.unit_check : 0}}</p>
                <div class="text-right border-top">
                  <b-link class="font-size-10 text-secondary">ดูทั้งหมด &rarr;</b-link>
                </div>
              </b-col>
            </b-row>

            <small class="font-size-10">
              จำนวนงานทั้งหมด
              <b>{{statistics.w_all ? statistics.w_all : 0}}</b> งาน | จำนวนงานที่เปิดรับ
              <b>{{statistics.w_enabled ? statistics.w_enabled : 0}}</b> งาน | *หน่วย: ชิ้น
            </small>
          </b-card>

          <b-row>
            <b-col class="pr-0">
              <b-card
                class="no-radius no-bdt"
                style="height: 100%"
                bg-variant="secondary"
                text-variant="light"
              >
                <h5 class="text-warning">
                  <fa icon="exclamation-triangle" class="mr-2"/>งานเร่งด่วน
                </h5>
                <hr>
                <div v-if="workUrgently.length > 0">
                  <b-link
                    class="text-light"
                    v-for="(item, index) in workUrgently"
                    :key="index"
                    :to="`/request/approve?wid=${index}&eid=${index}`"
                  >
                    <b-media class="mb-3">
                      <b-img
                        slot="aside"
                        blank
                        blank-color="#ccc"
                        width="64"
                        rounded
                        alt="placeholder"
                      />
                      <h6 class="m-0 text-light font-size-14">#400{{index}} - ชื่องาน</h6>
                      <ul class="m-0 pl-3 font-size-10">
                        <li>จำนวนสั่งทำทั้งหมด 100 รายการ</li>
                        <li>ปริมาณที่ยังไม่ได้ผลิต 20 รายการ</li>
                        <li>คาดว่าจะเสร็จ</li>
                      </ul>
                    </b-media>
                  </b-link>
                  <b-link class="font-size-12 text-light right" to="/work-offer">ดูทั้งหมด &rarr;</b-link>
                </div>
                <div v-else>
                  <b-card class="text-center" bg-variant="dark">
                    <small>ไม่พบรายการ</small>
                  </b-card>
                </div>
              </b-card>
            </b-col>
            <b-col class="pl-0">
              <b-card class="no-radius no-bdt" style="height: 100%" bg-variant="white">
                <h5 class="text-success">
                  <fa icon="check-circle" class="mr-2"/>คำขออนุมัติล่าสุด
                </h5>
                <hr>
                <div v-if="recentApprove.length > 0">
                  <b-link
                    class="text-dark"
                    v-for="(item, index) in recentApprove"
                    :key="index"
                    :to="`/request/approve?wid=${index}&eid=${index}`"
                  >
                    <b-media class="mb-3">
                      <b-img
                        slot="aside"
                        blank
                        blank-color="#ccc"
                        width="45"
                        rounded="circle"
                        alt="placeholder"
                      />
                      <b-img
                        slot="aside"
                        blank
                        blank-color="#eee"
                        width="45"
                        class="ml-2"
                        rounded
                        alt="placeholder"
                      />
                      <h6 class="text-dark m-0 font-size-14">#400{{index}} จำนวน 10 รายการ</h6>
                      <small
                        class="m-0 font-size-10"
                      >โดยคุณ ณัฐวุฒิ กิติวรรณ เมื่อ {{$moment().fromNow()}}</small>
                    </b-media>
                  </b-link>
                  <b-link class="font-size-12 text-dark right" to="/request">ดูทั้งหมด &rarr;</b-link>
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
      statistics: [],
      workUrgently: [],
      recentApprove: [],
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
    this.isActivity = true;
    this.fetchEvent();
    this.fetchStatistic();
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
        .limit(8)
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
    },
    async fetchStatistic() {
      let self = this;
      self.statistics = [];
      await this.$axios
        .$get(`/v2/statistic/${this.$store.state.user.entId}`)
        .then(function(res) {
          console.log("res: ", res);
          if (res.length > 0) {
            self.statistics = res[0];
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
