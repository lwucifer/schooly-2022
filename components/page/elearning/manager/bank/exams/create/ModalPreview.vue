<template>
  <app-modal
    :width="750"
    :component-class="{ 'create-question preview': true }"
    :footer="false"
    title="Xem trước câu hỏi"
    @close="$emit('click-close')"
  >
    <div slot="content" class="content">
      <IconEye class="fill-primary icon-top" />
      <div>
        <!-- TYPE1 -->
        <div class="box" v-if="typeQuestion == 'YES_NO'">
          <div class="item">
            <p class="text">
              <span v-html="get(questions, 'manual.content', '')"></span>
            </p>
            <div class="radios">
              <app-radio
                name="answer"
                @change="answer = item.index"
                :value="item.index"
                v-for="(item, index) in get(questions, 'answers', [])"
                :key="index"
                :checked="item.selected"
              >
                <div class="d-flex pl-3">
                  <span class="pr-3 text-uppercase"
                    >{{ alphabet[index] }}.
                  </span>
                  <div
                    v-html="item.content"
                    style="white-space: pre-wrap"
                  ></div>
                </div>
              </app-radio>
            </div>
          </div>
          <div class="mt-3" v-if="get(questions, 'manual.note', false)">
            <i>{{ questions.manual.note }}</i>
          </div>
          <div class="buttons">
            <app-button @click="$emit('click-close')">Đóng</app-button>
          </div>
        </div>

        <!-- TYPE2  -->
        <div class="box" v-if="typeQuestion == 'SINGLE_CHOICE'">
          <div class="item">
            <p class="text">
              <span v-html="get(questions, 'manual.content', '')"></span>
            </p>
            <div class="radios">
              <app-radio
                name="answer"
                @change="answer = item.index"
                :value="item.index"
                v-for="(item, index) in get(questions, 'answers', [])"
                :key="index"
                :checked="item.selected"
                :disabled="true"
              >
                <div class="d-flex pl-3">
                  <span class="pr-3 text-uppercase"
                    >{{ alphabet[index] }}.
                  </span>
                  <div
                    v-html="item.content"
                    style="white-space: pre-wrap"
                  ></div>
                </div>
              </app-radio>
            </div>
          </div>
          <div class="mt-3" v-if="get(questions, 'manual.note', false)">
            <i>{{ questions.manual.note }}</i>
          </div>
          <div class="buttons">
            <app-button @click="$emit('click-close')">Đóng</app-button>
          </div>
        </div>

        <!-- TYPE3  -->
        <div class="box" v-if="typeQuestion == 'MULTIPLE_CHOICE'">
          <div class="item">
            <p class="text">
              <span v-html="get(questions, 'manual.content', '')"></span>
            </p>
            <div class="radios">
              <app-checkbox
                v-for="(item, index) in get(questions, 'answers', [])"
                :key="index"
                :disabled="true"
                :checked="item.selected"
              >
                <div class="d-flex pl-3">
                  <span class="pr-3 text-uppercase"
                    >{{ alphabet[index] }}.
                  </span>
                  <div
                    v-html="item.content"
                    style="white-space: pre-wrap"
                  ></div>
                </div>
              </app-checkbox>
            </div>
          </div>
          <div class="mt-3" v-if="get(questions, 'manual.note', false)">
            <i>{{ questions.manual.note }}</i>
          </div>
          <div class="buttons">
            <app-button @click="$emit('click-close')">Đóng</app-button>
          </div>
        </div>

        <!-- TYPE 4  -->
        <div class="box" v-if="typeQuestion == 'WORD_MATCH'">
          <div class="item">
            <p class="text">
              <span v-html="get(questions, 'manual.content', '')"></span>
            </p>
            <div
              class="row"
              v-for="(item, index) in get(questions, 'answers', [])"
              :key="index"
            >
              <div class="col-6">
                <div class="answer-content left">
                  <div>
                    <div class="image" v-if="item.image">
                      <img :src="item.image" alt="" />
                    </div>
                    <span class="pr-3">{{ index + 1 }}. </span>
                    <div v-html="item.content"></div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="answer-content right">
                  <div>
                    <div class="image" v-if="item.image">
                      <img :src="item.image" alt="" />
                    </div>
                    <span class="pr-3 text-uppercase"
                      >{{ alphabet[index] }}.
                    </span>
                    <span v-html="item.matching.content"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3" v-if="get(questions, 'manual.note', false)">
            <i>{{ questions.manual.note }}</i>
          </div>
          <div class="buttons">
            <app-button @click="$emit('click-close')">Đóng</app-button>
          </div>
        </div>

        <!-- TYPE 5  -->
        <div class="box" v-if="typeQuestion == 'FILL_IN_BLANK'">
          <div class="item">
            <p class="text">
              <span>Điền từ thích hợp vào chỗ trống của câu bên dưới</span>
            </p>
            <div>
              <span 
                v-for="(item, index) in contentInputBlank.text"
                :key="index"
              >
                <span v-html="item"></span>
                <app-input
                  class="mx-2 mb-2 d-inline-block"
                  size="sm"
                  v-if="index < contentInputBlank.answers.length"
                />
              </span>
            </div>
          </div>
          <div class="mt-3" v-if="get(questions, 'manual.note', false)">
            <i>{{ questions.manual.note }}</i>
          </div>
          <div class="buttons">
            <app-button @click="$emit('click-close')">Đóng</app-button>
          </div>
        </div>

        <!-- TYPE 6  -->
        <div class="box" v-if="typeQuestion == 'WORD_CHOICE'">
          <div class="item">
            <p class="text">
              <span>Chọn từ thích hợp cho chỗ trống của câu bên dưới</span>
            </p>
            <div style="display: flex; flex-flow: wrap row;">
              <span
                v-for="(item, index) in contentInputBlank.text"
                :key="index"
              >
                <span v-html="item"></span>
                <app-input
                  class="mx-2 mb-2 d-inline-block"
                  size="sm"
                  v-if="index < contentInputBlank.answers.length"
                />
              </span>
            </div>
            <div class="mt-5 d-flex">
              <div
                v-for="(answers, index) in contentInputBlank.answers"
                :key="index"
                class="mr-4"
              >
                <app-button
                  normal
                  color="white"
                  class="color-666 mr-3 mb-3"
                  v-for="(item, i) in answers"
                  :key="i"
                >
                  {{ item }}
                </app-button>
              </div>
            </div>
          </div>
          <div class="mt-3" v-if="get(questions, 'manual.note', false)">
            <i>{{ questions.manual.note }}</i>
          </div>
          <div class="buttons">
            <app-button @click="$emit('click-close')">Đóng</app-button>
          </div>
        </div>

        <!-- TYPE 7  -->
        <div class="box" v-if="typeQuestion == 'ESSAY'">
          <div class="item">
            <p class="text">
              <span v-html="get(questions, 'manual.content', '')"></span>
            </p>
            <app-input
              textarea
              placeholder="Nhập câu trả lời tự luận..."
              class="mb-0"
            />
          </div>
          <div class="mt-3" v-if="get(questions, 'manual.note', false)">
            <i>{{ questions.manual.note }}</i>
          </div>
          <div class="buttons">
            <app-button @click="$emit('click-close')">Đóng</app-button>
          </div>
        </div>
      </div>
    </div>
  </app-modal>
