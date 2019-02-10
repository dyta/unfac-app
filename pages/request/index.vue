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
      <b-row v-if="items.length > 0">
        <b-col v-for="(item, index) in items" :key="index" md="6" lg="4" class="py-2 px-1">
          <b-card
            class="selected-request"
            @click="() => $router.push(`/request/approve?wid=${item.workId}&eid=${user.entId}`)"
          >
            <b-media>
              <b-img slot="aside" rounded :src="item.workImages" width="80" height="80"/>
              <b-container class="p-0 text-center">
                <h6 class="mt-0 text-left">
                  #{{item.workId}}
                  <b-badge
                    pill
                    :variant="StatusColor(item.workStatus).color"
                  >{{StatusColor(item.workStatus).text}}</b-badge>
                </h6>
                <b-row class="font-size-12 border-bottom border-top py-1 mx-1">
                  <b-col md="4" class="border-right p-0">คำขอ</b-col>
                  <b-col md="4" class="p-0">อนุมัติ</b-col>
                  <b-col md="4" class="border-left p-0">เสร็จสิ้น</b-col>
                </b-row>
                <b-row class="pt-1 mx-1">
                  <b-col md="4" class="border-right p-0">{{item.pending}}</b-col>
                  <b-col md="4" class="p-0">{{item.approved}}</b-col>
                  <b-col md="4" class="border-left p-0">{{item.complete}}/{{item.workVolume}}</b-col>
                </b-row>
              </b-container>
            </b-media>
            <div slot="footer">
              <b-progress
                :value="item.complete"
                :max="item.workVolume"
                :variant="StatusColor(item.workStatus).color"
                height="3px"
                striped
                :animated="true"
                class="mb-2"
              ></b-progress>
              <small class="text-muted">อัพเดทล่าสุด {{date(item.workUpdateAt)}}</small>
            </div>
          </b-card>
        </b-col>
      </b-row>
      <b-alert v-else class="text-center" variant="warning" show>
        <fa icon="exclamation-circle" size="2x"/>
        <p class="mt-2">ไม่พบงานที่ถูกเผยแพร่</p>
        <b-button
          variant="warning"
          @click="()=> this.$router.push('/work-offer/overview')"
        >จัดการงาน</b-button>
      </b-alert>
    </b-container>
    <loading :active.sync="asyncSource" :is-full-page="false" :opacity=".7" :height="34"></loading>
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
  data() {
    return {
      items: [],
      totalRows: 0
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
    }
  },
  methods: {
    date(d) {
      return this.$moment(d).fromNow();
    },
    StatusColor(s) {
      switch (s) {
        case 3:
          return {
            color: "primary",
            text: "Published"
          };
        case 4:
          return {
            color: "danger",
            text: "Urgently"
          };
        case 5:
          return {
            color: "warning",
            text: "Paused"
          };
        default:
          break;
      }
    },
    async fetch() {
      let self = this;
      this.$store.dispatch("sourceLoaded", true);
      await this.$axios
        .$get(`/v2/work/published/${this.$store.state.user.entId}`)
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
.selected-request {
  transition: transform 0.2s;
  cursor: pointer;
}
.selected-request:hover {
  transform: scale(1.02);
}
</style>
