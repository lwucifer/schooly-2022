<template>
  <div v-if="get(lesson, 'format', '') === 'VIDEO'">
    <IconPlayO class="mr-3" />{{ get(lesson, "name", "") }}
    <span class="ml-auto">{{ get(lesson, "duration", "") }}</span>
  </div>
</template>

<script>
import { get } from "lodash";
import IconPlayO from "~/assets/svg/icons/play-o.svg?inline";

export default {
  components: {
    IconPlayO
  },
  props: {
    lesson: {
      type: Object,
      default: null
    }
  },
  created() {
    console.log(this.lesson);
  },
  methods: {
    get
  }
};
</script>
