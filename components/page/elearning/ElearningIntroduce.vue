<template>
  <section class="elearning-id-box scroll-target" id="introduce">
    <h4 class="mb-4" v-if="get(info, 'benefits.length', 0)">
      Lợi ích từ {{ title }}
    </h4>

    <div v-if="typeof get(info, 'benefits', '') === 'string'" class="d-flex">
      <template v-if="get(info, 'benefits', [])">
        <IconCheck class="icon text-primary body-1 mr-2" />
        <div v-html="get(info, 'benefits', [])" />
      </template>
    </div>

    <span v-else-if="!get(info, 'benefits', [])" class="caption text-sub"
      >Chưa có nội dung</span
    >

    <div v-else class="row">
      <div
        v-for="(item, index) in get(info, 'benefits', [])"
        :key="index"
        class="col-md-6 d-flex mb-15"
      >
        <IconCheck class="icon text-primary body-1 mr-2" />
        <div v-html="item" />
      </div>
    </div>

    <h4 class="my-4">Mô tả tổng quát</h4>
    <div v-if="description" v-html="description" class="word-break-all"></div>
    <div v-else class="text-center caption text-gray-2">Chưa có nội dung.</div>

    <div class="text-center mt-3" v-if="load_more">
      <a @click="handleLoadMore" class="btn-load-more">Xem thêm</a>
    </div>

    <div class="text-center mt-3" v-if="hide_description">
      <a @click="handleCompact" class="btn-load-more">Rút gọn</a>
    </div>
  </section>
</template>

<script>
import { get } from "lodash";
const IconCheck = () => import("~/assets/svg/design-icons/check.svg?inline");
import { mapState } from "vuex";

export default {
  components: {
    IconCheck,
  },

  data() {
    return {
      lengthDescription: 300,
    };
  },

  computed: {
    title() {
      switch (get(this, "info.type", "")) {
        case "LECTURE":
          return "bài giảng";
          break;
        case "COURSE":
          return "khoá học";
          break;
        default:
          break;
      }
    },
    ...mapState("elearning/detail", {
      info: "info",
    }),
    description() {
      let string = get(this, "info.description", "").substring(
        0,
        this.lengthDescription
      );
      if (this.load_more) string += "...";
      return string;
    },
    load_more() {
      return get(this, "info.description.length", 0) > this.lengthDescription;
    },
    hide_description() {
      return (
        this.lengthDescription == get(this, "info.description.length", 0) &&
        get(this, "info.description.length", 0) > 300
      );
    },
  },

  methods: {
    get,
    handleLoadMore() {
      this.lengthDescription = get(this, "info.description.length", 0);
    },

    handleCompact() {
      this.lengthDescription = 300;
    },
  },
};
</script>
