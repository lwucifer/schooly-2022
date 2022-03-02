<template>
  <div>
    <app-editor class="mb-4" v-model="detail"></app-editor>
    <div>
      <app-button class="mr-3" color="white" @click="cancel">Hủy</app-button>
      <app-button @click="submit" v-if="story == '' || story == null">Thêm tiểu sử</app-button>
      <app-button @click="submit" v-else>Lưu thay đổi</app-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    story: {
      type: String,
      default: ""
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      detail: this.story
    };
  },
  computed: {
    // detail: function() {
    //   return this.story;
    // }
  },
  // created() {
  //   this.detail = this.story;
  // },
  methods: {
    cancel() {
      console.log("[Cancel create story account]");
      this.$emit("cancel");
    },
    submit() {
      console.log("[Submit create story account]");
      this.$emit("submit", this.detail);
    }
  }
};
</script>

<style scoped>
</style>