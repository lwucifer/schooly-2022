<template>
  <div>
    <content-box
      title="Hỗ trợ"
    >
      <template v-slot:content>
        <div class="">
          Comming soon...
        </div>
      </template>
    </content-box>
  </div>
</template>

<script>
  import ContentBox from "~/components/page/district-department/account/ContentBox"

  export default {
    components: {
      ContentBox,
    },
    data() {
      return {}
    },
    mounted() {

    }
  }
</script>

<style lang="scss" scoped>
  /*@import "~/assets/scss/components/district-department/account/_profile.scss";*/
</style>