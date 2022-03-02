<template>
  <app-table
    multipleSelection
    :heads="tableHeads"
    :data="filterListBankExam"
    :pagination="pagination"
    @pagechange="onPageChange"
    @selectionChange="selectionChange"
  >
    <td slot="cell(status)" slot-scope="{ row }">
      <IconDoneAll24px class="icon fill-primary subheading text-clickable" v-if="row.status === 1" />
      <IconEdit24px class="fill-warning text-clickable" width="18" v-else />
    </td>
    <td slot="cell(statistic)" slot-scope="{ row }" class="text-center">
      <span>{{ row.statistic && row.statistic.questions || 0 }}</span>
    </td>

    <td class="dont-break-out" slot="cell(type)" slot-scope="{ row }">
      <span class="nowrap">{{ row.type | exType2TxtExam }}</span>
    </td>

    <td class="dont-break-out" slot="cell(created)" slot-scope="{ row }">
      <span class="nowrap">{{ row.created | moment("DD-MM-YYYY") }}</span>
    </td>

    <template v-slot:actions="{ row }">
      <div class="table-expand">
        <a @click.prevent="detail(row)" class="link-gray">
          <IconVisibility24px class="icon fill-primary mr-2" />Xem chi tiết
        </a>

        <a @click="handleClickEdit(row)" class="link-gray">
          <IconEdit class="icon mr-2" style="fill: #9B51E0" />Chỉnh sửa
        </a>

        <a class="link-gray" @click.prevent="handleDeleteExamRow(row.id)">
          <IconDeleteOutline224px class="fill-secondary mr-2" />Xoá
        </a>
      </div>
    </template>
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
          name: "gradeName",
          text: "Khối",
        },
        {
          name: "subjectName",
          text: "Môn học",
        },
        {
          name: "type",
          text: "Thể loại",
        },
        {
          name: "statistic",
          text: "Số câu hỏi",
        },
        {
          name: "status",
          text: "Trạng thái",
        },
        {
          name: "created",
          text: "Ngày tạo",
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
    ...mapState(EXAM_STORE, ["getListBankExam"]),
    filterListBankExam() {
      const data =
        this.getListBankExam && this.getListBankExam.content
          ? this.getListBankExam.content
          : [];
      const dataMap = data.map((item) => {
        return {
          ...item,
          gradeName: item.grade && item.grade.name ? item.grade.id : "",
          subjectName:
            item.subject && item.subject.name ? item.subject.name : "",
        };
        return item;
      });
      return dataMap;
    },
    pagination() {
      const page =
        this.getListBankExam && this.getListBankExam.page
          ? this.getListBankExam.page
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
    ...mapActions(EXAM_STORE, ["bankExamDelete"]),

    detail(_row) {
      this.$emit("detail", _row);
    },

    handleClickEdit(item) {
      console.log("handleClickEdit", item);
      // this.$emit("handleClickEdit", item);
      if (item.statistic && item.statistic.questions > 0) {
        if (item.type == BANK_EXAM_TYPE.CHOICE) {
          this.$router.push(
            `/elearning/manager/bank/exams/choice-exam?category=${item.category}&type=${item.type}&id=${item.id}`
          );
        } else if (item.type == BANK_EXAM_TYPE.ESSAY) {
          this.$router.push(
            `/elearning/manager/bank/exams/essay-exam?category=${item.category}&type=${item.type}&id=${item.id}`
          );
        } else if (item.type == BANK_EXAM_TYPE.MIX) {
          this.$router.push(
            `/elearning/manager/bank/exams/combine-exam?category=${item.category}&type=${item.type}&id=${item.id}`
          );
        } else {
        }
      } else {
        this.$router.push(
          `/elearning/manager/bank/exams/exam-no-questions?category=${item.category}&type=${item.type}&id=${item.id}`
        );
      }
    },

    handleDeleteExamRow(id) {
      this.$emit("handleShowModalConfirm", id);
    },

    selectionChange(data) {
      let arrayId = data.map((item) => {
        return item.id;
      });
      this.$emit("selectionChange", arrayId);
    },

    onPageChange(e) {
      console.log("e", e);
      this.$emit("onPageChange", e);
    },
  },
};
</script>

<style></style>
