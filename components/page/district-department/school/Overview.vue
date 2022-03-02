<template>
  <div>
    <content-box
      title="Tổng quan"
    >
      <template v-slot:content>
        <div>
          <div class="box-primary mt-3">
            <div class="d-md-flex">
              <app-avatar src="https://picsum.photos/150/150" :size="150"/>
              <div class="text">
                <h3>Đại học Đại Nam</h3>
                <p class="mt-3 mb-4 color-666">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus
                  accumsan quam non tempus. Quisque scelerisque porttitor sem, dictum dapibus tortor blandit
                  vestibulum.</p>
                <p class="contact-item">
                  <span class="contact-item__title">
                    Mã trường:
                  </span>
                  <span class="h6">MHDUAA12</span>
                </p>
                <p class="contact-item">
                  <span class="contact-item__title">
                    Địa chỉ:
                  </span>
                  <span class="h6">16 Xuân Diệu, Tây Hồ, Hà Nội</span>
                </p>
                <p class="contact-item">
                  <span class="contact-item__title">
                    Số điện thoại:
                  </span>
                  <span class="h6">0987236512</span>
                </p>
                <p class="contact-item">
                  <span class="contact-item__title">
                    Email:
                  </span>
                  <span class="h6">maiica@gmail.com</span>
                </p>
              </div>
            </div>
          </div>
          <!--Statistic-->
          <div class="statistic row text-center">
            <div class="col-6 col-md-3 statistic__item">
              <p class="h2 statistic__item__value">59</p>
              <p class="statistic__item__title">Tổng số giáo viên</p>
            </div>
            <div class="col-6 col-md-3 statistic__item">
              <p class="h2 statistic__item__value">1875</p>
              <p class="statistic__item__title">Tổng số học sinh toàn trường</p>
            </div>
            <div class="col-6 col-md-3 statistic__item">
              <p class="h2 statistic__item__value">41</p>
              <p class="statistic__item__title">Số bài giảng đã duyệt</p>
            </div>
            <div class="col-6 col-md-3 statistic__item">
              <p class="h2 statistic__item__value">33</p>
              <p class="statistic__item__title">Số khoá học đã duyệt</p>
            </div>
          </div><!--Statistic-->
        </div>
      </template>
    </content-box>
  </div>
</template>

<script>
  import ContentBox from "~/components/page/district-department/school/ContentBox"

  export default {
    components: {
      ContentBox,
    },
    data() {
      return {}
    },
    mounted() {

    }
  }
</script>

<style lang="scss" scoped>
  @import "~/assets/scss/components/district-department/school/_overview.scss";
</style>