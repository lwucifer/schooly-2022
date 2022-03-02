<template>
  <div class="">
    <div class="sbdt__question-content">
      <div v-html="get(this, 'question.parsed_content', '')"></div>
    </div>

    <div class="sbdt__answer-content sbdt__answer-content--essay">
      <div v-if="get(this, 'content.submissions[0].answer', '')" v-html="get(this, 'content.submissions[0].answer', '')"></div>
			<div v-else class="text-center caption text-gray-2">Nội dung câu trả lời</div>
    </div>
  </div>
</template>

<script>
import { get } from "lodash";

export default {
	components: {
		
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
			
		}
	},
	computed: {
	},
	methods: {
		get
	}
}
</script>
<style lang="scss">
</style>
