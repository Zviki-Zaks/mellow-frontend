<template>
  <div v-if="msg" class="user-msg" :class="msg.type">
    <div class="texts">
      <h2>{{ msg.type }}</h2>
      <p>{{ msg.txt }}</p>
      <router-link v-if="msg.link" :to="msg.link" class="learn-more">Learn More about this website</router-link>
    </div>
  </div>
</template>

<script>
import { eventBus } from '@/services/event-bus-service.js';
export default {
  data() {
    return {
      msg: null,
      removeEventListener: null,
    };
  },
  created() {
    this.unsubscribe = eventBus.on('show-msg', this.showMsg);
  },
  methods: {
    showMsg(msg) {
      this.msg = msg;
      setTimeout(() => {
        this.msg = null;
      }, 3000);
    },
  },
  unmounted() {
    this.unsubscribe();
  },
};
</script>
<style >
.user-msg {
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: rgb(122, 209, 122);
  padding: 10px 20px;
}

.success {
  background-color: lightgreen;
}

.error {
  background-color: red;
  color: white;
}
</style>
