<template>
  <ul class="social-account-menu" :class="{ 'social-account-menu--fixed': menuLayout === 'fixed' }">
    <li v-for="item in menu" :key="item.routePath">
      <n-link
        :class="{ active: checkActive(item.match || []) }"
        :to="item.routePath"
        :exact="item.exact"
        :title="item.title"
      >{{ item.title }}</n-link>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    menu: {
      type: Array,
      default: () => [],
    },
    menuLayout: {
      type: String,
      default: "",
      validator: (value) => ["", "fixed"].includes(value),
    },
  },

  methods: {
    checkActive(match = []) {
      if (match.length) {
        const splitedPath = this.$route.path.split("/");
        const pageName = splitedPath[splitedPath.length - 1];
        return match.includes(pageName);
      }

      return false;
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/social/account/_social-account-menu.scss";
</style>