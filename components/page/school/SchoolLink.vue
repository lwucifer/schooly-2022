<template>
    <div class="school-link">
       <div class="school-link__title">Liên kết Website</div>

       <div class="school-link__line"></div>

       <div class="school-link__content" v-if="get(this,'linkWebsList.content.length',0)">
           <a 
            v-for="(item,index) in get(this,'linkWebsList.content',[])"
            :key="index"
            :href="item.link"
            target='_blank'
           >
               <img :src="get(item,'logo','~assets/images/tmp/connect-1.png')" :alt="item.name">
            </a>
       </div>
       <div v-else>
           Chưa có thông tin
       </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
export default {
    computed:{
        ...mapState("elearning/school/school-linkwebs",{ linkWebsList : "schoolLinkWebs"})
    },
    methods:{
        async fetchLinkWebsList(){
            const data = { organization_id : this.$route.params.id};
            await this.$store.dispatch(
            `elearning/school/school-linkwebs/${actionTypes.SCHOOL_LINK_WEBSITE.LIST}`,
                data
            );
            console.log('linkwebs')
        },
        get
    },
    created(){
        this.fetchLinkWebsList();
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/school/_school-link.scss";
</style>