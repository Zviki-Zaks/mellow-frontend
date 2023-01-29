<template>
  <backdrop @click="closeCmp">
    <section class="date-preview pointer" @click.stop>
      <div class="date-header">
        <h3 class="date-title">Dates</h3>
        <button class="add-task-close-cmp-btn" @click="closeCmp"></button>
      </div>
      <hr class="thin-hr" />
      <v-date-picker v-model="date.dueDate" mode="dateTime" :minute-increment="5" />
      <button class="save-btn date-btn" @click="saveDate">Save</button>
      <button class="remove-date-btn date-btn" @click="closeCmp">Remove</button>
    </section>
  </backdrop>
</template>

<script>
import "v-calendar/dist/style.css";
import backdrop from "./common/backdrop.vue";

export default {
  name: "date-preview",
  props: {
    dueDate: String,
  },
  components: { backdrop },
  created() {
    this.date.dueDate = this.dueDate;
  },
  data() {
    return {
      date: { dueDate: null, isCompleted: false },
    };
  },
  methods: {
    saveDate() {
      this.$emit("saveDate", this.date);
    },
    closeCmp() {
      this.date.dueDate = this.dueDate;
      this.$emit("closeCmp");
    },
  },
};
</script>
