<template>
  <div>
      <div class="row">
        <div class="col-md-6 mb-3 mx-0" v-for="(item,index) in get(this,'schoolProfessional',[])" :key="index">
            <app-button
                class="btn-system-school"
                color="white"
                :class="changeContent==item.id ? 'change-tab' :''"
                @click="changeTab(item)"
            >
                <slot name="icon">
                    <IconArrowRight24px class="icon--btn icon--btn--pre"/>
                </slot>
                {{item.name}}
            </app-button>
        </div>
     </div>
     <div class="intro-system-detail-school" v-if="get(this,'schoolStaffs.content.length',0)">
         <div class="title-system-school">
             {{get(this,'nameSystem','')}}
         </div>
        <div class="content-system-school container">
            <div class="mb-4" v-for="(el,index) in get(this,'schoolStaffs.content',[])" :key="index">
                <n-link class="row" :to="'/public/profile/teacher?user_id='+ get(el,'staff_id','')">
                    <div class="col-md-2">
                        <img height="128" v-if="!!get(el,'avatar','')" v-lazy="get(el,'avatar','')"/>
                        <DefaultAvatar v-else width="100%" height="100%" />
                    </div>
                    <div class="col-md-10 d-flex flex-column justify-content-center">
                        <div class="d-flex mb-3">
                            <span class="title-left">Họ và tên</span>
                            <span>{{ get(el,'name','') }}</span>
                        </div>
                        <div class="d-flex mb-3">
                            <span class="title-left">Chức vụ</span>
                            <span >{{ get(el,'duty','') }}</span>
                        </div>
                        <div class="d-flex mb-3">
                            <span class="title-left">Điện thoại</span>
                            <span>{{ get(el,'phone','') }}</span>
                        </div>
                        <div class="d-flex mb-3">
                            <span class="title-left">Email</span>
                            <span>{{ get(el,'email','') }}</span>
                        </div>
                    </div>
                </n-link>
            </div>
        </div>
     </div>
     <div v-else>Chưa có thông tin</div>
  </div>
</template>

<script>
import IconArrowRight24px from '~/assets/svg/v2-icons/arrow_right_24px.svg?inline';
import DefaultAvatar from "~/assets/svg/images/default-avatar.svg?inline";


import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import {moment} from "moment";
export default {
    components:{
        IconArrowRight24px,
        DefaultAvatar
    },
    data(){
        return{
            changeContent:'',
            nameSystem:'',
            params:{
                school_id : this.$route.params.id,
                size: null,
                profession_id: null
            },
            pageLoading: true
        }
    },
    computed:{
        ...mapState("elearning/school/school-professional", { schoolProfessional: "schoolProfessional" }),
        ...mapState("elearning/school/school-staffs", { schoolStaffs: "schoolStaffs" })
    },
    created(){
        this.fetchlProfessionalList(),
        this.fetchlStaffsList()
    },
    methods:{
        changeTab(val){
            this.changeContent = val.id
            this.nameSystem = val.name
            this.params.profession_id = val.id;
            this.fetchlStaffsList();
        },
        async fetchlProfessionalList(){
    
            const data = { id : this.$route.params.id};
            await this.$store.dispatch(
            `elearning/school/school-professional/${actionTypes.SCHOOL_PROFESSIONAL.LIST}`,
                data
            );
            this.pageLoading = false;

        },
        async fetchlStaffsList(){
    
            const data = this.params;
            await this.$store.dispatch(
            `elearning/school/school-staffs/${actionTypes.SCHOOL_STAFFS.LIST}`,
                data
            );
            this.pageLoading = false;

        },
        get
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/school/_introduce-school.scss";
</style>