<template>
    <div>
        <div class="filter-form__item mb-4 ml-0">
            <app-button
                class="filter-form__item__btn m-0"
                color="pink"
                square
                :size="'sm'"
                :disabled="ids.length == 0"
                @click="$emit('delete', ids)"
                >
                <IconTrash class="fill-white" />
                <span class="ml-3">Xóa tài liệu</span>
            </app-button>
        </div>

        <app-table
            :heads="tableHeads"
            :data="myDocsContent"
            :pagination="myDocsPagination"
            :multiple-selection="true"
            :loading="loading"
            @pagechange="onPageChange"
            @selectionChange="selectRow"
            @sort="handleSort"
        >
            <template v-slot:cell(created)="{row}">
                <td>
                {{ get(row, 'created', '') | moment("DD/MM/YYYY") }}
                </td>
            </template>
            <template v-slot:cell(size)="{row}">
                <td>
                {{ get(row, 'size', '')}} <span>M</span>
                </td>
            </template>
            <template v-slot:cell(name)="{row}">
                <td>
                    <span style='max-width: 20rem; overflow: hidden; text-overflow: ellipsis; display: block' 
                        :title="get(row, 'name', '')">
                        {{ get(row, 'name', '') }}
                    </span>
                </td>
            </template>
            <template v-slot:cell(elearning_name)="{row}">
                <td style="max-width: 20rem; overflow: hidden; text-overflow: ellipsis">
                {{ getElearningName(row) }}
                </td>
            </template>
        </app-table>
    </div>
</template>

<script>
import IconTrash from "~/assets/svg/icons/trash-alt.svg?inline";
import { mapGetters, mapState, mapActions } from "vuex";
import { get } from 'lodash';

export default {
    data() {
        return {
            isExpand: null,
            ids: [],
            tableHeads: [
                {
                    name: "name",
                    text: "Tên file",
                },
                {
                    name: "subject_name",
                    text: "Môn học",
                },
                {
                    name: "elearning_name",
                    text: "Bài giảng/khoá học"
                },
                {
                    name: "size",
                    text: "Dung lượng"
                },
                {
                    name: "created",
                    text: "Ngày đăng"
                },
            ],
        }
    },

    components: {
        IconTrash
    },
    
    props: {
        loading: {
            type: Boolean,
            default: false
        },
    },

    computed: {
        ...mapState("elearning/teaching/teaching-documents",{
            documents: "documents"
        }),
        myDocsContent() {
            return get(this.documents, 'content', [])
        },
        myDocsPagination(e) {
            return get(this.documents, 'page', {})
        }
    },

    methods: {
        get,

        getElearningName(row) {
            if (get(row, 'elearning_name', false)) return get(row, 'elearning_name', '')
            if (get(row, 'class_ids', []).length > 0) {
                return get(row, 'class_ids[0].name', '')
            }
            if (get(row, 'group_ids', []).length > 0) {
                return get(row, 'group_ids[0].name', '')
            }
        },

        click() {
            for (const key in this.dataContest) {
                if (key.expand) {
                    this.isExpand = !this.isExpand
                }
            }
        },

        handleSort(e) {
            this.$emit("sort", e);
        },

        onPageChange(e) {
            this.$emit("pagechange", {page: e.number + 1, size: e.size});
        },

        selectRow(e) {
            this.ids = e;
        },
    },
}
</script>

<style>

</style>