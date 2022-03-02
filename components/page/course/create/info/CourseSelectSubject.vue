<template>
  <div class="cgi-form-group d-flex justify-content-start align-items-center">
    <h2 class="cgi-form-title heading-6 mr-4">Môn học</h2>
    <app-select
      class="cc-select"
      style="width: 60%"
      :options="subjectsOpt"
      placeholder="Chọn môn học"
      @change="handleChangeSubject"
      label="name"
      :value="subject"
    >
      <template slot="placeholder-icon">
        <IconAngleDown class="icon" />
      </template>
    </app-select>
  </div>
</template>

<script>
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
import { get, merge } from "lodash";
import * as actionTypes from "~/utils/action-types";
import { mapState } from "vuex";
import { useEffect } from "~/utils/common";

export default {
  components: {
    IconAngleDown,
  },

  async mounted() {
    useEffect(this, this.handleChangeSubjects.bind(this), [
      "subjects",
      "defaultValue",
    ]);
    // const params = {
    //   school_id: get(this, "userLogin.organization.id", ""),
    // };
    // this.$store.dispatch(`elearning/create/getSubjects`, params);
  },

  props: {
    defaultValue: "",
  },

  data() {
    return {
      subject: "",
    };
  },

  watch: {
    defaultValue: {
      handler: function() {
        this.subject = this.defaultValue;
        // this.subjects.map((subject) => {
        //   this.subject = "";
        //   if (+subject.id === +this.defaultValue) {
        //     this.subject = subject.id;
        //   }
        // });
      },
      deep: true,
    },
  },

  computed: {
    ...mapState("elearning/create", {
      subjects: "subjects",
    }),

    subjectsOpt() {
      console.log(this.defaultValue)
      let init = [
        {
          value: "",
          id: "",
          name: "Môn học",
        },
      ];
      let data = this.subjects.map((item) => ({
        ...item,
        value: item.id,
        text: item.name,
      }));
      console.log(init.concat(data));
      return init.concat(data);
    },
  },

  methods: {
    handleChangeSubjects() {
      const subject = this.subjects.filter(
        (subject) => subject.id == this.defaultValue
      )[0];
      this.subject = get(subject, "id", "");
    },
    get,
    handleChangeSubject(subject) {
      this.$emit("handleChangeSubject", subject);
    },
  },
};
</script>
