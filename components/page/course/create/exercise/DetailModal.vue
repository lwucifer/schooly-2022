<template>
	<app-modal
		centered
		:width="815"
		:title="get(dataRow, 'name', '')"
		:component-class="{ 'modal--round': true, 'modal--exercise': true }"
		@close="$emit('close')"
	>
		<div slot="content" v-if="loading">
			<vcl-list />
			<vcl-list />
		</div>
		<div slot="content" class="" v-else>
			<div v-if="get(dataRow, 'settings.required', false)" class="detail-exercise__doing-info">
				<div class="row">
					<div class="col-md-4">
						<div class="dtex__doing-info-item">
							Thời gian làm bài: <span class="text-primary font-weight-medium heading-5">&nbsp;{{ get(dataRow, 'settings.duration', 0) }} phút</span>
						</div>
					</div>
					<div class="col-md-4">
						<div class="dtex__doing-info-item">
							Điểm đạt: <span class="text-primary font-weight-medium heading-5">&nbsp;{{ get(dataRow, 'settings.passing_score', 0) }}/{{ get(dataRow, 'settings.points', 10) }}</span>
						</div>
					</div>
					<div class="col-md-4">
						<div class="dtex__doing-info-item">
							Số lần làm bài tối đa: <span class="text-primary font-weight-medium heading-5">&nbsp;{{ get(dataRow, 'settings.works', 0) }} lần</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Question list -->
			<div class="detail-exercise__question-list">
				<div class="dtex-question-list-title">
					<h6>Danh sách câu hỏi</h6>
					<div class="dtex-question-list-right">
						<p class="text-warning" v-if="!get(dataRow, 'status', true)">
						<IconWarning /> Bạn chưa hoàn thiện nội dung bài tập
						</p>
						<p v-else>
							<IconPlaylistCheck class="fill-primary" /> Bài tập hợp lệ
						</p>
						<p class="heading-5">
								<IconStarFilled v-if="get(dataRow, 'settings.required', false)"/>
								<IconStarBorder v-else />
								<span>{{ get(dataRow, 'settings.required', false) ? 'Bài tập bắt buộc' : 'Bài tập không bắt buộc' }}</span>
						</p>
					</div>
				</div>

				<div class="dtex-question-list-content">
					<div v-if="get(dataRow, 'type', '') == EXERCISE_TYPES['CHOICE'] || get(dataRow, 'type', '') == EXERCISE_TYPES['MIX']">
					<div class="mb-15">
						<p class="text-primary">
							<span v-if="get(dataRow, 'type', '') == EXERCISE_TYPES['MIX']">I.</span>&nbsp;Trắc nghiệm ({{ get(this, 'dataRow.choice_point', 0) }} điểm)
						</p>
					</div>
						<app-table
							:heads="heads"
							:needPagination="false"
							:data="filterBankExamChoice"
							class="mb-4"
							:ext-table-cls="{ 'table--nowrap-header': true }"
							:cols="[8,55,15,12,10]"
						>
							<template v-slot:cell(order)="{row}">
								<td>
                  <p class="text-center nowrap w-100">
                    {{ get(row, 'range', 'N/A') }}
                  </p>
								</td>
							</template>

							<template v-slot:cell(title)="{row}">
								<td>
									<div class="">
                    <v-popover
                      class=""
                      trigger="hover"
                      placement="top"
                      popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content tooltip p-0"
                      :disabled="isQuestionRandom(row)"
                      :autoHide="false"
                    >
                      <div class="collapsed-content">
                        <p v-html="get(row, 'parsed_content', '')"></p>
                      </div>
                      <template slot="popover" class="tooltip-detail">
                        <div class="tooltip-limited-content">
                          <p v-html="get(row, 'parsed_content', '')"></p>
                        </div>
                      </template>
                    </v-popover>
                  </div>
                </td>
							</template>

							<template v-slot:cell(type)="{row}">
								<td>
									<p class="nowrap">{{ row.type | exType2TxtTypeQues }}</p>
								</td>
							</template>

							<template v-slot:cell(level)="{row}">
								<td>
									<p class="nowrap">
										{{ row.level  | exType2TxtLevel }}
									</p>
								</td>
							</template>

							<template v-slot:cell(score)="{row}">
								<td>
									<p class="nowrap text-center w-100">{{ choiceQuestionScore }}</p>
								</td>
							</template>
						</app-table>
					</div>

					<div v-if="get(dataRow, 'type', '') == EXERCISE_TYPES['ESSAY'] || get(dataRow, 'type', '') == EXERCISE_TYPES['MIX']">
						<div class="mb-15">
							<p class="text-primary">
								<span v-if="get(dataRow, 'type', '') == EXERCISE_TYPES['MIX']">II.</span>&nbsp;Tự luận ({{filterPointEssay}} điểm)
							</p>
						</div>
						<app-table
							:heads="heads"
							:needPagination="false"
							:data="filterBankExamEssay"
							class="mb-4"
							:ext-table-cls="{ 'table--nowrap-header': true }"
							:cols="[8,55,15,12,10]"
						>
							<template v-slot:cell(order)="{row}">
								<td>
                  <p class="text-center nowrap w-100">
                    {{ get(row, 'range', 'N/A') }}
                  </p>
								</td>
							</template>

							<template v-slot:cell(title)="{row}">
								<td>
									<div class="">
                    <v-popover
                      class=""
                      trigger="hover"
                      placement="top"
                      popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content tooltip p-0"
                      :disabled="isQuestionRandom(row)"
                      :autoHide="false"
                    >
                      <div class="collapsed-content">
                        <p v-html="get(row, 'parsed_content', '')"></p>
                      </div>
                      <template slot="popover" class="tooltip-detail">
                        <div class="tooltip-limited-content">
                          <p v-html="get(row, 'parsed_content', '')"></p>
                        </div>
                      </template>
                    </v-popover>
                  </div>
								</td>
							</template>

							<template v-slot:cell(type)="{row}">
								<td>
									<p class="nowrap">{{ row.type | exType2TxtTypeQues }}</p>
								</td>
							</template>

							<template v-slot:cell(level)="{row}">
								<td>
									<p class="nowrap">
										{{ row.level  | exType2TxtLevel }}
									</p>
								</td>
							</template>

							<template v-slot:cell(score)="{row}">
								<td>
									<p class="nowrap text-center w-100">{{ row.points }}</p>
								</td>
							</template>
						</app-table>
					</div>

					<p v-if="get(exercise, 'required', false)" class="mb-1">
						<span class="heading-5 text-dark">Tổng điểm: </span>
						<span class="heading-5 text-primary">{{filterPoint}}/{{ get(this, 'dataRow.settings.points', 10)}}</span>
					</p>
					<p>
						<span v-if="get(this, 'dataRow.settings.required', false)" class="body-3">*Lưu ý: Một bài tập bắt buộc có kèm câu hỏi tự luận được tính là hợp lệ phải có tổng điểm các câu hỏi là 10, trong đó điểm thấp nhất của một câu hỏi là 0,25</span>
						<span v-else class="body-3">*Lưu ý: Một bài tập không bắt buộc không quy định số lượng câu hỏi và điểm từng câu hỏi, bạn có thể tạo tùy ý thích.</span>
					</p>
				</div>
			</div>
		</div>

		<div slot="footer">
			<p class="text-center">
				<app-button class="btn--semi-round" @click="$emit('close')">Đóng</app-button>
			</p>
		</div>
	</app-modal>
