<template>
  <div class="app-select" :class="classes" v-click-outside="hideOptions">
    <!-- TAGS MODE -->
    <template v-if="mode === 'tags' || mode === 'multiple'">
      <div class="app-select__selected" @click="handleClickSelected">
        <span class="app-select__placeholder" v-if="!localValue.length">
          {{
          $attrs.placeholder || ""
          }}
        </span>
        <app-tag
          v-for="(item, index) in selected"
          :key="item.value"
          class="ma-1"
          show-close
          @close.stop="handleCloseTag(item, index)"
        >{{ item.text }}</app-tag>

        <div class="app-select__field">
          <input
            ref="search"
            type="text"
            autocomplete="off"
            class="app-select__field__input"
            v-model="search"
            @input="handleSearchTag"
          />
          <!-- <span class="app-select__field__mirror">{{ search }}</span> -->
        </div>
      </div>

      <div class="app-select__options" v-show="active">
        <div
          v-if="!options.length && emptyMessage"
          class="app-select__option text-center"
        >{{ emptyMessage }}</div>

        <div
          v-for="option in options"
          class="app-select__option d-flex align-items-center px-3"
          :class="{ active: localValue.includes(option.value) }"
          :key="option.value"
          @click="handleClickOption(option)"
        >
          <span v-if="localValue.includes(option.value)" class="">
            <IconCheckBox24px class="fill-primary mr-3" />
          </span>
          <span v-else>
            <IconCheckBoxOutlineBlank24px class="mr-3"/>
          </span>
          <slot v-if="$scopedSlots.option || $slots.option" name="option" :option="option" />
          <template v-else>{{ option.text }}</template>
        </div>

        <slot name="options-append" />
      </div>
    </template>
    <!-- END TAGS MODE -->

    <!-- DEFAULT MODE -->
    <template v-else>
      <div class="app-select__selected" tabindex="0" @click="handleClickSelected">
        <span class="app-select__prepend" v-if="$slots.prepend || $scopedSlots.prepend">
          <slot name="prepend" :selected="selected" />
        </span>

        <span
          v-if="localValue === null || localValue === undefined"
          class="app-select__placeholder"
        >{{ $attrs.placeholder || "" }}</span>

        <span v-else class="app-select__selected-value">
          {{
          selected.text
          }}
        </span>

        <div class="mr-auto"></div>

        <template v-if="searchable">
          <div class="app-select__search">
            <input
              type="text"
              autocomplete="off"
              class="app-select__search-input"
              v-model="search"
              @input="handleSearchDefault"
            />
          </div>
        </template>

        <template v-if="showClear">
          <span
            v-if="!(localValue === null || localValue === undefined)"
            class="app-select__clear"
            @click.stop="handleClickClear"
          >
            <IconClose class="icon" />
          </span>
        </template>

        <span class="app-select__arrow">
          <!--Slot for change the caret icon-->
          <slot name="placeholder-icon">
            <IconExpandMore class="icon d-block" />
          </slot>
        </span>
      </div>

      <div class="app-select__options" v-show="active">
        <div
          v-if="!options.length && emptyMessage"
          class="app-select__option text-sub"
        >{{ emptyMessage }}</div>

        <div
          v-for="option in options"
          :class="[
            'app-select__option',
            option.value === localValue && 'active',
          ]"
          class="d-flex align-items-center px-3"
          :key="option.value"
          @click="handleClickOption(option)"
        >
          <span v-if="option.value === localValue">
            <IconRadioButtonChecked24px class="mr-3 fill-primary" />
          </span>
          <span v-else>
              <IconRadioButtonUnchecked24px class="mr-3"/>
          </span>
          <slot v-if="$scopedSlots.option || $slots.option" name="option" :option="option" />
          <template v-else>{{ option.text }}</template>
        </div>

        <slot name="options-append" />
      </div>
    </template>
    <!-- END DEFAULT MODE -->
  </div>
</template>

<script>
import { uniqWith } from "lodash";
const IconExpandMore = () =>
  import("~/assets/svg/v2-icons/expand_more_24px.svg?inline");
