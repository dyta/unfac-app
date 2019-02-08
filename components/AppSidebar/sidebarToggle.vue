<template>
  <button
    :class="[open ? [$style.active,$style.button_d]  : '',  $style.button]"
    @click="handleClick"
  >
    <svg
      fill="#000000"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none"></path>
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
      ></path>
    </svg>
  </button>
</template>

<script>
export default {
  name: "sidebar-toggle",
  computed: {
    open() {
      return this.$store.state.sidebarOpen;
    }
  },
  methods: {
    handleClick() {
      this.$store.dispatch("toggleSidebar");
    }
  }
};
</script>

<style module>
@media (min-width: 640px) {
  .button {
    top: 0.5rem !important;
    left: 3rem;
  }
  .button_d {
    left: 18em !important;
  }
}

.button {
  position: fixed;
  bottom: 1.6rem !important ;
  right: 1rem;
  padding: 0;
  height: 50px;
  width: 50px;
  border: 3px solid transparent;
  border-radius: 50%;
  background-color: transparent;
  color: var(--dark);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  z-index: 4031;
  transition: 2s ease-in-out, border-color 2s ease-out;
  opacity: 1 !important;
  transition: opacity 0.25s ease-in-out;
  -moz-transition: opacity 0.25s ease-in-out;
  -webkit-transition: opacity 0.25s ease-in-out;
}

.button_d {
  /* left: 17.2rem; */
  transition: 300ms ease-in-out;
}

.button svg {
  height: 100%;
  width: 100%;
  fill: var(--teal);
  transition: fill 300ms ease-in-out;
}

.button:focus,
.button:hover {
  outline: none;
  border-color: var(--teal);
}

.active {
  transform: rotate(45deg);
}
</style>