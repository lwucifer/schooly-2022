<template>
  <div class="rank-item">
    <h6 class="rank-item__title">
      {{ title }}
    </h6>
    <div class="px-4">
      <hr/>
    </div>
    <div class="row" style="margin-right: -20px; margin-left: -20px;">
      <div
        class="col-md-6"
        v-for="i in 2"
      >
        <div class="row">
          <div
            class="rank-item__row"
            v-for="(item, index) in list.slice((i - 1)*halfList, halfList*i)"
            :key="index"
          >
            <div class="rank-item__list-item">
              <div>
                <span>{{(i - 1)*halfList + (index + 1)}}.</span>
                <span
                  v-for="(value, objKey, index) in matchedKey"
                  :key="index + 'title'"
                >
                <!--value (primary color)-->
                <span v-if="value">
                  <b class="text-primary">
                    {{ item[objKey]  }}
                  </b>
                  <span>{{ value }}</span>
                  </span><span
                      v-else>{{item[objKey]}}</span><span
                      v-if="index == 0"> - </span><span
                      v-else-if="index < (attrCount - 1)">, </span>
                  </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "RankItem",
    props: {
      title: {
        type: String,
        required: true
      },
      list: {
        type: Array,
        required: true
      },
      matchedKey: {
        type: Object,
        required: true
      }
    },
    computed: {
      attrCount: function () {
        return Object.keys(this.matchedKey).length
      },
      halfList: function () {
        return Math.ceil(this.list.length/2)
      },
      listLeng: function () {
        return this.list.length
      }
    },
    data() {
      return {}
    }
  }
</script>

<style lang="scss" scoped>
  @import "~/assets/scss/components/district-department/statistic/_rank-item.scss";
</style>