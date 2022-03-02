<template>
    <app-table
        :heads="tableHeads"
        :data="myStudentExamsContent"
        :pagination="myStudentExamsPagination"
    >
        <tbody>
            <template v-for="(item, index) in myStudentExamsContent" >
                <tr :key="index" @click="isExpand = index">
                    <td>
                        <IconEllipse2 
                            class="vertical-middle mr-2 fill-primary" 
                            width="7px"
                            v-if="item.status == true"
                        />
                        <IconEllipse 
                            class="vertical-middle mr-2" 
                            width="7px"
                            v-else
                        />
                        {{item.name}} 
                        <IconKeyboardArrowUp24px class="icon ml-2 fill-primary" v-if="isExpand == index"/>
                        <IconKeyboardArrowDown24px class="icon ml-2" v-else/>
                    </td>

                    <td>{{ item.grades.name }}</td>
                    <td>{{ item.subjects.map(i => 
                        {
                            return ' ' + i.name
                        }).toString()}}
                    </td> 
                    <td>{{ item.tests }}</td>
                    <td>{{ item.completed }}</td>
                    <td class="text-warning">{{ item.pending }}</td>
                    <td>{{ item.todo }}</td>

                    <td>
                        <n-link :to="`/elearning/mycourses/contest/exam/${item.id}`" class="text-base"><IconArrowForwardIos24px class="icon"/></n-link>
                    </td>
                </tr>

                <tr :key="'expand' + index" v-if="isExpand == index">
                    <td colspan="8" style="background: #F9F9F9" class="px-5">
                        <div class="row">
                            <div class="col-4">
                                <p class="mb-3">Trạng thái: <span class="text-primary font-weight-medium">{{ item.status == true ? 'Kích hoạt' : 'Vô hiệu hóa' }}</span></p>
                                <p>Hiển thị: <span class="text-primary font-weight-medium">{{ item.settings.privacy == 'PUBLIC' ? 'Công khai' : 'Chỉ định' }}</span></p>
                            </div>
                            <div class="col-4">
                                <p class="mb-3">Bắt đầu: <span class="text-primary font-weight-medium">{{ item.settings.start_time | getDateTimeFullWeekDay | uppercaseFirst}}</span></p>
                                <p>Kết thúc: <span class="text-primary font-weight-medium">{{ item.settings.end_time | getDateTimeFullWeekDay  | uppercaseFirst}}</span></p>
                            </div>
                            <div class="col-4">
                                <p>Lệ phí: <span class="text-primary font-weight-medium">{{ item.settings.fees == 0 ? 'Miễn phí' : item.settings.fees }}</span></p>
                            </div>
                        </div>
                    </td>
                </tr>
            </template>
        </tbody>
    </app-table>
</template>

<script>
import IconKeyboardArrowDown24px from '~/assets/svg/v2-icons/keyboard_arrow_down_24px.svg?inline';
import IconEllipse from '~/assets/svg/icons/ellipse.svg?inline';
import IconKeyboardArrowUp24px from '~/assets/svg/v2-icons/keyboard_arrow_up_24px.svg?inline';
import IconEllipse2 from '~/assets/svg/icons/ellipse2.svg?inline';
import IconArrowForwardIos24px from '~/assets/svg/v2-icons/arrow_forward_ios_24px.svg?inline';

import { mapGetters } from "vuex";
import { DATETIME_FULL_WEEK_DAY } from "~/utils/config";


export default {
    data() {
        return {
            DATETIME_FULL_WEEK_DAY,
            isExpand: null,
            tableHeads: [
                {
                    name: "name",
                    text: "Tiêu đề kỳ thi",
                },
                {
                    name: "grades",
                    text: "Khối",
                },
                {
                    name: "subjecs",
                    text: "Môn học",
                },
                {
                    name: "numberExam",
                    text: "Số đề thi"
                },
                {
                    name: "marked",
                    text: "Đã chấm"
                },
                {
                    name: "notMark",
                    text: "Chưa chấm"
                },
                {
                    name: "doNot",
                    text: "Chưa làm"
                },
                {
                    name: "actions",
                    text: ""
                },
            ]
        }
    },

    components: {
        IconKeyboardArrowDown24px,
        IconEllipse,
        IconKeyboardArrowUp24px,
        IconEllipse2,
        IconArrowForwardIos24px
    },

    computed: {
        ...mapGetters("elearning/mycourses/my-exams", [
            "myStudentExamsContent",
            "myStudentExamsPagination"
        ]),
    },

    methods: {
        click() {
            for (const key in this.dataContest) {
                if (key.expand) {
                    this.isExpand = !this.isExpand
                }
            }
        }
    }
}
</script>

<style>

</style>