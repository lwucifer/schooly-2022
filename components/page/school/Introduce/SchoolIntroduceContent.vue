<template>
    <div class="wrap-intro-school">
        <div class="row">
            <div class="col-md-8">
                <div class="intro-text">
                    <div class="mb-4">
                        <app-button
                            square
                            color='white'
                            class="mr-4 btn-intro-school"
                            @click.prevent="tab='intro'"
                            :class="tab=='intro' ? 'active' :''"
                        >
                            Giới thiệu chung
                        </app-button>
                        <app-button
                            square
                            color='white'
                            class="btn-intro-school"
                            @click.prevent="tab='diagram'"
                            :class="tab=='diagram' ? 'active' :''"
                        >
                            Sơ đồ tổ chức
                        </app-button>
                    </div>
                    
                    <div v-if="tab=='intro'">
                        <div v-if="get(this,'organization.content','0')">
                            <div class="mt-2 mb-4">
                                <img  class="w-100" :src="get(this,'organization.cover') ? get(this,'organization.cover') : '~assets/images/tmp/img-intro.png'" alt="">
                            </div>

                            <div class="intro-text__content">
                                <div class="intro-text-school mt-4">{{get(this,'organization.title')}}</div>
                                <div class="mb-4" v-html="get(this,'organization.content')"></div>
                            </div>
                        </div>
                        <div v-else>
                            Chưa có thông tin
                        </div>
                    </div>
                    <div v-else-if="tab=='diagram'">
                        <SchoolIntrolSystem/>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <SchoolIntroSideMenu/>
            </div>
        </div>
    </div>
</template>

<script>
import SchoolIntroSideMenu from "~/components/page/school/Introduce/SchoolIntroSideMenu"
import SchoolIntrolSystem from "~/components/page/school/Introduce/SchoolIntrolSystem"
import { get } from "lodash"
export default {
    components:{
        SchoolIntroSideMenu,
        SchoolIntrolSystem
    },
    props:{
        organization:{
            type: Object,
            default: () => {}
        }
    },
    watch:{
        '$route.query'(){
            const type = this.$route.query.type
            if(type == 'organization'){
                this.tab = 'diagram'
            }
        }
    },
    data(){
        return{
            tab:'intro'
        }
    },
    methods:{
        get
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/school/_intro-school.scss";
@import "~assets/scss/components/school/_introduce-school.scss";
</style>