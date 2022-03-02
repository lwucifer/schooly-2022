<template>
  <div class="elearning-id-box body-3 text-dark">
    <div class="row">
      <div class="col-5">
        <img class="d-block w-100 mt-4" :src="get(info, 'cover_url.high', '/images/default-course-image.png')" alt />
      </div>
      <div class="col-7">
        <h5>{{ get(info, "name", "") }}</h5>
        <div class="d-flex-center mt-4 mb-4">
          <div class="d-flex-center box11 mr-3 color-white" v-if="get(info, 'elearning_price.free', false)" style="background: #14BFF4; border-radius:2px">
            <IconPricetagAlt class="mr-2 fill-white" width="16" height="16"/>
            <span>Miễn phí</span>
          </div>
          <div class="d-flex-center box11 mr-3 color-white" style="background: #E6A01E; border-radius:2px">
            <IconStarO class="mr-2 fill-white" width="16" height="16"/>{{ get(info, "rates.averageRate", 0) }}/5
          </div>
          <div class="d-flex-center box11 mr-3 color-white" style="background: #37A000; border-radius:2px">
            <IconUsd class="mr-2 fill-white" width="16" height="16"/>{{ get(info, "elearning_price.original_price", 0) }}đ
          </div>
        </div>
        <div class="views">
            <div class="row">
              <div class="col-6 mb-3">
                Ngày đăng: <b>{{ convertDate(get(info, "created", 0)) }}</b>
              </div>
              <div class="col-6 mb-3">
                Lượt xem: <b>{{ get(info, "total_view", 0) }}</b>
              </div>
              <div class="col-6 mb-3">
                Chế độ xem: 
                <b v-if="get(previewInfo, 'privacy', '') == 'PUBLIC'">Công khai</b>
                <b v-else>Riêng tư</b>
              </div>
              <div class="col-6 mb-3">
                Số học sinh tham gia: <b>{{ get(previewInfo, "participants", 0) }}</b>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconStarO from '~/assets/svg/icons/star-o.svg?inline';
import IconPricetagAlt from '~/assets/svg/design-icons/pricetag-alt.svg?inline';
import IconUsd from '~/assets/svg/icons/usd.svg?inline';

import { get } from "lodash";

export default {
  name: "E-learningDetail",

  props: {
    info: {},
    previewInfo: {}
  },

  components: {
    IconStarO,
    IconPricetagAlt,
    IconUsd
  },

  methods: {
    get,
    convertDate(time) {
      const date = new Date(time);
      var strTime =
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
      return strTime;
    },
  }
};
</script>
