<template>
    <label class="app-switch">
        <input type="checkbox" 
            v-bind="$attrs" 
            :checked="checked" 
            @change="handleChange"
            :value="value"
            :disabled="disabled"
            />
        <span class="app-slider"></span>
    </label>
</template>

<script>
export default {
    model: {
        prop: 'checked',
        event: 'change'
    },

    props: {
        checked: {
            default: false
            },
        value: {
            type: String,
            default: ""
        },
        disabled:{
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleChange(e) {
        this.$emit("change", {check:e.target.checked,value:this.value});
        }
    }
}
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-toggle-switch.scss";
</style>