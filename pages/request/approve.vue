<template>
  <div>
    <b-jumbotron
      fluid
      :header="`จัดการคำของาน #${$route.query.wid}`"
      :lead="`Workforce management system for non-routine on Line Application.`"
      class="jumbotron-special-lg mb-0"
    >
      <small>ลากงานข้างล่างนี้เพื่อจัดการรายการคำขอ</small>
      <b-button
        v-if="approved.length > 0"
        variant="primary"
        size="sm"
        @click="()=> $router.push(`/manufacture/manage?wid=${$route.query.wid}&eid=${user.entId}`)"
      >
        <fa icon="eye" class="mr-1"/>
        <small>ดูรายการผลิตของงานนี้</small>
      </b-button>
      <b-button variant="outline-primary" size="sm" @click="()=> this.fetchLoading()">
        <fa icon="redo-alt" class="mr-1"/>
        <small>Refresh</small>
      </b-button>
    </b-jumbotron>

    <b-container fluid v-if="!asyncSource && totalRows > 0" class="w-75 p-0">
      <b-row class="text-center">
        <b-col md="6" lg="3" class="text-left mt-3">
          <h5 class="py-2">รออนุมัติ
            <b-badge>{{pending.length}}</b-badge>
          </h5>
          <div v-if="pending.length > 0">
            <draggable
              v-model="pending"
              :options="{group:{name:'rwStatus', put:false}}"
              @add="changeStatus(1)"
              @change="changeElement"
            >
              <b-card
                class="text-left mt-2 py-0"
                v-for="item in pending"
                :key="item.rwId"
                body-class="px-3 py-2"
              >
                <b-media left-align>
                  <b-img
                    rounded="circle"
                    slot="aside"
                    :src="item.empPictureUrl"
                    width="50"
                    height="50"
                    :alt="item.rwId"
                  />
                  <h6 class="mt-0 mb-1">{{item.empFullname}}</h6>
                  <small>
                    <b>#รหัสคำขอ: {{item.rwId}}</b>
                  </small>
                  <br>
                  <small>จำนวนที่ขอ {{item.rwVolume}} รายการ เมื่อ {{$moment(item.rwCreateAt).fromNow()}}</small>
                </b-media>
              </b-card>
            </draggable>
          </div>
          <div v-else>
            <draggable
              v-model="pending"
              :options="{group:{name: 'rwStatus', pull: false, put:false }}"
            >
              <b-card class="text-center mt-2" bg-variant="light">ไม่มีรายการ</b-card>
            </draggable>
          </div>
        </b-col>
        <b-col md="6" lg="3" class="text-left mt-3">
          <h5 class="py-2">อนุมัติ
            <b-badge variant="primary">{{approved.length}}</b-badge>
          </h5>
          <div v-if="approved.length > 0">
            <draggable
              v-model="approved"
              :options="{group:{name:'rwStatus'}}"
              @add="changeStatus(2)"
              @change="changeElement"
            >
              <b-card
                class="text-left mt-2 py-0"
                v-for="item in approved"
                :key="item.rwId"
                body-class="px-3 py-2"
              >
                <b-media left-align>
                  <b-img
                    rounded="circle"
                    slot="aside"
                    :src="item.empPictureUrl"
                    width="50"
                    height="50"
                    :alt="item.rwId"
                  />
                  <h6 class="mt-0 mb-1">{{item.empFullname}}</h6>
                  <small>
                    <b>#รหัสคำขอ: {{item.rwId}}</b>
                    
                    <b class="text-primary">#รหัสการผลิต: {{item.mfId}}</b>
                  </small>
                  <br>
                  <small>จำนวนที่ขอ {{item.rwVolume}} รายการ เมื่อ {{$moment(item.rwCreateAt).fromNow()}}</small>
                </b-media>
              </b-card>
            </draggable>
          </div>
          <div v-else>
            <draggable v-model="approved" :options="{group:{name: 'rwStatus', pull: false, }}">
              <b-card class="text-center mt-2" bg-variant="light">ไม่มีรายการ</b-card>
            </draggable>
          </div>
        </b-col>
        <b-col md="6" lg="3" class="text-left mt-3">
          <h5 class="py-2">เสร็จสิ้น
            <b-badge variant="success">{{completed.length}}</b-badge>
          </h5>
          <div v-if="completed.length > 0">
            <draggable
              v-model="completed"
              :options="{group:{name: 'rwStatus', pull: false, put: false}}"
              @add="changeStatus(4)"
              @change="changeElement"
            >
              <b-card
                class="text-left mt-2 py-0"
                v-for="item in completed"
                :key="item.rwId"
                body-class="px-3 py-2"
              >
                <b-media left-align>
                  <b-img
                    rounded="circle"
                    slot="aside"
                    :src="item.empPictureUrl"
                    width="50"
                    height="50"
                    :alt="item.rwId"
                  />
                  <h6 class="mt-0 mb-1">{{item.empFullname}}</h6>
                  <small>
                    <b>#รหัสคำขอ: {{item.rwId}}</b>
                    
                    <b class="text-success">#รหัสการผลิต: {{item.mfId}}</b>
                  </small>
                  <br>
                  <small>จำนวนที่ขอ {{item.rwVolume}} รายการ เมื่อ {{$moment(item.rwCreateAt).fromNow()}}</small>
                </b-media>
              </b-card>
            </draggable>
          </div>
          <div v-else>
            <draggable
              v-model="completed"
              :options="{group:{name: 'rwStatus', pull: false, put: false}}"
            >
              <b-card class="text-center mt-2" bg-variant="light">ไม่มีรายการ</b-card>
            </draggable>
          </div>
        </b-col>
        <b-col md="6" lg="3" class="text-left mt-3">
          <h5 class="py-2">ยกเลิก
            <b-badge variant="danger">{{canceled.length}}</b-badge>
          </h5>
          <div v-if="canceled.length > 0">
            <draggable
              v-model="canceled"
              :options="{group:{name: 'rwStatus', pull: false}}"
              @add="changeStatus(3)"
              @change="changeElement"
            >
              <b-card
                class="text-left mt-2 py-0"
                v-for="item in canceled"
                :key="item.rwId"
                body-class="px-3 py-2"
              >
                <b-media left-align>
                  <b-img
                    rounded="circle"
                    slot="aside"
                    :src="item.empPictureUrl"
                    width="50"
                    height="50"
                    :alt="item.rwId"
                  />
                  <h6 class="mt-0 mb-1">{{item.empFullname}}</h6>
                  <small>
                    <b>#รหัสคำขอ: {{item.rwId}}</b>
                    
                    <b class="text-danger">#รหัสการผลิต: {{item.mfId}}</b>
                  </small>
                  <br>
                  <small>จำนวนที่ขอ {{item.rwVolume}} รายการ เมื่อ {{$moment(item.rwCreateAt).fromNow()}}</small>
                </b-media>
              </b-card>
            </draggable>
          </div>
          <div v-else>
            <draggable v-model="canceled" :options="{group:{name: 'rwStatus', pull: false }}">
              <b-card class="text-center mt-2" bg-variant="light">ไม่มีรายการ</b-card>
            </draggable>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <b-container v-else-if="totalRows === 0 && !asyncSource">
      <b-card class="text-center" style="box-shadow: 0 0 1em var(--gray-light);">
        <fa icon="exclamation-circle" size="3x" color="orange" class="mt-2"/>
        <h5 class="mt-3">ไม่พบรายการคำขอของงานในโครงการ</h5>
      </b-card>
    </b-container>
    <loading :active.sync="asyncSource" :is-full-page="false" :opacity="1" :height="34"></loading>
  </div>
