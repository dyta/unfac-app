<template>
  <div>
    <LazyHydrate ssr-only>
      <nuxt/>
    </LazyHydrate>
  </div>
</template>

<script>
import LazyHydrate from "vue-lazy-hydration";

export default {
  components: {
    LazyHydrate
  }
};
</script>
