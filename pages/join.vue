<template>
  <b-container class="container-height-single bg-image">
    <b-jumbotron
      fluid
      header="สร้างหรือเข้าร่วมโครงการ"
      lead="Workforce management system for non-routine on Line Application."
      style="background-color: transparent; color: white"
      class="pb-0"
    >
      <b-button variant="outline-danger" @click="onClickSignOut">ออกจากระบบ</b-button>
    </b-jumbotron>
    <b-container>
      <b-row align-content="center">
        <b-col md="6" class="mt-3">
          <b-card>
            <h5 class="text-center py-3 pb-4">สร้างโครงการของคุณ</h5>
            <b-form-group
              id="entName"
              label="ชื่อ"
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

            <b-form-group id="entAddress" label="ที่ตั้ง" label-for="entAddress" class="px-3">
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
            <b-form-group id="entIdentity" label="รหัสทะเบียน" label-for="entIdentity" class="px-3">
              <b-form-input
                id="entIdentity"
                v-model.trim="createForm.entIdentity"
                autocomplete="off"
                placeholder="0-00-00-00/0-0000"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="entTel"
              label="โทรศัพท์"
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
          </b-card>
        </b-col>
        <b-col md="6" class="mt-3">
          <b-row class="mb-2">
            <b-col>
              <b-card
                class="text-center text-dark package"
                bg-variant="light"
                @click="()=> createForm.entPackage = 1"
              >
                <h5 class="pt-3 text-dark">Member</h5>
                <fa icon="star"/>

                <h6 class="h-normal pt-3 text-dark">ฟรี</h6>
                <small>*ไม่เสียค่าใช้จ่าย</small>
                <br>
                <b-form-radio :value="1" v-model="createForm.entPackage" name="entPackage">
                  <small class="text-dark">ปัจจุบัน</small>
                </b-form-radio>
              </b-card>
            </b-col>
            <b-col lg="4" class="mb-2">
              <b-card class="text-center text-light package" bg-variant="secondary">
                <h5 class="pt-3 text-light">Silver</h5>
                <fa icon="star"/>
                <fa icon="star"/>
                <h6 class="h-normal pt-3 text-light">฿300/เดือน</h6>
                <small>*฿3,300/ปี</small>
                <br>
                <b-form-radio :value="2" disabled name="entPackage">
                  <small class="text-light">ไม่มีแพ็กเกจ</small>
                </b-form-radio>
              </b-card>
            </b-col>
            <b-col>
              <b-card class="text-center text-dark package" bg-variant="warning">
                <h5 class="pt-3 text-dark">Gold</h5>
                <fa icon="star"/>
                <fa icon="star"/>
                <fa icon="star"/>
                <h6 class="h-normal pt-3 text-dark">฿480/เดือน</h6>
                <small>*฿5,500/ปี</small>
                <br>
                <b-form-radio :value="3" disabled name="entPackage">
                  <small class="text-dark">ไม่มีแพ็กเกจ</small>
                </b-form-radio>
              </b-card>
            </b-col>
          </b-row>
          <div class="mb-3">
            <b-button
              :variant="!stateText || !stateTel ? 'secondary' : 'success'"
              :disabled="!stateText || !stateTel"
              @click="onClickCreateCompany"
              block
            >สร้าง</b-button>
          </div>
          <b-card class="text-left" bg-variant="dark">
            <h5 class="text-center py-3 pb-4 text-light">หรือกรอกรหัสเพื่อเข้าร่วมได้ที่นี่</h5>
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
              >ส่งคำขอเข้าร่วม</b-button>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true" :height="34"></loading>
  </b-container>
</template>

<script>
import firebase from "./../configs/firebase.sdk.js";
export default {
  layout: "single",
  head() {
    return {
      title: "สร้างหรือเข้าร่วมโครงการ"
    };
  },
  data() {
    return {
      keyInvite: "",
      isLoading: false,
      createForm: {
        entName: "Unfac",
        entIdentity: "0-00-00-00/0-0000",
        entDomain: "",
        entTel: "0957192597",
        entAddress: "",
        entPostal: "",
        district: "",
        amphoe: "",
        province: "",
        entPackage: 1
      }
    };
  },
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
      const valid = /^[0]{0,9}[2-9]{1}[0-9]{8}$/;
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
          this.$toast.info(
            `ส่งคำขอเข้าร่วม ${
              isCode.data[0].entName
            } เรียบร้อยแล้ว โปรดรอการตอบรับ`,
            {
              theme: "bubble",
              position: "bottom-center",
              duration: 4000
            }
          );
          this.isLoading = false;
        } else {
          this.$toast.info(`โปรดรอการตอบรับจาก ${isCodeInvite.data.entName}`, {
            theme: "bubble",
            position: "bottom-center",
            duration: 4000
          });
          this.isLoading = false;
        }
      } else {
        this.$toast.error(
          `รหัสเข้าร่วม (<small><i>${this.keyInvite}</i></small>) ไม่ถูกต้อง`,
          {
            theme: "bubble",
            position: "bottom-center",
            duration: 2000
          }
        );
        this.isLoading = false;
      }
    },
    onClickCreateCompany() {
      let self = this;
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
          entPackage: this.createForm.entPackage,
          entIdentity: this.createForm.entIdentity,
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
              const res = await self.$axios.post(`/v2/enterprise`, form);
              if (res.data.insertId) {
                const UserUpdate = await self.$axios.put(
                  `/v2/account/enterpise/${this.$store.state.user.lineId}`,
                  { entId: res.data.insertId }
                );
                if (UserUpdate) {
                  this.$toast.info(
                    `โครงการของคุณถูกสร้างเรียบร้อยแล้ว ระบบกำลังคุณไปยังระบบจัดการ`,
                    {
                      theme: "bubble",
                      position: "bottom-center",
                      duration: 3000
                    }
                  );
                  setTimeout(() => {
                    self.$router.go({ path: "/" });
                  }, 1000);
                } else {
                  this.isLoading = false;
                }
              } else {
                this.isLoading = false;
                this.$toast.error(
                  `ไม่สามารถสร้างโครงการได้ โปรดลองใหม่อีกครั้ง`,
                  {
                    theme: "bubble",
                    position: "bottom-center",
                    duration: 3000
                  }
                );
              }
            }
          });
      } else {
        this.$toast.error(`โปรดกรอกข้อมูลให้ครบถ้วน`, {
          theme: "bubble",
          position: "bottom-center",
          duration: 2000
        });
      }
    },
    onClickSignOut() {
      this.$store.commit("setLoading", true);
      firebase.auth().signOut();
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
  color: var(--light);
}
.form-control {
  border: 1px solid var(--gray-light);
}
.container-height-single {
  display: block;
}
.list-container {
  max-height: 210px;
}
.package {
  transition: transform 0.2s;
  cursor: pointer;
}
.package:hover {
  transform: scale(1.05);
}
</style>
