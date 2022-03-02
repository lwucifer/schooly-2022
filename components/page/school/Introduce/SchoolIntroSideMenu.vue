<template>
  <div>
    <div class="news-intro-school">
      <div class="intro-text-school-menu-side">Tin tức mới</div>
        <div v-if="get(this,'schoolNewsest.content.length',0)">
          <div v-for="(item,index) in get(this,'schoolNewsest.content',[])" :key="index">
              <n-link  class="row mb-3 text-decoration-none" :to="params.organization_id+'?tab=news&news_id='+item.id">
                  <div class="col-md-5">
                      <img :height="73" :width="122" class="w-100" :src="get(item,'thumb','') ? get(item,'thumb','') : 'https://picsum.photos/122/73'">
                  </div>
                  <div class="col-md-7">
                    <div>
                        <p>{{ get(item,'title','') }}</p>
                        <p class="text-sub">{{ get(item,'updated','') | moment('DD/MM/YYYY') }}</p>
                    </div>
                  </div>
              </n-link>
          </div>
          <app-button
            square
            size="sm"
            class="px-4 mt-2 btn-get-more__school-detail"
            @click.prevent="changTab('news')"
          >
            Xem tất cả
          </app-button>
        </div>
        <div v-else>Chưa có thông tin</div>
    </div>
    <div class="notify-intro-school">
      <div class="intro-text-school-menu-side">Thông báo mới</div>
        <div v-if="get(this,'announcementsList.content.length',0)">
          <div v-for="(item,index) in get(this,'announcementsList.content',[])" :key="index">
              <n-link  class="row mb-5 text-decoration-none" :to="params.organization_id+'?tab=notify&announcement_id='+item.id">
                <div class="col-md-3">
                  <div class="circle-background">
                    <IconEmail24px class="fill-primary"/>
                  </div>
                </div>
                <div class="col-md-9">
                  <div>
                    <p>{{ get(item,'title','') }}</p>
                    <p class="text-sub">{{ get(item,'updated','') | moment('DD/MM/YYYY') }}</p>
                  </div>
                </div>
              </n-link>
          </div>
          <app-button
            square
            size="sm"
            class="px-4 btn-get-more__school-detail"
            @click.prevent="changTab('notify')"
          >
            Xem tất cả
          </app-button>
        </div>
        <div v-else>Chưa có thông tin</div>
    </div>
  </div>
</template>

<script>
import IconEmail24px from '~/assets/svg/v2-icons/email_24px.svg?inline';
import { mapState, mapActions } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import { moment } from "moment";
export default {
  components:{
    IconEmail24px
  },
  data(){
    return{
      params:{
        organization_id : this.$route.params.id,
        size:5,
        page:null

      }
    }
  },
  computed:{
    ...mapState("elearning/school/school-news", { schoolNewsest: "schoolNewsest" }),
    ...mapState("elearning/school/school-announcement", { announcementsList: "announcements" })
  },
  created(){
    this.fetchNewsestList(),
    this.fetchNotifyList()
  },
  methods:{
    ...mapActions("elearning/school/school-news", ["schoolNewsestList"]),
    async fetchNewsestList(){
      const data = this.params;
      await this.schoolNewsestList(data)
    },
    async fetchNotifyList(){
      const data = this.params;
      await this.$store.dispatch(
        `elearning/school/school-announcement/${actionTypes.SCHOOL_INFO.ANNOUNCEMENT}`,
          data
      );
    },
    changTab(val){
      this.$router.push({query: { tab: val}})
    },
    get
  }
}
</script>

<style lang="scss">
@import "~assets/scss/components/school/_introduce-school.scss";
.btn-get-more__school-detail{
    width: 13rem;
}
</style>