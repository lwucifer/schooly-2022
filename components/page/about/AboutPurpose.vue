<template>
  <div class="about-purpose">
      <div class="container">
          <div class="row">
              <div class="col-md-6 offset-md-6">
                  <div class="about-intro__title">Mục tiêu & Sứ mệnh</div>
              </div>
          </div>
        <div class="row">
            <div class="col-md-6">
                <div class="about-purpose__img"></div>
            </div>
            <div class="col-md-6 py-5">
                <div class="d-flex align-items-center about-purpose__item">
                    <div>
                        <IconAboutPurposeItem1 class="mr-4 about-intro__icons-purpose"/>
                    </div>
                    <div>
                       Trở thành công ty cung cấp giải pháp về công nghệ giáo dục trực tuyến hàng đầu tại Việt Nam.
                    </div>
                </div>
                <div class="d-flex align-items-center about-purpose__item">
                    <div>
                        <IconAboutPurposeItem2 class="mr-4 about-intro__icons-purpose"/>
                    </div>
                    <div>
                       Tập trung phát triển công nghệ và sáng tạo các chuẩn học tập trực tuyến mới nhằm mang lại trải nghiệm tốt nhất cho người dùng.
                    </div>
                </div>
                <div class="d-flex align-items-center about-purpose__item">
                    <div>
                        <IconAboutPurposeItem3 class="mr-4 about-intro__icons-purpose"/>
                    </div>
                    <div>
                        Mang lại những giải pháp giáo dục trực tuyến tốt nhất và tiết kiệm nhất cho các cá nhân, tổ chức, doanh nghiệp và trường học tại Việt Nam.
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import IconAboutPurposeItem1 from '~/assets/svg/icons/about-purpose-item1.svg?inline';
import IconAboutPurposeItem2 from '~/assets/svg/icons/about-purpose-item2.svg?inline';
import IconAboutPurposeItem3 from '~/assets/svg/icons/about-purpose-item3.svg?inline';
export default {
    components:{
        IconAboutPurposeItem1,
        IconAboutPurposeItem2,
        IconAboutPurposeItem3
    }
}
</script>

<style lang="scss">

</style>