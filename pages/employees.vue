<template>
  <div>
    <b-jumbotron fluid header="พนักงาน" :lead="textHeader">
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
    <b-container class="pt-4">
      <!-- Main table element -->
      <b-table
        show-empty
        responsive
        hover
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
        <template slot="actions" slot-scope="row">
          <b-button
            size="sm"
            variant="outline"
            @click.stop="row.toggleDetails"
          >{{ row.detailsShowing ? 'ซ่อน' : 'แสดง' }}รายละเอียด</b-button>
        </template>
        <template slot="row-details" slot-scope="row">
          <b-card>
            <ul>
              <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value}}</li>
            </ul>
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
      fields: [
        {
          key: "empId",
          label: "ID"
        },
        {
          key: "empFullname",
          label: "ชื่อพนักงาน"
        },
        {
          key: "empPhoneNumber",
          label: "เบอร์โทร"
        },
        {
          key: "empStatus",
          label: "สถานะการทำงาน"
        },
        {
          key: "userAuth",
          label: "ยืนยันตัวคน"
        },
        {
          key: "empRole",
          label: "ตำแหน่ง"
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
      return `จำนวนพนักงานในเครือข่ายทั้งหมด ${this.items.length} บัญชี`;
    }
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    myRowClickHandler(record, index) {
      console.log("record: ", record);
    },
    async fetch() {
      let _this = this;
      this.$store.dispatch("sourceLoaded", true);
      await this.$axios
        .$get(`/v2/employee/${this.$store.state.user.entId}`)
        .then(function(res) {
          if (res.length > 0) {
            _this.items = res;
            _this.totalRows = res.length;
          }
          _this.$store.dispatch("sourceLoaded", false);
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
