<template>
  <header class="app-header-container" :class="bgc">
    <div class="app-header-inner flex">
      <router-link class="logo-link flex" to="/">
        <img class="logo-img" src="../../assets/svgs/trello.svg" alt />
        <h3 class="logo">Mellow</h3>
      </router-link>
      <nav class="app-header-nav flex">
        <div class="app-header-left-nav flex">
          <button v-if="!isHome && !isLogin && !isBoards" class="btn-header flex" @click="$router.push('/board')">
            Workspace
          </button>
          <button v-if="!isHome && !isLogin" class="btn-header recent flex" @click="openCmp('isRecent')">
            Recent
            <span class="header-arrow-icon"></span>
          </button>
          <board-recent v-if="handles.isRecent" @closeCmp="openCmp" />
          <button v-if="!isHome && !isLogin" class="btn-header create flex" @click="openCmp('isCreateBoard')">
            Create
            <span v-if="handles.isCreateBoard" class="header-arrow-icon"></span>
          </button>
          <create-board v-if="handles.isCreateBoard" @closeCmp="openCmp" />
        </div>
        <div class="app-header-right-nav flex">
          <template v-if="!userIsLoggedIn && !isLogin">
            <router-link class="login-btn" to="/login">Log
              in</router-link>
            <router-link class="signup-btn" to="/login">Sign
              up</router-link>
          </template>
          <button class="header-bell not-clickable">
            <img src="../../assets/svgs/bell.svg" />
          </button>
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
import userAvatar from "../user-avatar.vue";

export default {
  data() {
    return {
      handles: {
        isRecent: false,
        isCreateBoard: false,
      },
      isHome: true,
      isBoards: false,
      isLogin: false,
    };
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
      return { blue: this.isBoards || this.isLogin };
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
        if (path === "/") {
          this.isHome = true;
        } else {
          this.isHome = false
        }
        if (path === "/login") {
          this.isLogin = true;
        } else {
          this.isLogin = false
        }
        if (path === "/board") {
          this.isBoards = true;
        } else {
          this.isBoards = false;
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
