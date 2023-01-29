<template>
  <section class="board-recent">
    <div class="cmp-header">
      <p class="cmp-container-title">Recent</p>
      <a class="close-cmp-btn" @click="$emit('closeCmp')">
        <span></span>
      </a>
    </div>
    <hr class="thin-hr" />
    <div class="recent-boards-list">
      <div class="recent-board-preview flex" v-for="board in boards" :key="board._id" @click="goToBoard(board._id)">
        <img v-if="board.style.bgImg" class="recent-board-preview-img" :src="board.style.bgImg.urls.thumb" />
        <img v-else class="recent-board-preview-img" src="../assets/imgs/board.jpg" />
        <p class="recent-board-title">{{ board.title }}</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  methods: {
    goToBoard(boardId) {
      this.$emit("closeCmp");
      this.$router.push(`/board/${boardId}`);
    },
  },
  computed: {
    boards() {
      return this.$store.getters.boards;
    },
  },
};
</script>
