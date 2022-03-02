<template>
  <div class="wrap-courses-school">
      <div class="d-flex align-items-center">
          <h3 class="mr-3">{{ get(this,'titleSearch','') }}</h3>
          <p>(<strong>{{get(this,'lectures.total_elements',0)}}</strong> Bài giảng - <strong>{{get(this,'courses.total_elements',0)}}</strong> khóa học)</p>
      </div>
      <div class="d-flex mb-5 mt-3">
          <div class="filter-form-school">
              <filter-button
                :color="filterSelect ? 'primary': 'white'"
                @click="handleShowFilter"
                >
              </filter-button>
              <div class="d-flex w-100" v-if="filterSelect">
                <app-select
                    bordered
                    v-model="params.free"
                    @change="handleChangeFee"
                    :options="feeOpts"
                    placeholder="Học phí"
                    size="sm"
                />
                <app-select
                    bordered
                    v-model="params.duration"
                    @change="handleChangeTimes"
                    :options="timeOpts"
                    placeholder="Thời lượng"
                    size="sm"
                />
                <app-select
                    bordered
                    v-model="params.level_id"
                    @change="handleChangeLevel"
                    :options="levelOpts"
                    placeholder="Trình độ"
                    size="sm"
                
                />
              </div>
          </div>
          <div class="sort-courses-school">
              <span class="nowrap mr-3">Sắp xếp theo:</span>
              <app-select
                    class="app-vue-select w-100"
                    placeholder="Mới nhất"
                    has-border
                    :options="sortOpts"
                    @change="handleChangeSort"
                    size="sm"
                  />
          </div>
      </div>
      <div class="school-course-menu-tab d-flex">
        <span @click="changeTab('1')">
            <div
                :class="tab=='1' ?  'active' : ''"
            >
                BÀI GIẢNG
            </div>
        </span>
        <span  @click="changeTab('2')">
            <div 
                :class="tab=='2' ?  'active' : ''"
            >
                KHÓA HỌC
            </div>
        </span>
      </div>

        <div v-if="loadingElearning" class="container mt-6">
            <div class="row">
                <div v-for="i in 16" :key="i" class="col-md-3 mb-6">
                    <div class="bg-white py-6 px-3">
                        <VclList />
                    </div>
                </div>
            </div>
        </div>

      <div class="row list-course-school-search" v-else-if="tab=='1'">
        <div
            v-for="item in lectures && lectures.content || []"
            :key="item.id"
            class="col-md-3"
            >
                <CourseItem2 :item="item" :size="'sm'" />
        </div>
        <app-pagination
            :pagination="pagination"
            @pagechange="handleChangePage"
            class="mt-5 w-100"
        />
      </div>

      <div class="row list-course-school-search" v-else-if="tab=='2'">
        <div
          v-for="item in courses && courses.content || []"
          :key="item.id"
          class="col-md-3"
        >
            <CourseItem2 :item="item" :size="'sm'" />
        </div>
        <app-pagination
            :pagination="pagination"
            @pagechange="handleChangePage"
            class="mt-5 w-100"
        />
      </div>
  </div>
</template>

<script>
import CourseItem2 from "~/components/page/course/CourseItem2";
import { VclList } from "vue-content-loading";
import { mapState, mapActions } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { ELEARNING_TYPES, SUBJECT_CODE, SORT_ELEARNING} from "~/utils/constants";
import { get } from "lodash";
import { optionSelectSubject } from "~/utils/common";