</template>

<script>
import filter from "./../../scripts/Filters.js";
export default {
  layout: "default",
  head() {
    return {
      title: "Approve Request"
    };
  },
  data() {
    return {
      pending: [],
      approved: [],
      canceled: [],
      completed: [],
      totalRows: 0,
      SumApproved: 0,
      MaxApproved: 0,
      selectElement: null
    };
  },
  created() {
    this.fetchLoading();
  },
  computed: {
    asyncSource() {
      return this.$store.state.source;
    },
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    status(status) {
      switch (status) {
        case 2:
          return "อนุมัติ";
          break;
        case 3:
          return "ยกเลิก";
          break;
        case 4:
          return "เสร็จสิ้น";
          break;
        default:
          return "รออนุมัติ";
          break;
      }
    },
    changeElement(c) {
      if (c.added) {
        this.selectElement = c.added.element;
      }
    },
    async UpdateToDatabase(toStatus, approve, cutloss) {
      let self = this;
      let element = this.selectElement;
      await this.$axios
        .$put(`/v2/request/${element.rwId}/${self.user.entId}`, {
          newStatus: toStatus,
          approve,
          cutloss,
          ...element
        })
        .then(function(res) {
          element.rwStatus = toStatus;
          self.$toast.info(
            `${self.status(toStatus)} งาน #${self.selectElement.rwId} จำนวน ${
              approve ? approve : element.rwVolume
            } รายการแล้ว`,
            {
              theme: "outline",
              position: "bottom-right",
              duration: 4000
            }
          );
        })
        .catch(e => {
          self.$toast.error(e, {
            theme: "outline",
            position: "bottom-right",
            duration: 4000
          });
        });
      this.fetch();
    },
    changeStatus(toStatus) {
      let self = this;
      let formStatus = this.selectElement.rwStatus;
      let amount = this.MaxApproved - this.SumApproved; // คงเหลือ
      let timerInterval;
      if (formStatus === 1 && toStatus === 2) {
        if (self.SumApproved < self.MaxApproved) {
          if (self.selectElement.rwVolume === 1) {
            self
              .$swal({
                title: `${self.status(toStatus)} งาน #${
                  self.selectElement.rwId
                }`,
                html: "กรุณายืนยันภายใน <strong>15</strong> วินาที",
                type: "question",
                timer: 15000,
                onBeforeOpen: () => {
                  timerInterval = setInterval(() => {
                    self.$swal
                      .getContent()
                      .querySelector("strong").textContent = (
                      self.$swal.getTimerLeft() / 1000
                    ).toFixed(0);
                  }, 1000);
                },
                onClose: () => {
                  clearInterval(timerInterval);
                },
                showCancelButton: true,
                confirmButtonText: "ยืนยัน",
                cancelButtonText: "ยกเลิก"
              })
              .then(result => {
                if (result.value) {
                  self.UpdateToDatabase(toStatus, 1);
                } else {
                  self.fetchLoading();
                }
              });
          } else {
            self
              .$swal({
                input: "number",
                title: `${self.status(toStatus)} งาน #${
                  self.selectElement.rwId
                }`,
                text: `มีปริมาณงานที่สามารถอนุมัติได้ ทั้งหมด ${
                  amount > self.selectElement.rwVolume
                    ? self.selectElement.rwVolume
                    : amount
                } รายการ`,
                confirmButtonText: "ยืนยัน",
                showCancelButton: true,
                cancelButtonText: "ยกเลิก"
              })
              .then(result => {
                if (
                  result.value > 0 &&
                  result.value <= amount &&
                  result.value <= self.selectElement.rwVolume
                ) {
                  self.UpdateToDatabase(toStatus, result.value * 1);
                } else if (
                  result.value < 1 ||
                  result.value > amount ||
                  result.value > self.selectElement.rwVolume
                ) {
                  self.$toast.error(
                    `งาน #${
                      self.selectElement.rwId
                    } มีปริมาณที่สามารถอนุมัติได้ ${
                      amount > self.selectElement.rwVolume
                        ? self.selectElement.rwVolume
                        : amount
                    } รายการเท่านั้น`,
                    {
                      theme: "outline",
                      position: "bottom-right",
                      duration: 4000
                    }
                  );
                  self.fetchLoading();
                } else {
                  self.fetchLoading();
                }
              });
          }
        } else {
          self.$toast.error(
            `อนุมัติครบจำนวนแล้ว Max. ${self.SumApproved} รายการ`,
            {
              theme: "outline",
              position: "bottom-right",
              duration: 4000
            }
          );
          self.fetchLoading();
        }
      } else if (formStatus === 1 && toStatus === 3) {
        self
          .$swal({
            title: `${self.status(toStatus)} งาน #${self.selectElement.rwId}`,
            html: "กรุณายืนยันภายใน <strong>15</strong> วินาที",
            type: "question",
            timer: 15000,
            onBeforeOpen: () => {
              timerInterval = setInterval(() => {
                self.$swal.getContent().querySelector("strong").textContent = (
                  self.$swal.getTimerLeft() / 1000
                ).toFixed(0);
              }, 1000);
            },
            onClose: () => {
              clearInterval(timerInterval);
            },
            showCancelButton: true,
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก"
          })
          .then(result => {
            if (result.value) {
              self.UpdateToDatabase(toStatus);
            } else {
              self.fetchLoading();
            }
          });
      } else if (formStatus === 2 && toStatus === 3) {
        if (self.selectElement.rwVolume - self.selectElement.mfProgress !== 0) {
          self
            .$swal({
              title: `${self.status(toStatus)} งาน #${self.selectElement.rwId}`,
              html: `ยกเลิกจำนวนที่เหลือ ${self.selectElement.rwVolume -
                self.selectElement
                  .mfProgress} รายการ <br><small>กรุณายืนยันภายใน <strong>15</strong> วินาที</small>`,
              type: "question",
              timer: 15000,
              onBeforeOpen: () => {
                timerInterval = setInterval(() => {
                  self.$swal
                    .getContent()
                    .querySelector("strong").textContent = (
                    self.$swal.getTimerLeft() / 1000
                  ).toFixed(0);
                }, 1000);
              },
              onClose: () => {
                clearInterval(timerInterval);
              },
              showCancelButton: true,
              confirmButtonText: "ยืนยัน",
              cancelButtonText: "ยกเลิก"
            })
            .then(result => {
              if (result.value) {
                self.UpdateToDatabase(
                  toStatus,
                  self.selectElement.rwVolume - self.selectElement.mfProgress,
                  true
                );
              } else {
                self.fetchLoading();
              }
            });
        } else {
          self.$toast.error(`ไม่สามารถยกเลิกได้`, {
            theme: "outline",
            position: "bottom-right",
            duration: 4000
          });
          self.fetchLoading();
        }
      } else {
        self.$toast.error(`ปฏิเสธคำขอไปยังสถานะ${self.status(toStatus)}`, {
          theme: "outline",
          position: "bottom-right",
          duration: 4000
        });
        self.fetchLoading();
      }
    },
    fetchLoading() {
      this.$store.dispatch("sourceLoaded", true);
      this.fetch();
    },
    async fetch() {
      let self = this;

      await this.$axios
        .$get(`/v2/request/${this.$route.query.wid}/${this.user.entId}`)
        .then(function(res) {
          if (res.length > 0) {
            self.pending = filter.SeparateByStatus(res, "rwStatus", 1);
            self.approved = filter.SeparateByStatus(res, "rwStatus", 2);
            self.canceled = filter.SeparateByStatus(res, "rwStatus", 3);
            self.completed = filter.SeparateByStatus(res, "rwStatus", 4);
            self.SumApproved = filter.SummaryByVolume(self.approved);
            self.MaxApproved = res[0].workVolume;
            self.totalRows = res.length;
          }
          self.$store.dispatch("sourceLoaded", false);
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
