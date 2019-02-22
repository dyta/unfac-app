<template>
  <div>
    <b-jumbotron
      fluid
      header="ตั้งค่าแอปพลิเคชัน"
      class="jumbotron-special"
      lead="เชื่อมโยงระบบ Unfac ไปยัง LINE@ ของคุณ"
    ></b-jumbotron>

    <b-container>
      <div v-if="!asyncSource && setting">
        <b-tabs vertical nav-wrapper-class="col-12 col-md-4" content-class="col-12 col-md-8 px-4">
          <b-tab title="คีย์ API ของเว็บ" active>
            <b-card>
              <h6 class="bold">API KEY</h6>
              <hr>
              <div class="text-center">
                <code>{{setting.API_KEY}}</code>
              </div>
            </b-card>
            <b-card class="mt-3">
              <h6 class="bold">Webhook URL</h6>
              <hr>
              <div class="text-center">
                <fa icon="exclamation-circle" size="3x" color="orange" class="mt-2"/>
                <h6 class="mt-3">ไม่พร้อมใช้งาน</h6>
              </div>
            </b-card>
            <div class="py-3">
              <b-link href="#">
                <small>ดูรายการ API ทั้งหมด</small>
              </b-link>
            </div>
          </b-tab>
          <b-tab title="LINE Webhooks">
            <b-card>
              <h6 class="bold">Channel access token</h6>
              <hr>
              <div class="text-center">
                <fa icon="exclamation-circle" size="3x" color="orange" class="mt-2"/>
                <h6 class="mt-3">ไม่พร้อมใช้งาน</h6>
              </div>
            </b-card>
            <b-card class="mt-3">
              <h6 class="bold">Channel secret</h6>
              <hr>
              <div class="text-center">
                <fa icon="exclamation-circle" size="3x" color="orange" class="mt-2"/>
                <h6 class="mt-3">ไม่พร้อมใช้งาน</h6>
              </div>
            </b-card>
          </b-tab>
          <b-tab title="LINE Front-end Framework (LIFF)">
            <b-img
              rounded
              fluid
              src="https://developers.line.biz/media/liff/overview/viewTypes-4cb714f3.png"
              alt="Line Liff descriptions"
            />
            <b-card class="mt-3">
              <h6 class="bold">แสดงงาน</h6>
              <hr>
              <b-row>
                <b-col lg="2">
                  <small>Compact:</small>
                </b-col>
                <b-col>
                  <code>{{setting.liff_compact_home}}</code>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="2">
                  <small>Tall:</small>
                </b-col>
                <b-col>
                  <code>{{setting.liff_tall_home}}</code>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="2">
                  <small>Full:</small>
                </b-col>
                <b-col>
                  <code>{{setting.liff_full_home}}</code>
                </b-col>
              </b-row>
            </b-card>
            <b-card class="mt-3">
              <h6 class="bold">ประวัติการรับงาน</h6>
              <hr>
              <b-row>
                <b-col lg="2">
                  <small>Compact:</small>
                </b-col>
                <b-col>
                  <code>{{setting.liff_compact_history}}</code>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="2">
                  <small>Tall:</small>
                </b-col>
                <b-col>
                  <code>{{setting.liff_tall_history}}</code>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="2">
                  <small>Full:</small>
                </b-col>
                <b-col>
                  <code>{{setting.liff_full_history}}</code>
                </b-col>
              </b-row>
            </b-card>
            <b-card class="mt-3">
              <h6 class="bold">สรุปรายได้ของพนักงาน</h6>
              <hr>
              <b-row>
                <b-col lg="2">
                  <small>Compact:</small>
                </b-col>
                <b-col>
                  <code>{{setting.liff_compact_wallet}}</code>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="2">
                  <small>Tall:</small>
                </b-col>
                <b-col>
                  <code>{{setting.liff_tall_wallet}}</code>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="2">
                  <small>Full:</small>
                </b-col>
                <b-col>
                  <code>{{setting.liff_full_wallet}}</code>
                </b-col>
              </b-row>
            </b-card>
            <b-card class="mt-3">
              <h6 class="bold">ข้อมูลส่วนตัวของพนักงาน</h6>
              <hr>
              <b-row>
                <b-col lg="2">
                  <small>Compact:</small>
                </b-col>
                <b-col>
                  <code>{{setting.liff_compact_account}}</code>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="2">
                  <small>Tall:</small>
                </b-col>
                <b-col>
                  <code>{{setting.liff_tall_account}}</code>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="2">
                  <small>Full:</small>
                </b-col>
                <b-col>
                  <code>{{setting.liff_full_account}}</code>
                </b-col>
              </b-row>
            </b-card>
          </b-tab>
          <b-tab title="ลิงค์กำหนดเอง">
            <b-card class="text-center">
              <fa icon="exclamation-circle" size="3x" color="orange" class="mt-2"/>
              <h5 class="mt-3">ไม่พร้อมใช้งาน</h5>
            </b-card>
          </b-tab>
        </b-tabs>
      </div>
      <b-card v-else-if="!setting && !asyncSource" class="text-center mt-3">
        <fa icon="exclamation-circle" size="3x" color="orange" class="mt-2"/>
        <h5 class="mt-3">คุณยังไม่ได้เปิดใช้งาน</h5>
        <b-button
          variant="primary"
          class="px-5 mb-3 mt-2"
          @click="onClickOpenApi()"
        >เปิดใช้งานตอนนี้</b-button>
      </b-card>
    </b-container>
    <loading :active.sync="asyncSource" :is-full-page="false" :opacity=".1" :height="34"></loading>
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
.card {
  box-shadow: 0 0 1em var(--gray-light);
}
</style>
