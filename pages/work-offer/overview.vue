<template>
  <div>
    <b-jumbotron fluid header="งานทั้งหมด" :lead="textHeader">
      <b-row>
        <b-col md="6">
          <b-form-group label class="mb-0">
            <b-input-group>
              <b-form-input v-model="filter" placeholder="ค้นหาคำที่เกี่ยวข้อง"/>
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
        small
        striped
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
        <template slot="workStartAt" slot-scope="row">
          {{date(row.value).format}}
          <br>
          <b-badge variant="light">
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
                <b-button class="btn-option" variant="outline-dark">กำหนดคิวงาน</b-button>
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
        :title="`แก้ไขหมายเลขงาน: ${WorkInfoItem.workId}`"
        ok-only
      >
        <pre>{{ WorkInfoItem }}</pre>
      </b-modal>
    </b-container>
    <loading :active.sync="asyncSource" :is-full-page="false" :opacity=".7" :height="34"></loading>
  </div>
</template>

<script>
export default {
  layout: "default",
  head() {
    return {
      title: "Work Offer"
    };
  },
  data() {
    return {
      items: [],
      WorkInfoItem: {
        workId: null
      },
      fields: [
        {
          key: "workId",
          label: "ID",
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
      filter: null
    };
  },
  created() {
    this.fetch();
  },
  computed: {
    asyncSource() {
      return this.$store.state.source;
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
    myRowClickHandler(record, index) {
      console.log("record: ", record);
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
      this.WorkInfoItem = item;
      this.$root.$emit("bv::show::modal", "WorkInfoItem", button);
    },
    resetModal() {
      this.WorkInfoItem = {
        workId: null
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@media (min-width: 640px) {
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
</style>
