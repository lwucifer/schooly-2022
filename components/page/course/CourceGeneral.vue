<template>
  <div class="box" id="tab1">
    <h5 class="mb-4 word-break-all">Lợi ích từ bài giảng</h5>
    {{ get(elearning_general, "benefit", "benefit") }}
    <!-- <div class="row">
      <div class="col-md-6 d-flex mb-15">
        <div class="icon mr-2">
          <IconSuccess width="16" height="16" />
        </div>
        <span>Bạn sẽ biết, học được các cách</span>
      </div>
      <div class="col-md-6 d-flex mb-15">
        <div class="icon mr-2">
          <IconSuccess width="16" height="16" />
        </div>
        <span
          >Có được Nguồn hàng kinh doanh khi liên hệ trực tiếp với người bán,
          nhà cung cấp</span
        >
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 d-flex mb-15">
        <div class="icon mr-2">
          <IconSuccess width="16" height="16" />
        </div>
        <span
          >Cách nghiên cứu, theo dõi và học hỏi từ chính Đối thủ cạnh tranh của
          bạn qua các công cụ Miễn phí</span
        >
      </div>
      <div class="col-md-6 d-flex mb-15">
        <div class="icon mr-2">
          <IconSuccess width="16" height="16" />
        </div>
        <span
          >Nhận diện chân dung khách hàng Tiềm năng của mình, cách xây dựng
          chính sách chăm sóc khách hàn</span
        >
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 d-flex mb-15">
        <div class="icon mr-2">
          <IconSuccess width="16" height="16" />
        </div>
        <span
          >Nhận diện chân dung khách hàng Tiềm năng của mình, cách xây dựng
          chính sách chăm sóc khách hàn</span
        >
      </div>
      <div class="col-md-6 d-flex mb-15">
        <div class="icon mr-2">
          <IconSuccess width="16" height="16" />
        </div>
        <span
          >Tự tin xây dựng đồng bộ các kênh Marketing (Facebook, Instagram,
          Zalo, Youtube, Email Marketing,...) qua từng bước chia sẻ chi
          tiết</span
        >
      </div>
    </div> -->
  </div>
</template>

<script>
import IconSuccess from "~/assets/svg/icons/success.svg?inline";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import { mapState } from "vuex";

export default {
  components: {
    IconSuccess
  },
  computed: {
    ...mapState("elearning/create", {
      elearning_general: "general"
    })
  },
  methods: {
    get
  },
  updated() {
    console.log("elearning_general", this.elearning_general);
  }
};
</script>
