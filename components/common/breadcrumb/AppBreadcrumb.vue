<template>
  <ol class="app-breadcrumb">
    <li v-for="(item, index) in crumbs" class="app-breadcrumb-item-wrapper" :key="item.to">
      <slot name="itemRender" v-bind="{ crumbs, crumb: item, index }">
        <app-breadcrumb-item
          nuxt
          :key="index"
          :to="item.to"
          :is-current="index === crumbs.length - 1"
          :disabled="item.disabled"
        >{{ item.title }}</app-breadcrumb-item>
      </slot>
      <span class="app-breadcrumb-separator" v-if="index < crumbs.length - 1">
        <slot name="separator">{{ separator }}</slot>
      </span>
    </li>
  </ol>
</template>

<script>
// Refer: https://medium.com/@pratheekhegde/displaying-application-breadcrumbs-in-vue-js-85456dc8a370
import { get } from "lodash";

export default {
  props: {
    routes: {
      type: Array,
      default: () => []
    },
    separator: {
      type: String,
      default: "/"
    }
  },

  computed: {
    crumbs() {
      return this.routes;
      // const pathArray = this.$route.path.split("/").slice(1);
      // // console.log("[pathArray]", pathArray, this.routes)
      // const matchedPathArray = this.$route.matched[0].path.split("/").slice(1);
      // const breadcrumbs = pathArray.slice(0, 3).reduce((breadcrumbArray, path, idx) => {
      //   breadcrumbArray.push({
      //     path: path,
      //     to: breadcrumbArray[idx - 1]
      //       ? "/" + breadcrumbArray[idx - 1].path + "/" + path
      //       : "/" + path,
      //     name: this.getName(matchedPathArray, idx) || path
      //   });
      //   return breadcrumbArray;
      // }, []);
      // return breadcrumbs;
    }
  },

  methods: {
    getName(matchedPathArray, idx) {
      // console.log("getName idx", idx);
      const fullPath = "/" + matchedPathArray.slice(0, idx + 1).join("/");
      const route = this.routes.find(item => item.path === fullPath) || {};
      return route.name;
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-breadcrumb.scss";
</style>