</template>

<script>
import IconWarning from "~/assets/svg/v2-icons/error_outline_24px.svg?inline";
import IconPlaylistCheck from "~/assets/svg/v2-icons/playlist_add_check_24px.svg?inline";
import IconStarFilled from "~/assets/svg/v2-icons/star2_24px.svg?inline";
import IconStarBorder from "~/assets/svg/v2-icons/star_border2_24px.svg?inline";
import { VclList } from "vue-content-loading";
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";
import {
	EXERCISE_TYPES,
	QUESTION_CREATATION_METHODS 
} from "~/utils/constants";
import { getDateTimeHH_MM_D_M_Y_DASH } from "~/utils/moment";
const EXAM_STORE = `elearning/manager/bank/exam`;
const QUESTION_CREATING_STORE = "elearning/creating/creating-question"; // to CRUD exercises into bank

export default {
	components: {
		IconWarning,
		IconPlaylistCheck,
		IconStarFilled,
		IconStarBorder,
		VclList
	},
	props: {
    dataRow: {
      type: Object,
      default: () => {},
		},
		loading: Boolean
  },
	data() {
		return {
			EXERCISE_TYPES: Object.freeze(EXERCISE_TYPES),
			QUESTION_CREATATION_METHODS: Object.freeze(QUESTION_CREATATION_METHODS),
			heads: [
        {
          name: "order",
					text: "STT",
					classTextCenter: true
        },
        {
          name: "title",
          text: "Nội dung",
        
        },
        {
          name: "type",
          text: "Thể loại",
        },
        {
          name: "level",
          text: "Cấp độ",
        },
        {
          name: "score",
					text: "Điểm",
					classTextCenter: true
        },
			],
		}
	},
	computed: {
		...mapState('elearning/create',{
			exercise: 'exercise'
		}),
		...mapGetters(QUESTION_CREATING_STORE, {
			filterBankExamChoice: 'choiceQuestionsOfBank',
			filterBankExamEssay: 'essayQuestionsOfBank',
			filterPointChoice: 'choiceQuestionsPointTotal',
			filterPointEssay: 'essayQuestionsPointTotal',
			filterPoint: 'allPointTotal'
		}),
		choiceQuestionScore() {
      const choiceCounter = this.filterBankExamChoice.length;
      return (get(this, 'dataRow.choice_point', 0)/choiceCounter).toFixed(2);
    }
	},
	methods: {
		isQuestionFromManual(question) {
			return [
				QUESTION_CREATATION_METHODS['MANUAL'],
				QUESTION_CREATATION_METHODS['UPLOAD'],
				QUESTION_CREATATION_METHODS['IMPORT'],				
			].includes(get(question, 'method', ''));
		},
		isQuestionFromBank(question) {
			return [
				QUESTION_CREATATION_METHODS['SELECT'],
				QUESTION_CREATATION_METHODS['IPTEST'],
			].includes(get(question, 'method', ''));
		},
		isQuestionRandom(question) {
			return [
				QUESTION_CREATATION_METHODS['RANDOM']
			].includes(get(question, 'method', ''))
		},
		get,
		getDateTimeHH_MM_D_M_Y_DASH
	}
}
</script>
<style lang="scss">
</style>
