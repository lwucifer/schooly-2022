<template>
  <div>
      <div class="d-flex mb-4">
        <h3>Môn học</h3>
        <div class="ml-auto d-flex">
            <div class="swiper-pagination eh-subject-pagination"></div>
        </div>
      </div>
      <AppCarouseSchool
        :options="{ slidesPerView: 6, spaceBetween: 22, preventClicksPropagation: false,pagination:true }"
          v-if="get(this,'schoolSubjects.length',0)"
        > 
         <template slot="default" slot-scope="{ classes }">
             <div v-for="(item,index) in schoolSubjects" :key="index" :class="classes">
                <div class="subject-item" @click="$emit('showSearch',item)">
                    <img :height="50" :width="50" v-lazy="get(item,'logo','')" v-if="get(item,'logo','')"/>
                    <IconDefaultSubject v-else/>
                    <p class="mt-2">{{item.name}}</p>
                </div>
            </div>
         </template>
      </AppCarouseSchool>
      <div v-else>Chưa có thông tin</div>
  </div>
</template>

<script>
import { get } from "lodash";
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { SUBJECT_CODE } from "~/utils/constants";
import AppCarouseSchool from "~/components/page/school/AppCarouseSchool";

const IconDefaultSubject = () =>
  import("~/assets/svg/icons/default-subject.svg?inline");

import IconChevronLeft24px from '~/assets/svg/v2-icons/chevron_left_24px.svg?inline';
import IconChevronRight24px from '~/assets/svg/v2-icons/chevron_right_24px.svg?inline';
export default {
    components:{
        IconChevronLeft24px,
        IconChevronRight24px,
        AppCarouseSchool,
        IconDefaultSubject
    },
  
  computed:{
      ...mapState("elearning/school/school-subjects", {schoolSubjects:"schoolSubjects"}),
  },
  created(){
      this.fetchSubject();
  },
  methods:{
      async fetchSubject(){
        const data = {id : this.$route.params.id}
        const res = await this.$store.dispatch(
          `elearning/school/school-subjects/${actionTypes.SCHOOL_SUBJECTS.LIST}`,data
        );
      },
      get
  }
}
</script>

<style lang="scss" scoped>

</style>