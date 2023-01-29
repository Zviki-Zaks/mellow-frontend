<template>
  <header class="app-header-container" :class="bgc">
    <div class="app-header-inner flex">
      <router-link class="logo-link flex" to="/">
        <img class="logo-img" src="../assets/svgs/trello.svg" alt />
        <h3 class="logo">Mellow</h3>
      </router-link>
      <nav class="app-header-nav flex">
        <div class="app-header-left-nav flex">
          <button class="btn-header flex" @click="$router.push('/board')">
            Workspace
            <span class="header-arrow-icon"></span>
          </button>
          <button class="btn-header recent flex" @click="openCmp('isRecent')">
            Recent
            <span class="header-arrow-icon"></span>
          </button>
          <board-recent v-if="handles.isRecent" @closeCmp="openCmp" />
          <button class="btn-header create flex" @click="openCmp('isCreateBoard')">
            Create
            <span v-if="handles.isCreateBoard" class="header-arrow-icon"></span>
          </button>
          <create-board v-if="handles.isCreateBoard" @closeCmp="openCmp" />
        </div>
        <div class="app-header-right-nav flex">
          <router-link v-if="!userIsLoggedIn" class="login-btn" @click="isLogin = true" to="/login">Log in</router-link>
          <router-link v-if="!userIsLoggedIn" class="signup-btn" @click="isLogin = true" to="/login">Sign
            up</router-link>
          <router-link to="/login" class="header-bell pointer">
            <img src="../assets/svgs/bell.svg" />
          </router-link>
          <router-link to="/login" class="avatar-login-link">
            <user-avatar class="pointer" v-if="currLoggedInUser" :user="currLoggedInUser" />
          </router-link>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import boardRecent from "./board-recent.vue";
import createBoard from "./create-board.vue";
import userAvatar from "./user-avatar.vue";
export default {
  data() {
    return {
      handles: {
        isRecent: false,
        isCreateBoard: false,
      },
      isBlue: false,
      isLogin: false,

    };
  },
  created() {

  },
  methods: {
    openCmp(type) {
      if (typeof type !== "string") {
        for (let key in this.handles) {
          this.handles[key] = false;
        }
        return;
      }
      if (this.handles[type] === true) {
        this.handles[type] = false;
      } else {
        for (let key in this.handles) {
          this.handles[key] = false;
        }
        this.handles[type] = true;
      }
    },
  },
  computed: {
    bgc() {
      return { blue: this.isBlue };
    },
    currLoggedInUser() {
      const currUser = this.$store.getters.loggedinUser
      if (currUser) this.userLoggedIn = true
      return currUser ? currUser : this.$store.getters.getGuestUser
    },
    userIsLoggedIn() {
      const currUser = this.$store.getters.loggedinUser
      if (currUser) return true
    }
  },
  watch: {
    "$route.path": {
      immediate: true,
      handler() {
        const path = this.$route.path;
        if (path === "/board" || path === "/login") {
          this.isBlue = true;
        } else this.isBlue = false;
        if (path !== "/" && path !== "/login") {
        }
      },
    },
  },

  components: {
    boardRecent,
    createBoard,
    userAvatar,
  },
};
</script>

<style>

</style>