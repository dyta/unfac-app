<template>
  <div>
    <b-jumbotron
      fluid
      header="Collaborators"
      :lead="`จำนวนผู้ร่วมงานทั้งหมด ${this.items.length} คน`"
      class="jumbotron-special-lg pb-0"
    >
      <b-row>
        <b-col md="7">
          <b-form-group label="ค้นหา" class="mb-0">
            <b-input-group>
              <b-form-input v-model="filter" placeholder="ID ชื่อผู้ร่วมงานหรือเบอร์โทร"/>
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
          <b-form-group label="โหลดอีกครั้ง">
            <b-button block variant="outline-primary" @click="()=> this.fetch()">
              <fa icon="redo-alt" class="mr-1"/>
            </b-button>
          </b-form-group>
        </b-col>
      </b-row>
      <b-alert variant="warning" show>
        <h6>คำแนะนำ</h6>
        <small>การขอเข้าร่ามโครงการ ผู้เข้าร่วมจะมีสถานะดูแลจัดการได้ทั้งหมด</small>
      </b-alert>
    </b-jumbotron>
    <b-container v-if="!asyncSource && items.length > 0">
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
          <b-img
            rounded="circle"
            :src="row.value"
            width="50"
            height="50"
            class="m-1"
            :alt="row.item.workName"
          />
        </template>
        <template slot="actions" slot-scope="row">
          <b-button
            v-if="user.userRole === 2"
            :variant="row.item.invStatus === '0' ? 'success' : 'danger'"
            block
          >{{row.item.invStatus === '0' ? 'ยอมรับ':'ยกเลิกผู้ใช้นี้'}}</b-button>
          <small v-else>Access Denied</small>
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
        <h5 class="mt-3">ไม่พบผู้ร่วมงานในโครงการ</h5>
        <small>
          ไปที่
          <b @click="()=>$router.push('/setting/application')">ตั้งค่าแอปพลิเคชัน</b> เพื่อรับรหัสการขอเข้าร่วมโครงการ
        </small>
      </b-card>
    </b-container>
    <loading :active.sync="asyncSource" :is-full-page="false" :opacity=".1" :height="34"></loading>
  </div>
</template>

<script>
export default {
  layout: "default",
  head() {
    return {
      title: "Collaborators"
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
    user() {
      return this.$store.state.user;
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
