<template>
  <app-table
    :heads="tableHeads"
    :data="filterListBankExam"
    :pagination="pagination"
    @pagechange="onPageChange"
    @selectionChange="selectionChange"
  >
    <td slot="cell(status)" slot-scope="{ row }">
      <IconDoneAll24px
        class="icon fill-primary subheading text-clickable"
        v-if="row.status === 1"
      />
      <IconEdit24px class="fill-warning text-clickable" width="18" v-else />
    </td>

    <td class="dont-break-out" slot="cell(type)" slot-scope="{ row }">
      <span class="nowrap">{{ row.type | exType2TxtTypeQues }}</span>
    </td>

    <td class="dont-break-out" slot="cell(created)" slot-scope="{ row }">
      <span class="nowrap">{{ row.created | moment("DD-MM-YYYY") }}</span>
    </td>

    <td class="text-right" slot="cell(action)" slot-scope="{ row }">
      <button @click="selectItem(row)" class="text-primary">Chọn</button>
    </td>
  </app-table>
</template>

<script>
import IconEdit24px from "~/assets/svg/v2-icons/edit_24px.svg?inline";
import IconDoneAll24px from "~/assets/svg/v2-icons/done_all_24px.svg?inline";
import IconVisibility24px from "~/assets/svg/v2-icons/visibility_24px.svg?inline";
import IconEdit from "~/assets/svg/icons/edit.svg?inline";
import IconDeleteOutline224px from "~/assets/svg/v2-icons/delete_outline2_24px.svg?inline";
import { mapActions, mapState, mapGetters } from "vuex";
import { BANK_EXAM_TYPE } from "~/utils/constants";
const EXAM_STORE = `elearning/manager/bank/exam`;

export default {
  data() {
    return {
      tableHeads: [
        {
          name: "name",
          text: "Tiêu đề",
        },
        {
          name: "grade",
          text: "Khối",
        },
        {
          name: "subject",
          text: "Môn học",
        },
        {
          name: "type",
          text: "Thể loại",
        },
        {
          name: "total_questions",
          text: "Số câu hỏi",
        },
        {
          name: "action",
          text: "",
        },
      ],
    };
  },

  components: {
    IconEdit24px,
    IconDoneAll24px,
    IconVisibility24px,
    IconEdit,
    IconDeleteOutline224px,
  },
  computed: {
    ...mapState(EXAM_STORE, ["getListBankQuestion"]),
    filterListBankExam() {
      const data =
        this.getListBankQuestion && this.getListBankQuestion.content
          ? this.getListBankQuestion.content
          : [];
      const dataMap = data.map((item) => {
        return {
          ...item,
          gradeName: item.grade && item.grade.name ? item.grade.name : "",
          subjectName:
            item.subject && item.subject.name ? item.subject.name : "",
        };
        return item;
      });
      return dataMap;
    },
    pagination() {
      const page =
        this.getListBankQuestion && this.getListBankQuestion.page
          ? this.getListBankQuestion.page
          : {};
      return {
        first: page ? page.first : false,
        last: page ? page.last : false,
        number: page ? page.number : 1,
        number_of_elements: page ? page.number_of_elements : 1,
        // page: page ? page.page : 1,
        size: page ? page.size : 1,
        total: page ? page.total : 1,
        total_elements: page ? page.total_elements : 1,
        total_pages: page ? page.total_pages : 1,
      };
    },
  },

  methods: {
    handleDeleteExamRow(id) {
      this.$emit("handleShowModalConfirm", id);
    },

    selectionChange(data) {
      console.log("selectionChange", data);
      this.$emit("selectionChange", data);
    },

    onPageChange(e) {
      console.log("e", e);
      this.$emit("onPageChange", e);
    },
    selectItem(item) {
      console.log('[Select Item]', item);
    }
  },
};
</script>

<style></style>
