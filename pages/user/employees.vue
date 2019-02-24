<template>
  <div>
    <b-jumbotron
      fluid
      header="พนักงาน"
      class="jumbotron-special-lg mb-0"
      :lead="`จำนวนพนักงานทั้งหมด ${this.items.length} คน`"
    >
      <b-row>
        <b-col md="7">
          <b-form-group label="ค้นหา">
            <b-input-group>
              <b-form-input v-model="filter" placeholder="ID ชื่อพนักงานหรือเบอร์โทร"/>
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
    </b-jumbotron>
    <b-container v-if="!asyncSource && items.length > 0">
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
        <template slot="empPictureUrl" slot-scope="row">
          <b-img
            rounded="circle"
            :src="row.value"
            width="40"
            height="40"
            :alt="row.item.empFullname"
          />
        </template>
        <template slot="empStatus" slot-scope="row">
          <b-badge :variant="status(row.value).color">{{status(row.value).text}}</b-badge>
        </template>
        <template slot="userAuth" slot-scope="row">
          <fa :icon="row.value ? 'check' : 'times'" :color="row.value ? 'green' : 'red'"/>
        </template>
        <template slot="actions" slot-scope="row">
          <b-button
            size="sm"
            variant="outline"
            @click.stop="row.toggleDetails"
          >{{ row.detailsShowing ? 'ซ่อน' : 'แสดง' }}รายละเอียด</b-button>
        </template>
        <template slot="row-details" slot-scope="row">
          <b-card>
            <div class="form-row">
              <div class="col">
                <b-form-group label="Line Uniq:">
                  <b-form-input :value="row.item.empLineId" disabled/>
                </b-form-group>
              </div>
              <div class="col">
                <b-form-group label="ปริมาณการรับงานสูงสุด:">
                  <div class="input-group mb-3">
                    <input
                      type="number"
                      class="form-control"
                      placeholder="ปริมาณการรับงานสูงสุด"
                      v-model="row.item.empCapacity"
                    >
                    <div class="input-group-append">
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="clickCapacity(row.item)"
                      >อัพเดท</button>
                    </div>
                  </div>
                </b-form-group>
              </div>
            </div>
            <div class="form-row">
              <div class="col">
                <b-form-group label="เลขบัตรประจำตัวประชาชน:">
                  <b-form-input :value="row.item.empIdentity" disabled/>
                </b-form-group>
              </div>
              <div class="col">
                <b-form-group label="ชื่อ-นามสกุล:">
                  <b-form-input :value="row.item.empFullname" disabled/>
                </b-form-group>
              </div>
              <div class="col">
                <b-form-group label="เบอร์โทร:">
                  <b-form-input :value="row.item.empPhoneNumber" disabled/>
                </b-form-group>
              </div>
            </div>
            <b-form-group label="ที่อยู่:">
              <b-form-textarea
                size="sm"
                rows="3"
                disabled
                :value="row.item.empAddress + row.item.empAddress2"
              />
            </b-form-group>
            <b-button
              variant="success"
              v-if="!row.item.userAuth"
              @click="clickConfirm(row.item, 1)"
            >ยืนยันพนักงาน</b-button>
            <b-button variant="danger" @click="clickConfirm(row.item, 0)" v-else>ปลดพนักงานคนนี้</b-button>
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
    <b-container v-else-if="items.length === 0 && !asyncSource">
      <b-card class="text-center" style="box-shadow: 0 0 1em var(--gray-light);">
        <fa icon="exclamation-circle" size="3x" color="orange" class="mt-2"/>
        <h5 class="mt-3">ไม่พบพนักงานในโครงการ</h5>
        <small>
          ไปที่
          <b @click="()=>$router.push('/setting/application')">ตั้งค่าแอปพลิเคชัน</b> เพื่อรับลิงค์การเชื่อมต่อให้พนักงานเข้าใช้งาน
        </small>
      </b-card>
    </b-container>
    <loading :active.sync="asyncSource" :is-full-page="false" :opacity=".3" :height="34"></loading>
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
          key: "empId",
          label: "ID",
          sortable: true
        },
        {
          key: "empPictureUrl",
          label: "Avatar"
        },
        {
          key: "empFullname",
          label: "ชื่อพนักงาน",
          sortable: true
        },
        {
          key: "empPhoneNumber",
          label: "เบอร์โทร"
        },
        {
          key: "empStatus",
          label: "สถานะ",
          sortable: true
        },
        {
          key: "userAuth",
          label: "ยืนยันพนักงาน",
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
    status(key) {
      let convert = {
        text: "ยังไม่ได้กรอกข้อมูล",
        color: ""
      };
      switch (key) {
        case 1:
          return convert;
          break;
        case 2:
          convert.text = "รอการตรวจสอบ";
          convert.color = "primary";
          return convert;
          break;
        case 3:
          convert.text = "พร้อมทำงาน";
          convert.color = "success";
          return convert;
          break;
        case 4:
          convert.text = "ไม่พร้อมทำงาน";
          convert.color = "danger";
          return convert;
          break;
        default:
          break;
      }
    },
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
        .$get(`/v2/employee/${this.$store.state.user.entId}`)
        .then(function(res) {
          if (res.length > 0) {
            self.items = res;
            self.totalRows = res.length;
          }
          self.$store.dispatch("sourceLoaded", false);
        });
    },
    async clickConfirm(item, key) {
      let self = this;
      await this.$axios
        .$put(`/v2/employee/${key}`, item)
        .then(function(res) {
          self.$toast.success(
            `พนักงาน ${item.empFullname} ได้รับการเปลี่ยนแปลงเรียบร้อยแล้ว`,
            {
              theme: "outline",
              position: "bottom-right",
              duration: 4000
            }
          );
        })
        .catch(e => {
          self.$toast.error(e, {
            theme: "outline",
            position: "bottom-right",
            duration: 4000
          });
        });
      self.fetch();
    },
    async clickCapacity(item) {
      console.log("item: ", item);
      let self = this;
      await this.$axios
        .$put(`/v2/employee/${item.empId}/capacity`, item)
        .then(function(res) {
          self.$toast.success(
            `พนักงาน ${item.empFullname} ได้รับการเปลี่ยนแปลงเรียบร้อยแล้ว`,
            {
              theme: "outline",
              position: "bottom-right",
              duration: 4000
            }
          );
        })
        .catch(e => {
          self.$toast.error(e, {
            theme: "outline",
            position: "bottom-right",
            duration: 4000
          });
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
