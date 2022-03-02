<template>
  <div class="edit-combine-exam">
    <span class="type-exam heading-5 font-weight-normal text-primary" v-if="fillterDataExamChoise.length > 0">
      I. Trắc nghiệm ({{ filterPointChoice }} điểm)
    </span>

    <!-- <v-popover class="d-inline" placement="bottom" trigger="click">
      <span class="text-primary" style="cursor: pointer">
        <IconSettings24px class="icon vertical-middle fill-opacity-1" />
        <IconArrowDropDown24px class="icon vertical-middle fill-opacity-1" />
      </span>

      <template slot="popover">
        <OptSelectPoint />
      </template>
    </v-popover> -->

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Nội dung</th>
            <th>Thể loại</th>
            <!-- <th>Cấp độ</th> -->
            <th>Điểm</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in fillterDataExamChoise" :key="index">
            <td>{{ index+1 }}</td>
            <td>Nội dung câu hỏi số {{ index+1 }} theo file</td>
            <td>Theo file</td>
            <!-- <td>Theo file</td> -->
            <td>{{pointMediumChoice.toFixed(2)}}</td>
            <!-- <td>
              <v-popover trigger="hover" placement="bottom">
                <span style="cursor: pointer">
                  <IconSettings24px
                    class="icon vertical-middle fill-opacity-1"
                  />
                  <IconArrowDropDown24px
                    class="icon vertical-middle fill-opacity-1"
                  />
                </span>

                <template slot="popover">
                  <a href="" class="body-2 text-base">
                    <IconFilter9Plus24px
                      class="mr-2 fill-warning vertical-middle"
                    />
                    Sửa điểm
                  </a>
                </template>
              </v-popover>
            </td> -->
          </tr>

        </tbody>
      </table>
    </div>

    <p class="mt-4 heading-5 font-weight-normal text-primary" v-if="fillterDataExamEssay.length > 0">
      II. Tự luận ({{ filterPointEssay }} điểm)
    </p>
    <div class="table-wrapper">
      <table>
        <tbody>
          <tr v-for="(item, index) in fillterDataExamEssay" :key="index">
            <td>{{ index+1 }}</td>
            <td>Nội dung câu hỏi số {{ index+1 }} theo file</td>
            <td>Theo file</td>
            <!-- <td>Theo file</td> -->
            <td>{{ item.points.toFixed(2) || 0 }}</td>
            <td>
              <v-popover trigger="hover" placement="bottom">
                <span style="cursor: pointer">
                  <IconSettings24px
                    class="icon vertical-middle fill-opacity-1"
                  />
                  <IconArrowDropDown24px
                    class="icon vertical-middle fill-opacity-1"
                  />
                </span>

                <template slot="popover">
                  <a @click.prevent="handleUpdatePoints(item)" class="body-2 text-base">
                    <IconFilter9Plus24px
                      class="mr-2 fill-warning vertical-middle"
                    />
                    Sửa điểm
                  </a>
                </template>
              </v-popover>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
		<app-modal v-if="isModal" :footer="false" :header="false" width="385px">
			<template #content>
				<OptSelectPoint
					:setwidth="333"
					:pointItem="pointItem"
					@handleCancel="handleCancel"
					@handleSavePoin="handleSavePoin"
				/>
			</template>
    </app-modal>
  </div>
</template>

<script>
import IconSettings24px from "~/assets/svg/v2-icons/settings_24px.svg?inline";
import IconArrowDropDown24px from "~/assets/svg/v2-icons/arrow_drop_down_24px.svg?inline";
import IconFilter9Plus24px from "~/assets/svg/v2-icons/filter_9_plus_24px.svg?inline";
import OptSelectPoint from "~/components/page/elearning/manager/bank/exams/OptSelectPoint";

import { mapActions, mapState, mapGetters } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { PAGE_SIZE } from "~/utils/constants";

export default {
  components: {
    IconSettings24px,
    IconArrowDropDown24px,
    IconFilter9Plus24px,
    OptSelectPoint,
	},
	
	props:{
		filterExam: {
			type: Array,
			default: []
		}
	},

	data() {
    return {
			isModal: false,
			pointItem: 0,
      questionId: "",
      checkTypeRandom: "",
		};
	},

	computed: {
		fillterDataExamChoise() {
      const tmp =
        (this.filterExam &&
          this.filterExam.filter(
            (item) => item.category == "CHOICE" || item.category == "MIX"
          )) ||
        [];
      return tmp;
    },

    fillterDataExamEssay() {
      const tmp =
        (this.filterExam &&
          this.filterExam.filter(
            (item) => item.category == "ESSAY" || item.category == "MIX"
          )) ||
				[];
				console.log('fillterDataExamEssay', tmp)
      return tmp;
    },

    filterPointChoice() {

      const tmp = 10 - this.filterPointEssay;
      return tmp;
    },

    filterPointEssay() {
      const data =
        this.filterExam.filter((item) => item.category == "ESSAY") || [];

      const tmp = data.reduce((sum, item) => sum + (item.points || 0), 0);
      return tmp;
    },

    pointMediumChoice(){
      const tmp = this.filterPointChoice/this.fillterDataExamChoise.length;
      return tmp
    },

	},

	methods: {
		getListQuestionToExam() {
      const queryExamEdit = {
        page: 1,
        size: PAGE_SIZE.MAXIMIZE,
        parent: "test",
        parent_id: this.$route.query ? this.$route.query.parent_id : "",
      };
      this.$store.dispatch(
        `elearning/manager/bank/exam/${actionTypes.BANK_EXAM.DETAIL_EXAM}`,
        queryExamEdit
      );
    },
    getDetailQuestionToexam(){
      const test_id = this.$route.query ? this.$route.query.parent_id : "";
      this.$store.dispatch(
        `elearning/manager/bank/exam/${actionTypes.BANK_EXAM.DETAIL_EXAM_EDIT}`,
        test_id
      )
    },
		
		handleCancel() {
      this.isModal = false;
		},

		handleUpdatePoints(data){
      this.isModal = true;
      this.checkTypeRandom = data.method;
      this.pointItem = data.points;
      this.questionId = data.id;
		},

		async handleSavePoin(point) {
      console.log("handleSavePoin", point);
      const queryUpdatePoin = {
        question_point: [
          {
            id: this.questionId,
            method: this.checkTypeRandom,
            is_update_total_point: false,
            point: point,
          },
        ],
        test_id: this.$route.query ? this.$route.query.parent_id : "",
      };
      const res = await this.$axios({
        url: `/elearning/teaching/question/essay/point`,
        method: "POST",
        data: queryUpdatePoin,
      });
      const result = res.data;
      this.isModal = false;
      if (result.success) {
        this.$toasted.success("Thành công");
        this.getListQuestionToExam();
        this.getDetailQuestionToexam()
      } else {
        this.$toasted.error(result.message);
      }
		},
		
	},

	
};
</script>

<style lang="scss">
@import "~assets/scss/components/elearning/manager/bank/exam/_table-edit-combine-exam.scss";
</style>
