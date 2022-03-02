<template>
  <div>
        <div class="news-intro-school">
            <div class="intro-text-school-menu-side">Tin xem nhiều</div>
            <div v-if=" get(this,'schoolNewsest.content.length',0)">
                <div v-for="(item,index) in get(this,'schoolNewsest.content',[])" :key="index">
                    <n-link  class="row mb-3 text-decoration-none" :to="params.organization_id+'?tab=news&news_id='+item.id">
                        <div class="col-md-5">
                            <img :height="73" class="w-100" :src="get(item,'thumb','https://picsum.photos/122/73')">
                        </div>
                        <div class="col-md-7">
                            <div>
                                <p>{{ get(item,'title','') }}</p>
                                <p class="text-sub">{{ get(item,'updated','') | moment('DD/MM/YYYY') }}</p>
                            </div>
                        </div>
                    </n-link>
                </div>
            </div>
            <div v-else>Chưa có thông tin</div>
        </div>
  </div>
</template>

<script>
import IconArrowRight24px from '~/assets/svg/v2-icons/arrow_right_24px.svg?inline';
import { mapState, mapActions } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import { moment } from "moment";
export default {
    components:{
        IconArrowRight24px
    },
    data(){
        return{
            btnActice: 1,
            params:{
                organization_id : this.$route.params.id,
                size:5,
                page:null

            }
        }
    },
    computed:{
        ...mapState("elearning/school/school-news", { schoolNewsest: "schoolNewsest" }),
    },
    methods:{
        ...mapActions("elearning/school/school-news", ["schoolNewsestList"]),
        async fetchNewsestList(){
            const data = this.params;
            await this.schoolNewsestList(data)
        },
        get
    },
    created(){
        this.fetchNewsestList()
    }
}
</script>

<style lang="scss">

</style>