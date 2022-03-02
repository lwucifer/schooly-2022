import Vue from "vue";
import { Picker, Emoji } from "emoji-mart-vue";

Vue.component("picker", {
  extends: Picker,
  props: {
    set: {
      type: String,
      default: "twitter",
    },
  },
});

Vue.component("emoji", {
  extends: Emoji,
  props: {
    set: {
      type: String,
      default: "twitter",
    },
    size: {
      type: Number,
      default: 20,
    },
  },
});
