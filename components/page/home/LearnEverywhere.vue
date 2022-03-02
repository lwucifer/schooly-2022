<template>
  <div class="learn-everywhere">
    <div class="container">
      <h1 class="learn-everywhere-title text-center">Các tính năng nổi bật</h1>

      <div class="learn-everywhere-content">
        <div class="row">
          <div class="col-12 col-md-5 d-flex align-items-center">
            <div class="learn-everywhere-box pr-5">
              <h3 class="learn-everywhere-box__title">Phòng học Online</h3>

              <div class="border"></div>

              <div
                class="learn-everywhere-box__text"
              >Học sinh học tập và tương tác trực tiếp với giáo viên thông qua các phòng học online với nhiều công cụ hỗ trợ hiện đại như Livestream, Whiteboard, Chat, ...</div>

              <app-button
                nuxt
                tag="a"
                to
                size="md"
                color="default"
                class="text-primary"
                outline
              >Tham gia</app-button>
            </div>
          </div>

          <div class="col-12 col-md-7">
            <div class="learn-everywhere-box">
              <img src="/images/home/learn-everywhere-1.png" alt />
            </div>
          </div>

          <div class="col-12 col-md-5">
            <div class="learn-everywhere-box">
              <img src="/images/home/learn-everywhere-2.png" alt />
            </div>
          </div>

          <div class="col-12 col-md-7 d-flex align-items-center">
            <div class="learn-everywhere-box learn-everywhere-box--modifier">
              <h3 class="learn-everywhere-box__title">Mạng xã hội giáo dục</h3>

              <div class="border"></div>

              <div class="learn-everywhere-box__text">Mạng xã hội giúp học sinh, giáo viên và người dùng tiếp nhận thông tin từ nhà trường, kết bạn, trò chuyện và chia sẻ thông tin học tập hữu ích.</div>

              <app-button
                nuxt
                tag="a"
                to
                size="md"
                color="default"
                class="text-primary"
                outline
              >Kết nối</app-button>
            </div>
          </div>

          <div class="col-12 col-md-5 d-flex align-items-center">
            <div class="learn-everywhere-box pr-5">
              <h3 class="learn-everywhere-box__title">Kho học liệu đa dạng</h3>

              <div class="border"></div>

              <div class="learn-everywhere-box__text">Học tập dễ dàng, trực quan thông qua hệ thống các loại bài giảng, khóa học khác nhau như: Video, Scorm, Audio, PDF, Powerpoint, …</div>

              <app-button
                nuxt
                tag="a"
                to
                size="md"
                color="default"
                class="text-primary"
                outline
              >Vào học ngay</app-button>
            </div>
          </div>

          <div class="col-12 col-md-7">
            <div class="learn-everywhere-box">
              <img src="/images/home/learn-everywhere-3.png" alt />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/home/_learn-everywhere.scss";
</style>