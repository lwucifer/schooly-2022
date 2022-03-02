<template>
  <div>
    <SocailSearchFriend />
    <SocialSearchPost class="mt-4" />
  </div>
</template>

<script>
import SocailSearchFriend from "~/components/page/social/search/SocialSearchFriend";
import SocialSearchPost from "~/components/page/social/search/SocialSearchPost";
import { mapState, mapMutations, mapActions } from "vuex";
import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import { redirectWithParams } from "~/utils/common";

export default {
  components: {
    SocailSearchFriend,
    SocialSearchPost,
  },

  async fetch({ params, query, store }) {
    const textSearch = query.q;
    textSearch && await Promise.all([
      store.commit(
        `keyword/${mutationTypes.KEYWORD.SEARCH_HEADER}`,
        textSearch
      )
    ]);

    const queryUser = {
      fetch_type: "search",
      q: textSearch,
      fetch_size: 10,
    };

    const queryPost = {
        fetch_type: "search",
        q: textSearch,
        fetch_size: 2,
      };

    // await Promise.all([
    //   store.dispatch(
    //     `social/searching/${actionTypes.SOCIAL_SEARCH.SEARCH_USER_SOCIAL_LIST}`,
    //     queryUser
    //   ),

    //   store.dispatch(
    //     `social/searching/${actionTypes.SOCIAL_SEARCH.SEARCH_POST_SOCIAL_LIST}`,
    //     queryPost
    //   )
    // ]);

  },

  async created() {
    await this.getListUserSearchSocial();
    await this.getListPostSearchSocial();
  },

  computed: {
    ...mapState("keyword", ["keywordSearchHeader"]),
  },

  methods: {
    ...mapMutations("keyword", ["searchHeader"]),
    ...mapActions("social/searching", [
      "searchUserSocialList",
      "searchPostSocialList",
    ]),
    getListUserSearchSocial() {
      const keyword = this.keywordSearchHeader || '';
      const data = {
        fetch_type: "search",
        q: keyword,
        fetch_size: 10,
      };
      keyword && this.searchUserSocialList(data);
    },

    getListPostSearchSocial() {
      const data = {
        fetch_type: "search",
        q: this.keywordSearchHeader,
        fetch_size: 2,
      };
      this.searchPostSocialList(data);
    },
  },

  watch: {
    async keywordSearchHeader(_newVal) {
      console.log("keywordSearchHeader social search", _newVal);
      redirectWithParams({q: _newVal});
      await this.getListUserSearchSocial();
      await this.getListPostSearchSocial();
    },
  },

  beforeDestroy() {
    this.searchHeader();
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/social/account/_account-friend-item.scss";
</style>
