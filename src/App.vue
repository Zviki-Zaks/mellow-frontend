<template>
  <app-header />
  <router-view />
</template>

<script>
import appHeader from "./components/app-header.vue";
export default {
  components: {
    appHeader,
  },
  created() {
    this.$store.dispatch({ type: "loadBoards" });
    this.$store.dispatch({ type: "loadGuestUser" });
  },
};
</script>
