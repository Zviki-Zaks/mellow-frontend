<template>
  <section class="create-checklist-container">
    <div class="checklist-header flex">
      <span class="cmp-header-title">Add checklist</span>
      <a @click="closeCmp" class="close-checklist pointer"></a>
    </div>
    <hr class="thin-hr" />
    <div class="create-checklist-form">
      <div>
        <label class="form-title" for="txt">Title</label>
        <form @submit.prevent="addChecklist(title)">
          <input class="checklist-form" v-model="title" type="text" name="txt" id="txt" v-focus />
          <button class="create-form-done pointer">Add</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      title: 'Checklist',
    }
  },
  methods: {
    closeCmp() {
      this.$emit('closeCmp')
    },
    addChecklist() {
      this.$emit('createChecklist', this.title)
    }
  },
}
</script>
