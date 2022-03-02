<template>
  <div>
    <v-popover
      offset="15"
      placement="bottom"
      popover-class=""
      popoverBaseClass="dropdown-setting-menu dropdown-set-score"
      popover-inner-class="bg-white dropdown-frame-border tooltip-inner text-center px-3"
      trigger="manual"
      :open="visible"
      @hide="() => { this.visible = false; }"
    >
      <div
        @click="show"
        class="d-flex align-items-center dropdown-frame-border-title">
        <IconSetting class="dropdown-frame-menu--stroke-icon" />
        <IconArrow class="ml-2 dropdown-frame-menu--fill-icon"/>
      </div>
  
      <template slot="popover" class="tooltip-detail">
        <opt-select-point
          style="min-width: 333px;"
          @handleSavePoin="submitPoint"
          @handleCancel="cancelMark"
        >
        </opt-select-point>
      </template>
    </v-popover>
  </div>
  
</template>

<script>
import IconSetting from "~/assets/svg/v2-icons/settings.svg?inline";
import IconArrow from "~/assets/svg/v2-icons/arrow_bottom.svg?inline";
import IconEditScore from "~/assets/svg/v2-icons/filter_9_plus2_24px.svg?inline";
import OptSelectPoint from "~/components/page/elearning/manager/bank/exams/OptSelectPoint";

export default {
  components: {
    IconSetting,
    IconArrow,
    IconEditScore,
    OptSelectPoint
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    
  },
  methods: {
    submitPoint(point) {
      this.$emit('submitPoint', point);
    },
    cancelMark() {
      this.visible = false;
    },
    show() {
      this.visible = true;
    }
  }
}
</script>

<style lang="scss">
@import "~/assets/scss/components/course/create/_setting-menu.scss";
</style>