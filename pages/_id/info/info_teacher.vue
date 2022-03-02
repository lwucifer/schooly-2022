<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <ElearningSide active="1" :teacher="teacher" />
      </div>
      <div class="col-md-9">
        <div class="elearning-account__main box">
          <h5 class="color-primary mb-3 elearning-history__title">
            Thông tin tài khoản
            <hr class="mt-3" />
          </h5>
          <app-input labelBold labelFixed :value="name" label="Họ và tên" disabled />
          <app-input labelBold labelFixed :value="school" label="Trường" disabled />
          <app-input labelBold labelFixed :value="code" label="Mã giáo viên" disabled />
          <app-input labelBold labelFixed :value="specialize" label="Tổ chuyên môn" disabled />
          <app-input labelBold labelFixed :value="classPrimary" label="Lớp chủ nhiệm" disabled />
          <app-input
            labelBold
            labelFixed
            :value="classSecondary"
            label="Các lớp giảng dạy"
            disabled
          />

          <app-input labelBold labelFixed v-model="phone" label="Số điện thoại" />
          <app-input labelBold labelFixed v-model="email" label="Email" />
          <div class="app-inputs-inline">
            <app-input label="Giới tính" type="slot" labelBold labelFixed>
              <app-date-picker v-model="birthday" />
            </app-input>
            <app-input label="Giới tính" type="slot" labelBold>
              <app-select v-model="sex" :options="sexs" />
            </app-input>
          </div>

          <app-button color="red" square class="mt-3">
            <IconLock2 />
            <span class="ml-3">Thay đổi mật khẩu</span>
          </app-button>

          <div class="d-flex mt-5">
            <app-button class="ml-auto" square>Lưu thay đổi</app-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconFilter from "~/assets/svg/icons/filter.svg?inline";
import IconSearch from "~/assets/svg/icons/search2.svg?inline";
import IconLock2 from "~/assets/svg/icons/lock2.svg?inline";
import ElearningItem from "~/components/page/elearning/ElearningItem";
import ElearningSide from "~/components/page/elearning/ElearningSide";

import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";

export default {
  name: "E-learning",
  layout: 'account-info',

  components: {
    ElearningItem,
    IconSearch,
    IconFilter,
    IconLock2,
    ElearningSide
  },

  data() {
    return {
      isAuthenticated: true,
      teacher: {
        id: "1",
        name: "Savannah Mckinney",
        avatar: "https://picsum.photos/125/125"
      },
      phone: "0988777999",
      email: "hello@gmail.com",
      name: "Trần Văn Nam",
      classPrimary: "6A",
      classSecondary: "6A, 6B, 7A",
      specialize: "Toán",
      code: "NMJAS12A",
      school: "THCS Nguyễn Trãi",
      birthday: null,
      sex: "1",
      sexs: [
        { value: "1", text: "Nam" },
        { value: "2", text: "Nữ" }
      ]
    };
  },
  computed: {
    ...mapState("auth", ["loggedUser"])
  },

  watch: {},

  methods: {}
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-account.scss";
</style>