<template>
  <section v-if="board" class="board-container" :style="background">
    <router-view @updateBoard="loadBoard(board._id)"></router-view>

    <header class="board-header flex">
      <div class="board-title-container flex">
        <button class="btn-board-details btn-board">Board</button>
        <div class="board-title" contenteditable="true" @blur="editBoard('board title', $event)">
          {{ board.title }}
        </div>
        <button class="star-btn btn-board btn" @click.stop="editBoard('toggle favorite')">
          <img class="star" v-if="board.isFavorite" src="../assets/icons/full-star.png" alt />
          <img class="star" v-else src="../assets/icons/empty-star.png" />
        </button>
      </div>
      <div class="members-nav-bar flex">
        <div class="board-members-container flex">
          <user-avatar :v-if="board.members" v-for="member in board.members" :key="member._id" :user="member" />
        </div>
        <button class="invite-btn btn-board btn" @click="isOpenInvite = !isOpenInvite">
          Invite
        </button>
        <invite-user v-if="isOpenInvite" :members="board.members" @closeCmp="isOpenInvite = !isOpenInvite"
          @addMemberToBoard="editBoard" />
      </div>
      <nav class="board-header-nav flex">
        <!-- <button class="filter-btn btn-board btn" @click="toggleFilter">
          Filter
        </button>
        <board-filter v-if="isOpenFilter" :board="board" @closeCmp="toggleFilter" @setFilter="setFilter" /> -->
        <button class="show-menu-btn btn-board btn" @click="toggleMenu">
          Show menu
        </button>
        <board-menu v-if="isOpenMenu" :board="board" @closeCmp="toggleMenu" @editBoard="editBoard"
          @attachImg="attachImg" />
      </nav>
    </header>
    <div class="groups-layout">
      <article class="groups-container flex">
        <Container @drop="onDrop" orientation="horizontal">
          <Draggable class="draggable-container flex" v-for="group in board.groups" :key="group.id">
            <board-group :group="group" :isLabelTitle="isLabelTitle" @dropped="dropCard" @saveGroup="saveGroup"
              @toggleLabelTitle="toggleLabelTitle" @removeGroup="removeGroup" />
          </Draggable>
        </Container>
        <div class="add-group" @click="addGroup">
          <span></span> Add another list
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import { boardService } from "../services/board-service";
import { eventBus } from "../services/event-bus-service";
import { socketService } from "../services/socket.service";

import boardGroup from "../components/board-group.vue";
import userAvatar from "../components/user-avatar.vue";
import { Container, Draggable } from "vue3-smooth-dnd";
import boardFilter from "../components/board-filter.vue";
import boardMenu from "../components/board-menu.vue";
import inviteUser from "../components/invite-user.vue";

