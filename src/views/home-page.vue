<template>
  <section class="home-page-container">
    <div class="title-container">
      <!-- <div class="title-text"> -->
      <h1 class="home-logo">
        Mellow helps teams
        move work forward
      </h1>
      <h3 class="title">Collaborate, manage projects, and reach new productivity peaks. From high rises to the home
        office, the way your your team works is unique - accomplish it all with Mellow</h3>
      <router-link class="home-link" to="/board">
        <span class="guest-login-button">See Demo</span>
      </router-link>
      <!-- </div> -->
      <div class="homepage-img">
        <img class="home-page-img" src="../assets/imgs/mellow-cover.png" />
      </div>
    </div>
    <div class="secondary-text">
      <h1> It's more than work. It's a way of working together.</h1>
      <h3>Start with a Mellow board, lists, and cards. Customize and expand with more features as your teamwork grows.
        Manage projects, organize tasks, and build team spirit—all in one place.</h3>
      <img src="../assets/imgs/example-board.png" alt="">
    </div>
  </section>
</template>

<script>
export default {
  // props: [""],

  components: {},
  data() {
    return {};
  },
  created() { },
  methods: {},
  computed: {

  },
  unmounted() { },
};
</script>

<style>

</style>