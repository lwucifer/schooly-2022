<template>
  <div class="elearning-item">
    <img :src="data.image" alt />
    <div class="video" v-if="data.video">
      <IconVideo2 />
    </div>
    <div class="content">
      <n-link class="title">{{data.name}}</n-link>
      <div class="name">
        <app-avatar :src="data.avatar" :size="20" class="mr-2" />
        <span>{{data.username}}</span>
      </div>
      <div class="status">
        <div class="status-success" :style="'width:' + data.status + '%'"></div>
      </div>
      <div class="d-flex">
        <span>Đã hoàn thành:</span>
        <strong class="color-primary ml-2">{{data.status}}%</strong>
        <app-dropdown
          class="elearning-item__actions-menu ml-auto"
          position="left"
          open-on-click
          v-model="dropdownShow"
          content-width="230px"
        >
          <button slot="activator" slot-scope="{ on }" type="button" class="elearning-item__actions-btn" v-on="on">
            <IconDots />
          </button>
          <ul class="elearning-item__actions-list">
            <li>
              <a href class="d-flex">
                <IconShare />
                <span>Chia sẻ</span>
              </a>
            </li>
            <li>
              <a href class="d-flex">
                <IconHeart class="fill-666"/>
                <span>Thêm vào yêu thích</span>
              </a>
            </li>
            <li>
              <a href class="d-flex">
                <IconSave />
                <span>Lưu trữ</span>
              </a>
            </li>
          </ul>
        </app-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import IconDots from "~/assets/svg/icons/three-dots.svg?inline";
import IconSave from "~/assets/svg/icons/save.svg?inline";
import IconShare from "~/assets/svg/icons/share.svg?inline";
import IconHeart from "~/assets/svg/icons/heart.svg?inline";
import IconVideo2 from "~/assets/svg/icons/video2.svg?inline";

export default {
  components: {
    IconDots,
    IconShare,
    IconSave,
    IconHeart,
    IconVideo2
  },

  props: {
    data: {
      type: Object,
      required: true,
      default: () => {}
    },
    title: { type: String }
  },

  data() {
    return {
      dropdownShow: false
    };
  },

  methods: {}
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-item.scss";
</style>