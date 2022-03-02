<template>
  <div>
    <app-dropdown class="dropdown-setting-menu" position="right">
      <template v-slot:activator>
        <app-button
          class="font-weight-semi-bold"
          color="primary"
          size="md"
          :disabled="disabled"
          @click="$emit('handle-click')"
        >
          <IconPlus2 class="mr-2" title="Thêm câu hỏi" />
          {{ text }}
        </app-button>
      </template>
      <ul class="dropdown-menu-content dropdown-menu-content--question" v-if="expandable">
        <template v-for="(item, index) in MENU">
          <hr v-if="item.divided" :key="'DIVIDER' + index" />
          <li v-if="item.belongTo.includes(belongTo) && item.availableMethods.includes(creationMethod)" :key="index" @click="selectMenu(item)">
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

import { get } from "lodash";
import { mapState } from "vuex";
import { EXAM_TYPES, EXAM_TYPE_QUESTION, TEST_METHODS } from "~/utils/constants";

const MENU = [
  {
    icon: "IconSwitch",
    label: "Đúng / Sai",
    key: "YES_NO",
    belongTo: [EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
    availableMethods: [TEST_METHODS['MANUAL']]
  },
  {
    icon: "IconCheckCircle",
    label: "Một lựa chọn",
    key: "SINGLE_CHOICE",
    belongTo: [EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
    availableMethods: [TEST_METHODS['MANUAL']]
  },
  {
    icon: "IconList",
    label: "Nhiều lựa chọn",
    key: "MULTIPLE_CHOICE",
    belongTo: [EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
    availableMethods: [TEST_METHODS['MANUAL']]
  },
  {
    icon: "IconSwap",
    label: "Ghép đáp án",
    key: "WORD_MATCH",
    belongTo: [EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
    availableMethods: [TEST_METHODS['MANUAL']]
  },
  {
    icon: "IconTextRotation",
    label: "Chọn từ",
    key: "WORD_CHOICE",
    belongTo: [EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
    availableMethods: [TEST_METHODS['MANUAL']]
  },
  {
    icon: "IconFont",
    label: "Điền từ",
    key: "FILL_IN_BLANK",
    belongTo: [EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
    availableMethods: [TEST_METHODS['MANUAL']]
  },
  {
    icon: "IconMode",
    label: "Tự luận",
    key: "ESSAY",
    belongTo: [EXAM_TYPES["ESSAY"], EXAM_TYPES["MIX"]],
    availableMethods: [TEST_METHODS['MANUAL']]
  },
  {
    icon: "IconHelp",
    label: "Từ ngân hàng câu hỏi",
    key: "FROM_QUESTION_BANK",
    belongTo: [EXAM_TYPES["ESSAY"], EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
    divided: true,
    availableMethods: [TEST_METHODS['MANUAL']]
  },
  {
    icon: "IconContact",
    label: "Từ ngân hàng đề thi",
    key: "FROM_TEST_BANK",
    belongTo: [EXAM_TYPES["ESSAY"], EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
    availableMethods: [TEST_METHODS['IPTEST'], TEST_METHODS['MANUAL']]
  },
  {
    icon: "IconCloud",
    label: "Upload đề  bài",
    key: "UPLOAD",
    belongTo: [EXAM_TYPES["ESSAY"], EXAM_TYPES["CHOICE"], EXAM_TYPES["MIX"]],
    divided: true,
    availableMethods: [TEST_METHODS['UPLOAD'], TEST_METHODS['MANUAL']]
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
      // validator: (value) => Object.values(EXAM_TYPES).includes(value),
    },
    creationMethod: {
      type: String,
      default: ''
    }
  },

  computed: {},

  data() {
    return {
      EXAM_TYPES: Object.freeze(EXAM_TYPES),
      EXAM_TYPE_QUESTION: Object.freeze(EXAM_TYPE_QUESTION),
      MENU: Object.freeze(MENU),
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
