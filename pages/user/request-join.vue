<template>
  <div>
    <b-jumbotron
      fluid
      header="รายการคำขอเข้าร่วม"
      :lead="`จำนวนคำขอทั้งหมด ${this.items.length} รายการ`"
      class="jumbotron-special-lg"
    >
      <b-row>
        <b-col md="7">
          <b-form-group label="ค้นหา" class="mb-0">
            <b-input-group>
              <b-form-input v-model="filter" placeholder="ID ชื่อผู้ขอเข้าร่วมหรือเบอร์โทร"/>
              <b-input-group-append>
                <b-btn :disabled="!filter" @click="filter = ''" style="z-index: 0">ล้างคำค้นหา</b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="จำนวนรายการ" class="mb-0">
            <b-form-select :options="pageOptions" v-model="perPage"/>
          </b-form-group>
        </b-col>
        <b-col sm="2">
          <b-form-group label="ดึงข้อมูลใหม่">
            <b-button block @click="()=> this.fetch()">
              <fa icon="redo-alt"/>
            </b-button>
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
        @row-clicked="myRowClickHandler"
        @filtered="onFiltered"
      >
        <template slot="userPictureUrl" slot-scope="row">
          <b-img rounded="circle" :src="row.value" width="50" height="50" class="m-1"/>
        </template>
        <template slot="actions" slot-scope="row">
          <b-button-group v-if="row">
            <b-button variant="outline-danger">ปฏิเสธ</b-button>
            <b-button variant="success">ยอมรับ</b-button>
          </b-button-group>
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
      title: "Employees"
    };
  },
  data() {
    return {
      items: [],
      fields: [
        {
          key: "userPictureUrl",
          label: "โปรไฟล์"
        },
        {
          key: "userFullname",
          label: "ชื่อผู้ขอเข้าร่วม",
          sortable: true
        },
        {
          key: "userDisplayName",
          label: "ชื่อที่ใช้แสดง",
          sortable: true
        },
        {
          key: "userPhoneNumber",
          label: "เบอร์โทร",
          sortable: true
        },
        {
          key: "userEmail",
          label: "อีเมล",
          sortable: true
        },
        {
          key: "invCreateAt",
          label: "วันที่ทำรายการ",
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
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    }
  },
  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    myRowClickHandler(record, index) {
      console.log("record: ", record);
    },
    async fetch() {
      let self = this;
      this.$store.dispatch("sourceLoaded", true);
      await this.$axios
        .$get(`/v2/invite/${this.$store.state.user.entId}/request`)
        .then(function(res) {
          if (res.length > 0) {
            self.items = res;
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
