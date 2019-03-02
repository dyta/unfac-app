<template>
  <div>
    <b-container>
      <div class="pt-1">
        <b-breadcrumb class="px-0 mt-4 border-bottom" :items="sub_nav"/>
      </div>
      <h1 class="display-3 my-3">สร้างงาน</h1>
      <hr>
      <b-row class="justify-content-md-center">
        <b-col col lg="2"></b-col>
        <b-col cols="12" lg="6" class="px-3">
          <b-form-group
            id="customerNameLabel"
            label="ผู้สั่งทำ"
            label-for="customerNameLabel"
            description="ชื่อผู้สั่งทำหรือชื่อผู้ติดต่อ"
            :state="stateCustomerName"
          >
            <b-form-input
              id="customerNameLabel"
              :state="stateCustomerName"
              v-model.trim="data.customerName"
              autocomplete="off"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="customerTelLabel"
            label="การติดต่อ"
            label-for="customerNameLabel"
            description="เบอร์โทรผู้สั่งทำ"
          >
            <b-form-input id="customerTelLabel" v-model.trim="data.customerTel" autocomplete="off"></b-form-input>
          </b-form-group>
          <b-form-group id="customerAddress" label="ที่ตั้ง" label-for="customerAddress">
            <b-form-input
              id="customerAddress"
              v-model.trim="data.customerAddress"
              autocomplete="off"
              placeholder="120/784 หมู่ 3 อาคาร S ชั้น 11"
            ></b-form-input>
          </b-form-group>
          <b-form-group label="ตำบล">
            <no-ssr placeholder="กำลังโหลด...">
              <div class="p-0">
                <ThailandAutoComplete
                  v-model="data.cusDistrict"
                  type="district"
                  @select="select"
                  size="medium"
                />
              </div>
            </no-ssr>
          </b-form-group>
          <b-form-group label="อำเภอ">
            <no-ssr placeholder="กำลังโหลด...">
              <div class="p-0">
                <ThailandAutoComplete
                  v-model="data.cusAmphoe"
                  type="amphoe"
                  @select="select"
                  size="medium"
                />
              </div>
            </no-ssr>
          </b-form-group>
          <b-form-group label="จังหวัด">
            <no-ssr placeholder="กำลังโหลด...">
              <div class="p-0">
                <ThailandAutoComplete
                  v-model="data.cusProvince"
                  type="province"
                  @select="select"
                  size="medium"
                />
              </div>
            </no-ssr>
          </b-form-group>
          <b-form-group label="รหัสไปรษณีย์">
            <no-ssr placeholder="กำลังโหลด...">
              <div class="p-0">
                <ThailandAutoComplete
                  v-model="data.cusZipcode"
                  type="zipcode"
                  @select="select"
                  size="medium"
                />
              </div>
            </no-ssr>
          </b-form-group>

          <hr>
          <b-form-group
            id="workNameLabel"
            label="ชื่องาน"
            label-for="workNameLabel"
            description="ต้องมากกว่า 10 ตัวอักษร"
            :state="stateWorkName"
          >
            <b-form-input
              id="workNameLabel"
              :state="stateWorkName"
              v-model.trim="data.workName"
              autocomplete="off"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="workImagesLabel"
            label="รูปภาพงาน"
            label-for="workImagesLabel"
            description="<b>ขนาดแนะนำ: 1:1</b> รองรับเฉพาะ .JPG .PNG .GIF"
          >
            <b-form-file
              v-model="workImages"
              accept="image/jpeg, image/png, image/gif"
              placeholder="เลือกรูปภาพงาน"
              class="mb-2"
              @change="AssignFileImage(workImages, $event)"
            ></b-form-file>
            <b-img thumbnail fluid v-if="workImages" :src="preview" alt="preview"/>
          </b-form-group>
          <b-form-group
            id="workDescriptionLabel"
            label="รายละเอียดงาน"
            label-for="workDescriptionLabel"
            description="คำอธิบายงานไม่เกิน 240 ตัวอักษร"
            :state="stateWorkDescription"
          >
            <b-form-textarea
              id="workDescriptionLabel"
              :state="stateWorkDescription"
              v-model.trim="data.workDescription"
              :rows="4"
            />
          </b-form-group>
          <b-form-group
            id="workVolumeLabel"
            label="จำนวนสั่งทำ"
            label-for="workVolumeLabel"
            description="จำนวนระหว่าง 1 ถึง 100"
            :state="stateWorkVolume"
          >
            <b-form-input
              id="workVolumeLabel"
              type="number"
              :state="stateWorkVolume"
              v-model.trim="data.workVolume"
              autocomplete="off"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="workEarnLabel"
            label="ค่าจ้าง"
            label-for="workEarnLabel"
            description="ขั้นต่ำ 20 <small>(หน่วยบาท)</small>"
            :state="stateWorkEarn"
          >
            <b-form-input
              id="workEarnLabel"
              type="number"
              :state="stateWorkEarn"
              v-model.trim="data.workEarn"
              autocomplete="off"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="workTAXLabel"
            label="หัก % ค่าจ้าง "
            label-for="workEarnLabel"
            description="จำนวนเต็ม เช่น 100 = 100% <b>ไม่สามารถแก้ไขในภายหลัง</b></small>"
            :state="stateWorkTAX"
          >
            <b-form-input
              id="workTAXLabel"
              type="number"
              :state="stateWorkTAX"
              v-model.trim="data.workTAX"
              autocomplete="off"
            ></b-form-input>
          </b-form-group>
          <b-form-group label="ประเภทค่าจ้าง">
            <b-form-radio-group id="radios2" v-model="data.workEarnType" name="radioSubComponent">
              <b-form-radio :value="1">ต่อชิ้น</b-form-radio>
              <b-form-radio :value="2">เหมาจ่าย</b-form-radio>
            </b-form-radio-group>
          </b-form-group>

          <b-form-group
            id="workStartEndAtLabel"
            description="ช่วงเวลาในการผลิตแบบคาดการณ์ *ระยะขั้นต่ำ 3 วัน นับจากวันเริ่ม"
            label="กำหนดช่วงเวลาของงาน"
            label-for="workStartEndAtLabel"
          >
            <no-ssr placeholder="กำลังโหลดปฏิทิน...">
              <VueCtkDateTimePicker
                label="(เริ่มต้นงาน-วันที่คาดว่าจะเสร็จ)"
                no-header
                id="workStartEndAtLabel"
                auto-close
                overlay
                locale="th"
                no-shortcuts
                format="YYYY-MM-DD"
                only-date
                no-value-to-custom-elem
                range
                v-model="data.workTime"
              />
            </no-ssr>
          </b-form-group>
          <div class="py-2" v-if="btnAddWork">
            <b-button
              block
              :variant="btnAddWork ? 'primary':null"
              @click="OnclickAddwork()"
              :disabled="!btnAddWork"
            >สร้างงาน</b-button>
          </div>
        </b-col>
        <b-col col lg="2"></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Firebase from "./../../configs/firebase.sdk.js";
