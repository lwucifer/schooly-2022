<template>
  <div>
    <ChapterItem
      v-for="(chapter, index) in chapters"
      :key="get(chapter, 'id', '')"
      :chapter="chapter"
      :index="index"
    />
  </div>
</template>

<script>
import IconEditAlt from "~/assets/svg/design-icons/edit-alt.svg?inline";
import { getParamQuery } from "~/utils/common";
const IconTrashAlt = () =>
  import("~/assets/svg/design-icons/trash-alt.svg?inline");
import * as actionTypes from "~/utils/action-types";
import { mapState } from "vuex";
import ChapterItem from "~/components/page/course/create/course/ChapterItem";
import { get } from "lodash";

export default {
  components: {
    IconEditAlt,
    IconTrashAlt,
    ChapterItem,
  },

  computed: {
    ...mapState("elearning/create", {
      chapters: "chapters",
      general: "general",
    }),
  },

  methods: {
    get,
  },
};
</script>
