<template>
  <div>
    <b-jumbotron
      fluid
      header="สรุปงาน"
      class="jumbotron-special-lg mb-0"
      :lead="`งานที่มีการส่งมอบสินค้าในเดือน ${$moment(selected).format('MMMM')} พ.ศ. ${$moment(selected).format('YYYY')*1+543} จำนวน ${totalWork} งาน`"
    >
      <b-row>
        <b-col md="4">
          <b-form-group label="ค้นหา">
            <b-input-group>
              <b-form-input v-model="filter" placeholder="ระบุคำค้นหา"/>
              <b-input-group-append>
                <b-btn :disabled="!filter" @click="filter = ''" style="z-index: 0">ล้างคำค้นหา</b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="รายการย้อนหลัง" class="mb-0">
            <b-form-select v-model="selected" :options="options"/>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="จำนวนรายการ" class="mb-0">
            <b-form-select :options="pageOptions" v-model="perPage"/>
          </b-form-group>
        </b-col>
        <b-col sm="2">
          <b-form-group label="โหลดอีกครั้ง">
            <b-button block variant="outline-primary" @click="()=> this.fetch()">
              <fa icon="redo-alt" class="mr-1"/>
            </b-button>
          </b-form-group>
        </b-col>
      </b-row>
    </b-jumbotron>

    <b-container
      v-if="!asyncSource && items.length > 0 && enterprise"
      fluid
      class="w-75"
      no-gutters
    >
      <b-row class="pb-3" no-gutters>
        <b-col cols="6" md="6" lg="3" class="pt-1">
          <b-card class="no-border no-radius border-right h100">
            <h5
              class="mb-0"
              :class="totalIncome-totalSum < 0 ? 'text-danger' : 'text-success'"
            >มูลค่า ณ ปัจจุบัน</h5>
            <small
              :class="totalIncome-totalSum < 0 ? 'text-danger' : 'text-success'"
            >ปริมาณงานสั่งทำต่ออัตราการผลิตที่เสร็จสิ้น</small>
            <hr>
            <h4
              class="text-right amount"
              :class="totalIncome-totalSum < 0 ? 'text-danger' : 'text-success'"
            >
              ฿{{formatPrice(totalIncome)}}
              <small
                v-if="totalIncome-totalSum < 0"
                class="font-size-10"
                style="vertical-align: super;"
              >({{formatPrice(totalIncome-totalSum)}})</small>
            </h4>
          </b-card>
        </b-col>
        <b-col cols="6" md="6" lg="3" class="pt-1">
          <b-card class="no-border no-radius h100">
            <h5
              class="mb-0"
              :class="totalIncomeReal > 0 ? 'text-success' : 'text-secondary'"
            >กำไรสุทธิ ณ ปัจจุบัน</h5>
            <small
              :class="totalIncomeReal > 0 ? 'text-success' : 'text-secondary'"
            >% จากมูลค่างานที่เสร็จสิ้น ณ ปัจจุบัน</small>
            <hr>
            <h4
              class="text-right amount"
              :class="totalIncomeReal > 0 ? 'text-success' : 'text-secondary'"
            >฿{{formatPrice(totalIncomeReal)}}</h4>
          </b-card>
        </b-col>
        <b-col cols="6" md="6" lg="3" class="pt-1 border-right">
          <b-card bg-variant="secondary" text-variant="light" class="no-border no-radius h100">
            <h5 class="text-warning mb-0">มูลค่ารวมในเดือนนี้</h5>
            <small>มูลค่ารวมของงานสั่งทำทั้งหมด</small>
            <hr>
            <h4 class="text-right text-light amount">฿{{formatPrice(totalSum)}}</h4>
          </b-card>
        </b-col>
        <b-col cols="6" md="6" lg="3" class="pt-1">
          <b-card bg-variant="secondary" text-variant="light" class="no-border no-radius h100">
            <h5 class="text-warning mb-0">ผลกำไรที่คาดไว้ในเดือนนี้</h5>
            <small>หักจากมูลค่ารวม {{enterprise.income_tex}}% - {{100-enterprise.income_tex}}% ค่าจ้างพนง.({{formatPrice(totalSum-totalIncomeAll)}})</small>
            <hr>
            <h4 class="text-right text-light amount">฿{{formatPrice(totalIncomeAll)}}</h4>
          </b-card>
        </b-col>
      </b-row>
      <h5 class="py-3">รายละเอียดกิจกรรม</h5>
      <b-table
        show-empty
        responsive
        hover
        small
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        @row-clicked="myRowClickHandler"
        @filtered="onFiltered"
      >
        <template slot="mfStatus" slot-scope="row">
          <small>
            <b-badge :variant="status(row.value).color">{{status(row.value).text}}</b-badge>
          </small>
        </template>
        <template slot="mfId" slot-scope="row">
          <span v-if="row.value">{{row.value}}</span>
          <span v-else>-</span>
        </template>
        <template slot="empFullname" slot-scope="row">
          <span v-if="row.value">{{row.value}}</span>
          <span v-else>-</span>
        </template>
        <template slot="maxVolume" slot-scope="row">
          <div v-if="row.value" class="text-center">{{row.value}}</div>
          <div v-else class="text-center">-</div>
        </template>
        <template slot="empPhoneNumber" slot-scope="row">
          <span v-if="row.value">{{row.value}}</span>
          <span v-else>-</span>
        </template>
        <template slot="workEarn" slot-scope="row">
          <div class="text-right">{{formatPrice(row.value)}}</div>
        </template>
        <template slot="workEarnAllUnit" slot-scope="row">
          <div class="text-right">{{formatPrice((row.item.workEarn*row.item.workVolume))}}</div>
        </template>
        <template
          slot="workEndAt"
          slot-scope="row"
        >{{$moment(row.value).format('DD')}}/{{$moment(row.value).format('MM')}}/{{$moment(row.value).format('YYYY')*1+543}}</template>

        <template slot="workEarnUnit" slot-scope="row">
          <div
            v-if="row.item.workEarnType === 1"
            class="text-right"
          >{{formatPrice((row.item.workEarn*row.item.maxVolume)-(row.item.workEarn*row.item.maxVolume*(enterprise.income_tex/100)))}}</div>
          <span v-else>{{formatPrice(row.item.workEarn)}}</span>
        </template>
        <template slot="all" slot-scope="row">
          <div
            class="text-right"
            v-if="row.item.workEarnType === 1"
          >{{formatPrice(row.item.workEarn*row.item.maxVolume)}}</div>
          <span v-else>{{formatPrice(row.item.workEarn)}}</span>
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
    </b-container>

    <b-container v-else-if="items.length === 0 && !asyncSource">
      <b-card class="text-center" style="box-shadow: 0 0 1em var(--gray-light);">
        <fa icon="exclamation-circle" size="3x" color="orange" class="mt-2"/>
        <h5 class="mt-3">ไม่มีผลการสรุปงานในเดือนนี้</h5>
        <small>ไม่มีงานที่กำหนดส่งหรือเสร็จสิ้นในเดือน{{$moment(selected).format('MMMM')}}</small>
      </b-card>
    </b-container>
    <loading :active.sync="asyncSource" :is-full-page="false" :opacity=".3" :height="34"></loading>
  </div>
