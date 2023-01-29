<template>
  <section class="board-filter">
    <div class="cmp-header">
      <p class="cmp-container-title">Filter</p>
      <a class="close-cmp-btn" @click="$emit('closeCmp')">
        <span></span>
      </a>
    </div>
    <hr class="thin-hr" />
    <label class="filter-search-container">
      <p class="filter-section-title">Keyword</p>
      <input type="text" class="search-input" placeholder="Enter a keyword..." v-focus v-modal="filterBy.txt"
        @input="setFilter" />
      <p class="search-description">Search cards, members, labels, and more.</p>
    </label>
    <div class="filter-member-container">
      <p class="filter-section-title">Members</p>

      <label class="filter-no-member flex">
        <img class="checkbox-icon" :src="checkBox" />
        <div class="filter-no-user-avatar flex"></div>
        <p class="filter-user-name">No members</p>
        <input type="checkbox" :value="'no'" hidden />
      </label>
      <div class="filter-members-list">
        <label v-for="member in board.members" :key="member._id" class="filter-member flex">
          <img class="checkbox-icon" :src="checkBox" />
          <user-avatar :user="member" />
          <p class="filter-user-name">{{ member.fullname }}</p>
          <input type="checkbox" :value="member._id" hidden />
        </label>
      </div>
    </div>
  </section>
</template>

<script>
import userAvatar from "./user-avatar.vue";

export default {
  props: {
    board: Object,
  },
  data() {
    return {
      filterBy: {
        txt: "",
      },
    };
  },
  methods: {
    setFilter() {
      this.$emit("setFilter", this.filterBy);
    },
  },
  computed: {
    checkBox() {
      //   return this.task.dueDate.isCompleted
      // ? "../assets/svgs/full-checkbox.svg"
      // : "../assets/svgs/empty-checkbox.svg";
      return "../../src/assets/svgs/empty-checkbox.svg";
    },
  },
  components: { userAvatar },
};
</script>
