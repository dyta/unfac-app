<template>
  <b-container class="container-height-single bg-image">
    <b-jumbotron
      fluid
      header="สร้างหรือเข้าร่วมเครือข่าย"
      lead="Workforce management system for non-routine on Line Application."
      style="background-color: transparent; color: white"
      class="pb-0"
    ></b-jumbotron>
    <b-container>
      <b-row align-content="center">
        <b-col md="6" class="mt-3">
          <b-card>
            <h5 class="text-center py-3 pb-4">สร้างระบบของคุณ</h5>
            <b-form-group
              id="invite"
              label="ชื่อองค์กร/ร้านค้า"
              label-for="invite"
              :state="stateKInvite"
            >
              <b-form-input
                id="invite"
                :state="stateKInvite"
                v-model.trim="keyInvite"
                autocomplete="off"
                placeholder="UNFAC company"
              ></b-form-input>
            </b-form-group>
            <b-form-group id="invite" label="เบอร์โทร" label-for="invite" :state="stateKInvite">
              <b-form-input
                id="invite"
                :state="stateKInvite"
                v-model.trim="keyInvite"
                autocomplete="off"
                placeholder="เบอร์โทรติดต่อ"
              ></b-form-input>
            </b-form-group>
            <b-form-group id="invite" label="ที่อยู่" label-for="invite">
              <b-form-input id="invite" v-model.trim="keyInvite" autocomplete="off"></b-form-input>
            </b-form-group>
            <b-form-group id="invite" label="รหัสไปรษณีย์" label-for="invite">
              <b-form-input id="invite" v-model.trim="keyInvite" autocomplete="off"></b-form-input>
            </b-form-group>
            <b-form-group id="invite" label="ประเทศ" label-for="invite">
              <b-form-input autocomplete="off" value="ไทย" disabled></b-form-input>
            </b-form-group>
            <b-button
              :variant="!stateKInvite ? 'secondary' : 'success'"
              :disabled="!stateKInvite"
              block
            >สร้าง</b-button>
          </b-card>
        </b-col>
        <b-col md="6" class="mt-3">
          <b-card class="text-left">
            <h5 class="text-center py-3 pb-4">กรอกรหัสเพื่อเข้าร่วมได้ที่นี่</h5>
            <b-form-group>
              <b-form-input
                :state="stateKInvite"
                v-model.trim="keyInvite"
                autocomplete="off"
                placeholder="A8ZU8VWJmzuXKjFR"
              ></b-form-input>
            </b-form-group>
            <b-button
              :variant="!stateKInvite ? 'secondary' : 'success'"
              :disabled="!stateKInvite"
              block
            >ขอเข้าร่วม</b-button>
          </b-card>
          <div class="text-left my-5 px-5 mx-5">
            <b-button block variant="danger" @click="onClickSignOut">ออกจากระบบ</b-button>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
export default {
  layout: "single",
  head() {
    return {
      title: "Join a Company"
    };
  },
  data() {
    return {
      keyInvite: ""
    };
  },
  created() {},
  computed: {
    stateKInvite() {
      return this.keyInvite.length === 16 &&
        this.keyInvite[15] === "R" &&
        this.keyInvite[14] === "F"
        ? true
        : false;
    }
  },
  methods: {
    onClickSignOut() {
      this.$store.dispatch("loaded");
      setTimeout(() => {
        this.$store.dispatch("signOut");
        this.$router.go({ path: "/" });
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.display-3 {
  font-size: 2rem !important;
}
.form-control {
  border: 1px solid var(--border);
}
.container-height-single {
  display: block;
}
</style>
