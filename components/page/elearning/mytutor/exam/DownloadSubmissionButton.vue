<template>
  <div class="btn--download-submission">
    <div class="d-inline-block">
      <a
        :href="link"
        download
        target="_blank"
        class="d-flex text-info align-items-center justify-content-center"
      >
        <IconCloudDownload24px class="mr-2"/>
        Tải bài làm học sinh
      </a>
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
    link: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>
<style lang="scss">
.btn--download-submission {
  a {
    padding: .8rem 1rem;
    svg path {
      fill: currentColor;
      fill-opacity: 1;
    }
  }
}
</style>