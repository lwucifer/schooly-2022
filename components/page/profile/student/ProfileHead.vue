<template>
  <div>
    <div class="row">
      <div class="col-12 d-flex">
        <div class="mr-4">
          <app-avatar shape="square" :src="get(info, 'avatar.low')" :size="127"/>
        </div>
        <div class="d-flex flex-column justify-content-between">
          <div>
            <span class="h4">{{ get(info, 'name', '') }}</span>
          </div>
          <!--<div>-->
            <!--<span>{{ get(info, 'school_name', '') }}</span>-->
          <!--</div>-->
          
          <!--<div class="">-->
            <!--<app-stars class="d-inline-block mr-3" :stars="get(info, 'rate', 1)" :size="20"/>-->
            <!--<strong>{{ get(info, 'rate', 1) }}</strong>-->
            <!--<span> (2000)</span>-->
          <!--</div>-->
          <!--<div class="d-flex align-items-center">-->
            <!--<a href="#" class="text-gray mr-2">-->
              <!--<IconMessenger style="height: 1.65rem;"/>-->
            <!--</a>-->
            <!--<n-link class="d-flex align-items-center text-decoration-none" to='/'>-->
              <!--<span class="mr-2"><IconAngular style="height: 1.65rem;"/></span>-->
              <!--<span class="font-weight-semi-bold" style="font-size: 1.3rem;">E learning</span>-->
            <!--</n-link>-->
          <!--</div>-->
        </div>
      </div>
      <!--<div class="col-6">-->
        <!--<div class="teacher-profile__figure">-->
          <!--<div>-->
            <!--<div class="icon-label"><IconLaptop /></div>-->
            <!--<div class="figure-detail">-->
              <!--<p><span class="figure-num">{{ get(info, 'elearning_total', 0) | toThousandFilter }}</span></p>-->
              <!--<p><span class="figure-label">Bài giảng</span></p>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div>-->
            <!--<div class="icon-label"><IconCollectionBookmark /></div>-->
            <!--<div class="figure-detail">-->
              <!--<p><span class="figure-num">{{ get(info, 'elearning_total', 0) | toThousandFilter }}</span></p>-->
              <!--<p><span class="figure-label">Khóa học</span></p>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div>-->
            <!--<div class="icon-label"><IconPeople /></div>-->
            <!--<div class="figure-detail">-->
              <!--<p><span class="figure-num">{{ get(info, 'participant_total', 0) | toThousandFilter }}</span></p>-->
              <!--<p><span class="figure-label">Học sinh</span></p>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  import IconMessenger from "~/assets/svg/v2-icons/messenger.svg?inline";
  import IconAngular from "~/assets/svg/v2-icons/angularjs-fill.svg?inline";
  import IconLaptop from "~/assets/svg/v2-icons/laptop_chromebook_24px.svg?inline";
  import IconCollectionBookmark from "~/assets/svg/v2-icons/collections_bookmark_24px.svg?inline";
  import IconPeople from "~/assets/svg/v2-icons/people_24px.svg?inline";
  import { get } from "lodash"
  
  export default {
    components: {
      IconMessenger,
      IconAngular,
      IconLaptop,
      IconCollectionBookmark,
      IconPeople
    },
    props: {
      info: {
        type: Object,
        default: () => {}
      }
    },
    methods: {
      get
    }
  }
</script>

<style lang="scss">
  @import "~/assets/scss/components/profile/_profile-student-head.scss";
</style>