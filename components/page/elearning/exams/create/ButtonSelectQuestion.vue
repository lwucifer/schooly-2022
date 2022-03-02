<template>
  <div>
    <app-dropdown class="dropdown-setting-menu" position="right">
      <template v-slot:activator>
        <app-button
          class="font-weight-semi-bold"
          color="primary"
          size="md"
          :disabled="disabled"
          @click="$emit('handleClick')"
        >
          <IconPlus2 class="mr-2" title="Thêm câu hỏi" />
          {{ text }}
        </app-button>
      </template>
      <ul class="dropdown-menu-content dropdown-menu-content--question" v-if="expandable">
        <template v-for="(item, index) in MENU">
          <hr v-if="item.divided" :key="'DIVIDER' + index" />
          <li v-if="item.belongTo.includes(belongTo)" :key="index" @click="selectMenu(item)">
            <component :is="item.icon"></component>
            <span class="nowrap">{{ item.label }}</span>
          </li>
        </template>
      </ul>
    </app-dropdown>
  </div>
</template>

<script>
import IconPlus2 from "~/assets/svg/icons/plus2.svg?inline";
import IconSwitch from "~/assets/svg/v2-icons/hdr_strong_24px.svg?inline";
import IconCheckCircle from "~/assets/svg/v2-icons/check_circle_24px.svg?inline";
import IconList from "~/assets/svg/v2-icons/list_24px.svg?inline";
import IconSwap from "~/assets/svg/v2-icons/swap_horiz_24px.svg?inline";
import IconTextRotation from "~/assets/svg/v2-icons/text_rotation_none_24px.svg?inline";
import IconFont from "~/assets/svg/v2-icons/font_download_24px.svg?inline";
import IconMode from "~/assets/svg/v2-icons/mode_24px.svg?inline";
import IconHelp from "~/assets/svg/v2-icons/help_24px.svg?inline";
import IconContact from "~/assets/svg/v2-icons/import_contacts_24px.svg?inline";
import IconCloud from "~/assets/svg/v2-icons/cloud_upload_24px.svg?inline";

import { get, merge } from "lodash";
import { mapState } from "vuex";
import { EXAM_TYPES, EXAM_TYPE_QUESTION } from "~/utils/constants";

const MENU = [
  {
    icon: "IconSwitch",
    label: "Đúng / Sai",
    key: "YES_NO",
    belongTo: [EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
  },
  {
    icon: "IconCheckCircle",
    label: "Một lựa chọn",
    key: "SINGLE_CHOICE",
    belongTo: [EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
  },
  {
    icon: "IconList",
    label: "Nhiều lựa chọn",
    key: "MULTIPLE_CHOICE",
    belongTo: [EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
  },
  {
    icon: "IconSwap",
    label: "Ghép đáp án",
    key: "WORD_MATCH",
    belongTo: [EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
  },
  {
    icon: "IconTextRotation",
    label: "Chọn từ",
    key: "WORD_CHOICE",
    belongTo: [EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
  },
  {
    icon: "IconFont",
    label: "Điền từ",
    key: "FILL_IN_BLANK",
    belongTo: [EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
  },
  {
    icon: "IconHelp",
    label: "Từ ngân hàng câu hỏi",
    key: "FROM_QUESTION_BANK",
    belongTo: [EXAM_TYPES["ESSAY"], EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
    divided: true,
  },
  {
    icon: "IconMode",
    label: "Tự luận",
    key: "ESSAY",
    belongTo: [EXAM_TYPES["ESSAY"], EXAM_TYPES["MIX"]],
  },
  // {
  //   icon: "IconContact",
  //   label: "Từ ngân hàng đề thi",
  //   key: "FROM_TEST_BANK",
  //   belongTo: [EXAM_TYPES["ESSAY"], EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
  // },
  {
    icon: "IconCloud",
    label: "Upload đề  bài",
    key: "UPLOAD",
    belongTo: [EXAM_TYPES["ESSAY"], EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
    divided: true,
  },
];
const MENU1 = [
  {
    icon: "IconSwitch",
    label: "Đúng / Sai",
    key: "YES_NO",
    belongTo: [EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
  },
  {
    icon: "IconCheckCircle",
    label: "Một lựa chọn",
    key: "SINGLE_CHOICE",
    belongTo: [EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
  },
  {
    icon: "IconList",
    label: "Nhiều lựa chọn",
    key: "MULTIPLE_CHOICE",
    belongTo: [EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
  },
  {
    icon: "IconSwap",
    label: "Ghép đáp án",
    key: "WORD_MATCH",
    belongTo: [EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
  },
  {
    icon: "IconTextRotation",
    label: "Chọn từ",
    key: "WORD_CHOICE",
    belongTo: [EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
  },
  {
    icon: "IconFont",
    label: "Điền từ",
    key: "FILL_IN_BLANK",
    belongTo: [EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
  },
  {
    icon: "IconHelp",
    label: "Từ ngân hàng câu hỏi",
    key: "FROM_QUESTION_BANK",
    belongTo: [EXAM_TYPES["ESSAY"], EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
    divided: true,
  },
  // {
  //   icon: "IconContact",
  //   label: "Từ ngân hàng đề thi",
  //   key: "FROM_TEST_BANK",
  //   belongTo: [EXAM_TYPES["ESSAY"], EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
  // },
  {
    icon: "IconCloud",
    label: "Upload đề  bài",
    key: "UPLOAD",
    belongTo: [EXAM_TYPES["ESSAY"], EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
    divided: true,
  },
];
const MENU2 = [
  {
    icon: "IconMode",
    label: "Tự luận",
    key: "ESSAY",
    belongTo: [EXAM_TYPES["ESSAY"], EXAM_TYPES["MIX"]],
  },
  {
    icon: "IconHelp",
    label: "Từ ngân hàng câu hỏi",
    key: "FROM_QUESTION_BANK",
    belongTo: [EXAM_TYPES["ESSAY"], EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
    divided: true,
  },
  // {
  //   icon: "IconContact",
  //   label: "Từ ngân hàng đề thi",
  //   key: "FROM_TEST_BANK",
  //   belongTo: [EXAM_TYPES["ESSAY"], EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
  // },
  {
    icon: "IconCloud",
    label: "Upload đề  bài",
    key: "UPLOAD",
    belongTo: [EXAM_TYPES["ESSAY"], EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
    divided: true,
  },
];

export default {
  components: {
    IconPlus2,
    IconSwitch,
    IconCheckCircle,
    IconList,
    IconSwap,
    IconTextRotation,
    IconFont,
    IconMode,
    IconHelp,
    IconContact,
    IconCloud,
  },

  props: {
    text: {
      type: String,
      default: "Thêm câu hỏi",
    },
    expandable: {
      type: Boolean,
      default: true,
    },
    disabled: Boolean,
    belongTo: {
      type: String,
      default: EXAM_TYPES["MIX"],
      validator: (value) => Object.values(EXAM_TYPES).includes(value),
    },
    type: {
      type: String,
      default: "MIX",
    }
  },

  computed: {
    MENU () {
      if (this.type == "ESSAY") {
        return Object.freeze(MENU2)
      } else if(this.type == "MIX") {
        return Object.freeze(MENU)
      } else {
        return Object.freeze(MENU1)
      }
    }
  },

  data() {
    return {
      EXAM_TYPES: Object.freeze(EXAM_TYPES),
      EXAM_TYPE_QUESTION: Object.freeze(EXAM_TYPE_QUESTION),
    };
  },
  methods: {
    selectMenu(item) {
      this.$emit("select", item.key);
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/create/_setting-menu.scss";
</style>
