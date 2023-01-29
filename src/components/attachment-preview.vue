<template>
    <section class="attachment-preview cmp-preview">
        <div class="cmp-header">
            <a class="close-cmp-btn" @click="closeCmp">
                <span></span>
            </a>
        </div>
        <label>
            <input type="file" @change="onAttachImg" hidden />
            <p class="attach-from">Attach from...</p>
            <hr class="thin-hr" />
            <div class="pointer">Computer</div>
        </label>
        <hr class="thin-hr" />
        <div class="attach-link-title">Attach a link</div>
        <input v-focus v-model="input" class="attach-input" type="text" placeholder="Paste any link here..." />
        <button class="attach-link-btn" @click="showLink">Attach</button>
        <div class="attach-preview">
        </div>
    </section>
</template>

<script>
export default {
    props: {
        imgUrls: Array
    },
    data() {
        return {
            isLoading: false,
            input: null,
        }
    },
    created() { },
    methods: {
        onAttachImg(ev) {
            this.isLoading = true
            this.$emit('attachImg', ev)
            this.isLoading = false
        },
        showLink() {
        },
        closeCmp() {
            this.$emit("closeCmp");
        }
    },
    computed: {},
    unmounted() { },

}
</script>

<style>

</style>