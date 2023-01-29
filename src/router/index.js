import { createRouter, createWebHashHistory } from "vue-router";
import homePage from "../views/home-page.vue";
import aboutPage from "../views/about-page.vue";
import boardDetails from "../views/board-details.vue";
import workSpace from "../views/work-space.vue";
import taskDetails from "../views/task-details.vue";
import loginPage from "../views/login-page.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: homePage,
    },
    {
      path: "/login",
      name: "login",
      component: loginPage,
    },
    {
      path: "/board",
      name: "work-space",
      component: workSpace,
    },
    {
      path: "/board/:boardId",
      name: "board-details",
      component: boardDetails,
      children: [
        {
          path: ":groupId/:taskId",
          name: "task-details",
          component: taskDetails,
        },
      ],
    },
    {
      path: "/about",
      name: "about",
      component: aboutPage,
    },
  ],
});

export default router;
