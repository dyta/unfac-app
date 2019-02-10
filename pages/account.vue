

<template>
  <div>
    <b-jumbotron
      fluid
      header="บัญชีของฉัน"
      lead="Workforce management system for non-routine on Line Application."
    ></b-jumbotron>

    <b-container class="mb-5">
      <b-tabs vertical nav-wrapper-class="col-12 col-md-4" content-class="col-12 col-md-8 px-4">
        <b-tab title="ข้อมูลบัญชี" active>
          <b-alert variant="warning" show>
            <i>Disabled</i>
          </b-alert>
        </b-tab>
        <b-tab title="การเรียกเก็บเงิน">
          <b-alert variant="warning" show>
            <i>Disabled</i>
          </b-alert>
        </b-tab>
      </b-tabs>
    </b-container>
    <loading :active.sync="asyncSource" :is-full-page="false" :opacity=".7" :height="34"></loading>
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
