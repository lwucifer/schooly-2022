<template>
  <div class="post-image" :class="classes">
    <div v-if="images.length > 1" class="post-image-grid">
      <template v-for="(item, index) in images.slice(0, 5)">
        <a
          v-if="images.length > 5 && index === 4"
          class="post-image-item post-image-item--num"
          :key="item.id"
          :href="`${location}/post?photo_id=${item.id}`"
          :data-rest="images.length > 5 ? `+${images.length - 5}` : 0"
          @click.prevent="handleClickImage(item, index)"
        >
          <div class="post-image-item__container">
            <app-video
              v-if="item.object === ATTACHMENT_TYPES.VIDEO"
              :src="item.thumb"
              size="md"
              :show-controls="false"
              preload="metadata"
              style="pointer-events: none;"
            />
            <img v-if="item.object === ATTACHMENT_TYPES.IMAGE" :src="item.thumb" alt />
          </div>
        </a>

        <a
          v-else
          class="post-image-item"
          :key="item.id"
          :href="`${location}/post?photo_id=${item.id}`"
          @click.prevent="handleClickImage(item, index)"
        >
          <div class="post-image-item__container">
            <app-video
              v-if="item.object === ATTACHMENT_TYPES.VIDEO"
              :src="item.thumb"
              size="md"
              :show-controls="false"
              preload="metadata"
              style="pointer-events: none;"
            />
            <img v-if="item.object === ATTACHMENT_TYPES.IMAGE" :src="item.thumb" alt />
          </div>
        </a>
      </template>
    </div>

    <a
      v-else
      class="post-image-item"
      :href="`${location}/post?photo_id=${images[0].id}`"
      @click.prevent="images[0].object !== ATTACHMENT_TYPES.VIDEO && handleClickImage(images[0])"
    >
      <app-video
        v-if="images[0].object === ATTACHMENT_TYPES.VIDEO"
        :src="images[0].thumb"
        size="md"
        preload="metadata"
      />
      <img v-if="images[0].object === ATTACHMENT_TYPES.IMAGE" :src="images[0].thumb" alt />
    </a>
  </div>
</template>

<script>
import { ATTACHMENT_TYPES } from "~/utils/constants";

export default {
  props: {
    images: {
      type: Array,
      default: () => [],
    },
    mainImagePosition: {
      type: String,
      default: "", //  '' | 'top' | 'left' - available when images.legth == 3 | 4
    },
  },

  data() {
    return {
      location: process.browser ? window.location.origin : "",
    };
  },

  created() {
    this.ATTACHMENT_TYPES = Object.freeze(ATTACHMENT_TYPES);
  },

  computed: {
    classes() {
      return {
        "post-image-has-grid": this.images.length >= 2,
        "post-image-grid-5-items": this.images.length >= 5,
        "post-image-grid-4-items": this.images.length === 4,
        "post-image-grid-3-items": this.images.length === 3,
        "post-image-grid-2-items": this.images.length === 2,
      };
    },
  },

  methods: {
    handleClickImage(image, index = 0) {
      this.$emit("click-item", image, index, this.images.length);
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/post/_post-image.scss";
</style>