<template>
  <div class="elearning-lesson-side">
    <OnlineClass />
    <ElearningProgram />
    <!-- <ElearningProgram2 @showexercise="$emit('showexercise')"/> -->
  </div>
</template>
<script>
import IconPlay from "~/assets/svg/icons/play.svg?inline";
import IconUpO from "~/assets/svg/icons/up-o.svg?inline";
import IconDownO from "~/assets/svg/icons/down-o.svg?inline";
import IconFileCheck from "~/assets/svg/design-icons/file-check.svg?inline";
import IconFileEditAlt from "~/assets/svg/design-icons/file-edit-alt.svg?inline";
import IconFileCheckAlt from "~/assets/svg/design-icons/file-check-alt.svg?inline";
import IconFileClock from "~/assets/svg/icons/file-clock.svg?inline";
import { get } from "lodash";
import OnlineClass from "~/components/page/elearning/study/olclass/OnlineClass";
// import ElearningProgram from "~/components/page/elearning/study/ElearningProgram";
import ElearningProgram from "~/components/page/elearning/study/v2/ElearningProgram";

export default {
  components: {
    IconPlay,
    IconDownO,
    IconUpO,
    IconFileClock,
    IconFileCheckAlt,
    IconFileEditAlt,
    IconFileCheck,
    // ElearningProgram,
    // OnlineClass,
    ElearningProgram,
    OnlineClass
  },
  props: {
    info: {},
    progress: {},
  },

  created() {
    // console.log(this.progress, this.info);
  },

  data() {
    return {
      ids: [],
      check: {},
    };
  },

  methods: { get },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/course/_elearning-course-side.scss";
</style>
