<template>
  <div class="wrap-elearning-download">
      <h3>{{ name }}</h3>
      <IconEditFileDownload class="img-download"/>
      <p>Bài học bằng văn bản, vui lòng tải về máy của bạn</p>
      <app-button 
        size="sm"
        class="btn-download"
        v-on:click="hanldeDowloadElearning()"
      >
          <IconCloudDownload24px class="icon"/>
          Tải về
      </app-button>
  </div>
</template>

<script>
import IconEditFileDownload from '~/assets/svg/icons/edit-file-download.svg?inline';
import IconCloudDownload24px from '~/assets/svg/v2-icons/cloud_download_24px.svg?inline';
export default {
    components:{
        IconEditFileDownload,
        IconCloudDownload24px
    },
    props:{
        link:{
            type: String,
            default: null
        },
        name:{
            type: String,
            default: null
        }
    },
    methods:{
        hanldeDowloadElearning(){
            window.open(this.link, "_blank");
        }
    }
}
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/_elearning-study-download";
</style>