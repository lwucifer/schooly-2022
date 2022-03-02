<template>
  <div class="row my-5">
    <div :class="col" v-for="(item, index) in elearningList" :key="index">
      <slot :item="item" />
      <!-- <ElearningItem 
          :elearning="item"
      />-->
    </div>
  </div>
</template>

<script>
import ElearningItem from "~/components/page/elearning/mycourses/ElearningItem";
export default {
  components: {
    ElearningItem,
  },
  props: {
    elearningList: {
      default: null,
    },

    col: {
      type: String,
      default: "col-md-3",
    },
  },
};
</script>

<style></style>
