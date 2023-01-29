<template>
  <div @click="toTaskDetails(this.boardId, this.groupId, this.task.id)" class="task-preview-container">
    <div v-if="this.task.style.isFullCover" :style="fullCoverStyle" class="full-cover-selected">
      <p :class="fullCoverTxt" class="full-cover-title">{{ task.title }}</p>
    </div>

    <div v-else class="top-cover-selected">
      <div :style="coverStyle" class="task-preview-cover"></div>

      <img v-if="taskImgUrl && !task.style.bgClr" class="top-cover-img" :src="taskImgUrl" alt draggable="false" />
      <div class="task-preview-icons">
        <div class="labels-container" v-if="task.labelIds?.length" @click.stop="showLabelTitle">
          <div v-for="label in labelsToDisplay" :key="label.id" class="task-preview-label" :class="openLabel"
            :style="{ backgroundColor: label.color }" @click.stop="toggleLabelTitle">
            <span v-if="isLabelTitle" :class="openLabel">{{ label.title }}</span>
          </div>
        </div>
        <div class="task-content">{{ task.title }}</div>
        <div class="task-snapshot flex">
          <div class="description-img-preview" v-if="task.description?.length" title="Card description"></div>
          <div class="checklists-img-preview" :class="{ 'todo-done': isChecklistDone }" v-if="task.checklists?.length"
            title="Checklist items">
            <span class="checklist-img-font flex" :class="{ 'white': isChecklistDone }"></span>
            <span class></span>
            {{ checkListsCount }}
          </div>
          <div class="attachment-img-preview" v-if="task.attachments?.length" title="Attachment">{{ attachmentCount }}
          </div>
          <div class="date-img-preview" v-if="task.dueDate?.dueDate" :class="isTaskOverdue">{{ formattedDate }}</div>
          <div class="user-avatar-pos flex">
            <user-avatar class="user-avatar" :v-if="task.members?.length" v-for="member in task.members"
              :key="member._id" :user="member" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userAvatar from "./user-avatar.vue";
import taskDetails from "../views/task-details.vue";
import { utilService } from "../services/util-service";

export default {
  props: {
    task: Object,
    groupId: String,
    isLabelTitle: Boolean,
  },
  data() {
    return {
      boardId: null,
    };
  },
  components: {
    userAvatar,
    taskDetails,
  },
  methods: {
    toTaskDetails(boardId, groupId, taskId) {
      this.$router.push(`/board/${boardId}/${groupId}/${taskId}`);
    },
    toggleLabelTitle() {
      this.$emit("toggleLabelTitle");
    },
  },
  created() {
    const { boardId } = this.$route.params;
    this.boardId = boardId;
  },
  computed: {
    formattedDate() {
      var d = new Date(this.task.dueDate.dueDate);
      return d.toString().slice(4, 10);
    },
    isTaskOverdue() {
      const date = new Date(this.task.dueDate.dueDate);
      const ms = date.getTime();
      if (ms < Date.now()) {
        return this.task.dueDate.isCompleted ? "l101-label" : "l104-label";
      } else return;
    },
    isChecklistDone() {
      let totalTodosCount = 0
      let totalIsDoneCount = 0

      this.task.checklists?.forEach(checklist => {
        totalTodosCount += checklist.todos.length
        checklist.todos.filter(todo => {
          if (todo.isDone) totalIsDoneCount++
        })
      })
      return totalTodosCount === totalIsDoneCount ? true : false
    },
    labelsToDisplay() {
      const labels = this.$store.getters.getCurrBoard.labels.filter((label) => {
        if (this.task.labelIds.includes(label.id)) return label;
      });
      return labels;
    },
    attachmentCount() {
      return this.task.attachments?.length;
    },
    checkListsCount() {
      var totalTodosCount = 0;
      this.task.checklists?.forEach(
        (checkList) => (totalTodosCount += checkList.todos.length)
      );

      var totalDoneTodosCount = 0;
      this.task.checklists?.forEach((checkList) => {
        const doneTodos = checkList.todos.filter((todo) => todo.isDone);
        totalDoneTodosCount += doneTodos.length;
      });

      return `${totalDoneTodosCount}/${totalTodosCount}`;
    },
    openLabel() {
      return { open: this.isLabelTitle };
    },
    taskImgUrl() {
      if (this.task.style.uploadedImg) return this.task.style.uploadedImg;
      else if (this.task.style.bgImg) return this.task.style.bgImg;
      else return;
    },
    fullCoverStyle() {
      if (this.task.style.uploadedImg)
        return {
          backgroundImage: `url(${this.task.style.uploadedImg})`,
          height: "220px",
          backgroundColor: "#ccd6e0", // later make this dynamic with library?
        };
      else if (this.task.style.bgImg)
        return {
          backgroundImage: `url(${this.task.style.bgImg})`,
          height: "220px",
          backgroundColor: "#ccd6e0", // later make this dynamic with library?
        };
      else
        return {
          "background-color": this.task.style?.bgClr || "#FFFFFF",
          height: "54px",
        };
    },
    fullCoverTxt() {
      if (this.task.style.uploadedImg || this.task.style.bgImg) return "is-img";
      else {
        const isDark = utilService.isDarkColor(this.task.style.bgClr);
        if (isDark) return "is-dark-bg";
        else return "is-light-bg";
      }
    },
    coverStyle() {
      if (this.task.style.bgClr)
        return {
          "background-color": this.task.style.bgClr,
          height: "32px",
        };
      else return { display: "none" };
    },
  },
};
</script>
