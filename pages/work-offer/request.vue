<template>
  <div>
    <b-jumbotron
      fluid
      header="เลือกงานที่ถูกเผยแพร่"
      lead="แสดงงานทั้งหมดที่ถูก Published ในโครงการของคุณ"
    >
      <small>เลือกงานข้างล่างนี้เพื่อจัดการรายการคำขออนุมัติ</small>
    </b-jumbotron>
    <b-container>
      <b-row>
        <b-col v-for="(item, index) in 12" :key="index" lg="3" class="py-2 px-1">
          <b-card :key="index" img-src="https://placekitten.com/1000/300" img-top>
            <p class="card-text">Some quick example</p>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  layout: "default",
  head() {
    return {
      title: "งานที่ถูกเผยแพร่"
    };
  },
  created() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.display-3 {
  font-size: 2rem !important;
}
</style>
