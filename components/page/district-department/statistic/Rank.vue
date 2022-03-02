<template>
  <div class="rank">
    <h4 class="title">{{ title }}</h4>
    <div>
      <div class="rank__tab">
        <a :class="content == 'department-rank' ? 'active' : ''" @click="content = 'department-rank'">Đánh giá xếp hạng phòng giáo dục</a>
        <a :class="content == 'school-rank' ? 'active' : ''" @click="content = 'school-rank'">Đánh giá xếp hạng trường học</a>
        <a :class="content == 'teacher-rank' ? 'active' : ''" @click="content = 'teacher-rank'">Đánh giá xếp hạng giáo viên</a>
      </div>
      <hr class />

      <div class="rank__tab-content">
        <keep-alive>
          <component
            :is="currentComponent"
            :list="list"
          >
          </component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      actived: {
        type: String,
        default: 'school-rank',
        validator: value => ['department-rank', 'school-rank', 'teacher-rank'].includes(value)
      },
      list: {
        type: Array,
        required: true
      },
      title: {
        type: String,
        required: true
      }
    },
    components: {
      SchoolRank: () => import('~/components/page/district-department/statistic/rank/SchoolRank'),
    },
    computed: {
      currentComponent: function() {
        const MATCHED_COMPONENTS = {
          'school-rank': 'SchoolRank',
          'department-rank': 'SchoolRank',
          'teacher-rank': 'SchoolRank',
        }
        return MATCHED_COMPONENTS[this.content]
      }
    },
    data() {
      return {
        content: this.actived
      }
    },
  }
</script>

<style lang="scss">
  @import "~/assets/scss/components/district-department/statistic/_rank.scss";
</style>