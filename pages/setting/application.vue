<template>
  <div>
    <b-jumbotron fluid header="ตั้งค่าแอปพลิเคชัน" lead="เชื่อมโยงระบบ Unfac ไปยัง LINE@ ของคุณ"></b-jumbotron>

    <b-container class="mb-5">
      <div v-if="setting">
        <b-tabs vertical nav-wrapper-class="col-12 col-md-4" content-class="col-12 col-md-8 px-4">
          <b-tab title="คีย์ API ของเว็บ">
            <b-card class="text-left">
              <h6 class="bold">API KEY</h6>
              <hr>
              <code>{{setting.API_KEY}}</code>
            </b-card>
            <b-card class="text-left mt-2">
              <h6 class="bold">Webhook URL</h6>
              <hr>
              <code>Disabled</code>
            </b-card>
            <div class="py-3">
              <b-link href="#">
                <small>ดูรายการ API ทั้งหมด</small>
              </b-link>
            </div>
          </b-tab>
          <b-tab title="ตั้งค่า API สำหรับข้อความโต้ตอบ">
            <b-card class="text-left">
              <h6 class="bold">Channel access token</h6>
              <hr>
              <code>{{setting.LINE_ACCESS_TOKEN ? setting.LINE_ACCESS_TOKEN : 'Disabled'}}</code>
            </b-card>
            <b-card class="text-left mt-2">
              <h6 class="bold">Channel secret</h6>
              <hr>
              <code>{{setting.LINE_SECRET ? setting.LINE_SECRET : 'Disabled'}}</code>
            </b-card>
          </b-tab>
          <b-tab title="ลิงค์เชื่อมต่อ" active>
            <b-img
              rounded
              fluid
              src="https://developers.line.biz/media/liff/overview/viewTypes-4cb714f3.png"
              alt
            />
            <b-card class="text-left mt-2">
              <h6 class="bold">Compact</h6>
              <hr>
              <code>{{setting.liff_compact}}</code>
            </b-card>
            <b-card class="text-left mt-2">
              <h6 class="bold">Tall</h6>
              <hr>
              <code>{{setting.liff_tall}}</code>
            </b-card>
            <b-card class="text-left mt-2">
              <h6 class="bold">Full</h6>
              <hr>
              <code>{{setting.liff_full}}</code>
            </b-card>
          </b-tab>
        </b-tabs>
      </div>
      <b-alert v-else variant="light" class="text-center" show>
        <fa icon="exclamation-circle" size="2x" class="mt-2"/>
        <h5 class="mt-3">คุณยังไม่ได้เปิดใช้งาน</h5>
        <b-button
          variant="primary"
          class="px-5 mb-3 mt-2"
          @click="onClickOpenApi()"
        >เปิดใช้งานตอนนี้</b-button>
      </b-alert>
    </b-container>
    <loading :active.sync="asyncSource" :is-full-page="false" :opacity=".7" :height="34"></loading>
  </div>
</template>

<script>
export default {
  layout: "default",
  head() {
    return {
      title: "ตั้งค่าแอปพลิเคชัน"
    };
  },
  data() {
    return {
      setting: null
    };
  },
  created() {
    this.fetch();
  },
  computed: {
    asyncSource() {
      return this.$store.state.source;
    }
  },
  methods: {
    async onClickOpenApi() {
      let self = this;
      this.$swal
        .fire({
          title: "เปิดใช้งาน",
          text: "รับ URL สำหรับการเชื่อมโยงไปยัง LINE@",
          type: "question",
          showCancelButton: false,
          confirmButtonText: "เปิดใช้งาน"
        })
        .then(async result => {
          if (result.value) {
            self.$store.dispatch("sourceLoaded", true);
            self.$axios
              .$post(`/v2/etp-setting/${self.$store.state.user.entId}`, {
                open: true
              })
              .then(function(res) {
                if (res) {
                  self.$toast.info("เปิดใช้งาน API เรียบร้อยแล้ว", {
                    theme: "bubble",
                    position: "bottom-right",
                    duration: 2000
                  });
                  self.fetch();
                }
              });
          }
        });
      self.$store.dispatch("sourceLoaded", false);
    },
    async fetch() {
      let self = this;
      this.$store.dispatch("sourceLoaded", true);
      await this.$axios
        .$get(`/v2/etp-setting/${this.$store.state.user.entId}`)
        .then(function(res) {
          if (res.length > 0) {
            self.setting = res[0];
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
.form-control {
  border: 1px solid #ced4da;
  height: auto !important;
}
</style>
