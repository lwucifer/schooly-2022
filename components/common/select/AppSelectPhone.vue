<template>
    <app-select v-model="areaCode" :options="areaCodes"/>
</template>

<script>
    export default {
        components: {
        },

        data() {
            return {
                areaCodes: [
                    {value: '+84', text:'+84'},
                    {value: '+83', text:'+83'},
                    {value: '+82', text:'+82'},
                ],
                areaCode: '+84',
            };
        },

        props: {
            code: [String, Number],
        },

        watch: {
            areaCode() {
                this.$emit("input", this.areaCode);
            }
        },

        created() {
            this.areaCode = this.code;
        }
    };
</script>