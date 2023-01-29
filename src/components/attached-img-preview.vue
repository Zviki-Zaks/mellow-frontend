<template>
  <section class="attached-img-preview">
    <img :src="attachment" alt />
    <div class="attachment-options-container flex">
      <div class="make-cover-icon"></div>
      <p class="make-cover pointer" @click="makeCover">Make Cover</p>
      <p class="pointer" @click="deleteAttachment">Delete</p>
    </div>
  </section>
</template>

<script>
export default {
  name: "attached-img-preview",
  props: {
    attachment: String,
    idx: Number
  },
  methods: {
    deleteAttachment() {
      this.$emit('deleteAttachment', this.idx)
    },
    makeCover() {
      this.$emit('makeCover', this.attachment)
    }
  }
};
</script>
