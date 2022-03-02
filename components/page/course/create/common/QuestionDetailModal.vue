<template>
	<app-modal
		centered
		title="Chi tiết câu hỏi"
		:component-class="{ 'modal--round': true, 'modal--exercise': true }"
		@close="$emit('close')"
	>
		<!-- Header -->
		<div slot="header">
			<div class="d-flex align-items-center justify-content-between">
				<h4 class="app-modal-title text-center w-100 pl-4">Chi tiết câu hỏi</h4>
				<button class="app-modal-close" @click="$emit('close')">
					<IconClose class="icon d-block fill-opacity-1" />
				</button>
			</div>
		</div>

		<!-- Content -->
		<div slot="content" v-if="loading">
			<vcl-list />
			<vcl-list />
		</div>
		<div slot="content" class="" v-else>
			<div class="detail-exercise-question">
				<div class="dtqe__general-info">
					<div class="dtqe__general-info-item">
						<p>Loại câu hỏi: <span class="text-primary heading-5 font-weight-medium">{{ get(this, 'content.type', '') | exType2TxtTypeQues }}</span></p>
					</div>
					<!-- <div class="dtqe__general-info-item">
						<p>Cấp độ câu hỏi: <span class="text-primary heading-5 font-weight-medium">{{ questionLevel | exType2TxtLevel }}</span></p>
					</div> -->
				</div>

				<!-- Question has method = RANDOM -->
				<div v-if="isRandom">
					<div class="dtqe__cat-section">
						<h5 class="dtqe__cat-section-title">Ngân hàng câu hỏi</h5>
						<div
							v-if="get(this, 'content.type') != EXAM_TYPE_QUESTION['WORD_MATCH']"
							class="dtqe__cat-section-content"
						>
							<p v-html="questionContent"></p>
						</div>
					</div>
				</div>

				<div v-else>
					<div class="dtqe__cat-section">
						<h5 class="dtqe__cat-section-title">Nội dung câu hỏi:</h5>
						<!-- All types except for WORD_MATCH -->
						<div
							v-if="get(this, 'content.type') != EXAM_TYPE_QUESTION['WORD_MATCH'] && get(this, 'content.type') != EXAM_TYPE_QUESTION['BY_FILE']"
							class="dtqe__cat-section-content"
						>
							<div>
								<v-popover
									class=""
									trigger="hover"
									placement="top"
									popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content tooltip p-0"
									:autoHide="false"
								>
									<div class="collapsed-content">
										<div v-html="questionContent"></div>
									</div>
									<template slot="popover" class="tooltip-detail">
										<div class="tooltip-limited-content">
											<div v-html="questionContent"></div>
										</div>
									</template>
								</v-popover>
							</div>
							<!-- <p v-html="questionContent"></p> -->
						</div>

						<div v-else-if="get(this, 'content.type') == EXAM_TYPE_QUESTION['BY_FILE']">
							<v-popover
								class=""
								trigger="hover"
								placement="top"
								popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content tooltip p-0"
								:autoHide="false"
							>
								<div class="collapsed-content">
									<p v-html="get(this, 'content.manual.content', '').replace('{}', get(this, 'content.index', ''))"></p>
								</div>
								<template slot="popover" class="tooltip-detail">
									<div class="tooltip-limited-content">
										<p v-html="get(this, 'content.manual.content', '').replace('{}', get(this, 'content.index', ''))"></p>
									</div>
								</template>
							</v-popover>
						</div>

						<!-- WORD_MATCH -->
						<div v-else-if="get(this, 'content.type') == EXAM_TYPE_QUESTION['WORD_MATCH']">
							<div class="mb-3">
								<v-popover
									class=""
									trigger="hover"
									placement="top"
									popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content tooltip p-0"
									:autoHide="false"
								>
									<div class="collapsed-content">
										<div v-html="questionContent"></div>
									</div>
									<template slot="popover" class="tooltip-detail">
										<div class="tooltip-limited-content">
											<p v-html="questionContent" class="mb-3"></p>
										</div>
									</template>
								</v-popover>
							</div>
							
							<div class="dtqe__word-match-question-content">
								<div class="row">
									<template
										v-for="(item, index) in get(this, 'answerMatchWord', [])"
									>
										<div
											class="col-md-8"
											:key="'QUESTION_CONTENT' + index"
										>
											<div
												class="d-flex dtqe__word-match-question-content--left-item"
												:class="{
													'pt-2': index == 0,
													'pb-2': index == (get(this, 'answerMatchWord.length', 0) - 1)
												}"
											>
												
												<div>
													<div class="d-flex">
														<span class="mr-1">{{ index + 1 }}.&nbsp;</span>
														<div>
															<v-popover
																class=""
																trigger="hover"
																placement="top"
																popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content tooltip p-0"
																:autoHide="false"
															>
																<div class="collapsed-content mr-3">
																	<div v-html="get(item, 'firstPharse.content', '')"></div>
																</div>
																<template slot="popover" class="tooltip-detail">
																	<div class="tooltip-limited-content">
																		<p v-html="get(item, 'firstPharse.content', '')" class="mb-3"></p>
																	</div>
																</template>
															</v-popover>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div
											class="col-md-4"
											:key="'QUESTION_ANS' + index"
										>
											<div
												class="d-flex dtqe__word-match-question-content--right-item"
												:class="{
													'pt-2': index == 0,
													'pb-2': index == (get(this, 'answerMatchWord.length', 0) - 1)
												}"
											>
												<span class="mr-1">{{ CHOICE_ALPHA[index] }}. </span>
												<div>
													<v-popover
														class=""
														trigger="hover"
														placement="top"
														popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content tooltip p-0"
														:autoHide="false"
													>
														<div class="collapsed-content mr-3">
															<div v-html="get(item, 'secondPharse.content', '')"></div>
														</div>
														<template slot="popover" class="tooltip-detail">
															<div class="tooltip-limited-content">
																<p v-html="get(item, 'secondPharse.content', '')" class="mb-3"></p>
															</div>
														</template>
													</v-popover>
												</div>
											</div>
										</div>
									</template>
								</div>
							</div>
						</div>
					</div>

					<div
						v-if="content.type != EXAM_TYPE_QUESTION['FILL_IN_BLANK'] && content.type != EXAM_TYPE_QUESTION['ESSAY']"
						class="dtqe__cat-section" 
					>
						<h5 class="dtqe__cat-section-title">Nội dung đáp án:</h5>
						<div class="dtqe__cat-section-content">
							<!-- Yes/No -->
							<div v-if="content.type == EXAM_TYPE_QUESTION['YES_NO']">
								<div class="d-flex">
									<div
										style="margin-right: 6rem;"
										v-for="(item, index) in get(this, 'content.answers', [])"
										:key="index"
									>
										<app-radio
											:name="'YES_NO'"
											:checked="get(item, 'selected', false)"
											disabled
											>
											<span class="d-flex">
												<span :class="{ 'text-primary': get(item, 'selected', false), 'font-weight-medium': item.correct }">
													{{ CHOICE_ALPHA[index] }}.&nbsp;
												</span>
												<p v-html="item.content"></p>
											</span>
										</app-radio>
									</div>
								</div>
							</div>

							<!-- Single Choice -->
							<div v-else-if="content.type == EXAM_TYPE_QUESTION['SINGLE_CHOICE']">
								<div class="">
									<div
										:class="{ 'mb-3': index < (content.answers.length - 1) }"
										v-for="(item, index) in get(this, 'content.answers', [])"
										:key="index"
									>
										<app-radio
											:name="'SINGLE_CHOICE'"
											:checked="get(item, 'selected', false)"
											disabled
										>
											<span class="d-flex">
												<span :class="{ 'text-primary': get(item, 'selected', false), 'font-weight-medium': get(item, 'selected', false) }">{{ CHOICE_ALPHA[index] }}.&nbsp;</span>
												<div>
													<v-popover
														class=""
														trigger="hover"
														placement="top"
														popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content tooltip p-0"
														:autoHide="false"
													>
														<div class="collapsed-content mr-3">
															<div v-html="get(item, 'content', '')"></div>
														</div>
														<template slot="popover" class="tooltip-detail">
															<div class="tooltip-limited-content">
																<p v-html="get(item, 'content', '')" class="mb-3"></p>
															</div>
														</template>
													</v-popover>
												</div>
											</span>
										</app-radio>
									</div>
								</div>
							</div>

							<!-- MULTI_CHOICE -->
							<div v-else-if="content.type == EXAM_TYPE_QUESTION['MULTIPLE_CHOICE']">
								<div class="">
									<div
										:class="{ 'mb-3': index < (get(this, 'content.answers.length', 0) - 1) }"
										v-for="(item, index) in get(this, 'content.answers', [])"
										:key="index"
									>
										<app-checkbox
											:checked="get(item, 'selected', false)"
											disabled
										>
											<span class="d-flex">
												<span :class="{ 'text-primary': get(item, 'selected', false), 'font-weight-medium': item.correct }">
													{{ CHOICE_ALPHA[index] }}.&nbsp;
												</span>
												<div>
													<v-popover
														class=""
														trigger="hover"
														placement="top"
														popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content tooltip p-0"
														:autoHide="false"
													>
														<div class="collapsed-content mr-3">
															<div v-html="get(item, 'content', '')"></div>
														</div>
														<template slot="popover" class="tooltip-detail">
															<div class="tooltip-limited-content">
																<p v-html="get(item, 'content', '')" class="mb-3"></p>
															</div>
														</template>
													</v-popover>
												</div>
											</span>
										</app-checkbox>
									</div>
								</div>
							</div>

							<!-- FILL_IN_BLANK -->
							<div v-else-if="content.type == EXAM_TYPE_QUESTION['FILL_IN_BLANK']">
								<div class="">
								</div>
							</div>

							<!-- WORD_CHOICE -->
							<div v-else-if="content.type == EXAM_TYPE_QUESTION['WORD_CHOICE']">
								<div class="">
									<div
										:class="{ 'mb-3': index < (get(this, 'content.answers.length', 0) - 1) }"
										v-for="(item, index) in content.answers"
										:key="index"
									>
										<app-radio
											:name="'WORD_CHOICE'"
											:checked="get(item, 'selected', false)"
											disabled
										>
												<span class="d-flex">
													<span :class="{ 'text-primary': get(item, 'selected', false), 'font-weight-medium': item.correct }">
														{{ CHOICE_ALPHA[index] }}.&nbsp;
													</span>
													<div>
														<v-popover
															class=""
															trigger="hover"
															placement="top"
															popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow tooltip-has-limited-content tooltip p-0"
															:autoHide="false"
														>
															<div class="collapsed-content mr-3">
																<div v-html="get(item, 'content', '')"></div>
															</div>
															<template slot="popover" class="tooltip-detail">
																<div class="tooltip-limited-content">
																	<p v-html="get(item, 'content', '')" class="mb-3"></p>
																</div>
															</template>
														</v-popover>
													</div>
												</span>
											</app-radio>
									</div>
								</div>
							</div>

							<!-- WORD_MATCH -->
							<div v-else-if="content.type == EXAM_TYPE_QUESTION['WORD_MATCH']">
								<div class="">
									{{ keyOfMatchWord }}
								</div>
							</div>

						</div>
					</div>

					<!-- ESSAY -->
					<div class="dtqe__cat-section" v-if="content.type == EXAM_TYPE_QUESTION['ESSAY']">
						<h5 class="dtqe__cat-section-title">Hình thức nộp bài:</h5>
						<div class="dtqe__cat-section-content">
							<div class="d-flex" style="margin-left: 4rem;">
								<div>
									<app-checkbox
										style="margin-right: 7.4rem;"
										:checked="
											get(content, 'submission_form', '') == SUBMISSION_METHODS['MANUAL'] ||
											get(content, 'submission_form', '') == SUBMISSION_METHODS['BOTH']"
										disabled
									>
										{{ `Nhập văn bản` }}
									</app-checkbox>
								</div>

								<div>
									<app-checkbox
										:checked="
											get(content, 'submission_form', '') == SUBMISSION_METHODS['UPLOAD'] ||
											get(content, 'submission_form', '') == SUBMISSION_METHODS['BOTH']"
										disabled
									>
										{{ `Tải file` }}
									</app-checkbox>								
								</div>

							</div>
						</div>
					</div>

					<div class="dtqe__cat-section mb-0 pb-0">
						<h5 class="dtqe__cat-section-title">Ghi chú:</h5>
						<div class="dtqe__cat-section-content">
							<p v-if="questionNote" v-html="questionNote"></p>

							<p v-else class="body-3 text-gray-3 py-3">Bạn không có ghi chú nào.</p>
						</div>
					</div>

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
import IconClose from "~/assets/svg/v2-icons/close_24px.svg?inline";
import { VclList } from "vue-content-loading";
import { mapState } from "vuex";
import { get, orderBy } from "lodash";
import {
	EXAM_TYPE_QUESTION,
	QUESTION_CREATATION_METHODS,
	SUBMISSION_METHODS
} from "~/utils/constants";
import parse from 'qs/lib/parse';
const CHOICE_ALPHA = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default {
	components: {
		IconWarning,
		IconPlaylistCheck,
		IconStarFilled,
		IconStarBorder,
		IconClose,
		VclList
	},
	props: {
		content: {
			type: Object,
			default: () => {}
		},
		loading: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			EXAM_TYPE_QUESTION: Object.freeze(EXAM_TYPE_QUESTION),
			QUESTION_CREATATION_METHODS: Object.freeze(QUESTION_CREATATION_METHODS),
			CHOICE_ALPHA: Object.freeze(CHOICE_ALPHA),
			SUBMISSION_METHODS: Object.freeze(SUBMISSION_METHODS)
		}
	},
	computed: {
		isFromManual() {
			return [
				QUESTION_CREATATION_METHODS['MANUAL'],
				QUESTION_CREATATION_METHODS['UPLOAD'],
				QUESTION_CREATATION_METHODS['IMPORT'],				
			].includes(get(this, 'content.method', ''));
		},
		isFromBank() {
			return [
				QUESTION_CREATATION_METHODS['SELECT'],
				QUESTION_CREATATION_METHODS['IPTEST'],
			].includes(get(this, 'content.method', ''));
		},
		isRandom() {
			return [
				QUESTION_CREATATION_METHODS['RANDOM']
			].includes(get(this, 'content.method', ''))
		},
		isQuestionWordChoice() {
			return get(this, 'content.type', '') == EXAM_TYPE_QUESTION['ESSAY'];
		},
		questionContent() {
			if (this.isFromManual) {
				let currentCnt = get(this, 'content.manual.content', '');
				let tmp = '';
				if (get(this, 'content.method', '') == QUESTION_CREATATION_METHODS['UPLOAD']) {
					if (!get(this, 'content.is_updated', false)) {
						tmp = currentCnt.replace('{}', get(this, 'content.range', ''));
						return tmp;
					}
				}
				if (get(this, 'content.type', '') == EXAM_TYPE_QUESTION['WORD_CHOICE']) {
					const reg = /\[.*?\]/gi;
					const blank = '......';
					tmp = currentCnt.replace(reg, blank);
					return tmp;
				}
				return currentCnt;
			}
			if (this.isFromBank) {
				return get(this, 'content.select.content', '');
			}
			if (this.isRandom) {
				return get(this, 'content', '')
			}
			return '';
		},
		questionLevel() {
			if (this.isFromManual) {
				return get(this, 'content.manual.level', '');
			}
			if (this.isFromBank) {
				return get(this, 'content.select.level', '');
			}
			if (this.isRandom) {
				return get(this, 'content.random.level', '')
			}
			return '';
		},
		questionNote() {
			if (this.isFromManual) {
				return get(this, 'content.manual.note', '');
			}

			if (this.isFromBank) {
				return get(this, 'content.select.note', '');
			}

			if (this.isRandom) {
				return get(this, 'content.random.note', '');
			}
			return '';
		},
		answerMatchWord() {
			let parsedData = [];
			if (get(this, 'content.type', '') == EXAM_TYPE_QUESTION['WORD_MATCH']) {
				const counter = this.firstPharseMatchWord.length;
				for(let i = 0; i < counter; i++) {
					parsedData.push({
						firstPharse: this.firstPharseMatchWord[i],
						secondPharse: this.secondPharseMatchWord[i]
					})
				}
			}
			return parsedData;
		},
		firstPharseMatchWord() {
			if (get(this, 'content.type', '') == EXAM_TYPE_QUESTION['WORD_MATCH']) {
				const keyContent = get(this, 'content.answers', []);
				let data = keyContent.filter(item => get(item, 'position', '') == -1 );
				return orderBy(data, ['index'], 'asc');
			}
			return [];
		},
		secondPharseMatchWord() {
			if (get(this, 'content.type', '') == EXAM_TYPE_QUESTION['WORD_MATCH']) {
				const keyContent = get(this, 'content.answers', []);
				let data = keyContent.filter(item => get(item, 'position', '') == 1 );
				return orderBy(data, ['index'], 'asc');
			}
			return [];
		},
		keyOfMatchWord() {
			let keyDetail = '';
			if (get(this, 'content.type', '') == EXAM_TYPE_QUESTION['WORD_MATCH']) {
				const firstPharseCounter = this.firstPharseMatchWord.length;
				const secondPharseCounter = this.secondPharseMatchWord.length;
				for(let i = 0; i < firstPharseCounter; i++) {
					const tmpFirst = this.firstPharseMatchWord[i];
					for(let j = 0; j < secondPharseCounter; j++) {
						const tmpSecond = this.secondPharseMatchWord[j];
						if (get(tmpFirst, 'matching_answer_id', '') == tmpSecond.id) {
							keyDetail += `${i + 1} - ${CHOICE_ALPHA[j]}` + `${i < (firstPharseCounter - 1) ? ', ' : '.'}`;
							break;
						}
					}
				}
			}
			return keyDetail;
		}
	},
	methods: {
		get,
		orderBy
	}
}
</script>
<style lang="scss">
</style>
