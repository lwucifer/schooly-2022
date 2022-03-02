<template>
  <div>
    <h5 class="color-primary mb-3">{{ title }}</h5>
    <div class="elearning-manager-content__title__breadcrumb">
      <n-link
        v-for="(item, index) in breadcrumb"
        :key="index"
        :to="item.link"
      >
        <span v-if="index != breadcrumb.length - 1">
          {{ item.text }}
          <i> > </i>&nbsp;
        </span>
        <span v-else>
          <b>{{ item.text }}</b>
        </span>
      </n-link>
    </div>
    <hr class/>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: 'Bài tập và bài kiểm tra',
      },
      breadcrumb: {
        type: Array,
        default: () => [],
        validator: value =>
          value.every(option => ["text", "link"].every(key => key in option))
      }
    }
  }
</script>

<style scoped>

</style>