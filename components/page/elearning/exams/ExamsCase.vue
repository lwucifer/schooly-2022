<template>
  <div class="exams-case">
      <div class="exams-case__content" v-if="tab =='APPROVED' || tab=='ENDED'">
          <div class="row">
              <div class="col-md-5 exams-case__text">
                  <div class="mb-3">Trạng thái: <span class="font-weight-medium" :class="get(this,'detail.enable',false) ? 'text-primary':'text-secondary'">{{ get(this,"detail.enable","") | getEnable }}</span></div>
                  <div>Hiển thị: 
                      <span class="text-primary font-weight-medium">{{ get(this,"detail.settings.privacy","") | getPrivacy }}</span>
                      <span class="text-primary font-weight-medium" v-if="get(this,'detail.settings.assigns','')"> - 
                          <span 
                            v-for="(item, index) in detail.settings.assigns"
                            :key="index"
                          >
                            {{item.name}}
                            <span v-if="index != detail.settings.assigns.length -1">,</span>
                          </span>
                      </span>
                  </div>
              </div>
              <div class="col-md-4">
                  <div class="mb-3">Số đề thi: <span class="text-primary font-weight-medium">{{get(this,"detail.exams","0")}}</span></div>
                  <div>Lệ phí: <span class="text-primary font-weight-medium">{{ get(this,"detail.settings.fees","0") | numeralFormat }}</span></div>
              </div>
              <div class="col-md-3">
                  <div class="mb-3">Số lượt thi: <span class="text-primary font-weight-medium">{{get(this,"detail.exams","0")}}</span></div>
                  <div>Số thí sinh tham gia: <span class="text-primary font-weight-medium">{{get(this,"detail.participants","0")}}/{{ get(this,"detail.settings.limit","0") }}</span></div>
              </div>
          </div>
      </div>
      <div class="exams-case__content" v-else>
          <div class="row">
              <div class="col-md-3">
                  <div class="mb-3">Số đề thi: <span class="text-primary font-weight-medium">{{get(this,"detail.exams","0")}}</span></div>
                  <div>Lệ phí: <span class="text-primary font-weight-medium">{{ get(this,"detail.settings.fees","0") | numeralFormat }}</span></div>
              </div>
              <div class="col-md-9">
                  <div class="mb-3">Hiển thị: 
                      <span class="text-primary font-weight-medium">{{ get(this,"detail.settings.privacy","") | getPrivacy }}</span>
                      <span class="text-primary font-weight-medium" v-if="get(this,'detail.settings.assigns','')"> - 
                          <span 
                            v-for="(item, index) in detail.settings.assigns"
                            :key="index"
                          >
                            {{item.name}}
                            <span v-if="index != detail.settings.assigns.length -1">,</span>
                          </span>
                      </span>
                  </div>
                  <div>Số thí sinh tối đa: <span class="text-primary font-weight-medium">{{ get(this,"detail.settings.limit","0") }}</span></div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import { get } from "lodash"
export default {
    filters:{
        getEnable(enable = ""){
            if(enable){
                return "Đang hoạt động"
            }
            return "Không hoạt động"
        },
        getPrivacy(str=""){
            if(str == "PUBLIC"){
                return "Công khai"
            }
            if(str == "ASSIGN_GROUP" || str == "ASSIGN_CLASS"){
                return "Chỉ định"
            }
        }
    },
    props:{
        tab:{
            type: String,
            default:"APPROVED"
        },
        detail:{
            type: Object,
            default:()=>{}
        }
    },
    methods:{
        get
    }
    
}
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/exams/_exams-case.scss";
</style>