import { userService } from "../../services/user-service";
import {
  socketService,
  SOCKET_EVENT_USER_UPDATED,
} from "../../services/socket.service";

export default {
  state: {
    loggedinUser: userService.getLoggedinUser(),
    users: [],
    watchedUser: null,
    guestUser: userService.getGuestUser(),
  },
  getters: {
    users({ users }) {
      return JSON.parse(JSON.stringify(users));
    },
    loggedinUser({ loggedinUser }) {
      return loggedinUser;
    },
    watchedUser({ watchedUser }) {
      return watchedUser;
    },
    getGuestUser({ guestUser }) {
      return guestUser;
    },
  },
  mutations: {
    setLoggedinUser(state, { user }) {
      state.loggedinUser = user ? { ...user } : null;
    },
    setWatchedUser(state, { user }) {
      state.watchedUser = user;
    },
    setUsers(state, { users }) {
      state.users = users;
    },
    removeUser(state, { userId }) {
      state.users = state.users.filter((user) => user._id !== userId);
    },
    setGuestUser(state, { guestUser }) {
      state.guestUser = guestUser;
    },
  },
  actions: {
    async login({ commit }, { userCred }) {
      try {
        const user = await userService.login(userCred);
        commit({ type: "setLoggedinUser", user });
        return user;
      } catch (err) {
        console.log("userStore: Error in login", err);
        throw err;
      }
    },
    async signup({ commit }, { userCred }) {
      try {
        const user = await userService.signup(userCred);
        commit({ type: "setLoggedinUser", user });
        return user;
      } catch (err) {
        console.log("userStore: Error in signup", err);
        throw err;
      }
    },
    async logout({ commit }) {
      try {
        await userService.logout();
        commit({ type: "setLoggedinUser", user: null });
      } catch (err) {
        console.log("userStore: Error in logout", err);
        throw err;
      }
    },
    loginGuest({ commit }) {
      const user = userService.getGuestUser();
      console.log("guestUser", user);
      commit({ type: "setLoggedinUser", user });
    },
    async loadUsers({ commit }) {
      try {
        const users = await userService.getUsers();
        commit({ type: "setUsers", users });
      } catch (err) {
        console.log("userStore: Error in loadUsers", err);
        throw err;
      }
    },
    async getUserById({ commit }, { userId }) {
      try {
        const user = await userService.getById(userId);
        return JSON.parse(JSON.stringify(user));
      } catch (err) {
        console.log("userStore: Error in getUserById", err);
        throw err;
      }
    },
    async loadAndWatchUser({ commit }, { userId }) {
      try {
        console.log("store");
        const user = await userService.getById(userId);
        commit({ type: "setWatchedUser", user });
        socketService.off(SOCKET_EVENT_USER_UPDATED);
        socketService.on(SOCKET_EVENT_USER_UPDATED, (user) => {
          commit({ type: "setWatchedUser", user });
        });
      } catch (err) {
        console.log("userStore: Error in loadAndWatchUser", err);
        throw err;
      }
    },
    async removeUser({ commit }, { userId }) {
      try {
        await userService.remove(userId);
        commit({ type: "removeUser", userId });
      } catch (err) {
        console.log("userStore: Error in removeUser", err);
        throw err;
      }
    },
    async updateUser({ commit }, { user }) {
      try {
        user = await userService.update(user);
        commit({ type: "setUser", user });
      } catch (err) {
        console.log("userStore: Error in updateUser", err);
        throw err;
      }
    },
    loadGuestUser({ commit }) {
      const guestUser = userService.getGuestUser();
      commit({ type: "setGuestUser", guestUser });
    },
    async loadUsers({ commit }) {
      try {
        const users = await userService.getUsers();
        commit({ type: "setUsers", users });
      } catch (err) {
        console.log("userStore: Error in loadUsers", err);
        throw err;
      }
    },
  },
};
