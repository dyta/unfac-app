<template>
  <div>
    <b-jumbotron fluid header="งานทั้งหมด" class="jumbotron-special-lg mb-0" :lead="textHeader">
      <b-row>
        <b-col md="6">
          <b-form-group class="mb-0" label="ค้นหา">
            <b-input-group>
              <b-form-input v-model="filter" placeholder="ชื่อลูกค้า หรือรหัสงาน"/>
              <b-input-group-append>
                <b-btn :disabled="!filter" @click="filter = ''" style="z-index: 0">ล้างคำค้นหา</b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-row>
            <b-col sm="4">
              <b-form-group label="Per page" class="mb-0">
                <b-form-select :options="pageOptions" v-model="perPage"/>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group label="โหลดอีกครั้ง">
                <b-button block @click="()=> this.fetch()">
                  <fa icon="redo-alt"/>
                </b-button>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group label="เพิ่มงาน">
                <b-button
                  block
                  variant="primary"
                  @click="()=> this.$router.push('/work-offer/add')"
                >
                  <fa icon="plus"/>
                </b-button>
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-jumbotron>
    <b-container fluid v-if="!asyncSource && items.length > 0" class="w-75 p-0">
      <!-- Main table element -->
      <b-table
        show-empty
        responsive
        hover
        bordered
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
        <template slot="workId" slot-scope="row">
          {{row.value}}
          <b-btn
            v-if="date(row.item.workCreateAt).newItem"
            v-b-tooltip.hover.top="`งานใหม่! เมื่อ ${date(row.item.workCreateAt).fromnow}`"
            variant="link"
          >
            <fa icon="fire" color="orange"></fa>
          </b-btn>
        </template>
        <template slot="workImages" slot-scope="row">
          <b-img :src="row.value" rounded width="60" height="60" :alt="row.item.workName"/>
          <small>{{row.item.workName}}</small>
        </template>
        <template slot="workStartAt" slot-scope="row">
          <small v-if="row.item.workStatus > 1">
            {{date(row.value).format}}
            <br>
            <b-badge>{{date(row.value).fromnow}}</b-badge>
          </small>
          <p v-else-if="row.item.workStatus === 0">
            <b-badge variant="light">Deleted Protection</b-badge>
          </p>
          <p v-else>
            <b-badge variant="success">Completed</b-badge>
          </p>
        </template>
        <template slot="workPickVolume" slot-scope="row">
          <p v-if="row.item.workStatus > 1">{{row.value}}</p>
          <p v-else>-</p>
        </template>

        <template slot="workEndAt" slot-scope="row">
          <small v-if="row.item.workStatus > 1">
            {{date(row.value).format}}
            <br>
            <b-badge :variant="date(row.value).color">
              <span v-if="date(row.value).intime">{{date(row.value).fromnow}}</span>
              <span v-else>ล่าช้า</span>
            </b-badge>
          </small>
          <p v-else-if="row.item.workStatus === 0">-</p>
          <p v-else>
            <b-badge variant="success">Completed</b-badge>
          </p>
        </template>
        <template slot="workStatus" slot-scope="row">
          <span v-if="row.value === 1">
            <fa icon="check" size="sm" color="green"/>
          </span>
          <span v-else-if="row.value === 2">
            <fa icon="circle" size="sm" color="gray"/>
          </span>
          <span v-else-if="row.value === 4">
            <fa icon="circle" size="sm" color="red"/>
          </span>
          <span v-else-if="row.value === 5">
            <fa icon="circle" size="sm" color="orange"/>
          </span>
          <span v-else-if="row.value === 0">
            <fa icon="circle" size="sm" color="white"/>
          </span>
          <span v-else>
            <fa icon="circle" size="sm" color="blue"/>
          </span>
          <small>{{status(row.value)}}</small>
        </template>
        <template slot="actions" slot-scope="row">
          <b-button
            size="sm"
            variant="outline-primary"
            @click.stop="row.toggleDetails"
          >{{ row.detailsShowing ? 'ซ่อน' : 'แสดง' }}ตัวเลือก</b-button>
        </template>
        <template slot="row-details" slot-scope="row">
          <b-card
            border-variant="dark"
            class="mt-3 mb-4"
            :title="`หมายเลขงานที่: <b>${row.item.workId}</b>`"
            :sub-title="`สร้างเมื่อ: ${date(row.item.workCreateAt).format} ${row.item.workCreateAt.substring(11)}`"
          >
            <b-media tag="li">
              <b-img
                class="border-right mr-1"
                slot="aside"
                rounded
                :src="row.item.workImages"
                width="140"
                height="140"
                :alt="row.item.workName"
              />

              <div v-if="row.item.workStatus !== 1">
                <h5 class="m-0">{{status(row.item.workStatus)}}</h5>
                <small v-if="row.item.workUpdateAt">
                  อัพเดทล่าสุด: {{date(row.item.workUpdateAt).format}} {{(row.item.workUpdateAt).substring(11)}}
                  <br>
                </small>

                <b-button-group>
                  <div v-if="row.item.workStatus === 0">
                    <b-button
                      class="btn-option mt-2"
                      variant="outline-dark"
                      @click.stop="ModalWotkInfo(row.item, row.index, $event.target)"
                    >แก้ไขรายละเอียด</b-button>
                    <b-button
                      class="btn-option mt-2"
                      variant="outline-dark"
                      @click.stop="ModalWorkStatus(row.item, row.index, $event.target)"
                    >กำหนดสถานะ</b-button>
                    <b-button
                      class="btn-option mt-2"
                      variant="danger"
                      @click="removeWork(row.item.workId)"
                    >ลบงาน</b-button>
                  </div>
                  <div v-else>
                    <b-button
                      class="btn-option mt-2"
                      variant="outline-dark"
                      @click.stop="ModalWotkInfo(row.item, row.index, $event.target)"
                    >แก้ไขรายละเอียด</b-button>
                    <b-button
                      class="btn-option mt-2"
                      variant="outline-dark"
                      @click.stop="ModalWorkStatus(row.item, row.index, $event.target)"
                    >กำหนดสถานะ</b-button>
                    <b-button
                      class="btn-option mt-2"
                      @click.stop="ModalWotkImage(row.item, row.index, $event.target)"
                      variant="outline-dark"
                    >เปลี่ยนรูปที่ใช้แสดง</b-button>
                    <b-button
                      v-if="row.item.workStatus > 2 && row.item.workPickVolume !==0"
                      class="btn-option mt-2"
                      variant="primary"
                      @click="()=> $router.push(`/request/approve?wid=${row.item.workId}&eid=${$store.state.user.entId}`)"
                    >รายการขออนุมัติ</b-button>
                  </div>
                </b-button-group>
              </div>
              <div v-else>
                <h5>Completed</h5>
                <p class="card-text m-0">งานถูกผลิตเรียบร้อยแล้ว</p>
                <small>อัพเดทล่าสุด: {{date(row.item.workUpdateAt).format}}</small>
                <div>
                  <b-button class="btn-option" variant="success">ดูรายละเอียด</b-button>
                </div>
              </div>
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
        header-text-variant="light"
        :title="`หมายเลขงาน: ${WorkInfoItem.workId}`"
        ok-only
      >
        <b-form-group
          id="customerName"
          label="ผู้สั่งทำ"
          :description="`<small>วันที่ทำรายการ: ${date(WorkInfoItem.workCreateAt).format} ${WorkInfoItem.workCreateAt ? (WorkInfoItem.workCreateAt).substring(11) : null} โดย: ${WorkInfoItem.issuedBy}</small>`"
          label-for="customerName"
        >
          <b-input-group>
            <b-form-input id="customerName" disabled :value="WorkInfoItem.customerName"></b-form-input>
            <b-input-group-append>
              <b-btn variant="outline-success">ดูข้อมูลลูกค้า</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
        <!-- line -->
        <b-form-group
          id="workName"
          :description="`<small>${WorkInfoItem.workName}</small>`"
          label="ชื่องาน"
          label-for="workName"
        >
          <b-form-input
            id="workName"
            v-model.trim="workValue.workName"
            :value="WorkInfoItem.workName"
          ></b-form-input>
        </b-form-group>
        <!-- line -->
        <b-form-group id="workDescription" label="รายละเอียดงาน" label-for="workDescription">
          <b-form-textarea
            id="workDescription"
            v-model="workValue.workDescription"
            :value="WorkInfoItem.workDescription"
            :rows="3"
            :max-rows="6"
          ></b-form-textarea>
        </b-form-group>
        <!-- line -->
        <b-form-group
          id="workVolume"
          :description="`<small>จำนวนเดิม: ${WorkInfoItem.workVolume} รายการ</small>`"
          label="จำนวนสั่งทำ"
          label-for="workVolume"
        >
          <b-form-input id="workVolume" disabled :value="WorkInfoItem.workVolume"></b-form-input>
        </b-form-group>
        <!-- line -->
        <b-form-group
          id="workEarn"
          :description="`<small>จำนวนเดิม: ${WorkInfoItem.workEarn} บาท</small>`"
          label="ค่าจ้าง <small>(หน่วย: บาท)</small>"
          label-for="workEarn"
        >
          <b-form-input
            id="workEarn"
            :disabled="WorkInfoItem.workStatus > 2"
            v-model.trim="workValue.workEarn"
            :value="WorkInfoItem.workEarn"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="ประเภทค่าจ้าง">
          <b-form-radio-group
            :disabled="WorkInfoItem.workStatus > 2"
            id="radios2"
            v-model="workValue.workEarnType"
            name="radioSubComponent"
          >
            <b-form-radio :value="1">ต่อชิ้น</b-form-radio>
            <b-form-radio :value="2">เหมาจ่าย</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
        <b-form-group
          id="DatePicker"
          :description="`<small>เดิมเริ่มต้น: ${date(WorkInfoItem.workStartAt).format} สิ้นสุด: ${date(WorkInfoItem.workEndAt).format}</small>`"
          label="กำหนดช่วงเวลาของงาน"
          label-for="DatePicker"
        >
          <no-ssr placeholder="กำลังโหลดปฏิทิน...">
            <VueCtkDateTimePicker
              label="(เริ่มต้นงาน-วันที่คาดว่าจะเสร็จ)"
              no-header
              id="DatePicker"
              auto-close
              locale="th"
              no-shortcuts
              format="YYYY-MM-DD"
              only-date
              no-value-to-custom-elem
              range
              :disabled="WorkInfoItem.workStatus > 2"
              v-model="startDate"
            />
          </no-ssr>
        </b-form-group>
        <b-row>
          <b-col class="pr-1">
            <b-button
              block
              @click="resetInfoamtion()"
              :disabled="ValidateWorkName && ValidateDescription && ValidateEarn&& !vDtae "
            >รีเซ็ท</b-button>
          </b-col>
          <b-col class="pl-1">
            <b-button
              block
              variant="primary"
              @click="UpdateInformation()"
              :disabled="ValidateWorkName && ValidateDescription && !vDtae && ValidateEarn "
            >อัพเดทข้อมูล</b-button>
          </b-col>
        </b-row>
      </b-modal>

      <b-modal
        id="WorkInfoItemImage"
        @hide="resetModal"
        :title="`เปลี่ยนรูปภาพงาน: ${WorkInfoItem.workId}`"
        ok-only
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
          variant="primary"
          striped
          :animated="true"
          class="mb-3"
          height="4px"
        ></b-progress>
        <b-form-file
          v-model="file"
          accept="image/jpeg, image/png, image/gif"
          placeholder="เลือกรูปภาพงาน"
          @change="autoUpload(file, $event)"
          class="mb-3"
          :disabled="uploading"
        ></b-form-file>
      </b-modal>

      <b-modal
        id="ModalWorkStatus"
        @hide="resetModal"
        :title="`หมายเลขงาน: ${WorkInfoItem.workId}`"
        ok-only
        hide-footer
        lazy
        busy
        centered
      >
        <b-form-group :label="`สถานะปัจจุบัน: <u>${status(WorkInfoItem.workStatus)}</u>`">
          <b-form-radio-group
            id="radiosWorkStatus"
            v-model="workValue.workStatus"
            name="workStatus"
            class="py-3"
          >
            <span v-if="WorkInfoItem.workStatus > 2">
              <b-form-radio :value="4" class="pt-2">Urgently</b-form-radio>
              <b-form-radio :value="3">Published</b-form-radio>
              <b-form-radio v-if="WorkInfoItem.workPickVolume === 0" :value="2">Unpublished</b-form-radio>
              <b-form-radio v-else :value="5">Paused</b-form-radio>
            </span>
            <span v-else-if="WorkInfoItem.workStatus === 2">
              <b-form-radio :value="2">Unpublished</b-form-radio>
              <b-form-radio :value="3">Published</b-form-radio>
              <b-form-radio :value="4">Urgently</b-form-radio>
              <b-form-radio :value="0">
                <small class="text-danger">Delete Protection</small>
              </b-form-radio>
            </span>
            <span v-else-if="WorkInfoItem.workStatus === 0">
              <b-form-radio :value="2">
                <small>Prevent this item from being accidentally deleted.</small>
              </b-form-radio>
            </span>
          </b-form-radio-group>
        </b-form-group>
        <b-button
          block
          variant="primary"
          :disabled="statusValidate || statusDateValidate"
          @click="updateStatus"
        >ยืนยัน</b-button>
      </b-modal>
    </b-container>
    <b-container v-else-if="items.length === 0 && !asyncSource">
      <b-card class="text-center" style="box-shadow: 0 0 1em var(--gray-light);">
        <fa icon="exclamation-circle" size="3x" color="orange" class="mt-2"/>
        <h5 class="mt-3">ไม่พบงานในโครงการ</h5>
        <b-button
          variant="primary"
          class="px-5 mb-3 mt-2"
          @click="()=> this.$router.push('/work-offer/add')"
        >เพิ่มงาน</b-button>
      </b-card>
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
      title: "งานทั้งหมด"
    };
  },
  data() {
    return {
      file: null,
      selected: null,
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
          key: "workImages",
          label: "รูปภาพ"
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
      sortBy: "workStatus",
      sortDesc: true,
      sortDirection: "asc",
      filter: null,
      uploader: 0,
      uploading: false,
      ModalIndex: null,
      startDate: {
        start: null,
        end: null
      }
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
    },
    statusValidate() {
      return this.workValue.workStatus === this.WorkInfoItem.workStatus;
    },
    statusDateValidate() {
      return (
        this.workValue.workStartAt === null || this.workValue.workEndAt === null
      );
    },
    ValidateWorkName() {
      if (this.ModalIndex !== null) {
        if (this.workValue.workName !== this.WorkInfoItem.workName) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    ValidateDescription() {
      if (this.ModalIndex !== null) {
        if (
          this.workValue.workDescription !== this.WorkInfoItem.workDescription
        ) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    ValidateStartat() {
      if (this.ModalIndex !== null && this.startDate.start !== null) {
        if (
          new Date(
            this.$moment(this.startDate.start).format("MM-DD-YYYY")
          ).getTime() !== new Date(this.WorkInfoItem.workStartAt).getTime()
        ) {
          return false;
        } else {
          if (
            this.startDate.end !== null &&
            new Date(
              this.$moment(this.startDate.end).format("MM-DD-YYYY")
            ).getTime() !== new Date(this.WorkInfoItem.workEndAt).getTime()
          ) {
            return false;
          } else {
            return true;
          }
        }
      } else {
        return true;
      }
    },
    vDtae() {
      const now = new Date(this.$moment().add(1, "days")).getTime();
      let timeStart = new Date(this.startDate.start).getTime();
      let timeEnd = new Date(this.startDate.end).getTime();
      return (
        timeStart > now && timeEnd > this.$moment(timeStart).add(1, "days")
      );
    },
    ValidateEarn() {
      if (this.ModalIndex !== null) {
        if (this.workValue.workEarn !== this.WorkInfoItem.workEarn) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
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
        full: this.$moment(d)
          .utc()
          .format("ddd Do MMM, HH:mm:ss"),
        fromnow: this.$moment(d).fromNow(),
        intime: this.$moment(d) >= this.$moment(),
        color: this.$moment(d) >= this.$moment() ? "" : "danger",
        newItem: this.$moment(d) >= this.$moment().subtract(30, "minutes")
      };
      return date;
    },
    status(key) {
      switch (key) {
        case 1:
          return "Completed";
          break;
        case 2:
          return "Unpublished";
          break;
        case 3:
          return "Published";
          break;
        case 4:
          return "Urgently";
          break;
        case 5:
          return "Paused";
          break;
        default:
          return "Canceled";
          break;
      }
    },
    resetInfoamtion() {
      this.workValue = Object.assign({}, this.WorkInfoItem);
      this.startDate = {
        start: null,
        end: null
      };
    },
    async fetch() {
      let self = this;
      this.$store.dispatch("sourceLoaded", true);
      await this.$axios
        .$get(`/v2/work/${this.$store.state.user.entId}`)
        .then(function(res) {
          if (res.length > 0) {
            self.items = res;
            self.totalRows = res.length;
          }
          self.$store.dispatch("sourceLoaded", false);
        });
    },
    ModalWorkStatus(item, index, button) {
      this.ModalIndex = index;
      this.WorkInfoItem = Object.assign({}, item);
      this.workValue = Object.assign({}, item);
      this.$root.$emit("bv::show::modal", "ModalWorkStatus", button);
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
      this.ModalIndex = null;
      this.WorkInfoItem = {
        workId: null
      };
    },
    async updateStatus() {
      let update = await this.$axios.put(
        `/v2/work/status/${this.workValue.workId}/${
          this.$store.state.user.entId
        }`,
        {
          work: this.workValue,
          workStatus: this.workValue.workStatus,
          workStatusOld: this.WorkInfoItem.workStatus
        }
      );
      if (update.data) {
        this.$toast.info("อัพเดทสถานะเรียบร้อยแล้ว", {
          theme: "bubble",
          position: "bottom-right",
          duration: 2000
        });
        this.$root.$emit("bv::hide::modal", "ModalWorkStatus");
        this.fetch();
      }
    },
    async UpdateInformation() {
      let data = {
        workName: this.workValue.workName,
        workDescription: this.workValue.workDescription,
        workStartAt:
          this.ValidateStartat ||
          new Date(this.startDate.start).getTime() < new Date().getTime()
            ? this.workValue.workStartAt
            : new Date(this.startDate.start).getTime(),
        workEndAt:
          this.ValidateStartat ||
          new Date(this.startDate.start).getTime() < new Date().getTime()
            ? this.workValue.workEndAt
            : this.ValidateStartat &&
              new Date(this.startDate.end).getTime() < new Date().getTime()
            ? this.workValue.workEndAt
            : new Date(this.startDate.end).getTime(),
        workEarn: this.workValue.workEarn,
        workEarnType: this.workValue.workEarnType
      };
      this.$store.commit("setLoading", true);
      let update = await this.$axios.put(
        `/v2/work/info/${this.workValue.workId}`,
        data
      );

      if (update.data) {
        this.WorkInfoItem = Object.assign(this.WorkInfoItem, data);
        this.items[this.ModalIndex] = Object.assign(
          this.items[this.ModalIndex],
          data
        );
        setTimeout(() => {
          this.$toast.info("อัพเดทข้อมูลเรียบร้อยแล้ว", {
            theme: "bubble",
            position: "bottom-right",
            duration: 2000
          });
          this.resetInfoamtion();
        }, 1000);
      } else {
        this.$toast.error("เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง", {
          theme: "bubble",
          position: "bottom-right",
          duration: 2000
        });
      }
      setTimeout(() => {
        this.$store.commit("setLoading", false);
      }, 1000);
    },
    autoUpload: function(file, e) {
      let self = this;
      this.$swal
        .fire({
          title: "เปลี่ยนรูปภาพงาน",
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
                  position: "bottom-right",
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
                  self.$toast.info("อัพโหลดรูปภาพเรียบร้อยแล้ว", {
                    theme: "bubble",
                    position: "bottom-right",
                    duration: 2000
                  });
                  self.items[self.ModalIndex].workImages = imgURL;
                  self.WorkInfoItem.workImages = imgURL;
                  self.workValue.workImages = imgURL;

                  self.$root.$emit("bv::hide::modal", "WorkInfoItemImage");
                } else {
                  self.$toast.error("เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง", {
                    theme: "bubble",
                    position: "bottom-right",
                    duration: 2000
                  });
                }

                self.uploading = false;
                self.file = null;
              }
            );
          }
        });
    },
    async removeWork(workId) {
      let self = this;
      this.$swal
        .fire({
          title: `ลบงาน #${workId}?`,
          text: "เมื่อยืนยันไม่สามารถกู้คืนข้อมูลของงานนี้ได้",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "ยืนยัน"
        })
        .then(async result => {
          if (result.value) {
            const removed = await self.$axios.delete(
              `/v2/work/${workId}/${self.$store.state.user.entId}`
            );
            if (removed.data) {
              self.$toast.info(`งาน #${workId} ถูกลบออกจะระบบเรียบร้อยแล้ว`, {
                theme: "bubble",
                position: "bottom-right",
                duration: 2000
              });
              self.fetch();
            } else {
              self.$toast.error("เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง", {
                theme: "bubble",
                position: "bottom-right",
                duration: 2000
              });
            }
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@media (min-width: 854px) {
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
