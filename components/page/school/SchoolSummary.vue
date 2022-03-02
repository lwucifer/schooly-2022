<template>
  <div class="school-summary" id="homepage">
      <div class="school-summary__cover">
        <img :src="get(school, 'cover.high', '')" alt="">
      </div>

      <div class="school-summary__avatar">
         <img :src="get(school, 'avatar.medium', '')" alt="">
      </div>

      <div class="school-summary__info">
        <h4 class="text-primary">{{ get(school, "name", "") }}</h4>

        <div class="row">
          <div class="col-6 info-item mb-3">
              <IconLocation class="mr-2" width="14px" height="14px"/> {{ get(school, "address", "") }}
          </div>

          <div class="col-6 info-item mb-3">
            <a href="mailto:schoolly@gmail.com">
              <IconEmail class="mr-2" width="14px" height="14px"/> {{ get(school, "email", "") }}
            </a>
          </div>

          <div class="col-6 info-item">
            <a href="tel:+0906771634">
              <IconPhone class="mr-2" width="14px" height="14px"/> {{ get(school, "phone", "") }}
            </a>
          </div>

          <div class="col-6 info-item">
            <IconCode class="mr-2" width="14px" height="14px"/> {{ get(school, "code", "") }}
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import IconLocation from "~/assets/svg/v2-icons/location_on_24px.svg?inline";
import IconUser from "~/assets/svg/icons/user.svg?inline";
import IconPhone from "~/assets/svg/v2-icons/local_phone_24px.svg?inline";
import IconEmail from "~/assets/svg/v2-icons/email_24px.svg?inline";
import IconCode from "~/assets/svg/v2-icons/insert_link_24px.svg?inline";
import { get } from "lodash";
import numeral from "numeral";

export default {
  components: {
    IconLocation,
    IconCode,
    IconPhone,
    IconEmail,
    IconUser,
  },

  props: {
    school: {
      type: Object,
      required: true,
      default: () => {},
    },
  },

  data() {
    return {
      lengthDescription: 300,
    };
  },

  computed: {
    description() {
      if (this.load_more) {
        return get(this, "school.description", "").substring(
          0,
          this.lengthDescription
        );
      }
      return get(this, "school.description", "");
    },
    load_more() {
      return get(this, "school.description.length", 0) > this.lengthDescription;
    },
  },

  methods: {
    get,
    numeral,
    handleLoadMore() {
      this.lengthDescription = get(this, "info.description.length", 0);
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/school/_school-summary.scss";
</style>
