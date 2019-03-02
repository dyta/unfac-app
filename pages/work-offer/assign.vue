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
          <b-row no-gutters>
            <b-col lg="6" v-for="option in employee" :key="option.name">
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
            </b-col>
          </b-row>
        </b-col>
        <b-col md="6">
          <h5>เลือกงาน:</h5>
          <hr>
          <b-row no-gutters>
            <b-col lg="6" v-for="option in works" :key="option.workName">
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
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import filter from "./../../scripts/Filters";
import convert from "./../../scripts/ConvertText";
export default {
  layout: "default",
  head() {
    return {
      title: "ขอรับงานให้พนักงาน"
    };
  },
  data() {
    return {
      employee: [],
      works: []
    };
  },
  created() {
    this.fetch();
  },
  computed: {},
  methods: {
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
    }
  }
};
</script>
<style lang="scss" scoped>
.display-3 {
  font-size: 2rem !important;
}
</style>