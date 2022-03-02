<template>
  <app-breadcrumb :routes="routes" class="the-breadcrumb">
    <app-breadcrumb-item
      slot="itemRender"
      slot-scope="{ crumbs, crumb, index }"
      :is-current="index === crumbs.length - 1"
      :disabled="crumb.disabled"
    >
      <n-link v-if="index < crumbs.length - 1" :to="crumb.to">{{ crumb.name }}</n-link>
      <span v-else>{{ crumb.name }}</span>
    </app-breadcrumb-item>
    <IconArrowForwardIos24pxOutlined slot="separator" class="icon" />
  </app-breadcrumb>
</template>

<script>
import IconArrowForwardIos24pxOutlined from "~/assets/svg/icons/arrow-forward-ios-24px-outlined.svg?inline";

export default {
  components: {
    IconArrowForwardIos24pxOutlined
  },

  data() {
    return {
      routes: [
        {
          path: "/elearning",
          name: "Elearning"
        },
        // {
        //   path: "/elearning/:id",
        //   name: "Elearning test detail"
        // },
        // {
        //   path: "/elearning/:id",
        //   name: "Elearning test detail"
        // },
      ]
    };
  }
};
</script>

<style>
.the-breadcrumb {
  margin-bottom: 1.8rem;
}
</style>