import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { focusDirective } from "./directives";
import VCalendar from "v-calendar";
import Unsplash from "vue-unsplash";
import Vue3TouchEvents from "vue3-touch-events";

import "./styles/scss/main.scss";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

const app = createApp(App);

app.directive("focus", focusDirective);
app.use(Vue3TouchEvents);
app.use(VCalendar, {});
app.use(Unsplash, {
  accessKey: "Y2X6Y_wdMpqvaYX_4jgO-dOBqVAsQMQpihsIFNOAX5E",
  secret: "W5FeRrlFbgAz3i3d54dHnDm9okVhUeUIXZ6TyvZC_H4",
});
app.use(ElementPlus);
app.use(router);
app.use(store);

app.mount("#app");
