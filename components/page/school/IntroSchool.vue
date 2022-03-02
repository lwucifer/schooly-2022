<template>
    <div class="intro-school" id="introduction">
        <div class="row">
            <div class="col-12 col-md-6">
                <div class="intro-text">
                    <div class="intro-text__title">Giới thiệu</div>

                    <div v-if="get(this,'organization.content')">
                        <div>
                            <div class="intro-text__content" v-html="get(this,'organization.content')"></div>
                        </div>

                        <app-button
                            size="md"
                            @click="getDetail"
                            class="intro-text__btn text-white"
                            color="primary">Xem thêm</app-button>
                    </div>
                    <div v-else>
                        Chưa có thông tin
                    </div>
                </div>
            </div>

            <div class="col-12 col-md-6">
                <div class="intro-img">
                    <img :src="get(this,'organization.cover') ? get(this,'organization.cover') : '~assets/images/tmp/img-intro.png'" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { get } from "lodash"
export default {
    props:{
        organization:{
            type: Object,
            default:()=>{}
        }
    },
    computed:{
        shortContent(){

        }
    },
    methods:{
        getDetail(){
            this.$router.push({query: { tab: 'intro'}})
        },
        get
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/school/_intro-school.scss";
.intro-text__content{
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    padding: 0 !important;
}
</style>