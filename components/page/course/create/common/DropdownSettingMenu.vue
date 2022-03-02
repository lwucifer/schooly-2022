<template>
  <div>
    <v-popover
      offset="10"
      placement="bottom-end"
      popover-class
      popoverBaseClass="dropdown-setting-menu dropdown-setting-menu--no-arrow"
      popover-inner-class="p-0 bg-white dropdown-frame-border"
    >
      <div class="d-flex align-items-center dropdown-frame-border-title">
        <IconSetting class="dropdown-frame-menu--stroke-icon" />
        <IconArrow class="ml-2 dropdown-frame-menu--fill-icon" />
      </div>

      <template slot="popover">
        <div v-if="activeContent == 'score-selection'" class="px-3 py-3">
          <opt-select-point
            style="min-width: 333px;"
            @handleSavePoin="submitScore"
            @handleCancel="cancelEditScore"
          ></opt-select-point>
        </div>

        <ul v-if="activeContent == 'base-menu'" class="dropdown-menu-content">
          <li @click="$emit('detail')">
            <IconVisibility />
            <span class="nowrap">Xem chi tiết</span>
          </li>
          <li @click="$emit('edit')" v-if="!hideEdit">
            <IconEdit />
            <span class="nowrap">Sửa câu hỏi</span>
          </li>
          <li @click="editScore" v-if="!hideEditScore">
            <IconEditScore />
            <span class="nowrap">Sửa điểm</span>
          </li>
          <li @click="$emit('soft')" v-if="!hideSort">
            <IconMenu class="icon-violet" />
            <span class="nowrap">Sắp xếp thứ tự</span>
          </li>
          <li @click="$emit('delete')">
            <IconTrashAlt class="icon-red" />
            <span class="nowrap">Xóa</span>
          </li>
        </ul>
      </template>
    </v-popover>
  </div>
</template>

<script>
import DropdownMenuFrame from "~/components/page/course/create/common/DropdownMenuFrame";
import IconVisibility from "~/assets/svg/v2-icons/visibility2_24px.svg?inline";
import IconMenu from "~/assets/svg/v2-icons/menu_24px.svg?inline";
import IconSetting from "~/assets/svg/v2-icons/settings.svg?inline";
import IconArrow from "~/assets/svg/v2-icons/arrow_bottom.svg?inline";
import IconEdit from "~/assets/svg/v2-icons/create3_24px.svg?inline";
import IconTrashAlt from "~/assets/svg/design-icons/trash-alt.svg?inline";
import IconEditScore from "~/assets/svg/v2-icons/filter_9_plus2_24px.svg?inline";
import OptSelectPoint from "~/components/page/elearning/manager/bank/exams/OptSelectPoint";

export default {
  components: {
    DropdownMenuFrame,
    IconVisibility,
    IconMenu,
    IconSetting,
    IconArrow,
    IconEdit,
    IconTrashAlt,
    IconEditScore,
    OptSelectPoint,
  },
  props: {
    hideEdit: {
      type: Boolean,
      default: false,
    },
    hideEditScore: {
      type: Boolean,
      default: true,
    },
    hideSort: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isShow: false,
      activeContent: "base-menu",
    };
  },
  methods: {
    submitScore(point) {
      this.activeContent = "base-menu";
      this.$emit("submitScore", point);
    },
    editScore() {
      this.activeContent = "score-selection";
    },
    cancelEditScore() {
      this.activeContent = "base-menu";
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/create/_setting-menu.scss";
</style>