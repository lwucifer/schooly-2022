<template>
  <div class="select-point" :style="{ width: setwidth + 'px' }">
    <div class="select-point__heading">Chọn điểm</div>

    <div class="select-point__content">
      <span
        v-for="(item, index) in point"
        :key="index"
        :class="{ active: checkActive === index, 'mr-0': item % 2 == 0 }"
        @click="handleChoicePoin(item, index)"
        >{{ item }}</span
      >
    </div>

    <div class="select-point__btn text-center">
      <app-button
        color="default"
        class="text-secondary mr-3"
        outline
        @click.prevent="handleCancel"
        >Hủy</app-button
      >
      <app-button color="primary" :disabled="this.pointChoice > 0 ? false : true" @click.prevent="handleSavePoin"
        >Lưu</app-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const point = [];

    for (let i = 1; i <= 10 / 0.25; i++) {
      point.push(0.25 * i);
    }

    return {
      point,
      checkActive: "",
      pointChoice: 0
    };
  },

  computed: {
    fillterNumber() {
      let element = "";
      for (let index = 0; index <= 10; index++) {
        element += index;
      }

      return element;
    },
  },

  props: {
    setwidth: {
      type: Number,
      default: 318,
    },
  },

  methods: {
    handleChoicePoin(item, index){
      this.checkActive = index;
      this.pointChoice = item;
      console.log('handleChoicePoin', item, index)
    },

    handleCancel(){
      this.$emit('handleCancel');
    },

    handleSavePoin(){
      this.$emit('handleSavePoin', this.pointChoice)
    }
  },
};
</script>

<style lang="scss">
@import "~assets/scss/components/elearning/manager/bank/exam/_opt-select-point.scss";
</style>
