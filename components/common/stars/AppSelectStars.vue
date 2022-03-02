<template>
  <div class="app-select-stars" :class="classes">
    <template v-for="star in stars">
      <input
        type="radio"
        :class="{
          'app-select-stars__clear': star.value === 0,
        }"
        :key="star.id"
        :id="star.id"
        :name="name"
        :value="star.value"
        :checked="value === star.value"
        @input="(event) => handleInput(event, star.value)"
      />
      <label
        :class="[
          'app-select-stars__star',
          `app-select-stars__star--${star.value}`,
        ]"
        :key="star.id + '-label'"
        :for="star.id"
      >
        <IconStar class="app-select-stars__icon-active" />
        <IconStarO class="app-select-stars__icon-deactive" />
      </label>
    </template>
  </div>
</template>

<script>
import IconStar from "~/assets/svg/icons/star.svg?inline";
import IconStarO from "~/assets/svg/icons/star-o.svg?inline";

export default {
  components: {
    IconStar,
    IconStarO,
  },

  model: {
    event: "change",
    prop: "value",
  },

  props: {
    value: {
      type: Number | String,
      default: 0,
      validator: (value) => value >= 0 && value <= 5,
    },
    name: {
      type: String,
      default: "stars-" + +new Date(),
    },
    size: {
      type: Number,
      default: 20,
    },
  },

  data() {
    let stars = [];
    for (let i = 5; i > -1; i--) {
      stars = [...stars, { value: i, id: `${this.name}-${i}` }];
    }

    return {
      stars,
      localValue: this.value,
    };
  },

  computed: {
    classes() {
      return {
        "app-select-stars--size-sm": this.size < 16,
        "app-select-stars--size-lg": this.size >= 16,
      };
    },
  },

  watch: {
    value(newValue) {
      this.localValue = newValue;
    },

    localValue(newValue) {
      this.$emit("change", newValue);
    },
  },

  methods: {
    handleInput(event, value) {
      this.$emit("handleInput", value);
      this.localValue = value;
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-select-stars.scss";
</style>
