<template>
  <div class="">
    <app-select
      class="cc-select w-100"
      id="require"
      :options="lessonsOpt"
      placeholder="Chọn bài học"
      label="name"
      size="md"
      bordered
      @change="handleSelectLesson"
    >
      <template slot="placeholder-icon">
        <IconAngleDown class="icon" />
      </template>
    </app-select>
  </div>
</template>

<script>
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
import { get } from "lodash";
import { mapState } from "vuex";

export default {
  components: {
    IconAngleDown,
  },

  computed: {
    lessonsOpt() {
      return this.lessons.map((item) => ({
        ...item,
        value: item.id,
        text: item.name,
      }));
    },
    ...mapState("elearning/create", {
      lessons: "lessons",
    }),
  },

  methods: {
    handleSelectLesson(lesson_id) {
      this.$store.dispatch("elearning/create/getLesson", lesson_id);
      this.$emit('change', lesson_id);
    },
    get,
  },
};
</script>
