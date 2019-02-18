<template>
  <div>
    <b-row class="pl-4 pt-2 mr-0 title-menu-list">
      <h6 class="sidebar-header ml-2">{{header}}</h6>
    </b-row>
    <b-row class="mx-4">
      <b-col
        v-for="(item, index) in list"
        :key="index+item.name"
        cols="4"
        class="small-device pt-3 pb-2"
      >
        <div class="menu-list" @click="()=> router(item.path)">
          <div>
            <b-img v-if="item.img" :src="item.img" height="34" :alt="item.name"/>
            <fa v-else :icon="item.icon" size="2x" :color="item.color"/>
          </div>
          <div class="mt-2">
            <small>{{item.name}}</small>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  props: ["header", "list"],
  methods: {
    router(path) {
      this.$router.push(path);
      this.$store.dispatch("toggleSidebar");
    }
  }
};
</script>

