<template>
  <b-container class="container-height-single bg-image">
    <b-jumbotron
      fluid
      header="สร้างหรือเข้าร่วมเครือข่ายงาน"
      lead="Workforce management system for non-routine on Line Application."
      style="background-color: transparent; color: white"
      class="pb-0"
    ></b-jumbotron>
    <b-container>
      <b-row align-content="center">
        <b-col md="6" class="mt-3">
          <b-card>
            <h5 class="text-center py-3 pb-4">สร้างเครือข่ายงานของคุณ</h5>
            <b-form-group
              id="entName"
              label="ชื่อองค์กร/ร้านค้า"
              label-for="entName"
              :state="stateText"
              class="px-3"
            >
              <b-form-input
                id="entName"
                :state="stateText"
                v-model.trim="createForm.entName"
                autocomplete="off"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="entAddress" label="ที่อยู่" label-for="entAddress" class="px-3">
              <b-form-input
                id="entAddress"
                v-model.trim="createForm.entAddress"
                autocomplete="off"
                placeholder="120/784 หมู่ 3 อาคาร S ชั้น 11"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="รหัสไปรษณีย์" class="px-3"></b-form-group>
            <no-ssr placeholder="กำลังโหลด...">
              <div style="margin-top: -1rem">
                <ThailandAutoComplete
                  v-model="createForm.entPostal"
                  type="zipcode"
                  @select="select"
                  size="medium"
                />
              </div>
            </no-ssr>
            <b-form-group
              id="entTel"
              label="เบอร์โทร"
              label-for="entTel"
              class="px-3"
              :state="stateTel"
            >
              <b-form-input
                id="entTel"
                :state="stateTel"
                v-model.trim="createForm.entTel"
                autocomplete="off"
                placeholder="0987654321"
              ></b-form-input>
            </b-form-group>
            <b-form-group id="entDomain" label="เว็บไซต์" label-for="entDomain" class="px-3">
              <b-form-input
                id="entDomain"
                v-model.trim="createForm.entDomain"
                autocomplete="off"
                placeholder="URL"
              ></b-form-input>
            </b-form-group>
            <div class="px-3">
              <b-button
                :variant="!stateText || !stateTel ? 'secondary' : 'success'"
                :disabled="!stateText || !stateTel"
                @click="onClickCreateCompany"
                block
              >สร้าง</b-button>
            </div>
          </b-card>
        </b-col>
        <b-col md="6" class="mt-3">
          <b-card class="text-left">
            <h5 class="text-center py-3 pb-4">กรอกรหัสเพื่อเข้าร่วมได้ที่นี่</h5>
            <b-form-group class="mx-3">
              <b-form-input
                :state="stateKInvite"
                v-model.trim="keyInvite"
                autocomplete="off"
                placeholder="รหัส 16 หลัก"
              ></b-form-input>
            </b-form-group>
            <div class="mx-3">
              <b-button
                :variant="!stateKInvite ? 'secondary' : 'success'"
                :disabled="!stateKInvite"
                @click="OnClickJoinWithCode"
                block
              >ขอเข้าร่วม</b-button>
            </div>
          </b-card>
          <div class="text-left my-5 px-5 mx-5">
            <b-button block variant="danger" @click="onClickSignOut">ออกจากระบบ</b-button>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true" :height="34"></loading>
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
      keyInvite: "",
      isLoading: false,
      createForm: {
        entName: "",
        entDomain: "",
        entTel: "",
        entAddress: "",
        entPostal: "",
        district: "",
        amphoe: "",
        province: ""
      }
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
    },
    validBtn() {
      return this.createForm.entAddress.length > 1 &&
        this.createForm.entPostal.length > 4 &&
        this.createForm.district.length > 0 &&
        this.createForm.amphoe.length > 0 &&
        this.createForm.province.length > 0
        ? true
        : false;
    },
    stateText() {
      return this.createForm.entName.length >= 2 ? true : false;
    },
    stateTel() {
      const valid = /^[0]{0,1}[2-9]{1}[0-9]{8}$/;
      return valid.test(this.createForm.entTel) ? true : false;
    }
  },
  methods: {
    select(address) {
      this.createForm.district = address.district;
      this.createForm.amphoe = address.amphoe;
      this.createForm.province = address.province;
      this.createForm.entPostal = address.zipcode;
    },
    async OnClickJoinWithCode() {
      this.isLoading = true;
      const isCode = await this.$axios.get(
        `/v2/enterprise/isCode/${this.keyInvite}`
      );
      if (isCode.data[0]) {
        const isCodeInvite = await this.$axios.get(
          `/v2/invite/${this.$store.state.user.userId}/${this.keyInvite}`
        );
        if (isCodeInvite.data.exists === 0 || !isCodeInvite.data.entName) {
          const RequestInvite = await this.$axios.post(`/v2/invite`, {
            entId: isCode.data[0].entId,
            userId: this.$store.state.user.userId,
            entName: isCode.data[0].entName,
            code: this.keyInvite
          });
          this.$toast.success(
            `ส่งคำขอเข้าร่วม ${
              isCode.data[0].entName
            } เรียบร้อยแล้ว โปรดรอการตอบรับ`,
            {
              theme: "outline",
              position: "bottom-center",
              duration: 4000
            }
          );
          this.isLoading = false;
        } else {
          this.$toast.info(`โปรดรอการตอบรับจาก ${isCodeInvite.data.entName}`, {
            theme: "outline",
            position: "bottom-center",
            duration: 4000
          });
          this.isLoading = false;
        }
      } else {
        this.$toast.error(
          `รหัสเข้าร่วม (<small><i>${this.keyInvite}</i></small>) ไม่ถูกต้อง`,
          {
            theme: "outline",
            position: "bottom-center",
            duration: 2000
          }
        );
        this.isLoading = false;
      }
    },
    onClickCreateCompany() {
      let _this = this;
      if (this.validBtn) {
        let form = {
          entName: this.createForm.entName,
          entDomain: this.createForm.entDomain,
          entAddress:
            this.createForm.entAddress +
            " " +
            this.createForm.district +
            " " +
            this.createForm.amphoe +
            " " +
            this.createForm.province +
            " " +
            this.createForm.entPostal,
          entPackage: 0,
          entTel: this.createForm.entTel
        };
        this.$swal
          .fire({
            title: "ข้อกำหนดและเงื่อนไข",
            input: "checkbox",
            inputValue: null,
            inputPlaceholder:
              "ฉันเห็นด้วยกับข้อกำหนดและเงื่อนไขกับทาง Unfac.co",
            confirmButtonText: "ยืนยันการสร้าง",
            inputValidator: result => {
              return !result && "คุณต้องเห็นด้วยกับข้อกำหนดและเงื่อนไข";
            }
          })
          .then(async result => {
            if (result.value) {
              this.isLoading = true;
              const res = await _this.$axios.post(`/v2/enterprise`, form);
              if (res.data.insertId) {
                const UserUpdate = await _this.$axios.put(
                  `/v2/account/enterpise/${this.$store.state.user.lineId}`,
                  { entId: res.data.insertId }
                );
                if (UserUpdate) {
                  this.$toast.success(
                    `เครือข่ายงานของคุณถูกสร้างเรียบร้อยแล้ว ระบบกำลังคุณไปยังระบบจัดการ`,
                    {
                      theme: "outline",
                      position: "bottom-center",
                      duration: 3000
                    }
                  );
                  setTimeout(() => {
                    _this.$router.go({ path: "/" });
                  }, 1000);
                } else {
                  this.isLoading = false;
                }
              } else {
                this.isLoading = false;
                this.$toast.error(
                  `ไม่สามารถสร้างเครือข่ายงานได้ โปรดลองใหม่อีกครั้ง`,
                  {
                    theme: "outline",
                    position: "bottom-center",
                    duration: 3000
                  }
                );
              }
            }
          });
      } else {
        this.$toast.error(`โปรดกรอกข้อมูลให้ครบถ้วน`, {
          theme: "outline",
          position: "bottom-center",
          duration: 2000
        });
      }
    },
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
.list-container {
  max-height: 210px;
}
</style>