export default {
  layout: "default",
  head() {
    return {
      title: "สร้างงาน"
    };
  },
  data() {
    return {
      sub_nav: [
        {
          text: "งานทั้งหมด",
          to: { path: "/work-offer" }
        },
        {
          text: "สร้างงาน",
          active: true
        }
      ],
      data: {
        customerName: "",
        customerTel: "",
        customerAddress: "",
        cusDistrict: "",
        cusAmphoe: "",
        cusProvince: "",
        cusZipcode: "",
        workName: "",
        workTAX: 15,
        workDescription: "",
        workVolume: null,
        workEarn: null,
        workEarnType: 1,
        workTime: {
          start: this.$moment().add("2", "days"),
          end: this.$moment().add("7", "days")
        }
      },
      workImages: null,
      preview: null,
      uploading: false,
      uploader: 0
    };
  },
  computed: {
    stateCustomerName() {
      return (
        this.data.customerName.length >= 10 &&
        this.data.customerName.length <= 50
      );
    },
    stateWorkName() {
      return this.data.workName.length > 2 && this.data.workName.length <= 140;
    },
    stateWorkDescription() {
      return (
        this.data.workDescription.length > 10 &&
        this.data.workDescription.length <= 240
      );
    },
    stateWorkVolume() {
      return this.data.workVolume > 0 && this.data.workVolume <= 100;
    },
    stateWorkTAX() {
      return this.data.workTAX > 0 && this.data.workTAX <= 100;
    },
    stateWorkEarn() {
      return this.data.workEarn >= 20;
    },
    stateWorkImages() {
      return this.workImages ? true : false;
    },
    stateTime() {
      const now = new Date().getTime();
      let timeStart = new Date(this.data.workTime.start).getTime();
      let timeEnd = new Date(this.data.workTime.end).getTime();
      return (
        timeStart > now && timeEnd > this.$moment(timeStart).add(1, "days")
      );
    },
    btnAddWork() {
      return (
        this.stateCustomerName &&
        this.stateWorkName &&
        this.stateWorkDescription &&
        this.stateWorkVolume &&
        this.stateWorkTAX &&
        this.stateWorkEarn &&
        this.stateWorkImages &&
        this.stateTime
      );
    }
  },
  methods: {
    select(address) {
      this.data.cusDistrict = address.district;
      this.data.cusAmphoe = address.amphoe;
      this.data.cusProvince = address.province;
      this.data.cusZipcode = address.zipcode;
    },
    AssignFileImage: function(file, e) {
      let self = this;
      this.workImages = e.target.files[0];
      this.preview = URL.createObjectURL(e.target.files[0]);
    },
    OnclickAddwork() {
      let self = this;

      this.$swal
        .fire({
          title: "ข้อกำหนดและเงื่อนไข",
          input: "checkbox",
          inputValue: null,
          inputPlaceholder: "ฉันเห็นด้วยกับข้อกำหนดและเงื่อนไขกับทาง Unfac.co",
          confirmButtonText: "ยืนยันการสร้างงาน",
          inputValidator: result => {
            return !result && "คุณต้องเห็นด้วยกับข้อกำหนดและเงื่อนไข";
          }
        })
        .then(async result => {
          if (result.value) {
            self.$store.commit("setLoading", true);
            let storageRef = Firebase.storage()
              .ref()
              .child(
                `${
                  self.$store.state.user.lineId
                }/works/${new Date().getTime()}_${self.workImages.name}_create`
              );
            let task = storageRef.put(self.workImages);
            task.on(
              "state_changed",
              function progress(snapshot) {
                self.uploading = true;
                let percentage =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                self.uploader = percentage;
              },
              function error(err) {
                self.$toast.error("เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง", {
                  position: "bottom-right",
                  theme: "bubble",
                  duration: 3000
                });
                self.$store.commit("setLoading", false);
                // self.$router.push("/work-offer");
              },
              async function complete() {
                let img = await task.snapshot.ref.getDownloadURL();
                let staticData = {
                  entId: self.$store.state.user.entId,
                  workType: 1,
                  issuedBy: self.$store.state.user.userId,
                  workStartAt: new Date(
                    self.$moment(self.data.workTime.start).format("MM-DD-YYYY")
                  ).getTime(),
                  workEndAt: new Date(
                    self.$moment(self.data.workTime.end).format("MM-DD-YYYY")
                  ).getTime(),
                  workEarnType: 1,
                  workImages: img
                };
                let object = Object.assign(staticData, self.data);

                const insertWork = await self.$axios.post(`/v2/work`, object);

                if (insertWork.data) {
                  self.$toast.info("สร้างงานสำเร็จแล้ว", {
                    position: "bottom-right",
                    theme: "bubble",
                    duration: 3000
                  });
                  self.$router.push("/work-offer");
                  self.$store.commit("setLoading", false);
                }
              }
            );
          }
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
