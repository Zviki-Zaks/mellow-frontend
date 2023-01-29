<template>
  <section class="activity-preview flex">
    <user-avatar :user="activity.byMember || guestUser" />
    <div class="activity-details flex">
      <div class="activity-username-txt-container flex">
        <h3 class="activity-username">
          {{ activity.byMember?.fullname || guestUser.fullname }}
        </h3>
        <p class="activity-txt">{{ activity.txt }}</p>
      </div>
      <p class="activity-time">{{ activityTime }}</p>
    </div>
  </section>
</template>

<script>
import { userService } from "../services/user-service";
import userAvatar from "./user-avatar.vue";
import { formatDistance } from "date-fns";

export default {
  props: {
    activity: Object,
  },
  data() {
    return {
      guestUser: userService.getGuestUser(),
    };
  },
  created() { },
  computed: {
    activityTime() {
      const time = formatDistance(
        new Date(this.activity.createdAt),
        new Date(Date.now()),
        {
          includeSeconds: true,
          addSuffix: true,
        }
      );
      return time;
    },
  },
  components: {
    userAvatar,
  },
};
</script>

<style>

</style>