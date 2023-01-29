<template>
  <main class="workspace-page-container">
    <section class="all-boards-container">
      <section>
        <h1>Favorite boards</h1>
        <ul class="favorite-boards flex">
          <li v-for="board in favoriteBoards" :key="board._id" @click="toBoardDetails(board._id)"
            class="board-preview img-pos style-font" :style="{
              backgroundImage: `url(${board.style?.bgImg?.urls?.thumb || ''})`,
              backgroundColor: board.style?.bgClr || '',
            }">
            <h2 class="favorite-board-title">{{ board.title }}</h2>
            <a class="star-container" @click.stop="toggleFavorite(board._id)">
              <img class="ws-full-star" v-if="board.isFavorite" src="../assets/icons/full-star.png" />
              <img class="ws-empty-star" v-else src="../assets/icons/empty-star.png" />
            </a>
          </li>
        </ul>
      </section>

      <h3 class="all-boards-title">All boards</h3>
      <article class="saved-boards">
        <div v-for="board in boards" :key="board._id" @click="toBoardDetails(board._id)"
          class="board-preview img-pos style-font" :style="{
            backgroundImage: `url(${board.style?.bgImg?.urls?.thumb || ''})`,
            backgroundColor: board.style?.bgClr || '',
          }">
          <h2 class="title">{{ board.title }}</h2>

          <a class="star-container" @click.stop="toggleFavorite(board._id)">
            <img class="ws-full-star" v-if="board.isFavorite" src="../assets/icons/full-star.png" />
            <img class="ws-empty-star" v-else src="../assets/icons/empty-star.png" />
          </a>
          <!-- <button class="remove-board-button" @click.stop="removeBoard(board._id)">remove</button> -->
        </div>
        <button @click="isCreateBoard = true" class="board-preview justify-center add-card">
          Create new board
        </button>
        <create-board v-if="isCreateBoard" @closeCmp="isCreateBoard = false" />
      </article>
    </section>
  </main>
</template>

<script>
import createBoard from "../components/common/create-board.vue";

export default {
  name: "work-space",
  data() {
    return {
      isFavorite: false,
      isCreateBoard: false,
    };
  },
  methods: {
    toBoardDetails(boardId) {
      this.$router.push(`/board/${boardId}`);
    },
    async toggleFavorite(boardId) {
      this.$store.dispatch({
        type: "editBoard",
        boardId,
        changeType: "toggle favorite",
      });
    },
    async removeBoard(boardId) {
      this.$store.dispatch({ type: "removeBoard", boardId });
    },
  },
  computed: {
    boards() {
      return this.$store.getters.boards;
    },
    favoriteBoards() {
      return this.$store.getters.favoriteBoards;
    },
    cardBackground() {
      if (this.board.style.bgImg)
        return { backgroundImage: `url(${board.style?.bgImg})` };
      else if (this.board.style.bgClr)
        return { backgroundColor: `(${this.board.style.bgClr})` };
      else return "";
    },
  },
  components: {
    createBoard,
  },
};
</script>
