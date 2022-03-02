<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <SchoolAccountSide active="1" />
      </div>
      <div class="col-md-9">
        <block-section title="Đổi mật khẩu" has-icon>
          <template v-slot:content>
            <change-pwd-form v-if="!checkModal" @success="success" />
            <update-pwd-noti v-else />
          </template>
        </block-section>
      </div>
    </div>
  </div>
</template>

<script>
import SchoolAccountSide from "~/components/page/school/SchoolAccountSide";
import ChangePwdForm from "~/components/page/account/forms/ChangePwd";
import UpdatePwdNoti from "~/components/page/account/noti/UpdatePwd";
import IconFilter from "~/assets/svg/icons/filter.svg?inline";
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";

export default {
  name: "E-learning",
  layout: "account-info",

  components: {
    IconFilter,
    SchoolAccountSide,
    ChangePwdForm,
    UpdatePwdNoti
  },

  data() {
    return {
      heads: [
        {
          name: "time",
          text: "Thời gian",
          sort: true
        },
        {
          name: "code",
          text: "Mã đơn hàng",
          sort: true
        },
        {
          name: "name",
          text: "Nội dung",
          sort: true
        },
        {
          name: "price",
          text: "Giá trị",
          sort: true
        },
        {
          name: "type",
          text: "Loại GD",
          sort: true
        },
        {
          name: "pay",
          text: "Phương thức thanh toán",
          sort: true
        }
      ],
      isAuthenticated: true,
      pagination: {
        total: 15,
        page: 6,
        pager: 20,
        total_elements: 55,
        first: 1,
        last: 10
      },
      isTeacher: true,
      time1: null,
      time2: null,
      opt: "",
      opts: [
        { value: "", text: "Tất cả các loại giao dịch" },
        { value: "1", text: "Theo trạng thái" },
        { value: "2", text: "Theo giá trị" }
      ],
      teacher: {
        id: "1",
        name: "Savannah Mckinney",
        avatar: "https://picsum.photos/125/125"
      },
      list: [
        {
          id: 1,
          name: "Mua khóa học Đại số 10",
          price: "2290000",
          code: "D88HKDKD",
          type: "Mua",
          pay: "Thanh toán Online",
          time: "16:50:30 20-11-2019"
        },
        {
          id: 1,
          name: "Bán khóa học Đại số 10",
          price: "2990000",
          code: "D88HKDKD",
          type: "Bán",
          pay: "Chuyển khoản",
          time: "06:50:30 10-11-2019"
        },
        {
          id: 1,
          name: "Mua khóa học Đại số 10",
          price: "2290000",
          code: "D88HKDKD",
          type: "Mua",
          pay: "Thanh toán Online",
          time: "16:50:30 20-11-2019"
        },
        {
          id: 1,
          name: "Bán khóa học Đại số 10",
          price: "2990000",
          code: "D88HKDKD",
          type: "Bán",
          pay: "Chuyển khoản",
          time: "06:50:30 10-11-2019"
        },
        {
          id: 1,
          name: "Mua khóa học Đại số 10",
          price: "2290000",
          code: "D88HKDKD",
          type: "Mua",
          pay: "Thanh toán Online",
          time: "16:50:30 20-11-2019"
        },
        {
          id: 1,
          name: "Bán khóa học Đại số 10",
          price: "2990000",
          code: "D88HKDKD",
          type: "Bán",
          pay: "Chuyển khoản",
          time: "06:50:30 10-11-2019"
        },
        {
          id: 1,
          name: "Mua khóa học Đại số 10",
          price: "2290000",
          code: "D88HKDKD",
          type: "Mua",
          pay: "Thanh toán Online",
          time: "16:50:30 20-11-2019"
        },
        {
          id: 1,
          name: "Bán khóa học Đại số 10",
          price: "2990000",
          code: "D88HKDKD",
          type: "Bán",
          pay: "Chuyển khoản",
          time: "06:50:30 10-11-2019"
        },
        {
          id: 1,
          name: "Mua khóa học Đại số 10",
          price: "2290000",
          code: "D88HKDKD",
          type: "Mua",
          pay: "Thanh toán Online",
          time: "16:50:30 20-11-2019"
        },
        {
          id: 1,
          name: "Bán khóa học Đại số 10",
          price: "2990000",
          code: "D88HKDKD",
          type: "Bán",
          pay: "Chuyển khoản",
          time: "06:50:30 10-11-2019"
        },
        {
          id: 1,
          name: "Mua khóa học Đại số 10",
          price: "2290000",
          code: "D88HKDKD",
          type: "Mua",
          pay: "Thanh toán Online",
          time: "16:50:30 20-11-2019"
        },
        {
          id: 1,
          name: "Bán khóa học Đại số 10",
          price: "2990000",
          code: "D88HKDKD",
          type: "Bán",
          pay: "Chuyển khoản",
          time: "06:50:30 10-11-2019"
        }
      ],
      checkModal: false
    };
  },
  computed: {
    ...mapState("auth", ["loggedUser"])
  },

  methods: {
    onPageChange(e) {
      const that = this;
      that.pagination = { ...that.pagination, ...e };
      console.log(that.pagination);
    },
    success(data) {
      this.checkModal = data;
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-history.scss";
</style>