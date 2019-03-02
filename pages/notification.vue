<template>
  <div>
    <b-jumbotron
      fluid
      header="แจ้งเตือนงาน"
      class="jumbotron-special-lg mb-0 pb-0"
      :lead="`ประกาศงานไปยังแชทของพนักงาน`"
    ></b-jumbotron>
    <b-container>
      <b-row>
        <b-col md="6">
          <b-form-group>
            <template slot="label">
              <h5>เลือกพนักงานที่ต้องการส่งแจ้งเตือน:</h5>
              <hr>
              <b-form-checkbox
                v-model="allSelected"
                :indeterminate="indeterminateEmp"
                aria-describedby="flavours"
                aria-controls="flavours"
                @change="toggleAll"
              >{{ allSelected ? 'เอาออกทั้งหมด' : 'เลือกทั้งหมด' }}</b-form-checkbox>
            </template>
            <b-form-checkbox-group
              id="flavors"
              stacked
              v-model="selectedEmp"
              name="flavs"
              buttons
              button-variant="outline-primary"
              :options="employee"
              text-field="name"
              value-field="key"
              disabled-field="disabled"
              html-field="html"
              class="ml-4"
              aria-label="Individual flavours"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group>
            <template slot="label">
              <h5>เลือกงาน:</h5>
              <hr>
              <b-form-checkbox
                v-model="allSelected"
                :indeterminate="indeterminateEmp"
                aria-describedby="flavours"
                aria-controls="flavours"
                @change="toggleAll"
              >{{ allSelected ? 'เอาออกทั้งหมด' : 'เลือกทั้งหมด' }}</b-form-checkbox>
            </template>
            <b-form-checkbox-group
              id="flavors"
              stacked
              v-model="selectedEmp"
              name="flavs"
              buttons
              button-variant="outline-primary"
              :options="employee"
              text-field="name"
              value-field="key"
              disabled-field="disabled"
              html-field="html"
              class="ml-4"
              aria-label="Individual flavours"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import filter from "./../scripts/Filters";
import convert from "./../scripts/ConvertText";
export default {
  layout: "default",
  head() {
    return {
      title: "แจ้งเตือนงาน"
    };
  },
  data() {
    return {
      employee: [],
      selectedEmp: [],
      allSelected: false,
      indeterminateEmp: false
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    toggleAll(checked) {
      this.selectedEmp = checked ? filter.selecteEmployee(this.employee) : [];
    },
    async fetch() {
      let self = this;
      await this.$axios
        .$get(`/v2/employee/notification/${this.$store.state.user.entId}`)
        .then(function(res) {
          if (res.length > 0) {
            self.employee = convert.notificationToBoolean(res);
          }
        });
    }
  },
  watch: {
    selectedEmp(newVal, oldVal) {
      // Handle changes in individual flavour checkboxes
      if (newVal.length === 0) {
        this.indeterminateEmp = false;
        this.allSelected = false;
      } else if (newVal.length === this.employee.length) {
        this.indeterminateEmp = false;
        this.allSelected = true;
      } else {
        this.indeterminateEmp = true;
        this.allSelected = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.display-3 {
  font-size: 2rem !important;
}
</style>