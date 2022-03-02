<template>
  <app-breadcrumb :routes="routes" class="the-breadcrumb">
    <app-breadcrumb-item
      slot="itemRender"
      slot-scope="{ crumbs, crumb, index }"
      :is-current="index === crumbs.length - 1"
      :disabled="crumb.disabled"
    >
      <n-link v-if="index < crumbs.length - 1" :to="crumb.to">{{
        crumb.title | limitLetter(30)
      }}</n-link>
      <span v-else>{{ crumb.title | limitLetter(30) }}</span>
    </app-breadcrumb-item>
    <IconArrowForwardIos24pxOutlined slot="separator" class="icon" />
  </app-breadcrumb>
</template>

<script>
import IconArrowForwardIos24pxOutlined from "~/assets/svg/icons/arrow-forward-ios-24px-outlined.svg?inline";

import { mapState, mapGetters } from "vuex";
import { limitLetter } from "~/utils/common";

export default {
  components: {
    IconArrowForwardIos24pxOutlined,
  },

  data() {
    return {
    };
  },

  filters: {
    limitLetter
  },

  computed: {
    ...mapState("elearning/detail", {
      elearningInfo: "info",
    }),
    ...mapGetters("common", {
      routes: "breadcrumb"
    })
  },
};
</script>

<style>
.the-breadcrumb {
  margin-bottom: 1.8rem;
}
</style>
