<template>
  <div>
      <app-modal
      centered
      :width="815"
      :component-class="{ 'invite-student-modal': true }"
      :footer="false"
      @close="$emit('close')"
      :title="get(this,'examDetail.name','')"
    >
        <div slot="content">
            <div class="d-flex justify-content-center mb-4 ">
                <div class="modal-exam__box mr-4">
                    <p>Thời gian làm bài: <span class="text-primary">{{get(this,'examDetail.settings.duration','0')}} phút</span></p>
                </div>
                <div class="modal-exam__box">
                    <p>Số lần làm bài tối đa: <span class="text-primary">{{get(this,'examDetail.settings.works','0')}}</span></p>
                </div>
            </div>
             <hr class="mb-4">
            <div class="d-flex align-items-center mb-4">
                <h5>Danh sách câu hỏi</h5>
                <div class=" d-flex  align-items-center justify-content-end ml-auto">
                    <div class="d-flex align-items-center mr-4">
                        <IconAlert class="mr-3 fill-yellow" />
                        <span class="color-yellow">Bạn chưa hoàn thiện nội dung đề thi</span>
                    </div>
                </div>
            </div>
            <div v-if="get(this,'examDetail.type','') == 'CHOICE' ||get(this,'examDetail.type','')=='MIX'">
                <p class="text-primary">Trắc nghiệm ({{get(this,'examDetail.choice_point','0')}} điểm)</p>
                <app-table
                    :heads="heads"
                    :data="questionChoice"
                    :needPagination="false"
                    class="mt-4"
                >
                <template v-slot:cell(content)="{row}">
                    <td v-if="row.method =='MANUAL'">
                        <span v-html="get(row,'manual.content','')"></span>
                    </td>
                    <td v-else-if="row.method =='SELECT' || row.method =='IPTEST'">
                        <span v-html="get(row,'select.content','')"></span>
                        <p v-if="get(row,'select.question_bank_name','')" class="mt-4 body-3 text-gray-3">{{get(row,'select.question_bank_name','')}}</p>
                    </td>
                    <td v-else-if="row.method =='RANDOM'">
                        <p>Câu hỏi ngẫu nhiên</p>
                        <div class="mt-4 d-flex align-items-center body-3 text-gray-3">
                            <IconRandom2 height="16" :weight="16" class="fill-999 mr-2"/>
                            {{get(row,'random.random','')}}/{{get(row,'random.question','')}} câu hỏi thuộc {{get(row,'random.question_bank_name','')}}
                        </div>
                    </td>
                </template>
                <template v-slot:cell(type)="{row}">
                    <td>
                        <span>{{ get(row,"category","") | exType2Txt }}</span>
                    </td>
                </template>
                <template v-slot:cell(level)="{row}">
                    <td v-if="row.method =='MANUAL'">
                        <span>{{ get(row,"manual.level","") | exType2TxtLevel }}</span>
                    </td>
                    <td v-else-if="row.method =='SELECT' || row.method =='IPTEST'">
                        <span>{{get(row,'select.level','') | exType2TxtLevel}}</span>
                    </td>
                    <td v-else-if="row.method =='RANDOM'">
                        <span>{{get(row,'random.level','') | exType2TxtLevel}}</span>
                    </td>
                </template>
                </app-table>
            </div>
            <div v-if="get(this,'examDetail.type','') == 'ESSAY' || get(this,'examDetail.type','') =='MIX'">
                <p class="text-primary mt-4">Tự luận ({{get(this,'examDetail.essay_point','0')}} điểm)</p>
                <app-table
                    :heads="heads"
                    :data="questionEssay"
                    :needPagination="false"
                    class="mt-4"
                >
                <template v-slot:cell(content)="{row}">
                    <td v-if="row.method =='MANUAL'">
                        <span v-html="get(row,'manual.content','')"></span>
                    </td>
                    <td v-else-if="row.method =='SELECT' || row.method =='IPTEST'">
                        <span v-html="get(row,'select.content','')"></span>
                        <p v-if="get(row,'select.question_bank_name','')" class="mt-4 body-3 text-gray-3">{{get(row,'select.question_bank_name','')}}</p>
                    </td>
                    <td v-else-if="row.method =='RANDOM'">
                        <p>Câu hỏi ngẫu nhiên</p>
                        <div class="mt-4 d-flex align-items-center body-3 text-gray-3">
                            <IconRandom2 height="16" :weight="16" class="fill-999 mr-2"/>
                            {{get(row,'random.random','')}}/{{get(row,'random.question','')}} câu hỏi thuộc {{get(row,'random.question_bank_name','')}}
                        </div>
                    </td>
                </template>
                <template v-slot:cell(type)="{row}">
                    <td>
                        <span>{{ get(row,"category","") | exType2Txt }}</span>
                    </td>
                </template>
                <!-- <template v-slot:cell(level)="{row}">
                    <td v-if="row.method =='MANUAL'">
                        <span>{{ get(row,"manual.level","") | exType2TxtLevel }}</span>
                    </td>
                    <td v-else-if="row.method =='SELECT' || row.method =='IPTEST'">
                        <span>{{get(row,'select.level','') | exType2TxtLevel}}</span>
                    </td>
                    <td v-else-if="row.method =='RANDOM'">
                        <span>{{get(row,'random.level','') | exType2TxtLevel}}</span>
                    </td>
                </template> -->
                </app-table>
            </div>
            <div class="mt-4">
                <p class="mb-1">
                    <span class="heading-5 text-dark">Tổng điểm: </span>
                    <span class="heading-5 text-primary">{{totalPoint}}/10</span>
                </p>
                    <p class="med__note">*Lưu ý: Một bài tập bắt buộc có kèm câu hỏi tự luận được tính là hợp lệ phải có tổng điểm các câu hỏi là 10, trong đó điểm thấp nhất của một câu hỏi là 0,25 *</p>
            </div>
            <div class="text-center mt-4">
                <app-button style="width:13rem" @click="$emit('close')">Đóng</app-button>
            </div>
        </div>
    </app-modal>
  </div>
