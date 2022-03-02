<template>
  <div>
    <content-box
      title="Bài giảng và khóa học"
    >
      <template v-slot:content>
        <div>
          Coming soon....
        </div>
      </template>
    </content-box>
  </div>
</template>

<script>
  import ContentBox from "~/components/page/district-department/school/ContentBox"

  export default {
    components: {
      ContentBox,
    },
    data() {
      return {
      }
    },
    mounted() {

    }
  }
</script>

<style lang="scss" scoped>
  /*@import "~/assets/scss/components/district-department/school/_overview.scss";*/
</style>