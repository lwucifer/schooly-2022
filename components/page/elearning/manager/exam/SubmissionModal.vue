<template>
	<app-modal
		centered
		title="Xem câu trả lời của học sinh"
		:component-class="{ 'modal--round': true, 'modal--exercise': true, 'modal--submission-elearning': true }"
		:footer="false"
		@close="$emit('close')"
	>
		<!-- Header -->
		<div slot="header">
			<div class="d-flex align-items-center">
				<h4 class="app-modal-title w-100 pl-4">Xem câu trả lời của học sinh</h4>
				<button class="app-modal-close" @click="$emit('close')">
					<IconClose class="icon d-block fill-opacity-1" />
				</button>
			</div>
		</div>

		<!-- Content -->
		<div slot="content" v-if="loading">
			<div class="bg-white px-4 py-4">
				<vcl-list />
				<vcl-list />
			</div>
		</div>
		<div slot="content" class="" v-else>
			<div class="modal--submission-elearning-content">
				<div class="submission-detail detail-exercise-question">
					<essay-answer
						v-if="get(this, 'currentQuestion.type', '') == EXAM_TYPE_QUESTION['ESSAY']"
						:content="currentAnswer"
						:question="currentQuestion"
					>
					</essay-answer>

					<true-false-answer
						v-if="get(this, 'currentQuestion.type', '') == EXAM_TYPE_QUESTION['YES_NO']"
						:content="currentAnswer"
						:question="currentQuestion"
					>
					</true-false-answer>

					<fillin-blank-answer
						v-if="get(this, 'currentQuestion.type', '') == EXAM_TYPE_QUESTION['FILL_IN_BLANK']"
						:content="currentAnswer"
						:question="currentQuestion"
					>
					</fillin-blank-answer>

					<single-choice-answer
						v-if="get(this, 'currentQuestion.type', '') == EXAM_TYPE_QUESTION['SINGLE_CHOICE']"
						:content="currentAnswer"
						:question="currentQuestion"
					>
					</single-choice-answer>

					<multi-choice-answer
						v-if="get(this, 'currentQuestion.type', '') == EXAM_TYPE_QUESTION['MULTIPLE_CHOICE']"
						:content="currentAnswer"
						:question="currentQuestion"
					>
					</multi-choice-answer>

					<choice-word-answer
						v-if="get(this, 'currentQuestion.type', '') == EXAM_TYPE_QUESTION['WORD_CHOICE']"
						:content="currentAnswer"
						:question="currentQuestion"
					>
					</choice-word-answer>

					<question-join-answer
						v-if="get(this, 'currentQuestion.type', '') == EXAM_TYPE_QUESTION['WORD_MATCH']"
						:content="currentAnswer"
						:question="currentQuestion"
					>
					</question-join-answer>
				</div>
				<div slot="footer">
					<p class="text-center">
						<app-button class="btn--semi-round" @click="$emit('close')">Đóng</app-button>
					</p>
				</div>
			</div>
		</div>
	</app-modal>
</template>

<script>
import EssayAnswer from "~/components/page/elearning/manager/exam/answers/EssayAnswer";
import TrueFalseAnswer from "~/components/page/elearning/manager/exam/answers/TrueFalseAnswer";
import FillinBlankAnswer from "~/components/page/elearning/manager/exam/answers/FillinBlankAnswer";
import MultiChoiceAnswer from "~/components/page/elearning/manager/exam/answers/MultiChoiceAnswer";
import SingleChoiceAnswer from "~/components/page/elearning/manager/exam/answers/SingleChoiceAnswer";
import ChoiceWordAnswer from "~/components/page/elearning/manager/exam/answers/ChoiceWordAnswer";
import QuestionJoinAnswer from "~/components/page/elearning/manager/exam/answers/QuestionJoinAnswer";

import IconWarning from "~/assets/svg/v2-icons/error_outline_24px.svg?inline";
import IconPlaylistCheck from "~/assets/svg/v2-icons/playlist_add_check_24px.svg?inline";
import IconStarFilled from "~/assets/svg/v2-icons/star2_24px.svg?inline";
import IconStarBorder from "~/assets/svg/v2-icons/star_border2_24px.svg?inline";
import IconClose from "~/assets/svg/v2-icons/close_24px.svg?inline";
import { VclList } from "vue-content-loading";
import { mapState } from "vuex";
import { get } from "lodash";
import {
	EXAM_TYPE_QUESTION,
	QUESTION_CREATATION_METHODS,
	SUBMISSION_METHODS
} from "~/utils/constants";
import parse from 'qs/lib/parse';
const CHOICE_ALPHA = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default {
	components: {
		EssayAnswer,
		TrueFalseAnswer,
		FillinBlankAnswer,
		SingleChoiceAnswer,
		MultiChoiceAnswer,
		ChoiceWordAnswer,
		QuestionJoinAnswer,

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
		question: {
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
		...mapState('elearning/teaching/evaluation', {
			currentQuestion: 'currentExerciseQuestion',
			currentAnswer: 'currentExerciseAnswers'
		})
	},
	methods: {
		get
	}
}
</script>
<style lang="scss">
  @import "~/assets/scss/components/elearning/manager/_elearning-submission-modal.scss";
</style>
