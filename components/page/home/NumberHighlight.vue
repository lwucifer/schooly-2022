<template>
  <div class="number-hightlight">
    <div class="container">
      <div class="number-hightlight__title">Con số nổi bật</div>

      <div class="number-hightlight__content">
        <div class="row">
          <div class="col-12 col-md-3">
            <div class="box">
              <div class="box__img">
                <img src="/images/home/home.png" alt="" />
              </div>

              <div class="box__text">
                <div class="number">{{ schools }}+</div>
                <p>Trường học</p>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <div class="box">
              <div class="box__img">
                <img src="/images/home/book-open-2.png" alt="" />
              </div>

              <div class="box__text">
                <div class="number">{{ elearnings | numeralFormat }}+</div>
                <p>Bài giảng & Khóa học</p>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <div class="box">
              <div class="box__img">
                <img src="/images/home/users.png" alt="" />
              </div>

              <div class="box__text">
                <div class="number">{{ teachers | numeralFormat }}+</div>
                <p>Giáo viên</p>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <div class="box">
              <div class="box__img">
                <img src="/images/home/users.png" alt="" />
              </div>

              <div class="box__text">
                <div class="number">{{ students | numeralFormat }}+</div>
                <p>Học sinh</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { get } from "lodash";

export default {
  computed: {
    ...mapState("elearning/public/public-summary", ["statistic"]),
    schools() {
      return get(this, "statistic.total_schools", 0);
    },
    teachers() {
      return get(this, "statistic.total_teachers", 0);
    },
    students() {
      return get(this, "statistic.total_students", 0);
    },
    elearnings() {
      return get(this, "statistic.total_elearnings", 0);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/home/_number-highlight.scss";
</style>