const IconClose = () => import("~/assets/svg/icons/close.svg?inline");
const IconTick = () => import("~/assets/svg/icons/tick-gray.svg?inline");
import IconCheckBoxOutlineBlank24px from '~/assets/svg/v2-icons/check_box_outline_blank_24px.svg?inline';
import IconCheckBox24px from '~/assets/svg/v2-icons/check_box_24px.svg?inline';
import IconRadioButtonUnchecked24px from '~/assets/svg/v2-icons/radio_button_unchecked_24px.svg?inline';
import IconRadioButtonChecked24px from '~/assets/svg/v2-icons/radio_button_checked_24px.svg?inline';
export default {
  inheritAttrs: false,

  provide() {
    return {
      appSelect: this
    };
  },

  components: {
    IconExpandMore,
    IconClose,
    IconTick,
    IconCheckBoxOutlineBlank24px,
    IconCheckBox24px,
    IconRadioButtonUnchecked24px,
    IconRadioButtonChecked24px
  },

  model: {
    prop: "value",
    event: "change"
  },

  props: {
    options: {
      type: Array,
      default: () => [],
      validator: value =>
        value.every(option => ["value", "text"].every(key => key in option))
    },
    value: {
      type: [String, Number, Array, Boolean],
      default: null
    },
    defaultValue: {
      type: [String, Number, Array, Boolean],
      default: null
    },
    mode: {
      type: String,
      default: "" // '' | 'tags' | 'multiple'
    },
    emptyMessage: {
      type: String,
      default: "No option"
    },
    showClear: Boolean,
    searchable: Boolean,
    size: {
      type: String,
      default: "md" // 'sm' | 'md'
    },
    bordered: Boolean,
    disabled: Boolean
  },

  data() {
    const localValue = this.value === null || this.value === undefined
        ? this.defaultValue != null ? this.defaultValue : (this.mode === "" ? null : [])
        : this.value != null ? this.value : (this.mode === "" ? null : []);
    return {
      active: false,
      search: "",
      localValue,
      tmpOptions: this.options
    };
  },

  computed: {
    classes() {
      return {
        active: this.active,
        "app-select--disabled": this.disabled,
        "app-select--tags": ["tags", "multiple"].indexOf(this.mode) > -1,
        "app-select--searchable": this.searchable,
        "app-select--size-sm": this.size === "sm",
        "app-select--bordered": this.bordered
      };
    },

    selected() {
      if (["tags", "multiple"].indexOf(this.mode) > -1) {
        return this.localValue.map(id => {
          const [optionItem = {}] = this.tmpOptions.filter(
            option => option.value === id
          );
          return optionItem;
        });
      } else {
        const [optSelected = {}] = this.options.filter(
          item => item.value === this.localValue
        );
        return optSelected;
      }
    }
  },

  watch: {
    active(newValue) {
      this.$emit("visible-change", newValue);
    },

    value(newValue) {
      this.localValue = newValue;
    },

    localValue(newValue) {
      this.$emit("change", newValue, this.selected);
    },

    options(newValue) {
      if (["tags", "multiple"].indexOf(this.mode) === -1 || !newValue.length)
        return;
      const tmp = this.tmpOptions.concat(newValue);
      this.tmpOptions = uniqWith(tmp, (a, b) => a.value === b.value);
    }
  },

  methods: {
    hideOptions() {
      this.active = false;
      this.search = "";
    },

    unSelectOption(index) {
      return this.localValue
        .slice(0, index)
        .concat(this.localValue.slice(index + 1, this.localValue.length));
    },

    handleClickOption(option) {
      if (["tags", "multiple"].indexOf(this.mode) > -1) {
        if (this.localValue.includes(option.value)) {
          this.localValue = this.localValue.filter(
            item => item !== option.value
          );
        } else {
          this.localValue = [...this.localValue, option.value];
        }
      } else {
        // on default mode
        this.localValue = option.value;
        this.hideOptions();
      }

    },

    handleClickSelected() {
      this.active = !this.active;
      this.$refs.search && this.$refs.search.focus();
    },

    handleSearchTag(e) {
      // Set width of input
      const el = e.target;
      el.style.width = el.scrollWidth + "px";

      // define a function to clear search text
      const clear = () => this.search = '';

      // Emit event to parent
      this.$emit("search", e.target.value, clear);
    },

    handleSearchDefault(e) {
      this.$emit("search", e.target.value);
    },

    handleCloseTag(id, index) {
      this.localValue = this.unSelectOption(index);
    },

    handleClickClear() {
      if (["tags", "multiple"].indexOf(this.mode) > -1) {
        this.localValue = [];
      } else {
        this.localValue = null;
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-select.scss";
</style>
