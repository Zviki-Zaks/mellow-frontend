<template>
  <backdrop @click="closeCmp">
    <section class="delete-preview" @click.stop>
      <div class="delete-header flex">
        <span class="cmp-header-title">Delete {{ type }}?</span>
        <a @click="closeCmp" class="close-delete pointer"></a>
      </div>
      <hr class="thin-hr" />
      <div class="delete-content-container">
        <p v-if="type === 'task' || type === 'list'">
          All actions will be removed from the activity feed and you won’t be able
          to re-open the card. There is no undo.
        </p>
        <p v-else-if="type === 'label'">
          There is no undo. This will remove this label from all cards and destroy
          its history.
        </p>
        <p v-else-if="type === 'checklist'">Deleting a checklist is permanent and there is no way to get it back.</p>
        <a @click="remove" class="confirm-delete">Delete</a>
      </div>
    </section>
  </backdrop>
</template>

<script>
import backdrop from "./common/backdrop.vue";
export default {
  components: { backdrop },
  props: {
    type: String,
  },
  methods: {
    closeCmp() {
      this.$emit("closeCmp");
    },
    remove() {
      this.$emit("remove");
    },
  },
};
</script>
