

<template>
  <div>
    <b-jumbotron
      fluid
      header="บัญชีของฉัน"
      lead="Workforce management system for non-routine on Line Application."
      class="jumbotron-special"
    ></b-jumbotron>

    <b-container class="mb-5">
      <b-tabs vertical nav-wrapper-class="col-12 col-md-4" content-class="col-12 col-md-8 px-4">
        <b-tab title="ข้อมูลบัญชี" active>
          <b-card class="text-center">
            <fa icon="exclamation-circle" size="3x" color="orange" class="mt-2"/>
            <h5 class="mt-3">ไม่พร้อมใช้งาน</h5>
          </b-card>
        </b-tab>
        <b-tab title="การเรียกเก็บเงิน">
          <b-card class="text-center">
            <fa icon="exclamation-circle" size="3x" color="orange" class="mt-2"/>
            <h5 class="mt-3">ไม่พร้อมใช้งาน</h5>
          </b-card>
        </b-tab>
      </b-tabs>
    </b-container>
    <loading :active.sync="asyncSource" :is-full-page="false" :opacity=".3" :height="34"></loading>
  </div>
</template>

<script>
export default {
  layout: "default",
  head() {
    return {
      title: "บัญชีของฉัน"
    };
  },
  computed: {
    asyncSource() {
      return this.$store.state.source;
    }
  }
};
</script>

<style lang="scss" scoped>
.display-3 {
  font-size: 2rem !important;
}
</style>
