<template>
  <div>
    <div class="row">
      <div class="col-md-7 pr-5">
        <div class="point-choice">
          <app-button
            v-for="(n, index) in (counter - 1)"
            :key="index"
            class="mb-3"
            square
            :class="buttonCls(index*distance)"
            :disabled="(index * distance) > maxAvailble"
            @click="selectPoint(index*distance)"
          >
            {{ index * distance }}
          </app-button>
          <app-button
            class="w-100 text-primary"
            :disabled="scaleScore > maxAvailble"
            @click="selectPoint(scaleScore)"
          >
            {{ scaleScore }}
          </app-button>
        </div>
      </div>
      <div class="col-md-5">
        <div class="final-score">
          <p v-if="point != null" class="text-center">
            <span
              class="d-block h1 mb-3"
              :class="{ 'score--pass': point >= scoreToPass, 'score--fail': point < scoreToPass }"
            >
              {{ point + additionalScore }} Điểm
            </span>
            <span
              class="d-block h4"
              :class="{ 'score--pass': point >= scoreToPass, 'score--fail': point < scoreToPass }"
            >
              {{ point >= scoreToPass ? 'Đạt' : 'Chưa đạt'}}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PointChoice",
    props: {
      scoreToPass: {
        type: Number | String,
        required: true
      },
      maxAvailble: {
        type: String | Number,
        default: 10
      },
      scaleScore: {
        type: String | Number,
        default: 10
      },
      additionalScore: {
        type: String | Number,
        default: 0
      }
    },
    data() {
      return {
        distance: 0.25,
        point: null
      }
    },
    computed: {
      counter() {
        return (this.scaleScore/this.distance) + 1
      },
    },
    methods: {
      buttonCls(point) {
        return {
          'text-error': 0 <= point && point <= 3.75,
          'text-warning': 3.75 < point && point <= 7.75,
          'text-primary': point > 7.75,
          'actived': point === this.point
        }
      },
      selectPoint(point) {
        if (this.point == point) {
          this.point = null
        } else {
          this.point = point
        }
        this.$emit('changedPoint', this.point)
      }
    },
  }
</script>

<style scoped>

</style>