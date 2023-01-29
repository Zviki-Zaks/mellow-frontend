<template>
  <backdrop @click="$emit('closeCmp')">
    <section v-if="users" class="invite-user" @click.stop>
      <div class="invite-user-header">
        <p class="invite-user-title">Invite to board</p>
        <a class="close-cmp-btn" @click="$emit('closeCmp')">
          <span></span>
        </a>
      </div>
      <hr class="thin-hr" />
      <div class="invite-content">
        <div class="select-container">
          <el-select v-model="selected" multiple placeholder="Select user" style="width: 100%">
            <el-option v-for="user in users" :key="user._id" :label="user.fullname" :value="user._id" />
          </el-select>
          <button class="add-members-btn" @click="addMemberToBoard">
            Invite
          </button>
        </div>
        <div class="members-container">
          <h4 class="members-preview-title">Board members</h4>
          <ul class="board-members-container">
            <li class="board-member" v-for="member in members" :key="member._id">
              <user-avatar :user="member" />
              <div class="member-fullname">
                {{ member.fullname }}{{ `(${member.username})` }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </backdrop>
</template>

<script>
import userAvatar from "./user-avatar.vue";
import backdrop from "./common/backdrop.vue"

export default {
  name: "invite-user",
  props: {
    members: Array,
  },
  components: {
    userAvatar,
    backdrop
  },
  data() {
    return {
      users: null,
      selected: [],
    };
  },
  async created() {
    await this.$store.dispatch({ type: "loadUsers" });
    this.users = this.$store.getters.users;
  },
  methods: {
    addMemberToBoard() {
      if (!this.selected.length) return;
      const members = this.users.filter((user) => {
        if (this.selected.includes(user._id)) return user;
      });
      this.$emit("addMemberToBoard", "add members", members);
    },
  },
};
</script>
