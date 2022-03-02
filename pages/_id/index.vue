<template>
</template>

<script>
export default {
  middleware({ store, params, redirect }) {
    redirect(`/${params.id}/info`)
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/account/_account.scss";
</style>


