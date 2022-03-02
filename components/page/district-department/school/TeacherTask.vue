<template>
  <div>
    <create-content-box
      title="Phân công giảng dạy"
    >
      <template v-slot:content>
        <div>
          Coming soon....
        </div>
      </template>
    </create-content-box>
  </div>
</template>

<script>
  import CreateContentBox from "~/components/page/classroom/create/CreateContentBox"

  export default {
    components: {
      CreateContentBox,
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