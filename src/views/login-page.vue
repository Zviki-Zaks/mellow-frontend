
<template>
  <section class="login-page">
    <h1 class="login-logo-header">
      <div class="login-icon"><span></span></div>
      Mellow
    </h1>

    <div class="main-login-container">
      <p class="login-welcome-msg">Log in to Mellow</p>

      <button class="log-out-button" v-if="loggedinUser" @click="doLogout">
        Logout {{ loggedinUser.username }}
      </button>
      <section class="login-form-container" v-else>
        <form class="sign-in-form" v-if="isSignIn" @submit.prevent="doLogin">
          <input class="login-form-input" type="text" v-model="loginCred.username" placeholder="Enter username" />
          <input class="login-form-input" type="password" v-model="loginCred.password" placeholder="Enter password" />
          <button class="login-button">Log In</button>
          <div class="or-div">OR</div>
          <button class="login-button guest" @click="guestLogin">
            Login as Guest
          </button>
        </form>

        <form class="sign-up-form" v-if="!isSignIn" @submit.prevent="doSignup">
          <input class="login-form-input" type="text" v-model="signupCred.fullname"
            placeholder="Enter your full name" />
          <input class="login-form-input" type="text" v-model="signupCred.username" placeholder="Enter username" />
          <input class="login-form-input" type="password" v-model="signupCred.password" placeholder="Enter password" />
          <button class="login-button">Login</button>
        </form>
        <hr class="thin-hr" />
        <div class="signup-select-container">
          <a class="sign-up-toggle" @click="toggleLoginSignUp"> Can't log in?</a>
          <span class="trello-dot"></span>
          <a class="sign-up-toggle" @click="toggleLoginSignUp">{{
            loginSignUpButton
          }}</a>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      loginCred: { username: "", password: "" },
      signupCred: { fullname: "", username: "", password: "" },
      isSignIn: true,
      msg: "",
    };
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    loginSignUpButton() {
      return this.isSignIn ? "Sign up for an account" : "Back";
    },
  },
  created() {
    this.loadUsers();
  },
  methods: {
    async doLogin() {
      if (!this.loginCred.username) {
        this.msg = "Please enter username/password";
        return;
      }
      try {
        await this.$store.dispatch({ type: "login", userCred: this.loginCred });
        this.$router.push("/board");
      } catch (err) {
        this.msg = "Failed to login";
      }
    },
    doLogout() {
      this.$store.dispatch({ type: "logout" });
    },
    async doSignup() {
      if (
        !this.signupCred.fullname ||
        !this.signupCred.password ||
        !this.signupCred.username
      ) {
        this.msg = "Please fill out all of the form details";
        return;
      }
      try {
        await this.$store.dispatch({
          type: "signup",
          userCred: this.signupCred,
        });
        this.$router.push("/board");
      } catch (err) {
        this.msg = "Failed to sign up new user";
      }
    },
    toggleLoginSignUp() {
      this.isSignIn = !this.isSignIn;
    },
    async removeUser(userId) {
      try {
        await this.$store.dispatch({ type: "removeUser", userId });
        this.msg = "User removed";
      } catch (err) {
        this.msg = "Failed to remove user";
      }
    },
    async guestLogin() {
      try {
        await this.$store.dispatch({
          type: "login",
          userCred: { username: "Guest", password: "123" },
        });
        this.$router.push("/board");
      } catch (err) {
        console.log(err);
        this.msg = "Failed to do guest login";
      }
    },
    loadUsers() {
      this.$store.dispatch({ type: "loadUsers" });
    },
  },
};
</script>
