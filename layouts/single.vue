<template>
  <div class="bg-image">
    <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true" :height="34"></loading>
    <nuxt v-if="user"/>
  </div>
</template>


<script>
export default {
  computed: {
    isLoading() {
      return this.$store.state.loading;
    },
    user() {
      let user = this.$store.state.user;
      if (user && user.entId) {
        this.$router.push("/");
      } else {
        return this.$store.state.user;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