export default {
  name: "board-details",
  data() {
    return {
      board: null,
      dndInfo: {},
      isLabelTitle: false,
      isOpenFilter: false,
      isOpenMenu: false,
      isOpenInvite: false,
    };
  },
  components: {
    boardGroup,
    userAvatar,
    Container,
    Draggable,
    boardFilter,
    boardMenu,
    inviteUser,
  },
  async created() {
    this.unsubscribe = eventBus.on("show-msg", this.showMsg);
    const { boardId } = this.$route.params;
    this.topic = boardId;
    socketService.emit("board topic", this.topic);
    socketService.on("someone updated", this.boardUpdated);
  },
  unmounted() {
    socketService.off("someone updated", this.boardUpdated);
  },
  methods: {
    onDrop(ev) {
      const group = this.board.groups.splice(ev.removedIndex, 1)[0];
      this.board.groups.splice(ev.addedIndex, 0, group);
      this.saveDnd();
    },
    dropCard({ ev, groupToId }) {
      this.dndInfo.groupFromId = ev.payload; // groupFrom is always correct, update immediately

      if (ev.payload !== groupToId) this.dndInfo.groupToId = groupToId; // won't update toId on subsequent passes through the function

      if (ev.removedIndex || typeof ev.removedIndex === "number")
        this.dndInfo.removedIndex = ev.removedIndex;

      if (ev.addedIndex || typeof ev.addedIndex === "number")
        this.dndInfo.addedIndex = ev.addedIndex;

      if (
        (this.dndInfo.addedIndex ||
          typeof this.dndInfo.addedIndex === "number") &&
        (this.dndInfo.removedIndex ||
          typeof this.dndInfo.removedIndex === "number")
      )
        this.moveTask();
    },
    moveTask() {
      const fromGroup = this.board.groups.find(
        (g) => g.id === this.dndInfo.groupFromId
      );
      const toGroup = !this.dndInfo.groupToId
        ? fromGroup
        : this.board.groups.find((g) => g.id === this.dndInfo.groupToId); // if moving within same group, make to group same as from group
      const cardToMove = fromGroup.tasks.splice(
        this.dndInfo.removedIndex,
        1
      )[0];
      toGroup.tasks.splice(this.dndInfo.addedIndex, 0, cardToMove);
      this.saveDnd();
      this.dndInfo = {};
    },
    async loadBoard(boardId) {
      this.board = await this.$store.dispatch({ type: "loadBoard", boardId });
    },
    async saveDnd() {
      this.board = await this.$store.dispatch({
        type: "saveBoard",
        board: JSON.parse(JSON.stringify(this.board)),
      });
    },
    async editBoard(changeType, val) {
      try {
        this.board = await this.$store.dispatch({
          type: "editBoard",
          boardId: this.board._id,
          changeType,
          val,
        });
      } catch (err) { }
    },
    async attachImg(ev) {
      const { url } = await this.$store.dispatch({ type: "attachImg", ev });
      await this.editBoard("bgImg", url);
      return url;
    },
    async addGroup() {
      const newGroup = boardService.getEmptyGroup();
      this.board = await this.$store.dispatch({
        type: "saveGroup",
        boardId: this.board._id,
        group: newGroup,
        changeType: "Added a new group",
      });
    },
    async saveGroup({ groupId, changeType, newValue }) {
      const updatingGroup = JSON.parse(
        JSON.stringify(this.board.groups.find((group) => group.id === groupId))
      );
      switch (changeType) {
        case "save group title":
          updatingGroup.title = newValue;
          break;
        case "add task":
          updatingGroup.tasks.push(newValue);
          break;
      }
      this.board = await this.$store.dispatch({
        type: "saveGroup",
        boardId: this.board._id,
        group: updatingGroup,
        changeType,
      });
    },
    async removeGroup(groupId) {
      this.board = await this.$store.dispatch({
        type: "removeGroup",
        boardId: this.board._id,
        groupId,
      });
    },
    toggleLabelTitle() {
      this.isLabelTitle = !this.isLabelTitle;
    },
    toggleFilter() {
      this.isOpenFilter = !this.isOpenFilter;
    },
    setFilter(filterBy) {
      this.$store.commit({ type: "setFilter", filterBy });
    },
    boardUpdated() {
      this.loadBoard(this.board._id);
    },
    toggleMenu() {
      this.isOpenMenu = !this.isOpenMenu;
    },
    moveToDashboard(boardId) {
      this.$router.push(`/${boardId}/dashboard`);
    },
  },
  computed: {
    isStarred() {
      return this.board.isFavorite ? "filled" : "stroke";
    },
    background() {
      const backGroundImg = this.board.style?.bgImg?.urls?.regular || "";
      const backgroundColor = this.board.style?.bgClr || "";
      return { backgroundImage: `url(${backGroundImg})`, backgroundColor };
    },
    updatedBoardFromStore() {
      return this.$store.getters.boards;
    },
  },
  watch: {
    "$route.params.boardId": {
      immediate: true,
      handler() {
        const { boardId } = this.$route.params;
        if (!boardId) return;
        this.loadBoard(boardId);
      },
    },
  },
  unmounted() {
    this.unsubscribe();
  },
};
</script>
