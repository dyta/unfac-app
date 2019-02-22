<template>
  <div>
    <b-jumbotron
      fluid
      :header="`จัดการรายการผลิต #${$route.query.wid}`"
      :lead="`Workforce management system for non-routine on Line Application.`"
      class="jumbotron-special-lg mb-0"
    >
      <small>ลากรายการข้างล่างนี้เพื่อจัดการรายการผลิต</small>
      <b-button
        variant="primary"
        size="sm"
        @click="()=> $router.push(`/request/approve?wid=${$route.query.wid}&eid=${user.entId}`)"
      >
        <fa icon="eye" class="mr-1"/>
        <small>ดูคำขออนุมัติของการผลิตนี้</small>
      </b-button>
      <b-button
        :variant="displayFull ? 'outline-danger' : 'danger'"
        size="sm"
        @click="()=> displayFull = !displayFull"
      >
        <fa :icon="displayFull ? 'eye' : 'eye-slash'" class="mr-1"/>
        <small>{{displayFull ? 'แสดง' : 'ซ่อน'}}รายการยกเลิก</small>
      </b-button>
      <b-button variant="outline-primary" size="sm" @click="()=> fetchLoading()">
        <fa icon="redo-alt" class="mr-1"/>
        <small>Refresh</small>
      </b-button>
    </b-jumbotron>

    <b-container fluid v-if="!asyncSource && totalRows > 0" :class="displayFullRowClass()">
      <b-row class="text-center m-0">
        <b-col md="6" lg class="text-left mt-3">
          <h5 class="py-2">ระหว่างการผลิต
            <b-badge pill variant="primary">{{processing.length}}</b-badge>
          </h5>
          <div v-if="processing.length > 0">
            <draggable
              v-model="processing"
              :options="{group:{name:'mfStatus', put: false}}"
              @add="changeStatus(1)"
              @change="changeElement"
            >
              <b-card
                class="text-left mt-2 py-0"
                v-for="item in processing"
                :key="item.mfId"
                body-class="px-3 py-2"
              >
                <b-media left-align>
                  <b-img
                    rounded="circle"
                    slot="aside"
                    :src="item.empPictureUrl"
                    width="50"
                    height="50"
                    :alt="item.mfId"
                  />
                  <h6 class="mt-0 mb-1">
                    <b>#{{item.mfId}}</b>
                    {{item.empFullname}}
                  </h6>

                  <div>
                    <small>
                      <div class="py-1">
                        <b-button
                          v-if="item.mfProgress !== item.maxVolume"
                          variant="danger"
                          @click="()=> $router.push(`/request/approve?wid=${item.workId}&eid=${user.entId}`)"
                        >ปรับลดงาน</b-button>
                        <b-button
                          v-else
                          variant="dark"
                          @click="onClickUpdate(2,item.mfId,item.workId, item.rwId)"
                        >รับมอบ(ตรวจสอบงาน)</b-button>
                      </div>
                    </small>
                  </div>
                  <small>
                    ความคืบหน้า {{item.mfProgress}}/{{item.maxVolume}} รายการ
                    <br>
                    อัพเดทเมื่อ {{$moment(item.mfUpdateAt).fromNow()}}
                  </small>
                </b-media>
              </b-card>
            </draggable>
          </div>
          <div v-else>
            <draggable v-model="processing" :options="{group:{name: 'mfStatus',put: false }}">
              <b-card class="text-center mt-2" bg-variant="light">ไม่มีรายการ</b-card>
            </draggable>
          </div>
        </b-col>
        <b-col md="6" lg class="text-left mt-3">
          <h5 class="py-2">
            รอรับมอบ
            <small>ตรวจสอบ</small>
            <b-badge pill variant="dark">{{checking.length}}</b-badge>
          </h5>
          <div v-if="checking.length > 0">
            <draggable
              v-model="checking"
              :options="{group:{name:'mfStatus'}}"
              @add="changeStatus(2)"
              @change="changeElement"
            >
              <b-card
                class="text-left mt-2 py-0"
                v-for="item in checking"
                :key="item.mfId"
                body-class="px-3 py-2"
              >
                <b-media left-align>
                  <b-img
                    rounded="circle"
                    slot="aside"
                    :src="item.empPictureUrl"
                    width="50"
                    height="50"
                    :alt="item.mfId"
                  />
                  <h6 class="mt-0 mb-1">
                    <b>#{{item.mfId}}</b>
                    {{item.empFullname}}
                  </h6>
                  <div>
                    <small>
                      <div class="py-1">
                        <b-button
                          variant="warning"
                          @click="onClickUpdate(3,item.mfId,item.workId)"
                        >ดำเนินการแก้ไข</b-button>
                        <b-button
                          variant="success"
                          @click="onClickUpdate(4,item.mfId,item.workId, item.rwId)"
                        >เสร็จสิ้น</b-button>
                      </div>
                    </small>
                  </div>
                  <small>
                    ความคืบหน้า {{item.mfProgress}}/{{item.maxVolume}} รายการ
                    <br>
                    อัพเดทเมื่อ {{$moment(item.mfUpdateAt).fromNow()}}
                  </small>
                </b-media>
              </b-card>
            </draggable>
          </div>
          <div v-else>
            <draggable v-model="checking" :options="{group:{name: 'mfStatus'}}">
              <b-card class="text-center mt-2" bg-variant="light">ไม่มีรายการ</b-card>
            </draggable>
          </div>
        </b-col>
        <b-col md="6" lg class="text-left mt-3">
          <h5 class="py-2">แก้ไข
            <b-badge pill variant="warning">{{reprocess.length}}</b-badge>
          </h5>
          <div v-if="reprocess.length > 0">
            <draggable
              v-model="reprocess"
              :options="{group:{name:'mfStatus', pull: false, put: false}}"
              @add="changeStatus(3)"
              @change="changeElement"
            >
              <b-card
                class="text-left mt-2 py-0"
                v-for="item in reprocess"
                :key="item.mfId"
                body-class="px-3 py-2"
              >
                <b-media left-align>
                  <b-img
                    rounded="circle"
                    slot="aside"
                    :src="item.empPictureUrl"
                    width="50"
                    height="50"
                    :alt="item.mfId"
                  />
                  <h6 class="mt-0 mb-1">
                    <b>#{{item.mfId}}</b>
                    {{item.empFullname}}
                  </h6>
                  <div>
                    <small>
                      <div class="py-1">
                        <b-button
                          variant="dark"
                          @click="onClickUpdate(2,item.mfId,item.workId)"
                        >แก้ไขเสร็จสิ้น</b-button>
                      </div>
                    </small>
                  </div>
                  <small>
                    ความคืบหน้า {{item.mfProgress}}/{{item.maxVolume}} รายการ
                    <br>
                    อัพเดทเมื่อ {{$moment(item.mfUpdateAt).fromNow()}}
                  </small>
                </b-media>
              </b-card>
            </draggable>
          </div>
          <div v-else>
            <draggable
              v-model="reprocess"
              :options="{group:{name: 'mfStatus', pull: false, put: false}}"
            >
              <b-card class="text-center mt-2" bg-variant="light">ไม่มีรายการ</b-card>
            </draggable>
          </div>
        </b-col>
        <b-col md="6" lg class="text-left mt-3">
          <h5 class="py-2">เสร็จสิ้น
            <b-badge pill variant="success">{{completed.length}}</b-badge>
          </h5>
          <div v-if="completed.length > 0">
            <draggable
              v-model="completed"
              :options="{group:{name: 'mfStatus', pull: false, put: false}}"
              @add="changeStatus(4)"
              @change="changeElement"
            >
              <b-card
                class="text-left mt-2 py-0"
                v-for="item in completed"
                :key="item.mfId"
                body-class="px-3 py-2"
              >
                <b-media left-align>
                  <b-img
                    rounded="circle"
                    slot="aside"
                    :src="item.empPictureUrl"
                    width="50"
                    height="50"
                    :alt="item.mfId"
                  />
                  <h6 class="mt-0 mb-1">
                    <b>#{{item.mfId}}</b>
                    {{item.empFullname}}
                  </h6>
                  <small>
                    ความคืบหน้า {{item.mfProgress}}/{{item.maxVolume}} รายการ
                    <br>
                    อัพเดทเมื่อ {{$moment(item.mfUpdateAt).fromNow()}}
                  </small>
                </b-media>
              </b-card>
            </draggable>
          </div>
          <div v-else>
            <draggable
              v-model="completed"
              :options="{group:{name: 'mfStatus', pull: false,put: false}}"
            >
              <b-card class="text-center mt-2" bg-variant="light">ไม่มีรายการ</b-card>
            </draggable>
          </div>
        </b-col>
        <b-col md="6" lg :class="displayFullClass()" class="text-left mt-3">
          <h5 class="py-2">ยกเลิก
            <b-badge pill variant="danger">{{reject.length}}</b-badge>
          </h5>
          <div v-if="reject.length > 0">
            <draggable
              v-model="reject"
              :options="{group:{name: 'mfStatus',pull: false}}"
              @add="changeStatus(5)"
              @change="changeElement"
            >
              <b-card
                class="text-left mt-2 py-0"
                v-for="item in reject"
                :key="item.mfId"
                body-class="px-3 py-2"
              >
                <b-media left-align>
                  <b-img
                    rounded="circle"
                    slot="aside"
                    :src="item.empPictureUrl"
                    width="50"
                    height="50"
                    :alt="item.mfId"
                  />
                  <h6 class="mt-0 mb-1">
                    <b>#{{item.mfId}}</b>
                    {{item.empFullname}}
                  </h6>

                  <small>
                    ความคืบหน้า {{item.mfProgress}}/{{item.maxVolume}} รายการ
                    <br>
                    อัพเดทเมื่อ {{$moment(item.mfUpdateAt).fromNow()}}
                  </small>
                </b-media>
              </b-card>
            </draggable>
          </div>
          <div v-else>
            <draggable v-model="reject" :options="{group:{name: 'mfStatus'}}">
              <b-card class="text-center mt-2" bg-variant="light">ไม่มีรายการ</b-card>
            </draggable>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <b-container v-else-if="totalRows === 0 && !asyncSource">
      <b-card class="text-center" style="box-shadow: 0 0 1em var(--gray-light);">
        <fa icon="exclamation-circle" size="3x" color="orange" class="mt-2"/>
        <h5 class="mt-3">ไม่พบรายการผลิตในโครงการ</h5>
      </b-card>
    </b-container>
    <loading :active.sync="asyncSource" :is-full-page="false" :opacity=".3" :height="34"></loading>
  </div>
