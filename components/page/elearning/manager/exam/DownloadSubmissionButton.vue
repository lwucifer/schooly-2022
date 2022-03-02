<template>
  <div class="btn--download-submission">
    <div class="d-inline-block">
      <button
        class="d-flex text-info align-items-center justify-content-center"
        @click="download"
      >
        <IconCloudDownload24px class="mr-2"/>
        Tải bài làm học sinh
      </button>
    </div>
  </div>
</template>
<script>
import IconCloudDownload24px from '~/assets/svg/v2-icons/cloud_download_24px.svg?inline';

export default {
  components: {
    IconCloudDownload24px
  },
  props: {
   
  },
  data() {
    return {

    }
  },
  methods: {
    download() {
      this.$emit('download');
    }
  }
}
</script>
<style lang="scss">
.btn--download-submission {
  button {
    padding: .8rem 1rem;
    svg path {
      fill: currentColor;
      fill-opacity: 1;
    }
  }
}
</style>