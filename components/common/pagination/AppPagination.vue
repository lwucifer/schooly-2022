<template>
  <ul
    class="app-pagination"
    v-if="total < 6 && total > 1"
    :class="{ ...styleCls}"
  >
    <li>
      <a
        class="link link-arrow"
        @click="goTo(prev, current == 1)"
        :class="prev ? '' : 'disabled'"
      >
        <i><IconAngleLeft /></i>
      </a>
    </li>
    <li v-for="(i, index) in parseInt(total, 10)" :key="index">
      <a
        class="link"
        :class="i == current ? 'active' : ''"
        @click="goTo(i)"
        >{{ i }}</a
      >
    </li>
    <li>
      <a
        class="link link-arrow"
        @click="goTo(next, current == total)"
        :class="next ? '' : 'disabled'"
      >
        <i><IconAngleRight /></i>
      </a>
    </li>
  </ul>

  <ul
    class="app-pagination"
    v-else-if="total > 1"
    :class="{ ...styleCls}"
  >
    <li>
      <a
        class="link link-arrow"
        @click="goTo(prev, current == 1)"
        :class="prev ? '' : 'disabled'"
      >
        <i><IconAngleLeft /></i>
      </a>
    </li>
    <li v-if="prev && prev != 1">
      <a class="link" @click="goTo(1)">1</a>
    </li>
    <li v-if="current > 3">
      <span class="link bold disable">...</span>
    </li>

    <li v-if="total == current">
      <a class="link" @click="goTo(current - 3)">{{ current - 3 }}</a>
    </li>
    <li v-if="total - current < 2">
      <a class="link" @click="goTo(current - 2)">{{ current - 2 }}</a>
    </li>

    <li v-if="prev">
      <a class="link" @click="goTo(prev)">{{ prev }}</a>
    </li>
    <li>
      <a class="link active">{{ current }}</a>
    </li>
    <li v-if="next">
      <a class="link" @click="goTo(next)">{{ next }}</a>
    </li>

    <li v-if="current < 3">
      <a class="link" @click="goTo(current + 2)">{{ current + 2 }}</a>
    </li>
    <li v-if="current == 1">
      <a class="link" @click="goTo(current + 3)">{{ current + 3 }}</a>
    </li>

    <li v-if="current < total - 2">
      <span class="link bold disable">...</span>
    </li>
    <li v-if="total - current > 1">
      <a class="link" @click="goTo(total)">{{ total }}</a>
    </li>

    <li>
      <a
        class="link link-arrow"
        @click="goTo(next, current == total)"
        :class="next ? '' : 'disabled'"
      >
        <IconAngleRight />
      </a>
    </li>
  </ul>
</template>

<script>
import IconAngleRight from "~/assets/svg/v2-icons/arrow_forward_ios_24px.svg?inline";
import IconAngleLeft from "~/assets/svg/v2-icons/arrow_back_ios_24px.svg?inline";
import IconPrevious from "~/assets/svg/design-icons/previous.svg?inline";
import IconStepForward from "~/assets/svg/design-icons/step-forward.svg?inline";
import { toNumber, get } from "lodash";

export default {
  components: {
    IconPrevious,
    IconStepForward,
    IconAngleLeft,
    IconAngleRight,
  },

  data() {
    return {
      pager: toNumber(get(this, "pagination.size", 0)),
    };
  },

  props: {
    position: {
      type: String,
      default: "center", // left | center | right
    },
    pagination: {
      type: Object,
      required: true,
      default: () => {
        return {
          total: 0,
          size: 10,
          page: 1,
          total_elements: 0,
          first: 1,
          last: 1,
          number: 0,
          number_of_elements: 0,
          total_pages: 0,
        };
      },
    },
    opts: {
      type: Array,
      default: () => {
        return [
          { value: 10, text: "10" },
          { value: 20, text: "20" },
          { value: 30, text: "30" },
          { value: 50, text: "50" },
        ];
      },
    },
  },

  methods: {
    goTo(e, check = false) {
      if (!check) {
        this.$emit("pagechange", { number: e - 1, size: this.pager });
      }
    },
  },

  computed: {
    pages() {
      return this.pagination;
    },
    current() {
      return toNumber(get(this, "pagination.number", 0)) + 1;
    },
    total() {
      return toNumber(get(this, "pagination.total_pages", 0));
    },
    prev() {
      return this.current > 1 ? this.current - 1 : null;
    },
    next() {
      return this.current < this.total ? this.current + 1 : null;
    },
    from() {
      return (
        get(this, "pagination.number", 0) * get(this, "pagination.size", 0) + 1
      );
    },
    to() {
      return (
        get(this, "pagination.number", 0) * get(this, "pagination.size", 0) +
        get(this, "pagination.number_of_elements", 0)
      );
    },
    styleCls() {
      const positionCls = {
        "app-pagination--pos-left": this.position === "left",
        "app-pagination--pos-center": this.position === "center",
        "app-pagination--pos-right": this.position === "right",
      };
      return {
        ...positionCls,
      };
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-pagination.scss";
</style>
