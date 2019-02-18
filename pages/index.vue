<template>
  <b-container class="container-height">
    <div class="login" v-if="!user && !line">
      <img class="logo" src="~/assets/images/logo.png" alt="Unfac.co">
      <h3>ลงชื่อเข้าใช้</h3>
      <p>Workforce management system
        <br>for non-routine on Line Application.
      </p>
      <div>
        <b-button
          size="lg"
          variant="primary"
          class="btn-line"
          href="/user/authorize"
        >เชื่อมต่อด้วยบัญชี Line</b-button>
      </div>
      <small class="copy-right">&copy; 2019 unfac.co</small>
    </div>
    <div v-else-if="line && !user && !auth">
      <div class="login">
        <b-img rounded="circle" :src="line.picture" width="100" :alt="auth.name"/>
        <div class="text-left mb-3">
          <b-form-group
            id="fieldset1"
            label="ชื่อ - นามสกุล"
            label-for="fullname"
            :state="stateFullname"
          >
            <b-form-input
              id="fullname"
              :state="stateFullname"
              v-model.trim="input.fullname"
              autocomplete="off"
            ></b-form-input>
          </b-form-group>
          <b-form-group id="fieldset1" label="ที่อยู่อีเมล" label-for="email" :state="stateEmail">
            <b-form-input
              type="email"
              id="email"
              :state="stateEmail"
              v-model.trim="input.email"
              autocomplete="off"
              placeholder="example@example.com"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="fieldset1"
            label="เบอร์โทรติดต่อ"
            label-for="phoneNumber"
            :state="statePhone"
          >
            <b-form-input
              id="phoneNumber"
              :state="statePhone"
              v-model.trim="input.phoneNumber"
              autocomplete="off"
              placeholder="0987654321"
            ></b-form-input>
          </b-form-group>
          <div class="btn-area mt-4">
            <b-button
              size="lg"
              :variant="!stateFullname || !stateEmail || !statePhone ? 'secondary' : 'success'"
              class="btn-block"
              @click="onClickVerify"
              :disabled="!stateFullname || !stateEmail || !statePhone"
            >ดำเนินการต่อ &rarr;</b-button>
            <b-button
              size="lg"
              variant="outline-danger"
              class="btn-block"
              @click="onClickSignOut"
            >ออกจากระบบ</b-button>
          </div>
        </div>
        <small class="copy-right">&copy; 2019 unfac.co</small>
      </div>
      <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true" :height="34"></loading>
    </div>
    <div v-else>
      <div class="login">
        <loading
          :active.sync="this.passign = true"
          :can-cancel="false"
          :is-full-page="true"
          :height="34"
        ></loading>
      </div>
    </div>
  </b-container>
</template>

<script>
export default {
  name: "Login",
  layout: "blank",
  head() {
    return {
      title: this.passign
        ? "กำลังเปลี่ยนเส้นทาง..."
        : "Management Console - Unfac.co"
    };
  },
  data() {
    return {
      passign: false,
      isLoading: false,
      input: {
        fullname: "",
        email: "",
        phoneNumber: "",
        verify: true
      }
    };
  },
  watch: {
    passign() {
      if (this.passign) {
        setTimeout(() => {
          this.$router.push("/overview");
        }, 800);
      }
    }
  },
  computed: {
    auth() {
      return this.$store.state.auth;
    },
    user() {
      return this.$store.state.user;
    },
    line() {
      return this.$store.state.line;
    },
    stateFullname() {
      return this.input.fullname.length >= 8 ? true : false;
    },
    stateEmail() {
      const valid = /\S+@\S+\.\S+/;
      return valid.test(this.input.email);
    },
    statePhone() {
      const valid = /^[0]{0,1}[2-9]{1}[0-9]{8}$/;
      return valid.test(this.input.phoneNumber) ? true : false;
    }
  },
  methods: {
    onClickSignOut() {
      this.isLoading = true;
      setTimeout(() => {
        this.$store.dispatch("signOut");
        this.$router.go({ path: "/" });
      }, 1000);
    },
    async onClickVerify() {
      let self = this;
      if (this.stateFullname && this.stateEmail && this.statePhone) {
        let data = { ...this.line, ...this.input };
        let line = this.$store.state.line;
        this.$swal
          .fire({
            title: "ข้อกำหนดและเงื่อนไข",
            input: "checkbox",
            inputValue: null,
            inputPlaceholder:
              "ฉันเห็นด้วยกับข้อกำหนดและเงื่อนไขกับทาง Unfac.co",
            confirmButtonText: "ยืนยันการสร้างบัญชี",
            inputValidator: result => {
              return !result && "คุณต้องเห็นด้วยกับข้อกำหนดและเงื่อนไข";
            }
          })
          .then(async result => {
            if (result.value) {
              try {
                this.isLoading = true;
                data.phoneNumber = "+66" + data.phoneNumber.substring(1, 10);
                const createUser = await this.$axios.post(
                  `/v2/account/create`,
                  data
                );

                if (createUser) {
                  // query
                  const response = await this.$axios.get(
                    `/v2/account/${line.uid}`
                  );

                  this.$store.commit("setUser", response.data[0]);
                  // insert to auth
                  const newObj = Object.assign({}, line);
                  const merge = Object.assign(
                    newObj,
                    new Object(response.data[0])
                  );

                  const _createUser = await this.$axios.post(
                    `/v2/account/auth`,
                    merge
                  );
                  if (_createUser) {
                    // auth
                    const token = await this.$axios.post(
                      `/v2/account/token`,
                      line
                    );
                    this.$store.dispatch("signInWithToken", token.data);
                    commit("setLoading", false);
                  }
                }
                this.$toast.info(`บัญชีของคุณถูกสร้างเรียบร้อยแล้ว`, {
                  theme: "bubble",
                  position: "bottom-center",
                  duration: 3000
                });
              } catch (error) {
                this.isLoading = false;
              }
            }
          });
      } else {
        this.$toast.error(`รูปแบบข้อมูลไม่ถูกต้อง`, {
          theme: "bubble",
          position: "bottom-center",
          duration: 2000
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

