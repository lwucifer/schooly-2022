<template>
  <div class="wrap-atm-form_payment">
    <PaymentATMItem v-for="bank in listBanks" :key="bank.id"
                    :bank="bank"
    />
  </div>
</template>

<script>
import PaymentATMItem from "~/components/page/payment/PaymentATMItem";

export default {
    components:{
        PaymentATMItem
    },
    data(){
        return{
            listBanks:[
                {
                    id:1,
                    avatar:"~assets/images/payment/image 14.png"
                },
                {
                    id:2,
                    avatar:"~assets/images/payment/image 14.png.png"
                },
                {}
            ]
        }
    }
}
</script>

<style lang="scss">
.wrap-atm-form_payment{
    box-sizing: border-box;
    border: 1px solid #EEEEEE;
    margin-left: 20px;
    margin-top: 15px;
    display: flex;
    justify-content: flex-start;
}
</style>