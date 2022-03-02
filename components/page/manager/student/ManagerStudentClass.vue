<template>
  <div>
      <div class="filter-form">
        <!--Right form-->
        <div class="filter-form__right">
            <div class="filter-form__item filter-form__item--search">
            <app-input
                type="text"
                v-model="filter.query"
                placeholder="Nhập để tìm kiếm..."
                :size="'sm'"
                @input="handleSearch"
            />
            <button type="submit">
                <IconSearch width="15" height="15" />
            </button>
            </div>
        </div><!--End right form-->

        </div>
        <app-table
      :heads="heads"
      :pagination="pagination"
      @pagechange="onPageChange"
      :data="list"
      class="table__ManagerStudent"
    >
    </app-table>
  </div>
</template>

<script>
import IconFilter from "~/assets/svg/icons/filter.svg?inline"
    import IconSearch from "~/assets/svg/icons/search.svg?inline"
    import IconArrow from "~/assets/svg/icons/arrow.svg?inline"
    import { mapState } from "vuex"
    import * as actionTypes from "~/utils/action-types"
    // Import faked data
    import { STUDENTS } from "~/server/fakedata/elearning/manager"

    export default {

        components: {
            IconFilter,
            IconSearch,
            IconArrow
        },

        data() {
            return {
                tab: 1,
                heads: [
                    {
                        name: "name",
                        text: "Họ và tên",
                        sort: false
                    },
                    {
                        name: "class",
                        text: "Lớp",
                        sort: false
                    },
                    {
                        name: "percentagelearn",
                        text: "Tỷ lệ tham gia các các bài giảng và khóa học",
                        sort: true
                    },
                    {
                        name: "percentagecomplete",
                        text: "Tỉ lệ hoàn thành các bài giảng và khóa học",
                        sort: true
                    },
                    
                ],
                filter: {
                    type: null,
                    query: null
                },
                isAuthenticated: true,
                pagination: {
                    total: 15,
                    page: 6,
                    pager: 20,
                    total_elements: 55,
                    first: 1,
                    last: 10
                },
                list: STUDENTS,
            };
        },
        computed: {
            ...mapState("auth", ["loggedUser"])
        },

        methods: {
            onPageChange(e) {
                const that = this;
                that.pagination = { ...that.pagination, ...e };
                console.log(that.pagination);
            },
            submit() {
                console.log('[Component] Elearning exam: submitted')
            },
            handleChangedInput(val) {
                if (val !== null) {} else {}
                console.log('[Component] Elearning exam: changing input...', val)
            },
            handleFocusSearchInput() {
                console.log('[Component] Elearning exam: focus searching ')
            },
            handleBlurSearchInput() {
                console.log('[Component] Elearning exam: blur searching ')
            },
            handleSearch() {
                console.log('[Component] Elearning exam: searching')
            }
        }
    };
</script>

<style lang="scss">
 @import "~/assets/scss/components/manager/_manager-class.scss";
</style>