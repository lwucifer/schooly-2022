<template>
  <div class="es-scorm-mode">
    <iframe class="es-scorm-mode__iframe" :src="scormItemActive"></iframe>

    <nav
      class="es-scorm-mode__menu"
      :class="{ show: showMenu }"
      v-if="scormItems.length > 1"
    >
      <h3 class="es-scorm-mode__heading" @click="showMenu = !showMenu">
        <button class="es-scorm-mode__button">
          <IconViewAgenda class="icon fill-opacity-1" />
        </button>
        <span class="es-scorm-mode__title">Danh mục</span>
      </h3>

      <ul class="es-scorm-mode__menu-list">
        <li v-for="(item, index) in scormItems" :key="index">
          <a
            @click="handleClickScorm(item, index)"
            :class="{ active: index == activeIndex }"
            >Bài học {{ index + 1 }}</a
          >
        </li>
        <!-- <li><a href="" class="active">Tên bài học 2</a></li>
        <li><a href="">Tên bài học 3</a></li>
        <li><a href="">Tên bài học 4</a></li> -->
      </ul>
    </nav>
  </div>
</template>

<script>
import IconViewAgenda from "~/assets/svg/v2-icons/view_agenda_24px.svg?inline";
import { mapState, mapMutations } from "vuex";
import { ELEARNING_STUDY as ELEARNING_STUDY_MUTATION } from "~/utils/mutation-types";

export default {
  components: {
    IconViewAgenda
  },

  data() {
    return {
      showMenu: false,
      // activeLink: "",
      activeIndex: ""
    };
  },

  computed: {
    ...mapState("elearning/study/study", ["scormItems", "scormItemActive"])
  },

  methods: {
    ...mapMutations("elearning/study/study", [
      "setElearningStudyScormItemActive",
      "setElearningStudyExpand"
    ]),

    handleClickScorm(_link, _idx) {
      console.log("[handleClickScorm]", _link, _idx);
      this.setElearningStudyScormItemActive(_link);
      this.activeIndex = _idx;

      // expand if scorm lesson
      this.setElearningStudyExpand(true);
    }
  },

  watch: {
    scormItems(_newVal) {
      console.log("[scormItems] watch", _newVal);
      if (_newVal && _newVal.length > 0) {
        // this.activeLink = this.scormItems[0];
        this.setElearningStudyScormItemActive(this.scormItems[0]);
        // expand if scorm lesson
        this.setElearningStudyExpand(true);
      }
    }
  },

};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/_scorm-mode.scss";
</style>
