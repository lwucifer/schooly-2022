<template>
  <app-modal
    centered
    :width="350"
    :component-class="{ 'elearning-course-modal': true }"
    @close="$router.push('/')"
    v-if="visible"
  >
    <div slot="content text-center">
        <p>Xác nhận hoàn thành bài giảng</p>
        <div>
            <app-button color="info" class="mr-3" @click="$emit('click-close')">
                Hủy bỏ
            </app-button>
            <app-button @click="$emit('click-close')">
                Xác nhận
            </app-button>
        </div>
    </div>
  </app-modal>
</template>

<script>
export default {
  components: {
  },
  props: {
    visible: Boolean
  },
  computed: {},
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearninng/course/_elearning-modal.scss";
</style>