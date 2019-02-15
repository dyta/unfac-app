<template>
  <div>
    <b-jumbotron
      fluid
      header="Published"
      lead="แสดงงานที่เปิดให้รับในโครงการของคุณ"
      class="jumbotron-special-lg mb-0 pb-3"
    >
      <small>เลือกงานข้างล่างนี้เพื่อจัดการรายการคำขออนุมัติ</small>

      <b-button variant="outline-primary" size="sm" @click="()=> this.fetch()">
        <fa icon="redo-alt" class="mr-1"/>
        <small>Refresh</small>
      </b-button>
    </b-jumbotron>
    <b-container fluid v-if="!asyncSource && items.length > 0" class="w-75 p-0">
      <b-row v-if="items.length > 0">
        <b-col v-for="(item, index) in items" :key="index" md="6" lg="3" class="py-2 px-1">
          <b-card
            class="selected-request"
            @click="() => $router.push(`/request/approve?wid=${item.workId}&eid=${user.entId}`)"
          >
            <b-media>
              <b-img slot="aside" rounded :src="item.workImages" width="80" height="80"/>
              <b-container class="p-0 text-center">
                <h6 class="mt-0 text-left">
                  งานที่
                  <b>{{item.workId}}</b>
                  <small class="normal">{{item.workName}}</small>
                </h6>

                <b-row class="font-size-12 border-bottom border-top py-1 mx-1">
                  <b-col md="4" class="p-0">ผู้ขอ</b-col>
                  <b-col md="4" class="p-0">อนุมัติ</b-col>
                  <b-col md="4" class="p-0">คงเหลือ</b-col>
                </b-row>
                <b-row class="pt-1 mx-1">
                  <b-col
                    md="4"
                    class="p-0"
                  >{{item.complete === item.workVolume ? 'S' : item.pending}}</b-col>
                  <b-col
                    md="4"
                    class="p-0"
                  >{{item.complete === item.workVolume ? 'S' :item.approved+item.complete }}</b-col>
                  <b-col
                    md="4"
                    class="p-0"
                  >{{item.complete === item.workVolume ? 'S' : item.workVolume-(item.approvedSum ? item.approvedSum : 0)}}</b-col>
                </b-row>
              </b-container>
            </b-media>
            <div slot="footer">
              <b-progress
                :value="item.approvedSum ? item.approvedSum : item.complete ? item.complete : 0"
                :max="item.workVolume"
                height="8px"
                striped
                animated
                class="mb-2"
              ></b-progress>
              <small class="text-muted">
                อัพเดทล่าสุด {{date(item.workUpdateAt)}}
                <b-badge
                  pill
                  :variant="StatusColor(item.workStatus).color"
                >{{StatusColor(item.workStatus).text}}</b-badge>
              </small>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <b-container v-else-if="items.length === 0 && !asyncSource">
      <b-card class="text-center" style="box-shadow: 0 0 1em var(--gray-light);">
        <fa icon="exclamation-circle" size="3x" color="orange" class="mt-2"/>
        <h5 class="mt-3">ไม่พบงานที่เปิดรับ</h5>
        <small>
          ไปที่
          <b @click="()=>$router.push('/work-offer')">งาน</b> เพื่อจัดการงานและเปิดใช้งาน
        </small>
      </b-card>
    </b-container>
    <loading :active.sync="asyncSource" :is-full-page="false" :opacity=".7" :height="34"></loading>
  </div>
</template>

<script>
export default {
  layout: "default",
  head() {
    return {
      title: "Published"
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
