<template>
  <div>
    <b-jumbotron
      fluid
      header="ขอรับงานให้พนักงาน"
      class="jumbotron-special-lg mb-0 pb-0"
      :lead="`ดำเนินการขอรับงานแทนพนักงานเป็นกรณีพิเศษ`"
    ></b-jumbotron>
    <b-container>
      <hr>
      <b-row>
        <b-col md="6" class="border-right">
          <h5>เลือกพนักงาน:</h5>
          <hr>
          <b-row no-gutters v-if="employee.length > 0">
            <b-col lg="6" v-for="option in employee" :key="option.name">
              <b-form-radio-group id="radios2" v-model="selectedEmp" name="Employee">
                <b-form-radio :value="option">
                  <b-media class="mb-1">
                    <b-img
                      slot="aside"
                      :src="option.img"
                      width="64"
                      height="64"
                      class="border"
                      rounded
                      :alt="option.name"
                    />
                    <h6 class="mt-0 text-dark">{{option.name}}</h6>
                    <p class="text-secondary">#ID: {{option.id}}</p>
                  </b-media>
                </b-form-radio>
              </b-form-radio-group>
            </b-col>
          </b-row>
          <b-row no-gutters v-else>
            <b-col lg="6" v-for="(option, index) in employeeNum" :key="index">
              <content-loader
                primaryColor="#ccc"
                secondaryColor="#fff"
                :height="70"
                :speed="1.5"
                class="pb-3"
              >
                <rect x="0" y="6.27" rx="4" ry="4" width="64" height="64"/>
                <rect x="80" y="8" rx="5" ry="5" width="260" height="10"/>
                <rect x="80" y="29" rx="5" ry="5" width="180" height="8"/>
              </content-loader>
            </b-col>
          </b-row>
        </b-col>
        <b-col md="6">
          <h5>เลือกงาน:</h5>
          <hr>
          <b-row no-gutters v-if="works.length > 0" :class="workDisabled ? 'dark' : ''">
            <b-col lg="6" v-for="option in works" :key="option.workName">
              <b-form-radio-group
                id="radios2"
                v-model="selectedWork"
                name="Work"
                :class="option.workStatus || maxApp(option)? 'dark' : ''"
                :disabled="workDisabled || option.workStatus || maxApp(option)"
              >
                <b-form-radio :value="option">
                  <b-media class="mb-1">
                    <b-img
                      slot="aside"
                      :src="option.workImages"
                      width="64"
                      height="64"
                      class="border"
                      rounded
                      :alt="option.workName"
                    />
                    <h6 class="mt-0 text-dark">{{option.workName}}</h6>
                    <p class="text-secondary">#ID: {{option.workId}}</p>
                  </b-media>
                </b-form-radio>
              </b-form-radio-group>
            </b-col>
          </b-row>
          <b-row no-gutters v-else>
            <b-col lg="6" v-for="(option, index) in worksNum" :key="index">
              <content-loader
                primaryColor="#ccc"
                secondaryColor="#fff"
                :height="70"
                :speed="1"
                class="pb-3"
              >
                <rect x="0" y="6.27" rx="4" ry="4" width="64" height="64"/>
                <rect x="80" y="8" rx="5" ry="5" width="260" height="10"/>
                <rect x="80" y="29" rx="5" ry="5" width="180" height="8"/>
              </content-loader>
            </b-col>
          </b-row>
          <b-button
            block
            :variant="!selectedEmp || !selectedWork ? 'secondary' : 'success'"
            class="mt-3"
            v-b-modal.assign
            :disabled="!selectedEmp || !selectedWork"
          >ดำเนินการต่อ &rarr;</b-button>
        </b-col>
      </b-row>
      <b-modal
        id="assign"
        title="กรอกจำนวนที่ต้องการเพิ่มงานให้พนักงาน"
        hide-footer
        v-if="selectedEmp && selectedWork"
        class="text-center"
      >
        <div>
          <b-img
            :src="selectedEmp.img"
            width="80"
            height="80"
            rounded="circle"
            :alt="selectedEmp.name"
          />
          <b-img
            :src="selectedWork.workImages"
            width="80"
            height="80"
            rounded="circle"
            class="border ml-3"
            :alt="selectedWork.workName"
          />
        </div>
        <div>
          <small>{{selectedEmp.name}}</small>
          <small class="ml-3">{{selectedWork.workName}}</small>
        </div>

        <div class="pt-2">
          <b-form-input
            v-model="assignNum"
            type="number"
            size="lg"
            class="border text-center"
            placeholder="ใส่จำนวนตัวเลข"
          />

          <small
            class="text-danger"
          >*สูงสุด {{selectedWork.workVolume -(selectedWork.approvedSum + selectedWork.completeSum)}} รายการเท่านั้น</small>
        </div>
        <b-button
          variant="success"
          block
          class="no-radius mt-3"
          :disabled="max"
          @click="assignWork"
        >ยืนยัน</b-button>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
import filter from "./../../scripts/Filters";
import convert from "./../../scripts/ConvertText";
import { ContentLoader } from "vue-content-loader";
export default {
  layout: "default",
  components: {
    ContentLoader
  },
  head() {
    return {
      title: "ขอรับงานให้พนักงาน"
    };
  },
  data() {
    return {
      employee: [],
      works: [],

      employeeNum: 0,
      worksNum: 0,
      assignNum: null,

      selectedEmp: null,
      selectedWork: null,
      workDisabled: true
    };
  },
  created() {
    this.fetch();
  },
  computed: {
    max() {
      let self = this;
      return (
        !self.assignNum ||
        self.assignNum < 1 ||
        self.assignNum >
          self.selectedWork.workVolume -
            (self.selectedWork.approvedSum + self.selectedWork.completeSum)
      );
    }
  },
  watch: {
    selectedEmp(newVal, oldVal) {
      if (this.selectedEmp) {
        this.workDisabled = false;
      }
    }
  },
  methods: {
    maxApp(self) {
      return self.workVolume === self.approvedSum + self.completeSum;
    },
    async fetch() {
      let self = this;
      await this.$axios
        .$get(`/v2/employee/notification/${this.$store.state.user.entId}`)
        .then(function(res) {
          self.employeeNum = res.length;
          if (res.length > 0) {
            setTimeout(() => {
              self.employee = convert.notificationToBoolean(res);
            }, 3000);
          }
        });
      await this.$axios
        .$get(`/v2/work/notification/${this.$store.state.user.entId}`)
        .then(function(res) {
          self.worksNum = res.length;
          if (res.length > 0) {
            setTimeout(() => {
              self.works = convert.notificationToBooleanForWorks(res);
            }, 3000);
          }
        });
    },
    async assignWork() {
      let self = this;
      let selectedWork = self.selectedWork;
      let selectedEmp = self.selectedEmp;
      let assignNum = self.assignNum * 1;
      await self.$axios
        .$post(`/v2/request/${self.$store.state.user.entId}`, {
          ...selectedWork,
          ...selectedEmp,
          assignNum
        })
        .then(function(res) {
          self.selectedWork = [];
          self.selectedEmp = [];
          self.assignNum = null;
          self.fetch();
          self.$root.$emit("bv::hide::modal", "assign");
          self.$toast.info(`เพิ่่มการขอรับงานให้พนักงานดรียบร้อยแล้ว`, {
            theme: "bubble",
            position: "bottom-center",
            duration: 3000
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.display-3 {
  font-size: 2rem !important;
}
.dark {
  -webkit-filter: grayscale(1); /* Safari 6.0 - 9.0 */
  filter: grayscale(1);
  opacity: 0.5;
}
</style>