export default {
    components:{
        CourseItem2,
        VclList
    },
    data(){
        return{
            tab:'1',
            filterSelect:false,
            pagination:{
                total_pages: 2,
                size: 10,
                total_elements: 20,
                first: 1,
                last: 0,
                number: 1
            },
            params: {
                school_id: null,
                subject: null,
                teacher: null,
                free: null,
                level_id: null,
                page: 1,
                size: 12,
                sort:null,
                status:"APPROVED"
            },
            loadingElearning: false,
            feeOpts: [
                { value: null, text: "Tất cả" },
                { value: true, text: "Miễn phí" },
                { value: false, text: "Có phí" }
            ],
            timeOpts: [
                { value: null, text: "Tất cả" },
                { value: "0h-1h", text: "0 - 1 giờ" },
                { value: "1h-2h", text: "1- 2 giờ" },
                { value: "2h-4h", text: "2 - 4 giờ" },
                { value: "4h+", text: "Trên 4 giờ" }
            ],
            sortOpts: [
                { value: SORT_ELEARNING.RELATED, text: "Liên quan nhất" },
                { value: SORT_ELEARNING.RATE, text: "Đánh giá cao nhất" },
                { value: SORT_ELEARNING.COMMENT, text: "Nhiều bình luận nhất" },
                { value: SORT_ELEARNING.NEWEST, text: "Mới nhất" },
                { value: SORT_ELEARNING.PRICE_ASC, text: "Giá thấp nhất" },
                { value: SORT_ELEARNING.PRICE_DESC, text: "Giá cao nhất" }
            ],
            titleSearch:null

        }
    },
    watch:{
      '$route.query'(){
          this.checkSearchByName()
        }
    },
    methods:{
        ...mapActions("elearning/create", {
            getLevels: "getLevels"
        }),
        async fecthLevelsBySchool(){
            const data = {
                school_id:this.$route.params.id
            }
            const rs = await this.getLevels(data)
            console.log('hello',rs)
        },
        handleShowFilter(){
            this.filterSelect =!this.filterSelect;
            this.resetData()
        },
        async fetchLectures(){
            this.params.school_id = this.$route.params.id
            this.updateFilter({elearning_type: "LECTURE"})
            const params = this.params
            const rs = await this.$store.dispatch(
                `elearning/school/school-elearning/${actionTypes.SCHOOL_ELEARNING.LIST}`,
                {
                    params
                }
            );
            this.updatePagination()
        },
        async fetchCourses(){
            try {
                this.loadingElearning = true
                this.params.school_id = this.$route.params.id
                this.updateFilter({elearning_type: "COURSE"})
                const params = this.params
                const rs = await this.$store.dispatch(
                    `elearning/school/school-elearning/${actionTypes.SCHOOL_ELEARNING.LIST}`,
                    {
                        params
                    }
                );
                this.updatePagination()
            } catch(error) {

            } finally {
                this.loadingElearning = false
            }
        },
        checkSearchByName(){
            const searchParams = this.$route.query.searchBy
            const subjectName = this.$route.query.name
            if(searchParams && subjectName){
                this.params.subject = subjectName;
                this.titleSearch = subjectName
            }
            if(searchParams == 'lecture'){
                this.tab = '1',
                this.titleSearch = 'Bài giảng và khóa học'
            }
            if(searchParams == 'course'){
                this.tab = '2'
                this.titleSearch = 'Bài giảng và khóa học'
            }
        },
        changeTab(val){
            this.tab = val;
            this.refreshData()
        },
        checktab(){
            if(this.tab == '1'){
                this.fetchLectures()
            }
            else{
                this.fetchCourses()
            }
        },
        updateFilter(data) {
            this.params = { ...this.params, ...data }
        },
        updatePagination() {
            let paginationData;
            if (this.tab == 1) {
                paginationData = this.lectures || {}
            } else if (this.tab == 2) {
                paginationData = this.courses || {}
            } else {
                paginationData = {}
            }
            this.pagination = {
                total_pages: get(paginationData, "total_pages", 0),
                size: get(paginationData, "size", 10),
                total_elements: get(paginationData, "total_elements", 0),
                first: get(paginationData, "first", false),
                last: get(paginationData, "last", false),
                number: get(paginationData, "number", 0)
            };
        },
        async refreshData() {
            this.params.page = 1
            this.fetchLectures()
            this.fetchCourses()
        },
        async resetData(){
            this.params.school_id= null;
            this.params.subject= null;
            this.params.teacher= null;
            this.params.free= null;
            this.params.level_id= null;
            this.params.page = 1;
            this.params.sort = null;
            this.checktab()
        },
        handleChangeFee(_newVal, _selectedVal) {
            console.log("[handleChangeFee]", _newVal, _selectedVal);
            this.updateFilter({ free: _newVal });
            this.refreshData()
        },

        handleChangeTimes(_newVal, _selectedVal) {
            console.log("[handleChangeTimes]", _newVal, _selectedVal);
            this.updateFilter({ duration: _newVal });
            this.refreshData();
        },

        handleChangeLevel(_newVal, _selectedVal) {
            console.log("[handleChangeLevel]", _newVal, _selectedVal);
            this.updateFilter({ level_id: _newVal });
            this.refreshData();
        },
        handleChangePage(val){
            console.log('dsad',val)
            this.updateFilter({ page: val.number + 1 });
            this.checktab()
        },
        handleChangeSort(val){
             console.log('change',val)
             this.updateFilter({ sort: val });
             this.refreshData();
        },
        get
    },
    computed:{
        ...mapState("elearning/school/school-elearning", {
            lectures: "lecture",
            courses: "course"
        }),
        ...mapState("elearning/create", {
            levels: "levels"
        }),
        levelOpts() {
            const alls = optionSelectSubject(this.levels);
            return alls.map(c => {
                return {
                value: c.id,
                text: c.name
                };
            });
        },
    },
    async created(){
        this.checkSearchByName();
        await Promise.all([
            this.fetchLectures(),
            this.fetchCourses()
        ]),
        this.fecthLevelsBySchool()
    },
}
</script>

<style lang="scss">
    .wrap-courses-school {
        .filter-form-school {
            .app-select {
                margin-right: 0.6rem;
                margin-left: 0.6rem;
            }
            .btn--filter {
                margin-right: 0.6rem;
            }
        }
        .course-item-2{
            border: 1px solid #E0E0E0;
        }
    }
</style>