</template>

<script>
import IconAlert from '~/assets/svg/v2-icons/alert/error_outline_24px.svg?inline';
import { mapActions, mapGetters, mapState } from "vuex";
import { get, filter } from "lodash"
import IconRandom2 from '~/assets/svg/v2-icons/random-2.svg?inline';
export default {
    components:{
        IconAlert,
        IconRandom2
    },
    props:{
        examDetail:{
            type: Object,
            default:()=>{}
        }
    },
    data(){
        return{
            heads:[
                {
                    name:"index",
                    text:"STT"
                },
                {
                    name:"content",
                    text:"Nội dung"
                },
                {
                    name:"type",
                    text:"Thể loại"
                },
                // {
                //     name:"level",
                //     text:"Cấp độ"
                // },
                {
                    name:"points",
                    text:"Điểm"
                }
            ],
        }
    },
    computed:{
        ...mapGetters("elearning/manager/bank/exam",["bankExamDetailContent","bankExamDetailPagination"]),
        totalPoint(){
            return get(this,'examDetail.essay_point','0') + get(this,'examDetail.choice_point','0');
        },
        questionChoice(){
            const choiceList = _.filter(this.bankExamDetailContent,(item)=>{
                return item.category == "CHOICE"
            })
            return choiceList;
        },
        questionEssay(){
            const essayList = _.filter(this.bankExamDetailContent,(item)=>{
                return item.category == "ESSAY"
            })
            return essayList;
        }
    },
    methods:{
        get,
        filter
    }
}
</script>

<style lang="scss">
.med__note{
    color: #999999;
    font-size: 1.3rem;
}
.modal-exam__box{
    background: #F9F9F9;
    border: 1px solid #E0E0E0;
    box-sizing: border-box;
    border-radius: 4px;
    padding:2rem;
}
</style>