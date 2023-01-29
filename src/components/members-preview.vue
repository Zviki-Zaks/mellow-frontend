<template>
  <backdrop @click="closeCmp">
    <section class="members-preview cmp-preview" @click.stop>
      <div class="cmp-header">
        <p class="cmp-container-title">Members</p>
        <a class="close-cmp-btn" @click="closeCmp">
          <span></span>
        </a>
      </div>
      <hr class="thin-hr" />
      <div class="members-container">
        <div class="input-container">
          <input v-focus v-model="filterTxt" class="members-filter" type="text" placeholder="Search Members" />
        </div>
        <h4 class="members-preview-title">Board members</h4>
        <ul class="board-members-container">
          <li class="board-member pointer" v-for="(member, index) in getMembers" :key="index"
            @click="toggleMemberInTask(member)">
            <user-avatar :user="member" />
            <div class="member-fullname">
              {{ member.fullname }}{{ `(${member.username})` }}
            </div>
            <div v-if="member.isCheck" class="member-check"></div>
          </li>
          <div></div>
        </ul>
      </div>
    </section>
  </backdrop>
</template>

<script>
import userAvatar from "./user-avatar.vue";
import backdrop from "./common/backdrop.vue";

export default {
  props: {
    boardMembers: Object,
    task: Object,
  },
  components: {
    userAvatar,
    backdrop
  },
  data() {
    return {
      members: [],
      filterTxt: "",
    };
  },
  created() {
    this.aggregateMembers();
  },
  methods: {
    closeCmp() {
      this.$emit("closeCmp");
    },
    toggleMemberInTask(member) {
      this.$emit("toggleMemberInTask", member);
    },
    aggregateMembers() {
      this.members = [];
      let taskMembersIds = this.task.members?.map((m) => m._id);
      this.boardMembers.forEach((member) => {
        if (taskMembersIds?.includes(member._id)) {
          member.isCheck = true;
        }
        this.members.push(JSON.parse(JSON.stringify(member)));
      });
    },
  },
  computed: {
    getMembers() {
      const regex = new RegExp(this.filterTxt, "i");
      return this.members.filter((member) => regex.test(member.fullname));
    },
  },
  watch: {
    task: {
      handler() {
        this.aggregateMembers();
      },
      deep: true,
    },
  },
};
</script>
