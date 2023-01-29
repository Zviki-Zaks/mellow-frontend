<template>
  <section class="cmp-preview cover-unsplash-preview">
    <div class="cmp-header">
      <a class="back-to-cmp-btn" v-if="searchingUnsplash" @click="(searchingUnsplash = false), (searchResults = false)">
        <span></span>
      </a>
      <p class="cmp-container-title">{{ pageTitle }}</p>
      <a class="close-cmp-btn" @click="closeCmp">
        <span></span>
      </a>
    </div>
    <hr class="thin-hr" />

    <section v-if="!searchingUnsplash" class="main-cover-screen">
      <p class="labels-title">Size</p>
      <div class="cover-size-select">
        <button class="coverSelect pointer" @click="setFullCover(false)">
          <img v-if="currCoverImg" class="coverSelectImg top" :src="currCoverImg" alt />
          <div v-if="currCoverBg" class="coverSelectImg top" :style="currCoverBg"></div>
          <div class="over-full-cover-select"></div>
          <div class="dummy title"></div>
          <div class="dummy text"></div>
        </button>

        <button class="coverSelect pointer" @click="setFullCover(true)">
          <img v-if="currCoverImg" class="coverSelectImg" :src="currCoverImg" alt />
          <div v-if="currCoverBg" class="coverSelectImg" :style="currCoverBg"></div>
          <div class="over-full-cover-select"></div>
          <div class="dummy title"></div>
          <div class="dummy text"></div>
        </button>
      </div>
      <div v-if="deletable" @click="removeCover" class="unsplash-btn full-width-btn remove-cover pointer">Remove cover
      </div>

      <list-slot>
        <template #title>Color</template>
        <template #list>
          <div v-for="bgc in bgColors" :key="bgc.id" class="label-option flex pointer"
            :style="{ backgroundColor: bgc.color }" @click="selectBgClr(bgc.color)"></div>
        </template>
      </list-slot>

      <section>
        <list-slot>
          <template #title>Attachments</template>
          <template #list>
            <img v-for="(photo, idx) in attachments?.slice(0, 6)" :key="idx" class="unsplash-result-small pointer"
              :src="photo" alt="img" @click="applyPhoto(photo)" />
          </template>
        </list-slot>

        <label>
          <input type="file" @change="onAttachImg" hidden />
          <div class="unsplash-btn full-width-btn pointer">Upload a cover image</div>
        </label>
      </section>

      <list-slot>
        <template #title>Photos from Unsplash</template>
        <template #list>
          <img v-for="photo in photos.slice(0, 6)" :key="photo.id" class="unsplash-result-small pointer"
            :src="photo.urls.thumb" alt="img" @click="applyPhoto(photo)" />
        </template>
      </list-slot>

      <button class="unsplash-btn full-width-btn pointer" @click="searchingUnsplash = true">Search for photos</button>
    </section>

    <section v-if="searchingUnsplash && !searchResults" class="search-unsplash-screen">
      <input type="text" placeholder="Search Unsplash for photos" class="unsplash-search" v-model="search"
        @input="waitSearch" />

      <list-slot>
        <template #title>Suggested searches</template>
        <template #list>
          <button class="unsplash-btn pointer" v-for="(term, idx) in searchTerms" :key="idx"
            @click="searchPhotoWithButton(term)">{{ term }}</button>
        </template>
      </list-slot>

      <list-slot>
        <template #title>Top photos</template>
        <template #list>
          <img v-for="photo in photos.slice(0, 12)" :key="photo.id" class="unsplash-result-small pointer"
            :src="photo.urls.thumb" alt="img" @click="applyPhoto(photo)" />
        </template>
      </list-slot>
    </section>

    <section v-if="searchResults" class="unsplash-results-screen">
      <list-slot>
        <template #list>
          <img v-for="photo in photos" :key="photo.id" class="unsplash-result-large pointer" :src="photo.urls.thumb"
            alt="img" @click="applyPhoto(photo)" />
        </template>
      </list-slot>
    </section>
  </section>
</template>

<script>
import listSlot from "../components/list-slot.vue";
import axios from "axios";
import _ from "lodash";

export default {
  name: "cover-unsplash",
  components: {
    listSlot,
  },
  props: {
    style: Object,
    title: String,
    attachments: Array,
  },
  data() {
    return {
      currStyle: {
        bgClr: "",
        bgImg: "",
        isFullCover: false,
        uploadedImg: "",
      },
      photos: [],
      currTitle: "",
      searchingUnsplash: false,
      searchResults: false,
      search: "",
      photo_url: null,
      download_url: null,
      searchTerms: [
        "Productivity",
        "Perspective",
        "Organization",
        "Colorful",
        "Nature",
        "Business",
        "Minimal",
        "Space",
        "Animals",
      ],
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
    };
  },
  created() {
    this.currStyle = JSON.parse(JSON.stringify(this.style));
    this.currTitle = this.title;
    this.searchPhoto(this.title);
  },
  methods: {
    searchPhoto(searchTerm) {
      const accessKey = "Y2X6Y_wdMpqvaYX_4jgO-dOBqVAsQMQpihsIFNOAX5E";
      let count = 20;
      let query = searchTerm;
      if (!query) query = this?.search || 'business'
      axios
        .get(
          `https://api.unsplash.com/search/photos?page=1&per_page=${count}&query=${query}&client_id=${accessKey}`
        )
        .then((response) => {
          // JSON responses are automatically parsed.
          this.photos = response.data.results;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    searchPhotoWithButton(searchTerm) {
      this.searchResults = true
      this.searchPhoto(searchTerm)
    },
    applyPhoto(photo) {
      this.currStyle.uploadedImg = photo?.urls?.small || photo;
      this.currStyle.bgClr = "";
      this.currStyle.bgImg = "";
      this.searchResults = false;
      this.searchingUnsplash = false;
      this.search = ''
      this.$emit("addStyle", this.currStyle);
    },
    waitSearch: _.debounce(function () {
      this.searchPhoto();
      this.searchResults = true;
      this.search = ''

    }, 1000),
    selectBgClr(bgClr) {
      this.currStyle.bgClr = bgClr;
      this.currStyle.bgImg = "";
      this.currStyle.uploadedImg = "";
      this.$emit("addStyle", this.currStyle);
    },
    removeCover() {
      this.currStyle.bgClr = "";
      this.currStyle.bgImg = "";
      this.currStyle.uploadedImg = "";
      this.$emit("addStyle", this.currStyle);
    },
    closeCmp() {
      this.$emit("closeCmp");
    },
    setFullCover(val) {
      this.currStyle.isFullCover = val;
      this.$emit("addStyle", this.currStyle);
    },
    async onAttachImg(ev) {
      const img = await this.$store.dispatch({ type: "attachImg", ev });
      this.currStyle.uploadedImg = img.url;
      this.currStyle.bgClr = "";
      this.currStyle.bgImg = "";
      this.$emit("addStyle", this.currStyle);
    },
  },
  computed: {
    pageTitle() {
      return this.searchingUnsplash ? "Photo search" : "Cover";
    },
    currCoverImg() {
      return this.style?.bgImg || this.style?.uploadedImg || ''
    },
    currCoverBg() {
      const bgc = this.style?.bgClr || ''
      return { 'background-color': bgc }
    },
    deletable() {
      if (this.style.bgImg || this.style.uploadedImg || this.style.bgClr) return true
    }
  },
};
</script>