</template>

<script>
import { get } from "lodash";
import IconEye from "~/assets/svg/v2-icons/remove_red_eye_24px.svg?inline";
import { TEACHING_CHART_STATISTIC_HIGHLIGHT_ELS } from "~/utils/action-types";

export default {
  components: { IconEye },
  props: {
    visible: Boolean,
    typeQuestion: {
      type: [Number, String],
      default: "",
    },
    questions: {
      type: [Array, Object],
      default: {},
      required: false,
    },
  },

  data() {
    return {
      alphabet: [..."abcdefghijklmnopqrstuvwxyz"],
    };
  },

  computed: {
    contentInputBlank () {
      return this.stringToArray(get({...this.questions}, 'manual.content', ''));
    }},

  methods: {
    get,

    stringToArray(text) {
      let str = text.replace("<p>", "").replace("</p>", "");

      let arrText = [];
      let arrAnswer = [];

      let arrOpen = this.characterIndexs("[", str);
      let arrClose = this.characterIndexs("]", str);

      arrText.push(str.substring(0, arrOpen[0]));

      for (let i = 0; i < arrOpen.length; i++) {
        let answer = str.substring(arrOpen[i] + 1, arrClose[i]);
        arrAnswer.push(answer.split("|"));

        if (i < arrOpen.length - 1) {
          let start = arrClose[i] + 1;
          let end = arrOpen[i + 1];
          let text = str.substring(start, end);
          arrText.push(text);
        }
      }

      arrText.push(
        str.substring(arrClose[arrClose.length - 1] + 1, str.length + 1)
      );

      const result = {
        text: arrText,
        answers: arrAnswer,
      };

      return result;
    },

    characterIndexs(char, str) {
      var indices = [];
      for (var i = 0; i < str.length; i++) {
        if (str[i] === char) indices.push(i);
      }

      return indices;
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/bank/_create-question-modal.scss";
</style>
