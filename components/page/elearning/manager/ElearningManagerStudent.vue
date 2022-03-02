<template>
  <div class="elearning-manager-student__info">
    <h5 class="mb-3">{{ title }}</h5>
    <div class="row row-space-4">
      <div class="col-md-4 mb-3">
        <div class="item student-info">
          <p class="mb-2">
            <span>Họ và tên:</span>
            <strong>{{data.name}}</strong>
          </p>
          <p>
            <span>Lớp:</span>
            <strong>{{data.class}}</strong>
          </p>
        </div>
      </div>
      
      <div class="col-md-5 mb-3">
        <div class="item">
          <strong>Tiến độ học tập</strong>
          <div class="">
            <div class="mb-1 text-right">
              <span class="text-primary"> <b>{{data.percent}}%</b> </span>
            </div>
            <div class="app-percent">
              <div class="app-percent__chart" :style="'width:' + data.percent + '%'"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3 d-md-flex mb-3" style="align-items: center;">
        <div class="">
          <app-button
            color="error"
            size="sm"
            square
            normal
          >
            Cấm học sinh này
          </app-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppButton from "../../../common/button/AppButton";
export default {
  name: "E-learning",

  components: {AppButton},

  props: {
    title: {
      type: String,
      default: 'Thông tin học sinh'
    },
    data: {
      type: Object,
      required: false,
      default: () => {}
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/manager/_elearning-student.scss";
</style>