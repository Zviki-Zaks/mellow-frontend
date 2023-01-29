<template>
  <section class="create-board">
    <div class="cmp-header">
      <p class="cmp-container-title">Create board</p>
      <a class="close-cmp-btn" @click="$emit('closeCmp')">
        <span></span>
      </a>
    </div>
    <hr class="thin-hr" />
    <div class="choose-bg-container">
      <p class="choose-bg-title">Background</p>
      <div class="bg-preview" :style="{
        backgroundColor: selectedBg,
        backgroundImage: 'url(' + selectedBg + ')',
      }">
        <img class="bg-preview-img" src="../assets/svgs/groups.svg" />
      </div>
      <list-slot>
        <template v-slot:list>
          <img v-for="(photo, idx) in photos" :key="idx" class="unsplash-result-small" :src="photo" alt="img"
            @click="selectBg('bgImg', photo)" />
        </template>
      </list-slot>
      <list-slot>
        <template v-slot:list>
          <div v-for="bgc in bgColors" :key="bgc.id" class="label-option flex pointer"
            :style="{ backgroundColor: bgc.color }" @click="selectBg('bgClr', bgc.color)"></div>
        </template></list-slot>
    </div>
    <div class="add-title-container">
      <p class="add-title-title">Board title</p>
      <input class="add-title-input" :class="required" type="text" v-model="title" v-focus placeholder="Enter title.."
        @blur="requiredTitle" @focus="isRequired = false" />
      <p v-if="isRequired" class="add-title-required">
        👋 Board title is required
      </p>
    </div>
    <button class="create-board-btn" @click="addBoard" :disabled="!title">
      Create
    </button>
  </section>
</template>

<script>
import listSlot from "../components/list-slot.vue";

export default {
  data() {
    return {
      title: "",
      bgClr: "",
      bgImg: "",
      selectedBg: "",
      photos: [
        "https://images.unsplash.com/photo-1648138754706-4fccd621a5f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw3MDY2fDB8MXxjb2xsZWN0aW9ufDR8MzE3MDk5fHx8fHwyfHwxNjQ4NjUyNTQ3&ixlib=rb-1.2.1&q=80&w=400",
        "https://images.unsplash.com/photo-1648537949908-25fc530b5f7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw3MDY2fDB8MXxjb2xsZWN0aW9ufDF8MzE3MDk5fHx8fHwyfHwxNjQ4NjUyNTQ3&ixlib=rb-1.2.1&q=80&w=400",
        "https://images.unsplash.com/photo-1647960666864-01fdaed3431f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw3MDY2fDB8MXxjb2xsZWN0aW9ufDE0fDMxNzA5OXx8fHx8Mnx8MTY0ODY1MjU0Nw&ixlib=rb-1.2.1&q=80&w=400",
      ],
      isRequired: false,
      bgColors: [
        { id: "l101", color: "#61bd4f", isSelected: false },
        { id: "l102", color: "#f2d600", isSelected: false },
        { id: "l103", color: "#ff9f1a", isSelected: false },
        { id: "l104", color: "#eb5a46", isSelected: false },
        { id: "l105", color: "#c377e0", isSelected: false },
        { id: "l106", color: "#0079bf", isSelected: false },
        { id: "l107", color: "#00c2e0", isSelected: false },
        { id: "l108", color: "#51e898", isSelected: false },
        { id: "l109", color: "#ff78cb", isSelected: false },
        { id: "l110", color: "#344563", isSelected: false },
      ],
    };
  },
  methods: {
    requiredTitle() {
      if (!this.title) this.isRequired = true;
    },
    async addBoard() {
      const boardId = await this.$store.dispatch({
        type: "addBoard",
        title: this.title,
        bgClr: this.bgClr,
        bgImg: this.bgImg,
      });
      this.$router.push(`/board/${boardId}`);
      this.$emit("closeCmp");
    },
    selectBg(type, val) {
      this[type] = val;
      this.selectedBg = val;
    },
  },
  computed: {
    required() {
      return {
        required: this.isRequired,
      };
    },
  },
  components: {
    listSlot,
  },
};
</script>
