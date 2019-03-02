<template>
  <div>
    <b-jumbotron
      fluid
      header="แจ้งเตือนงาน"
      class="jumbotron-special-lg mb-0 pb-0"
      :lead="`ประกาศงานไปยังแชทของพนักงาน`"
    ></b-jumbotron>
    <b-container>
      <hr>
      <b-row>
        <b-col md="6" class="border-right">
          <h5>เลือกพนักงานที่ต้องการส่งแจ้งเตือน:</h5>
          <hr>
          <b-form-checkbox
            v-model="allSelectedEmp"
            :indeterminate="indeterminateEmp"
            aria-describedby="flavours"
            aria-controls="flavours"
            @change="toggleAllEmp"
          >{{ allSelectedEmp ? 'เอาออกทั้งหมด' : 'เลือกทั้งหมด' }}</b-form-checkbox>
          <hr>
          <b-row no-gutters>
            <b-col lg="6" v-for="option in employee" :key="option.name">
              <b-form-checkbox
                v-model="selectedEmp"
                :value="option.key"
                name="Employee"
                :disabled="option.disabled"
                inline
              >
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
              </b-form-checkbox>
            </b-col>
          </b-row>
        </b-col>
        <b-col md="6">
          <h5>
            เลือกงาน:
            <small class="font-size-12">สูงสุด 2 รายการ</small>
          </h5>

          <hr>
          <b-form-checkbox
            v-model="allSelectedWork"
            :indeterminate="indeterminateWork"
            aria-describedby="flavours"
            aria-controls="flavours"
            :disabled="true"
            @change="toggleAllWork"
          >{{ allSelectedWork ? 'เอาออกทั้งหมด' : 'เลือกทั้งหมด' }}</b-form-checkbox>
          <hr>
          <b-row no-gutters>
            <b-col lg="6" v-for="option in works" :key="option.workName">
              <b-form-checkbox
                v-model="selectedWork"
                :value="option"
                :state="state"
                name="works"
                :disabled="option.workStatus"
                inline
              >
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
              </b-form-checkbox>
            </b-col>
            <b-button
              block
              variant="success"
              class="mt-3"
              @click="sendNotification"
              :disabled="selectedEmp.length === 0 || selectedWork.length === 0 || !state"
            >ส่งข้อความ</b-button>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import filter from "./../scripts/Filters";
import convert from "./../scripts/ConvertText";
export default {
  layout: "default",
  head() {
    return {
      title: "แจ้งเตือนงาน"
    };
  },
  data() {
    return {
      employee: [],
      selectedEmp: [],
      allSelectedEmp: false,
      indeterminateEmp: false,

      works: [],
      selectedWork: [],
      allSelectedWork: false,
      indeterminateWork: false
    };
  },
  created() {
    this.fetch();
  },
  computed: {
    state() {
      return this.selectedWork.length < 3;
    }
  },
  methods: {
    toggleAllEmp(checked) {
      this.selectedEmp = checked ? filter.selecteEmployee(this.employee) : [];
    },
    toggleAllWork(checked) {
      this.selectedWork = checked ? filter.selecteWork(this.works) : [];
    },

    async fetch() {
      let self = this;
      await this.$axios
        .$get(`/v2/employee/notification/${this.$store.state.user.entId}`)
        .then(function(res) {
          if (res.length > 0) {
            self.employee = convert.notificationToBoolean(res);
          }
        });

      await this.$axios
        .$get(`/v2/work/notification/${this.$store.state.user.entId}`)
        .then(function(res) {
          if (res.length > 0) {
            self.works = convert.notificationToBooleanForWorks(res);
          }
        });
    },
    async sendNotification() {
      let self = this;
      let data = [];
      await this.$axios
        .$post(`/v2/notification/${this.$store.state.user.entId}`, {
          works: this.selectedWork,
          uid: this.selectedEmp
        })
        .then(function(res) {
          console.log("res: ", res);
          if (res) {
            self.$toast.info(`ส่งข้อความไปยังพนักงานที่เลือกแล้ว`, {
              theme: "bubble",
              position: "bottom-center",
              duration: 4000
            });
            self.selectedWork = [];
            self.selectedEmp = [];
          }
          self.fetch();
        });
    }
  },
  watch: {
    selectedEmp(newVal, oldVal) {
      // Handle changes in individual flavour checkboxes
      if (newVal.length === 0) {
        this.indeterminateEmp = false;
        this.allSelectedEmp = false;
      } else if (newVal.length === this.employee.length) {
        this.indeterminateEmp = false;
        this.allSelectedEmp = true;
      } else {
        this.indeterminateEmp = true;
        this.allSelectedEmp = false;
      }
    },
    selectedWork(newVal, oldVal) {
      // Handle changes in individual flavour checkboxes
      if (newVal.length === 0) {
        this.indeterminateWork = false;
        this.allSelectedWork = false;
      } else if (newVal.length === this.works.length) {
        this.indeterminateWork = false;
        this.allSelectedWork = true;
      } else {
        this.indeterminateWork = true;
        this.allSelectedWork = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.display-3 {
  font-size: 2rem !important;
}
</style>