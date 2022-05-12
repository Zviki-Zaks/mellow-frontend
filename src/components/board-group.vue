<template>
  <section class="groups-border">
    <div class="outside-group flex">
      <p class="group-title pointer" contenteditable="true" @blur="saveTitle">
        {{ group.title }}
      </p>
      <span class="remove-group-btn" @click="toggleRemove"></span>
    </div>
    <delete-cmp
      v-if="isRemove"
      :type="'list'"
      @remove="removeGroup"
      @closeCmp="toggleRemove"
    />
    <div class="group-container" ref="list" :class="calcHeight">
      <Container
        class="tasks-container"
        v-if="group.tasks?.length"
        :group-name="'group'"
        orientation="vertical"
        :get-child-payload="getPayload(group.id)"
        @drop="onDrop"
      >
        <Draggable
          class="draggable-container middle-group-list"
          v-for="task in group.tasks"
          :key="task.id"
        >
          <task-preview
            :task="task"
            :groupId="group.id"
            :isLabelTitle="isLabelTitle"
            @toggleLabelTitle="toggleLabelTitle"
          />
        </Draggable>
      </Container>
      <div v-if="isAdding" class="add-task-container">
        <textarea
          v-focus
          @blur.stop="saveIfTxt"
          v-model="newTaskTitle"
          placeholder="Enter a title for this card..."
        />
        <div class="add-task-buttons-container flex">
          <button class="adding-task-btn btn" ref="bottom" @click="addTask">
            Add card
          </button>
          <button class="delete-task-btn" @click="clearForm"></button>
        </div>
      </div>
    </div>
    <div class="bottom-outside-group">
      <div class="add-task-btn" v-if="!isAdding" @click="openAddTask">
        Add a card
      </div>
    </div>
  </section>
</template>


<script>
import { nextTick } from "vue";
import { boardService } from "../services/board-service";
import taskPreview from "./task-preview.vue";
import { utilService } from "../services/util-service";
import { Container, Draggable } from "vue3-smooth-dnd";
import deleteCmp from "./delete-cmp.vue";

export default {
  props: {
    group: Object,
    isLabelTitle: Boolean,
  },
  components: {
    taskPreview,
    deleteCmp,
    Container,
    Draggable,
  },
  data() {
    return {
      isAdding: false,
      newTaskTitle: "",
      isRemove: false,
    };
  },
  methods: {
    getPayload(groupId) {
      return () => groupId;
    },
    onDrop(ev) {
      if (
        typeof ev.removedIndex !== "number" &&
        typeof ev.addedIndex !== "number"
      )
        return;

      this.$emit("dropped", {
        ev,
        groupToId: this.group.id,
      });
    },
    async saveIfTxt() {
      await utilService.delay(100);
      if (this.newTaskTitle) this.addTask();
      else this.clearForm();
    },
    clearForm() {
      this.isAdding = false;
      this.newTaskTitle = "";
    },
    async openAddTask() {
      this.isAdding = true;
      await nextTick();
      var element = this.$refs.list;
      var top = element.offsetTop;
      element.scrollTo(0, top + element.scrollHeight);
    },
    addTask() {
      if (!this.newTaskTitle) {
        this.isAdding = false;
        return;
      } else {
        const task = boardService.getEmptyTask();
        task.title = this.newTaskTitle;
        this.$emit("saveGroup", {
          groupId: this.group.id,
          changeType: "add task",
          newValue: task,
        });
        this.clearForm();
      }
    },
    saveTitle(ev) {
      const newTitle = ev.currentTarget.textContent;
      if (newTitle === this.group.title) return;
      this.$emit("saveGroup", {
        groupId: this.group.id,
        changeType: "save group title",
        newValue: newTitle,
      });
    },
    toggleLabelTitle() {
      this.$emit("toggleLabelTitle");
    },
    toggleRemove() {
      this.isRemove = !this.isRemove;
    },
    removeGroup() {
      this.$emit("removeGroup", this.group.id);
    },
  },
  computed: {
    calcHeight() {
      return { add: this.isAdding };
    },
  },
};
</script>

<style>
</style>