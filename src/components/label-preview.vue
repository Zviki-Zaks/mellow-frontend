<template>
  <backdrop @click="closeCmp">
    <section class="cmp-preview" v-if="!isRemove" @click.stop>
      <div class="cmp-header">
        <a class="back-to-cmp-btn" v-if="isCreate || isChange || isRemove"
          @click="(isCreate = false), (isChange = false)">
          <span></span>
        </a>
        <p class="cmp-container-title">{{ cmpTitle }}</p>
        <a class="close-cmp-btn" @click="closeCmp">
          <span></span>
        </a>
      </div>
      <hr class="thin-hr" />
      <section v-if="!isCreate && !isChange && !isRemove" class="select-label-container">
        <input class="label-input" type="text" v-model="filterTxt" v-focus placeholder="Search labels.." />
        <div class="choose-labels-container">
          <p class="labels-title">Labels</p>
          <ul class="labels-list flex clean-list">
            <li class="label-option-container flex" v-for="label in getLabels" :key="label.id">
              <div class="label-option flex pointer" :style="{ backgroundColor: label.color }"
                @click="toggleLabel(label.id)">
                <span class="label-title">{{ label.title }}</span>
                <span v-if="label.inTask" class="v-icon"></span>
              </div>
              <span class="change-label-btn" @click="openCreate(label.id)">
                <a></a>
              </span>
            </li>
          </ul>
        </div>
        <button class="open-create-label-btn" @click="openCreate">
          Create a new label
        </button>
      </section>
      <section v-else class="create-label-container">
        <label>
          <p class="labels-title">Name</p>
          <input type="text" class="label-input" v-model="labelToChange.title" v-focus />
        </label>

        <list-slot>
          <template v-slot:title>Select a color</template>
          <template v-slot:list>
            <div v-for="label in defaultLabels" :key="label.id" class="label-option flex pointer"
              :style="{ backgroundColor: label.color }" @click="selectLabel(label.id)">
              <span v-if="label.isSelected" class="v-icon"></span>
            </div>
          </template>
        </list-slot>
        <div class="create-label-buttons-container flex">
          <button class="create-label-btn" @click.stop="changeBoardLabels">
            {{ createBtn }}
          </button>
          <button v-if="isChange" class="delete-label-btn" @click.stop="isRemove = true">
            Delete
          </button>
        </div>
      </section>
    </section>
    <delete-cmp v-else :type="'label'" @remove="removeLabelFromBoard" @closeCmp="closeCmp" @click.stop />
  </backdrop>
</template>

<script>
import { utilService } from "@/services/util-service";
import listSlot from "./list-slot.vue";
import deleteCmp from "./delete-cmp.vue";
import backdrop from "./common/backdrop.vue";

export default {
  props: {
    boardLabels: Array,
    taskLabelIds: Array,
  },
  emits: ["addLabelToTask", "addLabelToBoard", "updateBoardLabels"],
  components: { listSlot, deleteCmp, backdrop },
  data() {
    return {
      labels: [],
      filterTxt: "",
      defaultLabels: [
        { id: "l101", color: "#61bd4f", title: "", isSelected: false },
        { id: "l102", color: "#f2d600", title: "", isSelected: false },
        { id: "l103", color: "#ff9f1a", title: "", isSelected: false },
        { id: "l104", color: "#eb5a46", title: "", isSelected: false },
        { id: "l105", color: "#c377e0", title: "", isSelected: false },
        { id: "l106", color: "#0079bf", title: "", isSelected: false },
        { id: "l107", color: "#00c2e0", title: "", isSelected: false },
        { id: "l108", color: "#51e898", title: "", isSelected: false },
        { id: "l109", color: "#ff78cb", title: "", isSelected: false },
        { id: "l110", color: "#344563", title: "", isSelected: false },
      ],
      isCreate: false,
      isChange: false,
      isRemove: false,
      selectedLabel: null,
      labelToChange: { color: null, title: "" },
    };
  },
  created() {
    this.aggregateLabels();
  },
  methods: {
    toggleLabel(labelId) {
      this.$emit("addLabelToTask", labelId);
    },
    closeCmp() {
      this.$emit("closeCmp");
    },
    aggregateLabels() {
      this.labels = [];
      this.labels = this.boardLabels.map((label) => {
        label = JSON.parse(JSON.stringify(label));
        if (this.taskLabelIds?.includes(label.id)) {
          label.inTask = true;
        }
        return label;
      });
    },
    openCreate(labelId) {
      if (typeof labelId === "string") {
        this.labelToChange = JSON.parse(
          JSON.stringify(this.boardLabels.find((label) => label.id === labelId))
        );
        const defaultLabel = this.defaultLabels.find(
          (label) => label.color === this.labelToChange.color
        );
        this.selectLabel(defaultLabel.id);
        this.isChange = true;
        return;
      }
      this.isCreate = true;
    },
    selectLabel(labelId) {
      this.defaultLabels.forEach((label) => {
        label.isSelected = label.id === labelId ? true : false;
      });
      const defaultLabel = this.defaultLabels.find(
        (label) => label.id === labelId
      );
      this.labelToChange.color = defaultLabel.color;
    },
    async changeBoardLabels() {
      const newLabel = JSON.parse(JSON.stringify(this.labelToChange));

      if (this.isCreate) {
        newLabel.id = "l" + utilService.makeId();
      }
      await this.$emit("updateBoardLabels", newLabel);
      this.aggregateLabels();
      this.isCreate = false;
      this.isChange = false;
    },
    async removeLabelFromBoard() {
      const labelId = this.labelToChange.id;
      await this.$emit("updateBoardLabels", labelId);
      this.aggregateLabels();
      this.isCreate = false;
      this.isChange = false;
      this.isRemove = false;
    },
  },
  computed: {
    getLabels() {
      const regex = new RegExp(this.filterTxt, "i");
      return this.labels.filter((label) => regex.test(label.title));
    },
    cmpTitle() {
      if (this.isChange) return "Change label";
      else if (this.isCreate) return "Create label";
      else return "Labels";
    },
    createBtn() {
      if (this.isCreate) return "Create";
      else if (this.isChange) return "Save";
    },
  },
  watch: {
    taskLabelIds() {
      this.aggregateLabels();
    },
    boardLabels() {
      this.aggregateLabels();
    },
  },
};
</script>
