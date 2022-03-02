<template>
  <div class="item-atm-form_payment">
        <input type="radio" :id="bank.id" name="selector">
        <label :for="bank.id">
            <img :src="bank.avatar">
        </label>
        <div class="check">
            <IconSuccess  class="icon subheading"/>
        </div>
    </div>
</template>

<script>
import IconSuccess from '~/assets/svg/icons/sucess-green.svg?inline';
export default {
    components:{
        IconSuccess
    },
    props:{
        bank:{
            type: Object,
            default: () => {}
        }
    }
}
</script>

<style lang="scss">
.item-atm-form_payment{
    position: relative;
    margin: 10px;
    width: 15%;
    height: 54px;
    input[type=radio]{
            position: absolute;
            visibility: hidden;
    }
    label{
        cursor: pointer;
        display: block;
        border: 1px dashed #EEEEEE;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 54px;
        img{
            height: 31px;
        }
    }
    .check{
        position: absolute;
        display: block;
        top: -4px;
        right: -4px;
        visibility: hidden;
    }
    input[type=radio]:checked ~ label {
        border: 1px solid #32AF85;

    }
    input[type=radio]:checked ~ .check {
        visibility:visible;
    }

}
</style>