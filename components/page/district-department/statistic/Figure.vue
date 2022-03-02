<template>
  <div class="statistic__figure">
    <div
      v-for="(item, index) in figures"
      :key="index"
      class="statistic__figure__item-wrapper"
    >
      <div
        class="statistic__figure__item"
        :style="{'background-color': colors[index  % (colors.length)]}"
      >
        <p class="title">{{ item.title }}</p>
        <p class="value"><b>{{ item.value | numeralFormat("0,0.00") }}</b></p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        colors: ['#5A96FF', '#FFCA56', '#EF72C4', '#A671FE', '#CCCCCC'],
        figures: [
          {
            title: 'Tổng số trường học',
            value: 1000
          },
          {
            title: 'Tổng số giáo viên',
            value: 10100
          },
          {
            title: 'Tổng số học sinh',
            value: 1534
          },
          {
            title: 'Tổng số bài giảng',
            value: 986
          },
          {
            title: 'Tổng số khóa học',
            value: 1978
          },
        ]
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "~/assets/scss/components/district-department/statistic/_figure.scss";
</style>