<template>
  <div>
    <b-jumbotron fluid header="งานทั้งหมด" :lead="textHeader">
      <b-row>
        <b-col md="6">
          <b-form-group label class="mb-0">
            <b-input-group>
              <b-form-input v-model="filter" placeholder="ค้นหาด้วยชื่อลูกค้า หรือรหัสงาน"/>
              <b-input-group-append>
                <b-btn :disabled="!filter" @click="filter = ''" style="z-index: 0">ล้างคำค้นหา</b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group horizontal label="จำนวนรายการ" class="mb-0">
            <b-form-select :options="pageOptions" v-model="perPage"/>
          </b-form-group>
        </b-col>
      </b-row>
    </b-jumbotron>
    <b-container>
      <!-- Main table element -->
      <b-table
        show-empty
        responsive
        hover
        striped
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        @filtered="onFiltered"
      >
        <template slot="workStartAt" slot-scope="row">
          {{date(row.value).format}}
          <br>
          <b-badge>
            <small>{{date(row.value).fromnow}}</small>
          </b-badge>
        </template>

        <template slot="workEndAt" slot-scope="row">
          {{date(row.value).format}}
          <br>
          <b-badge :variant="date(row.value).color">
            <small v-if="date(row.value).intime">{{date(row.value).fromnow}}</small>
            <small v-else>ล่าช้า</small>
          </b-badge>
        </template>
        <template slot="workStatus" slot-scope="row">{{status(row.value)}}</template>
        <template slot="actions" slot-scope="row">
          <b-button
            size="sm"
            variant="link"
            @click.stop="row.toggleDetails"
          >{{ row.detailsShowing ? 'ซ่อน' : 'แสดง' }}ตัวเลือก</b-button>
        </template>
        <template slot="row-details" slot-scope="row">
          <b-card
            :title="`หมายเลขงานที่: <b>${row.item.workId}</b>`"
            :sub-title="`สร้างเมื่อ: ${date(row.item.workCreateAt).full}`"
          >
            <b-media tag="li">
              <b-img slot="aside" rounded :src="row.item.workImages" width="86" height="86"/>
              <b-button-group v-if="row.item.workStatus > 1">
                <b-button
                  class="btn-option"
                  variant="outline-dark"
                  @click.stop="ModalWotkInfo(row.item, row.index, $event.target)"
                >แก้ไขรายละเอียด</b-button>
                <b-button class="btn-option" variant="outline-dark">กำหนดสถานะ</b-button>
                <b-button
                  class="btn-option"
                  @click.stop="ModalWotkImage(row.item, row.index, $event.target)"
                  variant="outline-dark"
                >เปลี่ยนรูปปก</b-button>
                <b-button
                  v-if="row.item.workStatus === 3"
                  class="btn-option"
                  variant="outline-success"
                >รายการขออนุมัติ</b-button>
              </b-button-group>
            </b-media>
          </b-card>
        </template>
      </b-table>
      <b-row>
        <b-col>
          <b-pagination
            align="center"
            size="lg"
            :total-rows="totalRows"
            :per-page="perPage"
            v-model="currentPage"
          />
        </b-col>
      </b-row>
      <b-modal
        id="WorkInfoItem"
        @hide="resetModal"
        size="lg"
        hide-footer
        centered
        header-bg-variant="dark"
        header-text-variant="light"
        header-border-variant="dark"
        :title="`แก้ไขหมายเลขงาน: ${WorkInfoItem.workId}`"
        ok-only
      >
        <b-form-group
          id="workName"
          :description="WorkInfoItem.workName"
          label="ชื่องาน"
          label-for="workName"
        >
          <b-form-input
            id="workName"
            :disabled="uploading"
            v-model.trim="workValue.workName"
            :value="WorkInfoItem.workName"
          ></b-form-input>
        </b-form-group>
        <!-- line -->
        <b-form-group id="workDescription" label="รายละเอียดงาน" label-for="workDescription">
          <b-form-textarea
            id="workDescription"
            :disabled="uploading"
            v-model="WorkInfoItem.workDescription"
            :rows="3"
            :max-rows="6"
          ></b-form-textarea>
        </b-form-group>
        <!-- line -->
        <b-form-group
          id="workVolume"
          :description="`จำนวน ${WorkInfoItem.workVolume}`"
          label="จำนวนสั่งทำ"
          label-for="workVolume"
        >
          <b-form-input id="workVolume" disabled :value="WorkInfoItem.workVolume"></b-form-input>
        </b-form-group>
        <!-- line -->
        <b-form-group
          id="workEarn"
          :description=" `จำนวน ${WorkInfoItem.workEarn}`"
          label="ค่าจ้าง <small>(หน่วย: บาท)</small>"
          label-for="workEarn"
        >
          <b-form-input
            id="workEarn"
            :disabled="uploading"
            v-model="workValue.workEarn"
            :value="WorkInfoItem.workEarn"
          ></b-form-input>
        </b-form-group>
      </b-modal>
      <b-modal
        id="WorkInfoItemImage"
        @hide="resetModal"
        :title="`เปลี่ยนรูปภาพหน้าปกงาน: ${WorkInfoItem.workId}`"
        ok-only
        header-bg-variant="dark"
        header-text-variant="light"
        header-border-variant="dark"
        :no-close-on-esc="uploading"
        :no-close-on-backdrop="uploading"
        :no-enforce-focus="uploading"
        :cancel-disabled="uploading"
        :hide-header-close="uploading"
        hide-footer
        lazy
        busy
        centered
      >
        <b-progress
          v-if="uploading"
          :value="uploader"
          variant="success"
          striped
          :animated="true"
          class="mb-3"
          height="4px"
        ></b-progress>
        <b-form-file
          v-model="file"
          accept="image/jpeg, image/png, image/gif"
          placeholder="เลือกรูปภาพหน้าปกงาน"
          @change="autoAupload(file, $event)"
          class="mb-3"
          :disabled="uploading"
        ></b-form-file>
      </b-modal>
    </b-container>
    <loading :active.sync="asyncSource" :is-full-page="false" :opacity=".7" :height="34"></loading>
  </div>
