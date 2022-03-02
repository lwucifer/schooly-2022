<template>
  <aside class="exams-create-side bg-white">
    <h4 class="exs-title">Đề mục</h4>
    <ul class="exs-checkbox-list">
      <li
        v-for="item in menu"
        :key="item.key"
        :class="{ active: active[item.key] || current == item.key }"
        @click="handleClickMenuItem(item)"
      >
        <app-checkbox-circle
          :value="item.key"
          :checked="active[item.key] || current == item.key"
          :disabled="false"
        >
          {{ item.title }}
        </app-checkbox-circle>
      </li>
    </ul>
    <div class="exs-action">
      <app-button
        :disabled="!active.exam"
        square
        full-width
        @click="$emit('publish')"
        >Gửi lên</app-button
      >
    </div>
    <app-modal-confirm
      v-if="showModalConfirm"
      :confirmLoading="confirmLoading"
      description="Bạn có chắc chắn là muốn gửi bài giảng này lên để kiểm duyệt?"
    />
  </aside>
</template>

<script>
const menu = [
  {
    key: "general",
    title: "Thông tin chung",
    optional: false,
    checked: true,
  },
  {
    key: "setting",
    title: "Cài đặt",
    optional: false,
    checked: false,
  },
  {
    key: "exam",
    title: "Đề thi",
    optional: false,
    checked: false,
  }
];
export default {
  data(){
    return{
      menu,
      showModalConfirm: false,
      confirmLoading: false,
    }
  },
  props: {
    current: {
      type: [String, Number],
      default: 'general'
    },
    active: {
      type: Object,
      default: {
        general: false,
        setting: false,
        exam: false
      }
    }
  },
  methods:{
    handleClickMenuItem({ key }) {
      if (key === "general") {
        this.$emit("click-item", key);
        // this.current = key;
        return;
      }
      // if (key === "setting" && this.active.general) {
      if (key === "setting" && this.active.general) {
        this.$emit("click-item", key);
        // this.current = key;
        return;
      }
      // if (key === "exam" && this.active.setting) {
      if (key === "exam" && this.active.general && this.active.setting) {
        this.$emit("click-item", key);
        // this.current = key;
        return;
      }
    }
  }
}
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/exams/_exams-create-side.scss";
</style>