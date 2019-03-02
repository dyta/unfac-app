<template>
  <div>
    <b-jumbotron
      fluid
      header="แจ้งเตือนงาน"
      class="jumbotron-special-lg mb-0"
      :lead="`ประกาศงานไปยังแชทของพนักงาน`"
    ></b-jumbotron>
  </div>
</template>

<script>
export default {
  layout: "default",
  head() {
    return {
      title: "แจ้งเตือนงาน"
    };
  }
};
</script>
<style lang="scss" scoped>
.display-3 {
  font-size: 2rem !important;
}
</style>