<template>
  <v-select
    class="app-vue-select"
    :class="classes"
    v-bind="{ ...$attrs, ...$props, ...$slots }"
    v-on="$listeners"
    ref="vueSelectItem"
    @open="handleOpen"
    @search="handleSearch"
  >
    <template v-slot:selected-option="option">
      <slot name="selected-option" :option="option">
        <span v-if="isSltedAll(option)">{{ placeholder }}</span>
        <span v-else>{{ getOptionLabel(option) }}</span>
      </slot>
    </template>
    <template v-slot:option="option">
      <slot name="option" :option="option">
        <span v-if="isSltedOption(option)" :title="getOptionLabel(option)">
          <i class="vs__icon-selected">
            <slot name="selected-icon">
              <IconCheck />
            </slot>
          </i>
          <slot name="option-content" :option="option">{{
            getOptionLabel(option)
          }}</slot>
        </span>
        <span v-else :title="getOptionLabel(option)">
          <slot name="option-content" :option="option">{{
            getOptionLabel(option)
          }}</slot>
        </span>
      </slot>
    </template>
    <template v-slot:list-footer>
      <slot name="list-footer"></slot>
    </template>
    <template v-slot:no-options>
      <slot name="no-options">No option</slot>
    </template>
  </v-select>
</template>
<script>
import vSelect from "vue-select";
import IconCheck from "~/assets/svg/v2-icons/check.svg?inline";

export default {
  props: {
    // size: {
    //   type: String,
    //   default: "sm" // 'sm' | 'md' | 'lg'
    // },
    allOpt: {
      type: Object,
    },
    hasBorder: Boolean,
  },
  components: {
    vSelect,
    IconCheck,
  },
  computed: {
    classes() {
      const sizeCls = {};
      const styleCls = {
        "app-vue-select--has-border": this.hasBorder,
      };
      return {
        ...sizeCls,
        ...styleCls,
      };
    },
  },
  // mixins: [vSelect],
  extends: vSelect,
  methods: {
    isSltedOption(option) {
      return this.$refs["vueSelectItem"].isOptionSelected(option);
    },
    isSltedAll(option) {
      if (this.allOpt) {
        return this.optionComparator(option, this.allOpt);
      }
      return false;
    },
    handleOpen() {
      this.$emit("open");
    },
    handleSearch(val) {
      console.log("emit search: ", val);
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-vue-select.scss";
</style>
