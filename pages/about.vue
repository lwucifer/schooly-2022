<template>
  <div class="py-0 about-page">
      <AboutBanner/>
      <AboutIntro/>
      <AboutPurpose/>
      <AboutFeature/>
      <AboutBenefit/>
  </div>
</template>

<script>
import AboutBanner from "~/components/page/about/AboutBanner"
import AboutIntro from "~/components/page/about/AboutIntro"
import AboutPurpose from "~/components/page/about/AboutPurpose"
import AboutFeature from "~/components/page/about/AboutFeature"
import AboutBenefit from "~/components/page/about/AboutBenefit"
export default {
    components:{
        AboutBanner,
        AboutIntro,
        AboutPurpose,
        AboutFeature,
        AboutBenefit
    }
}
</script>

<style lang="scss">
@import "~/assets/scss/components/about/_about-page.scss";
</style>