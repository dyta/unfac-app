

<template>
  <div>
    <b-jumbotron
      fluid
      header="บัญชีของฉัน"
      lead="Workforce management system for non-routine on Line Application."
      class="jumbotron-special"
    ></b-jumbotron>

    <b-container class="mb-5">
      <b-tabs vertical nav-wrapper-class="col-12 col-md-4" content-class="col-12 col-md-8 px-4">
        <b-tab title="ข้อมูลบัญชี" active>
          <b-card class="text-left">
            <b-form-group
              label-cols="4"
              label-cols-lg="2"
              label-size="sm"
              label="ชื่อที่ใช้แสดง (Line)"
              label-for="userDisplayName"
            >
              <b-form-input id="userDisplayName" disabled size="sm" v-model="user.userDisplayName"/>
            </b-form-group>
            <b-form-group
              label-cols="4"
              label-cols-lg="2"
              label-size="sm"
              label="ชื่อ-นามสกุล"
              label-for="userFullname"
            >
              <b-form-input id="userFullname" disabled size="sm" v-model="user.userFullname"/>
            </b-form-group>
            <b-form-group
              label-cols="4"
              label-cols-lg="2"
              label-size="sm"
              label="เบอร์โทรศัพท์"
              label-for="userPhoneNumber"
            >
              <b-form-input id="userPhoneNumber" disabled size="sm" v-model="user.userPhoneNumber"/>
            </b-form-group>
            <b-form-group
              label-cols="4"
              label-cols-lg="2"
              label-size="sm"
              label="ที่อยู่อีเมล์"
              label-for="userEmail"
            >
              <b-form-input id="userEmail" disabled size="sm" v-model="user.userEmail"/>
            </b-form-group>
            <b-form-group
              label-cols="4"
              label-cols-lg="2"
              label-size="sm"
              label="สถานะ"
              label-for="userStatus"
            >
              <b-form-input
                id="userStatus"
                size="sm"
                disabled
                :value="user.userStatus ? `Actived / ${user.userRole == 2 ? 'Owner' : 'Collaborator'}` : `Inactivated / ${user.userRole == 2 ? 'Owner' : 'Collaborator'}`"
              />
            </b-form-group>
          </b-card>
        </b-tab>
        <b-tab title="ข้อมูลแพ็กเกจ">
          <b-card class="text-center" v-if="mypackage">
            <h6 class="bold text-left">แพ็กเกจปัจจุบัน</h6>
            <hr>
            <fa
              icon="star"
              size="2x"
              color="orange"
              class="mt-2"
              v-for="(item, index) in _package(mypackage.entPackage).star"
              :key="index"
            />
            <h5 class="mt-3">{{_package(mypackage.entPackage).title}}</h5>
            <small>{{_package(mypackage.entPackage).price}}</small>
          </b-card>
        </b-tab>
        <b-tab title="การเรียกเก็บเงิน">
          <b-card class="text-center">
            <fa icon="exclamation-circle" size="3x" color="orange" class="mt-2"/>
            <h5 class="mt-3">ไม่พร้อมใช้งาน</h5>
          </b-card>
        </b-tab>
      </b-tabs>
    </b-container>
    <loading :active.sync="asyncSource" :is-full-page="false" :opacity=".3" :height="34"></loading>
  </div>
</template>

<script>
export default {
  layout: "default",
  head() {
    return {
      title: "บัญชีของฉัน"
    };
  },
  data() {
    return {
      mypackage: null
    };
  },
  created() {
    this.fetch();
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
    _package(key) {
      switch (key) {
        case 1:
          return {
            title: "Silver",
            star: 2,
            price: `หมดอายุ: ${this.$moment().add(
              180,
              "days"
            )} (${this.$moment()
              .add(180, "days")
              .fromNow()})`
          };
          break;
        case 2:
          return {
            title: "Gold",
            star: 3,
            price: `หมดอายุ: ${this.$moment().add(
              600,
              "days"
            )} (${this.$moment()
              .add(600, "days")
              .fromNow()})`
          };
          break;

        default:
          return {
            title: "Member",
            star: 1,
            price: "ฟรีไม่เสียค่าใช้จ่ายตลอดชีพ *ไม่จำกัดการใช้งาน"
          };
          break;
      }
    },
    async fetch() {
      let self = this;
      this.$store.dispatch("sourceLoaded", true);
      await this.$axios
        .$get(`/v2/etp-setting/${this.$store.state.user.entId}`)
        .then(function(res) {
          if (res.length > 0) {
            self.mypackage = res[0];
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
