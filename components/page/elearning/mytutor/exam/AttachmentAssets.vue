<template>
  <div class="elearning-manager__attachment">
    <p class="d-flex align-items-center mb-3">
      <IconAttachment class="icon fill-opacity-1"/>
      <span class="text-dark font-weight-medium ml-2">Tải câu trả lời của học sinh</span>
    </p>
    <p>
      <a
        :href="link"
        download
        target="_blank"
        class="btn--download-attachment"
      >
        <span class="emt__file-name font-weight-semi-bold text-primary mr-2">{{ title | truncStrFilter(30) }}</span>
        <span v-if="size" class="emt__file-size mr-3">{{ size }}</span>
        <IconDownload class="icon fill-opacity-1"/>
      </a>
    </p>
  </div>
</template>

<script>
  import IconAttachment from "~/assets/svg/v2-icons/attach_file_24px.svg?inline";
  import IconDownload from "~/assets/svg/v2-icons/download_24px.svg?inline";

  export default {

    components: {
      IconAttachment,
      IconDownload
    },
    props: {
      link: {
        type: String
      },
      size: {
        type: String | Number
      },
      title: {
	type: String,
        default: ""
      }
    },
    data() {
      return {
        
      };
    },
    computed: {
      
    },
    methods: {
      
    },
    
    created() {
    }
  }
</script>

<style lang="scss">
  .elearning-manager__attachment {
    .btn--download-attachment {
      border: 1px dashed #e0e0e0;
      box-shadow: $shadow-1;
      border-radius: 2px;
      height: 3rem;
      display: inline-flex;
      align-items: center;
      padding-right: 1.12rem;
      padding-left: 1.12rem;
      font-style: normal;
      &:hover {
        box-shadow: $shadow-hover;
      }
    }
  }
  .emt__file-name {
    font-weight: 500;
  }
  .emt__file-size {
    color: $color-text;
    font-size: 1.1rem;
  }
  // @import "~/assets/scss/components/elearning/_elearning-objective-test-table.scss";
</style>
