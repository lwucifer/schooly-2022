<template>
    <div class="wrap-form-credit_payment row">
        <div class="col-md-6 mt-2">
            <app-radio-group>
                <app-radio class="d-flex align-items-center">
                    <div class="d-flex align-items-center">
                        <img src="~assets/images/payment/visa 2.png">
                        <span class="ml-2">4 chữ số cuối là <strong>2297</strong></span>
                    </div>
                </app-radio>
                <app-radio class="d-flex align-items-center">
                    <div class="d-flex align-items-center">
                        <span class="ml-2">Nhập số thẻ mới</span>
                        <img src="~assets/images/payment/visa 2.png">
                        <img src="~assets/images/payment/1200px-MasterCard_Logo 1.png" class="mx-2">
                        <img src="~assets/images/payment/JCB_logo 1.png">
                    </div>
                </app-radio>
            </app-radio-group>
            <app-input label="Số thẻ" class="mb-0"/>
            <app-input label="Tên in trên thẻ" placeholder="VD Nguyễn Văn A"/>
        </div>
        <div class="col-md-6 mb-5">
            <div class="intro-credit-card">
                <img src="~assets/images/payment/image 10.png">
                <div class="note-number-series">
                    <div class="arrow-note-number-series">
                    </div>
                    <span class="ml-2">Số thẻ</span>
                </div>
                <div class="d-flex">
                    <div class="note-name-card">
                        <div class="arrow-note-name-card"></div>
                        <span>Tên thẻ</span>
                    </div>
                    <div class="note-date">
                        <div class="arrow-note-name-card"></div>
                        <span>Ngày hết hạn</span>
                    </div>
                </div>
            </div>

        </div>
        <div class="d-flex align-items-center col-md-7">
            <app-input label="Ngày hết hạn" class="col-md-4 p-0" />
            <app-input label="Mã bảo mật" class="ml-4 col-md-4" />
            <img src="~assets/images/payment/image 11.png" width="104" height="62">
        </div>
        <app-checkbox label="Lưu và bảo mật thẻ cho lần thanh toán sau" class="col-md-12"/>
        <p class="note_payment-credit">Tiki không trực tiếp lưu thẻ của bạn. Để đảm bảo an toàn, thông tin thẻ của bạn chỉ được lưu bởi CyberSource, công ty quản lý thanh toán lớn nhất thế giới (thuộc tổ chức VISA)</p>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.wrap-form-credit_payment{
    border: 1px solid #EEEEEE;
    box-sizing: border-box;
    padding:0px;
    margin-left: 20px;
    margin-right: 5px;

    .intro-credit-card{
        margin-top: 20px;
        width: 294px;
        height: 185px;
        position: relative;
    }
    .note_payment-credit{
        font-style: italic;
        color: #999999;
        padding-top: 10px;
        margin-left: 10px;
        margin-bottom: 20px;
    }
    .note-number-series{
        color: #E9446A;
        display: flex;
        align-items: center;
        position: absolute;
        top: 80px;
        right: -50px;
    }
    .arrow-note-number-series{
        border-bottom: 2px solid #E9446A;
        width: 30px;
        &::before{
            content: '';
            position: relative;
            display:block;
            width:4px;
            height: 4px;
            border-radius: 100%;
            background: #E9446A;
            left: -3px;
            top: 3px;
            
        }
    }
    .arrow-note-name-card{
        border-left: 2px solid #E9446A;
        width: 3px;
        height: 40px;
        &::before{
            content: '';
            position: relative;
            display:block;
            width:4px;
            height: 4px;
            border-radius: 100%;
            background: #E9446A;
            top: -4px;
            left: -3px;
            
        }
    }
    .note-name-card{
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #E9446A;
        bottom: -35px;
        left: 40px;
    }
    .note-date{
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #E9446A;
        bottom: -35px;
        right: 8px;
    }
}
</style>