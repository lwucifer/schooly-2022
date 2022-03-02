<template>
  <fragment>
    <div class="school-filter__form__item" style="min-width: 12rem">
      <app-vue-select
        class="app-vue-select w-100"
        v-model="province"
        :options="provinceOpts"
        label="name"
        placeholder="Tỉnh thành"
        :reduce="value => value"
        searchable
        @input="handleChangeProvince"
        :all-opt="allOpt"
      ></app-vue-select>
    </div>

    <div class="school-filter__form__item" style="min-width: 13.1rem">
      <app-vue-select
        class="app-vue-select w-100"
        v-model="district"
        :options="districtOpts"
        label="name"
        :reduce="value => value"
        placeholder="Quận huyện"
        searchable
        @input="handleChangedDistrict"
        :all-opt="allOpt"
      ></app-vue-select>
    </div>

    <div class="school-filter__form__item" style="min-width: 12rem">
      <app-vue-select
        class="app-vue-select w-100"
        v-model="ward"
        :options="wardOpts"
        label="name"
        :reduce="value => value"
        placeholder="Phường xã"
        searchable
        @input="handleChangedWard"
        :all-opt="allOpt"
      ></app-vue-select>
    </div>
  </fragment>
</template>

<script>
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";

export default {
  created() {
    this.$store.dispatch(
      `elearning/public/public-place/${actionTypes.ELEARNING_PUBLIC_PLACE.PROVINCE}`
    );
  },
  computed: {
    ...mapState("elearning/public/public-place", [
      "provinces",
      "districts",
      "wards"
    ]),

    provinceOpts() {
      return [ this.allOpt, ...this.provinces ]
    },
    districtOpts() {
      return [ this.allOpt, ...this.districts ]
    },
    wardOpts() {
      return [ this.allOpt, ...this.wards ]
    }
  },
  data() {
    return {
      province: null,
      district: null,
      ward: null,
      allOpt: {
        id: null,
        name: 'Tất cả',
        type: ''
      }
    };
  },
  methods: {
    handleChangeProvince(province) {
      this.province = province;
    },
    handleChangedDistrict(district) {
      this.district = district;
    },
    handleChangedWard(ward) {
      this.ward = ward;
    }
  },
  watch: {
    async province() {
      const province_id = get(this, "province.id", "");
      this.$emit("handleChangeProvince", this.province);
      const options = {
        params: {
          province_id
        }
      };
      await this.$store.dispatch(
        `elearning/public/public-place/${actionTypes.ELEARNING_PUBLIC_PLACE.DISTRICT}`,
        options
      );
      this.district = null;
      this.ward = null;
    },
    async district() {
      const district_id = get(this, "district.id", "");
      this.$emit("handleChangedDistrict", this.district);
      const options = {
        params: {
          district_id
        }
      };
      await this.$store.dispatch(
        `elearning/public/public-place/${actionTypes.ELEARNING_PUBLIC_PLACE.WARD}`,
        options
      );
      this.ward = null;
    },
    ward() {
      this.$emit("handleChangedWard", this.ward);
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/school/_school-filter.scss";
</style>
