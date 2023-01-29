<template>
  <backdrop @click="$emit('closeCmp')">
    <section class="board-menu" @click.stop>
      <div class="cmp-header">
        <a v-if="handles.isAbout || handles.isChangeBg || handles.isShowActivities" class="back-to-cmp-btn"
          @click="toggleMenuContent">
          <span></span>
        </a>
        <p class="cmp-container-title">{{ cmpTitle }}</p>
        <a class="close-cmp-btn" @click="$emit('closeCmp')">
          <span></span>
        </a>
      </div>
      <hr class="thin-hr" />
      <section class="menu-content">
        <div v-if="
          !handles.isAbout && !handles.isChangeBg && !handles.isShowActivities
        " class="menu-options flex">
          <div class="menu-option" @click="toggleMenuContent('isAbout')">
            <span class="trello-icon"></span>
            <div>
              <p class="menu-option-about">About this board</p>
              <p class="menu-option-about-description">
                Add description to your board
              </p>
            </div>
          </div>
          <div class="menu-option" @click="toggleMenuContent('isChangeBg')">
            <img class="board-bg-preview" src="../assets/imgs/board.jpg" />
            <p class="menu-option-bgc">Change background</p>
          </div>
          <hr class="thin-hr" />
        </div>

        <section v-if="!handles.isAbout && !handles.isChangeBg" class="menu-activities-container">
          <p v-if="!handles.isShowActivities" class="activity-header" @click="toggleMenuContent('isShowActivities')">
            Activity
          </p>
          <div class="activities-list">
            <activity-preview v-for="activity in activitiesToDisplay" :key="activity.id" :activity="activity" />
          </div>
          <a v-if="!handles.isShowActivities" class="show-allActivities"
            @click="toggleMenuContent('isShowActivities')">View all activity</a>
        </section>
        <section v-if="handles.isChangeBg" class="change-bg-container">
          <div v-if="!bgOptions.isChangClr && !bgOptions.isChangImg" class="change-bg-choose">
            <div class="photos-colors-options flex">
              <div class="photos-option-container" @click="toggleBgOption('isChangImg')">
                <img class="photos-option" src="../assets/imgs/photos.jpg" />
                <p class="photos-option-title">Photos</p>
              </div>
              <div class="colors-option-container" @click="toggleBgOption('isChangClr')">
                <img class="colors-option" src="../assets/imgs/colors.jpg" />
                <p class="color-option-title">Colors</p>
              </div>
            </div>
            <hr class="thin-hr" />
            <p class="custom-option-title">Custom</p>
            <div class="customs-container flex">
              <label class="custom-input-label">
                <input type="file" @change="onAttachImg" hidden />
                <div class="custom-option">
                  <span></span>
                </div>
              </label>
            </div>
          </div>
          <div class="options-list">
            <list-slot v-if="bgOptions.isChangClr">
              <template v-slot:list>
                <div v-for="bgc in bgColors" :key="bgc.id" class="colors-option" :style="{ backgroundColor: bgc.color }"
                  @click="selectBg('bgClr', bgc.color)"></div>
              </template>
            </list-slot>
            <div v-if="bgOptions.isChangImg" class="change-bg-img-screen">
              <input type="text" placeholder="Search Unsplash for photos" class="unsplash-search" v-focus
                v-model="search" @input="waitSearch" />
              <list-slot>
                <template #list>
                  <img v-for="(photo, idx) in photos" :key="idx" class="photos-option" :src="photo.urls.thumb" alt="img"
                    @click="selectBg('bgImg', photo)" />
                </template>
              </list-slot>
            </div>
          </div>
        </section>
      </section>
    </section>
  </backdrop>
</template>

<script>
import activityPreview from "./activity-preview.vue";
import listSlot from "./list-slot.vue";
import backdrop from "./common/backdrop.vue";

import axios from "axios";
import _ from "lodash";
export default {
  props: {
    board: Object,
  },
  data() {
    return {
      filterBy: "",
      handles: {
        isAbout: false,
        isSearch: false,
        isChangeBg: false,
        isShowActivities: false,
      },
      bgOptions: {
        isChangClr: false,
        isChangImg: false,
      },
      bgClr: "",
      bgImg: "",
      bgColors: [
        { id: "l101", color: "#61bd4f", isSelected: false },
        { id: "l102", color: "#f2d600", isSelected: false },
        { id: "l103", color: "#ff9f1a", isSelected: false },
        { id: "l104", color: "#eb5a46", isSelected: false },
        { id: "l105", color: "#c377e0", isSelected: false },
        { id: "l106", color: "#0079bf", isSelected: false },
        { id: "l107", color: "#00c2e0", isSelected: false },
        { id: "l108", color: "#51e898", isSelected: false },
        { id: "l109", color: "#ff78cb", isSelected: false },
        { id: "l110", color: "#344563", isSelected: false },
      ],
      search: "",
      photos: [],
      isLoading: false,
      attachments: [],
    };
  },
  methods: {
    searchPhoto(term) {
      const accessKey = "Y2X6Y_wdMpqvaYX_4jgO-dOBqVAsQMQpihsIFNOAX5E";
      let count = 20;
      let query = term;
      if (!query) query = this.search;
      axios
        .get(
          `https://api.unsplash.com/search/photos?page=1&per_page=${count}&query=${query}&client_id=${accessKey}`
        )
        .then((response) => {
          this.photos = response.data.results;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    waitSearch: _.debounce(function () {
      this.searchPhoto();
    }, 1000),
    toggleMenuContent(type) {
      if (this.bgOptions.isChangClr || this.bgOptions.isChangImg) {
        this.toggleBgOption();
        return;
      }
      for (let key in this.handles) {
        this.handles[key] = false;
      }
      if (typeof type === "string") {
        this.handles[type] = true;
      }
    },
    toggleBgOption(type) {
      for (const key in this.bgOptions) {
        this.bgOptions[key] = false;
      }
      if (typeof type === "string") {
        this.bgOptions[type] = true;
        if (type === "isChangImg") this.searchPhoto(this.board.title);
      }
    },
    selectBg(type, val) {
      this.$emit("editBoard", type, val);
    },
    async onAttachImg(ev) {
      this.isLoading = true;
      const imgUrl = await this.$emit("attachImg", ev);
      this.attachments.push(imgUrl);
      this.isLoading = false;
    },
  },
  computed: {
    activitiesToDisplay() {
      const activities = this.board.activities.sort((a1, a2) =>
        a1.createdAt > a2.createdAt ? -1 : 1
      );
      return this.handles.isShowActivities
        ? activities
        : activities.slice(0, 20);
    },
    cmpTitle() {
      if (this.handles.isAbout) return "About";
      if (this.handles.isSearch) return "Search";
      if (this.bgOptions.isChangClr) return "Colors";
      if (this.bgOptions.isChangImg) return "Photos";
      if (this.handles.isChangeBg) return "Change background";
      if (this.handles.isShowActivities) return "Activity";
      else return "Menu";
    },
  },
  components: {
    activityPreview,
    listSlot,
    backdrop
  },
};
</script>
