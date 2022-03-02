<template>
  <div class="row mb-6 justify-content-between">
    <div class="col-md-3 d-flex align-items-center">
      <!-- <label class="d-inline-block mb-3 font-weight-bold" for="answer-a">Chọn đáp án đúng</label> -->
      <div>
        <app-radio
          @click="$emit('handleSelectAnswerTrue', index)"
          :name="id"
          :checked="get(answer, 'correct', false)"
          >{{ text }}</app-radio
        >
      </div>
    </div>

    <div class="col-md-8">
      <!-- <label class="d-inline-block mb-3" for="answer-editor"
        >Nội dung đáp án</label
      > -->
      <div class="d-flex align-items-start">
        <div class="flex-grow mr-4">
          <!-- <app-editor id="answer-editor" /> -->
          <app-input
            class="mb-0"
            @input="handleChangeContent"
            :value="get(answer, 'content', '')"
            @click="handleAddAnswer"
          />
        </div>

        <!-- <div>
          <button>
            <IconTrashAlt class="icon d-block subheading fill-secondary" />
          </button>
        </div> -->
      </div>
    </div>
    <div class="d-flex align-items-center pr-3">
      <button class="cc-box__btn cc-box__btn-edit" @click="handleDeleteAnswer">
        <IconTrashAlt class="d-block subheading fill-secondary" width="20px" height="20px"/>
      </button>
    </div>
  </div>
</template>

<script>
import IconTrashAlt from "~/assets/svg/design-icons/trash-alt.svg?inline";
import { get } from "lodash";

export default {
  components: {
    IconTrashAlt
  },

  props: {
    answer: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: 0
    },
    id:{
      type: String,
      default: null
    }
  },

  mounted() {
    console.log(this.answer)
  },

  computed: {
    text() {
      if (get(this, "index", "") === 0) return "A";
      if (get(this, "index", "") === 1) return "B";
      if (get(this, "index", "") === 2) return "C";
      if (get(this, "index", "") === 3) return "D";
      if (get(this, "index", "") === 4) return "E";
      if (get(this, "index", "") === 5) return "F";
      return "";
    }
  },

  methods: {
    get,

    handleChangeContent(value) {
      this.$emit("handleChangeContent", this.index, value);
    },
    handleAddAnswer() {
      this.$emit("handleAddAnswer", this.index + 1);
    },
    handleDeleteAnswer() {
      this.$emit("handleDeleteAnswer", this.index);
    }
  }
};
</script>
