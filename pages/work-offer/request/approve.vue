<template>
  <div>
    <b-jumbotron
      fluid
      header="Approve"
      lead="Workforce management system for non-routine on Line Application."
    ></b-jumbotron>

    <b-container>{{items}}</b-container>
    <loading :active.sync="asyncSource" :is-full-page="false" :opacity=".7" :height="34"></loading>
  </div>
</template>

<script>
export default {
  layout: "default",
  head() {
    return {
      title: "Approve"
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
    async fetch() {
      let self = this;
      this.$store.dispatch("sourceLoaded", true);
      await this.$axios
        .$get(`/v2/request/${this.$route.query.w}/${this.user.entId}`)
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
</style>
