<template>
  <div>
    <AccountIntro />
    <AccountIntroWork />
  </div>
</template>

<script>
import AccountIntro from "~/components/page/social/account/AccountIntro.vue";
import AccountIntroWork from "~/components/page/social/account/AccountIntroWork";

export default {
  components: {
    AccountIntro,
    AccountIntroWork,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/social/_social-account-about.scss";
</style>