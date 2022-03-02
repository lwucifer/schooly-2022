<template>
  <div class="app-select" :class="classes" v-click-outside="hideOptions">
    <!-- TAGS MODE -->
    <template v-if="mode === 'tags' || mode === 'multiple'">
      <div class="app-select__selected" @click="handleClickSelected()">
        <span class="app-select__prepend" v-if="$slots.prepend || $scopedSlots.prepend">
          <slot name="prepend" :selected="selected" />
        </span>

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
        </div>
      </div>

      <div class="app-select__options" v-show="active">
        <div
          v-if="!options.length && emptyMessage"
          class="app-select__option text-center"
        >{{ emptyMessage }}</div>

        <div
          v-for="option in options"
          class="app-select__option"
          :class="{ active: localValue.includes(option.value) }"
          :key="option.value"
          @click="handleClickOption(option)"
        >
          <slot name="option" :option="option" :isSelected="localValue.includes(option.value)">
            <span v-if="localValue.includes(option.value)" class="app-select__checked-icon">
              <IconTick class="icon" />
            </span>
            <template v-else>{{ option.text }}</template>
          </slot>
        </div>

        <slot name="options-append" />
      </div>
    </template>
    <!-- END TAGS MODE -->

    <!-- DEFAULT MODE -->
    <template v-else>
      <div class="app-select__selected" tabindex="0" @click="handleClickSelected()">
        <span class="app-select__prepend" v-if="$slots.prepend || $scopedSlots.prepend">
          <slot name="prepend" :selected="selected" />
        </span>

        <span
          v-if="localValue === null || localValue === undefined"
          class="app-select__placeholder"
        >{{ $attrs.placeholder || "" }}</span>

        <span v-else class="app-select__selected-value">
          <slot
            name="selected"
            v-if="$scopedSlots.selected || $slots.selected"
            :selected="selected"
          />
          <template v-else>{{ selected.text }}</template>
        </span>

        <div class="mr-auto"></div>

        <template v-if="searchable">
          <div class="app-select__search">
            <input
              ref="search"
              v-model="search"
              type="text"
              autocomplete="off"
              class="app-select__search-input"
              :placeholder="$attrs.placeholder"
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
            <IconExpandMore class="icon d-block fill-opacity-1" />
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
          :key="option.value"
          @click="handleClickOption(option)"
        >
          <span v-if="option.value === localValue" class="app-select__checked-icon">
            <IconTick class="icon" />
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
import IconExpandMore from "~/assets/svg/v2-icons/expand_more_24px.svg?inline";
import IconClose from "~/assets/svg/icons/close.svg?inline";
import IconTick from "~/assets/svg/icons/tick-gray.svg?inline";

export default {
  inheritAttrs: false,

  provide() {
    return {
      appSelect: this,
    };
  },

  components: {
    IconExpandMore,
    IconClose,
    IconTick,
  },

  model: {
    prop: "value",
    event: "change",
  },

  props: {
    options: {
      type: Array,
      default: () => [],
      validator: (value) =>
        value.every((option) =>
          ["value", "text"].every((key) => key in option)
        ),
    },
    value: {
      type: [String, Number, Array, Boolean],
      default: null,
    },
    defaultValue: {
      type: [String, Number, Array, Boolean],
      default: null,
    },
    mode: {
      type: String,
      default: "", // '' | 'tags' | 'multiple'
    },
    emptyMessage: {
      type: String,
      default: "No option",
    },
    showClear: Boolean,
    searchable: Boolean,
    size: {
      type: String,
      default: "md", // 'sm' | 'md'
    },
    bordered: Boolean,
    disabled: Boolean,
    forceHideOptions: Boolean,
  },

  data() {
    const localValue =
      this.value === null || this.value === undefined
        ? this.defaultValue != null
          ? this.defaultValue
          : this.mode === ""
          ? null
          : []
        : this.value != null
        ? this.value
        : this.mode === ""
        ? null
        : [];
    return {
      active: false,
      search: "",
      localValue,
      tmpOptions: this.options,
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
        "app-select--bordered": this.bordered,
      };
    },

    selected() {
      if (["tags", "multiple"].indexOf(this.mode) > -1) {
        return this.localValue.map((id) => {
          const [optionItem = {}] = this.tmpOptions.filter(
            (option) => option.value === id
          );
          return optionItem;
        });
      } else {
        const [optSelected = {}] = this.options.filter(
          (item) => item.value === this.localValue
        );
        return optSelected;
      }
    },
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
    },

    search(newValue) {
      if (["tags", "multiple"].indexOf(this.mode) > -1) {
        this.$emit("search", newValue, this.clearSearch);
      } else {
        this.$emit("search", newValue);
      }
    },
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
            (item) => item !== option.value
          );
        } else {
          this.localValue = [...this.localValue, option.value];
        }
        this.search = "";
      } else {
        // on default mode
        this.localValue = option.value;
        this.hideOptions();
      }
    },

    handleClickSelected(manualActive) {
      if (this.forceHideOptions) {
        this.$refs.search && this.$refs.search.focus();
        return;
      }

      if (manualActive !== undefined) {
        this.active = manualActive;
        this.$refs.search && manualActive && this.$refs.search.focus();
      } else {
        this.active = !this.active;
        this.$refs.search && this.$refs.search.focus();
      }
    },

    clearSearch() {
      this.search = "";
    },

    handleSearchTag(e) {
      // Set width of input
      const el = e.target;
      el.style.width = el.scrollWidth + "px";
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
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-select.scss";
</style>
