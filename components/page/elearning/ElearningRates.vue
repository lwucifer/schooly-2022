<template>
  <div class="elearning-rates">
    <div class="elearning-rates__top">
      <div class="row items-center">
        <div class="col-md-6 col-sm-12">
          <div class="text-center d-inline-block">
            <strong class="h1 color-primary">4.5</strong>
            <app-stars :stars="4" :size="16" class="mt-2 mb-2" />
            <p class="color-999">(15 người đánh giá)</p>
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <ElearningStars :five="50" :four="30" :three="10" :two="10" :one="0" />
        </div>
      </div>
    </div>

    <div class="elearning-rates__nav">
      <app-button square normal 
      :color="active == 0 ? 'primary' : 'gray'" 
      @click="active = 0"
      >Tất cả</app-button>

      <app-button square normal 
        :color="active == 5 ? 'primary' : 'gray'"
        @click="active = 5"
      >5 sao (500)</app-button>

      <app-button square normal 
      :color="active == 4 ? 'primary' : 'gray'" 
      @click="active = 4"
      >4 sao (400)</app-button>

      <app-button square normal 
      :color="active == 3 ? 'primary' : 'gray'" 
      @click="active = 3"
      >3 sao (10)</app-button>

      <app-button square normal 
      :color="active == 2 ? 'primary' : 'gray'" 
      @click="active = 2"
      >2 sao (2)</app-button>

      <app-button square normal 
      :color="active == 1 ? 'primary' : 'gray'" 
      @click="active = 1"
      >1 sao (0)</app-button>
    </div>

    <div class="elearning-rates__commnents">
      <ElearningRateComment :data="{}" v-for="(item, index) in  5" :key="index" />
      <app-pagination :pagination="pagination" @pagechange="onPageChange" class="mt-4 mb-3"/>
    </div>
  </div>
</template>
<script>
import ElearningStars from "~/components/page/elearning/ElearningStars";
import ElearningRateComment from "~/components/page/elearning/ElearningRateComment";

export default {
  components: {
    ElearningStars,
    ElearningRateComment
  },

  props: {
    rates: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      active: 0,
      pagination: {
        total_pages: 15,
        number: 6,
        size: 10,
      }
    };
  },

  methods: {
    onPageChange(e) {
      const that = this;
      that.pagination = {...that.pagination, ...e};
      console.log(that.pagination)
    }
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-rates.scss";
</style>