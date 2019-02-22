<template>
  <div>
    <b-jumbotron
      fluid
      header="Dashboard"
      lead="Workforce management system for non-routine on Line Application."
      class="jumbotron-special"
    ></b-jumbotron>
    <b-container class="p-0">
      <b-row>
        <b-col md="8"></b-col>
        <b-col md="4">
          <b-card style="position: relative !important">
            <loading
              :active.sync="this.isActivity"
              :can-cancel="false"
              :is-full-page="false"
              :height="34"
            ></loading>
            <b-media
              v-for="(item, index) in activities"
              :key="index"
              left-align
              vertical-align="top"
              style="line-height: 14px;"
              class="pb-2"
            >
              <b-img
                slot="aside"
                :blank="item.image ? false : true"
                :blank-color="item.image ? null : item.color"
                width="40"
                height="40"
                rounded="circle"
                :src="item.image"
                alt="placeholder"
              />
              <h6 class="m-0 font-size-14">{{item.title}}</h6>
              <small class="mb-0">เมื่อ {{$moment(item.time).fromNow()}}</small>
            </b-media>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { activity } from "./../configs/firebase.sdk.js";
import filter from "./../scripts/Filters.js";
export default {
  layout: "default",
  head() {
    return {
      title: "Dashboard"
    };
  },
  data() {
    return {
      items: [],
      activities: [],
      isActivity: false
    };
  },
  created() {
    this.activity();
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    async activity() {
      let self = this;
      activity
        .collection(`${this.user.entId}`)
        .onSnapshot(function(querySnapshot) {
          self.isActivity = true;
          self.activities, (self.items = []);
          querySnapshot.forEach(function(doc) {
            self.items.push(doc.data());
            self.activities = filter.sortByActivity(self.items);
          });
          setTimeout(() => {
            self.isActivity = false;
          }, 1000);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.display-3 {
  font-size: 2rem !important;
}
</style>
