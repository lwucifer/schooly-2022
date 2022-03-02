<template>
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div class="col-md-4 footer__col">
          <n-link to class="footer__logo mb-3">
            <img src="/images/bo-cong-thuong.png" width="147" alt="Đã đăng ký bộ công thương" />
          </n-link>
          <div class="footer__brand-desc">
            <p>Công ty cổ phần giáo dục Schoolly Việt Nam</p>
            <p>MST: 0109235899 do Sở kế hoạch và Đầu tư TP Hà Nội cấp ngày 22 tháng 06 năm 2020</p>
            <p>Tầng 4, 62 Nguyễn Huy Tưởng, Thanh Xuân, Hà Nội</p>
          </div>
        </div>

        <div class="col-md-3 footer__col">
          <h2 class="footer__title">Về Schoolly</h2>
          <ul class="footer__menu">
            <li>
              <n-link to="/about">Giới thiệu Schoolly</n-link> 
            </li>
            <li>
              <n-link to="/policy-security">Điều khoản sử dụng</n-link> 
            </li>
            <li>
              <n-link to="/policy-security/term-of-use">Chính sách bảo mật thông tin</n-link>
            </li>
            <li>
              <n-link to="/policy-security/refund-policy">Chính sách hoàn tiền</n-link>
            </li>
          </ul>
        </div>

        <div class="col-md-2 footer__col">
          <h2 class="footer__title">Hỗ trợ khách hàng</h2>
          <ul class="footer__menu">
            <li>
              <a href>
                Hotline:
                <span class="text-primary">1900 4625</span>
              </a>
            </li>
            <li>
              <a href>
                Email:
                <span class="text-primary">cskh@schoolly.vn</span>
              </a>
            </li>
            <li>
              <a
                href="https://hotro.schoolly.vn/hc/vi-vn/requests/new"
                target="_blank"
              >Gửi yêu cầu hỗ trợ</a>
            </li>
            <li>
              <a href="https://hotro.schoolly.vn/hc/vi-vn" target="_blank">Hướng dẫn sử dụng</a>
            </li>
          </ul>
        </div>

        <div class="col-md-3 footer__col">
          <h2 class="footer__title">tải ứng dụng trên điện thoại</h2>
          <div class="footer__download">
            <a href="https://play.google.com/store/apps/details?id=vn.famtech.schoolly" target="_blank" class="mb-15">
              <img src="/images/playstore.png" width="171" alt />
            </a>
            <a href="https://apps.apple.com/vn/app/schoolly/id1488579731" target="_blank">
              <img src="/images/appstore.png" width="176" alt />
            </a>
          </div>
        </div>
      </div>
      <div class="footer__copyright">
        <div class="container footer__copyright__container">
          <div class="footer__copyright__text">Copyright © 2020 Schoolly.vn</div>
          <ul class="footer__copyright__menu">
            <li>
              <a href="https://www.facebook.com/schoolly.vn/" target="_blank">
                <IconCircleFacebook />
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/channel/UCUmeD4gnn4zn_dTE-RB5gOQ" target="_blank">
                <IconCircleYoutube />
              </a>
            </li>
            <!-- <li>
              <a href>
                <IconCircleLinkin />
              </a>
            </li> -->
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import LogoGradient from "~/assets/svg/logo/logo-gradient.svg?inline";
import IconCircleFacebook from "~/assets/svg/v2-icons/circle-facebook.svg?inline";
import IconCircleYoutube from "~/assets/svg/v2-icons/circle-youtube.svg?inline";
import IconCircleLinkin from "~/assets/svg/v2-icons/circle-linkin.svg?inline";
export default {
  components: {
    LogoGradient,
    IconCircleFacebook,
    IconCircleYoutube,
    IconCircleLinkin
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/footer/_footer.scss";
</style>