</template>

<script>
import filter from "./../../scripts/Filters.js";
export default {
  layout: "default",
  head() {
    return {
      title: "จัดการรายการผลิต"
    };
  },
  data() {
    return {
      processing: [],
      checking: [],
      completed: [],
      reject: [],
      totalRows: 0,
      MaxToChecking: 0,
      selectElement: null,
      fromStatus: null,
      displayFull: true
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
    displayFullRowClass() {
      return this.displayFull ? "w-75" : "w-100";
    },
    displayFullClass() {
      return !this.displayFull ? "" : "display-none";
    },
    changeElement(c) {
      if (c.added) {
        this.selectElement = c.added.element;
        this.fromStatus = this.selectElement.mfStatus;
      }
    },
    errorDialog(msg) {
      this.$toast.error(`${msg}`, {
        theme: "outline",
        position: "bottom-right",
        duration: 4000
      });
      this.fetch();
    },
    async onClickUpdate(toStatus, mfId, workId, rwId) {
      let self = this;
      let timerInterval;
      self
        .$swal({
          title: `ยืนยันการเปลี่ยนแปลงสถานะ`,
          html: `กรุณายืนยันภายใน <strong>15</strong> วินาที`,
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
        .then(async result => {
          if (result.value) {
            await self.$axios
              .$put(`/v2/manufacture/${mfId}/${self.user.entId}`, {
                mfId: mfId,
                toStatus: toStatus,
                workId: workId,
                rwId: rwId,
                onClick: true
              })
              .then(function(res) {
                self.fetchLoading();
              })
              .catch(e => {
                self.$toast.error(e, {
                  theme: "outline",
                  position: "bottom-right",
                  duration: 4000
                });
                self.fetchLoading();
              });
          } else {
            self.fetchLoading();
          }
        });
    },
    async UpdateToDB(toStatus, inputValue) {
      let self = this;
      await this.$axios
        .$put(`/v2/manufacture/${self.selectElement.mfId}/${self.user.entId}`, {
          mfId: self.selectElement.mfId,
          toStatus: toStatus,
          maxValue: self.selectElement.maxVolume,
          workId: self.selectElement.workId,
          rwId: self.selectElement.rwId
        })
        .then(function(res) {})
        .catch(e => {
          self.$toast.error(e, {
            theme: "outline",
            position: "bottom-right",
            duration: 4000
          });
        });
      this.fetchLoading();
    },
    changeStatus(toStatus) {
      let self = this;
      let maxValue = self.selectElement.maxVolume;
      let progressValue = self.selectElement.mfProgress;
      let timerInterval;
      switch (self.fromStatus) {
        case 1:
          switch (toStatus) {
            case 2:
              if (maxValue === progressValue) {
                self
                  .$swal({
                    title: `ได้รับมอบเพื่อตรวจสอบ`,
                    html: `<small>เต็มจำนวน ${maxValue} รายการ</small><br> กรุณายืนยันภายใน <strong>15</strong> วินาที`,
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
                      self.UpdateToDB(toStatus, result.value);
                    } else {
                      self.fetchLoading();
                    }
                  });
              } else {
                self.fetchLoading();
                self.errorDialog(
                  "ยังส่งความคืบหน้าไม่ครบถ้วน ลดปริมาณงานได้ที่เมนูอนุมัติคำขอ"
                );
              }
              break;
            case 5:
              self.errorDialog("1-xxx");
              break;
          }
          break;
      }
    },
    fetchLoading() {
      this.$store.dispatch("sourceLoaded", true);
      this.fetch();
    },
    async fetch() {
      let self = this;

      await this.$axios
        .$get(
          `/v2/manufacture/manage/${this.$route.query.wid}/${this.user.entId}`
        )
        .then(function(res) {
          self.processing,
            self.checking,
            self.reprocess,
            self.completed,
            self.reject,
            (self.SumToChecking = []);
          if (res.length > 0) {
            self.processing = filter.SeparateByStatus(res, "mfStatus", 1);
            self.checking = filter.SeparateByStatus(res, "mfStatus", 2);
            self.reprocess = filter.SeparateByStatus(res, "mfStatus", 3);
            self.completed = filter.SeparateByStatus(res, "mfStatus", 4);
            self.reject = filter.SeparateByStatus(res, "mfStatus", 5);
            self.SumToChecking = filter.SummaryByVolume(self.checking);
            self.MaxToChecking = res[0].workVolume;
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
.display-none {
  display: none;
}
.media-body {
  line-height: 1rem;
}
.card {
  .btn {
    font-size: 12px;
    height: 20px;
    line-height: 7px;
  }
}
</style>
