<template>
  <div :class="read ? 'readed' : ''" @click.prevent="handleReadNotify">
    <div class="wrapitemnotify">
      <app-avatar src="https://picsum.photos/60/60" />
      <div class="text-gray ml-3">
        <p>You are running Vue in developmentdevelopment mode.Make sure to turn on production mode when deploying for production.</p>
        <p>5 giờ</p>
      </div>
      <div class="d-flex flex-column align-items-center pl-3 ml-auto btn-hover">
        <button
          class="cc-box__btn cc-box__btn-edit"
          v-tooltip.bottom="{ content: 'Xóa thông báo', classes: ['tooltipAnnouncenment'] }"
        >
          <IconTrashAlt class="icon fill-disabled" />
        </button>
        <button
          class="cc-box__btn cc-box__btn-edit mt-2"
          v-if="readAnnouncenment"
          @click.prevent="handleReadNotify"
          v-tooltip.bottom="{ content: 'Đánh dấu đã đọc', classes: ['tooltipAnnouncenment'] }"
        >
          <IconEllipse class="d-block fill-gray" />
        </button>
        <button
          class="cc-box__btn cc-box__btn-edit mt-2"
          v-else
          @click.prevent="handleUnreadNotify"
          v-tooltip.bottom="{ content: 'Đánh dấu chưa đọc', classes: ['tooltipAnnouncenment'] }"
        >
          <IconEllipseAlt class="d-block fill-gray" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import IconTrashAlt from "~/assets/svg/design-icons/trash-alt.svg?inline";
import IconEllipseAlt from "~/assets/svg/icons/ellipse-alt.svg?inline";
import IconEllipse from "~/assets/svg/icons/ellipse.svg?inline";
export default {
  components: {
    IconTrashAlt,
    IconEllipseAlt,
    IconEllipse
  },
  data() {
    return {
      readAnnouncenment: true,
      read: false
    };
  },
  methods: {
    handleReadNotify() {
      this.readAnnouncenment = false;
      this.read = true;
    },
    handleUnreadNotify() {
      this.readAnnouncenment = true;
      this.read = false;
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/account/_account-info-announcement-item.scss";
</style>