<template>
  <app-modal centered :width="420" :component-class="{ 'message-foward-tags-modal': true }">
    <div slot="content">
      <h5 class="mb-3">Thêm bạn bằng số điện thoại</h5>
      <app-input class="mb-0" />
      <div class="text-right mt-3">
        <app-button size="sm" color="info" class="mr-3" square @click="close()">Hủy</app-button>
        <app-button size="sm" square>Tìm</app-button>
      </div>
    </div>
  </app-modal>
</template>

<script>
import { mapState } from "vuex";

export default {
  components: {},

  data() {
    return {};
  },

  methods: {
    close() {
      this.$emit("close");
    }
  },

  computed: {}
};
</script>