</template>

<script>
import Firebase from "./../../configs/firebase.sdk.js";

export default {
  layout: "default",

  head() {
    return {
      title: "Work Offer"
    };
  },
  data() {
    return {
      file: null,
      items: [],
      editInfo: {
        name: ""
      },
      WorkInfoItem: {
        workId: null
      },
      workValue: {
        workName: ""
      },
      fields: [
        {
          key: "workId",
          label: "รหัสงาน",
          sortable: true
        },
        {
          key: "customerName",
          label: "ชื่อลูกค้า",
          sortable: true
        },
        {
          key: "workStatus",
          label: "สถานะ",
          sortable: true
        },
        {
          key: "workStartAt",
          label: "คิวงานเริ่ม",
          sortable: true
        },
        {
          key: "workEndAt",
          label: "คาดว่าจะเสร็จ",
          sortable: true
        },
        {
          key: "workVolume",
          label: "จำนวน",
          sortable: true
        },
        { key: "actions", label: "ตัวเลือกการจัดการ" }
      ],
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      pageOptions: [10, 20, 50],
      sortBy: null,
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      uploader: 0,
      uploading: false,
      ModalIndex: null
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
    },
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    },
    textHeader() {
      return `จำนวนงานในขณะนี้มีทั้งหมด ${this.items.length} รายการ`;
    }
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    date(d) {
      let date = {
        format: this.$moment(d).format("ddd Do MMM"),
        full: this.$moment(d).format("ddd Do MMM, HH:mm:ss"),
        fromnow: this.$moment(d).fromNow(),
        intime: this.$moment(d) >= this.$moment(),
        color: this.$moment(d) >= this.$moment() ? "primary" : "danger"
      };
      return date;
    },
    status(key) {
      switch (key) {
        case 1:
          return "เสร็จสิ้น";
          break;
        case 2:
          return "ปิดรับ";
          break;
        case 3:
          return "เปิดรับ";
          break;
        case 4:
          return "ด่วน";
          break;
        default:
          return "ยกเลิก";
          break;
      }
    },
    async fetch() {
      let _this = this;
      this.$store.dispatch("sourceLoaded", true);
      await this.$axios
        .$get(`/v2/work/${this.$store.state.user.entId}`)
        .then(function(res) {
          if (res.length > 0) {
            _this.items = res;
            _this.totalRows = res.length;
          }
          _this.$store.dispatch("sourceLoaded", false);
        });
    },
    ModalWotkInfo(item, index, button) {
      this.ModalIndex = index;
      this.WorkInfoItem = Object.assign({}, item);
      this.workValue = Object.assign({}, item);
      this.$root.$emit("bv::show::modal", "WorkInfoItem", button);
    },
    ModalWotkImage(item, index, button) {
      this.ModalIndex = index;
      this.WorkInfoItem = Object.assign({}, item);
      this.workValue = Object.assign({}, item);
      this.$root.$emit("bv::show::modal", "WorkInfoItemImage", button);
    },
    resetModal() {
      this.WorkInfoItem = {
        workId: null
      };
    },
    autoAupload: function(file, e) {
      let self = this;
      this.$swal
        .fire({
          title: "เปลี่ยนรูปภาพหน้าปกงาน",
          text: "เมื่อยืนยันไม่สามารถกู้คืนรูปภาพเดิมได้",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "ยืนยัน"
        })
        .then(async result => {
          if (result.value) {
            //get file
            let getFile = e.target.files[0];
            //set storage ref
            let storageRef = Firebase.storage()
              .ref()
              .child(
                `${self.user.lineId}/works/${new Date().getTime() * 180}_${
                  getFile.name
                }`
              );
            //upload file
            let task = storageRef.put(getFile);
            task.on(
              "state_changed",
              function progress(snapshot) {
                self.uploading = true;
                let percentage =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                self.uploader = percentage;
              },
              function error(err) {
                self.$toast.error(err, {
                  position: "bottom-center",
                  theme: "bubble",
                  duration: 2000
                });
                self.uploading = false;
                self.file = null;
              },
              async function complete() {
                let imgURL = await task.snapshot.ref.getDownloadURL();

                let UpdateDB = await self.$axios.put(
                  `/v2/work/image/${self.workValue.workId}`,
                  {
                    workImages: imgURL
                  }
                );
                if (UpdateDB.data) {
                  self.$toast.success("อัพโหลดรูปภาพเรียบร้อยแล้ว", {
                    theme: "bubble",
                    position: "bottom-center",
                    duration: 2000
                  });
                  self.items[self.ModalIndex].workImages = imgURL;
                  self.WorkInfoItem.workImages = imgURL;
                  self.workValue.workImages = imgURL;

                  self.$root.$emit("bv::hide::modal", "WorkInfoItemImage");
                  // self.fetch();
                } else {
                  self.$toast.error("เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง", {
                    theme: "bubble",
                    position: "bottom-center",
                    duration: 2000
                  });
                }

                self.uploading = false;
                self.file = null;
              }
            );
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@media (min-width: 576px) {
  .btn-option {
    font-size: 1rem !important;
  }
}
.display-3 {
  font-size: 2rem !important;
}
.btn-option {
  font-size: 12px;
}
.form-control {
  border: 1px solid #ced4da;
  height: auto !important;
}
</style>
