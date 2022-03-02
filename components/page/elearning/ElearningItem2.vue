<template>
  <div class="elearning-item2">
    <div class="elearning-item2__image">
      <img class="d-block w-100" :src="get(item, 'avatar.low', null)" :alt="item.name" />
      <div
        class="status-online"
        v-if="item.onlineStatus && item.online === 1"
      >{{ item.onlineStatus }}</div>
      <div class="online" v-if="item.online">Trực tiếp</div>
      <div class="video" v-if="item.video">
        <IconVideo3 />
      </div>
    </div>
    <div class="bottom">
      <h3 class="elearning-item2__title">
        <n-link :to="`/elearning/${item.elearning_id}`">{{ item.name }}</n-link>
      </h3>

      <div class="elearning-item2_teacher">
        <app-avatar :src="get(item, 'teacher.avatar.low', '')" :size="22" />
        <span class="name">{{ get(item, "teacher.name", "") }}</span>
      </div>

      <div class="d-flex">
        <div class="stars">
          <app-stars :stars="Math.floor(item.review_rate || 0)" />
        </div>
        <span class="ml-3">
          <strong>{{ item.review_rate || 0 }}</strong>
          ({{ item.review_count || 0 }})
        </span>
      </div>

      <div class="text-right">
        <span v-if="item.free" class="body-1 text-primary font-weight-bold">Miễn phí</span>
        <template v-else>
          <s
            v-if="item.discount > 0"
            class="body-3"
          >{{ get(item, "elearning_price.original_price", 0) | numeralFormat }}đ</s>
          <span
            class="body-1 text-primary font-weight-bold"
          >{{ get(item, "elearning_price.price", 0) | numeralFormat }}đ</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from "lodash";
import IconVideo3 from "~/assets/svg/icons/video3.svg?inline";

export default {
  components: {
    IconVideo3
  },

  props: {
    item: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },

  created() {
    // console.log(this.item);
  },

  methods: {
    get
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-item2.scss";
</style>