</template>

<script>
import cals from "./../scripts/Filters.js";
export default {
  layout: "default",
  head() {
    return {
      title: "สรุปงาน"
    };
  },
  data() {
    return {
      items: [],
      enterprise: [],
      fields: [
        {
          key: "workId",
          label: "งาน",
          sortable: true
        },
        {
          key: "mfId",
          label: "ผลิต",
          sortable: true
        },
        {
          key: "workName",
          label: "ชื่องาน"
        },
        {
          key: "workVolume",
          label: "สั่งผลิต",
          sortable: true
        },
        {
          key: "workEarn",
          label: "ราคาต่อหน่วย",
          sortable: true
        },
        {
          key: "workEarnAllUnit",
          label: "ราคางานรวม",
          sortable: true
        },
        {
          key: "empFullname",
          label: "พนง.ผู้รับผิดชอบ",
          variant: "primary"
        },
        {
          key: "maxVolume",
          label: "อนุมัติผลิต",
          sortable: true,
          variant: "primary"
        },
        {
          key: "all",
          label: "ค่าจ้าง",
          sortable: true,
          variant: "primary"
        },
        {
          key: "workEarnUnit",
          label: "ค่าจ้างสุทธิ",
          sortable: true,
          variant: "success"
        },
        {
          key: "mfStatus",
          label: "สถานะ",
          sortable: true
        },
        {
          key: "workEndAt",
          label: "วันที่ปิดงาน",
          sortable: true
        }
      ],
      currentPage: 1,
      perPage: 30,
      totalRows: 0,
      pageOptions: [30, 60, 90, 120],
      sortBy: null,
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      selected: null,
      options: [],

      totalSum: 0,
      totalIncome: 0,
      totalIncomeAll: 0,
      totalIncomeReal: 0,
      totalWork: 0
    };
  },
  created() {
    this.fetchLastMonth();
  },
  computed: {
    asyncSource() {
      return this.$store.state.source;
    },
    sortOptions() {
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    }
  },
  watch: {
    selected() {
      this.fetch();
    }
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    status(s) {
      switch (s) {
        case 1:
          return {
            color: "primary",
            text: "ดำเนินการ"
          };
        case 2:
          return {
            color: "dark",
            text: "ตรวจสอบ"
          };
        case 3:
          return {
            color: "warning",
            text: "แก้ไข"
          };
        case 4:
          return {
            color: "success",
            text: "เสร็จสิ้น"
          };
        case 5:
          return {
            color: "danger",
            text: "ยกเลิก"
          };
        default:
          return {
            color: "secondary",
            text: "N/a"
          };
          break;
      }
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(",", ".");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    fetchLastMonth() {
      let self = this;
      self.selected = self
        .$moment()
        .subtract(0, "M")
        .format("YYYY-MM");

      for (let i = 0; i < 13; i++) {
        let last = self.$moment().subtract(i, "M");
        self.options.push({
          value: self.$moment(last).format("YYYY-MM"),
          text:
            self.$moment(last).format("MMMM") +
            " - " +
            (self.$moment(last).format("YYYY") * 1 + 543).toString() +
            " - " +
            (i > 0 ? "ปิดบัญชี" : "ดำเนินการ")
        });
      }

      self.fetch();
    },
    myRowClickHandler(record, index) {
      if (!this.filter) {
        this.filter = record.workId + "";
      } else {
        this.filter = null;
      }
    },

    async fetch() {
      let self = this;
      this.$store.dispatch("sourceLoaded", true);
      await this.$axios
        .$get(`/v2/etp-setting/${this.$store.state.user.entId}`)
        .then(function(res) {
          self.enterprise = [];
          if (res.length > 0) {
            self.enterprise = res[0];
          }
        });
      await this.$axios
        .$get(
          `/v2/report/total/${this.$store.state.user.entId}/${this.selected}`
        )
        .then(function(res) {
          if (res) {
            self.totalSum = res[0].alls;
          }
        });
      await this.$axios
        .$get(`/v2/report/${this.$store.state.user.entId}/${this.selected}`)
        .then(function(res) {
          self.items = [];
          self.totalWork = 0;
          if (res.length > 0) {
            self.items = res;
            self.totalIncomeAll = cals.reportIncomeAll(res);
            self.totalIncomeReal = cals.reportIncomeReal(res);
            self.totalIncome = cals.reportIncome(res);
            self.totalWork = cals.reportCountWorks(res);
            self.totalRows = res.length;
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
