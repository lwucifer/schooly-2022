<template>
  <div class="mt-4 text-left">
      <h1 class="color-primary pl-6" style="font-size:52px">Schoolly</h1>
      <h3 class="title_image-auth pl-6">Giải pháp học trực tuyến</h3>
      <img :src="image">
  </div>
</template>

<script>
import LogoAuth from "~/assets/images/auth/illustration.png"
export default {
  data(){
    return{
      image: LogoAuth 
    }
  }
}
</script>

<style>
.title_image-auth{
  color: #1D4354;
  margin-top: 2.6rem;
  margin-bottom: 4.3rem;
}
</style>